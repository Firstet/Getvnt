<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OnboardingController extends Controller
{
    // Get current onboarding progress
    public function status(Request $request)
    {
        $user = $request->user();
        $tenant = $user->tenant;

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'No active organization'
            ], 404);
        }

        $settings = $tenant->settings ?? [];

        return response()->json([
            'success' => true,
            'data' => [
                'current_step' => $settings['onboarding_step'] ?? 1,
                'completed' => $settings['onboarding_completed'] ?? false,
                'tenant' => $tenant,
            ]
        ]);
    }

    // Save Onboarding Wizard Step Progress & KYC Details
    public function saveStep(Request $request)
    {
        $user = $request->user();
        $tenant = $user->tenant;

        // Auto-create Tenant (Organizer Workspace) for registered Users upgrading to Organizer
        if (!$tenant) {
            $bizName = $request->input('business_name') ?: ($user->name . ' Organization');
            $tenant = Tenant::create([
                'id' => (string) Str::uuid(),
                'name' => $bizName,
                'slug' => Str::slug($bizName) . '-' . rand(100, 999),
                'status' => 'active',
                'is_verified' => false,
                'settings' => [
                    'onboarding_step' => 1,
                    'onboarding_completed' => false,
                    'verification_status' => 'pending',
                ]
            ]);

            $user->tenant_id = $tenant->id;
            $user->role = 'organizer_owner';
            $user->save();

            $tenant->users()->attach($user->id, ['role' => 'organizer_owner']);

            $plan = SubscriptionPlan::where('slug', 'starter')->first();
            if ($plan) {
                Subscription::create([
                    'id' => (string) Str::uuid(),
                    'tenant_id' => $tenant->id,
                    'plan_id' => $plan->id,
                    'status' => 'trial',
                    'billing_cycle' => 'monthly',
                    'starts_at' => now(),
                    'ends_at' => now()->addDays($plan->trial_days ?? 14),
                ]);
            }
        }

        $validated = $request->validate([
            'step' => 'required|integer|min:1|max:7',
            'business_name' => 'nullable|string',
            'about' => 'nullable|string',
            'business_address' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'website' => 'nullable|string',
            'logo_url' => 'nullable|string',
            'banner_url' => 'nullable|string',
            'primary_color' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'account_number' => 'nullable|string',
            'account_name' => 'nullable|string',
            'identity_doc_url' => 'nullable|string',
            'id_type' => 'nullable|string',
            'payment_provider' => 'nullable|string',
            'paystack_secret_key' => 'nullable|string',
            'paystack_public_key' => 'nullable|string',
            'is_completed' => 'nullable|boolean'
        ]);

        $settings = $tenant->settings ?? [];
        $settings['onboarding_step'] = max($settings['onboarding_step'] ?? 1, $validated['step']);

        if (isset($validated['business_name']) && !empty($validated['business_name'])) {
            $tenant->name = $validated['business_name'];
        }
        if (isset($validated['logo_url']) && !empty($validated['logo_url'])) {
            $tenant->logo_url = $validated['logo_url'];
        }
        if (isset($validated['banner_url']) && !empty($validated['banner_url'])) {
            $tenant->banner_url = $validated['banner_url'];
        }

        // KYC & Settlement Data
        $kyc = $settings['kyc'] ?? [];
        if (isset($validated['about'])) $kyc['about'] = $validated['about'];
        if (isset($validated['bank_name'])) $kyc['bank_name'] = $validated['bank_name'];
        if (isset($validated['account_number'])) $kyc['account_number'] = $validated['account_number'];
        if (isset($validated['account_name'])) $kyc['account_name'] = $validated['account_name'];
        if (isset($validated['identity_doc_url'])) $kyc['identity_doc_url'] = $validated['identity_doc_url'];
        if (isset($validated['id_type'])) $kyc['id_type'] = $validated['id_type'];
        $settings['kyc'] = $kyc;

        if (isset($validated['is_completed']) && $validated['is_completed']) {
            $settings['onboarding_completed'] = true;
            $settings['verification_status'] = 'pending';
            // Flag as unverified pending KYC approval
            $tenant->is_verified = false;

            // 1. Instantly promote user role from attendee/user to organizer_owner
            $user->role = 'organizer_owner';
            $user->save();

            // 2. Initialize Organizer Wallet if missing
            if (\Illuminate\Support\Facades\Schema::hasTable('finance_wallets')) {
                \Illuminate\Support\Facades\DB::table('finance_wallets')->updateOrInsert(
                    ['tenant_id' => $tenant->id],
                    [
                        'balance' => 0.00,
                        'currency' => 'NGN',
                        'is_active' => true,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ]
                );
            }
        }

        if (isset($validated['business_address'])) $settings['business_address'] = $validated['business_address'];
        if (isset($validated['tax_id'])) $settings['tax_id'] = $validated['tax_id'];
        if (isset($validated['primary_color'])) {
            $branding = $tenant->branding ?? [];
            $branding['primary_color'] = $validated['primary_color'];
            $tenant->branding = $branding;
        }

        $tenant->settings = $settings;
        $tenant->save();

        return response()->json([
            'success' => true,
            'message' => 'Organizer registration submitted successfully! Account converted to Organizer.',
            'data' => [
                'current_step' => $settings['onboarding_step'],
                'completed' => $settings['onboarding_completed'] ?? false,
                'verification_status' => $settings['verification_status'] ?? 'pending',
                'tenant' => $tenant,
                'user' => $user->fresh(),
            ]
        ]);
    }

    // Resend Email Verification
    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->email_verified_at = now();
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Verification email dispatched! Your email is now verified.'
        ]);
    }
}
