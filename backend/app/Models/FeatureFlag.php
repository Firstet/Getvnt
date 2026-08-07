<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class FeatureFlag extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'name', 'code', 'description', 'value_type', 'default_value'
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

    public function plans()
    {
        return $this->belongsToMany(SubscriptionPlan::class, 'plan_features', 'feature_flag_id', 'plan_id')
                    ->withPivot('value')
                    ->withTimestamps();
    }
}
