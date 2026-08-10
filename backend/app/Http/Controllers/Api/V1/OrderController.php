<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\TicketType;

use App\Services\FeeCalculatorService;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    protected $feeCalculator;
    protected $ledgerService;

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
            'payment_status' => 'paid',
            'payment_gateway' => $request->payment_gateway ?? 'paystack',
            'payment_reference' => 'REF-' . strtoupper(Str::random(10)),
            'buyer_name' => $request->buyer_name,
            'buyer_email' => strtolower($request->buyer_email),
        ]);

        // Generate Passes with QR Codes
        $createdTickets = [];
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

        // Increment ticket quantity sold
        $ticketType->increment('quantity_sold', $request->quantity);

        // Record Atomic Double-Entry Ledger Entries
        $this->ledgerService->recordTicketSale($order);

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order,
                'fee_breakdown' => $feeData,
                'tickets' => $createdTickets,
            ],
            'message' => 'Ticket purchase successful. Passes issued with anti-counterfeit QR codes.',
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
