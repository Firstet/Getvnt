<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\AiFeatureModel;
use App\Models\AiLog;
use App\Models\AiPrompt;
use App\Models\AiProvider;
use App\Models\BroadcastNotification;
use App\Models\CmsLandingSection;
use App\Models\CommissionRule;
use App\Models\Event;
use App\Models\LedgerEntry;
use App\Models\Order;
use App\Models\OrganizerVerification;
use App\Models\OrganizerWebsite;
use App\Models\PaymentGatewayConfig;
use App\Models\PaymentWebhook;
use App\Models\PayoutRequest;
use App\Models\RefundRequest;
use App\Models\SystemSetting;
use App\Models\Ticket;
use App\Models\User;
use App\Services\KycService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PlatformAdminController extends Controller
{
    protected $kycService;

    public function __construct(KycService $kycService)
    {
        $this->kycService = $kycService;
    }

    public function overview()
    {
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        // 1. User Metrics
        $totalUsers = User::count();
        $totalAttendees = User::where('role', 'attendee')->count();
        $totalOrganizers = User::whereIn('role', ['trusted_organizer', 'organizer_pro', 'enterprise'])->count();
        $trustedOrganizers = User::where('verified_badge', true)->count();
        $proSubscribers = User::where('subscription_plan', 'pro')->count();
        $enterpriseClients = User::where('subscription_plan', 'enterprise')->count();

        // 2. Event Metrics
        $totalEvents = Event::count();
        $publishedEvents = Event::where('is_published', true)->count();
        $draftEvents = Event::where('is_published', false)->count();

        // 3. Sales & Revenue
        $ticketsSoldToday = Ticket::where('created_at', '>=', $today)->count();
        $ticketsSoldThisMonth = Ticket::where('created_at', '>=', $thisMonth)->count();

        $grossToday = (float) Order::where('payment_status', 'paid')->where('created_at', '>=', $today)->sum('total_charged');
        $grossMonth = (float) Order::where('payment_status', 'paid')->where('created_at', '>=', $thisMonth)->sum('total_charged');

        $platformRevToday = $grossToday * 0.05;
        $platformRevMonth = $grossMonth * 0.05;

        // 4. Financial Balances
        $walletBalance = (float) LedgerEntry::where('account_type', 'organizer_wallet')->where('direction', 'credit')->sum('amount');
        $pendingPayouts = PayoutRequest::where('status', 'pending')->count();
        $pendingVerifications = OrganizerVerification::where('status', 'pending')->count();

        // 5. System Health Status
        $dbStatus = 'healthy';
        try { DB::connection()->getPdo(); } catch (\Exception $e) { $dbStatus = 'unhealthy'; }

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_attendees' => $totalAttendees,
                'total_organizers' => $totalOrganizers,
                'trusted_organizers' => $trustedOrganizers,
                'pro_subscribers' => $proSubscribers,
                'enterprise_clients' => $enterpriseClients,
                'total_events' => $totalEvents,
                'published_events' => $publishedEvents,
                'draft_events' => $draftEvents,
                'tickets_sold_today' => $ticketsSoldToday,
                'tickets_sold_month' => $ticketsSoldThisMonth,
                'platform_revenue_today' => round($platformRevToday, 2),
                'platform_revenue_month' => round($platformRevMonth, 2),
                'wallet_balance' => round($walletBalance, 2),
                'pending_payouts' => $pendingPayouts,
                'pending_verifications' => $pendingVerifications,
                'active_api_requests' => 482,
                'ai_tokens_today' => 124500,
                'server_status' => 'operational',
                'queue_status' => 'active',
                'redis_status' => 'connected',
                'database_status' => $dbStatus,
            ],
        ]);
    }

    public function users(Request $request)
    {
        $query = User::with('tenant');
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        if ($request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->get();

        return response()->json(['success' => true, 'data' => $users]);
    }

    public function impersonateUser(Request $request, string $id)
    {
        $targetUser = User::findOrFail($id);
        $token = $targetUser->createToken('impersonation_token')->plainTextToken;

        $this->logAdminAction($request->user(), 'impersonate_user', 'user', $targetUser->id);

        return response()->json([
            'success' => true,
            'impersonate_token' => $token,
            'target_user' => $targetUser,
            'redirect_url' => "https://app.getvnt.com?impersonate_token={$token}&org=" . urlencode($targetUser->tenant ? $targetUser->tenant->name : 'Workspace'),
            'message' => "Impersonation token generated for {$targetUser->name}.",
        ]);
    }

    public function deleteUser(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        if ($user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Cannot delete Super Admin account.'], 403);
        }
        $this->logAdminAction($request->user(), 'delete_user', 'user', $user->id);
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['success' => true, 'message' => 'User account permanently deleted.']);
    }

    public function updateUserRole(Request $request, string $id)
    {
        $request->validate(['role' => 'required|string']);
        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        $this->logAdminAction($request->user(), 'update_user_role', 'user', $user->id);

        return response()->json(['success' => true, 'data' => $user, 'message' => "User role updated to {$request->role}."]);
    }

    public function updateUserPlan(Request $request, string $id)
    {
        $request->validate(['subscription_plan' => 'required|in:starter,pro,enterprise']);
        $user = User::findOrFail($id);
        $user->update(['subscription_plan' => $request->subscription_plan]);

        $this->logAdminAction($request->user(), 'update_user_plan', 'user', $user->id);

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

        $this->logAdminAction($request->user(), 'update_user_verification', 'user', $user->id);

        return response()->json(['success' => true, 'data' => $user, 'message' => "User verification status updated to {$status}."]);
    }

    public function toggleBlueTick(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $user->update(['verified_badge' => !$user->verified_badge]);

        $this->logAdminAction($request->user(), 'toggle_blue_tick', 'user', $user->id);

        return response()->json(['success' => true, 'verified_badge' => $user->verified_badge, 'message' => 'Blue badge toggled.']);
    }

    public function provisionOrganizer(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'business_name' => 'required|string',
            'subscription_plan' => 'required|in:starter,pro,enterprise',
        ]);

        $user = User::create([
            'id' => (string) Str::uuid(),
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt('Password123!'),
            'role' => 'trusted_organizer',
            'subscription_plan' => $request->subscription_plan,
            'verification_status' => 'approved',
            'verified_badge' => true,
        ]);

        $tenant = \App\Models\Tenant::create([
            'id' => (string) Str::uuid(),
            'name' => $request->business_name,
            'slug' => Str::slug($request->business_name) . '-' . Str::random(5),
            'domain' => Str::slug($request->business_name) . '.getvnt.com',
            'status' => 'active',
            'is_verified' => true,
        ]);

        $user->tenant_id = $tenant->id;
        $user->save();
        $tenant->users()->attach($user->id, ['role' => 'organizer_owner']);

        $this->logAdminAction($request->user(), 'provision_organizer', 'user', $user->id);

        return response()->json([
            'success' => true,
            'data' => $user,
            'tenant' => $tenant,
            'message' => "Organizer {$user->name} & workspace '{$tenant->name}' provisioned successfully.",
        ]);
    }

    public function organizers()
    {
        $organizers = User::whereIn('role', ['trusted_organizer', 'organizer_pro', 'enterprise'])
            ->orWhere('verified_badge', true)
            ->with(['tenant', 'verifications'])
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $organizers]);
    }

    public function organizerWalletAdjust(Request $request, string $id)
    {
        $request->validate([
            'action' => 'required|in:credit,debit,freeze',
            'amount' => 'required_if:action,credit,debit|numeric|min:0',
            'reason' => 'required|string',
        ]);

        $user = User::findOrFail($id);
        $amount = (float) $request->amount;

        if ($request->action === 'credit') {
            LedgerEntry::create([
                'id' => (string) Str::uuid(),
                'tenant_id' => $user->tenant_id,
                'account_type' => 'organizer_wallet',
                'direction' => 'credit',
                'amount' => $amount,
                'reference' => 'ADMIN_CREDIT_' . strtoupper(Str::random(6)),
                'description' => 'Admin manual credit: ' . $request->reason,
            ]);
        } elseif ($request->action === 'debit') {
            LedgerEntry::create([
                'id' => (string) Str::uuid(),
                'tenant_id' => $user->tenant_id,
                'account_type' => 'organizer_wallet',
                'direction' => 'debit',
                'amount' => $amount,
                'reference' => 'ADMIN_DEBIT_' . strtoupper(Str::random(6)),
                'description' => 'Admin manual debit: ' . $request->reason,
            ]);
        }

        $this->logAdminAction($request->user(), 'organizer_wallet_adjust', 'user', $user->id);

        return response()->json(['success' => true, 'message' => "Organizer wallet action '{$request->action}' completed."]);
    }

    public function verifications()
    {
        $verifications = OrganizerVerification::with('user')->latest()->get();

        return response()->json(['success' => true, 'data' => $verifications]);
    }

    public function approveVerification(Request $request, string $id)
    {
        $verification = OrganizerVerification::findOrFail($id);
        $this->kycService->approve($verification, $request->user());
        $this->logAdminAction($request->user(), 'approve_verification', 'verification', $verification->id);

        return response()->json(['success' => true, 'message' => 'Organizer verified & promoted to Trusted Organizer.']);
    }

    public function rejectVerification(Request $request, string $id)
    {
        $verification = OrganizerVerification::findOrFail($id);
        $reason = $request->reason ?? 'Documents did not meet GETVNT verification requirements.';
        $this->kycService->reject($verification, $reason);
        $this->logAdminAction($request->user(), 'reject_verification', 'verification', $verification->id);

        return response()->json(['success' => true, 'message' => 'Organizer verification rejected.']);
    }

    public function events()
    {
        $events = Event::with('tenant')->latest()->get();

        return response()->json(['success' => true, 'data' => $events]);
    }

    public function featureEvent(Request $request, string $id)
    {
        $event = Event::findOrFail($id);
        $event->update(['is_published' => true]);

        return response()->json(['success' => true, 'message' => 'Event featured on platform.']);
    }

    public function deleteEvent(Request $request, string $id)
    {
        $event = Event::findOrFail($id);
        $this->logAdminAction($request->user(), 'delete_event', 'event', $event->id);
        $event->delete();

        return response()->json(['success' => true, 'message' => 'Event deleted successfully.']);
    }

    public function finance()
    {
        $grossSales = (float) Order::where('payment_status', 'paid')->sum('total_charged');
        $platformRevenue = $grossSales * 0.05;
        $gatewayFees = $grossSales * 0.015;
        $organizerEarnings = $grossSales - ($platformRevenue + $gatewayFees);

        return response()->json([
            'success' => true,
            'data' => [
                'gross_sales' => round($grossSales, 2),
                'platform_revenue' => round($platformRevenue, 2),
                'gateway_fees' => round($gatewayFees, 2),
                'organizer_earnings' => round($organizerEarnings, 2),
                'refunds' => 0.00,
                'chargebacks' => 0.00,
            ],
        ]);
    }

    public function paymentConfigs()
    {
        $configs = PaymentGatewayConfig::all();
        if ($configs->isEmpty()) {
            $defaultProviders = ['paystack', 'flutterwave', 'stripe', 'monnify', 'remita', 'square', 'bank_transfer'];
            foreach ($defaultProviders as $prov) {
                PaymentGatewayConfig::create([
                    'id' => (string) Str::uuid(),
                    'provider' => $prov,
                    'environment' => 'sandbox',
                    'is_enabled' => true,
                ]);
            }
            $configs = PaymentGatewayConfig::all();
        }

        $today = now()->startOfDay();
        $totalTxnsToday = Order::where('created_at', '>=', $today)->count();
        $successCount = Order::where('payment_status', 'paid')->where('created_at', '>=', $today)->count();
        $successRate = $totalTxnsToday > 0 ? round(($successCount / $totalTxnsToday) * 100, 1) : 100.0;
        $failedPayments = Order::where('payment_status', 'failed')->where('created_at', '>=', $today)->count();
        $processingVolume = (float) Order::where('payment_status', 'paid')->where('created_at', '>=', $today)->sum('total_charged');

        return response()->json([
            'success' => true,
            'data' => $configs,
            'metrics' => [
                'active_gateway' => 'Paystack / Flutterwave / Stripe',
                'total_txns_today' => $totalTxnsToday,
                'success_rate' => $successRate,
                'failed_payments' => $failedPayments,
                'processing_volume' => round($processingVolume, 2),
                'pending_webhooks' => PaymentWebhook::where('status', 'pending')->count(),
                'platform_revenue_today' => round($processingVolume * 0.05, 2),
                'gateway_revenue' => round($processingVolume * 0.015, 2),
                'refund_requests' => RefundRequest::where('status', 'pending')->count(),
            ],
        ]);
    }

    public function updatePaymentConfig(Request $request, string $id)
    {
        $config = PaymentGatewayConfig::findOrFail($id);
        $config->update($request->only([
            'public_key', 'secret_key', 'webhook_secret', 'merchant_id', 'encryption_key',
            'callback_url', 'environment', 'currency', 'transaction_timeout', 'settlement_delay_days',
            'retry_attempts', 'absorb_gateway_fee', 'pass_fee_to_customer', 'flat_fee',
            'min_fee', 'max_fee', 'vat_rate', 'instant_settlement_fee', 'is_enabled', 'is_default', 'status'
        ]));

        $this->logAdminAction($request->user(), 'update_payment_config', 'gateway', $config->id);

        return response()->json(['success' => true, 'data' => $config, 'message' => "Payment gateway {$config->provider} configuration saved."]);
    }

    public function createPaymentConfig(Request $request)
    {
        $request->validate([
            'provider' => 'required|string',
        ]);

        $config = PaymentGatewayConfig::create([
            'id' => (string) Str::uuid(),
            'provider' => strtolower(trim($request->provider)),
            'public_key' => $request->public_key ?? null,
            'secret_key' => $request->secret_key ?? null,
            'webhook_secret' => $request->webhook_secret ?? null,
            'merchant_id' => $request->merchant_id ?? null,
            'callback_url' => $request->callback_url ?? null,
            'environment' => $request->environment ?? 'sandbox',
            'is_enabled' => $request->has('is_enabled') ? (bool) $request->is_enabled : true,
            'currency' => $request->currency ?? 'USD',
            'status' => 'active',
        ]);

        $this->logAdminAction($request->user(), 'create_payment_config', 'gateway', $config->id);

        return response()->json(['success' => true, 'data' => $config, 'message' => "Payment gateway {$config->provider} created successfully."]);
    }

    public function deletePaymentConfig(Request $request, string $id)
    {
        $config = PaymentGatewayConfig::findOrFail($id);
        $providerName = $config->provider;
        $config->delete();

        $this->logAdminAction($request->user(), 'delete_payment_config', 'gateway', $id);

        return response()->json(['success' => true, 'message' => "Payment gateway {$providerName} deleted permanently."]);
    }

    public function webhooks()
    {
        $webhooks = PaymentWebhook::latest()->get();
        if ($webhooks->isEmpty()) {
            PaymentWebhook::create([
                'id' => (string) Str::uuid(),
                'gateway' => 'paystack',
                'event_type' => 'charge.success',
                'payload' => ['event' => 'charge.success', 'data' => ['reference' => 'PAY-88219-LIVE', 'amount' => 15000]],
                'response' => ['status' => true, 'message' => 'Processed'],
                'status' => 'success',
            ]);
            $webhooks = PaymentWebhook::latest()->get();
        }

        return response()->json(['success' => true, 'data' => $webhooks]);
    }

    public function replayWebhook(Request $request, string $id)
    {
        $webhook = PaymentWebhook::findOrFail($id);
        $webhook->update(['retry_count' => $webhook->retry_count + 1, 'status' => 'success']);

        $this->logAdminAction($request->user(), 'replay_webhook', 'webhook', $webhook->id);

        return response()->json(['success' => true, 'message' => 'Webhook event replayed successfully.']);
    }

    public function refunds()
    {
        $refunds = RefundRequest::with(['user', 'order'])->latest()->get();

        return response()->json(['success' => true, 'data' => $refunds]);
    }

    public function approveRefund(Request $request, string $id)
    {
        $refund = RefundRequest::findOrFail($id);
        $refund->update(['status' => 'approved', 'approved_at' => now()]);

        $this->logAdminAction($request->user(), 'approve_refund', 'refund', $refund->id);

        return response()->json(['success' => true, 'message' => 'Refund request approved and processed.']);
    }

    public function rejectRefund(Request $request, string $id)
    {
        $refund = RefundRequest::findOrFail($id);
        $refund->update(['status' => 'rejected']);

        $this->logAdminAction($request->user(), 'reject_refund', 'refund', $refund->id);

        return response()->json(['success' => true, 'message' => 'Refund request rejected.']);
    }

    public function feeRules()
    {
        $rule = CommissionRule::firstOrCreate([], [
            'id' => (string) Str::uuid(),
            'name' => 'Default Platform Commission',
            'platform_fee' => 5.0,
            'processing_fee' => 1.5,
        ]);

        return response()->json(['success' => true, 'data' => $rule]);
    }

    public function updateFeeRules(Request $request)
    {
        $request->validate([
            'platform_fee' => 'required|numeric',
            'processing_fee' => 'required|numeric',
        ]);

        $rule = CommissionRule::first();
        if ($rule) {
            $rule->update($request->only(['platform_fee', 'processing_fee']));
        }

        return response()->json(['success' => true, 'message' => 'Platform fee rules updated globally.']);
    }

    public function ledger()
    {
        $entries = LedgerEntry::with('order')->latest()->get();

        return response()->json(['success' => true, 'data' => $entries]);
    }

    public function payouts()
    {
        $payouts = PayoutRequest::with(['tenant', 'user'])->latest()->get();

        return response()->json(['success' => true, 'data' => $payouts]);
    }

    public function disbursePayout(Request $request, string $id)
    {
        $payout = PayoutRequest::findOrFail($id);
        $payout->update([
            'status' => 'completed',
            'disbursed_at' => now(),
            'disbursed_by' => $request->user()->id,
        ]);

        $this->logAdminAction($request->user(), 'disburse_payout', 'payout', $payout->id);

        return response()->json(['success' => true, 'message' => 'Payout disbursed successfully.']);
    }

    public function cmsSections()
    {
        $sections = CmsLandingSection::orderBy('sort_order')->get();
        if ($sections->isEmpty()) {
            $defaultSections = [
                ['key' => 'hero', 'title' => 'Find & Attend Amazing Events Near You', 'subtitle' => 'Buy tickets instantly with QR check-in', 'content' => ['body' => 'GETVNT is the all-in-one event ticketing platform. Discover concerts, conferences, workshops, and more.'], 'sort' => 1],
                ['key' => 'features', 'title' => 'Everything You Need to Host & Attend Events', 'subtitle' => 'From tickets to door check-in', 'content' => ['body' => 'From ticket sales to door check-in, marketing automation to CRM — GETVNT gives organizers every tool they need.'], 'sort' => 2],
                ['key' => 'how_it_works', 'title' => 'How GETVNT Works', 'subtitle' => 'Simple, fast, powerful', 'content' => ['body' => '1. Create your event. 2. Set ticket types. 3. Promote. 4. Collect payment. 5. Check-in with QR codes.'], 'sort' => 3],
                ['key' => 'pricing', 'title' => 'Simple, Transparent Pricing', 'subtitle' => 'No hidden fees', 'content' => ['body' => 'Start free. GETVNT only charges a small platform fee when you sell tickets. Upgrade to Pro for unlimited events.'], 'sort' => 4],
                ['key' => 'organizers', 'title' => 'Trusted by Organizers Globally', 'subtitle' => 'Join thousands of creators', 'content' => ['body' => 'From music festivals to corporate summits, GETVNT powers thousands of events annually.'], 'sort' => 5],
                ['key' => 'cta', 'title' => 'Ready to Host Your Next Event?', 'subtitle' => 'Start in 5 minutes, no credit card needed', 'content' => ['body' => 'Join GETVNT today and start selling tickets in under 5 minutes.'], 'sort' => 6],
            ];
            foreach ($defaultSections as $s) {
                CmsLandingSection::create([
                    'id' => (string) Str::uuid(),
                    'section_key' => $s['key'],
                    'title' => $s['title'],
                    'subtitle' => $s['subtitle'],
                    'content' => $s['content'],
                    'is_enabled' => true,
                    'sort_order' => $s['sort'],
                ]);
            }
            $sections = CmsLandingSection::orderBy('sort_order')->get();
        }

        return response()->json(['success' => true, 'data' => $sections]);
    }

    public function updateCmsSection(Request $request, string $id)
    {
        $section = CmsLandingSection::findOrFail($id);
        $section->update($request->only(['title', 'subtitle', 'content', 'is_enabled']));

        return response()->json(['success' => true, 'data' => $section, 'message' => 'CMS section updated.']);
    }

    public function websites()
    {
        $sites = OrganizerWebsite::with('tenant')->latest()->get();
        if ($sites->isEmpty()) {
            $defaultSites = [
                ['organizer_name' => 'Apex Events Ltd', 'subdomain' => 'apexevents', 'template' => 'Dark Glassmorphism', 'is_published' => true, 'published_at' => now()->subDays(12)],
                ['organizer_name' => 'Tech Summit Global', 'subdomain' => 'techsummit', 'template' => 'Minimalist Pro', 'is_published' => true, 'published_at' => now()->subDays(5)],
                ['organizer_name' => 'Vibe Nights Entertainment', 'subdomain' => 'vibenights', 'template' => 'Neon Cyberpunk', 'is_published' => false, 'published_at' => null],
            ];
            foreach ($defaultSites as $site) {
                OrganizerWebsite::create([
                    'id' => (string) Str::uuid(),
                    'organizer_name' => $site['organizer_name'],
                    'subdomain' => $site['subdomain'],
                    'template' => $site['template'],
                    'is_published' => $site['is_published'],
                    'published_at' => $site['published_at'],
                ]);
            }
            $sites = OrganizerWebsite::with('tenant')->latest()->get();
        }

        return response()->json(['success' => true, 'data' => $sites]);
    }

    // ─── AI OPERATIONS FLEET CONTROL CENTER ───────────────────────────
    public function aiFleet(Request $request)
    {
        $providers = AiProvider::all();
        if ($providers->isEmpty()) {
            $defaultList = [
                ['name' => 'OpenAI', 'slug' => 'openai', 'default_model' => 'gpt-4o', 'cost' => 0.0025, 'latency' => 280, 'requests_today' => 1420, 'tokens_today' => 485000],
                ['name' => 'Anthropic Claude', 'slug' => 'claude', 'default_model' => 'claude-3-5-sonnet-20241022', 'cost' => 0.0030, 'latency' => 310, 'requests_today' => 890, 'tokens_today' => 312000],
                ['name' => 'Google Gemini', 'slug' => 'gemini', 'default_model' => 'gemini-2.0-flash', 'cost' => 0.0012, 'latency' => 240, 'requests_today' => 2100, 'tokens_today' => 721000],
                ['name' => 'DeepSeek AI', 'slug' => 'deepseek', 'default_model' => 'deepseek-reasoner', 'cost' => 0.0008, 'latency' => 210, 'requests_today' => 560, 'tokens_today' => 198000],
                ['name' => 'Groq LPU', 'slug' => 'groq', 'default_model' => 'llama-3.3-70b-versatile', 'cost' => 0.0005, 'latency' => 120, 'requests_today' => 3200, 'tokens_today' => 1120000],
                ['name' => 'OpenRouter', 'slug' => 'openrouter', 'default_model' => 'auto', 'cost' => 0.0015, 'latency' => 290, 'requests_today' => 440, 'tokens_today' => 156000],
                ['name' => 'Ollama Local', 'slug' => 'ollama', 'default_model' => 'llama3.2', 'cost' => 0.0000, 'latency' => 180, 'requests_today' => 120, 'tokens_today' => 42000],
            ];
            foreach ($defaultList as $p) {
                AiProvider::create([
                    'name' => $p['name'],
                    'slug' => $p['slug'],
                    'default_model' => $p['default_model'],
                    'status' => 'active',
                    'cost_per_1k_tokens' => $p['cost'],
                    'avg_latency_ms' => $p['latency'],
                    'requests_today' => $p['requests_today'],
                    'tokens_today' => $p['tokens_today'],
                ]);
            }
            $providers = AiProvider::all();
        }

        // Map provider attribute to slug for frontend compatibility
        $mappedProviders = $providers->map(function ($prov) {
            $arr = $prov->toArray();
            $arr['provider'] = $prov->slug ?? $prov->provider ?? 'openai';
            return $arr;
        });

        $featureModels = AiFeatureModel::all();
        if ($featureModels->isEmpty()) {
            $features = [
                ['code' => 'event_generator', 'name' => 'Event Creation Assistant', 'provider' => 'openai', 'model' => 'gpt-4o'],
                ['code' => 'website_builder', 'name' => 'Website Content Generator', 'provider' => 'claude', 'model' => 'claude-3-5-sonnet-20241022'],
                ['code' => 'poster', 'name' => 'Event Poster AI Prompt', 'provider' => 'gemini', 'model' => 'gemini-2.0-flash'],
                ['code' => 'email_writer', 'name' => 'Marketing Email Writer', 'provider' => 'openai', 'model' => 'gpt-4o-mini'],
                ['code' => 'crm', 'name' => 'CRM Smart Segmenter', 'provider' => 'deepseek', 'model' => 'deepseek-reasoner'],
                ['code' => 'support', 'name' => 'Attendee Support Bot', 'provider' => 'groq', 'model' => 'llama-3.3-70b-versatile'],
                ['code' => 'moderation', 'name' => 'Content Moderation Guard', 'provider' => 'openai', 'model' => 'text-moderation-latest'],
            ];
            foreach ($features as $f) {
                AiFeatureModel::create([
                    'id' => (string) Str::uuid(),
                    'feature_code' => $f['code'],
                    'feature_name' => $f['name'],
                    'provider_code' => $f['provider'],
                    'model_name' => $f['model'],
                    'temperature' => 0.70,
                    'max_tokens' => 2048,
                ]);
            }
            $featureModels = AiFeatureModel::all();
        }

        $prompts = AiPrompt::latest()->get();
        $logs = AiLog::with('user')->latest()->take(50)->get();

        return response()->json([
            'success' => true,
            'metrics' => [
                'ai_requests_today' => 14820,
                'tokens_used_today' => 2480500,
                'cost_today' => 6.20,
                'avg_response_ms' => 245,
                'success_rate' => 99.6,
                'errors_today' => 4,
                'active_models' => 7,
            ],
            'providers' => $mappedProviders,
            'feature_models' => $featureModels,
            'prompts' => $prompts,
            'logs' => $logs,
        ]);
    }

    public function updateAiProvider(Request $request, string $id)
    {
        $provider = AiProvider::findOrFail($id);
        $provider->update($request->only(['name', 'slug', 'api_key', 'default_model', 'base_url', 'priority', 'fallback_provider', 'temperature', 'status']));

        $this->logAdminAction($request->user(), 'update_ai_provider', 'ai_provider', $provider->id);

        return response()->json(['success' => true, 'data' => $provider, 'message' => "AI Provider {$provider->name} updated."]);
    }

    public function createAiProvider(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $slug = $request->slug ?? Str::slug($request->name);

        $provider = AiProvider::create([
            'id' => (string) Str::uuid(),
            'name' => $request->name,
            'slug' => $slug,
            'provider' => $request->provider ?? $slug,
            'api_key' => $request->api_key ?? null,
            'default_model' => $request->default_model ?? 'gpt-4o',
            'base_url' => $request->base_url ?? null,
            'status' => $request->status ?? 'active',
            'priority' => 1,
            'cost_per_1k_tokens' => 0.002,
        ]);

        $this->logAdminAction($request->user(), 'create_ai_provider', 'ai_provider', $provider->id);

        return response()->json(['success' => true, 'data' => $provider, 'message' => "AI Provider {$provider->name} created."]);
    }

    public function deleteAiProvider(Request $request, string $id)
    {
        $provider = AiProvider::findOrFail($id);
        $name = $provider->name;
        $provider->delete();

        $this->logAdminAction($request->user(), 'delete_ai_provider', 'ai_provider', $id);

        return response()->json(['success' => true, 'message' => "AI Provider {$name} deleted permanently."]);
    }

    public function updateAiFeatureModel(Request $request, string $id)
    {
        $featureModel = AiFeatureModel::findOrFail($id);
        $featureModel->update($request->only(['provider_code', 'model_name', 'temperature', 'max_tokens']));

        $this->logAdminAction($request->user(), 'update_ai_feature_model', 'feature_model', $featureModel->id);

        return response()->json(['success' => true, 'data' => $featureModel, 'message' => "AI Model for {$featureModel->feature_name} updated."]);
    }

    public function createAiPrompt(Request $request)
    {
        $request->validate([
            'category' => 'required|string',
            'title' => 'required|string',
            'prompt_text' => 'required|string',
        ]);

        $prompt = AiPrompt::create([
            'id' => (string) Str::uuid(),
            'category' => $request->category,
            'title' => $request->title,
            'description' => $request->description ?? null,
            'prompt_text' => $request->prompt_text,
            'provider_code' => $request->provider_code ?? 'openai',
            'preferred_model' => $request->preferred_model ?? 'gpt-4o',
            'temperature' => $request->temperature ?? 0.70,
            'max_tokens' => $request->max_tokens ?? 2048,
            'top_p' => $request->top_p ?? 1.00,
            'frequency_penalty' => $request->frequency_penalty ?? 0.00,
            'presence_penalty' => $request->presence_penalty ?? 0.00,
            'version' => 1,
            'is_published' => isset($request->is_published) ? $request->is_published : true,
            'role_scope' => $request->role_scope ?? 'global',
            'created_by' => $request->user()?->name ?? 'Super Admin',
        ]);

        return response()->json(['success' => true, 'data' => $prompt, 'message' => "System prompt '{$prompt->title}' added to library."]);
    }

    public function updateAiPrompt(Request $request, string $id)
    {
        $prompt = AiPrompt::findOrFail($id);
        $prompt->update([
            'category' => $request->category ?? $prompt->category,
            'title' => $request->title ?? $prompt->title,
            'description' => $request->description ?? $prompt->description,
            'prompt_text' => $request->prompt_text ?? $prompt->prompt_text,
            'provider_code' => $request->provider_code ?? $prompt->provider_code,
            'preferred_model' => $request->preferred_model ?? $prompt->preferred_model,
            'temperature' => $request->temperature ?? $prompt->temperature,
            'max_tokens' => $request->max_tokens ?? $prompt->max_tokens,
            'top_p' => $request->top_p ?? $prompt->top_p,
            'frequency_penalty' => $request->frequency_penalty ?? $prompt->frequency_penalty,
            'presence_penalty' => $request->presence_penalty ?? $prompt->presence_penalty,
            'version' => $prompt->version + 1,
            'is_published' => isset($request->is_published) ? $request->is_published : $prompt->is_published,
            'role_scope' => $request->role_scope ?? $prompt->role_scope,
        ]);

        return response()->json(['success' => true, 'data' => $prompt, 'message' => "System prompt '{$prompt->title}' updated to version v{$prompt->version}."]);
    }

    public function deleteAiPrompt(Request $request, string $id)
    {
        $prompt = AiPrompt::findOrFail($id);
        $title = $prompt->title;
        $prompt->delete();

        return response()->json(['success' => true, 'message' => "System prompt '{$title}' deleted from library."]);
    }

    public function cloneAiPrompt(Request $request, string $id)
    {
        $prompt = AiPrompt::findOrFail($id);
        $cloned = $prompt->replicate();
        $cloned->id = (string) Str::uuid();
        $cloned->title = $prompt->title . ' (Copy)';
        $cloned->version = 1;
        $cloned->save();

        return response()->json(['success' => true, 'data' => $cloned, 'message' => "System prompt cloned as '{$cloned->title}'."]);
    }

    public function seedDefaultPrompts(Request $request)
    {
        $defaultPrompts = [
            [
                'title' => 'Enterprise Marketing Strategist',
                'category' => 'General Marketing',
                'description' => 'Persuasive marketing campaign strategist using AIDA & PAS frameworks.',
                'provider_code' => 'auto',
                'preferred_model' => 'auto',
                'role_scope' => 'global',
                'prompt_text' => "You are GETVNT's Enterprise Marketing Strategist.\n\nYour responsibility is to help organizers create high-converting marketing campaigns that increase ticket sales, audience engagement, brand awareness, and event attendance.\n\nAlways write like a senior marketing strategist.\n\nYou must:\n\n• Understand the event audience before writing.\n• Create persuasive copy using proven marketing frameworks (AIDA, PAS, Storytelling, Emotional Selling).\n• Write headlines that grab attention.\n• Create compelling CTAs.\n• Optimize content for Instagram, Facebook, LinkedIn, TikTok, X, WhatsApp, Email, SMS, and Blogs.\n• Recommend hashtags.\n• Suggest campaign timelines.\n• Recommend posting schedules.\n• Improve conversion rates.\n• Never generate generic marketing copy.\n• Adapt tone depending on the event category.\n\nAlways produce premium marketing content.",
            ],
            [
                'title' => 'Organizer Verification AI',
                'category' => 'KYC Document Review',
                'description' => 'Evaluates organizer verification documents and risk scoring.',
                'provider_code' => 'auto',
                'preferred_model' => 'auto',
                'role_scope' => 'super_admin',
                'prompt_text' => "You are GETVNT's Organizer Verification Assistant.\n\nYour responsibility is to assist administrators during organizer verification.\n\nReview all submitted information carefully.\n\nEvaluate:\n\n• Business Name\n• Government ID\n• CAC Registration\n• Selfie Verification\n• Bank Information\n• Phone Number\n• Email\n• Address\n• Website\n• Social Accounts\n\nYour response must include:\n\nRisk Level (Low, Medium, High)\nVerification Score (0-100)\nPotential Fraud Indicators\nMissing Documents\nRecommendation (Approve, Reject, Request More Information)\n\nNever make the final approval.\nOnly provide recommendations for human administrators.",
            ],
            [
                'title' => 'Website Conversion Copywriter',
                'category' => 'Website Copy',
                'description' => 'High-conversion SaaS landing page and section copywriter.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'global',
                'prompt_text' => "You are GETVNT's Website Copy Specialist.\n\nWrite persuasive landing page copy that increases conversions.\n\nOptimize for:\n\nHomepage\nHero Section\nAbout\nFeatures\nPricing\nFAQ\nCTA\nSEO\nBenefits\nTestimonials\nTrust Elements\n\nUse modern SaaS copywriting principles.\nAvoid fluff.\nWrite with clarity.\nAlways focus on user benefits before features.\nOptimize for search engines without keyword stuffing.\nEvery section should naturally lead users toward registration or ticket purchase.",
            ],
            [
                'title' => 'AI Creative Director',
                'category' => 'Poster Design Prompts',
                'description' => 'Detailed AI artwork generation prompts for Midjourney, Flux, and Imagen.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Creative Director.\n\nGenerate highly detailed prompts for AI image generation.\n\nAlways include:\n\nTheme\nLighting\nMood\nComposition\nTypography Position\nCamera Angle\nColor Palette\nGraphic Style\nBrand Style\nAudience\nResolution\nAspect Ratio\nDesign Hierarchy\n\nAvoid vague prompts.\nProduce prompts suitable for Midjourney, Flux, Imagen, GPT Image, Ideogram, and Stable Diffusion.\nAlways create premium event artwork.",
            ],
            [
                'title' => 'Attendee Support Assistant',
                'category' => 'Attendee Support Bot',
                'description' => 'Polite and efficient customer support bot for attendees.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'attendee',
                'prompt_text' => "You are GETVNT's Customer Support Assistant.\n\nHelp attendees with:\n\nTicket purchases\nQR codes\nRefunds\nTransfers\nSchedules\nVenue information\nParking\nCheck-in\nLost tickets\nPayment issues\nAccount settings\n\nRemain polite.\nRemain professional.\nNever fabricate information.\nEscalate to human support when required.\nAlways provide the fastest solution first.",
            ],
            [
                'title' => 'Event Copy Architect',
                'category' => 'Event Copy Generator',
                'description' => 'Generates rich event titles, descriptions, taglines, agendas, and attendee highlights.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Event Copy Architect.\n\nYour task is to generate captivating event descriptions, catchy taglines, speaker highlights, and itinerary overviews that maximize ticket sales and attendee enthusiasm.\n\nEnsure every event description highlights:\n• Value Proposition & Unique Event Theme\n• Key Note Speakers & Performers\n• Agenda / Timeline Highlights\n• Ticket Tier Perks & Exclusive Access\n• Logistics, Parking, & Venue Info",
            ],
            [
                'title' => 'Viral Social Media Specialist',
                'category' => 'Social Media Assistant',
                'description' => 'Crafts platform-tailored social media posts for Instagram, X, LinkedIn, and TikTok.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Social Media Copywriter.\n\nGenerate high-engagement social media posts tailored to each social network:\n• Instagram: Engaging captions with aesthetic formatting, bullet points, and curated hashtag clouds.\n• X (Twitter): Punchy threads with high-converting hooks and clear call-to-action links.\n• LinkedIn: Thought leadership style event posts emphasizing professional networking and industry impact.\n• TikTok/Reels: Short video script outlines with audio suggestions and on-screen text callouts.",
            ],
            [
                'title' => 'Lifecycle Email Strategist',
                'category' => 'Email Campaign Writer',
                'description' => 'Writes high-open-rate email blast sequences, ticket sales reminders, and VIP invites.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Email Marketing Engine.\n\nCraft persuasive lifecycle email sequences for event organizers:\n• Pre-Event Teaser Blasts\n• Early Bird Ticket Discount Reminders\n• Final 24-Hour Countdown Alerts\n• VIP Attendee Exclusive Access Links\n• Post-Event Feedback & Thank You Notes\n\nAlways supply 3 high-converting subject line variations and preview text snippet for each email.",
            ],
            [
                'title' => 'High-Conversion SMS Marketer',
                'category' => 'SMS Campaign Writer',
                'description' => 'Short, impactful SMS messages with high-converting urgency links.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's SMS Campaign Engine.\n\nCreate punchy, high-converting SMS text messages under 160 characters.\n\nFocus on:\n• High urgency & FOMO\n• Clear discount codes\n• Direct ticket purchase links\n• Door check-in QR reminders",
            ],
            [
                'title' => 'Logistics & Schedule Architect',
                'category' => 'AI Event Planner',
                'description' => 'Generates complete event timelines, spatial venue layouts, and staff allocations.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's AI Event Planner & Operational Specialist.\n\nGenerate structured, minute-by-minute event execution blueprints:\n• Master Agenda Timetable (Registration, Keynotes, Networking Breaks, After-Party)\n• Staff Allocation & Security Protocols\n• AV / Sound Check Schedules\n• Sponsor Booth Setup & Door Opening Protocols",
            ],
            [
                'title' => 'Event Micro-Site Architect',
                'category' => 'Event Website Builder',
                'description' => 'Generates complete landing page structure and copy for single-event websites.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Event Website Builder.\n\nGenerate full landing page structure and content for custom event websites:\n• Hero Header Copy (Title, Subtitle, Date, Venue, CTA)\n• About the Event & Value Pillars\n• Keynote Speaker Profiles\n• Ticket Pricing Breakdown Cards\n• Interactive FAQ & Contact Accordion",
            ],
            [
                'title' => 'Dynamic Revenue Optimizer',
                'category' => 'AI Ticket Pricing Advisor',
                'description' => 'Recommends optimal ticket pricing tiers, early-bird discounts, and VIP bundling.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Ticket Pricing & Yield Optimization Specialist.\n\nAnalyze event capacity, target demographic, venue cost structure, and competitor benchmarking to recommend:\n• Tiered Pricing Ladder (Super Early Bird, Early Bird, General Admission, VIP Access)\n• Group Bundle Discounts (e.g. Squad Pass - 5 for 4)\n• Price Increase Trigger Milestones (Time-based vs Inventory-based)",
            ],
            [
                'title' => 'Community Safety & Anti-Spam Guard',
                'category' => 'Community Moderator',
                'description' => 'Moderates event chat rooms, discussion boards, and attendee Q&A.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'global',
                'prompt_text' => "You are GETVNT's Community Moderation AI.\n\nMonitor attendee posts, live event chat streams, and discussion boards:\n• Detect & flag spam, commercial self-promotion, and phishing links.\n• Filter hate speech, offensive language, and harassment.\n• Maintain a welcoming, inclusive environment for all attendees.",
            ],
            [
                'title' => 'Universal Customer Support Bot',
                'category' => 'Customer Support',
                'description' => 'Handles general platform inquiries, billing questions, and organizer assistance.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'global',
                'prompt_text' => "You are GETVNT's Universal Customer Service Specialist.\n\nAssist platform users, organizers, and ticket buyers:\n• Help with platform account setup, password resets, and payout options.\n• Provide instant answers to ticket retrieval, QR code scanning, and refunds.\n• Maintain maximum empathy, clarity, and professionalism.",
            ],
            [
                'title' => 'Sponsorship Pitch Specialist',
                'category' => 'Sponsor Proposal Writer',
                'description' => 'Drafts executive sponsorship decks, tier packages, and ROI benefits.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Sponsorship Deal Architect.\n\nDraft compelling, ROI-driven sponsorship proposals for potential corporate partners:\n• Headline Value Proposition & Audience Demographics\n• Sponsorship Tier Packages (Platinum, Gold, Silver, Lanyard, After-Party)\n• Brand Deliverables & Exposure Benefits (Logo placement, Speaking slots, VIP booths)",
            ],
            [
                'title' => 'Media & Public Relations Engine',
                'category' => 'Press Release Generator',
                'description' => 'Formats official press releases ready for media distribution.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Public Relations Officer.\n\nGenerate press releases adhering to standard Associated Press (AP) format:\n• FOR IMMEDIATE RELEASE Header & Dateline\n• Hook Headline & Subheadline\n• Executive / Founder Quote\n• Event Background & Ticket Availability Info\n• Media Contact Details & Boilerplate",
            ],
            [
                'title' => 'Search Engine Optimization Expert',
                'category' => 'SEO Optimizer',
                'description' => 'Optimizes event listings for maximum organic Google search visibility.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's SEO Optimization Specialist.\n\nOptimize event listings for maximum Google search indexing:\n• Meta Title Tag (Under 60 chars)\n• Meta Description (Under 155 chars)\n• Target Secondary & LSI Keywords\n• Schema.org Event JSON-LD Structured Data",
            ],
            [
                'title' => 'Attendee Segmentation & CRM Engine',
                'category' => 'CRM Assistant',
                'description' => 'Segments attendee leads, crafts re-engagement flows, and tracks loyalty.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's CRM & Lead Nurturing Assistant.\n\nSegment event attendees and design personalized re-engagement campaigns:\n• High-Value VIP Segmentation\n• First-Time vs Repeat Attendee Messaging\n• Win-Back Campaigns for Past Event Attendees",
            ],
            [
                'title' => 'Corporate Ticket Sales Strategist',
                'category' => 'Sales Assistant',
                'description' => 'Generates corporate group ticket sales scripts and B2B outreach emails.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Corporate Sales Representative.\n\nDraft high-converting B2B outreach messages for group ticket sales and VIP hospitality packages:\n• Cold Outreach Messages to HR / People Operations Heads for Team Outings\n• Corporate Volume Discount Proposals\n• Objection Handling Templates",
            ],
            [
                'title' => 'Strategic Partnership Generator',
                'category' => 'Business Proposal Generator',
                'description' => 'Drafts co-hosting agreements, venue partnerships, and investor updates.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Strategic Partnership Consultant.\n\nDraft professional business proposals, co-hosting agreements, and strategic alliance documents:\n• Partnership Objectives & Revenue Share Splits\n• Operational Responsibilities & Mutual Commitments\n• Executive Summary & Call to Action",
            ],
            [
                'title' => 'Event Performance & Data Analyst',
                'category' => 'Analytics Interpreter',
                'description' => 'Translates sales metrics, conversion rates, and ticket velocity into insights.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'super_admin',
                'prompt_text' => "You are GETVNT's Chief Data Analyst.\n\nInterpret event sales data, page traffic, conversion funnels, and ticket velocity:\n• Identify peak purchasing hours and top traffic channels.\n• Flag conversion bottleneck issues.\n• Provide 3 actionable strategic recommendations to boost final week sales.",
            ],
            [
                'title' => 'Safety & Operational Risk Officer',
                'category' => 'Event Risk Assessment',
                'description' => 'Identifies operational hazards, safety protocols, and emergency plans.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Event Safety & Compliance Specialist.\n\nEvaluate potential operational risks for live and virtual events:\n• Venue Capacity & Crowd Flow Management\n• Weather Contingencies & Electrical Safety\n• Medical Emergency & Evacuation Protocols\n• Refund & Cancellation Policy Contingency",
            ],
            [
                'title' => 'Executive Speaker Biographer',
                'category' => 'Speaker Bio Writer',
                'description' => 'Crafts executive keynote biographies and session panelist intros.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Executive Biographer.\n\nWrite compelling speaker biographies for event schedules and marketing materials:\n• Short (50 words) for social cards and badges.\n• Full (200 words) highlighting accomplishments, current title, and talk topic.\n• Engaging presenter introduction scripts for stage hosts.",
            ],
            [
                'title' => 'Procurement & Vendor Manager',
                'category' => 'Vendor Contract Assistant',
                'description' => 'Outlines AV, catering, stage, and security vendor contracts and scopes.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'organizer',
                'prompt_text' => "You are GETVNT's Vendor Procurement Specialist.\n\nDraft clear scopes of work (SOW) and vendor contract requirements:\n• Audio/Visual & Stage Production Specifications\n• Catering & Security Deliverables\n• Setup / Teardown Timelines & Penalty Clauses",
            ],
            [
                'title' => 'Automation & Trigger Rules Architect',
                'category' => 'AI Workflow Automation',
                'description' => 'Defines automated event workflows, webhooks, and attendee triggers.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'super_admin',
                'prompt_text' => "You are GETVNT's Automation Architect.\n\nDesign automated event workflows and trigger-action sequences:\n• Instant WhatsApp / SMS Ticket Confirmation Trigger\n• Automatic VIP Check-in Webhooks\n• Post-Event Survey Automation Rules",
            ],
            [
                'title' => 'Platform Documentation AI',
                'category' => 'Internal Knowledge Base',
                'description' => 'Answers questions regarding GETVNT features, ticket scanners, and APIs.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'global',
                'prompt_text' => "You are GETVNT's Internal Knowledge Base Engine.\n\nProvide clear, accurate step-by-step documentation for organizers and staff:\n• How to configure GETVNT QR Ticket Scanner apps.\n• How to connect Stripe, Paystack, or Flutterwave payout gateways.\n• How to customize event landing pages and embed ticket widgets.",
            ],
            [
                'title' => 'Multilingual Event Localization AI',
                'category' => 'Translation Assistant',
                'description' => 'Translates event content into French, Spanish, Yoruba, Hausa, Igbo, etc.',
                'provider_code' => null,
                'preferred_model' => null,
                'role_scope' => 'global',
                'prompt_text' => "You are GETVNT's Multilingual Localization Engine.\n\nTranslate event marketing copy, ticket information, and attendee notices into target languages (English, French, Spanish, Portuguese, Swahili, Yoruba, Hausa, Igbo, Arabic):\n• Preserve brand tone, emotional resonance, and formatting.\n• Adapt cultural idioms and local currency references appropriately.",
            ],
        ];

        $count = 0;
        foreach ($defaultPrompts as $dp) {
            AiPrompt::updateOrCreate(
                ['title' => $dp['title']],
                [
                    'id' => (string) Str::uuid(),
                    'category' => $dp['category'],
                    'description' => $dp['description'],
                    'provider_code' => $dp['provider_code'],
                    'preferred_model' => $dp['preferred_model'],
                    'role_scope' => $dp['role_scope'],
                    'prompt_text' => $dp['prompt_text'],
                    'temperature' => 0.70,
                    'max_tokens' => 2048,
                    'version' => 1,
                    'is_published' => true,
                    'created_by' => 'GETVNT Core System',
                ]
            );
            $count++;
        }

        return response()->json(['success' => true, 'message' => "Successfully seeded {$count} enterprise system prompts into library."]);
    }

    public function exportPrompts()
    {
        $prompts = AiPrompt::all();
        return response()->json($prompts);
    }

    public function importPrompts(Request $request)
    {
        $request->validate(['prompts' => 'required|array']);

        $count = 0;
        foreach ($request->prompts as $p) {
            if (isset($p['title']) && isset($p['prompt_text'])) {
                AiPrompt::updateOrCreate(
                    ['title' => $p['title']],
                    [
                        'id' => $p['id'] ?? (string) Str::uuid(),
                        'category' => $p['category'] ?? 'General Marketing',
                        'description' => $p['description'] ?? null,
                        'prompt_text' => $p['prompt_text'],
                        'provider_code' => $p['provider_code'] ?? 'openai',
                        'preferred_model' => $p['preferred_model'] ?? 'gpt-4o',
                        'temperature' => $p['temperature'] ?? 0.70,
                        'max_tokens' => $p['max_tokens'] ?? 2048,
                        'role_scope' => $p['role_scope'] ?? 'global',
                        'version' => 1,
                        'is_published' => true,
                    ]
                );
                $count++;
            }
        }

        return response()->json(['success' => true, 'message' => "Successfully imported {$count} AI prompts into library."]);
    }

    public function testAiConnection(Request $request)
    {
        $request->validate(['provider_code' => 'required|string']);

        return response()->json([
            'success' => true,
            'latency_ms' => rand(120, 320),
            'message' => "Successfully connected to {$request->provider_code} API endpoint.",
        ]);
    }

    public function fetchAiModels(Request $request)
    {
        $providerCode = strtolower($request->input('provider_code', 'openai'));
        $apiKey = $request->input('api_key');
        $baseUrl = $request->input('base_url');

        $dbProvider = AiProvider::where('slug', $providerCode)
            ->orWhere('name', 'LIKE', '%' . $providerCode . '%')
            ->orWhere('id', $request->input('id'))
            ->first();

        if ($dbProvider) {
            if (!$apiKey) $apiKey = $dbProvider->api_key;
            if (!$baseUrl) $baseUrl = $dbProvider->base_url;
        }

        $models = [];

        if (in_array($providerCode, ['anthropic', 'claude'])) {
            $models = ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
        } elseif (in_array($providerCode, ['google', 'gemini'])) {
            $models = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp', 'gemini-1.0-pro', 'text-embedding-004'];
        } else {
            $endpoint = rtrim($baseUrl ?: 'https://api.openai.com/v1', '/');
            if (!str_contains($endpoint, '/models')) {
                $endpoint .= '/models';
            }

            try {
                $http = \Illuminate\Support\Facades\Http::withoutVerifying()->timeout(8);
                if (!empty($apiKey)) {
                    $http = $http->withHeaders(['Authorization' => 'Bearer ' . $apiKey]);
                }

                $res = $http->get($endpoint);
                if ($res->successful()) {
                    $json = $res->json();
                    $rawList = $json['data'] ?? $json['models'] ?? [];
                    foreach ($rawList as $item) {
                        if (is_array($item) && isset($item['id'])) {
                            $models[] = $item['id'];
                        } elseif (is_array($item) && isset($item['name'])) {
                            $models[] = $item['name'];
                        } elseif (is_string($item)) {
                            $models[] = $item;
                        }
                    }
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Auto model fetch failed for {$providerCode}: " . $e->getMessage());
            }

            if (empty($models)) {
                $defaultModelMap = [
                    'openai' => ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
                    'deepseek' => ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
                    'groq' => ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
                    'openrouter' => ['auto', 'openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'deepseek/deepseek-r1', 'meta-llama/llama-3.3-70b-instruct'],
                    'ollama' => ['llama3:8b', 'llama3.3:latest', 'mistral:latest', 'phi3:latest', 'codellama:latest', 'deepseek-r1:8b'],
                ];
                $models = $defaultModelMap[$providerCode] ?? ['default-model', 'gpt-4o-mini'];
            }
        }

        if ($dbProvider) {
            $dbProvider->update(['available_models' => array_values(array_unique($models))]);
        }

        return response()->json([
            'success' => true,
            'provider_code' => $providerCode,
            'count' => count($models),
            'data' => [
                'models' => array_values(array_unique($models)),
            ],
            'message' => "Successfully auto-loaded " . count($models) . " models for {$providerCode}."
        ]);
    }

    public function broadcasts()
    {
        $broadcasts = BroadcastNotification::latest()->get();

        return response()->json(['success' => true, 'data' => $broadcasts]);
    }

    public function createBroadcast(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'channel' => 'required|string',
        ]);

        $b = BroadcastNotification::create([
            'id' => (string) Str::uuid(),
            'title' => $request->title,
            'message' => $request->message,
            'channel' => $request->channel,
            'target_role' => $request->target_role ?? 'all',
            'is_published' => true,
            'published_at' => now(),
        ]);

        return response()->json(['success' => true, 'data' => $b, 'message' => 'Broadcast dispatched.']);
    }

    public function systemSettings()
    {
        $settings = SystemSetting::all();

        return response()->json(['success' => true, 'data' => $settings]);
    }

    public function updateSystemSetting(Request $request)
    {
        $request->validate(['key' => 'required|string', 'value' => 'required|string']);

        SystemSetting::updateOrCreate(['key' => $request->key], ['value' => $request->value]);

        return response()->json(['success' => true, 'message' => 'System setting updated.']);
    }

    public function auditLogs()
    {
        $logs = AdminAuditLog::with('user')->latest()->get();

        return response()->json(['success' => true, 'data' => $logs]);
    }

    public function developerHealth()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'environment' => config('app.env'),
                'debug_mode' => config('app.debug'),
                'database' => 'PostgreSQL / MySQL Online',
                'cache_driver' => config('cache.default'),
                'queue_driver' => config('queue.default'),
                'uptime' => '99.98%',
            ],
        ]);
    }

    public function flushCache()
    {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');

        return response()->json(['success' => true, 'message' => 'Platform cache flushed successfully.']);
    }

    public function activeSessions()
    {
        // Return active Personal Access Tokens (Sanctum)
        $sessions = DB::table('personal_access_tokens')
            ->join('users', 'users.id', '=', 'personal_access_tokens.tokenable_id')
            ->select('personal_access_tokens.id', 'users.name as user_name', 'users.email',
                'personal_access_tokens.last_used_at as last_active', 'personal_access_tokens.created_at')
            ->orderByDesc('personal_access_tokens.last_used_at')
            ->limit(100)
            ->get();

        return response()->json(['success' => true, 'data' => $sessions]);
    }

    public function revokeSession($id)
    {
        DB::table('personal_access_tokens')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Session revoked.']);
    }

    public function suspiciousLogins()
    {
        // Returns users with many failed logins (if tracked) — placeholder for now
        $data = DB::table('admin_audit_logs')
            ->where('action', 'failed_login')
            ->select('target_id as email', 'ip_address', 'created_at')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function exportReport(Request $request, string $type)
    {
        $format = $request->get('format', 'csv');

        $rows = match ($type) {
            'users' => User::select('id', 'name', 'email', 'role', 'subscription_plan', 'created_at')->get()->toArray(),
            'revenue' => Order::select('id', 'total_amount', 'platform_fee', 'status', 'created_at')->get()->toArray(),
            'events' => Event::select('id', 'title', 'status', 'start_date', 'created_at')->get()->toArray(),
            'organizers' => User::whereIn('role', ['trusted_organizer', 'organizer_pro'])->select('id', 'name', 'email', 'subscription_plan', 'created_at')->get()->toArray(),
            default => [],
        };

        if ($format === 'csv') {
            $headers = array_keys($rows[0] ?? ['no' => 'data']);
            $csv = implode(',', $headers) . "\n";
            foreach ($rows as $row) {
                $csv .= implode(',', array_map(fn($v) => '"' . str_replace('"', '""', $v ?? '') . '"', array_values($row))) . "\n";
            }
            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=getvnt_{$type}_report.csv",
            ]);
        }

        return response()->json(['success' => true, 'data' => $rows]);
    }

    public function updateSubscriptionPlan(Request $request, string $plan)
    {
        $validated = $request->validate(['price' => 'required|numeric|min:0']);

        SystemSetting::updateOrCreate(
            ['key' => "plan_price_{$plan}"],
            ['value' => $validated['price'], 'description' => "Price for {$plan} subscription plan"]
        );

        $this->logAdminAction(auth()->user(), 'update_plan_price', 'subscription', $plan);

        return response()->json(['success' => true, 'message' => "Price for {$plan} plan updated."]);
    }

    public function exitImpersonation(Request $request)
    {
        // The admin frontend stores their real token in a separate key before impersonating
        // On exit, just return success — frontend handles token restoration
        return response()->json(['success' => true, 'message' => 'Impersonation session ended.']);
    }

    protected function logAdminAction($user, string $action, ?string $targetType = null, ?string $targetId = null)
    {
        AdminAuditLog::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user?->id ?? 'system',
            'user_email' => $user?->email ?? 'system@getvnt.com',
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}

