<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhoneOtp extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'phone_otps';

    protected $fillable = [
        'phone',
        'otp',
        'attempts',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'attempts' => 'integer',
    ];
}
