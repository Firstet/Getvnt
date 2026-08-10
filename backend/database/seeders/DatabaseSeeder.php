<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Super Admin User for Platform Control Center
        User::firstOrCreate(
            ['email' => 'admin@getvnt.com'],
            [
                'id'         => (string) Str::uuid(),
                'name'       => 'Getvnt Super Admin',
                'email'      => 'admin@getvnt.com',
                'password'   => bcrypt('password123'),
                'role'       => 'super_admin',
                'is_active'  => true,
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed Super Admin Integrations Center Data (Payment Gateways, AI Providers, Storage)
        if (class_exists(IntegrationsSeeder::class)) {
            $this->call(IntegrationsSeeder::class);
        }
    }
}
