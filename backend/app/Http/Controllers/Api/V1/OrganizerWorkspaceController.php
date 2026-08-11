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
        $request->validate(['ticket_code' => 'required|string']);

        $ticket = Ticket::where('ticket_code', $request->ticket_code)->with(['event', 'ticketType', 'user'])->first();

        if (!$ticket) {
            return response()->json(['success' => false, 'message' => 'Invalid ticket code.'], 404);
        }

        if ($ticket->status === 'checked_in') {
            return response()->json([
                'success' => false,
                'already_checked_in' => true,
                'checked_in_at' => $ticket->checked_in_at,
                'message' => "Ticket ALREADY checked in at {$ticket->checked_in_at}.",
            ], 400);
        }

        $ticket->update([
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $ticket,
            'message' => 'Ticket check-in SUCCESSFUL! Pass validated.',
        ]);
    }
}
