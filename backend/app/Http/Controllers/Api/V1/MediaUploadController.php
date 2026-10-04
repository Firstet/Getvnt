<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SystemIntegrationSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MediaUploadController extends Controller
{
    protected array $allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
    ];

    protected array $blockedExtensions = [
        'php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'phar',
        'exe', 'sh', 'bash', 'cmd', 'bat', 'cgi', 'pl', 'py', 'js',
        'html', 'htm', 'shtml', 'asp', 'aspx', 'jsp', 'dll', 'so',
    ];

    public function upload(Request $request)
    {
        $request->validate([
            'file'   => 'required|file|max:10240', // Max 10MB overall
            'folder' => 'nullable|string',
        ]);

        $file = $request->file('file');

        $mimeType = strtolower($file->getMimeType() ?: '');
        $extension = strtolower($file->getClientOriginalExtension() ?: '');

        // 1. Strict MIME type validation
        if (!in_array($mimeType, $this->allowedMimeTypes, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file type. Only JPEG, PNG, WEBP, GIF, and PDF files are allowed.',
            ], 422);
        }

        // 2. Executable extension check
        if (in_array($extension, $this->blockedExtensions, true)) {
            return response()->json([
                'success' => false,
                'message' => 'File extension blocked for security reasons.',
            ], 422);
        }

        // 3. File size check per type (5MB for images, 10MB for PDF)
        $isPdf = $mimeType === 'application/pdf';
        $maxSizeBytes = $isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if ($file->getSize() > $maxSizeBytes) {
            $limitMb = $isPdf ? '10MB' : '5MB';
            return response()->json([
                'success' => false,
                'message' => "File size exceeds maximum allowed size of {$limitMb}.",
            ], 422);
        }

        // 4. Sanitize extension mapping
        $safeExtension = match ($mimeType) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'application/pdf' => 'pdf',
            default => 'bin',
        };

        // 5. Unique, sanitized filename
        $rawBasename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $slugName = Str::slug($rawBasename) ?: 'media_asset';
        $filename = $slugName . '_' . (string) Str::uuid() . '.' . $safeExtension;

        // 6. Tenant-isolated storage path
        $user = $request->user();
        $tenantId = $user?->tenant_id ?: 'global';
        $year = date('Y');
        $month = date('m');

        $folder = $request->input('folder', 'branding');
        $storageDir = "tenants/{$tenantId}/uploads/{$year}/{$month}";

        $path = $file->storeAs($storageDir, $filename, 'public');

        $baseUrl = config('app.url', 'http://localhost:8000');
        $url = $baseUrl . '/storage/' . $path;

        Log::info('Media asset uploaded securely', [
            'tenant_id' => $tenantId,
            'path' => $path,
            'url' => $url,
            'mime_type' => $mimeType,
        ]);

        $fieldKey = $request->input('field_key');
        if ($fieldKey && in_array($fieldKey, ['logo_color_url', 'logo_white_url', 'favicon_url', 'hero_banner_url'], true)) {
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
                        'is_encrypted' => false,
                    ]
                );
            } catch (\Throwable $e) {
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
                'mime_type' => $mimeType,
            ],
        ], 201);
    }
}
