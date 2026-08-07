<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('auth_providers')) {
            Schema::create('auth_providers', function (Blueprint $table) {
                $table->id();
                $table->string('provider_slug')->unique();
                $table->string('name');
                $table->boolean('is_enabled')->default(false);
                $table->text('client_id')->nullable();
                $table->text('client_secret')->nullable();
                $table->text('redirect_uri')->nullable();
                $table->json('scopes')->nullable();
                $table->json('extra_settings')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('cms_pages')) {
            Schema::create('cms_pages', function (Blueprint $table) {
                $table->id();
                $table->string('slug')->unique();
                $table->string('title');
                $table->string('subtitle')->nullable();
                $table->longText('body_markdown')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_description')->nullable();
                $table->boolean('is_published')->default(true);
                $table->string('author')->default('Super Admin');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('cms_sections')) {
            Schema::create('cms_sections', function (Blueprint $table) {
                $table->id();
                $table->string('page_slug')->default('landing');
                $table->string('section_key');
                $table->string('title');
                $table->text('subtitle')->nullable();
                $table->boolean('is_visible')->default(true);
                $table->integer('order_index')->default(0);
                $table->json('content_json')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('cms_sections', function (Blueprint $table) {
                if (!Schema::hasColumn('cms_sections', 'page_slug')) {
                    $table->string('page_slug')->default('landing')->nullable();
                }
                if (!Schema::hasColumn('cms_sections', 'section_key')) {
                    $table->string('section_key')->default('hero')->nullable();
                }
                if (!Schema::hasColumn('cms_sections', 'subtitle')) {
                    $table->text('subtitle')->nullable();
                }
                if (!Schema::hasColumn('cms_sections', 'is_visible')) {
                    $table->boolean('is_visible')->default(true);
                }
                if (!Schema::hasColumn('cms_sections', 'order_index')) {
                    $table->integer('order_index')->default(0);
                }
                if (!Schema::hasColumn('cms_sections', 'content_json')) {
                    $table->json('content_json')->nullable();
                }
            });
        }

        if (!Schema::hasTable('platform_updates')) {
            Schema::create('platform_updates', function (Blueprint $table) {
                $table->id();
                $table->string('version');
                $table->string('filename');
                $table->string('status')->default('pending'); // pending, in_progress, completed, failed, rolled_back
                $table->longText('log_output')->nullable();
                $table->text('backup_path')->nullable();
                $table->timestamp('installed_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_updates');
        Schema::dropIfExists('cms_sections');
        Schema::dropIfExists('cms_pages');
        Schema::dropIfExists('auth_providers');
    }
};
