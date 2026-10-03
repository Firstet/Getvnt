<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $isProduction = app()->environment('production');
        $adminEmail = env('ADMIN_EMAIL');
        $adminPassword = env('ADMIN_PASSWORD');

        if ($isProduction) {
            $forceSeed = env('FORCE_SEED_ADMIN') || in_array('--force-seed-admin', $_SERVER['argv'] ?? []);
            if (!$forceSeed) {
                throw new \RuntimeException("Refusing to seed admin user in production without --force-seed-admin flag.");
            }
            if (empty($adminEmail) || empty($adminPassword)) {
                throw new \RuntimeException("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required in production.");
            }
        } else {
            $adminEmail = $adminEmail ?: 'admin@getvnt.com';
            $adminPassword = $adminPassword ?: 'Password123!';
        }

        // 1. Create Super Admin User for Platform Control Center
        User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'id'         => (string) Str::uuid(),
                'name'       => 'Getvnt Super Admin',
                'email'      => $adminEmail,
                'password'   => bcrypt($adminPassword),
                'role'       => 'super_admin',
                'is_active'  => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed Super Admin Data (Payment Gateways, AI Providers, CMS Sections, Websites)
        $this->call(PlatformDataSeeder::class);
        if (class_exists(IntegrationsSeeder::class)) {
            $this->call(IntegrationsSeeder::class);
        }
    }
}
