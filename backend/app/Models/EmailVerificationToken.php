<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailVerificationToken extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'email',
        'token',
        'attempts',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'attempts' => 'integer',
    ];
}
