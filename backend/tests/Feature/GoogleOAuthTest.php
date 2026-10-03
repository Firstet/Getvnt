<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class GoogleOAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_generates_valid_url_and_stores_state()
    {
        \App\Models\SystemSetting::create(['key' => 'google_client_id', 'value' => 'mock_client_id']);
        \App\Models\SystemSetting::create(['key' => 'google_client_secret', 'value' => 'mock_client_secret']);

        $response = $this->getJson('/api/v1/auth/google?redirect_to=workspace');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $url = $response->json('url');
        $this->assertStringContainsString('accounts.google.com', $url);
        $this->assertStringContainsString('mock_client_id', $url);
    }

    public function test_google_exchange_rejects_invalid_code()
    {
        $response = $this->postJson('/api/v1/auth/google/exchange', [
            'code' => 'invalid-code',
        ]);

        $response->assertStatus(422)
            ->assertJson(['success' => false, 'message' => 'Invalid or expired OAuth exchange code.']);
    }
}
