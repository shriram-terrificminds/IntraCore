<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InventoryRequestController;
use App\Http\Controllers\ComplaintController;

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