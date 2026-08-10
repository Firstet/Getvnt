<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PlatformDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Payment Gateway Configs
        $gateways = ['paystack', 'flutterwave', 'stripe', 'monnify', 'remita', 'square', 'bank_transfer'];
        foreach ($gateways as $provider) {
            $exists = DB::table('payment_gateway_configs')->where('provider', $provider)->exists();
            if (!$exists) {
                DB::table('payment_gateway_configs')->insert([
                    'id'          => (string) Str::uuid(),
                    'provider'    => $provider,
                    'environment' => 'sandbox',
                    'is_enabled'  => 1,
                    'is_default'  => $provider === 'paystack' ? 1 : 0,
                    'currency'    => 'USD',
                    'status'      => 'active',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        }
        $this->command->info('Payment gateways: ' . DB::table('payment_gateway_configs')->count());

        // 2. AI Providers (using slug column)
        $aiProviders = [
            ['name' => 'OpenAI',           'slug' => 'openai',      'default_model' => 'gpt-4o',                    'avg_latency_ms' => 280, 'cost_per_1k_tokens' => 0.0025, 'requests_today' => 1420, 'tokens_today' => 485000],
            ['name' => 'Anthropic Claude', 'slug' => 'claude',      'default_model' => 'claude-3-5-sonnet-20241022', 'avg_latency_ms' => 310, 'cost_per_1k_tokens' => 0.0030, 'requests_today' => 890,  'tokens_today' => 312000],
            ['name' => 'Google Gemini',    'slug' => 'gemini',      'default_model' => 'gemini-2.0-flash',          'avg_latency_ms' => 240, 'cost_per_1k_tokens' => 0.0012, 'requests_today' => 2100, 'tokens_today' => 721000],
            ['name' => 'DeepSeek AI',      'slug' => 'deepseek',    'default_model' => 'deepseek-reasoner',         'avg_latency_ms' => 210, 'cost_per_1k_tokens' => 0.0008, 'requests_today' => 560,  'tokens_today' => 198000],
            ['name' => 'Groq LPU',         'slug' => 'groq',        'default_model' => 'llama-3.3-70b-versatile',   'avg_latency_ms' => 120, 'cost_per_1k_tokens' => 0.0005, 'requests_today' => 3200, 'tokens_today' => 1120000],
            ['name' => 'OpenRouter',        'slug' => 'openrouter',  'default_model' => 'auto',                      'avg_latency_ms' => 290, 'cost_per_1k_tokens' => 0.0015, 'requests_today' => 440,  'tokens_today' => 156000],
            ['name' => 'Ollama Local',      'slug' => 'ollama',      'default_model' => 'llama3.2',                  'avg_latency_ms' => 180, 'cost_per_1k_tokens' => 0.0000, 'requests_today' => 120,  'tokens_today' => 42000],
        ];
        foreach ($aiProviders as $p) {
            $exists = DB::table('ai_providers')->where('slug', $p['slug'])->exists();
            if (!$exists) {
                DB::table('ai_providers')->insert([
                    'name'               => $p['name'],
                    'slug'               => $p['slug'],
                    'default_model'      => $p['default_model'],
                    'avg_latency_ms'     => $p['avg_latency_ms'],
                    'cost_per_1k_tokens' => $p['cost_per_1k_tokens'],
                    'requests_today'     => $p['requests_today'],
                    'tokens_today'       => $p['tokens_today'],
                    'status'             => 'active',
                    'priority'           => 1,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);
            }
        }
        $this->command->info('AI providers: ' . DB::table('ai_providers')->count());

        // 3. AI Feature Models
        $features = [
            ['code' => 'event_generator', 'name' => 'Event Creation Assistant',    'provider' => 'openai',   'model' => 'gpt-4o'],
            ['code' => 'website_builder', 'name' => 'Website Content Generator',   'provider' => 'claude',   'model' => 'claude-3-5-sonnet-20241022'],
            ['code' => 'poster',          'name' => 'Event Poster AI Prompt',       'provider' => 'gemini',   'model' => 'gemini-2.0-flash'],
            ['code' => 'email_writer',    'name' => 'Marketing Email Writer',       'provider' => 'openai',   'model' => 'gpt-4o-mini'],
            ['code' => 'crm',             'name' => 'CRM Smart Segmenter',          'provider' => 'deepseek', 'model' => 'deepseek-reasoner'],
            ['code' => 'support',         'name' => 'Attendee Support Bot',         'provider' => 'groq',     'model' => 'llama-3.3-70b-versatile'],
            ['code' => 'kyc',             'name' => 'KYC Document Verifier',        'provider' => 'openai',   'model' => 'gpt-4o'],
            ['code' => 'moderation',      'name' => 'Content Moderation Guard',     'provider' => 'openai',   'model' => 'text-moderation-latest'],
        ];
        foreach ($features as $f) {
            $exists = DB::table('ai_feature_models')->where('feature_code', $f['code'])->exists();
            if (!$exists) {
                DB::table('ai_feature_models')->insert([
                    'id'           => (string) Str::uuid(),
                    'feature_code' => $f['code'],
                    'feature_name' => $f['name'],
                    'provider_code' => $f['provider'],
                    'model_name'   => $f['model'],
                    'temperature'  => 0.7,
                    'max_tokens'   => 2048,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }
        }
        $this->command->info('AI feature models: ' . DB::table('ai_feature_models')->count());

        // 4. CMS Landing Sections
        $sections = [
            ['key' => 'hero',        'title' => 'Find & Attend Amazing Events Near You', 'subtitle' => 'Buy tickets instantly with QR check-in',    'content' => ['body' => 'GETVNT is the all-in-one event ticketing platform. Discover concerts, conferences, workshops, and more.'], 'sort' => 1],
            ['key' => 'features',    'title' => 'Everything You Need to Host Events',    'subtitle' => 'From tickets to door check-in',             'content' => ['body' => 'From ticket sales to door check-in, marketing automation to CRM — GETVNT gives organizers every tool they need.'], 'sort' => 2],
            ['key' => 'how_it_works','title' => 'How GETVNT Works',                       'subtitle' => 'Simple, fast, powerful',                    'content' => ['body' => '1. Create your event. 2. Set ticket types. 3. Promote. 4. Collect payment. 5. Check-in with QR codes.'], 'sort' => 3],
            ['key' => 'pricing',     'title' => 'Simple, Transparent Pricing',            'subtitle' => 'No hidden fees',                            'content' => ['body' => 'Start free. GETVNT only charges a small platform fee when you sell tickets. Upgrade to Pro for unlimited events.'], 'sort' => 4],
            ['key' => 'organizers',  'title' => 'Trusted by Organizers Globally',         'subtitle' => 'Join thousands of creators',               'content' => ['body' => 'From music festivals to corporate summits, GETVNT powers thousands of events annually.'], 'sort' => 5],
            ['key' => 'cta',         'title' => 'Ready to Host Your Next Event?',         'subtitle' => 'Start in 5 minutes, no credit card needed', 'content' => ['body' => 'Join GETVNT today and start selling tickets in under 5 minutes.'], 'sort' => 6],
        ];
        foreach ($sections as $s) {
            $exists = DB::table('cms_landing_sections')->where('section_key', $s['key'])->exists();
            if (!$exists) {
                DB::table('cms_landing_sections')->insert([
                    'id'          => (string) Str::uuid(),
                    'section_key' => $s['key'],
                    'title'       => $s['title'],
                    'subtitle'    => $s['subtitle'],
                    'content'     => json_encode($s['content']),
                    'is_enabled'  => 1,
                    'sort_order'  => $s['sort'],
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        }
        $this->command->info('CMS sections: ' . DB::table('cms_landing_sections')->count());

        // 5. Organizer Micro-Websites
        $websites = [
            ['name' => 'Apex Events Ltd', 'site_title' => 'Apex Events Official', 'subdomain' => 'apexevents', 'template' => 'music_festival', 'is_published' => 1],
            ['name' => 'Tech Summit Global', 'site_title' => 'Tech Summit Global 2026', 'subdomain' => 'techsummit', 'template' => 'tech_conference', 'is_published' => 1],
            ['name' => 'Vibe Nights Entertainment', 'site_title' => 'Vibe Nights Club', 'subdomain' => 'vibenights', 'template' => 'nightlife', 'is_published' => 0],
        ];
        foreach ($websites as $w) {
            $exists = DB::table('organizer_websites')->where('subdomain', $w['subdomain'])->exists();
            if (!$exists) {
                $tId = (string) Str::uuid();
                DB::table('tenants')->insert([
                    'id'         => $tId,
                    'name'       => $w['name'],
                    'slug'       => $w['subdomain'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                DB::table('organizer_websites')->insert([
                    'id'           => (string) Str::uuid(),
                    'tenant_id'    => $tId,
                    'site_title'   => $w['site_title'],
                    'subdomain'    => $w['subdomain'],
                    'template'     => $w['template'],
                    'is_published' => $w['is_published'],
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            }
        }
        $this->command->info('Organizer websites: ' . DB::table('organizer_websites')->count());
    }
}
