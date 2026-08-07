<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_name', 'user_role', 'ip_address', 'browser',
        'device', 'action', 'resource_type', 'resource_id',
        'before_state', 'after_state'
    ];

    protected $casts = [
        'before_state' => 'array',
        'after_state' => 'array',
    ];
}
