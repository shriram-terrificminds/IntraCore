<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryRequestController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/dashboard/stats', [DashboardController::class, 'stats']);

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
    Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
});

Route::middleware('auth:sanctum')->prefix('inventory-requests')->group(function () {
    Route::post('/', [InventoryRequestController::class, 'store']);
    Route::post('/list', [InventoryRequestController::class, 'list']);
    Route::get('/{inventoryRequest}', [InventoryRequestController::class, 'show']);
    Route::patch('/{inventoryRequest}/status', [InventoryRequestController::class, 'updateStatus']);
});

Route::middleware('auth:sanctum')->prefix('complaints')->group(function () {
    Route::post('/', [ComplaintController::class, 'store']);
    Route::post('/list', [ComplaintController::class, 'list']);
    Route::get('/{complaint}', [ComplaintController::class, 'show']);
    Route::patch('/{complaint}/status', [ComplaintController::class, 'updateStatus']);
});

// User Management (Admin only)
Route::middleware(['auth:sanctum', 'admin'])->prefix('users')->group(function () {
    Route::get('/', [UserManagementController::class, 'index']); // List users
    Route::get('/{id}', [UserManagementController::class, 'show']); // Get user details
    Route::post('/', [UserManagementController::class, 'store']); // Create user
    Route::post('/list', [UserManagementController::class, 'list']); // Advanced search (optional)
    Route::match(['put', 'patch'], '/{id}', [UserManagementController::class, 'update']); // Update user
    Route::delete('/{id}', [UserManagementController::class, 'destroy']); // Delete user
    Route::post('/{id}/restore', [UserManagementController::class, 'restore']); // Restore user
});

// Update OneSignal player_id for the authenticated user
Route::middleware('auth:sanctum')->post('/users/player-id', [\App\Http\Controllers\UserManagementController::class, 'updatePlayerId']);
