<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NewsArticle;
use App\Models\NewsSource;
use App\Models\NewsComment;
use App\Models\Event;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Services\NewsAggregationService;

class NewsController extends Controller
{
    /**
     * News Aggregation Service instance.
     */
    protected $newsAggregationService;

    /**
     * Constructor.
     */
    public function __construct(NewsAggregationService $newsAggregationService)
    {
        $this->newsAggregationService = $newsAggregationService;
    }

    /**
     * Public Entertainment & Event News Stream
     * GET /api/v1/news
     */
    public function index(Request $request)
    {
        $category = $request->query('category', 'all');
        $region = $request->query('region', 'all');
        $search = $request->query('search', '');
        $sort = $request->query('sort', 'latest'); // latest, trending, popular
        $limit = (int) $request->query('limit', 24);

        // Build base query matching active filters
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

        // 1. Fetch Single Featured Story matching active filters:
        // Priority A: Super Admin Pinned Featured article whose featured_until date is still active
        $featuredArticle = (clone $baseQuery)
            ->where('is_featured', true)
            ->where(function ($q) {
                $q->whereNull('featured_until')->orWhere('featured_until', '>', now());
            })
            ->orderBy('created_at', 'desc')
            ->first();

        // Priority B: Fallback automatically to the most recent published post!
        if (!$featuredArticle) {
            $featuredArticle = (clone $baseQuery)
                ->orderBy('pub_date', 'desc')
                ->orderBy('created_at', 'desc')
                ->first();
        }

        // 2. Fetch Carousel of Top Featured & Recent Stories (15 stories for dynamic rotator)
        $featuredCarousel = (clone $baseQuery)
            ->orderBy('pub_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        // 3. Query Regular Articles (EXCLUDING main featured article)
        $query = (clone $baseQuery);

        if ($featuredArticle) {
            $query->where('id', '!=', $featuredArticle->id);
        }

        if ($sort === 'trending' || $sort === 'popular') {
            $query->orderBy('views_count', 'desc')->orderBy('shares_count', 'desc');
        } else {
            $query->orderBy('pub_date', 'desc')->orderBy('created_at', 'desc');
        }

        $articles = $query->take($limit > 0 ? min($limit, 200) : 24)->get();

        $categoriesList = ['Music', 'Movies', 'Celebrities', 'Events', 'Fashion', 'Lifestyle', 'Streaming', 'Awards', 'TV', 'Comedy', 'Culture', 'Gaming', 'Technology'];
        $regionsList = ['Nigeria', 'West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'Africa', 'Europe', 'Asia', 'North America', 'Global'];
        $sourcesList = NewsSource::where('is_enabled', true)->pluck('name')->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'featured' => $featuredArticle,
                'featured_carousel' => $featuredCarousel,
                'articles' => $articles,
                'total_count' => $query->count() + ($featuredArticle ? 1 : 0),
                'categories' => $categoriesList,
                'regions' => $regionsList,
                'sources' => $sourcesList,
                'last_updated_at' => now()->toIso8601String(),
            ]
        ]);
    }

    /**
     * Get Single Featured Story
     * GET /api/v1/news/featured
     */
    public function featured()
    {
        $featured = NewsArticle::with('relatedEvent')
            ->where('status', 'published')
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$featured) {
            $featured = NewsArticle::with('relatedEvent')
                ->where('status', 'published')
                ->orderBy('created_at', 'desc')
                ->first();
        }

        return response()->json(['success' => true, 'data' => $featured]);
    }

    /**
     * Get Trending Stories
     * GET /api/v1/news/trending
     */
    public function trending()
    {
        $mostRead = NewsArticle::where('status', 'published')
            ->orderBy('views_count', 'desc')
            ->take(5)
            ->get();

        $mostShared = NewsArticle::where('status', 'published')
            ->orderBy('shares_count', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'most_read' => $mostRead,
                'most_shared' => $mostShared,
            ]
        ]);
    }

    /**
     * Get Full Article Detail
     * GET /api/v1/news/article/{slug}
     */
    public function show($slug)
    {
        $article = NewsArticle::with(['relatedEvent', 'comments'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        // Increment views count silently
        $article->increment('views_count');

        // Fetch related articles in same category
        $relatedArticles = NewsArticle::where('status', 'published')
            ->where('id', '!=', $article->id)
            ->where('category', $article->category)
            ->take(4)
            ->get();

        // If no related event explicitly assigned, find an event matching title/tags
        $relatedEvent = $article->relatedEvent;
        if (!$relatedEvent) {
            $relatedEvent = Event::where('status', 'published')
                ->where('title', 'like', '%' . substr($article->headline, 0, 15) . '%')
                ->first();
        }

        return response()->json([
            'success' => true,
            'data' => [
                'article' => $article,
                'related_articles' => $relatedArticles,
                'related_event' => $relatedEvent,
            ]
        ]);
    }

    /**
     * Like Article
     * POST /api/v1/news/article/{id}/like
     */
    public function like($id)
    {
        $article = NewsArticle::findOrFail($id);
        $article->increment('likes_count');

        return response()->json([
            'success' => true,
            'message' => 'Article liked!',
            'likes_count' => $article->likes_count,
        ]);
    }

    /**
     * Share Article
     * POST /api/v1/news/article/{id}/share
     */
    public function share($id)
    {
        $article = NewsArticle::findOrFail($id);
        $article->increment('shares_count');

        return response()->json([
            'success' => true,
            'message' => 'Share counter recorded!',
            'shares_count' => $article->shares_count,
        ]);
    }

    /**
     * Post Comment
     * POST /api/v1/news/article/{id}/comments
     */
    public function postComment(Request $request, $id)
    {
        $request->validate([
            'user_name' => 'required|string|max:100',
            'comment' => 'required|string|max:1000',
        ]);

        $comment = NewsComment::create([
            'article_id' => $id,
            'user_name' => $request->input('user_name'),
            'user_avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($request->input('user_name')) . '&background=4F46E5&color=fff',
            'comment' => $request->input('comment'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment submitted successfully!',
            'data' => $comment,
        ], 201);
    }

    /**
     * Super Admin - Get All Feeds Sources
     * GET /api/v1/admin/news/sources
     */
    public function getSources()
    {
        $sources = NewsSource::orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $sources]);
    }

    /**
     * Super Admin - Create/Update Feed Source
     * POST /api/v1/admin/news/sources
     */
    public function saveSource(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'url' => 'nullable|string',
            'rss_url' => 'nullable|string',
            'region' => 'required|string',
            'category' => 'required|string',
        ]);

        $id = $request->input('id');

        $source = NewsSource::updateOrCreate(
            ['id' => $id ?: (string) Str::uuid()],
            [
                'name' => $request->input('name'),
                'url' => $request->input('url'),
                'rss_url' => $request->input('rss_url'),
                'region' => $request->input('region'),
                'category' => $request->input('category'),
                'is_enabled' => $request->boolean('is_enabled', true),
                'update_frequency_minutes' => (int) $request->input('update_frequency_minutes', 10),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'News Feed Source saved successfully!',
            'data' => $source,
        ]);
    }

    /**
     * Super Admin - AI News Aggregation Pipeline Trigger
     * POST /api/v1/admin/news/fetch-sync
     */
    public function syncFeeds(Request $request)
    {
        Log::info('Triggering AI News & Entertainment Aggregation Pipeline');

        $sources = NewsSource::where('is_enabled', true)->get();
        $newArticlesCount = 0;

        foreach ($sources as $source) {
            $source->update([
                'fetch_status' => 'success',
                'last_fetched_at' => now(),
            ]);
        }

        // Use the NewsAggregationService to import articles
        $newArticlesCount = $this->newsAggregationService->aggregate();

        return response()->json([
            'success' => true,
            'message' => "AI News Engine synchronized successfully! Fetched from " . count($sources) . " active sources.",
            'new_articles_count' => $newArticlesCount,
        ]);
    }

    /**
     * Super Admin - Get All Articles (Paginated / Filterable)
     * GET /api/v1/admin/news/articles
     */
    public function getArticles(Request $request)
    {
        $query = NewsArticle::orderBy('created_at', 'desc');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('featured') && $request->featured === 'true') {
            $query->where('is_featured', true);
        }

        $articles = $query->paginate((int) $request->query('per_page', 20));
        return response()->json(['success' => true, 'data' => $articles]);
    }

    /**
     * Super Admin - Create or Update News Article (Manual Upload & Pinning)
     * POST /api/v1/admin/news/articles
     */
    public function saveArticle(Request $request)
    {
        $request->validate([
            'headline' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'required|string',
            'region' => 'required|string',
            'featured_image' => 'nullable|string',
            'source_name' => 'nullable|string',
            'source_url' => 'nullable|string',
        ]);

        $id = $request->input('id');
        $headline = $request->input('headline');
        $slug = $request->input('slug') ?: Str::slug(substr($headline, 0, 100));

        $isFeatured = $request->boolean('is_featured', false);

        $article = NewsArticle::updateOrCreate(
            ['id' => $id ?: (string) Str::uuid()],
            [
                'headline' => $headline,
                'subtitle' => $request->input('subtitle', 'GETVNT Editorial Update'),
                'slug' => $slug,
                'ai_summary' => $request->input('ai_summary') ?: "Official GETVNT news breakdown on '{$headline}'.",
                'content' => $request->input('content') ?: "Full article updates and announcements published by GETVNT Editorial Team.",
                'featured_image' => $request->input('featured_image') ?: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
                'category' => $request->input('category', 'Events'),
                'region' => $request->input('region', 'Global'),
                'source_name' => $request->input('source_name', 'GETVNT Official'),
                'source_url' => $request->input('source_url', '#'),
                'author' => $request->input('author', 'Super Admin Editorial'),
                'pub_date' => now(),
                'is_featured' => $isFeatured,
                'featured_until' => $isFeatured && $request->has('duration_days') ? now()->addDays((int)$request->input('duration_days')) : null,
                'is_breaking' => $request->boolean('is_breaking', false),
                'status' => 'published',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => $isFeatured ? 'Article published and pinned as FEATURED STORY!' : 'Article published successfully!',
            'data' => $article,
        ]);
    }

    /**
     * Super Admin - Toggle Featured Pin State
     * POST /api/v1/admin/news/articles/{id}/toggle-featured
     */
    public function toggleFeatured(Request $request, $id)
    {
        $article = NewsArticle::findOrFail($id);
        $article->is_featured = !$article->is_featured;

        if ($article->is_featured) {
            $durationDays = (int) $request->input('duration_days', 3);
            $article->featured_until = now()->addDays($durationDays);
        } else {
            $article->featured_until = null;
        }

        $article->save();

        return response()->json([
            'success' => true,
            'message' => $article->is_featured 
                ? "Story pinned as FEATURED STORY until {$article->featured_until->toFormattedDateString()}!" 
                : 'Story unpinned from FEATURED STORY.',
            'is_featured' => $article->is_featured,
            'featured_until' => $article->featured_until,
            'data' => $article,
        ]);
    }

    /**
     * Super Admin - Delete Article
     * DELETE /api/v1/admin/news/articles/{id}
     */
    public function deleteArticle($id)
    {
        $article = NewsArticle::findOrFail($id);
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully.',
        ]);
    }
}
