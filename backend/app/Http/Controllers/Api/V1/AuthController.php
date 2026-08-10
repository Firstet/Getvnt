<?php

namespace App\Http\Controllers\Api/V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function registerMarketplace(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'id' => (string) Str::uuid(),
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'attendee',
            'verification_status' => 'unverified',
            'subscription_plan' => 'starter',
            'verified_badge' => false,
            'is_active' => true,
        ]);

        $token = $user->createToken('getvnt_auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'data' => [
                'token' => $token,
                'user' => $user,
                'role' => $user->role,
                'verification_status' => $user->verification_status,
                'subscription_plan' => $user->subscription_plan,
            ],
            'message' => 'Attendee registration successful.',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $user->createToken('getvnt_auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'data' => [
                'token' => $token,
                'user' => $user->load('tenant'),
                'role' => $user->role,
                'verification_status' => $user->verification_status,
                'subscription_plan' => $user->subscription_plan,
                'is_trusted_organizer' => $user->isTrustedOrganizer(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
            'message' => 'Login successful.',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('tenant');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'role' => $user->role,
                'verification_status' => $user->verification_status,
                'subscription_plan' => $user->subscription_plan,
                'verified_badge' => (bool) $user->verified_badge,
                'is_trusted_organizer' => $user->isTrustedOrganizer(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string',
            'bio' => 'nullable|string',
            'country' => 'nullable|string',
            'language' => 'nullable|string',
            'timezone' => 'nullable|string',
            'avatar_url' => 'nullable|string',
        ]);

        $user->update($request->only([
            'name', 'phone', 'bio', 'country', 'language', 'timezone', 'avatar_url'
        ]));

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Profile updated successfully.',
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }

    public function deleteAccount(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully.',
        ]);
    }
}
