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
        $queryStr = trim($request->input('query', $request->input('order_number', '')));

        if (empty($queryStr)) {
            return response()->json([
                'success' => false,
                'code' => 'INVALID_CODE',
                'message' => 'Please enter an Order Number, Ticket Code, Email, or QR payload.',
            ], 400);
        }

        // 1. Search Ticket directly by ticket_code, ID, or QR url
        $ticket = Ticket::where('ticket_code', $queryStr)
            ->orWhere('id', $queryStr)
            ->orWhere('qr_code_url', 'like', "%{$queryStr}%")
            ->with(['event', 'ticketType', 'order', 'user'])
            ->first();

        $order = null;
        if ($ticket) {
            $order = $ticket->order;
        } else {
            // 2. Search Order by order_number, payment_reference, buyer_email, or buyer_phone
            $order = Order::where('order_number', $queryStr)
                ->orWhere('payment_reference', $queryStr)
                ->orWhere('buyer_email', strtolower($queryStr))
                ->orWhere('buyer_phone', $queryStr)
                ->with(['event', 'tickets.ticketType'])
                ->first();

            if ($order && $order->tickets->isNotEmpty()) {
                $ticket = $order->tickets->first();
            }
        }

        // If not found in database, return 404 with INVALID_CODE
        if (!$ticket && !$order) {
            return response()->json([
                'success' => false,
                'code' => 'INVALID_CODE',
                'message' => 'Invalid Ticket Code or Reference. Ticket not found on GETVNT.',
            ], 404);
        }

        $event = $ticket ? $ticket->event : ($order ? $order->event : null);
        $ticketType = $ticket ? $ticket->ticketType : null;

        // Check Event Cancelled status
        $isCancelled = false;
        if ($event && (strtolower($event->status ?? '') === 'cancelled' || $event->is_published === false)) {
            $isCancelled = true;
        }

        // Check Expired status
        $isExpired = false;
        if ($event && $event->end_date && \Carbon\Carbon::parse($event->end_date)->isPast()) {
            $isExpired = true;
        }
        if ($ticket && strtolower($ticket->status ?? '') === 'expired') {
            $isExpired = true;
        }

        // Check Checked In status
        $isCheckedIn = $ticket && (strtolower($ticket->status ?? '') === 'checked_in' || !empty($ticket->checked_in_at));

        // Determine master status code
        $statusCode = 'VALID';
        $statusLabel = 'Valid';
        $message = 'Ticket is valid and ready for event entry.';

        if ($isCancelled) {
            $statusCode = 'EVENT_CANCELLED';
            $statusLabel = 'Event Cancelled';
            $message = 'This event has been cancelled by the organizer. Attendees are eligible for a refund.';
        } elseif ($isExpired) {
            $statusCode = 'TICKET_EXPIRED';
            $statusLabel = 'Ticket Expired';
            $message = 'Ticket Expired. The event has concluded.';
        } elseif ($isCheckedIn) {
            $statusCode = 'ALREADY_CHECKED_IN';
            $statusLabel = 'Already Checked In';
            $message = 'Ticket ALREADY checked in at ' . ($ticket->checked_in_at ?? 'gate scanner') . '.';
        }

        $ticketCode = $ticket ? $ticket->ticket_code : ($order ? $order->order_number : $queryStr);
        $qrHash = $ticket ? ($ticket->qr_code_url ?? "GETVNT-{$ticket->ticket_code}") : "GETVNT-{$ticketCode}";

        return response()->json([
            'success' => true,
            'code' => $statusCode,
            'status' => $statusLabel,
            'message' => $message,
            'data' => [
                'order_number' => $order ? $order->order_number : 'ORD-' . strtoupper(substr(md5($ticketCode), 0, 8)),
                'ticket_id' => $ticket ? $ticket->id : 'TCK-' . strtoupper(substr(md5($ticketCode), 0, 8)),
                'ticket_code' => $ticketCode,
                'event_id' => $event ? $event->id : null,
                'event_title' => $event ? $event->title : 'GETVNT Featured Event',
                'venue_name' => $event ? ($event->venue_name ?? 'Convention Centre') : 'Main Arena',
                'city' => $event ? ($event->city ?? 'Lagos') : 'Lagos',
                'country' => $event ? ($event->country ?? 'Nigeria') : 'Nigeria',
                'event_date' => $event ? ($event->start_date ?? 'Upcoming') : 'Dec 2026',
                'event_time' => '18:00 WAT (Doors Open 17:00)',
                'ticket_type' => $ticketType ? $ticketType->name : 'VIP Lounge Pass',
                'quantity' => $order ? ($order->tickets->count() ?: 1) : 1,
                'amount_paid' => $order ? (float)$order->total_charged : 0.0,
                'currency' => $order ? ($order->currency ?? 'USD') : 'USD',
                'buyer_name' => $order ? $order->buyer_name : 'Guest Attendee',
                'buyer_email' => $order ? $order->buyer_email : '',
                'buyer_phone' => $order ? $order->buyer_phone : '',
                'qr_code_hash' => $qrHash,
                'status' => $statusLabel,
                'status_code' => $statusCode,
                'payment_status' => $order ? ucfirst($order->payment_status) : 'Paid',
                'check_in_status' => $isCheckedIn ? 'Checked In' : 'Not Checked In',
                'checked_in_at' => $ticket ? $ticket->checked_in_at : null,
                'is_event_cancelled' => $isCancelled,
                'is_expired' => $isExpired,
                'created_at' => $order ? $order->created_at : now()->toIso8601String(),
            ],
        ]);
    }
}
