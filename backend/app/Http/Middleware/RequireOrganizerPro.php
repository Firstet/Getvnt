<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireOrganizerPro
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        $plan = strtolower($user->subscription_plan ?? 'starter');
        if ($plan !== 'pro' && $plan !== 'enterprise') {
            return response()->json([
                'success' => false,
                'error_code' => 'PRO_SUBSCRIPTION_REQUIRED',
                'message' => 'Organizer Pro or Enterprise subscription required for Website Builder & Advanced Tools.',
            ], 403);
        }

        return $next($request);
    }
}
