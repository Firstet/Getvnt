<?php

namespace App\Services\Payments;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaystackGateway implements PaymentGatewayInterface
{
    public function initializePayment(Order $order, array $config = []): array
    {
        $secretKey = $config['api_secret'] ?? env('PAYSTACK_SECRET_KEY', 'sk_test_mock');
        $baseUrl = 'https://api.paystack.co';

        $payload = [
            'email' => $order->buyer_email,
            'amount' => (int) round($order->total_charged * 100), // Amount in kobo/cents
            'reference' => $order->payment_reference ?: 'ORD-' . $order->id,
            'currency' => $order->currency ?: 'NGN',
            'callback_url' => $config['callback_url'] ?? env('WORKSPACE_URL', 'https://app.getvnt.com') . '/checkout/callback',
            'metadata' => [
                'order_id' => $order->id,
                'tenant_id' => $order->tenant_id,
            ],
        ];

        // If mock key in test mode, return test payload without HTTP call
        if (str_contains($secretKey, 'mock') || env('APP_ENV') === 'testing') {
            return [
                'checkout_url' => "https://checkout.paystack.com/mock_{$order->payment_reference}",
                'reference' => $payload['reference'],
                'raw_response' => ['status' => true, 'message' => 'Mock authorization URL created.'],
            ];
        }

        $response = Http::withToken($secretKey)
            ->post("{$baseUrl}/transaction/initialize", $payload);

        if ($response->successful() && $response->json('status')) {
            return [
                'checkout_url' => $response->json('data.authorization_url'),
                'reference' => $response->json('data.reference'),
                'raw_response' => $response->json(),
            ];
        }

        throw new \RuntimeException('Paystack payment initialization failed: ' . $response->body());
    }

    public function verifyWebhookSignature(Request $request, string $secret): bool
    {
        $signature = $request->header('x-paystack-signature');
        if (!$signature) {
            return false;
        }

        $computed = hash_hmac('sha512', $request->getContent(), $secret);
        return hash_equals($computed, $signature);
    }

    public function processWebhookPayload(array $payload): array
    {
        $event = $payload['event'] ?? '';
        $data = $payload['data'] ?? [];
        $status = ($event === 'charge.success' && ($data['status'] ?? '') === 'success') ? 'paid' : 'failed';

        return [
            'event_type' => $event,
            'reference' => $data['reference'] ?? ($data['tx_ref'] ?? ''),
            'status' => $status,
            'amount' => isset($data['amount']) ? ((float) $data['amount'] / 100) : 0.0,
            'currency' => $data['currency'] ?? 'NGN',
            'raw' => $payload,
        ];
    }
}
