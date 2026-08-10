<?php

namespace App\Http\Controllers\Api\V1\Attendee;

use App\Http\Controllers\Controller;
use App\Models\CommunityPost;
use App\Models\CommunityPostComment;
use App\Models\CommunityPostLike;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CommunityController extends Controller
{
    public function feed(Request $request)
    {
        $user = $request->user();
        $posts = CommunityPost::with(['user', 'comments.user'])
            ->latest()
            ->get()
            ->map(function ($post) use ($user) {
                $post->user_has_liked = CommunityPostLike::where('post_id', $post->id)->where('user_id', $user->id)->exists();
                return $post;
            });

        return response()->json([
            'success' => true,
            'data' => $posts,
        ]);
    }

    public function createPost(Request $request)
    {
        $request->validate(['content' => 'required|string']);
        $user = $request->user();

        $post = CommunityPost::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'content' => $request->content,
            'image_url' => $request->image_url,
        ]);

        return response()->json([
            'success' => true,
            'data' => $post->load('user'),
            'message' => 'Community post published.',
        ], 201);
    }

    public function toggleLike(Request $request, string $id)
    {
        $user = $request->user();
        $post = CommunityPost::findOrFail($id);

        $existing = CommunityPostLike::where('post_id', $post->id)->where('user_id', $user->id)->first();
        if ($existing) {
            $existing->delete();
            $post->decrement('likes_count');
            return response()->json(['success' => true, 'liked' => false, 'likes_count' => $post->fresh()->likes_count]);
        }

        CommunityPostLike::create([
            'id' => (string) Str::uuid(),
            'post_id' => $post->id,
            'user_id' => $user->id,
        ]);
        $post->increment('likes_count');

        return response()->json(['success' => true, 'liked' => true, 'likes_count' => $post->fresh()->likes_count]);
    }

    public function comments(string $id)
    {
        $comments = CommunityPostComment::where('post_id', $id)->with('user')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $comments,
        ]);
    }

    public function addComment(Request $request, string $id)
    {
        $request->validate(['comment' => 'required|string']);
        $user = $request->user();
        $post = CommunityPost::findOrFail($id);

        $comment = CommunityPostComment::create([
            'id' => (string) Str::uuid(),
            'post_id' => $post->id,
            'user_id' => $user->id,
            'comment' => $request->comment,
        ]);

        $post->increment('comments_count');

        return response()->json([
            'success' => true,
            'data' => $comment->load('user'),
            'message' => 'Comment added.',
        ], 201);
    }
}
