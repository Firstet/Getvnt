<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EnterpriseAiController extends Controller
{
    /**
     * Public AI Assistant Chatbot Endpoint for Attendee & Organizer Floating Copilot
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'context' => 'nullable|string',
        ]);

        $message = $request->input('message');
        $context = $request->input('context', 'attendee');

        $isDraftRequest = preg_match('/(create|draft|plan|make|generate)\s+(an?\s+)?event/i', $message) ||
                          preg_match('/(concert|festival|summit|conference|party|meetup|workshop|tech|gala|hackathon)/i', $message);

        $promptType = $isDraftRequest ? 'event_planning' : 'general_chat';
        $replyText = $this->buildAiResponse($promptType, $message, ['context' => $context]);

        $eventDraft = null;
        if ($context === 'organizer' && $isDraftRequest) {
            $cleanTitle = trim(preg_replace('/^(create|draft|make|plan|generate)\s+(an?\s+)?(event\s+for\s+|event\s+about\s+|event\s+called\s+)?/i', '', $message));
            if (strlen($cleanTitle) < 3) {
                $cleanTitle = 'Global Tech & Cultural Innovation Festival 2026';
            } else {
                $cleanTitle = ucwords($cleanTitle);
            }

            $eventDraft = [
                'title' => $cleanTitle,
                'description' => "Join industry leaders, creators, and innovators for {$cleanTitle}. Featuring live keynote speeches, interactive workshops, VIP networking lounges, and digital QR ticket access.",
                'banner_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
                'venue_name' => 'Eko Atlantic Convention Center',
                'address' => 'Plot 1, Ocean View Drive, Victoria Island, Lagos',
                'start_date' => date('Y-m-d', strtotime('+30 days')),
                'start_time' => '09:00',
                'end_date' => date('Y-m-d', strtotime('+30 days')),
                'end_time' => '18:00',
                'ticket_types' => [
                    ['name' => 'Early Bird Access', 'price' => 25.00, 'quantity' => 100],
                    ['name' => 'General Pass', 'price' => 50.00, 'quantity' => 500],
                    ['name' => 'VIP Executive Pass', 'price' => 150.00, 'quantity' => 50],
                ]
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'reply' => $replyText,
                'event_draft' => $eventDraft,
            ]
        ]);
    }

    /**
     * AI Assistant Generation Engine
     */
    public function generate(Request $request)
    {
        $request->validate([
            'prompt_type' => 'required|string',
            'topic' => 'required|string',
            'context' => 'nullable|array',
        ]);

        $user = $request->user();
        $tenant = $user->tenant ?? null;

        // Determine plan limits
        $planSlug = $tenant->subscription->plan->slug ?? 'starter';
        $limits = [
            'starter' => 100,
            'professional' => 2000,
            'enterprise' => -1, // Unlimited
        ];

        $monthlyQuota = $limits[$planSlug] ?? 100;
        $used = $tenant->settings['ai_prompts_used'] ?? 14;
        $bonus = $tenant->settings['ai_prompts_bonus'] ?? 0;
        $effectiveQuota = ($monthlyQuota === -1) ? -1 : ($monthlyQuota + $bonus);

        if ($effectiveQuota !== -1 && $used >= $effectiveQuota) {
            return response()->json([
                'success' => false,
                'message' => 'AI Prompt limit reached for this month. Upgrade your plan or purchase an AI add-on pack to continue.',
                'code' => 'AI_QUOTA_EXCEEDED',
                'data' => [
                    'used' => $used,
                    'quota' => $effectiveQuota,
                    'plan' => $planSlug
                ]
            ], 403);
        }

        // Increment used count for non-unlimited plans
        if ($effectiveQuota !== -1) {
            $used++;
            $settings = $tenant->settings ?? [];
            $settings['ai_prompts_used'] = $used;
            $tenant->settings = $settings;
            $tenant->save();
        }

        $type = $request->input('prompt_type');
        $topic = $request->input('topic');
        $result = $this->buildAiResponse($type, $topic, $request->input('context', []));

        $remaining = ($effectiveQuota === -1) ? 'Unlimited' : ($effectiveQuota - $used);
        $warning = ($effectiveQuota !== -1 && ($effectiveQuota - $used) <= ($effectiveQuota * 0.15));

        return response()->json([
            'success' => true,
            'message' => 'AI Generation complete!',
            'data' => [
                'type' => $type,
                'output' => $result,
                'usage' => [
                    'used' => $used,
                    'quota' => $effectiveQuota === -1 ? 'Unlimited' : $effectiveQuota,
                    'remaining' => $remaining,
                    'plan' => ucfirst($planSlug),
                    'low_credit_warning' => $warning,
                ]
            ]
        ]);
    }

    /**
     * Top-up AI Add-on Credits
     */
    public function topUp(Request $request)
    {
        $request->validate([
            'pack' => 'required|string|in:500_prompts,2000_prompts,5000_prompts',
        ]);

        $user = $request->user();
        $tenant = $user->tenant;

        $packCredits = [
            '500_prompts' => 500,
            '2000_prompts' => 2000,
            '5000_prompts' => 5000,
        ];

        $creditsToAdd = $packCredits[$request->pack];

        $settings = $tenant->settings ?? [];
        $currentBonus = $settings['ai_prompts_bonus'] ?? 0;
        $settings['ai_prompts_bonus'] = $currentBonus + $creditsToAdd;
        $tenant->settings = $settings;
        $tenant->save();

        return response()->json([
            'success' => true,
            'message' => "Successfully added {$creditsToAdd} bonus AI prompts to your workspace!",
            'data' => [
                'bonus_prompts' => $settings['ai_prompts_bonus'],
            ]
        ]);
    }

    /**
     * Specialized Response Builder for 20+ Generators
     */
    private function buildAiResponse(string $type, string $topic, array $ctx): string
    {
        // 1. Check if Super Admin configured an active OpenAI-compatible Provider
        $activeProvider = \App\Models\AiProvider::where('status', 'active')
            ->whereNotNull('api_key')
            ->where('api_key', '!=', '')
            ->first();

        if ($activeProvider && !empty($activeProvider->api_key)) {
            try {
                $baseUrl = rtrim($activeProvider->base_url ?: 'https://api.openai.com/v1', '/');
                $model = $activeProvider->default_model ?: 'gpt-4o-mini';

                $systemPrompt = "You are Getvnt AI.\n"
                    . "You help users manage events, ticketing, marketing, payments, CRM, venues, vendors and business operations.\n"
                    . "Respond naturally.\n"
                    . "Do not introduce yourself.\n"
                    . "Do not prepend titles.\n"
                    . "Do not say \"Based on your query.\"\n"
                    . "Do not announce that you are an AI.\n"
                    . "Do not use emojis unless the user explicitly asks.\n"
                    . "Do not wrap responses in markdown unless requested.\n"
                    . "Only return the answer.\n"
                    . "If a list improves readability, use a simple numbered or bulleted list.\n"
                    . "Keep responses concise unless the user asks for more detail.\n"
                    . "Sound like an experienced event operations consultant.";

                $userPrompt = "Task: {$type}. Topic/Query: {$topic}. Additional context: " . json_encode($ctx);

                $response = \Illuminate\Support\Facades\Http::withoutVerifying()
                    ->timeout(12)
                    ->withHeaders([
                        'Authorization' => 'Bearer ' . $activeProvider->api_key,
                        'Content-Type' => 'application/json',
                    ])
                    ->post("{$baseUrl}/chat/completions", [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'system', 'content' => $systemPrompt],
                            ['role' => 'user', 'content' => $userPrompt],
                        ],
                        'temperature' => 0.7,
                        'max_tokens' => 1000,
                    ]);

                if ($response->successful() && isset($response->json()['choices'][0]['message']['content'])) {
                    return trim($response->json()['choices'][0]['message']['content']);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("OpenAI-compatible AI Provider ({$activeProvider->name}) call failed: " . $e->getMessage());
            }
        }

        switch ($type) {
            case 'general_chat':
                return "Hello! I am GETVNT AI Assistant, your dedicated event intelligence copilot. I can help you discover upcoming concerts and festivals, buy tickets, draft event campaigns, configure pricing tiers, or answer any platform support questions. How can I assist you today?";

            case 'event_planning':
                return "Phase 1: Pre-Event Preparation (T-60 Days)\n"
                    . "1. Secure venue contract and confirm target capacity.\n"
                    . "2. Configure ticket tiers (Early Bird, General Admission, VIP Experience).\n"
                    . "3. Set up payment gateway payouts.\n\n"
                    . "Phase 2: Marketing & Launch (T-45 Days)\n"
                    . "1. Launch targeted social media teaser campaigns.\n"
                    . "2. Send email announcements to registered attendees.\n\n"
                    . "Phase 3: Final Execution (T-7 Days)\n"
                    . "1. Deploy QR scanner devices for door staff.\n"
                    . "2. Conduct venue sound check and sponsor booth inspection.";

            case 'event_description':
                return "Join attendees for {$topic}. Experience live performances, keynotes, interactive networking lounges, and VIP access. Early bird tickets are available now at getvnt.com.";

            case 'landing_page':
                return "Welcome to {$topic}\n\n"
                    . "Join 3,000+ delegates on August 15, 2026 for keynotes, networking, and live performances.\n\n"
                    . "Highlights:\n"
                    . "- 25 World-Class Speakers\n"
                    . "- Fast-Track Digital Ticket QR Check-In\n"
                    . "- Exclusive VIP Afterparty and Lounge Access";

            case 'speaker_bio':
                return "Speaker Profile: Keynote Specialist for {$topic}\n\n"
                    . "Biography: An experienced entrepreneur and technology leader with over 12 years of experience scaling digital platforms across Sub-Saharan Africa. Recognized by Forbes Africa 30 Under 30, having presented at 50+ global summits on technology, event operations, and finance.";

            case 'marketing_copy':
                return "Tickets for {$topic} are officially live. Early bird passes include a 20% discount for a limited time at https://getvnt.com/events/" . Str::slug($topic);

            case 'email_campaign':
                return "Subject: Your Invitation to {$topic}\n\n"
                    . "Hello,\n\n"
                    . "Early bird tickets for {$topic} are now open.\n\n"
                    . "Event highlights include:\n"
                    . "- 3 Stages of live performances and panels\n"
                    . "- VIP fast-track gate entry and lounge access\n"
                    . "- Complimentary sponsor networking\n\n"
                    . "Reserve your ticket at https://getvnt.com/events/" . Str::slug($topic) . "\n\n"
                    . "Best regards,\nOrganizers Team";

            case 'sms_campaign':
                return "Early-bird passes for {$topic} are now live. Reserve your ticket at https://getvnt.com/e/" . Str::slug($topic);

            case 'social_post':
                return "Tickets for #{$topic} are officially live. Visit getvnt.com to secure your pass.\n\n#{$topic} #GetvntEvents";

            case 'budget_planning':
                return "Financial Budget Plan: {$topic}\n\n"
                    . "Venue Lease & Sound System: 4,500,000 NGN (35%)\n"
                    . "Artist & Speaker Fees: 3,800,000 NGN (30%)\n"
                    . "Marketing & Promotion: 1,800,000 NGN (14%)\n"
                    . "Catering & Hospitality: 1,500,000 NGN (12%)\n"
                    . "Door Staff & Security: 1,200,000 NGN (9%)\n\n"
                    . "Total Estimated Budget: 12,800,000 NGN\n"
                    . "Target Ticket Revenue: 18,500,000 NGN\n"
                    . "Target Profit Margin: 30.8%";

            case 'sponsorship_proposal':
                return "Executive Sponsorship Proposal: {$topic}\n\n"
                    . "Opportunity Overview: Partner to sponsor {$topic}, connecting your brand directly with 5,000+ attendees.\n\n"
                    . "Title Sponsor (10,000,000 NGN)\n"
                    . "- Naming rights across all marketing materials\n"
                    . "- Brand logo featured on all digital attendee QR tickets\n"
                    . "- Dedicated VIP lounge booth and mainstage branding\n\n"
                    . "Gold Sponsor (4,000,000 NGN)\n"
                    . "- Logo placement on website, ticket emails, and banners\n"
                    . "- 10 Complimentary VIP Pass tickets";

            case 'press_release':
                return "FOR IMMEDIATE RELEASE\n\n"
                    . "Organizers Announce {$topic}\n\n"
                    . "LAGOS, NIGERIA — Organizers have unveiled plans for {$topic}, taking place at Eko Hotel Convention Center. Powered by Getvnt, the event features digital ticketing, instant QR check-in, and keynote speakers.\n\n"
                    . "Media Contact: press@getvnt.com";

            case 'faqs':
                return "Frequently Asked Questions for {$topic}\n\n"
                    . "Q: How do I receive my ticket?\n"
                    . "A: Digital QR tickets are delivered to your email immediately upon purchase.\n\n"
                    . "Q: Can I transfer my ticket?\n"
                    . "A: Yes, tickets can be transferred to another attendee through your workspace dashboard.\n\n"
                    . "Q: Is parking available at the venue?\n"
                    . "A: Yes, parking is available at the venue.";

            case 'customer_reply':
                return "Hello,\n\n"
                    . "Thank you for reaching out regarding {$topic}. Your ticket is confirmed. Present the QR code on your mobile device at entry for fast check-in.\n\n"
                    . "Best regards,\n{$topic} Support Team";

            case 'analytics_explanation':
                return "Ticket sales increased by 34.2% over the past week. Data indicates 62% of sales originated from the Tuesday email newsletter. Scheduling an SMS update on Thursday will help reach remaining prospective buyers.";

            case 'sales_insights':
                return "VIP ticket tiers are selling 2.4 times faster than General Admission. Converting 50 unallocated General Admission tickets into VIP inventory can generate an additional 750,000 NGN in revenue.";

            case 'revenue_forecast':
                return "Based on current sales velocity (84 tickets/day), {$topic} is projected to reach 16,200,000 NGN in total gross sales prior to event day.";

            case 'event_checklist':
                return "Event Day Master Checklist for {$topic}\n\n"
                    . "1. Connect QR scanner apps on door staff devices.\n"
                    . "2. Confirm live payment gateway connection.\n"
                    . "3. Conduct VIP entrance & stage sound check.\n"
                    . "4. Place sponsor credentials at registration desk.";

            case 'risk_detection':
                return "Marketing engagement decreased by 12% over the last 48 hours due to competing weekend events. Launching a targeted email update or limited promotional discount will restore buyer momentum.";

            case 'ticket_pricing':
                return "Recommended Ticket Pricing Strategy for {$topic}:\n\n"
                    . "1. Early Bird Pass: 15,000 NGN (Limited to first 200 tickets)\n"
                    . "2. General Admission: 25,000 NGN (Standard Tier)\n"
                    . "3. VIP Lounge Pass: 75,000 NGN (Includes lounge access)\n"
                    . "4. VVIP Table (6 Seats): 500,000 NGN (Corporate)";

            case 'venue_recommendation':
                return "Recommended Venues for {$topic}:\n\n"
                    . "1. Eko Hotel Convention Centre, Lagos (Capacity: 5,000 | Concerts and summits)\n"
                    . "2. KICC Convention Centre, Nairobi (Capacity: 4,000 | Tech and trade shows)\n"
                    . "3. Labadi Beach Hotel, Accra (Capacity: 2,500 | Outdoor festivals and lifestyle events)";

            default:
                return "Information generated for topic: {$topic}.";
        }
    }
}
