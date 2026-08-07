<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->nullable()->index();
            $table->uuid('user_id')->nullable()->index();
            $table->enum('provider', ['openai', 'anthropic', 'gemini', 'deepseek', 'openrouter'])->default('openai');
            $table->enum('feature', ['copywriter', 'poster', 'pricing', 'seo', 'support'])->default('copywriter');
            $table->text('prompt_summary')->nullable();
            $table->integer('prompt_tokens')->default(0);
            $table->integer('completion_tokens')->default(0);
            $table->decimal('cost', 8, 4)->default(0.0000);
            $table->enum('status', ['success', 'failed'])->default('success');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_logs');
    }
};
