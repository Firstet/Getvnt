<?php

namespace App\Services;

use App\Models\OrganizerVerification;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Str;

class KycService
{
    protected $aiKycService;

    public function __construct(AiKycVerificationService $aiKycService)
    {
        $this->aiKycService = $aiKycService;
    }

    /**
     * Submit onboarding verification request for Attendee.
     * Automatically creates Organizer Workspace (Tenant) & runs AI verification.
     */
    public function submit(User $user, array $data): OrganizerVerification
    {
        // 1. Ensure Tenant (Organizer Workspace) exists for user
        if (!$user->tenant_id) {
            $tenant = Tenant::create([
                'id' => (string) Str::uuid(),
                'name' => $data['business_name'],
                'slug' => Str::slug($data['business_name']) . '-' . Str::random(5),
                'domain' => Str::slug($data['business_name']) . '.getvnt.com',
                'status' => 'active',
                'is_verified' => false,
            ]);
            $user->tenant_id = $tenant->id;
            $user->save();
            $tenant->users()->attach($user->id, ['role' => 'organizer_owner']);
        } else {
            $user->tenant->update([
                'name' => $data['business_name'],
            ]);
        }

        // 2. Run AI Verification Auto-Check
        $aiCheck = $this->aiKycService->verifySubmission($data);

        // 3. Create Verification record with AI metadata
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
            'status' => $aiCheck['auto_approve_eligible'] ? 'approved' : 'pending',
            'ai_confidence_score' => $aiCheck['confidence_score'],
            'ai_recommendation' => $aiCheck['recommendation'],
            'ai_notes' => $aiCheck['analysis_notes'],
            'ai_auto_verified' => $aiCheck['auto_approve_eligible'],
            'verified_at' => $aiCheck['auto_approve_eligible'] ? now() : null,
        ]);

        // 4. Update User role and verification status
        if ($aiCheck['auto_approve_eligible']) {
            $user->update([
                'verification_status' => 'approved',
                'verified_badge' => true,
                'role' => 'trusted_organizer',
            ]);
            if ($user->tenant) {
                $user->tenant->update(['is_verified' => true]);
            }
        } else {
            $user->update([
                'verification_status' => 'pending',
                'role' => 'trusted_organizer',
            ]);
        }

        return $verification;
    }

    /**
     * Approve verification request -> Grant Blue Badge & set status to approved.
     */
    public function approve(OrganizerVerification $verification, ?User $admin = null): void
    {
        $verification->update([
            'status' => 'approved',
            'verified_at' => now(),
            'verified_by' => $admin ? $admin->id : null,
        ]);

        $user = $verification->user;

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
        } else {
            $user->tenant->update(['is_verified' => true]);
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
