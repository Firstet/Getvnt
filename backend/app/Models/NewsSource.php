<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsSource extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'url',
        'rss_url',
        'region',
        'category',
        'is_enabled',
        'update_frequency_minutes',
        'last_fetched_at',
        'fetch_status',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'last_fetched_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}
