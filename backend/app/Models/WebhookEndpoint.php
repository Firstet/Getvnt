<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookEndpoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'endpoint_url', 'secret', 'events',
        'max_retries', 'status', 'last_response_code',
        'last_delivery_at', 'next_retry_at', 'payload_preview'
    ];

    protected $casts = [
        'events' => 'array',
        'max_retries' => 'integer',
        'last_response_code' => 'integer',
        'last_delivery_at' => 'datetime',
        'next_retry_at' => 'datetime',
    ];

    public function logs()
    {
        return $this->hasMany(WebhookLog::class);
    }
}
