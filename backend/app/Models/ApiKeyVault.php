<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiKeyVault extends Model
{
    use HasFactory;

    protected $table = 'api_keys';

    protected $fillable = [
        'name', 'category', 'provider', 'encrypted_value',
        'environment', 'expiration_date', 'last_used_at',
        'created_by', 'updated_by', 'notes', 'is_active', 'is_archived'
    ];

    protected $casts = [
        'expiration_date' => 'datetime',
        'last_used_at' => 'datetime',
        'is_active' => 'boolean',
        'is_archived' => 'boolean',
    ];
}
