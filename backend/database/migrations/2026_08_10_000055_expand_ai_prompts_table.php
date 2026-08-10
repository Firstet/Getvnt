<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('ai_prompts')) {
            Schema::table('ai_prompts', function (Blueprint $table) {
                if (!Schema::hasColumn('ai_prompts', 'description')) {
                    $table->text('description')->nullable();
                }
                if (!Schema::hasColumn('ai_prompts', 'provider_code')) {
                    $table->string('provider_code')->default('openai');
                }
                if (!Schema::hasColumn('ai_prompts', 'preferred_model')) {
                    $table->string('preferred_model')->default('gpt-4o');
                }
                if (!Schema::hasColumn('ai_prompts', 'temperature')) {
                    $table->decimal('temperature', 3, 2)->default(0.70);
                }
                if (!Schema::hasColumn('ai_prompts', 'max_tokens')) {
                    $table->integer('max_tokens')->default(2048);
                }
                if (!Schema::hasColumn('ai_prompts', 'top_p')) {
                    $table->decimal('top_p', 3, 2)->default(1.00);
                }
                if (!Schema::hasColumn('ai_prompts', 'frequency_penalty')) {
                    $table->decimal('frequency_penalty', 3, 2)->default(0.00);
                }
                if (!Schema::hasColumn('ai_prompts', 'presence_penalty')) {
                    $table->decimal('presence_penalty', 3, 2)->default(0.00);
                }
                if (!Schema::hasColumn('ai_prompts', 'role_scope')) {
                    $table->string('role_scope')->default('global');
                }
                if (!Schema::hasColumn('ai_prompts', 'created_by')) {
                    $table->string('created_by')->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('ai_prompts')) {
            Schema::table('ai_prompts', function (Blueprint $table) {
                $table->dropColumn([
                    'description', 'provider_code', 'preferred_model',
                    'temperature', 'max_tokens', 'top_p', 'frequency_penalty',
                    'presence_penalty', 'role_scope', 'created_by'
                ]);
            });
        }
    }
};
