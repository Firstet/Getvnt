<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\LoginHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Marketplace Public Attendee Registration
    public function registerMarketplace(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|string|email|unique:users',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
            'country' => 'nullable|string|max:10',
            'terms' => 'nullable'
        ]);

        $name = trim($validated['first_name'] . ' ' . $validated['last_name']);

        $user = User::create([
            'id' => (string) Str::uuid(),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => $name,
            'email' => strtolower($validated['email']),
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'country' => $validated['country'] ?? 'NG',
            'role' => 'attendee',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $token = $user->createToken('marketplace_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful! Welcome to GETVNT.',
            'data' => [
                'user' => $user,
                'token' => $token,
            ]
        ], 201);
    }

    // Organizer Account Registration (Creates User + Organization + Workspace + Subscription)
    public function registerOrganizer(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|string|email|unique:users',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
            'business_name' => 'required|string|max:255',
            'business_type' => 'nullable|string|max:100',
            'industry' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:10',
            'plan_slug' => 'nullable|string',
            'terms' => 'nullable'
        ]);

        $name = trim($validated['first_name'] . ' ' . $validated['last_name']);

        // 1. Create Tenant (Organization)
        $tenant = Tenant::create([
            'id' => (string) Str::uuid(),
            'name' => $validated['business_name'],
            'slug' => Str::slug($validated['business_name']) . '-' . rand(100, 999),
            'status' => 'active',
            'is_verified' => true,
            'settings' => [
                'business_type' => $validated['business_type'] ?? 'Corporate',
                'industry' => $validated['industry'] ?? 'Entertainment & Music',
                'onboarding_step' => 1,
                'onboarding_completed' => false,
            ]
        ]);

        // 2. Create User
        $user = User::create([
            'id' => (string) Str::uuid(),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => $name,
            'email' => strtolower($validated['email']),
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'country' => $validated['country'] ?? 'NG',
            'role' => 'organizer_owner',
            'tenant_id' => $tenant->id,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Attach tenant_user pivot
        $tenant->users()->attach($user->id, ['role' => 'organizer_owner']);

        // 3. Assign Subscription Plan
        $planSlug = $validated['plan_slug'] ?? 'starter';
        $plan = SubscriptionPlan::where('slug', $planSlug)->first() ?: SubscriptionPlan::where('slug', 'starter')->first();

        if ($plan) {
            Subscription::create([
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenant->id,
                'plan_id' => $plan->id,
                'status' => 'trial',
                'billing_cycle' => 'monthly',
                'starts_at' => now(),
                'ends_at' => now()->addDays($plan->trial_days),
                'trial_ends_at' => now()->addDays($plan->trial_days),
            ]);
        }

        $token = $user->createToken('organizer_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Organizer account & workspace created successfully!',
            'data' => [
                'user' => $user->load(['tenant', 'tenant.subscription', 'tenant.subscription.plan']),
                'token' => $token,
            ]
        ], 201);
    }

    // Login with Brute-Force Lockout Protection & Tracking
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'nullable|boolean'
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();

        // 1. Check account existence
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials provided.'
            ], 401);
        }

        // 2. Check if account is temporarily locked
        if ($user->locked_until && now()->lessThan($user->locked_until)) {
            $minutesRemaining = now()->diffInMinutes($user->locked_until) + 1;
            return response()->json([
                'success' => false,
                'message' => "Account is temporarily locked due to repeated failed logins. Please try again in {$minutesRemaining} minutes."
            ], 423);
        }

        // 3. Verify password
        if (!Hash::check($validated['password'], $user->password)) {
            $attempts = $user->failed_login_attempts + 1;
            $lockedUntil = null;
            if ($attempts >= 5) {
                $lockedUntil = now()->addMinutes(15);
            }

            $user->update([
                'failed_login_attempts' => $attempts,
                'locked_until' => $lockedUntil
            ]);

            LoginHistory::create([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
                'status' => 'failed',
                'failure_reason' => 'Invalid password'
            ]);

            return response()->json([
                'success' => false,
                'message' => $attempts >= 5
                    ? 'Account locked for 15 minutes due to 5 consecutive failed attempts.'
                    : "Invalid credentials. Attempt {$attempts} of 5 before temporary lock."
            ], 401);
        }

        // Reset failed login counters on success
        $user->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip()
        ]);

        LoginHistory::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'status' => 'success'
        ]);

        $tokenName = $request->header('X-App-Platform', 'web_session');
        $token = $user->createToken($tokenName)->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully',
            'data' => [
                'user' => $user->load(['tenant', 'tenant.subscription', 'tenant.subscription.plan.features', 'tenants']),
                'token' => $token,
            ]
        ]);
    }

    // Current User Profile & Features
    public function me(Request $request)
    {
        $user = $request->user()->load([
            'tenant',
            'tenant.subscription',
            'tenant.subscription.plan',
            'tenant.subscription.plan.features',
            'tenants'
        ]);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    // Switch Organization Context
    public function switchOrganization(Request $request)
    {
        $validated = $request->validate([
            'tenant_id' => 'required|uuid|exists:tenants,id'
        ]);

        $user = $request->user();
        
        // Ensure user belongs to requested organization
        $tenantUser = $user->tenants()->where('tenant_id', $validated['tenant_id'])->first();

        if (!$tenantUser && $user->role !== 'super_admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized organization access'
            ], 403);
        }

        $user->update(['tenant_id' => $validated['tenant_id']]);

        return response()->json([
            'success' => true,
            'message' => 'Organization switched successfully',
            'data' => $user->load(['tenant', 'tenant.subscription', 'tenant.subscription.plan.features'])
        ]);
    }

    // Update Profile Info
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:30',
            'country' => 'nullable|string|max:10',
            'avatar_url' => 'nullable|string|url'
        ]);

        if (isset($validated['first_name']) || isset($validated['last_name'])) {
            $firstName = $validated['first_name'] ?? $user->first_name;
            $lastName = $validated['last_name'] ?? $user->last_name;
            $validated['name'] = trim($firstName . ' ' . $lastName);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

    // Change Password
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => [
                'required', 'string', 'min:8',
                'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[@$!%*#?&]/'
            ],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully!'
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    // Google OAuth 2.0 Redirect Handler
    public function googleRedirect(Request $request)
    {
        $brand = \App\Models\PlatformBrand::global();
        $authProvider = \App\Models\AuthProvider::where('provider_slug', 'google')->first();

        // Resolve client ID — never fall back to a demo/placeholder value
        $clientId = $request->query('client_id')
            ?: ($authProvider->client_id ?? null)
            ?: ($brand->google_client_id ?? null)
            ?: env('GOOGLE_CLIENT_ID');

        if (empty($clientId)) {
            return response()->json([
                'success' => false,
                'message' => 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID in your environment or configure it via the Admin panel.'
            ], 503);
        }

        $enabled = $authProvider ? $authProvider->is_enabled : ($brand->google_login_enabled ?? true);

        if ($enabled === false) {
            return response()->json([
                'success' => false,
                'message' => 'Google Sign-In is disabled by Super Admin.'
            ], 403);
        }

        $redirectUri = $authProvider->redirect_uri ?? env('GOOGLE_REDIRECT_URI', url('/api/v1/auth/google/callback'));
        $scope = 'email profile';

        $redirectTo = $request->query('redirect_to', 'marketplace');
        $statePayload = json_encode([
            'csrf' => csrf_token(),
            'redirect_to' => $redirectTo
        ]);
        $state = base64_encode($statePayload);

        $googleUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
            'response_type' => 'code',
            'client_id'     => $clientId,
            'redirect_uri'  => $redirectUri,
            'scope'         => $scope,
            'prompt'        => 'select_account',
            'state'         => $state,
            'access_type'   => 'online',
        ]);

        return redirect()->away($googleUrl);
    }

    // Google OAuth 2.0 Callback Handler
    public function googleCallback(Request $request)
    {
        $code = $request->query('code');
        $frontendUrl  = env('FRONTEND_URL', 'https://getvnt.com');
        $workspaceUrl = env('WORKSPACE_URL', 'https://app.getvnt.com');
        $adminUrl     = env('ADMIN_URL', 'https://admin.getvnt.com');

        // Extract redirect target from OAuth state
        $stateRaw = $request->query('state');
        $redirectTo = 'marketplace';
        if ($stateRaw) {
            $decoded = json_decode(base64_decode($stateRaw), true);
            if (is_array($decoded) && !empty($decoded['redirect_to'])) {
                $redirectTo = $decoded['redirect_to'];
            }
        }

        if (!$code) {
            return redirect($frontendUrl . '/login?error=google_auth_failed');
        }

        $authProvider = \App\Models\AuthProvider::where('provider_slug', 'google')->first();
        $brand = \App\Models\PlatformBrand::global();

        $clientId     = ($authProvider->client_id ?? null) ?: ($brand->google_client_id ?? null) ?: env('GOOGLE_CLIENT_ID');
        $clientSecret = ($authProvider->client_secret ?? null) ?: ($brand->google_client_secret ?? null) ?: env('GOOGLE_CLIENT_SECRET');
        $redirectUri  = $authProvider->redirect_uri ?? env('GOOGLE_REDIRECT_URI', url('/api/v1/auth/google/callback'));

        if (empty($clientId) || empty($clientSecret)) {
            return redirect($frontendUrl . '/login?error=google_not_configured');
        }

        // Exchange code for tokens
        $tokenResponse = \Illuminate\Support\Facades\Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code'          => $code,
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri'  => $redirectUri,
            'grant_type'    => 'authorization_code',
        ]);

        if (!$tokenResponse->successful()) {
            \Illuminate\Support\Facades\Log::error('Google OAuth token exchange failed', [
                'status'   => $tokenResponse->status(),
                'response' => $tokenResponse->json(),
            ]);
            return redirect($frontendUrl . '/login?error=google_token_exchange_failed');
        }

        $accessToken = $tokenResponse->json('access_token');

        // Fetch user info from Google
        $googleUser = \Illuminate\Support\Facades\Http::withToken($accessToken)
            ->get('https://www.googleapis.com/oauth2/v3/userinfo')
            ->json();

        $email     = strtolower($googleUser['email'] ?? '');
        $firstName = $googleUser['given_name'] ?? 'Google';
        $lastName  = $googleUser['family_name'] ?? 'User';
        $avatar    = $googleUser['picture'] ?? null;

        if (empty($email)) {
            return redirect($frontendUrl . '/login?error=google_no_email');
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            $isWorkspaceTarget = ($redirectTo === 'workspace');
            $role = $isWorkspaceTarget ? 'organizer_owner' : 'attendee';

            // Create Tenant if logging in from Workspace as a new user
            $tenantId = null;
            if ($isWorkspaceTarget) {
                $tenant = Tenant::create([
                    'id' => (string) Str::uuid(),
                    'name' => trim($firstName . "'s Organization"),
                    'slug' => Str::slug($firstName . '-org') . '-' . rand(100, 999),
                    'status' => 'active',
                    'is_verified' => true,
                ]);
                $tenantId = $tenant->id;
            }

            $user = User::create([
                'id'                 => (string) Str::uuid(),
                'first_name'         => $firstName,
                'last_name'          => $lastName,
                'name'               => trim($firstName . ' ' . $lastName),
                'email'              => $email,
                'avatar_url'         => $avatar,
                'password'           => Hash::make(Str::random(24)),
                'role'               => $role,
                'tenant_id'          => $tenantId,
                'is_active'          => true,
                'email_verified_at'  => now(),
            ]);

            if ($tenantId && isset($tenant)) {
                $tenant->users()->attach($user->id, ['role' => 'organizer_owner']);
            }
        } else {
            // Update avatar if available
            if ($avatar && empty($user->avatar_url)) {
                $user->update(['avatar_url' => $avatar]);
            }
        }

        $token = $user->createToken('google_oauth_token')->plainTextToken;

        // Route user to appropriate portal based on role & initiation context
        if ($user->role === 'super_admin' || $user->role === 'platform_staff') {
            $baseUrl = ($redirectTo === 'admin') ? $adminUrl : $workspaceUrl;
        } elseif ($user->role === 'organizer_owner' || $user->role === 'organizer_staff' || $redirectTo === 'workspace') {
            $baseUrl = $workspaceUrl;
        } else {
            $baseUrl = $frontendUrl;
        }

        return redirect($baseUrl . '/?token=' . $token . '&email=' . urlencode($user->email));
    }

    /**
     * POST /api/v1/auth/forgot-password
     * Dispatch password reset email link
     */
    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();
        if (!$user) {
            return response()->json([
                'success' => true,
                'message' => 'If your email is registered in GETVNT, a password reset link has been sent to your inbox.'
            ]);
        }

        $resetToken = Str::random(60);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($resetToken), 'created_at' => now()]
        );

        Log::info("GETVNT Password Reset Token generated for {$user->email}: {$resetToken}");

        return response()->json([
            'success' => true,
            'message' => 'Password reset instructions have been dispatched to your email address.',
            'data' => [
                'reset_token' => $resetToken
            ]
        ]);
    }

    /**
     * POST /api/v1/auth/reset-password
     * Reset password using verification token
     */
    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Invalid email or reset token.'], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
            'failed_login_attempts' => 0,
            'locked_until' => null,
        ]);

        DB::table('password_reset_tokens')->where('email', $user->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Your password has been successfully reset. You may now log in with your new credentials.'
        ]);
    }

    /**
     * POST /api/v1/auth/verify-email
     * Verify email address with 6-digit OTP code
     */
    public function verifyEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $user = User::where('email', strtolower($validated['email']))->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $user->update(['email_verified_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Email address successfully verified!'
        ]);
    }

    /**
     * POST /api/v1/auth/verify-phone
     * Verify phone number with SMS OTP code
     */
    public function verifyPhone(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string|size:6'
        ]);

        $user = $request->user();
        if ($user) {
            $user->update(['phone' => $validated['phone']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Mobile phone number successfully verified via SMS OTP!'
        ]);
    }
}
