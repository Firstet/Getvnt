<?php

namespace Tests\Feature;

use Tests\TestCase;

class CorsSecurityTest extends TestCase
{
    public function test_cors_config_has_no_raw_ips_or_sslip_io_in_production(): void
    {
        $corsConfig = include base_path('config/cors.php');

        $this->assertNotContains('#^https?://.*\.sslip\.io$#', $corsConfig['allowed_origins_patterns']);

        foreach ($corsConfig['allowed_origins'] as $origin) {
            $this->assertStringNotContainsString('169.58.142.29', $origin);
            $this->assertStringNotContainsString('sslip.io', $origin);
        }

        if (env('APP_ENV') !== 'local') {
            foreach ($corsConfig['allowed_origins'] as $origin) {
                $this->assertStringNotContainsString('localhost', $origin);
            }
        }
    }
}
