<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_verification_flow()
    {
        $user = User::factory()->create(['email' => 'testverif@example.com', 'email_verified_at' => null]);

        $sendResponse = $this->postJson('/api/v1/auth/send-email-verification', [
            'email' => $user->email,
        ]);

        $sendResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $token = $sendResponse->json('verification_code');

        $verifyResponse = $this->postJson('/api/v1/auth/verify-email', [
            'email' => $user->email,
            'token' => $token,
        ]);

        $verifyResponse->assertStatus(200)
            ->assertJson(['success' => true, 'message' => 'Email verified successfully.']);

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_invalid_email_token_fails()
    {
        $user = User::factory()->create(['email' => 'testverif2@example.com', 'email_verified_at' => null]);

        $this->postJson('/api/v1/auth/send-email-verification', [
            'email' => $user->email,
        ]);

        $verifyResponse = $this->postJson('/api/v1/auth/verify-email', [
            'email' => $user->email,
            'token' => 'invalid-token-string',
        ]);

        $verifyResponse->assertStatus(422);
    }

    public function test_phone_otp_verification_flow()
    {
        $user = User::factory()->create(['phone' => '+1234567890', 'phone_verified_at' => null]);

        $sendResponse = $this->postJson('/api/v1/auth/send-phone-otp', [
            'phone' => '+1234567890',
        ]);

        $sendResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $otpRecord = \App\Models\PhoneOtp::where('phone', '+1234567890')->first();
        $this->assertNotNull($otpRecord);
    }
}
