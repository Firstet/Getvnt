<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;
use App\Models\FeatureFlag;
use App\Models\User;
use App\Models\Tenant;
use App\Models\Subscription;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthAndSubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Feature Flags
        $flags = [
            ['code' => 'ai_assistant', 'name' => 'AI Event Assistant', 'description' => 'AI powered event content & copywriting', 'value_type' => 'boolean', 'default_value' => 'true'],
            ['code' => 'custom_domain', 'name' => 'Custom Domain', 'description' => 'Use custom subdomains and branding', 'value_type' => 'boolean', 'default_value' => 'false'],
            ['code' => 'own_payment_gateway', 'name' => 'Connect Own Payment Gateway', 'description' => 'Direct payout via own Paystack / Stripe', 'value_type' => 'boolean', 'default_value' => 'false'],
            ['code' => 'own_ai_keys', 'name' => 'Own AI API Keys', 'description' => 'Bring your own OpenAI or Gemini API Keys', 'value_type' => 'boolean', 'default_value' => 'false'],
            ['code' => 'analytics_advanced', 'name' => 'Advanced Analytics Suite', 'description' => 'Realtime revenue, cohort and buyer telemetry', 'value_type' => 'boolean', 'default_value' => 'true'],
            ['code' => 'team_members_limit', 'name' => 'Team Members Limit', 'description' => 'Maximum allowed workspace staff members', 'value_type' => 'limit', 'default_value' => '2'],
            ['code' => 'marketing_tools', 'name' => 'Marketing & Email Campaigns', 'description' => 'Send automated ticket buyer emails and SMS', 'value_type' => 'boolean', 'default_value' => 'false'],
            ['code' => 'priority_support', 'name' => 'Priority Support', 'description' => 'Dedicated account manager & SLA support', 'value_type' => 'boolean', 'default_value' => 'false'],
        ];

        $flagModels = [];
        foreach ($flags as $f) {
            $flagModels[$f['code']] = FeatureFlag::updateOrCreate(['code' => $f['code']], $f);
        }

        // 2. Subscription Plans
        $starter = SubscriptionPlan::updateOrCreate(['slug' => 'starter'], [
            'id' => (string) Str::uuid(),
            'name' => 'Starter',
            'slug' => 'starter',
            'description' => 'Ideal for new event organizers and creators hosting occasional events.',
            'price_monthly' => 0.00,
            'price_annual' => 0.00,
            'commission_rate' => 5.00,
            'trial_days' => 14,
            'is_active' => true,
            'is_featured' => false,
            'sort_order' => 1,
        ]);
        $starter->features()->sync([
            $flagModels['ai_assistant']->id => ['value' => 'true'],
            $flagModels['analytics_advanced']->id => ['value' => 'false'],
            $flagModels['team_members_limit']->id => ['value' => '2'],
            $flagModels['own_payment_gateway']->id => ['value' => 'false'],
            $flagModels['marketing_tools']->id => ['value' => 'false'],
            $flagModels['custom_domain']->id => ['value' => 'false'],
        ]);

        $pro = SubscriptionPlan::updateOrCreate(['slug' => 'professional'], [
            'id' => (string) Str::uuid(),
            'name' => 'Professional',
            'slug' => 'professional',
            'description' => 'Designed for growing event brands, venues, and festival producers.',
            'price_monthly' => 25000.00,
            'price_annual' => 250000.00,
            'commission_rate' => 2.50,
            'trial_days' => 14,
            'is_active' => true,
            'is_featured' => true,
            'sort_order' => 2,
        ]);
        $pro->features()->sync([
            $flagModels['ai_assistant']->id => ['value' => 'true'],
            $flagModels['analytics_advanced']->id => ['value' => 'true'],
            $flagModels['team_members_limit']->id => ['value' => '10'],
            $flagModels['own_payment_gateway']->id => ['value' => 'true'],
            $flagModels['marketing_tools']->id => ['value' => 'true'],
            $flagModels['custom_domain']->id => ['value' => 'false'],
        ]);

        $enterprise = SubscriptionPlan::updateOrCreate(['slug' => 'enterprise'], [
            'id' => (string) Str::uuid(),
            'name' => 'Enterprise',
            'slug' => 'enterprise',
            'description' => 'For large scale ticketing operators, arenas, and global music festivals.',
            'price_monthly' => 95000.00,
            'price_annual' => 950000.00,
            'commission_rate' => 1.50,
            'trial_days' => 30,
            'is_active' => true,
            'is_featured' => false,
            'sort_order' => 3,
        ]);
        $enterprise->features()->sync([
            $flagModels['ai_assistant']->id => ['value' => 'true'],
            $flagModels['analytics_advanced']->id => ['value' => 'true'],
            $flagModels['team_members_limit']->id => ['value' => '999'],
            $flagModels['own_payment_gateway']->id => ['value' => 'true'],
            $flagModels['own_ai_keys']->id => ['value' => 'true'],
            $flagModels['marketing_tools']->id => ['value' => 'true'],
            $flagModels['custom_domain']->id => ['value' => 'true'],
            $flagModels['priority_support']->id => ['value' => 'true'],
        ]);

        // 3. Super Admin User
        $superAdmin = User::updateOrCreate(
            ['email' => 'admin@getvnt.com'],
            [
                'id' => (string) Str::uuid(),
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'name' => 'Super Admin',
                'email' => 'admin@getvnt.com',
                'password' => Hash::make('Password123!'),
                'role' => 'super_admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // 4. Sample Organizer Tenant & Subscription
        $tenant = Tenant::updateOrCreate(
            ['slug' => 'afronation-events'],
            [
                'id' => (string) Str::uuid(),
                'name' => 'AfroNation Events Ltd',
                'slug' => 'afronation-events',
                'status' => 'active',
                'is_verified' => true,
            ]
        );

        $organizerUser = User::updateOrCreate(
            ['email' => 'organizer@afronation.com'],
            [
                'id' => (string) Str::uuid(),
                'first_name' => 'AfroNation',
                'last_name' => 'Owner',
                'name' => 'AfroNation Owner',
                'email' => 'organizer@afronation.com',
                'password' => Hash::make('Password123!'),
                'role' => 'organizer_owner',
                'tenant_id' => $tenant->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Attach tenant user pivot
        $tenant->users()->syncWithoutDetaching([
            $organizerUser->id => ['role' => 'organizer_owner']
        ]);

        Subscription::updateOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenant->id,
                'plan_id' => $pro->id,
                'status' => 'active',
                'billing_cycle' => 'monthly',
                'starts_at' => now(),
                'ends_at' => now()->addMonth(),
                'payment_method' => 'paystack',
            ]
        );
    }
}
