<?php

use Berkayk\OneSignal\OneSignalFacade as OneSignal;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/reset-password/{token}', function (string $token) {
    return view('auth.reset-password', ['token' => $token]);
})->name('password.reset');

Route::get('/test-notification', function (\Illuminate\Http\Request $request) {
    $playerId = $request->query('player_id');
    if (!$playerId) {
        return response('Missing player_id', 400);
    }
    try {
        OneSignal::sendNotificationToUser(
            'This is a test notification!',
            $playerId
        );
        return response('Notification sent to player_id: ' . $playerId);
    } catch (\Throwable $e) {
        return response('Failed to send notification: ' . $e->getMessage(), 500);
    }
});
