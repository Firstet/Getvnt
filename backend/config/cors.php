<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'https://getvnt.com,https://www.getvnt.com,https://app.getvnt.com,https://admin.getvnt.com,https://api.getvnt.com,http://169.58.142.29,http://169.58.142.29:8080,http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003')),

    'allowed_origins_patterns' => [
        '#^https?://.*\.getvnt\.com$#',
        '#^https?://.*\.sslip\.io$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
