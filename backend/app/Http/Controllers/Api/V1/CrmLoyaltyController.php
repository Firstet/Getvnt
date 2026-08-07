<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CrmLoyaltyController extends Controller
{
    /**
     * Get Attendee CRM Profiles & LTV Telemetry
     */
    public function getCrmProfiles(Request $request)
    {
        $profiles = [
            [
                'id' => 'ATT-901',
                'name' => 'Dr. Kelvin Firste',
                'email' => 'kelvin@example.com',
                'phone' => '+234 803 123 4567',
                'location' => 'Lagos, Nigeria',
                'events_attended' => 8,
                'total_spent_ngn' => 485000,
                'ltv_tier' => 'VIP Ambassador',
                'loyalty_points' => 3850,
                'engagement_rate' => '94%',
                'interests' => ['Afrobeats', 'AI Summits', 'VIP Tech'],
                'last_checkin' => '2026-08-01 19:42:00',
            ],
            [
                'id' => 'ATT-902',
                'name' => 'Amina Bello',
                'email' => 'amina.bello@techfirm.ng',
                'phone' => '+234 802 987 6543',
                'location' => 'Abuja, Nigeria',
                'events_attended' => 5,
                'total_spent_ngn' => 220000,
                'ltv_tier' => 'Gold Member',
                'loyalty_points' => 1750,
                'engagement_rate' => '88%',
                'interests' => ['Tech & AI', 'Business Networking'],
                'last_checkin' => '2026-07-28 14:15:00',
            ],
            [
                'id' => 'ATT-903',
                'name' => 'David Kwame',
                'email' => 'david.k@accraevents.gh',
                'phone' => '+233 24 555 7890',
                'location' => 'Accra, Ghana',
                'events_attended' => 4,
                'total_spent_ngn' => 195000,
                'ltv_tier' => 'Silver Member',
                'loyalty_points' => 1200,
                'engagement_rate' => '82%',
                'interests' => ['Concerts', 'Festivals'],
                'last_checkin' => '2026-07-15 20:30:00',
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'profiles' => $profiles,
                'summary' => [
                    'total_crm_contacts' => 12480,
                    'average_ltv_ngn' => 184500,
                    'active_loyalty_members' => 3820,
                    'total_points_issued' => 482000,
                ]
            ]
        ]);
    }

    /**
     * Create Loyalty Reward & Discount
     */
    public function createReward(Request $request)
    {
        $request->validate([
            'reward_name' => 'required|string',
            'points_cost' => 'required|integer|min:10',
            'discount_percent' => 'required|integer|min:1|max:100',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Loyalty Reward rule created successfully!',
            'data' => [
                'id' => 'REW-' . rand(100, 999),
                'reward_name' => $request->reward_name,
                'points_cost' => $request->points_cost,
                'discount_percent' => $request->discount_percent,
                'created_at' => now()->toIso8601String(),
            ]
        ]);
    }
}
