<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // Only apply scope if a user is authenticated and has a tenant_id
        if (Auth::check() && Auth::user()->tenant_id) {
            // Do not apply scope if user is super admin inspecting all platform data
            if (Auth::user()->role === 'super_admin') {
                return;
            }

            $builder->where($model->getTable() . '.tenant_id', Auth::user()->tenant_id);
        }
    }
}
