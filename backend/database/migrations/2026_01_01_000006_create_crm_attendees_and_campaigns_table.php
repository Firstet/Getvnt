<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crm_attendees', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->integer('total_orders')->default(0);
            $table->decimal('total_spent', 12, 2)->default(0.00);
            $table->dateTime('last_attended_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->unique(['tenant_id', 'email']);
        });

        Schema::create('campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('name');
            $table->enum('channel', ['email', 'sms', 'whatsapp', 'push'])->default('email');
            $table->string('subject')->nullable();
            $table->longText('body');
            $table->integer('recipient_count')->default(0);
            $table->enum('status', ['draft', 'scheduled', 'sent', 'failed'])->default('draft');
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        Schema::create('coupons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('event_id')->nullable()->index();
            $table->string('code');
            $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('discount_value', 10, 2);
            $table->integer('max_uses')->default(100);
            $table->integer('used_count')->default(0);
            $table->dateTime('valid_until')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->unique(['tenant_id', 'code']);
        });

        Schema::create('affiliates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('event_id')->index();
            $table->string('code')->unique();
            $table->string('promoter_name');
            $table->string('promoter_email');
            $table->decimal('commission_rate', 5, 2)->default(5.00); // 5%
            $table->integer('clicks_count')->default(0);
            $table->integer('sales_count')->default(0);
            $table->decimal('total_earned', 12, 2)->default(0.00);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliates');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('crm_attendees');
    }
};
