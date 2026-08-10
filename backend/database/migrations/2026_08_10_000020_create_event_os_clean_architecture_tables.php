<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add verification and subscription columns to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'verification_status')) {
                $table->string('verification_status')->default('unverified'); // unverified, pending, approved, rejected
            }
            if (!Schema::hasColumn('users', 'subscription_plan')) {
                $table->string('subscription_plan')->default('starter'); // starter, pro, enterprise
            }
            if (!Schema::hasColumn('users', 'verified_badge')) {
                $table->boolean('verified_badge')->default(false);
            }
        });

        // 2. Organizer KYC Verifications Table
        Schema::create('organizer_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('tenant_id')->nullable();
            $table->string('business_name');
            $table->string('business_type')->default('sole_proprietorship'); // sole_proprietorship, registered_company, non_profit
            $table->string('phone');
            $table->string('country')->default('NG');
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('account_name');
            $table->string('gov_id_url')->nullable();
            $table->string('selfie_url')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected, changes_requested
            $table->text('rejection_reason')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->uuid('verified_by')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 3. Events Table
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('category')->default('Music');
            $table->string('banner_url')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->string('timezone')->default('Africa/Lagos');
            $table->string('venue_name')->nullable();
            $table->string('venue_address')->nullable();
            $table->string('city')->default('Lagos');
            $table->string('country')->default('Nigeria');
            $table->boolean('is_published')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->string('website_template')->default('music_festival');
            $table->text('marketing_copy')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 4. Ticket Types Table
        Schema::create('ticket_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('event_id');
            $table->uuid('tenant_id');
            $table->string('name');
            $table->decimal('price', 10, 2)->default(0.00);
            $table->string('currency')->default('USD');
            $table->integer('quantity_available')->default(100);
            $table->integer('quantity_sold')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 5. Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_number')->unique();
            $table->uuid('event_id');
            $table->uuid('tenant_id');
            $table->uuid('user_id')->nullable(); // buyer
            $table->decimal('subtotal', 10, 2);
            $table->decimal('platform_fee', 10, 2);
            $table->decimal('gateway_fee', 10, 2);
            $table->decimal('total_charged', 10, 2);
            $table->string('currency')->default('USD');
            $table->string('payment_status')->default('paid'); // pending, paid, failed, refunded
            $table->string('payment_gateway')->default('paystack');
            $table->string('payment_reference')->nullable();
            $table->string('buyer_name');
            $table->string('buyer_email');
            $table->timestamps();

            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 6. Tickets Table (Passes with QR Codes)
        Schema::create('tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ticket_code')->unique();
            $table->uuid('order_id');
            $table->uuid('event_id');
            $table->uuid('ticket_type_id');
            $table->uuid('user_id')->nullable();
            $table->string('qr_code_url')->nullable();
            $table->string('status')->default('valid'); // valid, checked_in, cancelled
            $table->dateTime('checked_in_at')->nullable();
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('ticket_type_id')->references('id')->on('ticket_types')->onDelete('cascade');
        });

        // 7. Double-Entry Accounting Ledger Engine Table
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('order_id')->nullable();
            $table->string('type'); // ticket_sale, platform_fee, gateway_fee, payout_request, payout_disbursed, refund
            $table->string('direction'); // credit, debit
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('USD');
            $table->string('account_type'); // organizer_wallet, platform_revenue, gateway_expense, payout_settlement
            $table->string('description');
            $table->string('reference')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 8. Payout Requests Table
        Schema::create('payout_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id');
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('USD');
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('account_name');
            $table->string('status')->default('pending'); // pending, completed, rejected
            $table->text('rejection_reason')->nullable();
            $table->timestamp('disbursed_at')->nullable();
            $table->uuid('disbursed_by')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 9. Organizer Pro Websites Table
        Schema::create('organizer_websites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->unique();
            $table->string('subdomain')->unique(); // e.g. festival.getvnt.com
            $table->string('custom_domain')->nullable()->unique();
            $table->string('template')->default('music_festival');
            $table->string('theme_color')->default('#2563EB');
            $table->string('accent_color')->default('#7C3AED');
            $table->string('site_title');
            $table->string('tagline')->nullable();
            $table->boolean('is_published')->default(true);
            $table->boolean('dns_verified')->default(false);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // 10. Wishlists Table
        Schema::create('wishlists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('event_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->unique(['user_id', 'event_id']);
        });

        // 11. Community Messages Table
        Schema::create('community_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('tenant_id')->nullable();
            $table->uuid('event_id')->nullable();
            $table->text('message');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 12. User Notifications Table
        Schema::create('user_notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->string('type')->default('info');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 13. CMS Landing Sections Table
        Schema::create('cms_landing_sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('section_key')->unique(); // hero_banner, features_grid, faq_accordion, pricing_plans
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->json('content')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_landing_sections');
        Schema::dropIfExists('user_notifications');
        Schema::dropIfExists('community_messages');
        Schema::dropIfExists('wishlists');
        Schema::dropIfExists('organizer_websites');
        Schema::dropIfExists('payout_requests');
        Schema::dropIfExists('ledger_entries');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('ticket_types');
        Schema::dropIfExists('events');
        Schema::dropIfExists('organizer_verifications');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['verification_status', 'subscription_plan', 'verified_badge']);
        });
    }
};
