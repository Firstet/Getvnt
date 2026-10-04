<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $user = auth()->user();

        // Super Admin bypasses tenant isolation scope
        if ($user && $user->isSuperAdmin()) {
            return;
        }

        $tenantId = $user?->tenant_id;
        if (!$tenantId && app()->bound('current_tenant_id')) {
            $tenantId = app('current_tenant_id');
        }

        if ($tenantId) {
            $table = $model->getTable();
            $builder->where("{$table}.tenant_id", $tenantId);
        }
    }
}
