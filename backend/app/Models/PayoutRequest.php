<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayoutRequest extends Model
{
    use BelongsToTenant, HasFactory, HasUuids;

    protected $fillable = [
        'tenant_id',
        'user_id',
        'amount',
        'currency',
        'status',
        'bank_name',
        'account_number',
        'account_name',
        'payout_method',
        'bank_account_details',
        'reference_id',
        'notes',
        'failure_reason',
        'disbursed_at',
        'disbursed_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'disbursed_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
