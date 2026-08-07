<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsPage extends Model
{
    protected $table = 'cms_pages';

    protected $fillable = [
        'slug',
        'title',
        'subtitle',
        'body_markdown',
        'meta_title',
        'meta_description',
        'is_published',
        'author',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public static function seedDefaults(): void
    {
        $pages = [
            ['slug' => 'about',    'title' => 'About GETVNT',        'subtitle' => 'Africa\'s Leading Enterprise Event Operating System'],
            ['slug' => 'privacy',  'title' => 'Privacy Policy',      'subtitle' => 'How we protect your personal and ticketing data'],
            ['slug' => 'terms',    'title' => 'Terms of Service',    'subtitle' => 'Platform usage terms and ticketing policies'],
            ['slug' => 'careers',  'title' => 'Careers at GETVNT',   'subtitle' => 'Join us in building the future of African live entertainment'],
            ['slug' => 'contact',  'title' => 'Contact Support',     'subtitle' => 'Reach out to our 24/7 event operations team'],
        ];

        foreach ($pages as $p) {
            self::firstOrCreate(
                ['slug' => $p['slug']],
                [
                    'title'        => $p['title'],
                    'subtitle'     => $p['subtitle'],
                    'body_markdown'=> "# {$p['title']}\n\nContent for {$p['title']} managed dynamically via Super Admin CMS Governance.",
                    'is_published' => true,
                    'author'       => 'Super Admin',
                ]
            );
        }
    }
}
