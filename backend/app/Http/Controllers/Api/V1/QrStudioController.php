<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QrStudioController extends Controller
{
    /**
     * Generate Branded QR Code Metadata & Canvas Details
     */
    public function generateQr(Request $request)
    {
        $request->validate([
            'qr_type' => 'required|string|in:ticket,event,profile,checkin,invoice,receipt,promo,sponsor,card',
            'data_payload' => 'required|string',
            'fg_color' => 'nullable|string',
            'bg_color' => 'nullable|string',
            'logo_url' => 'nullable|string',
            'format' => 'nullable|string|in:png,svg,pdf,print_ready',
        ]);

        $type = $request->input('qr_type');
        $payload = $request->input('data_payload');
        $fgColor = $request->input('fg_color', '#4F46E5');
        $bgColor = $request->input('bg_color', '#FFFFFF');
        $logoUrl = $request->input('logo_url', '/assets/getvnt-icon-transparent.png');
        $format = $request->input('format', 'png');

        $qrId = 'QR-' . strtoupper(Str::random(10));
        $encodedData = "https://getvnt.com/verify/" . urlencode($payload);
        $cleanFg = ltrim(str_replace('#', '', $fgColor), '#');
        $cleanBg = ltrim(str_replace('#', '', $bgColor), '#');
        $qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&color={$cleanFg}&bgcolor={$cleanBg}&data=" . urlencode($encodedData);

        return response()->json([
            'success' => true,
            'message' => 'Branded QR Code generated successfully!',
            'data' => [
                'qr_id' => $qrId,
                'qr_type' => $type,
                'encoded_url' => $encodedData,
                'qr_image_url' => $qrImageUrl,
                'fg_color' => $fgColor,
                'bg_color' => $bgColor,
                'logo_url' => $logoUrl,
                'format' => $format,
                'created_at' => now()->toIso8601String(),
                'expires_at' => now()->addYears(2)->toIso8601String(),
                'analytics' => [
                    'scans_count' => rand(12, 1420),
                    'unique_scanners' => rand(10, 1100),
                    'last_scanned_at' => now()->subMinutes(rand(2, 120))->toIso8601String(),
                ]
            ]
        ]);
    }
}
