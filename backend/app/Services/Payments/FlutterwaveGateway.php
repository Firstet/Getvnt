<?php

namespace App\Services\Payments;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FlutterwaveGateway implements PaymentGatewayInterface
{
    public function initializePayment(Order $order, array $config = []): array
    {
        $secretKey = $config['api_secret'] ?? env('FLUTTERWAVE_SECRET_KEY', 'FLWSECK_TEST_mock');
        $baseUrl = 'https://api.flutterwave.com/v3';

        $payload = [
            'tx_ref' => $order->payment_reference ?: 'ORD-' . $order->id,
            'amount' => (float) $order->total_charged,
            'currency' => $order->currency ?: 'USD',
            'redirect_url' => $config['callback_url'] ?? env('WORKSPACE_URL', 'https://app.getvnt.com') . '/checkout/callback',
            'customer' => [
                'email' => $order->buyer_email,
                'name' => $order->buyer_name,
            ],
            'customizations' => [
                'title' => 'GETVNT Ticket Purchase',
            ],
        ];

        if (str_contains($secretKey, 'mock') || env('APP_ENV') === 'testing') {
            return [
                'checkout_url' => "https://checkout.flutterwave.com/v3/hosted/pay/mock_{$order->payment_reference}",
                'reference' => $payload['tx_ref'],
                'raw_response' => ['status' => 'success', 'message' => 'Mock payment link created'],
            ];
        }

        $response = Http::withToken($secretKey)
            ->post("{$baseUrl}/payments", $payload);

        if ($response->successful() && $response->json('status') === 'success') {
            return [
                'checkout_url' => $response->json('data.link'),
                'reference' => $payload['tx_ref'],
                'raw_response' => $response->json(),
            ];
        }

        throw new \RuntimeException('Flutterwave payment initialization failed: ' . $response->body());
    }

    public function verifyWebhookSignature(Request $request, string $secret): bool
    {
        $signature = $request->header('verif-hash');
        if (!$signature) {
            return false;
        }

        return hash_equals($secret, $signature);
    }

    public function processWebhookPayload(array $payload): array
    {
        $event = $payload['event'] ?? ($payload['event.type'] ?? '');
        $data = $payload['data'] ?? $payload;
        $status = (($data['status'] ?? '') === 'successful' || ($data['status'] ?? '') === 'completed') ? 'paid' : 'failed';

        return [
            'event_type' => $event ?: 'charge.completed',
            'reference' => $data['tx_ref'] ?? ($data['flw_ref'] ?? ''),
            'status' => $status,
            'amount' => (float) ($data['amount'] ?? 0.0),
            'currency' => $data['currency'] ?? 'USD',
            'raw' => $payload,
        ];
    }
}
