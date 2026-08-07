<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketplaceItem extends Model
{
    use HasFactory;

    protected $table = 'integration_marketplace';

    protected $fillable = [
        'name', 'slug', 'category', 'logo', 'description',
        'developer', 'version', 'rating', 'doc_url',
        'is_installed', 'is_featured', 'config_schema'
    ];

    protected $casts = [
        'config_schema' => 'array',
        'rating' => 'float',
        'is_installed' => 'boolean',
        'is_featured' => 'boolean',
    ];
}
