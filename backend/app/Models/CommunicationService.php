<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunicationService extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'type', 'api_key', 'sender_id',
        'domain', 'templates', 'rate_limit_per_min', 'status', 'is_default'
    ];

    protected $casts = [
        'templates' => 'array',
        'is_default' => 'boolean',
        'rate_limit_per_min' => 'integer',
    ];
}
