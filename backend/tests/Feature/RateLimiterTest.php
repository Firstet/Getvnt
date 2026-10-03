<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimiterTest extends TestCase
{
    use RefreshDatabase;

    public function test_auth_login_is_throttled_after_5_attempts(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/v1/auth/login', [
                'email' => 'rate_test@getvnt.com',
                'password' => 'wrong-password',
            ]);
            $this->assertNotEquals(429, $response->status());
        }

        $throttledResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'rate_test@getvnt.com',
            'password' => 'wrong-password',
        ]);

        $throttledResponse->assertStatus(429);
    }
}
