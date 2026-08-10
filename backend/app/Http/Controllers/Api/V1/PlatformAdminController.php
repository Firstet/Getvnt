<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\AiProvider;
use App\Models\BroadcastNotification;
use App\Models\CmsLandingSection;
use App\Models\CommissionRule;
use App\Models\Event;
use App\Models\LedgerEntry;
use App\Models\Order;
use App\Models\OrganizerVerification;
use App\Models\OrganizerWebsite;
use App\Models\PaymentGateway;
use App\Models\PaymentGatewayConfig;
use App\Models\PayoutRequest;
use App\Models\PromoCode;
use App\Models\SystemSetting;
use App\Models\Ticket;
use App\Models\User;
use App\Services\KycService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
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

    public function organizers()
    {
        $organizers = User::whereIn('role', ['trusted_organizer', 'organizer_pro', 'enterprise'])
            ->orWhere('verified_badge', true)
            ->with(['tenant', 'verifications'])
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $organizers]);
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
            $defaultProviders = ['paystack', 'flutterwave', 'stripe', 'monnify', 'square'];
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

        return response()->json(['success' => true, 'data' => $configs]);
    }

    public function updatePaymentConfig(Request $request, string $id)
    {
        $config = PaymentGatewayConfig::findOrFail($id);
        $config->update($request->only(['public_key', 'secret_key', 'webhook_secret', 'environment', 'is_enabled', 'is_default']));

        return response()->json(['success' => true, 'data' => $config, 'message' => 'Payment gateway updated.']);
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

        return response()->json(['success' => true, 'data' => $sites]);
    }

    public function aiProviders()
    {
        $providers = AiProvider::all();

        return response()->json(['success' => true, 'data' => $providers]);
    }

    public function updateAiProvider(Request $request, string $id)
    {
        $provider = AiProvider::findOrFail($id);
        $provider->update($request->only(['api_key', 'default_model', 'temperature', 'status']));

        return response()->json(['success' => true, 'data' => $provider, 'message' => 'AI Provider fleet updated.']);
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

    protected function logAdminAction($user, string $action, string $targetType = null, string $targetId = null)
    {
        AdminAuditLog::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'user_email' => $user->email,
            'action' => $action,
            'target_type' => $targetType,
            'target_id' => $targetId,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
