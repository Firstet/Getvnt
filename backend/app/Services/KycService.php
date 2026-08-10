<?php

namespace App\Services;

use App\Models\OrganizerVerification;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Str;

class KycService
{
    /**
     * Submit onboarding verification request for Attendee.
     */
    public function submit(User $user, array $data): OrganizerVerification
    {
        $verification = OrganizerVerification::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'tenant_id' => $user->tenant_id,
            'business_name' => $data['business_name'],
            'business_type' => $data['business_type'] ?? 'sole_proprietorship',
            'phone' => $data['phone'],
            'country' => $data['country'] ?? 'NG',
            'bank_name' => $data['bank_name'],
            'account_number' => $data['account_number'],
            'account_name' => $data['account_name'],
            'gov_id_url' => $data['gov_id_url'] ?? null,
            'selfie_url' => $data['selfie_url'] ?? null,
            'status' => 'pending',
        ]);

        $user->update([
            'verification_status' => 'pending',
        ]);

        return $verification;
    }

    /**
     * Approve verification request -> Role transitions ATTENDEE -> TRUSTED ORGANIZER.
     */
    public function approve(OrganizerVerification $verification, ?User $admin = null): void
    {
        $verification->update([
            'status' => 'approved',
            'verified_at' => now(),
            'verified_by' => $admin ? $admin->id : null,
        ]);

        $user = $verification->user;

        // Ensure organizer tenant exists
        if (!$user->tenant_id) {
            $tenant = Tenant::create([
                'id' => (string) Str::uuid(),
                'name' => $verification->business_name,
                'slug' => Str::slug($verification->business_name) . '-' . Str::random(5),
                'domain' => Str::slug($verification->business_name) . '.getvnt.com',
                'status' => 'active',
                'is_verified' => true,
            ]);
            $user->tenant_id = $tenant->id;
            $user->save();
            $tenant->users()->attach($user->id, ['role' => 'organizer_owner']);
        }

        $user->update([
            'verification_status' => 'approved',
            'verified_badge' => true,
            'role' => 'trusted_organizer',
        ]);
    }

    /**
     * Reject verification request.
     */
    public function reject(OrganizerVerification $verification, string $reason): void
    {
        $verification->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);

        $user = $verification->user;
        $user->update([
            'verification_status' => 'rejected',
        ]);
    }
}
