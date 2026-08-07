<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NewsSource;
use App\Models\NewsArticle;
use App\Models\Event;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed News Sources
        $sources = [
            ['name' => 'Pulse Nigeria', 'url' => 'https://pulse.ng', 'rss_url' => 'https://pulse.ng/rss', 'region' => 'Nigeria', 'category' => 'Entertainment', 'is_enabled' => true],
            ['name' => 'BellaNaija', 'url' => 'https://bellanaija.com', 'rss_url' => 'https://bellanaija.com/feed', 'region' => 'Nigeria', 'category' => 'Celebrities', 'is_enabled' => true],
            ['name' => 'NotJustOk', 'url' => 'https://notjustok.com', 'rss_url' => 'https://notjustok.com/feed', 'region' => 'Nigeria', 'category' => 'Music', 'is_enabled' => true],
            ['name' => 'Channels TV Entertainment', 'url' => 'https://channelstv.com', 'rss_url' => 'https://channelstv.com/category/entertainment/feed', 'region' => 'Nigeria', 'category' => 'Events', 'is_enabled' => true],
            ['name' => 'Pulse Ghana', 'url' => 'https://pulse.com.gh', 'rss_url' => 'https://pulse.com.gh/rss', 'region' => 'West Africa', 'category' => 'Music', 'is_enabled' => true],
            ['name' => 'TechCabal Africa', 'url' => 'https://techcabal.com', 'rss_url' => 'https://techcabal.com/feed', 'region' => 'Africa', 'category' => 'Technology', 'is_enabled' => true],
            ['name' => 'BBC Entertainment', 'url' => 'https://bbc.com/news/entertainment_and_arts', 'rss_url' => 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', 'region' => 'Europe', 'category' => 'Culture', 'is_enabled' => true],
            ['name' => 'Rolling Stone', 'url' => 'https://rollingstone.com', 'rss_url' => 'https://rollingstone.com/feed', 'region' => 'Global', 'category' => 'Music', 'is_enabled' => true],
            ['name' => 'Variety', 'url' => 'https://variety.com', 'rss_url' => 'https://variety.com/feed', 'region' => 'Global', 'category' => 'Movies', 'is_enabled' => true],
            ['name' => 'Reuters Entertainment', 'url' => 'https://reuters.com', 'rss_url' => 'https://reuters.com/rss/entertainment', 'region' => 'Global', 'category' => 'Events', 'is_enabled' => true],
        ];

        foreach ($sources as $src) {
            NewsSource::updateOrCreate(
                ['name' => $src['name']],
                $src
            );
        }

        // Find a featured event if exists
        $event = Event::first();
        $eventId = $event ? $event->id : null;

        // 2. Seed Articles (Single Featured Story + Regular Grid Stories)
        $articles = [
            [
                'headline' => 'Afrobeats Stars Announce 2026 World Tour Schedule Across Lagos, London & New York',
                'subtitle' => 'Global stadium dates revealed with VIP pre-sale access exclusively on GETVNT Platform.',
                'slug' => 'afrobeats-stars-announce-2026-world-tour-schedule',
                'ai_summary' => 'Pan-African Afrobeats headliners join forces for a landmark 2026 multi-city stadium tour kicking off in Lagos, Accra, London, and New York.',
                'content' => "The world's biggest Afrobeats megastars have officially announced a multi-city global stadium tour kicking off in Lagos, Accra, London, and New York. Fans can register early on GETVNT for exclusive VIP pre-sale access.\n\nIndustry insiders note that ticket demand is projected to surpass previous records by 340%, driven by unprecedented streaming numbers across North America and Europe.",
                'ai_insights' => [
                    'why_it_matters' => 'Afrobeats continues its global reign, transitioning from club anthems to sold-out 80,000-capacity European and North American arenas.',
                    'industry_impact' => 'Drives over $120M in ticket revenue across live entertainment ecosystems in Lagos, London, and LA.',
                    'event_opportunities' => 'GETVNT partners with official organizers to deliver zero-friction QR wristband access and instant multi-tiered ticket checkout.',
                    'social_reactions' => 'Over 4.2M tweets and TikTok videos within 2 hours of press announcement.'
                ],
                'key_takeaways' => [
                    'Tour kicks off in Lagos National Stadium before heading to O2 Arena London & Madison Square Garden.',
                    'VIP Early Bird registration opens exclusively on GETVNT.',
                    'Dynamic pricing & anti-scalping QR encryption enabled on all passes.'
                ],
                'featured_image' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
                'source_name' => 'Pulse Nigeria',
                'source_url' => 'https://pulse.ng/entertainment/afrobeats-2026-world-tour',
                'author' => 'Marcus Vance',
                'pub_date' => now()->subMinutes(10),
                'category' => 'Music',
                'region' => 'Nigeria',
                'tags' => ['Afrobeats', 'Concerts', 'Lagos', 'London', 'GETVNT Exclusive'],
                'views_count' => 14200,
                'shares_count' => 3890,
                'likes_count' => 5120,
                'is_featured' => true,
                'is_breaking' => true,
                'status' => 'published',
                'related_event_id' => $eventId,
            ],
            [
                'headline' => 'Nairobi Tech & Creative Summit Unveils 2026 Mainstage Speaker Lineup',
                'subtitle' => 'East Africa’s premier developer & arts gathering expands to 3 days of keynotes.',
                'slug' => 'nairobi-tech-creative-summit-2026-lineup',
                'ai_summary' => 'East Africa’s largest creative developer, music tech, and investor summit expands to 3 days with keynotes from global tech founders and venture partners.',
                'content' => "The annual Nairobi Tech & Creative Summit returns with an expanded 3-day immersive event featuring live music performances, venture keynotes, and hackathons.",
                'ai_insights' => [
                    'why_it_matters' => 'Bridges tech innovation with West & East African creative industries.',
                    'industry_impact' => 'Attracts $45M+ in venture deal commitments for African tech-enabled entertainment startups.',
                    'event_opportunities' => 'Exhibitor booths and masterclass passes available on GETVNT marketplace.',
                    'social_reactions' => '#NairobiTech2026 trending #1 across Kenya and Rwanda.'
                ],
                'key_takeaways' => [
                    'Over 150 speakers across AI, Web3, Music Production & Event OS technology.',
                    'Interactive hackathons with $100,000 in founder grants.',
                    'Live acoustic lounge and networking galas nightly.'
                ],
                'featured_image' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
                'source_name' => 'TechCabal Africa',
                'source_url' => 'https://techcabal.com/nairobi-tech-summit-2026',
                'author' => 'Amina Diop',
                'pub_date' => now()->subHours(2),
                'category' => 'Technology',
                'region' => 'East Africa',
                'tags' => ['Nairobi', 'Tech Summit', 'AI', 'Startups'],
                'views_count' => 8400,
                'shares_count' => 1240,
                'likes_count' => 2900,
                'is_featured' => false,
                'is_breaking' => false,
                'status' => 'published',
                'related_event_id' => $eventId,
            ],
            [
                'headline' => 'Cape Town Film & Music Arts Festival Sets Single-Day Ticket Sales Record',
                'subtitle' => 'International indie directors and African storytellers gather at V&A Waterfront.',
                'slug' => 'cape-town-film-music-festival-ticket-record',
                'ai_summary' => 'Record-breaking demand hit the Cape Town International Film and Music Festival as early bird tickets completely sold out within minutes of public launch.',
                'content' => "Record-breaking demand hit the Cape Town International Film and Music Festival as early bird tickets completely sold out within minutes of public launch on GETVNT.",
                'ai_insights' => [
                    'why_it_matters' => 'Demonstrates rapid resurgence in African film festival attendance.',
                    'industry_impact' => 'Boosts Cape Town tourism hospitality occupancy to 98%.',
                    'event_opportunities' => 'Second tier regular passes now released on GETVNT.',
                    'social_reactions' => 'Over 850k video views of opening ceremony trailers.'
                ],
                'key_takeaways' => [
                    'Early bird passes sold out in 14 minutes.',
                    '72 indie films and 30 live acoustic performances curated.',
                    'GETVNT mobile QR scanning handles 12,000 attendees per hour.'
                ],
                'featured_image' => 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
                'source_name' => 'Daily Maverick',
                'source_url' => 'https://dailymaverick.co.za/capetown-film-fest',
                'author' => 'David Chen',
                'pub_date' => now()->subHours(4),
                'category' => 'Movies',
                'region' => 'Southern Africa',
                'tags' => ['Cape Town', 'Film Festival', 'Movies', 'South Africa'],
                'views_count' => 6200,
                'shares_count' => 890,
                'likes_count' => 1840,
                'is_featured' => false,
                'is_breaking' => false,
                'status' => 'published',
                'related_event_id' => null,
            ],
            [
                'headline' => 'The Evolution of Nightlife Tech: How Smart Ticketing Is Transforming Festivals',
                'subtitle' => 'NFC Wristbands and AI Event OS Rule 2026 Nightlife Scene.',
                'slug' => 'evolution-of-nightlife-tech-smart-ticketing',
                'ai_summary' => 'Promoters across Paris, Johannesburg, and Dubai are adopting cashless NFC check-ins and real-time revenue analytics for mega festivals.',
                'content' => "Modern event business operating systems are revolutionizing event logistics with zero-line entrance scanning and instant payout splits for festival organizers.",
                'ai_insights' => [
                    'why_it_matters' => 'Eliminates entrance bottleneck queues and fraud.',
                    'industry_impact' => 'Increases festival bar & merchandise sales by 28%.',
                    'event_opportunities' => 'Organizers can deploy GETVNT NFC terminals in under 10 minutes.',
                    'social_reactions' => 'Widely praised by event production leaders worldwide.'
                ],
                'key_takeaways' => [
                    'Zero-line QR and NFC check-ins.',
                    'Instant revenue settlement to organizer wallets.',
                    'Real-time crowd analytics and heatmaps.'
                ],
                'featured_image' => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
                'source_name' => 'Rolling Stone',
                'source_url' => 'https://rollingstone.com/nightlife-tech-2026',
                'author' => 'Sarah Jenkins',
                'pub_date' => now()->subHours(6),
                'category' => 'Events',
                'region' => 'Global',
                'tags' => ['Nightlife', 'Ticketing', 'NFC', 'Event OS'],
                'views_count' => 9500,
                'shares_count' => 2100,
                'likes_count' => 3400,
                'is_featured' => false,
                'is_breaking' => false,
                'status' => 'published',
                'related_event_id' => null,
            ]
        ];

        foreach ($articles as $art) {
            NewsArticle::updateOrCreate(
                ['slug' => $art['slug']],
                $art
            );
        }
    }
}
