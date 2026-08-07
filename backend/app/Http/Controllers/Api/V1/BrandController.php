<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PlatformBrand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * GET /api/v1/brand
     * Public — returns full brand registry data for all frontends to consume.
     */
    public function getBrand()
    {
        $brand = PlatformBrand::global();

        return response()->json([
            'success' => true,
            'data'    => $brand,
        ]);
    }

    /**
     * PUT /api/v1/admin/brand
     * Super Admin — update global brand registry.
     */
    public function updateBrand(Request $request)
    {
        $validated = $request->validate([
            'platform_name'     => 'sometimes|string|max:100',
            'short_name'        => 'sometimes|string|max:50',
            'tagline'           => 'sometimes|string|max:255',
            'description'       => 'sometimes|nullable|string',
            'logo_light_url'      => 'sometimes|nullable|string',
            'logo_dark_url'       => 'sometimes|nullable|string',
            'logo_monochrome_url' => 'sometimes|nullable|string',
            'loader_logo_url'     => 'sometimes|nullable|string',
            'splash_logo_url'     => 'sometimes|nullable|string',
            'logo_icon_url'       => 'sometimes|nullable|string',
            'favicon_url'         => 'sometimes|nullable|string',
            'apple_touch_url'     => 'sometimes|nullable|string',
            'hero_image_url'      => 'sometimes|nullable|string',
            'og_image_url'        => 'sometimes|nullable|string',
            'primary_color'     => 'sometimes|string|max:20',
            'secondary_color'   => 'sometimes|string|max:20',
            'accent_color'      => 'sometimes|string|max:20',
            'success_color'     => 'sometimes|string|max:20',
            'warning_color'     => 'sometimes|string|max:20',
            'danger_color'      => 'sometimes|string|max:20',
            'typography_family' => 'sometimes|string|max:255',
            'border_radius'     => 'sometimes|string|max:20',
            'button_style'      => 'sometimes|string|max:50',
            'theme'             => 'sometimes|in:dark,light',
            'support_email'     => 'sometimes|email',
            'support_phone'     => 'sometimes|nullable|string|max:50',
            'office_address'    => 'sometimes|nullable|string',
            'copyright_text'    => 'sometimes|nullable|string|max:255',
            'social_links'      => 'sometimes|nullable|array',
            'footer_links'      => 'sometimes|nullable|array',
            'seo_default'       => 'sometimes|nullable|array',
            'google_client_id'    => 'sometimes|nullable|string',
            'google_client_secret' => 'sometimes|nullable|string',
            'google_login_enabled' => 'sometimes|nullable|boolean',
            'landing_page_cms'   => 'sometimes|nullable|array',
        ]);

        $brand = PlatformBrand::global();
        $brand->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Platform brand registry updated successfully.',
            'data'    => $brand->fresh(),
        ]);
    }

    /**
     * POST /api/v1/admin/brand/upload-logo
     * Super Admin — upload brand logo (PNG, SVG, JPG, WEBP) and update global brand record.
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:logo_light_url,logo_dark_url,logo_monochrome_url,loader_logo_url,splash_logo_url,logo_icon_url,favicon_url,hero_image_url,og_image_url',
            'file' => 'required|file|mimes:png,jpg,jpeg,svg,webp,ico|max:5120',
        ]);

        $file = $request->file('file');
        $type = $request->input('type');
        
        $filename = $type . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('branding', $filename, 'public');
        
        $url = asset('storage/' . $path) . '?v=' . time();

        $brand = PlatformBrand::global();
        $brand->update([$type => $url]);

        return response()->json([
            'success' => true,
            'message' => 'Brand asset uploaded and synchronized successfully.',
            'url'     => $url,
            'type'    => $type,
            'data'    => $brand->fresh(),
        ]);
    }

    /**
     * GET /api/v1/cms/navigation
     * Public — returns CMS navigation items.
     */
    public function getNavigation()
    {
        // Fallback static navigation if no DB records
        $defaultNav = [
            ['id' => 1, 'label' => 'Home',    'slug' => 'home',    'icon' => 'House',        'is_visible' => true, 'requires_auth' => false, 'sort_order' => 1],
            ['id' => 2, 'label' => 'Explore', 'slug' => 'tickets', 'icon' => 'Ticket',       'is_visible' => true, 'requires_auth' => false, 'sort_order' => 2],
            ['id' => 3, 'label' => 'Pulse',   'slug' => 'pulse',   'icon' => 'Rss',          'is_visible' => true, 'requires_auth' => false, 'sort_order' => 3],
            ['id' => 4, 'label' => 'Wishlist','slug' => 'wishlist','icon' => 'Heart',        'is_visible' => true, 'requires_auth' => true,  'sort_order' => 4],
        ];

        return response()->json([
            'success' => true,
            'data'    => $defaultNav,
        ]);
    }

    /**
     * GET /api/v1/cms/footer
     * Public — returns footer columns and links from brand registry.
     */
    public function getFooter()
    {
        $brand = PlatformBrand::global();

        $footerLinks = $brand->footer_links ?? [];
        $grouped = [];
        foreach ($footerLinks as $link) {
            $group = $link['group'] ?? 'General';
            $grouped[$group][] = ['label' => $link['label'], 'url' => $link['url']];
        }

        $columns = [];
        foreach ($grouped as $title => $links) {
            $columns[] = ['title' => $title, 'links' => $links];
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'columns'        => $columns,
                'social_links'   => $brand->social_links ?? [],
                'copyright_text' => $brand->copyright_text,
                'support_email'  => $brand->support_email,
                'support_phone'  => $brand->support_phone,
            ],
        ]);
    }
}
