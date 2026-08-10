<?php

namespace App\Http\Controllers\Api\V1\Attendee;

use App\Http\Controllers\Controller;
use App\Models\CommunityMessage;
use App\Models\CommunityPost;
use App\Models\Conversation;
use App\Models\DirectMessage;
use App\Models\Event;
use App\Models\OrganizerFollower;
use App\Models\Ticket;
use App\Models\UserNotification;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttendeeController extends Controller
{
    public function home(Request $request)
    {
        $user = $request->user();

        // 1. Upcoming Purchased Events
        $upcomingTickets = Ticket::where('user_id', $user->id)
            ->where('status', 'valid')
            ->with(['event', 'ticketType'])
            ->latest()
            ->take(5)
            ->get();

        // 2. Recommended & Trending Events
        $recommendedEvents = Event::where('is_published', true)->latest()->take(6)->get();

        // 3. Saved Wishlist
        $wishlist = Wishlist::where('user_id', $user->id)->with('event')->latest()->take(5)->get();

        // 4. Latest Notifications
        $notifications = UserNotification::where('user_id', $user->id)->latest()->take(5)->get();

        // 5. Community Highlights
        $communityPosts = CommunityPost::with('user')->withCount(['likes', 'comments'])->latest()->take(5)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'upcoming_events' => $upcomingTickets,
                'recommended_events' => $recommendedEvents,
                'saved_wishlist' => $wishlist,
                'latest_notifications' => $notifications,
                'community_highlights' => $communityPosts,
            ],
        ]);
    }

    public function counters(Request $request)
    {
        $user = $request->user();

        $ticketsCount = Ticket::where('user_id', $user->id)->count();
        $wishlistCount = Wishlist::where('user_id', $user->id)->count();
        $notificationsCount = UserNotification::where('user_id', $user->id)->where('is_read', false)->count();

        // Direct Messages unread count
        $unreadMessages = DirectMessage::whereHas('conversation', function ($q) use ($user) {
            $q->where('user_one_id', $user->id)->orWhere('user_two_id', $user->id);
        })->where('sender_id', '!=', $user->id)->where('is_read', false)->count();

        $communityAlerts = CommunityPost::where('user_id', $user->id)->sum('comments_count');

        return response()->json([
            'success' => true,
            'data' => [
                'my_tickets' => $ticketsCount,
                'wishlist' => $wishlistCount,
                'notifications' => $notificationsCount,
                'unread_messages' => $unreadMessages,
                'community_alerts' => (int) $communityAlerts,
                'purchased_events' => $ticketsCount,
            ],
        ]);
    }

    public function tickets(Request $request)
    {
        $user = $request->user();
        $tickets = Ticket::where('user_id', $user->id)
            ->with(['event', 'ticketType', 'order'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tickets,
        ]);
    }

    public function ticketReceipt(Request $request, string $id)
    {
        $user = $request->user();
        $ticket = Ticket::where('id', $id)->where('user_id', $user->id)->with(['order', 'event', 'ticketType'])->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'receipt_number' => 'REC-' . strtoupper(substr($ticket->id, 0, 8)),
                'ticket' => $ticket,
                'order' => $ticket->order,
                'event' => $ticket->event,
                'buyer_name' => $ticket->order ? $ticket->order->buyer_name : $user->name,
                'buyer_email' => $ticket->order ? $ticket->order->buyer_email : $user->email,
                'total_paid' => $ticket->order ? $ticket->order->total_charged : $ticket->ticketType->price,
                'paid_at' => $ticket->created_at,
            ],
        ]);
    }

    public function wishlist(Request $request)
    {
        $user = $request->user();
        $wishlist = Wishlist::where('user_id', $user->id)
            ->with('event')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wishlist,
        ]);
    }

    public function toggleWishlist(Request $request)
    {
        $request->validate(['event_id' => 'required|uuid']);
        $user = $request->user();

        $existing = Wishlist::where('user_id', $user->id)->where('event_id', $request->event_id)->first();
        if ($existing) {
            $existing->delete();
            return response()->json(['success' => true, 'saved' => false, 'message' => 'Removed from wishlist.']);
        }

        Wishlist::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'event_id' => $request->event_id,
        ]);

        return response()->json(['success' => true, 'saved' => true, 'message' => 'Saved to wishlist.']);
    }

    public function followOrganizer(Request $request, string $organizerId)
    {
        $user = $request->user();
        $existing = OrganizerFollower::where('user_id', $user->id)->where('organizer_id', $organizerId)->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['success' => true, 'following' => false, 'message' => 'Unfollowed organizer.']);
        }

        OrganizerFollower::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'organizer_id' => $organizerId,
        ]);

        return response()->json(['success' => true, 'following' => true, 'message' => 'Now following organizer.']);
    }

    public function community(Request $request)
    {
        $messages = CommunityMessage::with('user')->latest()->take(50)->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function postMessage(Request $request)
    {
        $request->validate(['message' => 'required|string']);
        $user = $request->user();

        $msg = CommunityMessage::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        return response()->json([
            'success' => true,
            'data' => $msg->load('user'),
        ], 201);
    }

    public function notifications(Request $request)
    {
        $user = $request->user();
        $type = $request->query('type', 'all');

        $query = UserNotification::where('user_id', $user->id);
        if ($type !== 'all') {
            $query->where('type', $type);
        }

        $notifications = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    public function markNotificationRead(Request $request, string $id)
    {
        $user = $request->user();
        UserNotification::where('user_id', $user->id)->where('id', $id)->update(['is_read' => true]);

        return response()->json(['success' => true, 'message' => 'Notification marked read.']);
    }

    public function markAllNotificationsRead(Request $request)
    {
        $user = $request->user();
        UserNotification::where('user_id', $user->id)->update(['is_read' => true]);

        return response()->json(['success' => true, 'message' => 'All notifications marked read.']);
    }

    public function deleteNotification(Request $request, string $id)
    {
        $user = $request->user();
        UserNotification::where('user_id', $user->id)->where('id', $id)->delete();

        return response()->json(['success' => true, 'message' => 'Notification deleted.']);
    }

    public function exportData(Request $request)
    {
        $user = $request->user();
        $tickets = Ticket::where('user_id', $user->id)->with('event')->get();
        $wishlist = Wishlist::where('user_id', $user->id)->with('event')->get();
        $notifications = UserNotification::where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'tickets' => $tickets,
                'wishlist' => $wishlist,
                'notifications' => $notifications,
                'exported_at' => now()->toIso8601String(),
            ],
        ]);
    }
}
