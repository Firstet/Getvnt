<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Payment Gateway Configs Table
        if (!Schema::hasTable('payment_gateway_configs')) {
            Schema::create('payment_gateway_configs', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('provider'); // paystack, flutterwave, stripe, monnify, square
                $table->string('public_key')->nullable();
                $table->string('secret_key')->nullable();
                $table->string('webhook_secret')->nullable();
                $table->string('environment')->default('sandbox'); // sandbox, production
                $table->boolean('is_enabled')->default(true);
                $table->boolean('is_default')->default(false);
                $table->timestamps();
            });
        }

        // 2. Admin Audit Logs Table
        if (!Schema::hasTable('admin_audit_logs')) {
            Schema::create('admin_audit_logs', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id')->nullable();
                $table->string('user_email')->nullable();
                $table->string('action');
                $table->string('target_type')->nullable();
                $table->string('target_id')->nullable();
                $table->string('ip_address')->nullable();
                $table->string('user_agent')->nullable();
                $table->json('payload_before')->nullable();
                $table->json('payload_after')->nullable();
                $table->timestamps();
            });
        }

        // 3. System Settings Table
        if (!Schema::hasTable('system_settings')) {
            Schema::create('system_settings', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->string('group')->default('general');
                $table->timestamps();
            });
        }

        // 4. Broadcast Notifications Table
        if (!Schema::hasTable('broadcast_notifications')) {
            Schema::create('broadcast_notifications', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('title');
                $table->text('message');
                $table->string('channel')->default('push'); // push, email, sms, whatsapp, announcement_bar
                $table->string('target_role')->default('all'); // all, attendee, organizer
                $table->boolean('is_published')->default(true);
                $table->timestamp('published_at')->nullable();
                $table->timestamps();
            });
        }

        // 5. Promo Codes Table
        if (!Schema::hasTable('promo_codes')) {
            Schema::create('promo_codes', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('code')->unique();
                $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage');
                $table->decimal('discount_value', 10, 2);
                $table->integer('max_uses')->default(100);
                $table->integer('uses_count')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_codes');
        Schema::dropIfExists('broadcast_notifications');
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('admin_audit_logs');
        Schema::dropIfExists('payment_gateway_configs');
    }
};
