<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthProvider extends Model
{
    protected $table = 'auth_providers';

    protected $fillable = [
        'provider_slug',
        'name',
        'is_enabled',
        'client_id',
        'client_secret',
        'redirect_uri',
        'scopes',
        'extra_settings',
    ];

    protected $casts = [
        'is_enabled'     => 'boolean',
        'scopes'         => 'array',
        'extra_settings' => 'array',
    ];

    /**
     * Pre-seeded default providers list.
     */
    public static function seedDefaults(): void
    {
        $defaults = [
            ['provider_slug' => 'google',    'name' => 'Google OAuth 2.0', 'scopes' => ['email', 'profile']],
            ['provider_slug' => 'apple',     'name' => 'Apple Sign In',    'scopes' => ['name', 'email']],
            ['provider_slug' => 'facebook',  'name' => 'Facebook Login',   'scopes' => ['email', 'public_profile']],
            ['provider_slug' => 'twitter',   'name' => 'X / Twitter OAuth', 'scopes' => ['users.read', 'tweet.read']],
            ['provider_slug' => 'linkedin',  'name' => 'LinkedIn OAuth',   'scopes' => ['r_liteprofile', 'r_emailaddress']],
            ['provider_slug' => 'github',    'name' => 'GitHub OAuth',     'scopes' => ['user:email']],
            ['provider_slug' => 'microsoft', 'name' => 'Microsoft Azure AD', 'scopes' => ['openid', 'email', 'profile']],
        ];

        foreach ($defaults as $provider) {
            self::firstOrCreate(
                ['provider_slug' => $provider['provider_slug']],
                [
                    'name'         => $provider['name'],
                    'is_enabled'   => false,
                    'client_id'    => '',
                    'client_secret'=> '',
                    'redirect_uri' => "http://localhost:8000/api/v1/auth/{$provider['provider_slug']}/callback",
                    'scopes'       => $provider['scopes'],
                ]
            );
        }
    }
}
