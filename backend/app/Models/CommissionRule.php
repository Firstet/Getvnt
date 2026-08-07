<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'rule_type', 'platform_fee', 'organizer_fee',
        'processing_fee', 'vat_percent', 'tax_percent',
        'service_charge', 'min_charge', 'max_charge',
        'plan_scope', 'country_scope', 'currency_scope',
        'gateway_scope', 'event_category_scope', 'is_active'
    ];

    protected $casts = [
        'platform_fee' => 'decimal:2',
        'organizer_fee' => 'decimal:2',
        'processing_fee' => 'decimal:2',
        'vat_percent' => 'decimal:2',
        'tax_percent' => 'decimal:2',
        'service_charge' => 'decimal:2',
        'min_charge' => 'decimal:2',
        'max_charge' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
