<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\Order;
use App\Models\PayoutRequest;
use Illuminate\Support\Str;

class LedgerService
{
    /**
     * Record atomic double-entry ledger records for a ticket checkout order.
     */
    public function recordTicketSale(Order $order): void
    {
        $tenantId = $order->tenant_id;
        $orderId = $order->id;
        $currency = $order->currency ?? 'USD';

        // 1. Credit Organizer Wallet for Gross Ticket Sale
        LedgerEntry::create([
            'id' => (string) Str::uuid(),
            'tenant_id' => $tenantId,
            'order_id' => $orderId,
            'type' => 'ticket_sale',
            'direction' => 'credit',
            'amount' => $order->subtotal,
            'currency' => $currency,
            'account_type' => 'organizer_wallet',
            'description' => "Gross ticket sale for Order #{$order->order_number}",
            'reference' => $order->payment_reference,
        ]);

        // 2. Debit Platform Processing Fee (5.0%)
        if ($order->platform_fee > 0) {
            LedgerEntry::create([
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenantId,
                'order_id' => $orderId,
                'type' => 'platform_fee',
                'direction' => 'debit',
                'amount' => $order->platform_fee,
                'currency' => $currency,
                'account_type' => 'platform_revenue',
                'description' => "Platform processing fee (5%) for Order #{$order->order_number}",
                'reference' => $order->payment_reference,
            ]);
        }

        // 3. Debit Gateway Processing Fee (1.5%)
        if ($order->gateway_fee > 0) {
            LedgerEntry::create([
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenantId,
                'order_id' => $orderId,
                'type' => 'gateway_fee',
                'direction' => 'debit',
                'amount' => $order->gateway_fee,
                'currency' => $currency,
                'account_type' => 'gateway_expense',
                'description' => "Payment gateway fee (1.5%) for Order #{$order->order_number}",
                'reference' => $order->payment_reference,
            ]);
        }
    }

    /**
     * Get organizer available wallet balance from double-entry ledger.
     */
    public function getOrganizerBalance(string $tenantId): float
    {
        $credits = LedgerEntry::where('tenant_id', $tenantId)
            ->where('account_type', 'organizer_wallet')
            ->where('direction', 'credit')
            ->sum('amount');

        $debits = LedgerEntry::where('tenant_id', $tenantId)
            ->where('account_type', 'organizer_wallet')
            ->where('direction', 'debit')
            ->sum('amount');

        return (float) max(0, $credits - $debits);
    }
}
