<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KycEnforcementTest extends TestCase
{
    use RefreshDatabase;

    public function test_unapproved_user_blocked_from_workspace_dashboard()
    {
        $user = User::factory()->create([
            'role' => 'organizer',
            'verification_status' => 'unverified',
            'verified_badge' => false,
        ]);

        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->getJson('/api/v1/workspace/dashboard');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_approved_user_allowed_workspace_dashboard()
    {
        $tenant = \App\Models\Tenant::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Kyc Approved Tenant',
            'slug' => 'kyc-approved-tenant',
            'status' => 'active',
        ]);

        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'role' => 'trusted_organizer',
            'verification_status' => 'approved',
            'verified_badge' => true,
        ]);

        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->getJson('/api/v1/workspace/dashboard');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }
}
