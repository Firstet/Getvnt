<?php

namespace Tests\Feature;

use App\Models\AiProvider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiProviderSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_ai_provider_api_keys_are_masked_in_responses(): void
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $provider = AiProvider::create([
            'name' => 'OpenAI',
            'slug' => 'openai',
            'api_key' => 'sk-proj-secret-key-123456789',
            'default_model' => 'gpt-4o',
            'status' => 'active',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/ai/fleet');

        $response->assertStatus(200);
        $response->assertJsonPath('providers.0.api_key', '****6789');

        // Test updating with masked key preserves original key
        $updateResponse = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/admin/ai-providers/{$provider->id}", [
                'name' => 'OpenAI Updated',
                'api_key' => '****6789',
            ]);

        $updateResponse->assertStatus(200);
        $this->assertDatabaseHas('ai_providers', [
            'id' => $provider->id,
            'api_key' => 'sk-proj-secret-key-123456789',
        ]);
    }
}
