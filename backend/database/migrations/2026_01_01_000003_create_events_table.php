<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('title');
            $table->string('slug');
            $table->string('tagline')->nullable();
            $table->longText('description');
            $table->string('category')->default('Entertainment');
            $table->string('banner_url')->nullable();
            $table->json('gallery_urls')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('timezone')->default('Africa/Lagos');
            $table->enum('location_type', ['physical', 'online', 'hybrid'])->default('physical');
            $table->string('venue_name')->nullable();
            $table->string('venue_address')->nullable();
            $table->string('city')->default('Lagos');
            $table->string('country')->default('Nigeria');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('online_link')->nullable();
            $table->enum('status', ['draft', 'published', 'cancelled', 'completed'])->default('published');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_trending')->default(false);
            $table->json('agenda')->nullable();
            $table->json('speakers')->nullable();
            $table->json('sponsors')->nullable();
            $table->json('faqs')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->unique(['tenant_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
