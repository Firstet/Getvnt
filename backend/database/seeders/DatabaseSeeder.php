<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Super Admin User for Platform Control Center
        $superAdmin = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Getvnt Super Admin',
            'email' => 'admin@getvnt.com',
            'password' => bcrypt('password123'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        // 2. Create Sample African Event Organizer Tenants
        $tenant1 = Tenant::create([
            'id' => (string) Str::uuid(),
            'name' => 'AfroNation Events Ltd',
            'slug' => 'afronation',
            'domain' => 'afronation.getvnt.com',
            'status' => 'active',
            'is_verified' => true,
            'branding' => [
                'primary' => '#6366F1',
                'secondary' => '#EC4899',
                'dark' => '#0F172A',
            ],
        ]);

        $tenant2 = Tenant::create([
            'id' => (string) Str::uuid(),
            'name' => 'Tech Fest Africa',
            'slug' => 'techfest-africa',
            'domain' => 'techfest.getvnt.com',
            'status' => 'active',
            'is_verified' => true,
            'branding' => [
                'primary' => '#10B981',
                'secondary' => '#3B82F6',
                'dark' => '#022C22',
            ],
        ]);

        // 3. Create Organizer Users
        $organizer1 = User::create([
            'id' => (string) Str::uuid(),
            'name' => 'Kwame Osei',
            'email' => 'kwame@afronation.com',
            'password' => bcrypt('password123'),
            'role' => 'organizer_owner',
            'tenant_id' => $tenant1->id,
            'is_active' => true,
        ]);

        $tenant1->users()->attach($organizer1->id, ['role' => 'organizer_owner']);

        // 4. Create Flagship Events for Marketplace & Workspace
        $event1 = Event::create([
            'id' => (string) Str::uuid(),
            'tenant_id' => $tenant1->id,
            'title' => 'Afrobeat Festival Lagos 2026',
            'slug' => 'afrobeat-festival-lagos-2026',
            'tagline' => 'Africa\'s Biggest Music & Culture Celebration',
            'description' => 'Join thousands of music lovers in Lagos for 3 explosive days of live performances, Afrobeats stars, food, culture, and interactive installations.',
            'category' => 'Music',
            'banner_url' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
            'gallery_urls' => [
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'
            ],
            'start_date' => '2026-11-20 16:00:00',
            'end_date' => '2026-11-22 23:59:00',
            'timezone' => 'Africa/Lagos',
            'location_type' => 'physical',
            'venue_name' => 'Eko Hotel & Suites Convention Center',
            'venue_address' => 'Plot 1415 Adetokunbo Ademola Street, Victoria Island',
            'city' => 'Lagos',
            'country' => 'Nigeria',
            'latitude' => 6.4281,
            'longitude' => 3.4219,
            'status' => 'published',
            'is_featured' => true,
            'is_trending' => true,
            'agenda' => [
                ['time' => '16:00', 'title' => 'Gates Open & Red Carpet', 'speaker' => 'DJ Neptune'],
                ['time' => '19:00', 'title' => 'Mainstage Afrobeats Showcase', 'speaker' => 'Burna Boy, Asake & Tems']
            ],
            'faqs' => [
                ['question' => 'What is the age requirement?', 'answer' => 'This event is 18+ only.'],
                ['question' => 'Are tickets refundable?', 'answer' => 'Tickets are non-refundable but transferable.']
            ]
        ]);

        $event2 = Event::create([
            'id' => (string) Str::uuid(),
            'tenant_id' => $tenant2->id,
            'title' => 'Africa AI & Startup Summit 2026',
            'slug' => 'africa-ai-startup-summit-2026',
            'tagline' => 'Building the Next Generation of African Tech Giants',
            'description' => 'The definitive gathering for founders, investors, engineers, and AI pioneers shaping the digital future of Africa.',
            'category' => 'Technology',
            'banner_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
            'gallery_urls' => [],
            'start_date' => '2026-09-15 09:00:00',
            'end_date' => '2026-09-16 17:00:00',
            'timezone' => 'Africa/Nairobi',
            'location_type' => 'hybrid',
            'venue_name' => 'Kenyatta International Convention Centre',
            'venue_address' => 'Harambee Ave, City Square',
            'city' => 'Nairobi',
            'country' => 'Kenya',
            'status' => 'published',
            'is_featured' => true,
            'is_trending' => false,
        ]);

        // 5. Create Ticket Types
        $ticketType1 = TicketType::create([
            'id' => (string) Str::uuid(),
            'event_id' => $event1->id,
            'tenant_id' => $tenant1->id,
            'name' => 'General Admission Pass',
            'description' => 'Access to mainstage and food village for all 3 days.',
            'type' => 'paid',
            'price' => 25000.00,
            'currency' => 'NGN',
            'quantity_available' => 5000,
            'quantity_sold' => 1420,
            'max_per_order' => 5,
            'is_active' => true,
        ]);

        $ticketType2 = TicketType::create([
            'id' => (string) Str::uuid(),
            'event_id' => $event1->id,
            'tenant_id' => $tenant1->id,
            'name' => 'VIP Backstage Access',
            'description' => 'Fast-track entry, VIP lounge, complimentary drinks & artiste meet-and-greet.',
            'type' => 'vip',
            'price' => 120000.00,
            'currency' => 'NGN',
            'quantity_available' => 300,
            'quantity_sold' => 88,
            'max_per_order' => 2,
            'is_active' => true,
        ]);

        // 6. Seed Super Admin Integrations Center Data
        $this->call(IntegrationsSeeder::class);
    }
}

