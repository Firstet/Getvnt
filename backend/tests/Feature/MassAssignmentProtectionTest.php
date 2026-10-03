<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MassAssignmentProtectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_profile_cannot_mutate_role_or_verification_status()
    {
        $user = User::factory()->create([
            'role' => 'attendee',
            'verification_status' => 'unverified',
        ]);

        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->putJson('/api/v1/auth/profile', [
            'name' => 'Updated Name',
            'role' => 'super_admin',
            'verification_status' => 'approved',
            'verified_badge' => true,
        ]);

        $response->assertStatus(200);

        $freshUser = $user->fresh();
        $this->assertEquals('Updated Name', $freshUser->name);
        $this->assertEquals('attendee', $freshUser->role);
        $this->assertEquals('unverified', $freshUser->verification_status);
        $this->assertFalse((bool) $freshUser->verified_badge);
    }
}
