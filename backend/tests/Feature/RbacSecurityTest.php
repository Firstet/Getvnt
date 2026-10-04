<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected Tenant $tenant;
    protected User $attendee;
    protected User $organizer;
    protected User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'RBAC Test Tenant',
            'slug' => 'rbac-test-tenant',
            'status' => 'active',
        ]);

        $this->attendee = User::factory()->create([
            'role' => 'attendee',
        ]);

        $this->organizer = User::factory()->create([
            'tenant_id' => $this->tenant->id,
            'role' => 'trusted_organizer',
            'verification_status' => 'approved',
            'verified_badge' => true,
        ]);

        $this->superAdmin = User::factory()->create([
            'role' => 'super_admin',
        ]);
    }

    public function test_attendee_cannot_access_workspace_dashboard()
    {
        $response = $this->actingAs($this->attendee, 'sanctum')
            ->getJson('/api/v1/workspace/dashboard');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_organizer_cannot_access_admin_overview()
    {
        $response = $this->actingAs($this->organizer, 'sanctum')
            ->getJson('/api/v1/admin/overview');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access_protected_routes()
    {
        $this->getJson('/api/v1/workspace/dashboard')->assertStatus(401);
        $this->getJson('/api/v1/admin/overview')->assertStatus(401);
    }
}
