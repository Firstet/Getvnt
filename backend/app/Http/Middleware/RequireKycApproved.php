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
                'error_code' => 'UNAUTHENTICATED',
                'message' => 'Authentication token missing or invalid. Please log in.',
            ], 401);
        }

        // Allow access if user is Super Admin, Trusted Organizer, or has pending/approved verification
        $hasAccess = $user->isSuperAdmin() ||
                     $user->role === 'trusted_organizer' ||
                     $user->role === 'organizer_pro' ||
                     $user->role === 'enterprise' ||
                     in_array($user->verification_status, ['pending', 'approved']);

        if (!$hasAccess) {
            return response()->json([
                'success' => false,
                'error_code' => 'KYC_REQUIRED',
                'message' => 'Organizer verification onboarding is required to access workspace operations.',
            ], 403);
        }

        return $next($request);
    }
}
