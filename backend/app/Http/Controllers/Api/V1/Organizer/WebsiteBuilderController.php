<?php

namespace App\Http\Controllers\Api\V1\Organizer;

use App\Http\Controllers\Controller;
use App\Models\OrganizerWebsite;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WebsiteBuilderController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $website = OrganizerWebsite::firstOrCreate(
            ['tenant_id' => $user->tenant_id],
            [
                'id' => (string) Str::uuid(),
                'subdomain' => Str::slug($user->name) . '-event',
                'site_title' => $user->tenant ? $user->tenant->name : 'Official Event Site',
                'template' => 'music_festival',
                'theme_color' => '#2563EB',
                'accent_color' => '#7C3AED',
                'is_published' => true,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $website,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $website = OrganizerWebsite::where('tenant_id', $user->tenant_id)->firstOrFail();

        $request->validate([
            'site_title' => 'sometimes|string',
            'subdomain' => 'sometimes|string',
            'custom_domain' => 'sometimes|nullable|string',
            'template' => 'sometimes|string',
            'theme_color' => 'sometimes|string',
            'accent_color' => 'sometimes|string',
        ]);

        $website->update($request->only([
            'site_title', 'tagline', 'subdomain', 'custom_domain',
            'template', 'theme_color', 'accent_color', 'is_published'
        ]));

        return response()->json([
            'success' => true,
            'data' => $website,
            'message' => 'Organizer website configuration updated.',
        ]);
    }
}
