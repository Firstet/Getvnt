<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AiProvider;
use App\Models\CmsLandingSection;
use App\Models\CommissionRule;
use App\Models\Event;
use App\Models\LedgerEntry;
use App\Models\Order;
use App\Models\OrganizerVerification;
use App\Models\PaymentGateway;
use App\Models\PayoutRequest;
use App\Models\User;
use App\Services\KycService;
use Illuminate\Http\Request;

class PlatformAdminController extends Controller
{
    protected $kycService;

    public function __construct(KycService $kycService)
    {
        $this->kycService = $kycService;
    }

    public function stats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'total_attendees' => User::where('role', 'attendee')->count(),
                'total_organizers' => User::where('role', 'trusted_organizer')->count(),
                'pending_verifications' => OrganizerVerification::where('status', 'pending')->count(),
                'total_events' => Event::count(),
                'total_orders' => Order::count(),
                'platform_gross_volume' => (float) Order::where('payment_status', 'paid')->sum('total_charged'),
                'platform_revenue' => (float) LedgerEntry::where('account_type', 'platform_revenue')->sum('amount'),
                'pending_payouts' => PayoutRequest::where('status', 'pending')->count(),
            ],
        ]);
    }

    public function users()
    {
        $users = User::with('tenant')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function updateUserRole(Request $request, string $id)
    {
        $request->validate(['role' => 'required|string']);
        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return response()->json(['success' => true, 'data' => $user, 'message' => "User role updated to {$request->role}."]);
    }

    public function updateUserPlan(Request $request, string $id)
    {
        $request->validate(['subscription_plan' => 'required|in:starter,pro,enterprise']);
        $user = User::findOrFail($id);
        $user->update(['subscription_plan' => $request->subscription_plan]);

        return response()->json(['success' => true, 'data' => $user, 'message' => "User subscription plan updated to {$request->subscription_plan}."]);
    }

    public function updateUserVerification(Request $request, string $id)
    {
        $request->validate(['verification_status' => 'required|in:unverified,pending,approved,rejected']);
        $user = User::findOrFail($id);

        $status = $request->verification_status;
        $isApproved = ($status === 'approved');

        $user->update([
            'verification_status' => $status,
            'verified_badge' => $isApproved,
            'role' => $isApproved ? 'trusted_organizer' : $user->role,
        ]);

        return response()->json(['success' => true, 'data' => $user, 'message' => "User verification status updated to {$status}."]);
    }

    public function verifications()
    {
        $verifications = OrganizerVerification::with('user')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $verifications,
        ]);
    }

    public function approveVerification(Request $request, string $id)
    {
        $verification = OrganizerVerification::findOrFail($id);
        $this->kycService->approve($verification, $request->user());

        return response()->json(['success' => true, 'message' => 'Organizer verified & promoted to Trusted Organizer.']);
    }

    public function rejectVerification(Request $request, string $id)
    {
        $verification = OrganizerVerification::findOrFail($id);
        $reason = $request->reason ?? 'Documents did not meet GETVNT verification requirements.';
        $this->kycService->reject($verification, $reason);

        return response()->json(['success' => true, 'message' => 'Organizer verification rejected.']);
    }

    public function ledger()
    {
        $entries = LedgerEntry::with('order')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $entries,
        ]);
    }

    public function payouts()
    {
        $payouts = PayoutRequest::with(['tenant', 'user'])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $payouts,
        ]);
    }

    public function disbursePayout(Request $request, string $id)
    {
        $payout = PayoutRequest::findOrFail($id);
        $payout->update([
            'status' => 'completed',
            'disbursed_at' => now(),
            'disbursed_by' => $request->user()->id,
        ]);

        return response()->json(['success' => true, 'message' => 'Payout disbursed successfully.']);
    }

    public function gateways()
    {
        $gateways = PaymentGateway::all();
        $rules = CommissionRule::all();

        return response()->json([
            'success' => true,
            'data' => [
                'gateways' => $gateways,
                'commission_rules' => $rules,
            ],
        ]);
    }

    public function updateGatewayFee(Request $request, string $id)
    {
        $request->validate([
            'platform_fee' => 'sometimes|numeric',
            'processing_fee' => 'sometimes|numeric',
        ]);

        $rule = CommissionRule::find($id);
        if ($rule) {
            $rule->update($request->only(['platform_fee', 'processing_fee']));
        }

        return response()->json(['success' => true, 'message' => 'Gateway fee rules updated successfully.']);
    }

    public function aiProviders()
    {
        $providers = AiProvider::all();

        return response()->json([
            'success' => true,
            'data' => $providers,
        ]);
    }

    public function updateAiProvider(Request $request, string $id)
    {
        $provider = AiProvider::findOrFail($id);
        $provider->update($request->only(['api_key', 'default_model', 'temperature', 'status']));

        return response()->json(['success' => true, 'data' => $provider, 'message' => 'AI Provider fleet updated.']);
    }

    public function cmsSections()
    {
        $sections = CmsLandingSection::orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data' => $sections,
        ]);
    }

    public function updateCmsSection(Request $request, string $id)
    {
        $section = CmsLandingSection::findOrFail($id);
        $section->update($request->only(['title', 'subtitle', 'content', 'is_enabled']));

        return response()->json(['success' => true, 'data' => $section, 'message' => 'CMS section updated.']);
    }
}
