<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiLog extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'feature_code',
        'provider_code',
        'model_name',
        'tokens_used',
        'cost',
        'latency_ms',
        'status',
        'prompt_snippet',
        'response_snippet',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
