<?php

namespace App\Services;

use App\Models\NewsSource;
use App\Models\NewsArticle;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RSSAggregator
{
    public function aggregateFeeds()
    {
        $sources = NewsSource::where('is_enabled', true)->get();
        $newArticlesCount = 0;

        foreach ($sources as $source) {
            $items = $this->fetchRSSItems($source->rss_url);
            foreach ($items as $item) {
                $this->processItem($source, $item, $newArticlesCount);
            }
        }

        return $newArticlesCount;
    }

    protected function fetchRSSItems($rssUrl)
    {
        try {
            $response = Http::timeout(30)
                ->retry(3, 1000)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Accept' => 'application/rss+xml, application/xml, text/xml',
                ])
                ->get($rssUrl);

            if ($response->failed()) {
                Log::error('RSS feed HTTP error for URL: ' . $rssUrl . ' - Status: ' . $response->status());
                return [];
            }

            $xmlString = $response->body();
            if (empty($xmlString)) {
                return [];
            }

            $xml = simplexml_load_string($xmlString);
            if ($xml === false) {
                Log::error('Failed to parse RSS feed XML for URL: ' . $rssUrl);
                return [];
            }

            $items = [];

            // Handle both <item> in RSS and <entry> in Atom
            $entries = array_merge($xml->xpath('//item'), $xml->xpath('//entry'));

            foreach ($entries as $entry) {
                $items[] = $entry;
            }

            return $items;
        } catch (\Exception $e) {
            Log::error('RSS feed fetch error for URL: ' . $rssUrl . ' - ' . $e->getMessage());
            return [];
        }
    }

    protected function processItem($source, $item, &$newArticlesCount)
    {
        // Extract title
        $title = (string) $item->title;
        if (empty($title)) {
            $title = (string) $item->link;
        }

        // Extract link
        $link = (string) $item->link;

        // Extract description or summary
        $description = '';
        if (!empty($item->description)) {
            $description = (string) $item->description;
        } elseif (!empty($item->summary)) {
            $description = (string) $item->summary;
        }

        // Extract pubDate
        $pubDateRaw = '';
        if (!empty($item->pubDate)) {
            $pubDateRaw = (string) $item->pubDate;
        } elseif (!empty($item->updated)) {
            $pubDateRaw = (string) $item->updated;
        }

        // Extract image URL
        $imageUrl = $this->extractImageFromItem($item);

        // Source name
        $sourceName = $source->name;

        // Generate slug
        $slug = Str::slug(substr($title, 0, 100));
        if (empty($slug)) {
            $slug = Str::slug(Str::slug($title)) . '-' . Str::random(5);
        }

        // Skip if article already exists
        if (NewsArticle::where('slug', $slug)->exists()) {
            return;
        }

        // Determine category
        $category = 'News';
        $lowerTitle = strtolower($title);
        if (Str::contains($lowerTitle, 'music') || Str::contains($lowerTitle, 'concert')) {
            $category = 'Music';
        } elseif (Str::contains($lowerTitle, 'movie') || Str::contains($lowerTitle, 'film')) {
            $category = 'Movies';
        } elseif (Str::contains($lowerTitle, 'tech') || Str::contains($lowerTitle, 'ai')) {
            $category = 'Technology';
        } elseif (Str::contains($lowerTitle, 'festival') || Str::contains($lowerTitle, 'event')) {
            $category = 'Events';
        }

        // Parse date
        $pubDate = now();

        // Fallback image
        $fallbackImages = [
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
        ];
        $finalImage = $imageUrl ?: $fallbackImages[array_rand($fallbackImages)];

        // Create NewsArticle
        NewsArticle::create([
            'headline' => $title,
            'subtitle' => $description ?: 'Automated AI Intelligence breakdown & live publisher attribution.',
            'slug' => $slug,
            'ai_summary' => "Live aggregated news on '{$title}'. Synthesized with AI analysis for GETVNT event organizers and entertainment enthusiasts.",
            'content' => "This story was automatically aggregated via RSS feed from {$source->name}.\n\nFull original reporting remains credited to {$source->name}.\n\nGETVNT AI Intelligence monitors real-time global entertainment trends, concert ticket demands, and festival culture across Africa and worldwide.",
            'ai_insights' => [
                'why_it_matters' => "High audience interest in relevant categories such as music, movies, tech, and events.",
                'industry_impact' => "Increased traffic and venue ticket conversion for related events.",
                'event_opportunities' => "GETVNT organizers can leverage this trend to launch targeted early-bird ticket passes.",
                'social_reactions' => "Trending across RSS feeds and social media."
            ],
            'key_takeaways' => [
                "Aggregated from {$source->name} via RSS.",
                "AI-generated executive summary & SEO metadata.",
                "Directly linked to GETVNT marketplace ticketing engine."
            ],
            'featured_image' => $finalImage,
            'source_name' => $sourceName,
            'source_url' => $link,
            'author' => $sourceName . ' Editorial',
            'pub_date' => $pubDate,
            'category' => $category,
            'region' => $source->region,
            'tags' => ['RSS', 'Automation', 'GETVNT'],
            'views_count' => rand(800, 5000),
            'shares_count' => rand(120, 900),
            'likes_count' => rand(200, 1500),
            'is_featured' => false,
            'status' => 'published',
        ]);

        $newArticlesCount++;

        // Detailed logging for image extraction
        Log::info('RSS Article Processed', [
            'publisher' => $source->name,
            'rss_url' => $source->rss_url,
            'article_url' => $link,
            'image_found' => !empty($imageUrl),
            'image_source' => $imageUrl,
            'final_image' => $finalImage,
            'fallback_used' => empty($imageUrl),
            'reason' => empty($imageUrl) ? 'No image found in feed item' : 'Image extracted and validated',
        ]);

    }

    protected function extractImageFromItem($item)
    {
        // Priority 1: media:content
        if (!empty($item->children('media'))) {
            $media = $item->media;
            if (!empty($media->content)) {
                $url = (string) $media->content['url'];
                if (!empty($url) && $this->validateImageUrl($url)) {
                    return $url;
                }
            }
        }

        // Priority 2: media:thumbnail
        if (!empty($item->children('media'))) {
            $media = $item->media;
            if (!empty($media->thumbnail)) {
                $url = (string) $media->thumbnail['url'];
                if (!empty($url) && $this->validateImageUrl($url)) {
                    return $url;
                }
            }
        }

        // Priority 3: media:group
        if (!empty($item->children('media'))) {
            $media = $item->media;
            if (!empty($media->group)) {
                $group = $media->group;
                if (!empty($group->content)) {
                    $url = (string) $group->content['url'];
                    if (!empty($url) && $this->validateImageUrl($url)) {
                        return $url;
                    }
                }
                if (!empty($group->thumbnail)) {
                    $url = (string) $group->thumbnail['url'];
                    if (!empty($url) && $this->validateImageUrl($url)) {
                        return $url;
                    }
                }
            }
        }

        // Priority 4: enclosure
        if (!empty($item->enclosure)) {
            $url = (string) $item->enclosure['url'];
            if (!empty($url) && $this->validateImageUrl($url)) {
                return $url;
            }
        }

        // Priority 5: image tag
        if (!empty($item->image)) {
            $url = (string) $item->image;
            if (!empty($url) && $this->validateImageUrl($url)) {
                return $url;
            }
        }

        // Priority 6: thumbnail tag
        if (!empty($item->thumbnail)) {
            $url = (string) $item->thumbnail;
            if (!empty($url) && $this->validateImageUrl($url)) {
                return $url;
            }
        }

        // Priority 7: content:encoded (parse HTML img tags)
        if (!empty($item->children('content'))) {
            $content = $item->children('content', true);
            if (!empty($content->encoded)) {
                $encoded = (string) $item->children('content', true)->encoded;
                $imageUrl = $this->extractImageFromHtml($encoded);
                if ($imageUrl && $this->validateImageUrl($imageUrl)) {
                    return $imageUrl;
                }
            }
        }

        // Priority 8: description (parse HTML img tags)
        if (!empty($item->description)) {
            $description = (string) $item->description;
            $imageUrl = $this->extractImageFromHtml($description);
            if ($imageUrl && $this->validateImageUrl($imageUrl)) {
                return $imageUrl;
            }
        }

        // Priority 9: summary (parse HTML img tags)
        if (!empty($item->summary)) {
            $summary = (string) $item->summary;
            $imageUrl = $this->extractImageFromHtml($summary);
            if ($imageUrl && $this->validateImageUrl($imageUrl)) {
                return $imageUrl;
            }
        }

        // Priority 10: Visit original article URL (if we have a link)
        if (!empty($item->link)) {
            $link = (string) $item->link;
            $imageUrl = $this->extractImageFromArticleUrl($link);
            if ($imageUrl && $this->validateImageUrl($imageUrl)) {
                return $imageUrl;
            }
        }

        return null;
    }

    /**
     * Extract image URL from HTML content by looking for img tags
     */
    protected function extractImageFromHtml($html)
    {
        if (empty($html)) {
            return null;
        }

        // Look for <img> tags
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $html, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Extract image URL from article URL by fetching and parsing for og:image, twitter:image, etc.
     */
    protected function extractImageFromArticleUrl($url)
    {
        try {
            $response = Http::timeout(15)
                ->retry(2, 500)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                ])
                ->get($url);

            if ($response->failed()) {
                return null;
            }

            $html = $response->body();
            if (empty($html)) {
                return null;
            }

            // Check for og:image
            if (preg_match('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\'][^>]*>/i', $html, $matches)) {
                return $matches[1];
            }

            // Check for twitter:image
            if (preg_match('/<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)["\'][^>]*>/i', $html, $matches)) {
                return $matches[1];
            }

            // Check for image_src (old Facebook)
            if (preg_match('/<link[^>]+rel=["\']image_src["\'][^>]+href=["\']([^"\']+)["\'][^>]*>/i', $html, $matches)) {
                return $matches[1];
            }

            // Fallback to first img tag
            if (preg_match('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $html, $matches)) {
                return $matches[1];
            }

            return null;
        } catch (\Exception $e) {
            Log::warning('Failed to extract image from article URL: ' . $url . ' - ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate image URL: check if it's accessible and is a valid image
     */
    protected function validateImageUrl($url)
    {
        if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                ])
                ->head($url);

            if ($response->successful()) {
                $contentType = $response->header('Content-Type');
                if (!empty($contentType) && Str::startsWith($contentType, 'image/')) {
                    return true;
                }
            }

            // If HEAD fails, try GET with range request to check first few bytes
            $response = Http::timeout(15)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Range' => 'bytes=0-1023',
                ])
                ->get($url);

            if ($response->successful()) {
                $contentType = $response->header('Content-Type');
                if (!empty($contentType) && Str::startsWith($contentType, 'image/')) {
                    return true;
                }
            }

            return false;
        } catch (\Exception $e) {
            return false;
        }
    }
}