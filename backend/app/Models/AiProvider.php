<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'logo', 'description', 'status', 'api_key',
        'org_id', 'base_url', 'default_model', 'available_models',
        'max_tokens', 'temperature', 'top_p', 'timeout_seconds',
        'retry_attempts', 'daily_limit', 'monthly_budget',
        'cost_per_1k_tokens', 'rate_limits', 'notes', 'sort_order'
    ];

    protected $casts = [
        'available_models' => 'array',
        'temperature' => 'float',
        'top_p' => 'float',
        'max_tokens' => 'integer',
        'daily_limit' => 'integer',
        'monthly_budget' => 'decimal:2',
        'cost_per_1k_tokens' => 'decimal:4',
    ];
}
