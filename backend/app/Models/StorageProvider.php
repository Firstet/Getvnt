<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StorageProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'driver', 'bucket', 'region',
        'endpoint', 'access_key', 'secret_key', 'cdn_url',
        'status', 'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];
}
