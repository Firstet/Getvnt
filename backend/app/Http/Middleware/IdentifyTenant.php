<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = null;

        // 1. Check Header X-Tenant-ID
        if ($tenantHeader = $request->header('X-Tenant-ID')) {
            $tenant = Tenant::where('id', $tenantHeader)
                ->orWhere('slug', $tenantHeader)
                ->first();
        }

        // 2. Check Subdomain / Host
        if (!$tenant) {
            $host = $request->getHost(); // e.g. afronation.getvnt.com
            $parts = explode('.', $host);

            if (count($parts) >= 3 && $parts[0] !== 'app' && $parts[0] !== 'admin' && $parts[0] !== 'www') {
                $tenant = Tenant::where('slug', $parts[0])->first();
            }

            // Custom domain check
            if (!$tenant) {
                $tenant = Tenant::where('custom_domain', $host)->first();
            }
        }

        // Fallback default tenant for demo/testing
        if (!$tenant) {
            $tenant = Tenant::first();
        }

        if ($tenant) {
            app()->instance('tenant', $tenant);
            $request->attributes->set('tenant', $tenant);
        }

        return $next($request);
    }
}
