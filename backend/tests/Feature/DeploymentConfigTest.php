<?php

namespace Tests\Feature;

use Tests\TestCase;

class DeploymentConfigTest extends TestCase
{
    public function test_dockerfile_backend_security_and_cmd_rules(): void
    {
        $dockerfilePath = base_path('../Dockerfile.backend');
        $this->assertFileExists($dockerfilePath);

        $content = file_get_contents($dockerfilePath);

        $this->assertStringNotContainsString('db:seed', $content);
        $this->assertStringNotContainsString('artisan serve', $content);
        $this->assertStringNotContainsString('migrate --force', $content);
        $this->assertStringNotContainsString('--ignore-platform-reqs', $content);
        $this->assertStringContainsString('composer:2', $content);
        $this->assertStringContainsString('USER www-data', $content);
    }

    public function test_deploy_script_contains_migration_step_and_up_health_route(): void
    {
        $deployPath = base_path('../deploy.sh');
        $this->assertFileExists($deployPath);

        $content = file_get_contents($deployPath);

        $this->assertStringContainsString('php artisan migrate --force', $content);
        $this->assertStringContainsString('/up', $content);
        $this->assertStringNotContainsString('/api/v1/health', $content);
    }
}
