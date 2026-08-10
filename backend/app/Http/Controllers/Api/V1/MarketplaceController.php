<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MarketplaceController extends Controller
{
    public function events(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Clean foundation events catalog endpoint.',
        ]);
    }

    public function categories(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => ['Music & Festivals', 'Tech & AI', 'Business & Networking', 'Arts & Culture', 'Sports & Fitness'],
        ]);
    }

    public function cities(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => ['New York', 'London', 'Lagos', 'San Francisco', 'Tokyo', 'Berlin', 'Virtual'],
        ]);
    }
}
