<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AdminAuthSecurityTest extends TestCase
{
    /**
     * Test that every /api/v1/admin route rejects unauthenticated requests with 401 or 403.
     */
    public function test_all_admin_routes_deny_unauthenticated_access(): void
    {
        $routes = collect(Route::getRoutes())->filter(function ($route) {
            return str_starts_with($route->uri(), 'api/v1/admin');
        });

        $this->assertNotEmpty($routes, 'No admin routes found to test.');

        foreach ($routes as $route) {
            $uri = '/' . $route->uri();
            $method = $route->methods()[0];

            // Replace dynamic URI placeholders like {id}, {type}, {plan} with dummy value 1
            $testUri = preg_replace('/\{[^}]+\}/', '1', $uri);

            $response = $this->json($method, $testUri);

            $this->assertTrue(
                in_array($response->status(), [401, 403]),
                "Route [{$method} {$uri}] (tested as {$testUri}) allowed unauthenticated access with status {$response->status()}."
            );
        }
    }
}
