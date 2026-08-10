<?php

use App\Http\Controllers\Api\V1\Attendee\AttendeeController;
use App\Http\Controllers\Api\V1\Attendee\CommunityController;
use App\Http\Controllers\Api\V1\Attendee\DirectMessageController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\KycController;
use App\Http\Controllers\Api\V1\MarketplaceController;
use App\Http\Controllers\Api\V1\MediaUploadController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\Organizer\WebsiteBuilderController;
use App\Http\Controllers\Api\V1\OrganizerWorkspaceController;
use App\Http\Controllers\Api\V1\PlatformAdminController;
use App\Http\Controllers\Api\V1\WalletController;
use App\Http\Middleware\RequireKycApproved;
use App\Http\Middleware\RequireOrganizerPro;
use App\Http\Middleware\RequireSuperAdmin;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| GETVNT Platform Clean Architecture API (v1)
| Single Source of Truth for Web Applications
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ─── 1. AUTHENTICATION & IDENTITY ENGINE ─────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'registerMarketplace']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
        Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
        Route::post('/verify-phone', [AuthController::class, 'verifyPhone']);

        Route::get('/google', [AuthController::class, 'googleRedirect']);
        Route::get('/google/callback', [AuthController::class, 'googleCallback']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/change-password', [AuthController::class, 'changePassword']);
            Route::delete('/account', [AuthController::class, 'deleteAccount']);
        });
    });

    // ─── 2. ONBOARDING & VERIFICATION (KYC) ──────────────────────────────────
    Route::prefix('kyc')->middleware('auth:sanctum')->group(function () {
        Route::post('/submit', [KycController::class, 'submit']);
        Route::get('/status', [KycController::class, 'status']);
    });

    // ─── 3. ATTENDEE EXPERIENCE ──────────────────────────────────────────────
    Route::prefix('attendee')->middleware('auth:sanctum')->group(function () {
        // Home & Realtime Counters
        Route::get('/home', [AttendeeController::class, 'home']);
        Route::get('/counters', [AttendeeController::class, 'counters']);

        // Tickets & Passes
        Route::get('/tickets', [AttendeeController::class, 'tickets']);
        Route::get('/tickets/{id}/receipt', [AttendeeController::class, 'ticketReceipt']);

        // Saved Wishlist & Organizer Follow
        Route::get('/wishlist', [AttendeeController::class, 'wishlist']);
        Route::post('/wishlist', [AttendeeController::class, 'toggleWishlist']);
        Route::post('/organizers/{organizerId}/follow', [AttendeeController::class, 'followOrganizer']);

        // Community Feed & Discussions
        Route::get('/community/feed', [CommunityController::class, 'feed']);
        Route::post('/community/posts', [CommunityController::class, 'createPost']);
        Route::post('/community/posts/{id}/like', [CommunityController::class, 'toggleLike']);
        Route::get('/community/posts/{id}/comments', [CommunityController::class, 'comments']);
        Route::post('/community/posts/{id}/comments', [CommunityController::class, 'addComment']);
        Route::get('/community', [AttendeeController::class, 'community']);
        Route::post('/community', [AttendeeController::class, 'postMessage']);

        // Direct Messenger
        Route::get('/messages/conversations', [DirectMessageController::class, 'conversations']);
        Route::get('/messages/conversations/{id}', [DirectMessageController::class, 'messages']);
        Route::post('/messages/send', [DirectMessageController::class, 'sendMessage']);

        // Notification Center
        Route::get('/notifications', [AttendeeController::class, 'notifications']);
        Route::post('/notifications/{id}/read', [AttendeeController::class, 'markNotificationRead']);
        Route::post('/notifications/read-all', [AttendeeController::class, 'markAllNotificationsRead']);
        Route::delete('/notifications/{id}', [AttendeeController::class, 'deleteNotification']);

        // Data Export
        Route::get('/export-data', [AttendeeController::class, 'exportData']);
    });

    // ─── 4. ORGANIZER WORKSPACE (Role: Trusted Organizer) ────────────────────
    Route::prefix('workspace')->middleware(['auth:sanctum', RequireKycApproved::class])->group(function () {
        Route::get('/dashboard', [OrganizerWorkspaceController::class, 'dashboard']);
        Route::get('/events', [OrganizerWorkspaceController::class, 'listEvents']);
        Route::post('/events', [OrganizerWorkspaceController::class, 'createEvent']);
        Route::get('/orders', [OrganizerWorkspaceController::class, 'listOrders']);

        // Double-Entry Wallet OS & Payouts
        Route::get('/wallet', [WalletController::class, 'getWallet']);
        Route::get('/wallet/transactions', [WalletController::class, 'getTransactions']);
        Route::post('/payouts/request', [WalletController::class, 'requestPayout']);

        // AI Assistant & Door QR scanner
        Route::post('/ai/generate', [OrganizerWorkspaceController::class, 'generateAi']);
        Route::post('/qr/verify', [OrganizerWorkspaceController::class, 'verifyQr']);

        // Organizer Pro / Enterprise Website Builder
        Route::prefix('website')->middleware(RequireOrganizerPro::class)->group(function () {
            Route::get('/', [WebsiteBuilderController::class, 'show']);
            Route::put('/', [WebsiteBuilderController::class, 'update']);
        });
    });

    // ─── 5. SUPER ADMIN CONTROL CENTER (Role: Super Admin) ───────────────────
    Route::prefix('admin')->middleware(['auth:sanctum', RequireSuperAdmin::class])->group(function () {
        // Section 1: Overview
        Route::get('/overview', [PlatformAdminController::class, 'overview']);
        Route::get('/stats', [PlatformAdminController::class, 'overview']);

        // Section 2 & 3: User & Organizer Control Room
        Route::get('/users', [PlatformAdminController::class, 'users']);
        Route::post('/users/{id}/impersonate', [PlatformAdminController::class, 'impersonateUser']);
        Route::delete('/users/{id}', [PlatformAdminController::class, 'deleteUser']);
        Route::post('/users/{id}/role', [PlatformAdminController::class, 'updateUserRole']);
        Route::post('/users/{id}/plan', [PlatformAdminController::class, 'updateUserPlan']);
        Route::post('/users/{id}/verification', [PlatformAdminController::class, 'updateUserVerification']);
        Route::get('/organizers', [PlatformAdminController::class, 'organizers']);
        Route::post('/organizers/provision', [PlatformAdminController::class, 'provisionOrganizer']);
        Route::post('/organizers/{id}/blue-tick', [PlatformAdminController::class, 'toggleBlueTick']);
        Route::post('/organizers/{id}/wallet-adjust', [PlatformAdminController::class, 'organizerWalletAdjust']);

        // Section 4 & 5: Verifications & Event Control
        Route::get('/verifications', [PlatformAdminController::class, 'verifications']);
        Route::post('/verifications/{id}/approve', [PlatformAdminController::class, 'approveVerification']);
        Route::post('/verifications/{id}/reject', [PlatformAdminController::class, 'rejectVerification']);
        Route::get('/events', [PlatformAdminController::class, 'events']);
        Route::post('/events/{id}/feature', [PlatformAdminController::class, 'featureEvent']);
        Route::delete('/events/{id}', [PlatformAdminController::class, 'deleteEvent']);

        // Section 6 & 8: Finance & Fee Rules
        Route::get('/finance', [PlatformAdminController::class, 'finance']);
        Route::get('/fee-rules', [PlatformAdminController::class, 'feeRules']);
        Route::put('/fee-rules', [PlatformAdminController::class, 'updateFeeRules']);

        // Section 7: Payment Gateways Configuration, Webhooks & Refund Center
        Route::get('/payment-gateways', [PlatformAdminController::class, 'paymentConfigs']);
        Route::get('/gateways', [PlatformAdminController::class, 'paymentConfigs']);
        Route::put('/payment-gateways/{id}', [PlatformAdminController::class, 'updatePaymentConfig']);
        Route::put('/gateways/rules/{id}', [PlatformAdminController::class, 'updateFeeRules']);
        Route::get('/webhooks', [PlatformAdminController::class, 'webhooks']);
        Route::post('/webhooks/{id}/replay', [PlatformAdminController::class, 'replayWebhook']);
        Route::get('/refunds', [PlatformAdminController::class, 'refunds']);
        Route::post('/refunds/{id}/approve', [PlatformAdminController::class, 'approveRefund']);
        Route::post('/refunds/{id}/reject', [PlatformAdminController::class, 'rejectRefund']);

        // Section 9: Double-Entry Ledger
        Route::get('/ledger', [PlatformAdminController::class, 'ledger']);

        // Section 10: Payout Center
        Route::get('/payouts', [PlatformAdminController::class, 'payouts']);
        Route::post('/payouts/{id}/disburse', [PlatformAdminController::class, 'disbursePayout']);

        // Section 12 & 13: CMS & Website Builder Control
        Route::get('/cms', [PlatformAdminController::class, 'cmsSections']);
        Route::put('/cms/{id}', [PlatformAdminController::class, 'updateCmsSection']);
        Route::get('/websites', [PlatformAdminController::class, 'websites']);

        // Section 14: AI Fleet Control Center
        Route::get('/ai-providers', [PlatformAdminController::class, 'aiProviders']);
        Route::put('/ai-providers/{id}', [PlatformAdminController::class, 'updateAiProvider']);
        Route::get('/ai/fleet', [PlatformAdminController::class, 'aiFleet']);
        Route::put('/ai/feature-models/{id}', [PlatformAdminController::class, 'updateAiFeatureModel']);
        Route::post('/ai/prompts', [PlatformAdminController::class, 'createAiPrompt']);
        Route::put('/ai/prompts/{id}', [PlatformAdminController::class, 'updateAiPrompt']);
        Route::post('/ai/test-connection', [PlatformAdminController::class, 'testAiConnection']);

        // Section 15: Broadcast Notifications
        Route::get('/broadcasts', [PlatformAdminController::class, 'broadcasts']);
        Route::post('/broadcasts', [PlatformAdminController::class, 'createBroadcast']);

        // Section 16 & 17: System Settings & Audit Logs
        Route::get('/system-settings', [PlatformAdminController::class, 'systemSettings']);
        Route::put('/system-settings', [PlatformAdminController::class, 'updateSystemSetting']);
        Route::get('/audit-logs', [PlatformAdminController::class, 'auditLogs']);

        // Section 11: Subscriptions
        Route::put('/subscriptions/{plan}', [PlatformAdminController::class, 'updateSubscriptionPlan']);

        // Section 18: Security Control
        Route::get('/security/sessions', [PlatformAdminController::class, 'activeSessions']);
        Route::delete('/security/sessions/{id}', [PlatformAdminController::class, 'revokeSession']);
        Route::get('/security/suspicious-logins', [PlatformAdminController::class, 'suspiciousLogins']);

        // Section 19: Reports Export
        Route::get('/reports/{type}', [PlatformAdminController::class, 'exportReport']);

        // Section 19 & 20: Developer Health
        Route::get('/developer-health', [PlatformAdminController::class, 'developerHealth']);
        Route::post('/developer-health/flush-cache', [PlatformAdminController::class, 'flushCache']);

        // Exit Impersonation
        Route::post('/exit-impersonation', [PlatformAdminController::class, 'exitImpersonation']);
    });

    // ─── 6. MEDIA UPLOAD & STORAGE ───────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/media/upload', [MediaUploadController::class, 'upload']);
    });

    // ─── 7. PUBLIC MARKETPLACE & CHECKOUT ────────────────────────────────────
    Route::prefix('marketplace')->group(function () {
        Route::get('/events', [MarketplaceController::class, 'events']);
        Route::get('/categories', [MarketplaceController::class, 'categories']);
        Route::get('/cities', [MarketplaceController::class, 'cities']);
    });

    Route::post('/orders/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders/lookup', [OrderController::class, 'lookup']);
});
