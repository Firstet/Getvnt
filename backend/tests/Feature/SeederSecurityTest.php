<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Database\Seeders\IntegrationsSeeder;
use Tests\TestCase;

class SeederSecurityTest extends TestCase
{
    public function test_database_seeder_refuses_to_run_in_production_without_flag(): void
    {
        $this->app['env'] = 'production';

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Refusing to seed admin user in production without --force-seed-admin flag.');

        $seeder = new DatabaseSeeder();
        $seeder->run();
    }

    public function test_integrations_seeder_has_no_live_keys(): void
    {
        $file = base_path('database/seeders/IntegrationsSeeder.php');
        $content = file_get_contents($file);

        $this->assertStringNotContainsString('pk_live_', $content);
        $this->assertStringNotContainsString('sk_live_', $content);
    }
}
