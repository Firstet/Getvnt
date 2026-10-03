<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_queues_email()
    {
        Mail::fake();

        $user = User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        Mail::assertQueued(\App\Mail\PasswordResetMail::class);
    }

    public function test_forgot_password_prevents_email_enumeration()
    {
        Mail::fake();

        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        Mail::assertNothingQueued();
    }
}
