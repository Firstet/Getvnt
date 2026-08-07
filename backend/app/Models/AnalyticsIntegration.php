<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalyticsIntegration extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'service', 'tracking_id',
        'environment', 'is_verified', 'status', 'config'
    ];

    protected $casts = [
        'config' => 'array',
        'is_verified' => 'boolean',
    ];
}
