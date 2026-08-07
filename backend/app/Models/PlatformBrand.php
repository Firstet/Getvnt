<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformBrand extends Model
{
    protected $table = 'platform_brand_registry';

    protected $fillable = [
        'platform_name',
        'short_name',
        'tagline',
        'description',
        'logo_light_url',
        'logo_dark_url',
        'logo_monochrome_url',
        'loader_logo_url',
        'splash_logo_url',
        'logo_icon_url',
        'favicon_url',
        'apple_touch_url',
        'hero_image_url',
        'og_image_url',
        'primary_color',
        'secondary_color',
        'accent_color',
        'success_color',
        'warning_color',
        'danger_color',
        'typography_family',
        'border_radius',
        'button_style',
        'theme',
        'support_email',
        'support_phone',
        'office_address',
        'copyright_text',
        'social_links',
        'footer_links',
        'seo_default',
        'google_client_id',
        'google_client_secret',
        'google_login_enabled',
        'landing_page_cms',
    ];

    protected $casts = [
        'social_links'         => 'array',
        'footer_links'         => 'array',
        'seo_default'          => 'array',
        'google_login_enabled' => 'boolean',
        'landing_page_cms'     => 'array',
    ];

    /**
     * Get the single global brand record (always ID 1).
     * Creates defaults if not yet seeded.
     */
    public static function global(): self
    {
        return self::firstOrCreate(
            ['id' => 1],
            [
                'platform_name'     => 'Getvnt',
                'short_name'        => 'Getvnt',
                'tagline'           => "Discover & Experience Africa's Best Events",
                'logo_light_url'      => '/assets/logo-gradient.png',
                'logo_dark_url'       => '/assets/logo-white.png',
                'logo_monochrome_url' => '/assets/logo-black.png',
                'loader_logo_url'     => '/assets/logo-white.png',
                'splash_logo_url'     => '/assets/logo-gradient.png',
                'logo_icon_url'       => '/assets/icon.png',
                'favicon_url'       => '/assets/icon.png',
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
                'copyright_text'    => '© 2026 Getvnt Technologies Ltd. All rights reserved.',
            ]
        );
    }
}
