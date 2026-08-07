<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;

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

    // Save Onboarding Wizard Step Progress
    public function saveStep(Request $request)
    {
        $user = $request->user();
        $tenant = $user->tenant;

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Organization not found'
            ], 404);
        }

        $validated = $request->validate([
            'step' => 'required|integer|min:1|max:6',
            'business_address' => 'nullable|string',
            'tax_id' => 'nullable|string',
            'website' => 'nullable|string|url',
            'logo_url' => 'nullable|string|url',
            'banner_url' => 'nullable|string|url',
            'primary_color' => 'nullable|string',
            'payment_provider' => 'nullable|string|in:platform,paystack,flutterwave,stripe',
            'paystack_secret_key' => 'nullable|string',
            'paystack_public_key' => 'nullable|string',
            'is_completed' => 'nullable|boolean'
        ]);

        $settings = $tenant->settings ?? [];
        $settings['onboarding_step'] = max($settings['onboarding_step'] ?? 1, $validated['step']);

        if (isset($validated['is_completed']) && $validated['is_completed']) {
            $settings['onboarding_completed'] = true;
        }

        if (isset($validated['business_address'])) $settings['business_address'] = $validated['business_address'];
        if (isset($validated['tax_id'])) $settings['tax_id'] = $validated['tax_id'];
        if (isset($validated['website'])) $tenant->domain = $validated['website'];
        if (isset($validated['logo_url'])) $tenant->logo_url = $validated['logo_url'];
        if (isset($validated['banner_url'])) $tenant->banner_url = $validated['banner_url'];
        if (isset($validated['primary_color'])) {
            $branding = $tenant->branding ?? [];
            $branding['primary_color'] = $validated['primary_color'];
            $tenant->branding = $branding;
        }
        if (isset($validated['payment_provider'])) {
            $settings['payment_provider'] = $validated['payment_provider'];
            if (isset($validated['paystack_secret_key'])) $settings['paystack_secret_key'] = $validated['paystack_secret_key'];
            if (isset($validated['paystack_public_key'])) $settings['paystack_public_key'] = $validated['paystack_public_key'];
        }

        $tenant->settings = $settings;
        $tenant->save();

        return response()->json([
            'success' => true,
            'message' => 'Onboarding step saved successfully',
            'data' => [
                'current_step' => $settings['onboarding_step'],
                'completed' => $settings['onboarding_completed'] ?? false,
                'tenant' => $tenant,
            ]
        ]);
    }
}
