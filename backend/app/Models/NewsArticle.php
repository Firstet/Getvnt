<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsArticle extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'headline',
        'subtitle',
        'slug',
        'ai_summary',
        'content',
        'ai_insights',
        'key_takeaways',
        'featured_image',
        'source_name',
        'source_url',
        'author',
        'pub_date',
        'category',
        'region',
        'tags',
        'views_count',
        'shares_count',
        'likes_count',
        'is_featured',
        'is_breaking',
        'status',
        'related_event_id',
    ];

    protected $casts = [
        'ai_insights'  => 'array',
        'key_takeaways' => 'array',
        'tags'          => 'array',
        'is_featured'   => 'boolean',
        'is_breaking'   => 'boolean',
        'pub_date'      => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->headline) . '-' . Str::random(5);
            }
        });
    }

    public function comments()
    {
        return $this->hasMany(NewsComment::class, 'article_id')->orderBy('created_at', 'desc');
    }

    public function relatedEvent()
    {
        return $this->belongsTo(Event::class, 'related_event_id');
    }
}
