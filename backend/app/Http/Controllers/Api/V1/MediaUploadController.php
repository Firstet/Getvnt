<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\SystemIntegrationSetting;

class MediaUploadController extends Controller
{
    /**
     * Upload Media File (Logo, Banner, Favicon, Event Poster, Avatar)
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file'   => 'required|file|max:20480', // Allow up to 20MB files
            'folder' => 'nullable|string',
        ]);

        $file   = $request->file('file');
        $folder = $request->input('folder', 'branding');

        // Build unique filename
        $extension = strtolower($file->getClientOriginalExtension() ?: 'png');
        $basename  = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        if (empty($basename)) {
            $basename = 'media_asset';
        }
        $filename  = $basename . '_' . time() . '_' . Str::random(6) . '.' . $extension;

        // Store on the `public` disk → storage/app/public/media/{folder}/{filename}
        $path = $file->storeAs("media/{$folder}", $filename, 'public');

        // Generate absolute URL with port 8000 guarantee
        $baseUrl = config('app.url', 'http://localhost:8000');
        $url = $baseUrl . '/storage/' . $path;

        Log::info('Media uploaded successfully', ['path' => $path, 'url' => $url]);

        // Auto update branding settings in system database if key field provided
        $fieldKey = $request->input('field_key');
        if ($fieldKey && in_array($fieldKey, ['logo_color_url', 'logo_white_url', 'favicon_url', 'hero_banner_url'])) {
            try {
                $setting = SystemIntegrationSetting::where('key', 'system_settings')->first();
                $data = $setting ? json_decode($setting->value, true) : [];
                $data['branding'] = $data['branding'] ?? [];
                $data['branding'][$fieldKey] = $url;

                SystemIntegrationSetting::updateOrCreate(
                    ['key' => 'system_settings'],
                    [
                        'name' => 'System & Environment Settings',
                        'value' => json_encode($data),
                        'is_encrypted' => false
                    ]
                );
            } catch (\Exception $e) {
                Log::error('Failed updating branding setting for key', ['field_key' => $fieldKey, 'error' => $e->getMessage()]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Media asset uploaded successfully!',
            'data'    => [
                'filename'  => $filename,
                'path'      => $path,
                'url'       => $url,
                'size'      => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]
        ], 201);
    }
}
