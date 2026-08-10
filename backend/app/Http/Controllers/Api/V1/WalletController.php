<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\LedgerEntry;
use App\Models\PayoutRequest;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WalletController extends Controller
{
    protected $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function getWallet(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $balance = $this->ledgerService->getOrganizerBalance($tenantId);
        $pendingPayout = PayoutRequest::where('tenant_id', $tenantId)->where('status', 'pending')->sum('amount');
        $payouts = PayoutRequest::where('tenant_id', $tenantId)->latest()->get();

        return response()->json([
            'success' => true,
            'data' => [
                'wallet' => [
                    'balance' => (float) $balance,
                    'pending_balance' => (float) $pendingPayout,
                    'currency' => 'USD',
                ],
                'payouts' => $payouts,
            ],
        ]);
    }

    public function getTransactions(Request $request)
    {
        $user = $request->user();
        $entries = LedgerEntry::where('tenant_id', $user->tenant_id)->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $entries,
        ]);
    }

    public function requestPayout(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10',
            'bank_name' => 'required|string',
            'account_number' => 'required|string',
            'account_name' => 'required|string',
        ]);

        $user = $request->user();
        $tenantId = $user->tenant_id;
        $balance = $this->ledgerService->getOrganizerBalance($tenantId);

        if ($request->amount > $balance) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient wallet balance. Available balance is \${$balance}.",
            ], 400);
        }

        $payout = PayoutRequest::create([
            'id' => (string) Str::uuid(),
            'tenant_id' => $tenantId,
            'user_id' => $user->id,
            'amount' => $request->amount,
            'currency' => 'USD',
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number,
            'account_name' => $request->account_name,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'data' => $payout,
            'message' => 'Payout request submitted for disbursal.',
        ], 201);
    }
}
