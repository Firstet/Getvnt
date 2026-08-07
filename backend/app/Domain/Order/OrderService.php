<?php

namespace App\Domain\Order;

use App\Models\Event;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\TicketType;
use Illuminate\Support\Str;

class OrderService
{
    public function processCheckout(array $data): Order
    {
        $event = Event::with('ticketTypes')->findOrFail($data['event_id']);

        $ticketType = TicketType::find($data['ticket_type_id'] ?? null);
        if (!$ticketType) {
            $ticketType = $event->ticketTypes->first();
        }

        if (!$ticketType) {
            $ticketType = TicketType::create([
                'id' => (string) Str::uuid(),
                'event_id' => $event->id,
                'tenant_id' => $event->tenant_id,
                'name' => 'General Admission',
                'price' => 15000,
                'currency' => 'NGN',
                'quantity' => 1000,
                'quantity_sold' => 0,
            ]);
        }

        $quantity = $data['quantity'] ?? 1;
        $subtotal = $ticketType->price * $quantity;
        $fees = $subtotal * 0.025 + (100 * $quantity); // 2.5% + 100 fee rule
        $totalAmount = $subtotal + $fees;

        // Create Order Reference
        $order = Order::create([
            'id' => (string) Str::uuid(),
            'reference' => 'GVNT-' . strtoupper(Str::random(10)),
            'event_id' => $event->id,
            'tenant_id' => $event->tenant_id,
            'customer_name' => $data['customer_name'],
            'customer_email' => $data['customer_email'],
            'customer_phone' => $data['customer_phone'] ?? null,
            'subtotal' => $subtotal,
            'fees' => $fees,
            'total_amount' => $totalAmount,
            'currency' => $ticketType->currency,
            'payment_status' => 'paid', // Auto-cleared for demo
            'payment_gateway' => $data['payment_gateway'] ?? 'paystack',
            'transaction_reference' => 'TXN-' . strtoupper(Str::random(12)),
        ]);

        // Generate Tickets
        for ($i = 0; $i < $quantity; $i++) {
            $ticketCode = 'TIX-' . strtoupper(Str::random(8));
            Ticket::create([
                'id' => (string) Str::uuid(),
                'order_id' => $order->id,
                'event_id' => $event->id,
                'tenant_id' => $event->tenant_id,
                'ticket_type_id' => $ticketType->id,
                'ticket_code' => $ticketCode,
                'qr_code_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . $ticketCode,
                'attendee_name' => $data['customer_name'],
                'attendee_email' => $data['customer_email'],
                'status' => 'valid',
            ]);
        }

        // Update inventory
        $ticketType->increment('quantity_sold', $quantity);

        return $order->load('tickets');
    }
}
