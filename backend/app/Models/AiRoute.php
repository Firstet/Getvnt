<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'feature_key', 'feature_name', 'primary_provider_id',
        'fallback_provider_id', 'preferred_model', 'max_tokens',
        'temperature', 'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'temperature' => 'float',
        'max_tokens' => 'integer',
    ];

    public function primaryProvider()
    {
        return $this->belongsTo(AiProvider::class, 'primary_provider_id');
    }

    public function fallbackProvider()
    {
        return $this->belongsTo(AiProvider::class, 'fallback_provider_id');
    }
}
