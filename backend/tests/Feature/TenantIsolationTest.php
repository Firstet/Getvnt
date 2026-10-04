<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected Tenant $tenantA;
    protected Tenant $tenantB;
    protected User $userA;
    protected User $userB;
    protected User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenantA = Tenant::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Tenant Alpha',
            'slug' => 'tenant-alpha',
            'status' => 'active',
        ]);

        $this->tenantB = Tenant::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Tenant Beta',
            'slug' => 'tenant-beta',
            'status' => 'active',
        ]);

        $this->userA = User::factory()->create([
            'tenant_id' => $this->tenantA->id,
            'role' => 'trusted_organizer',
            'verification_status' => 'approved',
            'verified_badge' => true,
        ]);

        $this->userB = User::factory()->create([
            'tenant_id' => $this->tenantB->id,
            'role' => 'trusted_organizer',
            'verification_status' => 'approved',
            'verified_badge' => true,
        ]);

        $this->superAdmin = User::factory()->create([
            'role' => 'super_admin',
        ]);
    }

    public function test_tenant_a_cannot_access_tenant_b_events()
    {
        $eventA = Event::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'tenant_id' => $this->tenantA->id,
            'user_id' => $this->userA->id,
            'title' => 'Alpha Music Fest',
            'slug' => 'alpha-music-fest',
            'start_date' => now()->addDays(5),
            'is_published' => true,
        ]);

        $eventB = Event::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'tenant_id' => $this->tenantB->id,
            'user_id' => $this->userB->id,
            'title' => 'Beta Tech Summit',
            'slug' => 'beta-tech-summit',
            'start_date' => now()->addDays(5),
            'is_published' => true,
        ]);

        // User A requests workspace events
        $responseA = $this->actingAs($this->userA, 'sanctum')
            ->getJson('/api/v1/workspace/events');

        $responseA->assertStatus(200);
        $eventIdsA = collect($responseA->json('data'))->pluck('id')->all();

        $this->assertContains($eventA->id, $eventIdsA);
        $this->assertNotContains($eventB->id, $eventIdsA);
    }

    public function test_super_admin_can_access_all_tenants_events()
    {
        $eventA = Event::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'tenant_id' => $this->tenantA->id,
            'user_id' => $this->userA->id,
            'title' => 'Alpha Fest',
            'slug' => 'alpha-fest',
            'start_date' => now()->addDays(5),
            'is_published' => true,
        ]);

        $eventB = Event::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'tenant_id' => $this->tenantB->id,
            'user_id' => $this->userB->id,
            'title' => 'Beta Summit',
            'slug' => 'beta-summit',
            'start_date' => now()->addDays(5),
            'is_published' => true,
        ]);

        $responseAdmin = $this->actingAs($this->superAdmin, 'sanctum')
            ->getJson('/api/v1/admin/events');

        $responseAdmin->assertStatus(200);
        $eventIds = collect($responseAdmin->json('data'))->pluck('id')->all();

        $this->assertContains($eventA->id, $eventIds);
        $this->assertContains($eventB->id, $eventIds);
    }

    public function test_media_upload_mime_type_restrictions()
    {
        Storage::fake('public');

        // Valid PNG image upload passes
        $validFile = UploadedFile::fake()->image('banner.png', 800, 600);
        $validResponse = $this->actingAs($this->userA, 'sanctum')
            ->postJson('/api/v1/media/upload', ['file' => $validFile]);

        $validResponse->assertStatus(201)
            ->assertJson(['success' => true]);

        // Disallowed executable / php file upload fails
        $maliciousFile = UploadedFile::fake()->create('shell.php', 10, 'text/x-php');
        $invalidResponse = $this->actingAs($this->userA, 'sanctum')
            ->postJson('/api/v1/media/upload', ['file' => $maliciousFile]);

        $invalidResponse->assertStatus(422)
            ->assertJson(['success' => false]);
    }

    public function test_media_upload_saves_in_tenant_isolated_folder()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('logo.jpg', 200, 200);
        $response = $this->actingAs($this->userA, 'sanctum')
            ->postJson('/api/v1/media/upload', ['file' => $file]);

        $response->assertStatus(201);
        $path = $response->json('data.path');

        $this->assertStringStartsWith("tenants/{$this->tenantA->id}/uploads/", $path);
        Storage::disk('public')->assertExists($path);
    }
}
