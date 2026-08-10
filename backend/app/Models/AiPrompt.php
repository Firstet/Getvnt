<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiPrompt extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'category',
        'title',
        'description',
        'prompt_text',
        'provider_code',
        'preferred_model',
        'temperature',
        'max_tokens',
        'top_p',
        'frequency_penalty',
        'presence_penalty',
        'version',
        'is_published',
        'role_scope',
        'created_by',
    ];

    protected $casts = [
        'temperature' => 'float',
        'max_tokens' => 'integer',
        'top_p' => 'float',
        'frequency_penalty' => 'float',
        'presence_penalty' => 'float',
        'version' => 'integer',
        'is_published' => 'boolean',
    ];
}
