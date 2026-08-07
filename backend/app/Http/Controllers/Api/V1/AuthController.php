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

        $clientId = $request->query('client_id')
            ?: ($authProvider->client_id ?? null)
            ?: ($brand->google_client_id ?? null)
            ?: env('GOOGLE_CLIENT_ID', '1029384756-demo.apps.googleusercontent.com');

        $enabled = $authProvider ? $authProvider->is_enabled : ($brand->google_login_enabled ?? true);

        if ($enabled === false) {
            return response()->json([
                'success' => false,
                'message' => 'Google Sign-In is disabled by Super Admin.'
            ], 403);
        }

        $redirectUri = urlencode($authProvider->redirect_uri ?? 'http://localhost:8000/api/v1/auth/google/callback');
        $scope = urlencode('email profile');

        $googleUrl = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={$clientId}&redirect_uri={$redirectUri}&scope={$scope}&prompt=select_account";

        return redirect()->away($googleUrl);
    }

    // Google OAuth 2.0 Callback Handler
    public function googleCallback(Request $request)
    {
        $code = $request->query('code');
        if (!$code) {
            return redirect('http://localhost:3000/login?error=google_auth_failed');
        }

        // Demo / Fallback account creation or user lookup for Google user
        $email = $request->query('email', 'google_user_' . rand(100, 999) . '@getvnt.com');

        $user = User::where('email', strtolower($email))->first();
        if (!$user) {
            $user = User::create([
                'id' => (string) Str::uuid(),
                'first_name' => 'Google',
                'last_name' => 'User',
                'name' => 'Google User',
                'email' => strtolower($email),
                'password' => Hash::make(Str::random(16)),
                'role' => 'attendee',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }

        $token = $user->createToken('google_oauth_token')->plainTextToken;

        return redirect("http://localhost:3000/auth/callback?token={$token}&email=" . urlencode($user->email));
    }
}
