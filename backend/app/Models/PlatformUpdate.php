<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformUpdate extends Model
{
    protected $table = 'platform_updates';

    protected $fillable = [
        'version',
        'filename',
        'status',
        'log_output',
        'backup_path',
        'installed_at',
    ];

    protected $casts = [
        'installed_at' => 'datetime',
    ];
}
