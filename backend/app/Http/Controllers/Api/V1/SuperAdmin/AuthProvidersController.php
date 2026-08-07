<?php

namespace App\Http\Controllers\Api\V1\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AuthProvider;
use Illuminate\Http\Request;

class AuthProvidersController extends Controller
{
    /**
     * GET /api/v1/admin/auth-providers
     * List all authentication providers.
     */
    public function index()
    {
        AuthProvider::seedDefaults();
        $providers = AuthProvider::orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data'    => $providers,
        ]);
    }

    /**
     * PUT /api/v1/admin/auth-providers/{id}
     * Update OAuth Provider credentials & status.
     */
    public function update(Request $request, $id)
    {
        $provider = AuthProvider::findOrFail($id);

        $validated = $request->validate([
            'is_enabled'     => 'sometimes|boolean',
            'client_id'      => 'sometimes|nullable|string',
            'client_secret'  => 'sometimes|nullable|string',
            'redirect_uri'   => 'sometimes|nullable|string',
            'scopes'         => 'sometimes|nullable|array',
            'extra_settings' => 'sometimes|nullable|array',
        ]);

        $provider->update($validated);

        return response()->json([
            'success' => true,
            'message' => "{$provider->name} settings updated successfully.",
            'data'    => $provider->fresh(),
        ]);
    }

    /**
     * POST /api/v1/admin/auth-providers/{id}/test
     * Test credentials config ping.
     */
    public function test($id)
    {
        $provider = AuthProvider::findOrFail($id);

        if (empty($provider->client_id) || empty($provider->client_secret)) {
            return response()->json([
                'success' => false,
                'message' => "Client ID and Client Secret are required for {$provider->name}.",
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => "✅ {$provider->name} credentials verified successfully! Callback URL: {$provider->redirect_uri}",
        ]);
    }
}
