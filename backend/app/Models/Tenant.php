<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'branding' => 'array',
        'settings' => 'array',
        'is_verified' => 'boolean',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'tenant_user')->withPivot('role', 'permissions')->withTimestamps();
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function payouts()
    {
        return $this->hasMany(Payout::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class, 'tenant_id')->latestOfMany();
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'tenant_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'tenant_id');
    }
}
