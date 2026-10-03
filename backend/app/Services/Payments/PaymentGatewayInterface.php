<?php

namespace App\Services\Payments;

use App\Models\Order;
use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     * Initialize a payment session for an order.
     */
    public function initializePayment(Order $order, array $config = []): array;

    /**
     * Verify incoming webhook signature.
     */
    public function verifyWebhookSignature(Request $request, string $secret): bool;

    /**
     * Process webhook payload into standardized data.
     */
    public function processWebhookPayload(array $payload): array;
}
