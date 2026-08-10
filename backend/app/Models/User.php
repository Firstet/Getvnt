<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'locked_until' => 'datetime',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'verified_badge' => 'boolean',
    ];

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin' || $this->role === 'admin';
    }

    public function isTrustedOrganizer(): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }
        return $this->verification_status === 'approved' || $this->verified_badge || $this->role === 'trusted_organizer';
    }

    public function isAttendee(): bool
    {
        return true;
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function tenants()
    {
        return $this->belongsToMany(Tenant::class, 'tenant_user')->withPivot('role', 'permissions')->withTimestamps();
    }

    public function verifications()
    {
        return $this->hasMany(OrganizerVerification::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function userNotifications()
    {
        return $this->hasMany(UserNotification::class);
    }
}
