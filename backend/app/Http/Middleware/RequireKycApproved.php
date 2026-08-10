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

        if (!$user || !$user->isTrustedOrganizer()) {
            return response()->json([
                'success' => false,
                'error_code' => 'KYC_NOT_APPROVED',
                'message' => 'Organizer verification approval required to access workspace operations.',
            ], 403);
        }

        return $next($request);
    }
}
