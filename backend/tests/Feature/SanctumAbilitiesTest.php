<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SanctumAbilitiesTest extends TestCase
{
    use RefreshDatabase;

    public function test_tokens_receive_correct_abilities()
    {
        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        $organizer = User::factory()->create(['role' => 'trusted_organizer']);
        $attendee = User::factory()->create(['role' => 'attendee']);

        $loginAdmin = $this->postJson('/api/v1/auth/login', [
            'email' => $superAdmin->email,
            'password' => 'password',
        ]);
        $loginAdmin->assertStatus(200);

        $loginOrganizer = $this->postJson('/api/v1/auth/login', [
            'email' => $organizer->email,
            'password' => 'password',
        ]);
        $loginOrganizer->assertStatus(200);

        $adminToken = $superAdmin->tokens()->first();
        $this->assertEquals(['*'], $adminToken->abilities);

        $orgToken = $organizer->tokens()->first();
        $this->assertEquals(['organizer:access', 'events:manage'], $orgToken->abilities);
    }

    public function test_change_password_revokes_other_tokens()
    {
        $user = User::factory()->create(['password' => bcrypt('oldpassword')]);

        $token1 = $user->createToken('token1')->plainTextToken;
        $token2 = $user->createToken('token2')->plainTextToken;

        $this->assertCount(2, $user->tokens);

        $response = $this->withToken($token1)->putJson('/api/v1/auth/change-password', [
            'current_password' => 'oldpassword',
            'new_password' => 'newpassword123',
        ]);

        $response->assertStatus(200);

        // Only 1 token should remain (token1)
        $this->assertCount(1, $user->fresh()->tokens);
    }
}
