<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('organizer_verifications')) {
            Schema::table('organizer_verifications', function (Blueprint $table) {
                if (!Schema::hasColumn('organizer_verifications', 'ai_confidence_score')) {
                    $table->decimal('ai_confidence_score', 5, 2)->default(0.00);
                }
                if (!Schema::hasColumn('organizer_verifications', 'ai_recommendation')) {
                    $table->string('ai_recommendation')->default('requires_manual_review');
                }
                if (!Schema::hasColumn('organizer_verifications', 'ai_notes')) {
                    $table->text('ai_notes')->nullable();
                }
                if (!Schema::hasColumn('organizer_verifications', 'ai_auto_verified')) {
                    $table->boolean('ai_auto_verified')->default(false);
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('organizer_verifications')) {
            Schema::table('organizer_verifications', function (Blueprint $table) {
                $table->dropColumn(['ai_confidence_score', 'ai_recommendation', 'ai_notes', 'ai_auto_verified']);
            });
        }
    }
};
