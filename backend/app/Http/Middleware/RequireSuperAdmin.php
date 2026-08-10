<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'error_code' => 'SUPER_ADMIN_REQUIRED',
                'message' => 'Super Admin access privileges required.',
            ], 403);
        }

        return $next($request);
    }
}
