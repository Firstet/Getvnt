<?php

namespace App\Services;

use App\Models\NewsArticle;
use App\Models\NewsSource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NewsService
{
    /**
     * Get Stream of Articles with Category/Region/Search filters
     */
    public function getNewsStream(array $filters = [], int $limit = 24)
    {
        $category = $filters['category'] ?? 'all';
        $region = $filters['region'] ?? 'all';
        $search = $filters['search'] ?? '';

        $baseQuery = NewsArticle::with('relatedEvent')
            ->where('status', 'published');

        if ($category !== 'all' && !empty($category)) {
            $baseQuery->where('category', 'like', '%' . $category . '%');
        }

        if ($region !== 'all' && !empty($region)) {
            $baseQuery->where('region', 'like', '%' . $region . '%');
        }

        if (!empty($search)) {
            $baseQuery->where(function ($q) use ($search) {
                $q->where('headline', 'like', '%' . $search . '%')
                    ->orWhere('subtitle', 'like', '%' . $search . '%')
                    ->orWhere('ai_summary', 'like', '%' . $search . '%')
                    ->orWhere('author', 'like', '%' . $search . '%')
                    ->orWhere('source_name', 'like', '%' . $search . '%');
            });
        }

        // 1. Fetch Single Featured Story matching active filters (Automatically changes to the most recent post)
        $featuredArticle = (clone $baseQuery)
            ->orderBy('pub_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->first();

        // 2. Regular Stream Articles (Excluding featured)
        $query = (clone $baseQuery);
        if ($featuredArticle) {
            $query->where('id', '!=', $featuredArticle->id);
        }

        $articles = $query->orderBy('pub_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();

        return [
            'featured' => $featuredArticle,
            'articles' => $articles,
            'total_count' => $baseQuery->count(),
            'categories' => [
                'Music', 'Movies', 'Celebrities', 'Events', 'Fashion', 'Lifestyle',
                'Streaming', 'Awards', 'TV', 'Comedy', 'Culture', 'Technology'
            ],
        ];
    }

    /**
     * Aggregate RSS feeds from all enabled sources
     */
    public function syncFeeds(): int
    {
        $aggregator = new NewsAggregationService();
        return $aggregator->aggregate();
    }
}
