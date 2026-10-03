<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireKycApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Allow super admins and users with approved KYC / verified status
        if ($user->isSuperAdmin() || $user->verification_status === 'approved' || $user->verified_badge || $user->role === 'trusted_organizer') {
            return $next($request);
        }

        // Allow drafting events (POST /api/v1/workspace/events when is_published is false or status is draft)
        if ($request->isMethod('post') && ($request->is('api/v1/workspace/events') || $request->is('v1/workspace/events'))) {
            $isPublished = $request->input('is_published', false);
            $status = $request->input('status', 'draft');
            
            if (!$isPublished || $status === 'draft') {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'KYC verification required. Your organizer account must be approved to access wallet, payouts, or publish events.',
        ], 403);
    }
}
