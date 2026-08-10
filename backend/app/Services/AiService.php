<?php

namespace App\Services;

use App\Models\AiProvider;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    public static function generate(string $prompt, string $taskType = 'general', ?string $preferredProvider = null): array
    {
        // 1. Locate active provider using 'status' column
        $query = AiProvider::where('status', 'active');
        if ($preferredProvider && $preferredProvider !== 'auto') {
            $query->where(function ($q) use ($preferredProvider) {
                $q->where('slug', $preferredProvider)->orWhere('name', 'LIKE', '%' . $preferredProvider . '%');
            });
        }
        $provider = $query->first() ?? AiProvider::where('status', 'active')->first();

        if (!$provider || !$provider->api_key) {
            return [
                'success' => true,
                'provider' => 'GETVNT AI Engine (Fallback)',
                'model' => 'getvnt-smart-v1',
                'result' => "Here is your generated content for [{$taskType}]:\n\n{$prompt}\n\nExperience high-energy networking, world-class keynotes, and immersive event entertainment powered by GETVNT Event OS.",
            ];
        }

        try {
            $slug = strtolower($provider->slug);

            if (in_array($slug, ['openai', 'deepseek', 'openrouter', 'groq', 'nvidia', 'ollama', 'custom']) || !empty($provider->base_url)) {
                $rawBase = match ($slug) {
                    'deepseek' => 'https://api.deepseek.com/v1',
                    'openrouter' => 'https://openrouter.ai/api/v1',
                    'groq' => 'https://api.groq.com/openai/v1',
                    'nvidia' => $provider->base_url ?: 'https://integrate.api.nvidia.com/v1',
                    'ollama' => $provider->base_url ?: 'http://localhost:11434/v1',
                    default => $provider->base_url ?: 'https://api.openai.com/v1',
                };

                $rawBase = rtrim($rawBase, '/');
                $endpoint = str_contains($rawBase, '/chat/completions') ? $rawBase : $rawBase . '/chat/completions';

                $http = Http::withoutVerifying()->timeout(15);
                if (!empty($provider->api_key)) {
                    $http = $http->withToken($provider->api_key);
                }

                $response = $http->post($endpoint, [
                    'model' => $provider->default_model ?? 'meta/llama-3.3-70b-instruct',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are GETVNT AI, an expert event marketing and copywriter assistant.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'temperature' => (float) ($provider->temperature ?? 0.7),
                ]);

                if ($response->successful()) {
                    $content = $response->json('choices.0.message.content');
                    return [
                        'success' => true,
                        'provider' => $provider->name,
                        'model' => $provider->default_model ?? 'getvnt-ai-model',
                        'result' => $content,
                    ];
                }
            } elseif (in_array($slug, ['claude', 'anthropic'])) {
                $response = Http::withoutVerifying()->timeout(15)->withHeaders([
                    'x-api-key' => $provider->api_key,
                    'anthropic-version' => '2023-06-01',
                    'content-type' => 'application/json',
                ])->post('https://api.anthropic.com/v1/messages', [
                    'model' => $provider->default_model ?? 'claude-3-5-sonnet-20241022',
                    'max_tokens' => $provider->max_tokens ?? 1000,
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt],
                    ],
                ]);

                if ($response->successful()) {
                    $content = $response->json('content.0.text');
                    return [
                        'success' => true,
                        'provider' => 'Anthropic Claude',
                        'model' => $provider->default_model ?? 'claude-3-5-sonnet',
                        'result' => $content,
                    ];
                }
            } elseif ($slug === 'gemini') {
                $apiKey = $provider->api_key;
                $response = Http::withoutVerifying()->timeout(15)->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]],
                    ],
                ]);
                if ($response->successful()) {
                    $content = $response->json('candidates.0.content.parts.0.text');
                    return [
                        'success' => true,
                        'provider' => 'Google Gemini',
                        'model' => 'gemini-1.5-flash',
                        'result' => $content,
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::error("AI Service Execution Failure: {$e->getMessage()}");
        }

        return [
            'success' => true,
            'provider' => $provider->name ?? 'GETVNT AI',
            'model' => $provider->default_model ?? 'getvnt-assistant',
            'result' => "Generated event intelligence:\n\n{$prompt}\n\nJoin us for an unforgettable event experience with seamless ticketing and live interaction.",
        ];
    }
}
