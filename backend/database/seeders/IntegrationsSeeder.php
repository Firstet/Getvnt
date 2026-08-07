<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AiProvider;
use App\Models\AiRoute;
use App\Models\PaymentGateway;
use App\Models\CommissionRule;
use App\Models\ApiKeyVault;
use App\Models\CommunicationService;
use App\Models\StorageProvider;
use App\Models\AnalyticsIntegration;
use App\Models\WebhookEndpoint;
use App\Models\MarketplaceItem;
use App\Models\AuditLog;
use App\Models\SystemIntegrationSetting;

class IntegrationsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. AI Providers
        $openai = AiProvider::create([
            'name' => 'OpenAI',
            'slug' => 'openai',
            'logo' => 'https://api.iconify.design/logos:openai-icon.svg',
            'description' => 'Leading AI provider with GPT-4o, GPT-4o-mini, and DALL-E 3 models',
            'status' => 'active',
            'api_key' => 'sk-proj-mock-openai-key-prod-9921',
            'org_id' => 'org-getvnt-core-01',
            'base_url' => 'https://api.openai.com/v1',
            'default_model' => 'gpt-4o',
            'available_models' => ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'dall-e-3'],
            'max_tokens' => 4096,
            'temperature' => 0.7,
            'cost_per_1k_tokens' => 0.0025,
            'daily_limit' => 500000,
            'monthly_budget' => 2500.00,
            'notes' => 'Primary LLM fleet driver for GETVNT AI Copywriter',
            'sort_order' => 1,
        ]);

        $anthropic = AiProvider::create([
            'name' => 'Anthropic Claude',
            'slug' => 'anthropic',
            'logo' => 'https://api.iconify.design/simple-icons:anthropic.svg',
            'description' => 'Claude 3.5 Sonnet & Haiku models for complex analytical and creative synthesis',
            'status' => 'active',
            'api_key' => 'sk-ant-api03-mock-key-848392',
            'org_id' => 'org-anthropic-getvnt',
            'base_url' => 'https://api.anthropic.com/v1',
            'default_model' => 'claude-3-5-sonnet-20241022',
            'available_models' => ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
            'max_tokens' => 8192,
            'temperature' => 0.5,
            'cost_per_1k_tokens' => 0.0030,
            'daily_limit' => 300000,
            'monthly_budget' => 1800.00,
            'notes' => 'Best for complex event agenda synthesis and multi-lingual translation',
            'sort_order' => 2,
        ]);

        $gemini = AiProvider::create([
            'name' => 'Google Gemini',
            'slug' => 'gemini',
            'logo' => 'https://api.iconify.design/logos:google-icon.svg',
            'description' => 'Gemini 2.0 Flash & Gemini 1.5 Pro multimodal high-speed intelligence',
            'status' => 'active',
            'api_key' => 'AIzaSyMockGeminiKey2026-X9281',
            'base_url' => 'https://generativelanguage.googleapis.com/v1beta',
            'default_model' => 'gemini-2.0-flash',
            'available_models' => ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
            'max_tokens' => 8192,
            'temperature' => 0.7,
            'cost_per_1k_tokens' => 0.0005,
            'daily_limit' => 1000000,
            'monthly_budget' => 1000.00,
            'notes' => 'Ultra low-cost high throughput provider',
            'sort_order' => 3,
        ]);

        $deepseek = AiProvider::create([
            'name' => 'DeepSeek AI',
            'slug' => 'deepseek',
            'logo' => 'https://api.iconify.design/simple-icons:deepseek.svg',
            'description' => 'DeepSeek-R1 reasoning model and DeepSeek V3 code/text engine',
            'status' => 'active',
            'api_key' => 'sk-deepseek-mock-key-7721839',
            'base_url' => 'https://api.deepseek.com/v1',
            'default_model' => 'deepseek-reasoner',
            'available_models' => ['deepseek-reasoner', 'deepseek-chat'],
            'max_tokens' => 4096,
            'temperature' => 0.6,
            'cost_per_1k_tokens' => 0.0004,
            'daily_limit' => 400000,
            'monthly_budget' => 800.00,
            'sort_order' => 4,
        ]);

        // 2. AI Feature Routes
        $features = [
            ['key' => 'event_description', 'name' => 'Event Description Generator', 'primary' => $openai->id, 'fallback' => $gemini->id, 'model' => 'gpt-4o'],
            ['key' => 'marketing_copy', 'name' => 'Marketing & Promotional Copy', 'primary' => $openai->id, 'fallback' => $anthropic->id, 'model' => 'gpt-4o'],
            ['key' => 'seo_optimization', 'name' => 'SEO Meta & Tags', 'primary' => $gemini->id, 'fallback' => $openai->id, 'model' => 'gemini-2.0-flash'],
            ['key' => 'translation', 'name' => 'Multi-Language Translation', 'primary' => $anthropic->id, 'fallback' => $gemini->id, 'model' => 'claude-3-5-sonnet-20241022'],
            ['key' => 'chatbot', 'name' => 'Attendee Chatbot Assistant', 'primary' => $gemini->id, 'fallback' => $openai->id, 'model' => 'gemini-2.0-flash'],
            ['key' => 'recommendations', 'name' => 'Event Recommendation Engine', 'primary' => $deepseek->id, 'fallback' => $gemini->id, 'model' => 'deepseek-reasoner'],
            ['key' => 'email_generation', 'name' => 'Email Campaign Copy', 'primary' => $anthropic->id, 'fallback' => $openai->id, 'model' => 'claude-3-5-haiku-20241022'],
            ['key' => 'content_moderation', 'name' => 'Content Moderation Filter', 'primary' => $openai->id, 'fallback' => $gemini->id, 'model' => 'gpt-4o-mini'],
        ];

        foreach ($features as $f) {
            AiRoute::create([
                'feature_key' => $f['key'],
                'feature_name' => $f['name'],
                'primary_provider_id' => $f['primary'],
                'fallback_provider_id' => $f['fallback'],
                'preferred_model' => $f['model'],
                'max_tokens' => 2048,
                'temperature' => 0.7,
                'is_active' => true,
            ]);
        }

        // 3. Payment Gateways
        PaymentGateway::create([
            'name' => 'Paystack',
            'slug' => 'paystack',
            'logo' => 'https://api.iconify.design/simple-icons:paystack.svg',
            'public_key' => 'pk_live_mock_paystack_public_key_99182',
            'secret_key' => 'sk_live_mock_paystack_secret_key_11928',
            'test_public_key' => 'pk_test_mock_paystack_test_public',
            'test_secret_key' => 'sk_test_mock_paystack_test_secret',
            'webhook_secret' => 'whsec_paystack_live_secret_key_88',
            'callback_url' => 'https://api.getvnt.com/v1/payments/paystack/callback',
            'environment' => 'live',
            'currency' => 'NGN',
            'supported_countries' => ['NG', 'GH', 'KE', 'ZA'],
            'transaction_fee_percent' => 1.50,
            'flat_fee' => 100.00,
            'status' => 'active',
            'is_default' => true,
            'sort_order' => 1,
        ]);

        PaymentGateway::create([
            'name' => 'Flutterwave',
            'slug' => 'flutterwave',
            'logo' => 'https://api.iconify.design/simple-icons:flutterwave.svg',
            'public_key' => 'FLWPUBK-mock-live-key-88271',
            'secret_key' => 'FLWSECK-mock-live-key-99281',
            'test_public_key' => 'FLWPUBK_TEST-mock-key',
            'test_secret_key' => 'FLWSECK_TEST-mock-key',
            'webhook_secret' => 'flw_whsec_mock_key_882',
            'callback_url' => 'https://api.getvnt.com/v1/payments/flutterwave/callback',
            'environment' => 'live',
            'currency' => 'NGN',
            'supported_countries' => ['NG', 'GH', 'KE', 'UG', 'RW'],
            'transaction_fee_percent' => 1.40,
            'flat_fee' => 50.00,
            'status' => 'active',
            'is_default' => false,
            'sort_order' => 2,
        ]);

        PaymentGateway::create([
            'name' => 'Stripe',
            'slug' => 'stripe',
            'logo' => 'https://api.iconify.design/logos:stripe.svg',
            'public_key' => 'pk_live_51M0000000000000000000000',
            'secret_key' => 'sk_live_51M0000000000000000000000',
            'test_public_key' => 'pk_test_51M0000000000000000000000',
            'test_secret_key' => 'sk_test_51M0000000000000000000000',
            'webhook_secret' => 'whsec_stripe_live_key_9921',
            'callback_url' => 'https://api.getvnt.com/v1/payments/stripe/webhook',
            'environment' => 'live',
            'currency' => 'USD',
            'supported_countries' => ['US', 'GB', 'CA', 'EU', 'AU'],
            'transaction_fee_percent' => 2.90,
            'flat_fee' => 0.30,
            'status' => 'active',
            'is_default' => false,
            'sort_order' => 3,
        ]);

        // 4. Commission Rules
        CommissionRule::create([
            'name' => 'Default Platform Standard Rule',
            'rule_type' => 'hybrid',
            'platform_fee' => 5.00,
            'organizer_fee' => 0.00,
            'processing_fee' => 1.50,
            'vat_percent' => 7.50,
            'service_charge' => 100.00,
            'min_charge' => 50.00,
            'max_charge' => 25000.00,
            'plan_scope' => 'all',
            'country_scope' => 'all',
            'currency_scope' => 'all',
            'gateway_scope' => 'all',
            'event_category_scope' => 'all',
            'is_active' => true,
        ]);

        CommissionRule::create([
            'name' => 'Enterprise Preferred Tier',
            'rule_type' => 'percentage',
            'platform_fee' => 2.50,
            'organizer_fee' => 0.00,
            'processing_fee' => 1.00,
            'vat_percent' => 7.50,
            'service_charge' => 0.00,
            'min_charge' => 0.00,
            'max_charge' => 100000.00,
            'plan_scope' => 'enterprise',
            'country_scope' => 'all',
            'currency_scope' => 'all',
            'gateway_scope' => 'all',
            'event_category_scope' => 'all',
            'is_active' => true,
        ]);

        // 5. API Key Vault
        ApiKeyVault::create([
            'name' => 'OpenAI Production Master Key',
            'category' => 'AI',
            'provider' => 'OpenAI',
            'encrypted_value' => 'sk-proj-mock-openai-key-prod-9921',
            'environment' => 'production',
            'expiration_date' => now()->addYear(),
            'last_used_at' => now()->subMinutes(12),
            'notes' => 'Primary production key for all automated copywriter services',
            'is_active' => true,
        ]);

        ApiKeyVault::create([
            'name' => 'Paystack Live Secret Key',
            'category' => 'Payment',
            'provider' => 'Paystack',
            'encrypted_value' => 'sk_live_mock_paystack_secret_key_11928',
            'environment' => 'production',
            'last_used_at' => now()->subMinutes(2),
            'notes' => 'Platform checkout settlement secret key',
            'is_active' => true,
        ]);

        ApiKeyVault::create([
            'name' => 'SendGrid Transactional Key',
            'category' => 'Email',
            'provider' => 'SendGrid',
            'encrypted_value' => 'SG.mock_sendgrid_key_99218273.88271',
            'environment' => 'production',
            'last_used_at' => now()->subMinutes(5),
            'notes' => 'Transactional tickets & receipt dispatcher',
            'is_active' => true,
        ]);

        // 6. Communication Services
        CommunicationService::create([
            'name' => 'SendGrid Mail',
            'slug' => 'sendgrid',
            'type' => 'sendgrid',
            'api_key' => 'SG.mock_sendgrid_key_99218273.88271',
            'sender_id' => 'tickets@getvnt.com',
            'domain' => 'mail.getvnt.com',
            'rate_limit_per_min' => 600,
            'status' => 'active',
            'is_default' => true,
        ]);

        CommunicationService::create([
            'name' => 'Twilio SMS & WhatsApp',
            'slug' => 'twilio',
            'type' => 'twilio',
            'api_key' => 'AC_mock_twilio_account_sid_99281',
            'sender_id' => '+1800GETVNT',
            'domain' => 'messaging.twilio.com',
            'rate_limit_per_min' => 200,
            'status' => 'active',
            'is_default' => false,
        ]);

        // 7. Storage Providers
        StorageProvider::create([
            'name' => 'Amazon Web Services S3',
            'slug' => 'aws-s3',
            'driver' => 's3',
            'bucket' => 'getvnt-media-production',
            'region' => 'eu-west-1',
            'endpoint' => 'https://s3.eu-west-1.amazonaws.com',
            'access_key' => 'AKIA_MOCK_AWS_ACCESS_KEY',
            'secret_key' => 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
            'cdn_url' => 'https://cdn.getvnt.com',
            'status' => 'active',
            'is_default' => true,
        ]);

        StorageProvider::create([
            'name' => 'Cloudflare R2 Storage',
            'slug' => 'cloudflare-r2',
            'driver' => 'r2',
            'bucket' => 'getvnt-assets-r2',
            'region' => 'auto',
            'endpoint' => 'https://r2.cloudflarestorage.com',
            'access_key' => 'r2_access_key_mock_992',
            'secret_key' => 'r2_secret_key_mock_88172',
            'cdn_url' => 'https://media.getvnt.com',
            'status' => 'active',
            'is_default' => false,
        ]);

        // 8. Analytics Services
        AnalyticsIntegration::create([
            'name' => 'Google Analytics 4',
            'slug' => 'ga4',
            'service' => 'ga',
            'tracking_id' => 'G-9821739281',
            'environment' => 'production',
            'is_verified' => true,
            'status' => 'active',
        ]);

        AnalyticsIntegration::create([
            'name' => 'Meta (Facebook) Pixel',
            'slug' => 'meta-pixel',
            'service' => 'meta_pixel',
            'tracking_id' => '998271625341',
            'environment' => 'production',
            'is_verified' => true,
            'status' => 'active',
        ]);

        // 9. Webhooks
        WebhookEndpoint::create([
            'name' => 'GETVNT Primary Event Webhook Listener',
            'endpoint_url' => 'https://webhooks.getvnt.com/v1/listener',
            'secret' => 'whsec_getvnt_live_88271',
            'events' => ['payment.success', 'ticket.issued', 'checkin.completed'],
            'max_retries' => 3,
            'status' => 'active',
            'last_response_code' => 200,
            'last_delivery_at' => now()->subMinutes(1),
            'payload_preview' => '{"event": "ticket.issued", "order_id": "ORD-2026-9912", "amount": 15000}',
        ]);

        // 10. Integration Marketplace
        MarketplaceItem::create([
            'name' => 'Mailchimp Sync',
            'slug' => 'mailchimp',
            'category' => 'Marketing',
            'logo' => 'https://api.iconify.design/logos:mailchimp-freddie.svg',
            'description' => 'Automatically synchronize event attendees and VIP ticket buyers to targeted Mailchimp email lists.',
            'developer' => 'GETVNT Official',
            'version' => '2.1.0',
            'rating' => 4.9,
            'doc_url' => 'https://docs.getvnt.com/integrations/mailchimp',
            'is_installed' => true,
            'is_featured' => true,
        ]);

        MarketplaceItem::create([
            'name' => 'Zapier Automation Hub',
            'slug' => 'zapier',
            'category' => 'Productivity',
            'logo' => 'https://api.iconify.design/simple-icons:zapier.svg',
            'description' => 'Connect GETVNT events and sales data to over 5,000+ web applications seamlessly via Zapier Zaps.',
            'developer' => 'GETVNT Official',
            'version' => '1.4.0',
            'rating' => 4.8,
            'doc_url' => 'https://docs.getvnt.com/integrations/zapier',
            'is_installed' => true,
            'is_featured' => true,
        ]);

        MarketplaceItem::create([
            'name' => 'Xero Accounting',
            'slug' => 'xero',
            'category' => 'Accounting',
            'logo' => 'https://api.iconify.design/simple-icons:xero.svg',
            'description' => 'Automate event ticket revenue reconciliation, VAT invoicing, and payouts directly into Xero Ledger.',
            'developer' => 'Xero Partner Team',
            'version' => '1.0.2',
            'rating' => 4.7,
            'doc_url' => 'https://docs.getvnt.com/integrations/xero',
            'is_installed' => false,
            'is_featured' => false,
        ]);

        // 11. System Integration Settings (BYOK Tier Configuration)
        SystemIntegrationSetting::create([
            'key' => 'byok_tier_permissions',
            'value' => [
                'starter' => [
                    'allow_custom_ai' => false,
                    'allow_custom_payment' => false,
                    'ai_monthly_token_quota' => 50000,
                ],
                'professional' => [
                    'allow_custom_ai' => false,
                    'allow_custom_payment' => true,
                    'supported_gateways' => ['paystack', 'flutterwave'],
                    'ai_monthly_token_quota' => 500000,
                ],
                'enterprise' => [
                    'allow_custom_ai' => true,
                    'allow_custom_payment' => true,
                    'supported_gateways' => ['paystack', 'flutterwave', 'stripe', 'monnify', 'paypal'],
                    'ai_monthly_token_quota' => -1, // Unlimited BYOK
                ],
            ]
        ]);

        // 12. Audit Logs
        AuditLog::create([
            'user_name' => 'Chief Technology Officer',
            'user_role' => 'Platform Super Admin',
            'ip_address' => '197.210.64.12',
            'browser' => 'Chrome 128 / macOS',
            'action' => 'Rotated Paystack Live Secret API Key',
            'resource_type' => 'payment_gateways',
            'resource_id' => '1',
            'before_state' => ['status' => 'active', 'environment' => 'live'],
            'after_state' => ['status' => 'active', 'environment' => 'live', 'key_rotated_at' => now()->toIso8601String()],
        ]);

        AuditLog::create([
            'user_name' => 'Lead AI Engineer',
            'user_role' => 'AI Fleet Operator',
            'ip_address' => '102.89.44.19',
            'browser' => 'Firefox 130 / macOS',
            'action' => 'Updated AI Route for Event Description to GPT-4o',
            'resource_type' => 'ai_routes',
            'resource_id' => '1',
            'before_state' => ['primary_provider' => 'gemini-2.0-flash'],
            'after_state' => ['primary_provider' => 'gpt-4o'],
        ]);
    }
}
