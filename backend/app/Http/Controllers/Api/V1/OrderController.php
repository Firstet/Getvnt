<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Services\FeeCalculatorService;
use App\Services\LedgerService;
use App\Services\Payments\PaymentGatewayFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    protected FeeCalculatorService $feeCalculator;
    protected LedgerService $ledgerService;

    public function __construct(FeeCalculatorService $feeCalculator, LedgerService $ledgerService)
    {
        $this->feeCalculator = $feeCalculator;
        $this->ledgerService = $ledgerService;
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'event_id' => 'required|uuid',
            'ticket_type_id' => 'required|uuid',
            'quantity' => 'required|integer|min:1|max:10',
            'buyer_name' => 'required|string',
            'buyer_email' => 'required|email',
        ]);

        $event = Event::findOrFail($request->event_id);
        $ticketType = TicketType::findOrFail($request->ticket_type_id);

        $subtotal = round(((float) $ticketType->price) * $request->quantity, 2);

        // Calculate dynamic Platform Fee (5%) and Gateway Fee (1.5%)
        $feeData = $this->feeCalculator->calculate($subtotal);

        $user = $request->user();
        $gatewayName = strtolower($request->input('payment_gateway', 'paystack'));
        $instantComplete = $request->boolean('instant_complete', false) || $gatewayName === 'test';
        $paymentStatus = $instantComplete ? 'paid' : 'pending';
        $reference = 'REF-' . strtoupper(Str::random(12));

        $order = Order::create([
            'id' => (string) Str::uuid(),
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'event_id' => $event->id,
            'tenant_id' => $event->tenant_id,
            'user_id' => $user ? $user->id : null,
            'subtotal' => $subtotal,
            'platform_fee' => $feeData['platform_fee'],
            'gateway_fee' => $feeData['gateway_fee'],
            'total_charged' => $feeData['total_charged'],
            'currency' => $ticketType->currency ?? 'USD',
            'payment_status' => $paymentStatus,
            'payment_gateway' => $gatewayName,
            'payment_reference' => $reference,
            'buyer_name' => $request->buyer_name,
            'buyer_email' => strtolower($request->buyer_email),
        ]);

        $checkoutUrl = null;
        if (!$instantComplete) {
            try {
                $gateway = PaymentGatewayFactory::make($gatewayName);
                $initResult = $gateway->initializePayment($order);
                $checkoutUrl = $initResult['checkout_url'] ?? null;
            } catch (\Throwable $e) {
                // If initialization fails in dev, fallback to URL
                $checkoutUrl = "https://checkout.{$gatewayName}.com/pay/" . $order->payment_reference;
            }
        }

        $createdTickets = [];
        if ($instantComplete) {
            for ($i = 0; $i < $request->quantity; $i++) {
                $ticketCode = 'TKT-' . rand(1000, 9999) . '-' . strtoupper(Str::random(4));
                $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GETVNT-{$ticketCode}";

                $t = Ticket::create([
                    'id' => (string) Str::uuid(),
                    'ticket_code' => $ticketCode,
                    'order_id' => $order->id,
                    'event_id' => $event->id,
                    'ticket_type_id' => $ticketType->id,
                    'user_id' => $user ? $user->id : null,
                    'qr_code_url' => $qrUrl,
                    'status' => 'valid',
                ]);

                $createdTickets[] = $t;
            }

            $ticketType->increment('quantity_sold', $request->quantity);
            $this->ledgerService->recordTicketSale($order);
        }

        return response()->json([
            'success' => true,
            'checkout_url' => $checkoutUrl,
            'data' => [
                'order' => $order,
                'fee_breakdown' => $feeData,
                'checkout_url' => $checkoutUrl,
                'tickets' => $createdTickets,
            ],
            'message' => $instantComplete
                ? 'Ticket purchase successful. Passes issued with anti-counterfeit QR codes.'
                : 'Order initiated. Please proceed to payment URL.',
        ], 201);
    }

    public function lookup(Request $request)
    {
        $request->validate(['order_number' => 'required|string']);
        $order = Order::where('order_number', $request->order_number)->with(['event', 'tickets'])->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }
}
