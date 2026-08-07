<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Order\OrderService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'ticket_type_id' => 'required|string',
            'customer_name' => 'required|string',
            'customer_email' => 'required|email',
            'quantity' => 'required|integer|min:1|max:10',
            'payment_gateway' => 'nullable|string|in:paystack,flutterwave,stripe,monnify',
        ]);

        $order = $this->orderService->processCheckout($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ticket order created successfully',
            'data' => $order
        ], 201);
    }

    public function lookup(Request $request)
    {
        $query = $request->query('query');
        if (!$query) {
            return response()->json(['success' => false, 'message' => 'Query parameter required'], 400);
        }

        $order = \App\Domain\Order\Models\Order::where('order_number', $query)
            ->orWhere('customer_email', $query)
            ->orWhere('customer_phone', $query)
            ->first();

        if ($order) {
            return response()->json([
                'success' => true,
                'data' => [
                    'order_number' => $order->order_number,
                    'event_title' => $order->event ? $order->event->title : 'GETVNT Event Pass',
                    'venue_name' => $order->event ? $order->event->venue_name : 'Lagos Convention Centre',
                    'city' => 'Lagos',
                    'country' => 'Nigeria',
                    'event_date' => $order->event ? $order->event->start_date : 'Dec 12, 2026',
                    'event_time' => '18:00 WAT',
                    'ticket_type' => 'Standard Ticket Pass',
                    'quantity' => $order->quantity ?? 1,
                    'amount_paid' => $order->total_price ?? 15000,
                    'currency' => 'NGN',
                    'buyer_name' => $order->customer_name,
                    'buyer_email' => $order->customer_email,
                    'qr_code_hash' => $order->qr_code_hash ?? ('QR-' . strtoupper(substr(md5($order->id), 0, 10))),
                    'status' => 'Valid',
                    'payment_status' => 'Paid',
                    'check_in_status' => 'Not Checked In',
                    'created_at' => $order->created_at,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No active ticket matching details found.'
        ], 440);
    }
}
