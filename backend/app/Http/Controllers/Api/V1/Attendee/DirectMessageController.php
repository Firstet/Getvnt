<?php

namespace App\Http\Controllers\Api\V1\Attendee;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\DirectMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DirectMessageController extends Controller
{
    public function conversations(Request $request)
    {
        $user = $request->user();
        $conversations = Conversation::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->with(['userOne', 'userTwo'])
            ->latest('last_message_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    public function messages(Request $request, string $conversationId)
    {
        $messages = DirectMessage::where('conversation_id', $conversationId)
            ->with('sender')
            ->oldest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'recipient_id' => 'required|uuid',
            'message' => 'required_without:attachment_url|nullable|string',
            'attachment_url' => 'nullable|string',
        ]);

        $user = $request->user();
        $recipientId = $request->recipient_id;

        // Find or create conversation
        $conversation = Conversation::where(function ($q) use ($user, $recipientId) {
            $q->where('user_one_id', $user->id)->where('user_two_id', $recipientId);
        })->orWhere(function ($q) use ($user, $recipientId) {
            $q->where('user_one_id', $recipientId)->where('user_two_id', $user->id);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'id' => (string) Str::uuid(),
                'user_one_id' => $user->id,
                'user_two_id' => $recipientId,
            ]);
        }

        $msgText = $request->message ?? 'Sent an attachment';

        $msg = DirectMessage::create([
            'id' => (string) Str::uuid(),
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'message' => $msgText,
            'attachment_url' => $request->attachment_url,
        ]);

        $conversation->update([
            'last_message' => $msgText,
            'last_message_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $msg->load('sender'),
        ], 201);
    }
}
