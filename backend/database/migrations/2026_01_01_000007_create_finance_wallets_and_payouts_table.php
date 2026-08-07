<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->unique();
            $table->decimal('balance', 14, 2)->default(0.00);
            $table->decimal('pending_balance', 14, 2)->default(0.00);
            $table->string('currency', 3)->default('NGN');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        Schema::create('payouts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('NGN');
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('account_name');
            $table->string('bank_code')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'rejected'])->default('pending');
            $table->dateTime('processed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('order_id')->nullable()->index();
            $table->enum('type', ['ticket_sale', 'platform_fee', 'payout', 'refund'])->default('ticket_sale');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('NGN');
            $table->decimal('fee_amount', 12, 2)->default(0.00);
            $table->decimal('net_amount', 12, 2);
            $table->string('reference')->unique();
            $table->enum('status', ['successful', 'pending', 'failed'])->default('successful');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('payouts');
        Schema::dropIfExists('wallets');
    }
};
