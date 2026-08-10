<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiProvider extends Model
{
    use HasFactory;

    protected $guarded = [];

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
