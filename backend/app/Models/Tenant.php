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

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function ledgerEntries()
    {
        return $this->hasMany(LedgerEntry::class);
    }

    public function payoutRequests()
    {
        return $this->hasMany(PayoutRequest::class);
    }

    public function organizerWebsite()
    {
        return $this->hasOne(OrganizerWebsite::class);
    }
}
