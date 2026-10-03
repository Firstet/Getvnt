<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\LedgerEntry;
use App\Models\Order;
use App\Models\PaymentWebhook;
use App\Models\TicketType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentGatewayTest extends TestCase
{
    use RefreshDatabase;

    protected Event $event;
    protected TicketType $ticketType;

    protected function setUp(): void
    {
        parent::setUp();

        $organizer = User::factory()->create(['role' => 'trusted_organizer']);
        $tenant = \App\Models\Tenant::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'name' => 'Security Hardening Tenant',
            'slug' => 'security-hardening-tenant-' . \Illuminate\Support\Str::random(5),
            'status' => 'active',
        ]);
        $tenantId = $tenant->id;

        $this->event = Event::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'tenant_id' => $tenantId,
            'user_id' => $organizer->id,
            'title' => 'Security Hardening Festival',
            'slug' => 'security-hardening-festival',
            'start_date' => now()->addDays(7),
            'city' => 'Lagos',
            'country' => 'Nigeria',
            'is_published' => true,
        ]);

        $this->ticketType = TicketType::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'event_id' => $this->event->id,
            'tenant_id' => $tenantId,
            'name' => 'VIP Pass',
            'price' => 100.00,
            'currency' => 'USD',
            'quantity_available' => 50,
            'quantity_sold' => 0,
        ]);
    }

    public function test_paystack_payment_initialization()
    {
        $response = $this->postJson('/api/v1/orders/checkout', [
            'event_id' => $this->event->id,
            'ticket_type_id' => $this->ticketType->id,
            'quantity' => 2,
            'buyer_name' => 'Alice Paystack',
            'buyer_email' => 'alice@example.com',
            'payment_gateway' => 'paystack',
        ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertNotNull($response->json('checkout_url'));
        $this->assertDatabaseHas('orders', [
            'buyer_email' => 'alice@example.com',
            'payment_gateway' => 'paystack',
            'payment_status' => 'pending',
        ]);
    }

    public function test_flutterwave_payment_initialization()
    {
        $response = $this->postJson('/api/v1/orders/checkout', [
            'event_id' => $this->event->id,
            'ticket_type_id' => $this->ticketType->id,
            'quantity' => 1,
            'buyer_name' => 'Bob Flutterwave',
            'buyer_email' => 'bob@example.com',
            'payment_gateway' => 'flutterwave',
        ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertNotNull($response->json('checkout_url'));
    }

    public function test_stripe_payment_initialization()
    {
        $response = $this->postJson('/api/v1/orders/checkout', [
            'event_id' => $this->event->id,
            'ticket_type_id' => $this->ticketType->id,
            'quantity' => 1,
            'buyer_name' => 'Carol Stripe',
            'buyer_email' => 'carol@example.com',
            'payment_gateway' => 'stripe',
        ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertNotNull($response->json('checkout_url'));
    }

    public function test_paystack_webhook_verification_and_processing()
    {
        $order = Order::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'order_number' => 'ORD-TESTPAYSTACK',
            'event_id' => $this->event->id,
            'tenant_id' => $this->event->tenant_id,
            'subtotal' => 200.00,
            'platform_fee' => 10.00,
            'gateway_fee' => 3.00,
            'total_charged' => 213.00,
            'currency' => 'USD',
            'payment_status' => 'pending',
            'payment_gateway' => 'paystack',
            'payment_reference' => 'PAYSTACK_REF_999',
            'buyer_name' => 'Alice Paystack',
            'buyer_email' => 'alice@example.com',
        ]);

        $secret = 'sk_test_mock';
        $payload = [
            'event' => 'charge.success',
            'data' => [
                'reference' => 'PAYSTACK_REF_999',
                'status' => 'success',
                'amount' => 21300,
                'currency' => 'USD',
            ],
        ];
        $body = json_encode($payload);
        $signature = hash_hmac('sha512', $body, $secret);

        // Invalid signature returns 401
        $invalidResponse = $this->call(
            'POST',
            '/api/v1/webhooks/paystack',
            [],
            [],
            [],
            ['HTTP_X_PAYSTACK_SIGNATURE' => 'invalid_signature', 'CONTENT_TYPE' => 'application/json'],
            $body
        );
        $invalidResponse->assertStatus(401);

        // Valid signature processes webhook & creates ledger entries
        $validResponse = $this->call(
            'POST',
            '/api/v1/webhooks/paystack',
            [],
            [],
            [],
            ['HTTP_X_PAYSTACK_SIGNATURE' => $signature, 'CONTENT_TYPE' => 'application/json'],
            $body
        );

        $validResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertEquals('paid', $order->fresh()->payment_status);

        // Verify Double-Entry Ledger entries were created
        $this->assertDatabaseHas('ledger_entries', [
            'tenant_id' => $this->event->tenant_id,
            'order_id' => $order->id,
            'type' => 'ticket_sale',
            'amount' => 200.00,
        ]);
        $this->assertDatabaseHas('ledger_entries', [
            'tenant_id' => $this->event->tenant_id,
            'order_id' => $order->id,
            'type' => 'platform_fee',
            'amount' => 10.00,
        ]);
    }

    public function test_flutterwave_webhook_verification()
    {
        $secret = 'FLWSECK_TEST_mock';
        $payload = [
            'event' => 'charge.completed',
            'data' => [
                'tx_ref' => 'FLW_REF_777',
                'status' => 'successful',
                'amount' => 150.00,
            ],
        ];
        $body = json_encode($payload);

        // Invalid hash returns 401
        $invalidResponse = $this->call(
            'POST',
            '/api/v1/webhooks/flutterwave',
            [],
            [],
            [],
            ['HTTP_VERIF_HASH' => 'invalid_hash', 'CONTENT_TYPE' => 'application/json'],
            $body
        );
        $invalidResponse->assertStatus(401);

        // Valid hash returns 200
        $validResponse = $this->call(
            'POST',
            '/api/v1/webhooks/flutterwave',
            [],
            [],
            [],
            ['HTTP_VERIF_HASH' => $secret, 'CONTENT_TYPE' => 'application/json'],
            $body
        );
        $validResponse->assertStatus(200);
    }

    public function test_stripe_webhook_verification()
    {
        $secret = 'whsec_mock';
        $payload = [
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'client_reference_id' => 'STRIPE_REF_555',
                    'payment_status' => 'paid',
                    'amount_total' => 10000,
                ],
            ],
        ];
        $body = json_encode($payload);
        $time = time();
        $signedPayload = "{$time}.{$body}";
        $v1Sig = hash_hmac('sha256', $signedPayload, $secret);
        $stripeHeader = "t={$time},v1={$v1Sig}";

        $validResponse = $this->call(
            'POST',
            '/api/v1/webhooks/stripe',
            [],
            [],
            [],
            ['HTTP_STRIPE_SIGNATURE' => $stripeHeader, 'CONTENT_TYPE' => 'application/json'],
            $body
        );
        $validResponse->assertStatus(200);
    }

    public function test_webhook_idempotency_prevents_duplicate_ledger_entries()
    {
        $order = Order::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'order_number' => 'ORD-IDEMPOTENT',
            'event_id' => $this->event->id,
            'tenant_id' => $this->event->tenant_id,
            'subtotal' => 100.00,
            'platform_fee' => 5.00,
            'gateway_fee' => 1.50,
            'total_charged' => 106.50,
            'currency' => 'USD',
            'payment_status' => 'pending',
            'payment_gateway' => 'paystack',
            'payment_reference' => 'IDEMPOTENT_REF_100',
            'buyer_name' => 'Idempotent Buyer',
            'buyer_email' => 'idempotent@example.com',
        ]);

        $secret = 'sk_test_mock';
        $payload = [
            'event' => 'charge.success',
            'data' => [
                'reference' => 'IDEMPOTENT_REF_100',
                'status' => 'success',
                'amount' => 10650,
            ],
        ];
        $body = json_encode($payload);
        $signature = hash_hmac('sha512', $body, $secret);

        // Send first webhook
        $this->call('POST', '/api/v1/webhooks/paystack', [], [], [], ['HTTP_X_PAYSTACK_SIGNATURE' => $signature, 'CONTENT_TYPE' => 'application/json'], $body);

        $initialLedgerCount = LedgerEntry::where('order_id', $order->id)->count();
        $this->assertGreaterThan(0, $initialLedgerCount);

        // Send duplicate webhook
        $duplicateResponse = $this->call('POST', '/api/v1/webhooks/paystack', [], [], [], ['HTTP_X_PAYSTACK_SIGNATURE' => $signature, 'CONTENT_TYPE' => 'application/json'], $body);
        $duplicateResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        // Verify ledger count did NOT increase
        $this->assertEquals($initialLedgerCount, LedgerEntry::where('order_id', $order->id)->count());
    }

    public function test_admin_webhook_replay()
    {
        $admin = User::factory()->create(['role' => 'super_admin']);
        $order = Order::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'order_number' => 'ORD-REPLAY',
            'event_id' => $this->event->id,
            'tenant_id' => $this->event->tenant_id,
            'subtotal' => 150.00,
            'platform_fee' => 7.50,
            'gateway_fee' => 2.25,
            'total_charged' => 159.75,
            'currency' => 'USD',
            'payment_status' => 'pending',
            'payment_gateway' => 'paystack',
            'payment_reference' => 'REPLAY_REF_200',
            'buyer_name' => 'Replay Buyer',
            'buyer_email' => 'replay@example.com',
        ]);

        $webhook = PaymentWebhook::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'gateway' => 'paystack',
            'event_type' => 'charge.success',
            'payload' => [
                'event' => 'charge.success',
                'reference' => 'REPLAY_REF_200',
                'data' => ['reference' => 'REPLAY_REF_200', 'status' => 'success', 'amount' => 15975],
            ],
            'status' => 'failed',
            'retry_count' => 0,
        ]);

        $token = $admin->createToken('admin')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson("/api/v1/admin/webhooks/{$webhook->id}/replay");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertEquals('paid', $order->fresh()->payment_status);
        $this->assertEquals('success', $webhook->fresh()->status);
        $this->assertEquals(1, $webhook->fresh()->retry_count);
    }
}
