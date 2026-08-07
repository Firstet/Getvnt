<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsSection extends Model
{
    protected $table = 'cms_sections';

    protected $fillable = [
        'page_slug',
        'section_key',
        'title',
        'subtitle',
        'is_visible',
        'order_index',
        'content_json',
    ];

    protected $casts = [
        'is_visible'   => 'boolean',
        'content_json' => 'array',
    ];

    public static function seedDefaults(): void
    {
        $sections = [
            [
                'page_slug'    => 'landing',
                'section_key'  => 'hero',
                'title'        => 'Discover & Host Unforgettable Events Across Africa',
                'subtitle'     => 'Sell tickets globally with zero friction, instant Paystack payouts, and AI marketing automation.',
                'order_index'  => 1,
                'content_json' => [
                    'badge'        => '🚀 Next-Gen Event OS v1.0',
                    'cta_primary'  => 'Create Free Workspace',
                    'cta_url'      => '/register',
                    'bg_video_url' => '',
                ]
            ],
            [
                'page_slug'    => 'landing',
                'section_key'  => 'features',
                'title'        => 'Everything You Need To Scale Live Events',
                'subtitle'     => 'Built for high-volume concert promoters, festival directors, and conference organizers.',
                'order_index'  => 2,
                'content_json' => [
                    'cards' => [
                        ['title' => 'Instant QR Scanning', 'desc' => 'Validate thousands of attendees per minute offline.', 'icon' => 'QrCode'],
                        ['title' => 'AI Copywriter & Pricing', 'desc' => 'Generate marketing emails and dynamic ticket tiers.', 'icon' => 'Sparkles'],
                        ['title' => 'Multi-Currency Gateways', 'desc' => 'Paystack, Flutterwave, Stripe & Monnify built-in.', 'icon' => 'CreditCard'],
                    ]
                ]
            ],
            [
                'page_slug'    => 'landing',
                'section_key'  => 'faq',
                'title'        => 'Frequently Asked Questions',
                'subtitle'     => 'Got questions? We have answers.',
                'order_index'  => 3,
                'content_json' => [
                    'questions' => [
                        ['q' => 'How fast do payout settlements hit my bank?', 'a' => 'Instant settlement via Paystack and Flutterwave within 24 hours.'],
                        ['q' => 'Can I use custom domain name for my events?', 'a' => 'Yes, enterprise plans include full white-label custom domain mapping.'],
                    ]
                ]
            ],
        ];

        foreach ($sections as $s) {
            self::firstOrCreate(
                ['page_slug' => $s['page_slug'], 'section_key' => $s['section_key']],
                [
                    'title'        => $s['title'],
                    'subtitle'     => $s['subtitle'],
                    'is_visible'   => true,
                    'order_index'  => $s['order_index'],
                    'content_json' => $s['content_json'],
                ]
            );
        }
    }
}
