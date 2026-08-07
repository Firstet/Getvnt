<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request and verify user role.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated access.',
            ], 401);
        }

        // Allow super_admin bypass across all administrative routes
        if ($user->role === 'super_admin') {
            return $next($request);
        }

        // Check if user has required role
        if ($user->role !== $role) {
            return response()->json([
                'success' => false,
                'message' => "Forbidden. Requiring '{$role}' access level.",
            ], 403);
        }

        return $next($request);
    }
}
