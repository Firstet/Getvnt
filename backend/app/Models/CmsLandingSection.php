<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsLandingSection extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected $casts = [
        'content' => 'array',
        'is_enabled' => 'boolean',
    ];
}
