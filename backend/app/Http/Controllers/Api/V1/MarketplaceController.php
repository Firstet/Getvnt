<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\MarketplaceCategory;
use App\Models\MarketplaceCity;
use App\Models\PlatformBrand;
use Illuminate\Http\Request;

class MarketplaceController extends Controller
{
    public function events(Request $request)
    {
        $query = Event::with(['ticketTypes', 'tenant'])
            ->where('status', 'published');

        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->has('city') && $request->city !== 'All') {
            $query->where('city', $request->city);
        }

        if ($request->has('search') && !empty($request->search)) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        $events = $query->orderBy('start_date', 'asc')->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $events->items(),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'total' => $events->total(),
            ]
        ]);
    }

    public function showEvent($slug)
    {
        $event = Event::with(['ticketTypes', 'tenant'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $event
        ]);
    }

    public function categories()
    {
        $categories = [
            ['id' => '1', 'name' => 'Music & Concerts', 'slug' => 'music', 'icon' => 'Music'],
            ['id' => '2', 'name' => 'Technology & AI', 'slug' => 'tech', 'icon' => 'Cpu'],
            ['id' => '3', 'name' => 'Business & Networking', 'slug' => 'business', 'icon' => 'Briefcase'],
            ['id' => '4', 'name' => 'Food & Drink', 'slug' => 'food', 'icon' => 'Utensils'],
            ['id' => '5', 'name' => 'Arts & Culture', 'slug' => 'culture', 'icon' => 'Palette'],
            ['id' => '6', 'name' => 'Sports & Fitness', 'slug' => 'sports', 'icon' => 'Activity'],
        ];

        return response()->json(['success' => true, 'data' => $categories]);
    }

    public function cities()
    {
        $cities = [
            ['name' => 'Lagos', 'country' => 'Nigeria', 'event_count' => 142],
            ['name' => 'Nairobi', 'country' => 'Kenya', 'event_count' => 89],
            ['name' => 'Accra', 'country' => 'Ghana', 'event_count' => 64],
            ['name' => 'Johannesburg', 'country' => 'South Africa', 'event_count' => 95],
            ['name' => 'Kigali', 'country' => 'Rwanda', 'event_count' => 38],
            ['name' => 'Cairo', 'country' => 'Egypt', 'event_count' => 51],
        ];

        return response()->json(['success' => true, 'data' => $cities]);
    }

    public function publicBrandingSettings()
    {
        $brand = PlatformBrand::global();

        return response()->json([
            'success' => true,
            'data'    => $brand,
        ]);
    }
}
