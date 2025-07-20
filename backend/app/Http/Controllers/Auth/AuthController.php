<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRules;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember_me' => ['boolean'],
        ]);

        if (!Auth::attempt($request->only('email', 'password'), $request->remember_me)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = User::with(['role', 'location'])
            ->where('email', $request->email)
            ->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->load(['role', 'location']),
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Return success even if user not found to prevent email enumeration
            return response()->json(['message' => 'If an account with that email address exists, a password reset link has been sent.']);
        }

        // Generate a new token and send the reset link
        $token = Password::getRepository()->create($user);

        // Customize the notification to send the frontend URL
        // Send notification for successful password reset
        $user->notify(new \App\Notifications\ResetPasswordNotification($token));
        // $user->sendPasswordResetNotification($token);

        return response()->json(['message' => 'Password reset link sent successfully.']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRules::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));

                // Send notification for successful password reset
                $user->notify(new \App\Notifications\PasswordSuccessfullyReset());
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            $message = __($status);
            if ($status === Password::INVALID_TOKEN) {
                return response()->json(['message' => 'The password reset token is invalid or expired.'], 400);
            } elseif ($status === Password::INVALID_USER) {
                return response()->json(['message' => 'We could not find a user with that email address.'], 400);
            } elseif ($status === Password::INVALID_PASSWORD) {
                 return response()->json(['message' => 'The provided password is invalid.'], 400);
            }
            return response()->json(['message' => $message], 400);
        }

        return response()->json(['message' => __($status)]);
    }
}