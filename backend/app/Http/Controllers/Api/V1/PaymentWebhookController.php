<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Order;
use App\Models\PaymentWebhook;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Services\LedgerService;
use App\Services\Payments\PaymentGatewayFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentWebhookController extends Controller
{
    protected LedgerService $ledgerService;

    public function __construct(LedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function handleWebhook(Request $request, string $gateway)
    {
        $gatewayName = strtolower(trim($gateway));

        try {
            $gatewayDriver = PaymentGatewayFactory::make($gatewayName);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }

        $secret = PaymentGatewayFactory::getSecretForGateway($gatewayName);

        if (!$gatewayDriver->verifyWebhookSignature($request, $secret)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid payment webhook signature.',
            ], 401);
        }

        $payload = $request->all();
        $processed = $gatewayDriver->processWebhookPayload($payload);
        $reference = $processed['reference'] ?? '';

        // Check idempotency in payment_webhooks
        $existing = PaymentWebhook::where('gateway', $gatewayName)
            ->where('event_type', $processed['event_type'])
            ->where('status', 'success')
            ->get()
            ->first(function ($webhook) use ($reference) {
                return ($webhook->payload['reference'] ?? '') === $reference
                    || ($webhook->payload['data']['reference'] ?? '') === $reference
                    || ($webhook->payload['tx_ref'] ?? '') === $reference;
            });

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Webhook payload already processed successfully.',
            ], 200);
        }

        $webhookLog = PaymentWebhook::create([
            'id' => (string) Str::uuid(),
            'gateway' => $gatewayName,
            'event_type' => $processed['event_type'],
            'payload' => array_merge($payload, ['reference' => $reference]),
            'response' => ['status' => 'received'],
            'status' => 'pending',
            'retry_count' => 0,
        ]);

        if ($processed['status'] === 'paid' && !empty($reference)) {
            $order = Order::where('payment_reference', $reference)
                ->orWhere('order_number', $reference)
                ->first();

            if ($order) {
                if ($order->payment_status !== 'paid') {
                    $order->update(['payment_status' => 'paid']);

                    // Issue ticket passes if none generated yet
                    if ($order->tickets()->count() === 0) {
                        $ticketType = TicketType::where('event_id', $order->event_id)->first();
                        if ($ticketType) {
                            $ticketCode = 'TKT-' . rand(1000, 9999) . '-' . strtoupper(Str::random(4));
                            Ticket::create([
                                'id' => (string) Str::uuid(),
                                'ticket_code' => $ticketCode,
                                'order_id' => $order->id,
                                'event_id' => $order->event_id,
                                'ticket_type_id' => $ticketType->id,
                                'user_id' => $order->user_id,
                                'qr_code_url' => "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GETVNT-{$ticketCode}",
                                'status' => 'valid',
                            ]);
                        }
                    }

                    // Record Atomic Double-Entry Ledger Entries
                    $this->ledgerService->recordTicketSale($order);
                }

                $webhookLog->update([
                    'status' => 'success',
                    'response' => ['status' => 'processed', 'order_id' => $order->id],
                ]);
            } else {
                $webhookLog->update([
                    'status' => 'failed',
                    'response' => ['error' => 'Order not found for reference ' . $reference],
                ]);
            }
        } else {
            $webhookLog->update([
                'status' => $processed['status'] === 'failed' ? 'failed' : 'ignored',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment webhook processed.',
        ]);
    }

    public function replayWebhook(Request $request, string $id)
    {
        $webhookLog = PaymentWebhook::findOrFail($id);
        $webhookLog->increment('retry_count');

        $gatewayDriver = PaymentGatewayFactory::make($webhookLog->gateway);
        $processed = $gatewayDriver->processWebhookPayload($webhookLog->payload ?? []);
        $reference = $processed['reference'] ?? ($webhookLog->payload['reference'] ?? '');

        if (!empty($reference)) {
            $order = Order::where('payment_reference', $reference)
                ->orWhere('order_number', $reference)
                ->first();

            if ($order) {
                if ($order->payment_status !== 'paid') {
                    $order->update(['payment_status' => 'paid']);
                    $this->ledgerService->recordTicketSale($order);
                }

                $webhookLog->update([
                    'status' => 'success',
                    'response' => ['status' => 'replayed_successfully', 'order_id' => $order->id],
                ]);

                return response()->json([
                    'success' => true,
                    'message' => "Webhook #{$id} replayed successfully.",
                ]);
            }
        }

        $webhookLog->update(['status' => 'failed']);

        return response()->json([
            'success' => false,
            'message' => "Webhook replay failed: order reference not found.",
        ], 422);
    }
}
