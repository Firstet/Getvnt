<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'logo', 'public_key', 'secret_key',
        'test_public_key', 'test_secret_key', 'webhook_secret',
        'callback_url', 'environment', 'currency', 'supported_countries',
        'transaction_fee_percent', 'flat_fee', 'status', 'is_default', 'sort_order'
    ];

    protected $casts = [
        'supported_countries' => 'array',
        'transaction_fee_percent' => 'decimal:2',
        'flat_fee' => 'decimal:2',
        'is_default' => 'boolean',
    ];
}
