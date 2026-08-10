<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Payment Gateway Configuration Expanded Fields
        if (Schema::hasTable('payment_gateway_configs')) {
            Schema::table('payment_gateway_configs', function (Blueprint $table) {
                if (!Schema::hasColumn('payment_gateway_configs', 'merchant_id')) {
                    $table->string('merchant_id')->nullable();
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'encryption_key')) {
                    $table->string('encryption_key')->nullable();
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'callback_url')) {
                    $table->string('callback_url')->nullable();
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'currency')) {
                    $table->string('currency')->default('USD');
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'transaction_timeout')) {
                    $table->integer('transaction_timeout')->default(300);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'settlement_delay_days')) {
                    $table->integer('settlement_delay_days')->default(1);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'retry_attempts')) {
                    $table->integer('retry_attempts')->default(3);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'absorb_gateway_fee')) {
                    $table->boolean('absorb_gateway_fee')->default(false);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'pass_fee_to_customer')) {
                    $table->boolean('pass_fee_to_customer')->default(true);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'flat_fee')) {
                    $table->decimal('flat_fee', 10, 2)->default(0.00);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'min_fee')) {
                    $table->decimal('min_fee', 10, 2)->default(0.50);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'max_fee')) {
                    $table->decimal('max_fee', 10, 2)->default(50.00);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'vat_rate')) {
                    $table->decimal('vat_rate', 5, 2)->default(7.50);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'instant_settlement_fee')) {
                    $table->decimal('instant_settlement_fee', 5, 2)->default(1.00);
                }
                if (!Schema::hasColumn('payment_gateway_configs', 'status')) {
                    $table->string('status')->default('active');
                }
            });
        }

        // 2. Incoming Webhooks Log Table
        if (!Schema::hasTable('payment_webhooks')) {
            Schema::create('payment_webhooks', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('gateway');
                $table->string('event_type');
                $table->json('payload')->nullable();
                $table->json('response')->nullable();
                $table->string('status')->default('success');
                $table->integer('retry_count')->default(0);
                $table->timestamps();
            });
        }

        // 3. Refund Center Table
        if (!Schema::hasTable('refund_requests')) {
            Schema::create('refund_requests', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('order_id')->nullable();
                $table->uuid('user_id')->nullable();
                $table->decimal('amount', 12, 2);
                $table->string('reason');
                $table->string('type')->default('full');
                $table->string('status')->default('pending');
                $table->timestamp('approved_at')->nullable();
                $table->timestamps();
            });
        }

        // 4. AI Fleet Expanded Providers
        if (Schema::hasTable('ai_providers')) {
            Schema::table('ai_providers', function (Blueprint $table) {
                if (!Schema::hasColumn('ai_providers', 'priority')) {
                    $table->integer('priority')->default(1);
                }
                if (!Schema::hasColumn('ai_providers', 'fallback_provider')) {
                    $table->string('fallback_provider')->nullable();
                }
                if (!Schema::hasColumn('ai_providers', 'cost_per_1k_tokens')) {
                    $table->decimal('cost_per_1k_tokens', 8, 4)->default(0.0015);
                }
                if (!Schema::hasColumn('ai_providers', 'avg_latency_ms')) {
                    $table->integer('avg_latency_ms')->default(350);
                }
                if (!Schema::hasColumn('ai_providers', 'requests_today')) {
                    $table->integer('requests_today')->default(0);
                }
                if (!Schema::hasColumn('ai_providers', 'tokens_today')) {
                    $table->integer('tokens_today')->default(0);
                }
                if (!Schema::hasColumn('ai_providers', 'daily_limit')) {
                    $table->integer('daily_limit')->default(500000);
                }
            });
        }

        // 5. AI Feature Model Assignments
        if (!Schema::hasTable('ai_feature_models')) {
            Schema::create('ai_feature_models', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('feature_code');
                $table->string('feature_name');
                $table->string('provider_code')->default('openai');
                $table->string('model_name')->default('gpt-4o');
                $table->decimal('temperature', 3, 2)->default(0.70);
                $table->integer('max_tokens')->default(2048);
                $table->timestamps();
            });
        }

        // 6. AI System Prompt Library
        if (!Schema::hasTable('ai_prompts')) {
            Schema::create('ai_prompts', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('category');
                $table->string('title');
                $table->text('prompt_text');
                $table->integer('version')->default(1);
                $table->boolean('is_published')->default(true);
                $table->timestamps();
            });
        }

        // 7. AI Request Execution Logs
        if (!Schema::hasTable('ai_logs')) {
            Schema::create('ai_logs', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id')->nullable();
                $table->string('feature_code');
                $table->string('provider_code');
                $table->string('model_name');
                $table->integer('tokens_used')->default(0);
                $table->decimal('cost', 10, 6)->default(0.000000);
                $table->integer('latency_ms')->default(0);
                $table->string('status')->default('success');
                $table->text('prompt_snippet')->nullable();
                $table->text('response_snippet')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_logs');
        Schema::dropIfExists('ai_prompts');
        Schema::dropIfExists('ai_feature_models');
        Schema::dropIfExists('refund_requests');
        Schema::dropIfExists('payment_webhooks');
    }
};
