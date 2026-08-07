<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'name', 'slug', 'description', 'price_monthly', 'price_annual',
        'commission_rate', 'trial_days', 'is_active', 'is_featured', 'sort_order'
    ];

    protected $casts = [
        'price_monthly' => 'float',
        'price_annual' => 'float',
        'commission_rate' => 'float',
        'trial_days' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer'
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

    public function features()
    {
        return $this->belongsToMany(FeatureFlag::class, 'plan_features', 'plan_id', 'feature_flag_id')
                    ->withPivot('value')
                    ->withTimestamps();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'plan_id');
    }
}
