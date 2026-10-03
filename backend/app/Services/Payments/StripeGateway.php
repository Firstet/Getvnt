<?php

namespace App\Services\Payments;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class StripeGateway implements PaymentGatewayInterface
{
    public function initializePayment(Order $order, array $config = []): array
    {
        $secretKey = $config['api_secret'] ?? env('STRIPE_SECRET_KEY', 'sk_test_mock');
        $baseUrl = 'https://api.stripe.com/v1';

        $reference = $order->payment_reference ?: 'ORD-' . $order->id;

        if (str_contains($secretKey, 'mock') || env('APP_ENV') === 'testing') {
            return [
                'checkout_url' => "https://checkout.stripe.com/c/pay/cs_test_mock_{$reference}",
                'reference' => $reference,
                'raw_response' => ['id' => "cs_test_mock_{$reference}", 'object' => 'checkout.session'],
            ];
        }

        $response = Http::withBasicAuth($secretKey, '')
            ->asForm()
            ->post("{$baseUrl}/checkout/sessions", [
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => strtolower($order->currency ?: 'usd'),
                        'product_data' => [
                            'name' => 'GETVNT Ticket Order #' . $order->order_number,
                        ],
                        'unit_amount' => (int) round($order->total_charged * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => ($config['callback_url'] ?? env('WORKSPACE_URL', 'https://app.getvnt.com')) . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => ($config['callback_url'] ?? env('WORKSPACE_URL', 'https://app.getvnt.com')) . '/checkout/cancel',
                'client_reference_id' => $reference,
                'customer_email' => $order->buyer_email,
            ]);

        if ($response->successful()) {
            return [
                'checkout_url' => $response->json('url'),
                'reference' => $reference,
                'raw_response' => $response->json(),
            ];
        }

        throw new \RuntimeException('Stripe checkout initialization failed: ' . $response->body());
    }

    public function verifyWebhookSignature(Request $request, string $secret): bool
    {
        $sigHeader = $request->header('stripe-signature');
        if (!$sigHeader) {
            return false;
        }

        $items = explode(',', $sigHeader);
        $timestamp = null;
        $v1Sig = null;

        foreach ($items as $item) {
            $parts = explode('=', trim($item), 2);
            if (count($parts) === 2) {
                if ($parts[0] === 't') {
                    $timestamp = $parts[1];
                } elseif ($parts[0] === 'v1') {
                    $v1Sig = $parts[1];
                }
            }
        }

        if (!$timestamp || !$v1Sig) {
            return false;
        }

        // Check timestamp tolerance (300 seconds max drift)
        if (abs(time() - (int) $timestamp) > 300) {
            return false;
        }

        $signedPayload = "{$timestamp}." . $request->getContent();
        $expectedSig = hash_hmac('sha256', $signedPayload, $secret);

        return hash_equals($expectedSig, $v1Sig);
    }

    public function processWebhookPayload(array $payload): array
    {
        $type = $payload['type'] ?? '';
        $object = $payload['data']['object'] ?? [];

        $reference = $object['client_reference_id'] ?? ($object['id'] ?? '');
        $status = ($type === 'checkout.session.completed' && ($object['payment_status'] ?? '') === 'paid') ? 'paid' : 'failed';
        $amount = isset($object['amount_total']) ? ((float) $object['amount_total'] / 100) : 0.0;

        return [
            'event_type' => $type,
            'reference' => $reference,
            'status' => $status,
            'amount' => $amount,
            'currency' => strtoupper($object['currency'] ?? 'USD'),
            'raw' => $payload,
        ];
    }
}
