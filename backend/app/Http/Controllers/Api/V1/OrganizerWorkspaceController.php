<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Order;
use App\Models\Ticket;

use App\Services\AiService;
use App\Services\LedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizerWorkspaceController extends Controller
{
    protected $ledgerService;
    protected $aiService;

    public function __construct(LedgerService $ledgerService, AiService $aiService)
    {
        $this->ledgerService = $ledgerService;
        $this->aiService = $aiService;
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;

        $eventsCount = Event::where('tenant_id', $tenantId)->count();
        $ordersCount = Order::where('tenant_id', $tenantId)->count();
        $totalRevenue = Order::where('tenant_id', $tenantId)->where('payment_status', 'paid')->sum('subtotal');
        $ticketsSold = Ticket::whereHas('order', function ($q) use ($tenantId) {
            $q->where('tenant_id', $tenantId)->where('payment_status', 'paid');
        })->count();

        $walletBalance = $this->ledgerService->getOrganizerBalance($tenantId);

        return response()->json([
            'success' => true,
            'data' => [
                'events_count' => $eventsCount,
                'orders_count' => $ordersCount,
                'total_revenue' => (float) $totalRevenue,
                'tickets_sold' => $ticketsSold,
                'wallet_balance' => (float) $walletBalance,
                'pending_payout' => 0.00,
            ],
        ]);
    }

    public function listEvents(Request $request)
    {
        $user = $request->user();
        $events = Event::where('tenant_id', $user->tenant_id)
            ->with('ticketTypes')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    public function createEvent(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'start_date' => 'required',
        ]);

        $user = $request->user();
        $tenantId = $user->tenant_id;

        $event = Event::create([
            'id' => (string) Str::uuid(),
            'tenant_id' => $tenantId,
            'user_id' => $user->id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . Str::random(5),
            'tagline' => $request->tagline,
            'description' => $request->description,
            'category' => $request->category ?? 'Music',
            'banner_url' => $request->banner_url,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'venue_name' => $request->venue_name,
            'city' => $request->city ?? 'Lagos',
            'country' => $request->country ?? 'Nigeria',
            'is_published' => true,
            'website_template' => $request->website_template ?? 'music_festival',
            'marketing_copy' => $request->marketing_copy,
        ]);

        // Multi-tier ticket creation support
        if ($request->has('ticket_types') && is_array($request->ticket_types) && count($request->ticket_types) > 0) {
            foreach ($request->ticket_types as $tier) {
                if (!empty($tier['name'])) {
                    $event->ticketTypes()->create([
                        'id' => (string) Str::uuid(),
                        'tenant_id' => $tenantId,
                        'name' => $tier['name'],
                        'price' => floatval($tier['price'] ?? 0),
                        'currency' => $tier['currency'] ?? ($request->currency ?? 'USD'),
                        'quantity_available' => intval($tier['quantity_available'] ?? $tier['quantity'] ?? 100),
                    ]);
                }
            }
        } else {
            // Fallback single ticket creation
            $event->ticketTypes()->create([
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenantId,
                'name' => $request->ticket_name ?? 'General Admission Pass',
                'price' => floatval($request->ticket_price ?? 0),
                'currency' => $request->currency ?? 'USD',
                'quantity_available' => intval($request->ticket_quantity ?? 500),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $event->load('ticketTypes'),
            'message' => 'Event published successfully with ticket tiers.',
        ], 201);
    }

    public function listOrders(Request $request)
    {
        $user = $request->user();
        $orders = Order::where('tenant_id', $user->tenant_id)
            ->with(['event', 'tickets'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    public function generateAi(Request $request)
    {
        $request->validate(['prompt' => 'required|string']);
        $prompt = $request->prompt;

        $response = $this->aiService->generateText($prompt);

        return response()->json([
            'success' => true,
            'data' => [
                'response' => $response,
            ],
        ]);
    }

    public function verifyQr(Request $request)
    {
        $rawCode = trim($request->input('ticket_code', $request->input('qr_code', $request->input('code', ''))));

        if (empty($rawCode)) {
            return response()->json([
                'success' => false,
                'code' => 'INVALID_CODE',
                'message' => 'Ticket code or QR payload is required.',
            ], 422);
        }

        // Clean any GETVNT- prefix or URL wrapping
        $cleanCode = str_replace([
            'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=GETVNT-',
            'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GETVNT-',
            'GETVNT-',
        ], '', $rawCode);

        $ticket = Ticket::where('ticket_code', $cleanCode)
            ->orWhere('ticket_code', $rawCode)
            ->orWhere('id', $cleanCode)
            ->orWhere('qr_code_url', 'like', "%{$cleanCode}%")
            ->with(['event', 'ticketType', 'user', 'order'])
            ->first();

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'code' => 'INVALID_CODE',
                'message' => 'Invalid ticket code or QR payload. Ticket not found.',
            ], 404);
        }

        $event = $ticket->event;

        // 1. Check if Event is Cancelled
        if ($event && (strtolower($event->status ?? '') === 'cancelled' || $event->is_published === false)) {
            return response()->json([
                'success' => false,
                'code' => 'EVENT_CANCELLED',
                'message' => 'Event is Cancelled. Ticket check-in denied.',
            ], 400);
        }

        // 2. Check if Expired
        $isExpired = false;
        if ($event && $event->end_date && \Carbon\Carbon::parse($event->end_date)->isPast()) {
            $isExpired = true;
        }
        if (strtolower($ticket->status ?? '') === 'expired') {
            $isExpired = true;
        }

        if ($isExpired) {
            return response()->json([
                'success' => false,
                'code' => 'TICKET_EXPIRED',
                'message' => 'Ticket Expired. Event has already concluded.',
            ], 400);
        }

        // 3. Check if Already Checked In
        if (strtolower($ticket->status ?? '') === 'checked_in' || !empty($ticket->checked_in_at)) {
            return response()->json([
                'success' => false,
                'code' => 'ALREADY_CHECKED_IN',
                'already_checked_in' => true,
                'checked_in_at' => $ticket->checked_in_at,
                'message' => "Ticket ALREADY checked in at {$ticket->checked_in_at}.",
            ], 400);
        }

        // 4. Perform Valid Check-in
        $now = now()->toDateTimeString();
        $ticket->update([
            'status' => 'checked_in',
            'checked_in_at' => $now,
        ]);

        return response()->json([
            'success' => true,
            'code' => 'VALID',
            'data' => $ticket->fresh(['event', 'ticketType', 'user', 'order']),
            'message' => 'Ticket check-in SUCCESSFUL! Door pass validated.',
        ]);
    }
}
