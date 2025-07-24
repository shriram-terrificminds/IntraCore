<?php

namespace App\Http\Controllers;

use App\Enums\ComplaintStatusEnum;
use App\Enums\RoleEnum;
use App\Models\Complaint;
use App\Models\ComplaintImage;
use App\Models\Role;
use Berkayk\OneSignal\OneSignalFacade as OneSignal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:2000',
            'role_id' =>  ['required', 'integer', Rule::in(Role::whereIn('name', [RoleEnum::HR->value, RoleEnum::DEVOPS->value])->pluck('id')->toArray())],
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
            'resolution_status' => ComplaintStatusEnum::PENDING->value,
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
        // Notify all users of the assigned role
        $roleUsers = \App\Models\User::where('role_id', $complaint->role_id)->get();
        foreach ($roleUsers as $roleUser) {
            $roleUser->notify(new \App\Notifications\RoleComplaintOrRequestRaised(
                'complaint',
                $complaint->title,
                Auth::user()->first_name . ' ' . Auth::user()->last_name,
                $roleUser->role->name
            ));
            // Send OneSignal push notification if player_id exists
            if ($roleUser->player_id) {
                OneSignal::sendNotificationToUser(
                    'A new complaint has been assigned to your role: ' . $roleUser->role->name,
                    $roleUser->player_id
                );
            }
        }

        return response()->json([
            'message' => 'Complaint submitted successfully.',
            'complaint' => $complaint->load(['user', 'role', 'images'])
        ], 201);
    }

    /**
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function list(Request $request)
    {
        $user = Auth::user();
        $userRoleName = $user->role->name;

        $query = Complaint::query();

        // Role-based access control
        if ($userRoleName === RoleEnum::EMPLOYEE->value) {
            $query->where('user_id', $user->id);
        } elseif (in_array($userRoleName, [RoleEnum::HR->value, RoleEnum::DEVOPS->value])) {
            $query->where(function ($q) use ($user) {
                $q->where('role_id', $user->role_id)
                  ->orWhere('user_id', $user->id);
            });
        } // Admin can see all

        // Filter by status
        if ($request->filled('resolution_status') && $request->resolution_status !== 'all') {
            $query->where('resolution_status', $request->resolution_status);
        }

        // Filter by role (by name, case-insensitive)
        if ($request->filled('role') && $request->role !== 'all') {
            $roleName = $request->role;
            $query->whereHas('role', function ($q) use ($roleName) {
                $q->whereRaw('LOWER(name) = ?', [strtolower($roleName)]);
            });
        }

        // Search by complaint_number or title
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('complaint_number', 'like', "%$search%")
                  ->orWhere('title', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        // Sorting
        if ($request->filled('sort_by') && $request->filled('sort_order')) {
            $query->orderBy($request->sort_by, $request->sort_order);
        }

        // Pagination
        $perPage = 10;
        $page = $request->input('page', 1);
        $complaints = $query->with(['user', 'role', 'resolvedBy', 'images'])->paginate($perPage, ['*'], 'page', $page);

        return response()->json($complaints);
    }

    public function show(Complaint $complaint)
    {
        // Ensure only allowed roles or the complaint owner can view
        $user = Auth::user();
        if (!in_array($user->role->name, [RoleEnum::ADMIN->value, RoleEnum::HR->value, RoleEnum::DEVOPS->value]) && $user->id !== $complaint->user_id) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        return response()->json($complaint->load(['user', 'role', 'resolvedBy', 'images']));
    }

    /**
     * @
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     * @SuppressWarnings(PHPMD.ElseExpression)
     */
    public function updateStatus(Request $request, Complaint $complaint)
    {
        $user = Auth::user();
        $userRoleName = $user->role->name;

        // Only Admin, HR, DevOps can update status in general
        if (!in_array($userRoleName, [RoleEnum::ADMIN->value, RoleEnum::HR->value, RoleEnum::DEVOPS->value])) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        // HR/DevOps specific rule: Cannot update status of complaints they created
        if (in_array($userRoleName, [RoleEnum::HR->value, RoleEnum::DEVOPS->value]) && $complaint->user_id === $user->id) {
            return response()->json(['message' => 'You cannot update the status of complaints you have created.'], 403);
        }

        $request->validate([
            'resolution_status' => ['required', Rule::in([
                ComplaintStatusEnum::PENDING->value,
                ComplaintStatusEnum::IN_PROGRESS->value,
                ComplaintStatusEnum::RESOLVED->value,
                ComplaintStatusEnum::REJECTED->value
            ])],
        ]);

        $currentStatus = $complaint->resolution_status->value;
        $newStatus = $request->resolution_status;

        // Enforce status transition rules
        if ($currentStatus === ComplaintStatusEnum::PENDING->value) {
            if ($newStatus !== ComplaintStatusEnum::IN_PROGRESS->value) {
                return response()->json(['message' => 'Pending complaints can only be moved to In-progress.'], 400);
            }
        } elseif ($currentStatus === ComplaintStatusEnum::IN_PROGRESS->value) {
            if (!in_array($newStatus, [ComplaintStatusEnum::RESOLVED->value, ComplaintStatusEnum::REJECTED->value])) {
                return response()->json(['message' => 'In-progress complaints can only be moved to Resolved or Rejected.'], 400);
            }
        } else {
            // If the complaint is already in a final state, prevent further updates
            if (in_array($currentStatus, [ComplaintStatusEnum::RESOLVED->value, ComplaintStatusEnum::REJECTED->value])) {
                return response()->json(['message' => 'Cannot update status for a ' . $currentStatus . ' complaint.'], 400);
            }
            // Add a generic error for any other unexpected status transition
            return response()->json(['message' => 'Invalid status transition.'], 400);
        }

        $updateData = [
            'resolution_status' => $newStatus,
        ];

        // Handle resolved_by and resolved_at for 'Resolved' or 'Rejected' status
        if ($newStatus === ComplaintStatusEnum::RESOLVED->value || $newStatus === ComplaintStatusEnum::REJECTED->value) {
            $updateData['resolved_by'] = Auth::id();
            $updateData['resolved_at'] = now();
        } else {
            // If status changes from Resolved/Rejected to something else, clear resolved_by/at
            if (in_array($currentStatus, [ComplaintStatusEnum::RESOLVED->value, ComplaintStatusEnum::REJECTED->value]) && !in_array($newStatus, [ComplaintStatusEnum::PENDING->value, ComplaintStatusEnum::IN_PROGRESS->value])) {
                $updateData['resolved_by'] = null;
                $updateData['resolved_at'] = null;
            }
        }

        $complaint->update($updateData);

        // Notify complaint creator about status update
        $complaintCreator = $complaint->user;
        $complaintCreator->notify(new \App\Notifications\StatusUpdatedNotification(
            'complaint',
            $complaint->title,
            $newStatus,
            Auth::user()->first_name . ' ' . Auth::user()->last_name
        ));
        // Send OneSignal push notification if player_id exists
        if ($complaintCreator->player_id) {
            OneSignal::sendNotificationToUser(
                'The status of your complaint has been updated to: ' . $newStatus,
                $complaintCreator->player_id
            );
        }
        return response()->json([
            'message' => 'Complaint status updated successfully.',
            'complaint' => $complaint->load(['user', 'role', 'resolvedBy', 'images'])
        ]);
    }
}
