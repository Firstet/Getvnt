<?php

namespace App\Traits;

use App\Scopes\TenantScope;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope(new TenantScope());

        static::creating(function ($model) {
            if (empty($model->tenant_id)) {
                $tenantId = auth()->user()?->tenant_id;
                if (!$tenantId && app()->bound('current_tenant_id')) {
                    $tenantId = app('current_tenant_id');
                }
                if ($tenantId) {
                    $model->tenant_id = $tenantId;
                }
            }
        });
    }
}
