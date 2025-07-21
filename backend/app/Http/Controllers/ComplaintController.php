<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:2000',
            'role_id' => ['required', 'integer', Rule::exists('roles', 'id')],
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120', // 5MB max
        ]);

        $lastComplaint = Complaint::latest('complaint_number')->first();
        $nextComplaintNumber = $lastComplaint ? (int)$lastComplaint->complaint_number + 1 : 600000;

        $complaint = Complaint::create([
            'user_id' => Auth::id(),
            'role_id' => $request->role_id,
            'complaint_number' => (string)$nextComplaintNumber,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('complaints', 'public');
                ComplaintImage::create([
                    'complaint_id' => $complaint->id,
                    'image_url' => $path,
                ]);
            }
        }

        return response()->json([
            'message' => 'Complaint submitted successfully.',
            'complaint' => $complaint->load(['user', 'role', 'images'])
        ], 201);
    }

    public function list(Request $request)
    {
        // Ensure only allowed roles can access all complaints
        if (!in_array(Auth::user()->role->name, ['admin', 'hr', 'devops'])) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        $query = Complaint::query();

        // Filters for status and role_id
        if ($request->has('resolution_status')) {
            $query->where('resolution_status', $request->resolution_status);
        }

        if ($request->has('role_id')) {
            $query->whereHas('role', function ($q) use ($request) {
                $q->where('id', $request->role_id);
            });
        }

        // Search by complaint_number or title
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('complaint_number', 'like', "%$search%")
                  ->orWhere('title', 'like', "%$search%");
            });
        }

        // Sorting
        if ($request->has('sort_by') && $request->has('sort_order')) {
            $query->orderBy($request->sort_by, $request->sort_order);
        } else {
            $query->orderByDesc('created_at'); // Default sort by latest
        }

        $complaints = $query->with(['user', 'role', 'resolvedBy', 'images'])->paginate(10);

        return response()->json($complaints);
    }

    public function show(Complaint $complaint)
    {
        // Ensure only allowed roles or the complaint owner can view
        $user = Auth::user();
        if (!in_array($user->role->name, ['admin', 'hr', 'devops']) && $user->id !== $complaint->user_id) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        return response()->json($complaint->load(['user', 'role', 'resolvedBy', 'images']));
    }

    public function updateStatus(Request $request, Complaint $complaint)
    {
        // Only Admin, HR, DevOps can update status
        if (!in_array(Auth::user()->role->name, ['admin', 'hr', 'devops'])) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        $request->validate([
            'resolution_status' => ['required', Rule::in(['Pending', 'Resolved', 'Unresolved', 'Rejected'])],
        ]);

        $updateData = [
            'resolution_status' => $request->resolution_status,
        ];

        // Handle resolved_by and resolved_at for 'Resolved' or 'Rejected' status
        if ($request->resolution_status === 'Resolved' || $request->resolution_status === 'Rejected') {
            $updateData['resolved_by'] = Auth::id();
            $updateData['resolved_at'] = now();
        } else {
            // If status changes from Resolved/Rejected to something else, clear resolved_by/at
            if ($complaint->resolution_status === 'Resolved' || $complaint->resolution_status === 'Rejected') {
                $updateData['resolved_by'] = null;
                $updateData['resolved_at'] = null;
            }
        }

        $complaint->update($updateData);

        return response()->json([
            'message' => 'Complaint status updated successfully.',
            'complaint' => $complaint->load(['user', 'role', 'resolvedBy', 'images'])
        ]);
    }
} 