<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. News Feeds & Content Sources
        Schema::create('news_sources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // Pulse Nigeria, BellaNaija, NotJustOk, BBC, etc.
            $table->string('url')->nullable();
            $table->string('rss_url')->nullable();
            $table->string('region')->default('Global'); // Nigeria, West Africa, East Africa, Europe, Global, etc.
            $table->string('category')->default('Entertainment'); // Music, Movies, Celebrities, Events, Fashion, etc.
            $table->boolean('is_enabled')->default(true);
            $table->integer('update_frequency_minutes')->default(10);
            $table->timestamp('last_fetched_at')->nullable();
            $table->string('fetch_status')->default('idle'); // idle, fetching, success, error
            $table->timestamps();
        });

        // 2. News Articles Table
        Schema::create('news_articles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('headline');
            $table->string('subtitle')->nullable();
            $table->string('slug')->unique();
            $table->text('ai_summary')->nullable();
            $table->longText('content')->nullable(); // Detailed Breakdown & Editorial Rewrite
            $table->json('ai_insights')->nullable(); // Why it matters, industry impact, event/brand opportunities
            $table->json('key_takeaways')->nullable(); // Bullet points
            $table->string('featured_image')->nullable();
            $table->string('source_name')->default('GETVNT Intelligence');
            $table->string('source_url')->nullable(); // Original publisher link for legal attribution
            $table->string('author')->default('GETVNT Editorial AI');
            $table->timestamp('pub_date')->nullable();
            $table->string('category')->default('Entertainment');
            $table->string('region')->default('Global');
            $table->json('tags')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('shares_count')->default(0);
            $table->integer('likes_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_breaking')->default(false);
            $table->string('status')->default('published'); // published, draft, archived
            $table->uuid('related_event_id')->nullable();
            $table->timestamps();
        });

        // 3. News Article Comments
        Schema::create('news_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('article_id');
            $table->string('user_name');
            $table->string('user_avatar')->nullable();
            $table->text('comment');
            $table->integer('likes')->default(0);
            $table->timestamps();

            $table->foreign('article_id')->references('id')->on('news_articles')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_comments');
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('news_sources');
    }
};
