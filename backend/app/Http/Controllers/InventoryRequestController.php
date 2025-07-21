<?php

namespace App\Http\Controllers;

use App\Models\InventoryRequest;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class InventoryRequestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:2000',
            'role_id' => ['required', 'integer', Rule::in(Role::whereIn('name', ['HR', 'Devops'])->pluck('id')->toArray())],
        ]);

        $lastRequest = InventoryRequest::latest('request_number')->first();
        $nextRequestNumber = $lastRequest ? (int)$lastRequest->request_number + 1 : 300000;

        $inventoryRequest = InventoryRequest::create([
            'user_id' => Auth::id(),
            'role_id' => $request->role_id,
            'request_number' => (string)$nextRequestNumber,
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Inventory request submitted successfully.',
            'request' => $inventoryRequest
        ], 201);
    }

    public function list(Request $request)
    {
        // Ensure only allowed roles can access all requests
        if (!in_array(Auth::user()->role->name, ['Admin', 'Hr', 'Devops'])) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        $query = InventoryRequest::query();

        // Filters for status and role_id
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('role_id')) {
            $query->whereHas('role', function ($q) use ($request) {
                $q->where('id', $request->role_id);
            });
        }

        // Search by request_number or title
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('request_number', 'like', "%$search%")
                  ->orWhere('title', 'like', "%$search%");
            });
        }

        // Sorting
        if ($request->has('sort_by') && $request->has('sort_order')) {
            $query->orderBy($request->sort_by, $request->sort_order);
        } else {
            $query->orderByDesc('created_at'); // Default sort by latest
        }

        $requests = $query->with(['approvedBy'])->paginate(10);

        return response()->json($requests);
    }

    public function show(InventoryRequest $inventoryRequest)
    {
        // Ensure only allowed roles or the request owner can view
        $user = Auth::user();
        if (!in_array($user->role->name, ['admin', 'hr', 'devops']) && $user->id !== $inventoryRequest->user_id) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        return response()->json($inventoryRequest->load(['user', 'role', 'approvedBy']));
    }

    public function updateStatus(Request $request, InventoryRequest $inventoryRequest)
    {
        // Only Admin, HR, DevOps can update status
        if (!in_array(Auth::user()->role->name, ['admin', 'hr', 'devops'])) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        $request->validate([
            'status' => ['required', Rule::in(['Approved', 'Shipped', 'Recieved', 'Pending'])],
        ]);

        $updateData = [
            'status' => $request->status,
        ];

        // Handle approved_by and approved_at for 'Approved' status
        if ($request->status === 'Approved') {
            $updateData['approved_by'] = Auth::id();
            $updateData['approved_at'] = now();
        } else {
            // If status changes from Approved to something else, clear approved_by/at
            if ($inventoryRequest->status === 'Approved') {
                $updateData['approved_by'] = null;
                $updateData['approved_at'] = null;
            }
        }

        $inventoryRequest->update($updateData);

        return response()->json([
            'message' => 'Inventory request status updated successfully.',
            'request' => $inventoryRequest->load(['user', 'role', 'approvedBy'])
        ]);
    }
} 