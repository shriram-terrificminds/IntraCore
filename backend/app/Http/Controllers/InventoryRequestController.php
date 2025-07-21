<?php

namespace App\Http\Controllers;

use App\Enums\InventoryRequestStatusEnum;
use App\Enums\RoleEnum;
use App\Models\InventoryRequest;
use App\Models\Role;
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
            'role_id' => ['required', 'integer', Rule::in(Role::whereIn('name', [RoleEnum::HR->value, RoleEnum::DEVOPS->value])->pluck('id')->toArray())],
        ]);

        $lastRequest = InventoryRequest::latest('request_number')->first();
        $nextRequestNumber = $lastRequest ? (int)$lastRequest->request_number + 1 : 300000;

        $inventoryRequest = InventoryRequest::create([
            'user_id' => Auth::id(),
            'role_id' => $request->role_id,
            'request_number' => (string)$nextRequestNumber,
            'title' => $request->title,
            'description' => $request->description,
            'status' => InventoryRequestStatusEnum::PENDING->value,
        ]);

        return response()->json([
            'message' => 'Inventory request submitted successfully.',
            'request' => $inventoryRequest
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

        $query = InventoryRequest::query();
        $query->orderBy('created_at', desc);

        // Role-based access control
        if ($userRoleName === RoleEnum::EMPLOYEE->value) {
            $query->where('user_id', $user->id);
        } elseif (in_array($userRoleName, [RoleEnum::HR->value, RoleEnum::DEVOPS->value])) {
            // HR and Devops can only see requests for their respective roles OR requests they have created
            $query->where(function ($q) use ($user) {
                $q->where('role_id', $user->role_id)
                  ->orWhere('user_id', $user->id);
            });
        } elseif ($userRoleName === RoleEnum::ADMIN->value) {
            // Admin can see all, but if they filter by role_id, ensure their own requests are still visible
            // This block is primarily to add the orWhere for user_id to Admin's view.
            // The global filter for Admin is effectively no filter.
             $query->where(function ($q) use ($user) {
                $q->orWhere('user_id', $user->id); // Admin should see their own requests if any
             });
        }

        // Filters for status and role_id (if not already filtered by role-based access)
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // If an Admin or HR/DevOps user explicitly requests a specific role_id, allow it.
        // Otherwise, the role-based filter above will take precedence for HR/DevOps users.
        if ($request->has('role_id') && $userRoleName === RoleEnum::ADMIN->value) {
            $query->whereHas('role', function ($q) use ($request) {
                $q->where('id', $request->role_id);
            });
        } elseif (in_array($userRoleName, [RoleEnum::HR->value, RoleEnum::DEVOPS->value])) {
             // For HR/DevOps, ensure they can only filter by their own role_id if they provide it
            if ($request->role_id != $user->role_id) {
                return response()->json(['message' => 'Unauthorized to filter by this role.'], 403);
            }
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
        }

        $requests = $query->with(['approvedBy'])->paginate(10);

        return response()->json($requests);
    }

    public function show(InventoryRequest $inventoryRequest)
    {
        // Ensure only allowed roles or the request owner can view
        $user = Auth::user();
        if (!in_array($user->role->name, [RoleEnum::ADMIN->value, RoleEnum::HR->value, RoleEnum::DEVOPS->value]) && $user->id !== $inventoryRequest->user_id) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        return response()->json($inventoryRequest->load(['user', 'role', 'approvedBy']));
    }

    /**
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     * @SuppressWarnings(PHPMD.ElseExpression)
     */
    public function updateStatus(Request $request, InventoryRequest $inventoryRequest)
    {
        $user = Auth::user();
        $userRoleName = $user->role->name;
        $currentStatus = $inventoryRequest->status;
        $newStatus = $request->status;

        // Only Admin, HR, DevOps can update status in general, UNLESS it's an Employee receiving a shipped item.
        if (!in_array($userRoleName, [RoleEnum::ADMIN->value, RoleEnum::HR->value, RoleEnum::DEVOPS->value])) {
            // Allow Employee to change status from 'Shipped' to 'Received'
            if (!($userRoleName === RoleEnum::EMPLOYEE->value && $currentStatus === InventoryRequestStatusEnum::SHIPPED->value && $newStatus === InventoryRequestStatusEnum::RECEIVED->value)) {
                return response()->json(['message' => 'Unauthorized access.'], 403);
            }
        }

        // HR/DevOps specific rule: Cannot update status of requests they created
        if (in_array($userRoleName, [RoleEnum::HR->value, RoleEnum::DEVOPS->value]) && $inventoryRequest->user_id === $user->id) {
            return response()->json(['message' => 'You cannot update the status of requests you have created.'], 403);
        }

        $request->validate([
            'status' => ['required', Rule::in([
                InventoryRequestStatusEnum::APPROVED->value,
                InventoryRequestStatusEnum::SHIPPED->value,
                InventoryRequestStatusEnum::RECEIVED->value,
                InventoryRequestStatusEnum::REJECTED->value
            ])],
        ]);

        // Enforce status transition rules
        if ($currentStatus === InventoryRequestStatusEnum::PENDING->value) {
            if (!in_array($newStatus, [InventoryRequestStatusEnum::APPROVED->value, InventoryRequestStatusEnum::REJECTED->value])) {
                return response()->json(['message' => 'Pending requests can only be moved to Approved or Rejected.'], 400);
            }
        } elseif ($currentStatus === InventoryRequestStatusEnum::APPROVED->value) {
            if ($newStatus !== InventoryRequestStatusEnum::SHIPPED->value) {
                return response()->json(['message' => 'Approved requests can only be moved to Shipped.'], 400);
            }
        } elseif ($currentStatus === InventoryRequestStatusEnum::SHIPPED->value) {
            if ($newStatus !== InventoryRequestStatusEnum::RECEIVED->value) {
                return response()->json(['message' => 'Shipped requests can only be moved to Received.'], 400);
            }
        } else {
            // If the request is already in a final state or an unknown state, prevent further updates
            if (in_array($currentStatus, [InventoryRequestStatusEnum::REJECTED->value, InventoryRequestStatusEnum::RECEIVED->value])) {
                 return response()->json(['message' => 'Cannot update status for a ' . $currentStatus . ' request.'], 400);
            }
            // Add a generic error for any other unexpected status transition
            return response()->json(['message' => 'Invalid status transition.'], 400);
        }

        $updateData = [
            'status' => $newStatus,
        ];

        // Handle approved_by and approved_at for 'Approved' status
        if ($newStatus === InventoryRequestStatusEnum::APPROVED->value) {
            $updateData['approved_by'] = Auth::id();
            $updateData['approved_at'] = now();
        }

        $inventoryRequest->update($updateData);

        return response()->json([
            'message' => 'Inventory request status updated successfully.',
            'request' => $inventoryRequest->load(['user', 'role', 'approvedBy'])
        ]);
    }
}
