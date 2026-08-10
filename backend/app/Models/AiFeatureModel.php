<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiFeatureModel extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'feature_code',
        'feature_name',
        'provider_code',
        'model_name',
        'temperature',
        'max_tokens',
    ];
}
