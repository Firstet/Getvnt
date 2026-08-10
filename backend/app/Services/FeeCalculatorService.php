<?php

namespace App\Services;

use App\Models\CommissionRule;

class FeeCalculatorService
{
    /**
     * Calculate platform fee (5.0%) and gateway fee (1.5%).
     */
    public function calculate(float $subtotal): array
    {
        $rule = CommissionRule::where('is_active', true)->first();

        $platformPercent = $rule ? (float) $rule->platform_fee : 5.00;
        $gatewayPercent = $rule ? (float) $rule->processing_fee : 1.50;

        $platformFee = round(($subtotal * $platformPercent) / 100, 2);
        $gatewayFee = round(($subtotal * $gatewayPercent) / 100, 2);

        $totalCharged = round($subtotal + $platformFee + $gatewayFee, 2);
        $organizerNet = round($subtotal, 2);

        return [
            'subtotal' => $subtotal,
            'platform_fee_percent' => $platformPercent,
            'platform_fee' => $platformFee,
            'gateway_fee_percent' => $gatewayPercent,
            'gateway_fee' => $gatewayFee,
            'total_charged' => $totalCharged,
            'organizer_net' => $organizerNet,
        ];
    }
}
