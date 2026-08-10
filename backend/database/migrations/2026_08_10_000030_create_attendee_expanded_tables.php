<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Organizer Followers Table
        if (!Schema::hasTable('organizer_followers')) {
            Schema::create('organizer_followers', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id'); // follower
                $table->uuid('organizer_id'); // organizer user or tenant
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->unique(['user_id', 'organizer_id']);
            });
        }

        // 2. Community Posts Table
        if (!Schema::hasTable('community_posts')) {
            Schema::create('community_posts', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_id');
                $table->uuid('tenant_id')->nullable();
                $table->uuid('event_id')->nullable();
                $table->text('content');
                $table->string('image_url')->nullable();
                $table->integer('likes_count')->default(0);
                $table->integer('comments_count')->default(0);
                $table->boolean('is_pinned')->default(false);
                $table->timestamps();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // 3. Community Post Likes Table
        if (!Schema::hasTable('community_post_likes')) {
            Schema::create('community_post_likes', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('post_id');
                $table->uuid('user_id');
                $table->timestamps();

                $table->foreign('post_id')->references('id')->on('community_posts')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->unique(['post_id', 'user_id']);
            });
        }

        // 4. Community Post Comments Table
        if (!Schema::hasTable('community_post_comments')) {
            Schema::create('community_post_comments', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('post_id');
                $table->uuid('user_id');
                $table->text('comment');
                $table->timestamps();

                $table->foreign('post_id')->references('id')->on('community_posts')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // 5. Direct Conversations Table
        if (!Schema::hasTable('conversations')) {
            Schema::create('conversations', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('user_one_id');
                $table->uuid('user_two_id');
                $table->text('last_message')->nullable();
                $table->timestamp('last_message_at')->nullable();
                $table->timestamps();

                $table->foreign('user_one_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('user_two_id')->references('id')->on('users')->onDelete('cascade');
            });
        }

        // 6. Direct Messages Table
        if (!Schema::hasTable('direct_messages')) {
            Schema::create('direct_messages', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->uuid('conversation_id');
                $table->uuid('sender_id');
                $table->text('message')->nullable();
                $table->string('attachment_url')->nullable();
                $table->boolean('is_read')->default(false);
                $table->timestamps();

                $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
                $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('direct_messages');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('community_post_comments');
        Schema::dropIfExists('community_post_likes');
        Schema::dropIfExists('community_posts');
        Schema::dropIfExists('organizer_followers');
    }
};
