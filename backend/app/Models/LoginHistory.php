<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginHistory extends Model
{
    use HasFactory;

    protected $table = 'login_history';
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'ip_address', 'user_agent', 'status', 'failure_reason', 'logged_in_at'
    ];

    protected $casts = [
        'logged_in_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
