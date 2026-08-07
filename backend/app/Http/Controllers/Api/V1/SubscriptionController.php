<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\Subscription;
use App\Models\Invoice;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    // List all database active plans and feature flags
    public function indexPlans()
    {
        $plans = SubscriptionPlan::with('features')
            ->where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $plans
        ]);
    }

    // Get current tenant's active subscription
    public function currentSubscription(Request $request)
    {
        $user = $request->user();
        if (!$user->tenant_id) {
            return response()->json([
                'success' => false,
                'message' => 'No active organization found'
            ], 404);
        }

        $subscription = Subscription::with(['plan', 'plan.features'])
            ->where('tenant_id', $user->tenant_id)
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    }

    // Subscribe or Upgrade Subscription Plan
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|uuid|exists:subscription_plans,id',
            'billing_cycle' => 'required|string|in:monthly,annual',
            'payment_method' => 'nullable|string|in:paystack,flutterwave,stripe,monnify'
        ]);

        $user = $request->user();
        $tenant = $user->tenant;

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Organization not found'
            ], 404);
        }

        $plan = SubscriptionPlan::findOrFail($validated['plan_id']);

        $price = $validated['billing_cycle'] === 'annual' ? $plan->price_annual : $plan->price_monthly;

        // Cancel previous active subscription if exists
        Subscription::where('tenant_id', $tenant->id)
            ->where('status', 'active')
            ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        // Create new active subscription
        $subscription = Subscription::create([
            'id' => (string) Str::uuid(),
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'billing_cycle' => $validated['billing_cycle'],
            'starts_at' => now(),
            'ends_at' => $validated['billing_cycle'] === 'annual' ? now()->addYear() : now()->addMonth(),
            'payment_method' => $validated['payment_method'] ?? 'paystack',
        ]);

        // Generate Invoice
        $invoice = Invoice::create([
            'id' => (string) Str::uuid(),
            'subscription_id' => $subscription->id,
            'tenant_id' => $tenant->id,
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'amount' => $price,
            'currency' => 'NGN',
            'status' => 'paid',
            'paid_at' => now(),
            'details' => [
                'plan_name' => $plan->name,
                'billing_cycle' => $validated['billing_cycle'],
                'user_email' => $user->email,
            ]
        ]);

        return response()->json([
            'success' => true,
            'message' => "Successfully subscribed to {$plan->name} Plan!",
            'data' => [
                'subscription' => $subscription->load('plan'),
                'invoice' => $invoice,
            ]
        ]);
    }

    // Get Tenant Invoice History
    public function invoices(Request $request)
    {
        $user = $request->user();
        if (!$user->tenant_id) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $invoices = Invoice::where('tenant_id', $user->tenant_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }
}
