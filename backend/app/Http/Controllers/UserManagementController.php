<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    // List users (with filters/search/pagination)
    public function index(Request $request)
    {
        $query = User::query();

        $search = $request->input('search');
        // Search by name or email
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        $roleId = $request->input('role_id');
        // Filter by role_id
        if ($roleId) {
            $query->where('role_id', $roleId);
        }

        $locationId = $request->input('location_id');
        // Filter by location_id
        if ($locationId) {
            $query->where('location_id', $locationId);
        }

        $users = $query->paginate($request->input('per_page', 15));
        return response()->json($users);
    }

    // Advanced search (optional)
    public function list(Request $request)
    {
        return $this->index($request);
    }

    // Get user details
    public function show($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        return response()->json($user);
    }

    // Create user (with profile image)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role_id' => ['required', Rule::exists('roles', 'id')],
            'location_id' => ['required', Rule::exists('locations', 'id')],
            'profile_image' => 'nullable|image|max:2048',
        ]);
        $user = new User($validated);
        $user->password = Hash::make($validated['password']);
        if ($request->hasFile('profile_image')) {
            $user->profile_image = $request->file('profile_image')->store('profile_images', 'public');
        }
        $user->save();
        return response()->json($user, 201);
    }

    // Update user (with profile image)
    public function update(Request $request, $id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:50',
            'last_name' => 'sometimes|required|string|max:50',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8',
            'role_id' => ['sometimes', 'required', Rule::exists('roles', 'id')],
            'location_id' => ['sometimes', 'required', Rule::exists('locations', 'id')],
            'profile_image' => 'nullable|image|max:2048',
        ]);
        $user->fill($validated);
        if ($request->filled('password')) {
            $user->password = Hash::make($request->input('password'));
        }
        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $user->profile_image = $request->file('profile_image')->store('profile_images', 'public');
        }
        $user->save();
        return response()->json($user);
    }

    // Delete user (soft delete)
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }

    // Restore user
    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
        return response()->json(['message' => 'User restored']);
    }

    // Update OneSignal player_id for the authenticated user
    public function updatePlayerId(Request $request)
    {
        $request->validate(['player_id' => 'required|string']);
        $user = $request->user();
        $user->player_id = $request->player_id;
        $user->save();
        return response()->json(['message' => 'Player ID updated']);
    }
}
