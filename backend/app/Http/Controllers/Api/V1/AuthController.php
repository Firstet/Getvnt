<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function registerMarketplace(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // Accept name from multiple field shapes sent by the frontend
        $name = $request->name
            ?? trim(($request->first_name ?? '') . ' ' . ($request->last_name ?? ''))
            ?: $request->username
            ?: explode('@', $request->email)[0];

        $user = User::create([
            'id'                  => (string) Str::uuid(),
            'name'                => $name,
            'email'               => strtolower($request->email),
            'password'            => Hash::make($request->password),
            'role'                => 'attendee',
            'verification_status' => 'unverified',
            'subscription_plan'   => 'starter',
            'verified_badge'      => false,
            'is_active'           => true,
        ]);

        $token = $user->createToken('getvnt_auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'data'    => [
                'token'               => $token,
                'user'                => $user,
                'role'                => $user->role,
                'verification_status' => $user->verification_status,
                'subscription_plan'   => $user->subscription_plan,
            ],
            'message' => 'Account created successfully. Welcome to GETVNT!',
        ], 201);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', strtolower($request->email))->first();

        // Always respond success to prevent email enumeration
        if (!$user) {
            return response()->json([
                'success' => true,
                'message' => 'If an account exists for this email, a reset link has been sent.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['email' => $user->email, 'token' => Hash::make($token), 'created_at' => now()]
        );

        // TODO: Send email with link containing $token
        // Mail::to($user->email)->send(new PasswordResetMail($token));

        return response()->json([
            'success' => true,
            'message' => 'If an account exists for this email, a reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email',
            'token'                 => 'required|string',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', strtolower($request->email))
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token.',
            ], 422);
        }

        $user = User::where('email', strtolower($request->email))->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Revoke all existing tokens
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully. Please sign in with your new password.',
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate(['token' => 'required|string', 'email' => 'required|email']);

        $user = User::where('email', strtolower($request->email))->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $user->update(['email_verified_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ]);
    }

    public function verifyPhone(Request $request)
    {
        $request->validate(['otp' => 'required|string', 'phone' => 'required|string']);

        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        $user->update(['phone_verified_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Phone number verified successfully.',
        ]);
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

    public function googleRedirect()
    {
        $clientId = \App\Models\SystemSetting::where('key', 'google_client_id')->value('value') ?: env('GOOGLE_CLIENT_ID');
        $clientSecret = \App\Models\SystemSetting::where('key', 'google_client_secret')->value('value') ?: env('GOOGLE_CLIENT_SECRET');
        $redirectUri = \App\Models\SystemSetting::where('key', 'google_redirect_uri')->value('value') ?: env('GOOGLE_REDIRECT_URI', 'https://api.getvnt.com/api/v1/auth/google/callback');

        if (!$clientId || !$clientSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Google OAuth client credentials have not been configured in Super Admin System Settings.',
            ], 400);
        }

        config([
            'services.google.client_id' => $clientId,
            'services.google.client_secret' => $clientSecret,
            'services.google.redirect' => $redirectUri,
        ]);

        $targetUrl = "https://accounts.google.com/o/oauth2/v2/auth?" . http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid profile email',
            'access_type' => 'offline',
            'prompt' => 'consent',
        ]);

        return response()->json([
            'success' => true,
            'url' => $targetUrl,
            'message' => 'Google OAuth authorization URL generated.',
        ]);
    }

    public function googleCallback(Request $request)
    {
        $code = $request->get('code');
        if (!$code) {
            return response()->json(['success' => false, 'message' => 'Missing authorization code.'], 400);
        }

        $clientId = \App\Models\SystemSetting::where('key', 'google_client_id')->value('value') ?: env('GOOGLE_CLIENT_ID');
        $clientSecret = \App\Models\SystemSetting::where('key', 'google_client_secret')->value('value') ?: env('GOOGLE_CLIENT_SECRET');
        $redirectUri = \App\Models\SystemSetting::where('key', 'google_redirect_uri')->value('value') ?: env('GOOGLE_REDIRECT_URI', 'https://api.getvnt.com/api/v1/auth/google/callback');

        try {
            $tokenResponse = \Illuminate\Support\Facades\Http::post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'redirect_uri' => $redirectUri,
                'grant_type' => 'authorization_code',
            ]);

            if (!$tokenResponse->successful()) {
                return response()->json(['success' => false, 'message' => 'Google token exchange failed.', 'error' => $tokenResponse->json()], 400);
            }

            $accessToken = $tokenResponse->json('access_token');
            $userResponse = \Illuminate\Support\Facades\Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if (!$userResponse->successful()) {
                return response()->json(['success' => false, 'message' => 'Failed to fetch Google user info.'], 400);
            }

            $googleUser = $userResponse->json();
            $email = strtolower($googleUser['email'] ?? '');
            $name = $googleUser['name'] ?? 'Google User';
            $avatar = $googleUser['picture'] ?? null;

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'id' => (string) Str::uuid(),
                    'name' => $name,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 'attendee',
                    'avatar_url' => $avatar,
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]
            );

            $token = $user->createToken('google_oauth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'token' => $token,
                'data' => [
                    'token' => $token,
                    'user' => $user,
                    'role' => $user->role,
                ],
                'message' => 'Google login successful.',
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'Google Auth failed: ' . $e->getMessage()], 500);
        }
    }
}
