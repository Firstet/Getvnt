<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentWebhook extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'gateway',
        'event_type',
        'payload',
        'response',
        'status',
        'retry_count',
    ];

    protected $casts = [
        'payload' => 'array',
        'response' => 'array',
    ];
}
