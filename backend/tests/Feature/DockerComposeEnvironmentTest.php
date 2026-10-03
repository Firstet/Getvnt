<?php

namespace Tests\Feature;

use Tests\TestCase;

class DockerComposeEnvironmentTest extends TestCase
{
    public function test_docker_compose_has_no_hardcoded_secrets_or_raw_ips(): void
    {
        $composePath = base_path('../docker-compose.yml');
        $this->assertFileExists($composePath);

        $content = file_get_contents($composePath);

        $this->assertStringNotContainsString('169.58.142.29', $content);
        $this->assertStringNotContainsString('secret_password', $content);
        $this->assertStringNotContainsString('root_secret_password', $content);

        $this->assertStringContainsString('DB_PASSWORD: "${DB_PASSWORD:?DB_PASSWORD is required}"', $content);
        $this->assertStringContainsString('MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD:?MYSQL_ROOT_PASSWORD is required}"', $content);
        $this->assertStringContainsString('APP_KEY: "${APP_KEY:?APP_KEY is required}"', $content);
        $this->assertStringContainsString('REDIS_PASSWORD: "${REDIS_PASSWORD:?REDIS_PASSWORD is required}"', $content);

        $this->assertStringContainsString('condition: service_healthy', $content);
        $this->assertStringContainsString('healthcheck:', $content);
    }
}
