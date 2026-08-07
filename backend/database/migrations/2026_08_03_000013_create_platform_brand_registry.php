<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('platform_brand_registry', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('platform_name')->default('Getvnt');
            $table->string('short_name')->default('Getvnt');
            $table->string('tagline')->default('Discover & Experience Africa\'s Best Events');
            $table->text('description')->nullable();

            // Logos & Media
            $table->string('logo_light_url')->default('/assets/getvnt-logo-color.png');
            $table->string('logo_dark_url')->default('/assets/getvnt-logo-white.png');
            $table->string('logo_icon_url')->default('/assets/getvnt-icon-transparent.png');
            $table->string('favicon_url')->default('/assets/getvnt-icon-transparent.png');
            $table->string('apple_touch_url')->nullable();
            $table->string('hero_image_url')->default('/assets/afrobeat_festival_banner.png');
            $table->string('og_image_url')->nullable();

            // Theme Colors
            $table->string('primary_color')->default('#4F46E5');
            $table->string('secondary_color')->default('#7C3AED');
            $table->string('accent_color')->default('#06B6D4');
            $table->string('success_color')->default('#10B981');
            $table->string('warning_color')->default('#F59E0B');
            $table->string('danger_color')->default('#EF4444');

            // Typography & Style
            $table->string('typography_family')->default('Inter, sans-serif');
            $table->string('border_radius')->default('12px');
            $table->string('button_style')->default('rounded');
            $table->string('theme')->default('dark');

            // Contact & Legal
            $table->string('support_email')->default('support@getvnt.com');
            $table->string('support_phone')->nullable();
            $table->string('office_address')->nullable();
            $table->string('copyright_text')->default('© 2026 Getvnt. All rights reserved.');

            // JSON Fields
            $table->json('social_links')->nullable(); // { twitter, instagram, facebook, linkedin, youtube, tiktok }
            $table->json('footer_links')->nullable();  // [ { label, url, group } ]
            $table->json('seo_default')->nullable();   // { title, description, keywords }

            $table->timestamps();
        });

        // Seed default record
        DB::table('platform_brand_registry')->insert([
            'platform_name'     => 'Getvnt',
            'short_name'        => 'Getvnt',
            'tagline'           => "Discover & Experience Africa's Best Events",
            'description'       => 'Africa\'s leading event discovery, ticketing and entertainment intelligence platform.',
            'logo_light_url'    => '/assets/getvnt-logo-color.png',
            'logo_dark_url'     => '/assets/getvnt-logo-white.png',
            'logo_icon_url'     => '/assets/getvnt-icon-transparent.png',
            'favicon_url'       => '/assets/getvnt-icon-transparent.png',
            'hero_image_url'    => '/assets/afrobeat_festival_banner.png',
            'primary_color'     => '#4F46E5',
            'secondary_color'   => '#7C3AED',
            'accent_color'      => '#06B6D4',
            'success_color'     => '#10B981',
            'warning_color'     => '#F59E0B',
            'danger_color'      => '#EF4444',
            'typography_family' => 'Inter, sans-serif',
            'border_radius'     => '12px',
            'button_style'      => 'rounded',
            'theme'             => 'dark',
            'support_email'     => 'support@getvnt.com',
            'support_phone'     => '+234 800 GETVNT',
            'office_address'    => 'Victoria Island, Lagos, Nigeria',
            'copyright_text'    => '© 2026 Getvnt Technologies Ltd. All rights reserved.',
            'social_links'      => json_encode([
                'twitter'   => 'https://twitter.com/getvnt',
                'instagram' => 'https://instagram.com/getvnt',
                'facebook'  => 'https://facebook.com/getvnt',
                'linkedin'  => 'https://linkedin.com/company/getvnt',
                'youtube'   => 'https://youtube.com/@getvnt',
                'tiktok'    => 'https://tiktok.com/@getvnt',
            ]),
            'footer_links' => json_encode([
                ['label' => 'About Us',      'url' => '/about',   'group' => 'Company'],
                ['label' => 'Careers',       'url' => '/careers', 'group' => 'Company'],
                ['label' => 'Press Kit',     'url' => '/press',   'group' => 'Company'],
                ['label' => 'Help Center',   'url' => '/help',    'group' => 'Support'],
                ['label' => 'Contact Us',    'url' => '/contact', 'group' => 'Support'],
                ['label' => 'Privacy Policy','url' => '/privacy', 'group' => 'Legal'],
                ['label' => 'Terms of Use',  'url' => '/terms',   'group' => 'Legal'],
                ['label' => 'API Docs',      'url' => '/api',     'group' => 'Developers'],
            ]),
            'seo_default' => json_encode([
                'title'       => 'Getvnt — Discover & Experience Africa\'s Best Events',
                'description' => 'Buy tickets for concerts, festivals, tech conferences, and cultural events across Africa. Powered by AI-driven entertainment intelligence.',
                'keywords'    => 'events Nigeria, Lagos concerts, Africa tickets, Afrobeats, tech conferences Africa, Getvnt',
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // CMS Navigation Table
        Schema::create('cms_navigation', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('slug');
            $table->string('icon')->nullable();
            $table->string('url')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->boolean('requires_auth')->default(false);
            $table->integer('sort_order')->default(0);
            $table->string('target')->default('_self'); // _self | _blank
            $table->timestamps();
        });

        // CMS Footer Columns
        Schema::create('cms_footer_columns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->integer('sort_order')->default(0);
            $table->json('links')->nullable(); // [{ label, url }]
            $table->timestamps();
        });

        // CMS Page Sections
        Schema::create('cms_sections', function (Blueprint $table) {
            $table->id();
            $table->string('page')->default('home'); // home | pricing | about | etc.
            $table->string('section_key')->unique();  // hero | stats | features | testimonials | cta
            $table->string('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->longText('content')->nullable();
            $table->string('image_url')->nullable();
            $table->json('data')->nullable();         // flexible extra data
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_sections');
        Schema::dropIfExists('cms_footer_columns');
        Schema::dropIfExists('cms_navigation');
        Schema::dropIfExists('platform_brand_registry');
    }
};
