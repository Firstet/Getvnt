<?php

namespace App\Http\Controllers\Api\V1\Attendee;

use App\Http\Controllers\Controller;
use App\Models\CommunityMessage;
use App\Models\Ticket;
use App\Models\UserNotification;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttendeeController extends Controller
{
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
        $notifications = UserNotification::where('user_id', $user->id)->latest()->get();

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
}
