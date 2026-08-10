<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\KycService;
use Illuminate\Http\Request;

class KycController extends Controller
{
    protected $kycService;

    public function __construct(KycService $kycService)
    {
        $this->kycService = $kycService;
    }

    public function submit(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string|max:255',
            'phone' => 'required|string',
            'bank_name' => 'required|string',
            'account_number' => 'required|string',
            'account_name' => 'required|string',
        ]);

        $user = $request->user();
        $verification = $this->kycService->submit($user, $request->all());

        return response()->json([
            'success' => true,
            'data' => $verification,
            'message' => 'Onboarding verification submitted successfully. Status is pending review.',
        ], 201);
    }

    public function status(Request $request)
    {
        $user = $request->user();
        $verification = $user->verifications()->latest()->first();

        return response()->json([
            'success' => true,
            'data' => [
                'verification_status' => $user->verification_status,
                'verified_badge' => (bool) $user->verified_badge,
                'verification' => $verification,
            ],
        ]);
    }
}
