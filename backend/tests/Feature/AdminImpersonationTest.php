<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminImpersonationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_cannot_impersonate_super_admin()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $targetSuperAdmin = User::factory()->create(['role' => 'super_admin']);

        $token = $admin->createToken('admin')->plainTextToken;

        $response = $this->withToken($token)->postJson("/api/v1/admin/users/{$targetSuperAdmin->id}/impersonate");

        $response->assertStatus(403)
            ->assertJson(['success' => false, 'message' => 'Super Admin accounts cannot be impersonated.']);
    }

    public function test_admin_can_impersonate_regular_user_and_receive_exchange_code()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $regularUser = User::factory()->create(['role' => 'attendee']);

        $token = $admin->createToken('admin')->plainTextToken;

        $response = $this->withToken($token)->postJson("/api/v1/admin/users/{$regularUser->id}/impersonate");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertNotNull($response->json('exchange_code'));
        $this->assertNotNull($response->json('impersonate_token'));
    }
}
