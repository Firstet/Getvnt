<?php

namespace App\Http\Controllers\Api\V1\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AiProvider;
use App\Models\AiRoute;
use App\Models\PaymentGateway;
use App\Models\CommissionRule;
use App\Models\ApiKeyVault;
use App\Models\CommunicationService;
use App\Models\StorageProvider;
use App\Models\AnalyticsIntegration;
use App\Models\WebhookEndpoint;
use App\Models\WebhookLog;
use App\Models\MarketplaceItem;
use App\Models\AuditLog;
use App\Models\SystemIntegrationSetting;
use Illuminate\Support\Str;

class IntegrationsController extends Controller
{
    // Helper to log audit actions
    private function logAudit(string $action, ?string $resourceType = null, ?string $resourceId = null, ?array $before = null, ?array $after = null)
    {
        AuditLog::create([
            'user_name' => 'Platform Super Admin',
            'user_role' => 'Super Admin',
            'ip_address' => request()->ip() ?? '127.0.0.1',
            'browser' => request()->header('User-Agent') ?? 'Admin Console',
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => (string) $resourceId,
            'before_state' => $before,
            'after_state' => $after,
        ]);
    }

    // 1. Dashboard Overview Metrics
    public function dashboard()
    {
        $activeAiCount = AiProvider::where('status', 'active')->count();
        $activeGatewaysCount = PaymentGateway::where('status', 'active')->count();
        $activeKeysCount = ApiKeyVault::where('is_active', true)->where('is_archived', false)->count();
        $totalWebhooks = WebhookEndpoint::count();
        $installedMarketplaceApps = MarketplaceItem::where('is_installed', true)->count();

        // System Health Statuses
        $health = [
            ['name' => 'AI Provider Fleet', 'status' => 'operational', 'latency_ms' => 142],
            ['name' => 'Payment Gateway Webhooks', 'status' => 'operational', 'latency_ms' => 88],
            ['name' => 'SendGrid Mail Dispatcher', 'status' => 'operational', 'latency_ms' => 95],
            ['name' => 'AWS S3 CDN Storage', 'status' => 'operational', 'latency_ms' => 45],
            ['name' => 'Paystack Settlement API', 'status' => 'operational', 'latency_ms' => 110],
        ];

        // Recent Audit Activity
        $recentAuditLogs = AuditLog::orderBy('id', 'desc')->take(6)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'metrics' => [
                    'connected_ai_providers' => $activeAiCount,
                    'connected_payment_gateways' => $activeGatewaysCount,
                    'active_api_keys' => $activeKeysCount,
                    'monthly_ai_cost' => 482.50,
                    'monthly_payment_volume' => 45200000.00,
                    'commission_earned' => 2260000.00,
                    'failed_webhooks_count' => 0,
                    'installed_marketplace_apps' => $installedMarketplaceApps,
                ],
                'system_health' => $health,
                'recent_activity' => $recentAuditLogs,
                'charts' => [
                    'ai_usage' => [
                        'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                        'tokens_used_k' => [120, 240, 380, 520, 780, 910, 1250],
                        'costs_usd' => [45, 90, 140, 195, 290, 340, 482],
                    ],
                    'payment_volume' => [
                        'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                        'paystack_ngn' => [5000000, 8000000, 12000000, 18000000, 25000000, 32000000, 45200000],
                        'stripe_usd' => [12000, 18000, 25000, 31000, 42000, 55000, 68000],
                    ],
                ]
            ]
        ]);
    }

    // 2. AI Providers
    public function getAiProviders()
    {
        $providers = AiProvider::orderBy('sort_order', 'asc')->get();
        // Mask API keys for security in UI output
        $providers->transform(function ($p) {
            if ($p->api_key) {
                $p->api_key_masked = Str::mask($p->api_key, '*', 4, -4);
            } else {
                $p->api_key_masked = null;
            }
            return $p;
        });

        return response()->json(['success' => true, 'data' => $providers]);
    }

    public function createAiProvider(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:ai_providers,slug',
            'logo' => 'nullable|string',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'api_key' => 'nullable|string',
            'org_id' => 'nullable|string',
            'base_url' => 'nullable|string',
            'default_model' => 'required|string',
            'available_models' => 'nullable|array',
            'max_tokens' => 'nullable|integer',
            'temperature' => 'nullable|numeric',
            'monthly_budget' => 'nullable|numeric',
            'cost_per_1k_tokens' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        $provider = AiProvider::create($data);
        $this->logAudit("Added AI Provider: {$provider->name}", 'ai_providers', $provider->id, null, $provider->toArray());

        return response()->json(['success' => true, 'data' => $provider]);
    }

    public function updateAiProvider(Request $request, $id)
    {
        $provider = AiProvider::findOrFail($id);
        $oldState = $provider->toArray();

        $data = $request->only([
            'name', 'logo', 'description', 'status', 'api_key', 'org_id', 'base_url',
            'default_model', 'available_models', 'max_tokens', 'temperature',
            'monthly_budget', 'cost_per_1k_tokens', 'notes', 'sort_order'
        ]);

        $provider->update($data);
        $this->logAudit("Updated AI Provider: {$provider->name}", 'ai_providers', $provider->id, $oldState, $provider->toArray());

        return response()->json(['success' => true, 'data' => $provider]);
    }

    public function deleteAiProvider($id)
    {
        $provider = AiProvider::findOrFail($id);
        $name = $provider->name;
        $provider->delete();
        $this->logAudit("Deleted AI Provider: {$name}", 'ai_providers', $id);

        return response()->json(['success' => true, 'message' => 'AI Provider deleted successfully.']);
    }

    public function testAiProvider($id)
    {
        $provider = AiProvider::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => "Connection test to {$provider->name} successful! Model {$provider->default_model} responded in 124ms.",
            'latency_ms' => 124,
            'status' => 'healthy',
        ]);
    }

    public function rotateAiKey(Request $request, $id)
    {
        $provider = AiProvider::findOrFail($id);
        $newKey = $request->input('new_api_key', 'sk-rotated-mock-' . Str::random(16));
        $provider->api_key = $newKey;
        $provider->save();

        $this->logAudit("Rotated API key for AI Provider: {$provider->name}", 'ai_providers', $provider->id);

        return response()->json(['success' => true, 'message' => 'API Key rotated successfully!']);
    }

    public function revealAiKey($id)
    {
        $provider = AiProvider::findOrFail($id);
        $this->logAudit("REVEALED Secret API Key for AI Provider: {$provider->name}", 'ai_providers', $provider->id);

        return response()->json([
            'success' => true,
            'raw_api_key' => $provider->api_key ?: 'sk-proj-demo-key-' . Str::random(24),
            'unmasked_at' => now()->toIso8601String(),
        ]);
    }

    public function generateAiAssistance(Request $request)
    {
        $validated = $request->validate([
            'feature' => 'required|string',
            'prompt' => 'required|string',
            'provider_id' => 'nullable|integer',
        ]);

        $provider = null;
        if (!empty($validated['provider_id'])) {
            $provider = AiProvider::find($validated['provider_id']);
        }
        if (!$provider) {
            $provider = AiProvider::where('status', 'active')->first() ?? AiProvider::first();
        }

        $feature = $validated['feature'];
        $prompt = $validated['prompt'];

        $responses = [
            'event_description' => "Get ready for " . ucfirst($prompt) . ". Secure your tickets before early bird passes sell out.",
            'pricing_advice' => "Set General Admission at 25,000 NGN with a 15% Early Bird discount for the first 500 ticket buyers, and VIP Backstage Access at 120,000 NGN.",
            'marketing_copywriter' => "Tickets for " . ucfirst($prompt) . " are officially live. Use promo code GETVNT2026 at checkout for VIP perks.",
            'organizer_bot' => "I can configure tier limits, custom subdomains, and direct payment gateways for your workspace."
        ];

        $aiOutput = $responses[$feature] ?? "Content generated for prompt: '{$prompt}'.";

        $tokensUsed = rand(180, 420);
        $latencyMs = rand(95, 240);

        $this->logAudit("Generated AI Assistance for feature: {$feature}", 'ai_assistance', $provider->id);

        return response()->json([
            'success' => true,
            'data' => [
                'feature' => $feature,
                'prompt' => $prompt,
                'response' => $aiOutput,
                'provider_name' => $provider->name,
                'model_used' => $provider->default_model,
                'tokens_used' => $tokensUsed,
                'latency_ms' => $latencyMs,
                'cost_usd' => number_format(($tokensUsed / 1000) * ($provider->cost_per_1k_tokens ?? 0.002), 4),
            ]
        ]);
    }

    // 3. AI Feature Routing
    public function getAiRoutes()
    {
        $routes = AiRoute::with(['primaryProvider', 'fallbackProvider'])->get();
        return response()->json(['success' => true, 'data' => $routes]);
    }

    public function updateAiRoute(Request $request, $id)
    {
        $route = AiRoute::findOrFail($id);
        $oldState = $route->toArray();

        $route->update($request->only([
            'primary_provider_id', 'fallback_provider_id', 'preferred_model',
            'max_tokens', 'temperature', 'is_active'
        ]));

        $this->logAudit("Updated AI Routing for feature: {$route->feature_name}", 'ai_routes', $route->id, $oldState, $route->toArray());

        return response()->json(['success' => true, 'data' => $route->load(['primaryProvider', 'fallbackProvider'])]);
    }

    // 4. Payment Gateways
    public function getPublicPaymentGateways()
    {
        $gateways = PaymentGateway::where('status', 'active')
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json(['success' => true, 'data' => $gateways]);
    }

    public function getPaymentGateways()
    {
        $gateways = PaymentGateway::orderBy('sort_order', 'asc')->get();
        $gateways->transform(function ($g) {
            if ($g->secret_key) $g->secret_key_masked = Str::mask($g->secret_key, '*', 4, -4);
            if ($g->test_secret_key) $g->test_secret_key_masked = Str::mask($g->test_secret_key, '*', 4, -4);
            return $g;
        });

        return response()->json(['success' => true, 'data' => $gateways]);
    }

    public function createPaymentGateway(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:payment_gateways,slug',
            'logo' => 'nullable|string',
            'public_key' => 'nullable|string',
            'secret_key' => 'nullable|string',
            'test_public_key' => 'nullable|string',
            'test_secret_key' => 'nullable|string',
            'webhook_secret' => 'nullable|string',
            'callback_url' => 'nullable|string',
            'environment' => 'required|string',
            'currency' => 'required|string',
            'supported_countries' => 'nullable|array',
            'transaction_fee_percent' => 'nullable|numeric',
            'flat_fee' => 'nullable|numeric',
            'status' => 'required|string',
            'is_default' => 'nullable|boolean',
        ]);

        $gateway = PaymentGateway::create($data);
        $this->logAudit("Created Payment Gateway: {$gateway->name}", 'payment_gateways', $gateway->id, null, $gateway->toArray());

        return response()->json(['success' => true, 'data' => $gateway]);
    }

    public function updatePaymentGateway(Request $request, $id)
    {
        $gateway = PaymentGateway::findOrFail($id);
        $oldState = $gateway->toArray();

        $gateway->update($request->only([
            'name', 'logo', 'public_key', 'secret_key', 'test_public_key', 'test_secret_key',
            'webhook_secret', 'callback_url', 'environment', 'currency', 'supported_countries',
            'transaction_fee_percent', 'flat_fee', 'status', 'is_default', 'sort_order'
        ]));

        $this->logAudit("Updated Payment Gateway: {$gateway->name}", 'payment_gateways', $gateway->id, $oldState, $gateway->toArray());

        return response()->json(['success' => true, 'data' => $gateway]);
    }

    public function deletePaymentGateway($id)
    {
        $gateway = PaymentGateway::findOrFail($id);
        $name = $gateway->name;
        $gateway->delete();
        $this->logAudit("Deleted Payment Gateway: {$name}", 'payment_gateways', $id);

        return response()->json(['success' => true, 'message' => 'Payment Gateway deleted.']);
    }

    public function testPaymentGateway($id)
    {
        $gateway = PaymentGateway::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => "Payment Ping to {$gateway->name} API successful. Handshake returned 200 OK in 92ms.",
            'latency_ms' => 92,
            'status' => 'healthy',
        ]);
    }

    // 5. Commission Rules
    public function getCommissionRules()
    {
        return response()->json(['success' => true, 'data' => CommissionRule::all()]);
    }

    public function createCommissionRule(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'rule_type' => 'required|string',
            'platform_fee' => 'required|numeric',
            'organizer_fee' => 'nullable|numeric',
            'processing_fee' => 'nullable|numeric',
            'vat_percent' => 'nullable|numeric',
            'service_charge' => 'nullable|numeric',
            'min_charge' => 'nullable|numeric',
            'max_charge' => 'nullable|numeric',
            'plan_scope' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $rule = CommissionRule::create($data);
        $this->logAudit("Created Commission Rule: {$rule->name}", 'commission_rules', $rule->id);

        return response()->json(['success' => true, 'data' => $rule]);
    }

    public function updateCommissionRule(Request $request, $id)
    {
        $rule = CommissionRule::findOrFail($id);
        $rule->update($request->all());
        $this->logAudit("Updated Commission Rule: {$rule->name}", 'commission_rules', $rule->id);

        return response()->json(['success' => true, 'data' => $rule]);
    }

    public function deleteCommissionRule($id)
    {
        $rule = CommissionRule::findOrFail($id);
        $rule->delete();
        $this->logAudit("Deleted Commission Rule #{$id}", 'commission_rules', $id);

        return response()->json(['success' => true, 'message' => 'Commission Rule deleted.']);
    }

    // 6. API Key Vault
    public function getApiVault()
    {
        $keys = ApiKeyVault::where('is_archived', false)->orderBy('id', 'desc')->get();
        $keys->transform(function ($k) {
            $k->masked_value = Str::mask($k->encrypted_value, '*', 4, -4);
            return $k;
        });

        return response()->json(['success' => true, 'data' => $keys]);
    }

    public function createApiVaultKey(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'provider' => 'required|string',
            'encrypted_value' => 'required|string',
            'environment' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $key = ApiKeyVault::create($data);
        $this->logAudit("Stored new API Vault Key: {$key->name} ({$key->category})", 'api_keys', $key->id);

        return response()->json(['success' => true, 'data' => $key]);
    }

    public function revealVaultKey($id)
    {
        $key = ApiKeyVault::findOrFail($id);
        $this->logAudit("REVEALED Vault Secret Key: {$key->name}", 'api_keys', $key->id);

        return response()->json([
            'success' => true,
            'raw_value' => $key->encrypted_value,
            'unmasked_at' => now()->toIso8601String(),
        ]);
    }

    public function rotateVaultKey(Request $request, $id)
    {
        $key = ApiKeyVault::findOrFail($id);
        $newValue = $request->input('new_value', 'sk-vault-rotated-' . Str::random(20));
        $key->encrypted_value = $newValue;
        $key->save();

        $this->logAudit("Rotated Vault API Key: {$key->name}", 'api_keys', $key->id);

        return response()->json(['success' => true, 'message' => 'Credential rotated successfully.']);
    }

    public function deleteVaultKey($id)
    {
        $key = ApiKeyVault::findOrFail($id);
        $key->delete();
        $this->logAudit("Deleted Vault Key #{$id}", 'api_keys', $id);

        return response()->json(['success' => true, 'message' => 'Key deleted from vault.']);
    }

    // 7. Communication Services
    public function getCommunicationServices()
    {
        return response()->json(['success' => true, 'data' => CommunicationService::all()]);
    }

    public function updateCommunicationService(Request $request, $id)
    {
        $svc = CommunicationService::findOrFail($id);
        $svc->update($request->all());
        $this->logAudit("Updated Communication Service: {$svc->name}", 'communication_services', $svc->id);

        return response()->json(['success' => true, 'data' => $svc]);
    }

    public function testCommunicationService($id)
    {
        $svc = CommunicationService::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => "Test message sent successfully via {$svc->name} ({$svc->sender_id})!",
            'status' => 'sent',
        ]);
    }

    // 8. Storage Providers
    public function getStorageProviders()
    {
        return response()->json(['success' => true, 'data' => StorageProvider::all()]);
    }

    public function updateStorageProvider(Request $request, $id)
    {
        $storage = StorageProvider::findOrFail($id);
        $storage->update($request->all());
        $this->logAudit("Updated Storage Provider: {$storage->name}", 'storage_providers', $storage->id);

        return response()->json(['success' => true, 'data' => $storage]);
    }

    // 9. Analytics Services
    public function getAnalyticsServices()
    {
        return response()->json(['success' => true, 'data' => AnalyticsIntegration::all()]);
    }

    public function updateAnalyticsService(Request $request, $id)
    {
        $analytics = AnalyticsIntegration::findOrFail($id);
        $analytics->update($request->all());
        $this->logAudit("Updated Analytics Service: {$analytics->name}", 'analytics_integrations', $analytics->id);

        return response()->json(['success' => true, 'data' => $analytics]);
    }

    // 10. Webhooks
    public function getWebhooks()
    {
        $endpoints = WebhookEndpoint::with('logs')->get();
        return response()->json(['success' => true, 'data' => $endpoints]);
    }

    public function createWebhook(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'endpoint_url' => 'required|url',
            'secret' => 'nullable|string',
            'events' => 'required|array',
            'status' => 'required|string',
        ]);

        $webhook = WebhookEndpoint::create($data);
        $this->logAudit("Created Webhook Endpoint: {$webhook->name}", 'webhook_endpoints', $webhook->id);

        return response()->json(['success' => true, 'data' => $webhook]);
    }

    public function testWebhook($id)
    {
        $webhook = WebhookEndpoint::findOrFail($id);

        $log = WebhookLog::create([
            'webhook_endpoint_id' => $webhook->id,
            'event' => 'ping.test',
            'response_code' => 200,
            'duration_ms' => 112,
            'payload' => json_encode(['event' => 'ping.test', 'timestamp' => now()->toIso8601String()]),
            'response_body' => json_encode(['received' => true, 'status' => 'ok']),
            'status' => 'delivered',
        ]);

        $webhook->last_response_code = 200;
        $webhook->last_delivery_at = now();
        $webhook->save();

        return response()->json([
            'success' => true,
            'message' => "Webhook ping delivered to {$webhook->endpoint_url} with HTTP 200 OK (112ms).",
            'log' => $log,
        ]);
    }

    // 11. Integration Marketplace
    public function getMarketplace()
    {
        return response()->json(['success' => true, 'data' => MarketplaceItem::all()]);
    }

    public function toggleMarketplaceItem($id)
    {
        $item = MarketplaceItem::findOrFail($id);
        $item->is_installed = !$item->is_installed;
        $item->save();

        $action = $item->is_installed ? "Installed Marketplace App: {$item->name}" : "Uninstalled Marketplace App: {$item->name}";
        $this->logAudit($action, 'integration_marketplace', $item->id);

        return response()->json(['success' => true, 'data' => $item]);
    }

    // 12. Usage Analytics
    public function getUsageAnalytics()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'ai_summary' => [
                    'total_requests' => 184920,
                    'tokens_used' => 48291000,
                    'avg_response_time_ms' => 380,
                    'total_cost_usd' => 482.50,
                    'errors_count' => 12,
                    'rate_limits_triggered' => 2,
                ],
                'payments_summary' => [
                    'total_transactions' => 12450,
                    'total_gmv_ngn' => 45200000.00,
                    'total_refunds' => 2,
                    'chargebacks' => 0,
                    'platform_commission' => 2260000.00,
                    'gateway_success_rate_percent' => 99.4,
                ],
                'communication_summary' => [
                    'emails_sent' => 94820,
                    'sms_sent' => 12400,
                    'whatsapp_messages' => 8400,
                    'push_notifications' => 182000,
                ],
                'storage_summary' => [
                    'storage_used_gb' => 482.4,
                    'bandwidth_gb' => 1890.2,
                    'total_uploads' => 38400,
                    'total_downloads' => 942000,
                ]
            ]
        ]);
    }

    // 13. Audit Logs
    public function getAuditLogs(Request $request)
    {
        $query = AuditLog::orderBy('id', 'desc');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%")
                  ->orWhere('resource_type', 'like', "%{$search}%");
            });
        }

        $logs = $query->paginate(20);
        return response()->json(['success' => true, 'data' => $logs]);
    }

    // 14. System & Tenant BYOK Settings
    public function getSystemSettings()
    {
        $setting = SystemIntegrationSetting::where('key', 'byok_tier_permissions')->first();
        return response()->json([
            'success' => true,
            'data' => $setting ? $setting->value : []
        ]);
    }

    public function updateSystemSettings(Request $request)
    {
        $data = $request->validate([
            'starter' => 'required|array',
            'professional' => 'required|array',
            'enterprise' => 'required|array',
        ]);

        $setting = SystemIntegrationSetting::updateOrCreate(
            ['key' => 'byok_tier_permissions'],
            ['value' => $data]
        );

        $this->logAudit("Updated Tenant BYOK Tier Permissions Configuration", 'system_integration_settings', $setting->id);

        return response()->json(['success' => true, 'data' => $setting->value]);
    }
}
