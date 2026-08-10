<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Integration Categories & Base Providers
        if (!Schema::hasTable('integration_categories')) {
            Schema::create('integration_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('icon')->nullable();
                $table->text('description')->nullable();
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('integration_providers')) {
            Schema::create('integration_providers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('category');
                $table->string('logo')->nullable();
                $table->text('description')->nullable();
                $table->string('status')->default('active'); // active, inactive, testing, error
                $table->json('config_schema')->nullable();
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        // 2. AI Providers & Routing
        if (!Schema::hasTable('ai_providers')) {
            Schema::create('ai_providers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('logo')->nullable();
                $table->text('description')->nullable();
                $table->string('status')->default('active');
                $table->text('api_key')->nullable(); // Encrypted
                $table->string('org_id')->nullable();
                $table->string('base_url')->nullable();
                $table->string('default_model')->default('gpt-4o');
                $table->json('available_models')->nullable();
                $table->integer('max_tokens')->default(4096);
                $table->float('temperature')->default(0.7);
                $table->float('top_p')->default(1.0);
                $table->integer('timeout_seconds')->default(30);
                $table->integer('retry_attempts')->default(3);
                $table->integer('daily_limit')->default(100000);
                $table->decimal('monthly_budget', 12, 2)->default(1000.00);
                $table->decimal('cost_per_1k_tokens', 8, 4)->default(0.002);
                $table->string('rate_limits')->nullable();
                $table->text('notes')->nullable();
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('ai_routes')) {
            Schema::create('ai_routes', function (Blueprint $table) {
                $table->id();
                $table->string('feature_key')->unique();
                $table->string('feature_name');
                $table->foreignId('primary_provider_id')->nullable()->constrained('ai_providers')->nullOnDelete();
                $table->foreignId('fallback_provider_id')->nullable()->constrained('ai_providers')->nullOnDelete();
                $table->string('preferred_model')->nullable();
                $table->integer('max_tokens')->default(2048);
                $table->float('temperature')->default(0.7);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // 3. Payment Gateways
        if (!Schema::hasTable('payment_gateways')) {
            Schema::create('payment_gateways', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('logo')->nullable();
                $table->text('public_key')->nullable();
                $table->text('secret_key')->nullable(); // Encrypted
                $table->text('test_public_key')->nullable();
                $table->text('test_secret_key')->nullable(); // Encrypted
                $table->text('webhook_secret')->nullable();
                $table->string('callback_url')->nullable();
                $table->string('environment')->default('live'); // live, test
                $table->string('currency')->default('NGN');
                $table->json('supported_countries')->nullable();
                $table->decimal('transaction_fee_percent', 5, 2)->default(1.50);
                $table->decimal('flat_fee', 10, 2)->default(100.00);
                $table->string('status')->default('active');
                $table->boolean('is_default')->default(false);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('tenant_payment_connections')) {
            Schema::create('tenant_payment_connections', function (Blueprint $table) {
                $table->id();
                $table->uuid('tenant_id');
                $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
                $table->foreignId('payment_gateway_id')->constrained('payment_gateways')->cascadeOnDelete();
                $table->text('custom_public_key')->nullable();
                $table->text('custom_secret_key')->nullable();
                $table->boolean('is_enabled')->default(true);
                $table->string('mode')->default('platform'); // platform, tenant_byok
                $table->json('config')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('tenant_ai_connections')) {
            Schema::create('tenant_ai_connections', function (Blueprint $table) {
                $table->id();
                $table->uuid('tenant_id');
                $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
                $table->foreignId('ai_provider_id')->constrained('ai_providers')->cascadeOnDelete();
                $table->text('custom_api_key')->nullable();
                $table->boolean('is_enabled')->default(true);
                $table->json('config')->nullable();
                $table->timestamps();
            });
        }

        // 4. Commission Engine Rules
        if (!Schema::hasTable('commission_rules')) {
            Schema::create('commission_rules', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('rule_type')->default('percentage'); // percentage, flat, hybrid
                $table->decimal('platform_fee', 8, 2)->default(5.00);
                $table->decimal('organizer_fee', 8, 2)->default(0.00);
                $table->decimal('processing_fee', 8, 2)->default(1.50);
                $table->decimal('vat_percent', 5, 2)->default(7.50);
                $table->decimal('tax_percent', 5, 2)->default(0.00);
                $table->decimal('service_charge', 8, 2)->default(100.00);
                $table->decimal('min_charge', 8, 2)->default(50.00);
                $table->decimal('max_charge', 8, 2)->default(50000.00);
                $table->string('plan_scope')->default('all'); // all, starter, professional, enterprise
                $table->string('country_scope')->default('all');
                $table->string('currency_scope')->default('all');
                $table->string('gateway_scope')->default('all');
                $table->string('event_category_scope')->default('all');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // 5. API Key Vault
        if (!Schema::hasTable('api_keys')) {
            Schema::create('api_keys', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('category'); // AI, Payment, Email, SMS, Maps, Storage, Analytics, Security, Custom
                $table->string('provider');
                $table->text('encrypted_value');
                $table->string('environment')->default('production'); // production, staging, development
                $table->timestamp('expiration_date')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->string('created_by')->default('Super Admin');
                $table->string('updated_by')->default('Super Admin');
                $table->text('notes')->nullable();
                $table->boolean('is_active')->default(true);
                $table->boolean('is_archived')->default(false);
                $table->timestamps();
            });
        }

        // 6. Communication Services
        if (!Schema::hasTable('communication_services')) {
            Schema::create('communication_services', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('type'); // smtp, sendgrid, mailgun, ses, resend, twilio, termii, whatsapp, firebase
                $table->text('api_key')->nullable(); // Encrypted
                $table->string('sender_id')->nullable();
                $table->string('domain')->nullable();
                $table->json('templates')->nullable();
                $table->integer('rate_limit_per_min')->default(300);
                $table->string('status')->default('active');
                $table->boolean('is_default')->default(false);
                $table->timestamps();
            });
        }

        // 7. Storage Providers
        if (!Schema::hasTable('storage_providers')) {
            Schema::create('storage_providers', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('driver'); // s3, r2, gcs, azure, backblaze, do_spaces, local
                $table->string('bucket')->nullable();
                $table->string('region')->nullable();
                $table->string('endpoint')->nullable();
                $table->text('access_key')->nullable();
                $table->text('secret_key')->nullable(); // Encrypted
                $table->string('cdn_url')->nullable();
                $table->string('status')->default('active');
                $table->boolean('is_default')->default(false);
                $table->timestamps();
            });
        }

        // 8. Analytics Integrations
        if (!Schema::hasTable('analytics_integrations')) {
            Schema::create('analytics_integrations', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('service'); // ga, meta_pixel, tiktok, clarity, hotjar, mixpanel, posthog
                $table->string('tracking_id')->nullable();
                $table->string('environment')->default('production');
                $table->boolean('is_verified')->default(true);
                $table->string('status')->default('active');
                $table->json('config')->nullable();
                $table->timestamps();
            });
        }

        // 9. Webhooks & Logs
        if (!Schema::hasTable('webhook_endpoints')) {
            Schema::create('webhook_endpoints', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('endpoint_url');
                $table->text('secret')->nullable();
                $table->json('events')->nullable();
                $table->integer('max_retries')->default(3);
                $table->string('status')->default('active');
                $table->integer('last_response_code')->nullable();
                $table->timestamp('last_delivery_at')->nullable();
                $table->timestamp('next_retry_at')->nullable();
                $table->text('payload_preview')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('webhook_logs')) {
            Schema::create('webhook_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('webhook_endpoint_id')->constrained('webhook_endpoints')->cascadeOnDelete();
                $table->string('event');
                $table->integer('response_code')->default(200);
                $table->integer('duration_ms')->default(120);
                $table->text('payload')->nullable();
                $table->text('response_body')->nullable();
                $table->string('status')->default('delivered'); // delivered, failed, pending
                $table->timestamps();
            });
        }

        // 10. Integration Marketplace
        if (!Schema::hasTable('integration_marketplace')) {
            Schema::create('integration_marketplace', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('category');
                $table->string('logo')->nullable();
                $table->text('description')->nullable();
                $table->string('developer')->default('GETVNT Core');
                $table->string('version')->default('1.0.0');
                $table->decimal('rating', 3, 2)->default(4.9);
                $table->string('doc_url')->nullable();
                $table->boolean('is_installed')->default(false);
                $table->boolean('is_featured')->default(false);
                $table->json('config_schema')->nullable();
                $table->timestamps();
            });
        }

        // 11. Usage Logs & Audit Logs
        if (!Schema::hasTable('integration_usage_logs')) {
            Schema::create('integration_usage_logs', function (Blueprint $table) {
                $table->id();
                $table->string('integration_type'); // ai, payment, email, sms, storage
                $table->string('provider_name');
                $table->string('endpoint')->nullable();
                $table->integer('status_code')->default(200);
                $table->integer('tokens_used')->default(0);
                $table->decimal('cost', 10, 4)->default(0.0000);
                $table->integer('duration_ms')->default(150);
                $table->uuid('tenant_id')->nullable();
                $table->foreign('tenant_id')->references('id')->on('tenants')->nullOnDelete();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->id();
                $table->string('user_name')->default('Super Admin');
                $table->string('user_role')->default('Platform Super Admin');
                $table->string('ip_address')->default('127.0.0.1');
                $table->string('browser')->default('Chrome Mac OS');
                $table->string('device')->default('MacBook Pro');
                $table->string('action'); // Key Created, Gateway Connected, Provider Disabled, etc.
                $table->string('resource_type')->nullable();
                $table->string('resource_id')->nullable();
                $table->json('before_state')->nullable();
                $table->json('after_state')->nullable();
                $table->timestamps();
            });
        }

        // 12. System Settings (BYOK & Multi-Tenant Rules)
        if (!Schema::hasTable('system_integration_settings')) {
            Schema::create('system_integration_settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->json('value')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('system_integration_settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('integration_usage_logs');
        Schema::dropIfExists('integration_marketplace');
        Schema::dropIfExists('webhook_logs');
        Schema::dropIfExists('webhook_endpoints');
        Schema::dropIfExists('analytics_integrations');
        Schema::dropIfExists('storage_providers');
        Schema::dropIfExists('communication_services');
        Schema::dropIfExists('api_keys');
        Schema::dropIfExists('commission_rules');
        Schema::dropIfExists('tenant_ai_connections');
        Schema::dropIfExists('tenant_payment_connections');
        Schema::dropIfExists('payment_gateways');
        Schema::dropIfExists('ai_routes');
        Schema::dropIfExists('ai_providers');
        Schema::dropIfExists('integration_providers');
        Schema::dropIfExists('integration_categories');
    }
};
