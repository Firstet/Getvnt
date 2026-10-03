<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGatewayConfig extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'tenant_id',
        'provider_name',
        'is_enabled',
        'is_default',
        'api_key',
        'api_secret',
        'webhook_secret',
        'public_key',
        'merchant_id',
        'sandbox_mode',
        'additional_settings',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'is_default' => 'boolean',
    ];
}
