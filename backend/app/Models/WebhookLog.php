<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebhookLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'webhook_endpoint_id', 'event', 'response_code',
        'duration_ms', 'payload', 'response_body', 'status'
    ];

    protected $casts = [
        'response_code' => 'integer',
        'duration_ms' => 'integer',
    ];

    public function endpoint()
    {
        return $this->belongsTo(WebhookEndpoint::class, 'webhook_endpoint_id');
    }
}
