<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\MarketplaceController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\OrganizerWorkspaceController;
use App\Http\Controllers\Api\V1\PlatformAdminController;
use App\Http\Controllers\Api\V1\SubscriptionController;
use App\Http\Controllers\Api\V1\OnboardingController;
use App\Http\Controllers\Api\V1\MediaUploadController;
use App\Http\Controllers\Api\V1\EnterpriseAiController;
use App\Http\Controllers\Api\V1\QrStudioController;
use App\Http\Controllers\Api\V1\CrmLoyaltyController;
use App\Http\Controllers\Api\V1\SuperAdmin\IntegrationsController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\BrandController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| GETVNT Platform Core REST API (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ─── GLOBAL BRAND REGISTRY (Single Source of Truth) ───────────────────
    Route::get('/brand', [BrandController::class, 'getBrand']);

    // ─── CMS Endpoints (Public) ─────────────────────────────────────────────
    Route::get('/cms/navigation', [BrandController::class, 'getNavigation']);
    Route::get('/cms/footer',     [BrandController::class, 'getFooter']);

    // Public News & Entertainment Stream
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/featured', [NewsController::class, 'featured']);
    Route::get('/news/trending', [NewsController::class, 'trending']);
    Route::get('/news/article/{slug}', [NewsController::class, 'show']);
    Route::post('/news/article/{id}/like', [NewsController::class, 'like']);
    Route::post('/news/article/{id}/share', [NewsController::class, 'share']);
    Route::post('/news/article/{id}/comments', [NewsController::class, 'postComment']);

    // Public Payment Gateways (for Checkout)
    Route::get('/payment-gateways', [IntegrationsController::class, 'getPublicPaymentGateways']);

    // Admin News Governance, Pinning & Manual Article Creation
    Route::get('/admin/news/sources', [NewsController::class, 'getSources']);
    Route::post('/admin/news/sources', [NewsController::class, 'saveSource']);
    Route::post('/admin/news/fetch-sync', [NewsController::class, 'syncFeeds']);
    Route::get('/admin/news/articles', [NewsController::class, 'getArticles']);
    Route::post('/admin/news/articles', [NewsController::class, 'saveArticle']);
    Route::post('/admin/news/articles/{id}/toggle-featured', [NewsController::class, 'toggleFeatured']);
    Route::delete('/admin/news/articles/{id}', [NewsController::class, 'deleteArticle']);


    // Media Upload API (Public / Authenticated)
    Route::post('/media/upload', [MediaUploadController::class, 'upload']);

    // Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register/marketplace', [AuthController::class, 'registerMarketplace']);
        Route::post('/register/organizer', [AuthController::class, 'registerOrganizer']);
        Route::post('/register', [AuthController::class, 'registerMarketplace']); // Fallback
        Route::post('/login', [AuthController::class, 'login']);

        // Social OAuth Routes
        Route::get('/google', [AuthController::class, 'googleRedirect']);
        Route::get('/google/callback', [AuthController::class, 'googleCallback']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/switch-organization', [AuthController::class, 'switchOrganization']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/change-password', [AuthController::class, 'changePassword']);
        });
    });

    // Subscriptions API
    Route::prefix('subscriptions')->group(function () {
        Route::get('/plans', [SubscriptionController::class, 'indexPlans']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/current', [SubscriptionController::class, 'currentSubscription']);
            Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
            Route::get('/invoices', [SubscriptionController::class, 'invoices']);
        });
    });

    // Onboarding Wizard API
    Route::prefix('onboarding')->middleware('auth:sanctum')->group(function () {
        Route::get('/status', [OnboardingController::class, 'status']);
        Route::post('/step', [OnboardingController::class, 'saveStep']);
    });

    // 1. PUBLIC MARKETPLACE (getvnt.com)
    Route::prefix('marketplace')->group(function () {
        Route::get('/events', [MarketplaceController::class, 'events']);
        Route::get('/events/{slug}', [MarketplaceController::class, 'showEvent']);
        Route::get('/categories', [MarketplaceController::class, 'categories']);
        Route::get('/cities', [MarketplaceController::class, 'cities']);
        Route::get('/branding', [MarketplaceController::class, 'publicBrandingSettings']);
    });

    // Order & Ticket Checkout API
    Route::post('/orders/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders/lookup', [OrderController::class, 'lookup']);

    // 2. ORGANIZER WORKSPACE (app.getvnt.com)
    Route::prefix('workspace')->middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard', [OrganizerWorkspaceController::class, 'dashboard']);
        Route::post('/events', [OrganizerWorkspaceController::class, 'createEvent']);
        Route::put('/organization', [OrganizerWorkspaceController::class, 'updateOrganization']);

        // AI Assistant Engine
        Route::post('/ai/generate', [EnterpriseAiController::class, 'generate']);
        Route::post('/ai/top-up', [EnterpriseAiController::class, 'topUp']);

        // Branded QR Code Studio
        Route::post('/qr/generate', [QrStudioController::class, 'generateQr']);

        // CRM & Attendee Loyalty
        Route::get('/crm/profiles', [CrmLoyaltyController::class, 'getCrmProfiles']);
        Route::post('/crm/rewards', [CrmLoyaltyController::class, 'createReward']);
    });

    // 3. PLATFORM CONTROL CENTER (admin.getvnt.com)
    Route::prefix('admin')->group(function () {
        // ─── Brand Registry Admin API ────────────────────────────────────────
        Route::put('/brand', [BrandController::class, 'updateBrand']);
        Route::post('/brand/upload-logo', [BrandController::class, 'uploadLogo']);

        Route::get('/stats', [PlatformAdminController::class, 'stats']);
        Route::get('/tenants', [PlatformAdminController::class, 'tenants']);
        Route::post('/tenants/{id}/impersonate', [PlatformAdminController::class, 'impersonateTenant']);
        Route::get('/users', [PlatformAdminController::class, 'users']);
        Route::post('/users/{id}/impersonate', [PlatformAdminController::class, 'impersonateUser']);
        Route::post('/users/{id}/toggle-lock', [PlatformAdminController::class, 'toggleUserLock']);
        Route::post('/users/{id}/force-logout', [PlatformAdminController::class, 'forceLogoutUser']);

        // Subscription Plans Builder
        Route::get('/plans', [PlatformAdminController::class, 'plans']);
        Route::post('/plans', [PlatformAdminController::class, 'createPlan']);
        Route::put('/plans/{id}', [PlatformAdminController::class, 'updatePlan']);
        Route::delete('/plans/{id}', [PlatformAdminController::class, 'deletePlan']);
        Route::get('/subscriptions', [PlatformAdminController::class, 'subscriptions']);

        // Auth Providers Governance
        Route::get('/auth-providers', [\App\Http\Controllers\Api\V1\SuperAdmin\AuthProvidersController::class, 'index']);
        Route::put('/auth-providers/{id}', [\App\Http\Controllers\Api\V1\SuperAdmin\AuthProvidersController::class, 'update']);
        Route::post('/auth-providers/{id}/test', [\App\Http\Controllers\Api\V1\SuperAdmin\AuthProvidersController::class, 'test']);

        // CMS Governance Admin
        Route::get('/cms/sections', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'getLandingSections']);
        Route::put('/cms/sections/{id}', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'updateLandingSection']);
        Route::post('/cms/sections/reorder', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'reorderLandingSections']);
        Route::put('/cms/pages/{slug}', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'updatePage']);

        // Platform Updates
        Route::get('/platform/updates', [\App\Http\Controllers\Api\V1\SuperAdmin\PlatformUpdateController::class, 'index']);
        Route::post('/platform/updates/upload', [\App\Http\Controllers\Api\V1\SuperAdmin\PlatformUpdateController::class, 'uploadAndUpdate']);

        // Integrations Center API Submodule
        Route::prefix('integrations')->group(function () {
            Route::get('/dashboard', [IntegrationsController::class, 'dashboard']);

            // AI Providers & Routing
            Route::get('/ai-providers', [IntegrationsController::class, 'getAiProviders']);
            Route::post('/ai-providers', [IntegrationsController::class, 'createAiProvider']);
            Route::put('/ai-providers/{id}', [IntegrationsController::class, 'updateAiProvider']);
            Route::delete('/ai-providers/{id}', [IntegrationsController::class, 'deleteAiProvider']);
            Route::post('/ai-providers/{id}/test', [IntegrationsController::class, 'testAiProvider']);
            Route::post('/ai-providers/{id}/rotate', [IntegrationsController::class, 'rotateAiKey']);
            Route::post('/ai-providers/{id}/reveal', [IntegrationsController::class, 'revealAiKey']);
            Route::post('/ai-assistance/generate', [IntegrationsController::class, 'generateAiAssistance']);

            Route::get('/ai-routing', [IntegrationsController::class, 'getAiRoutes']);
            Route::put('/ai-routing/{id}', [IntegrationsController::class, 'updateAiRoute']);

            // Payment Gateways
            Route::get('/payment-gateways', [IntegrationsController::class, 'getPaymentGateways']);
            Route::post('/payment-gateways', [IntegrationsController::class, 'createPaymentGateway']);
            Route::put('/payment-gateways/{id}', [IntegrationsController::class, 'updatePaymentGateway']);
            Route::delete('/payment-gateways/{id}', [IntegrationsController::class, 'deletePaymentGateway']);
            Route::post('/payment-gateways/{id}/test', [IntegrationsController::class, 'testPaymentGateway']);

            // Commission Rules
            Route::get('/commission-rules', [IntegrationsController::class, 'getCommissionRules']);
            Route::post('/commission-rules', [IntegrationsController::class, 'createCommissionRule']);
            Route::put('/commission-rules/{id}', [IntegrationsController::class, 'updateCommissionRule']);
            Route::delete('/commission-rules/{id}', [IntegrationsController::class, 'deleteCommissionRule']);

            // API Key Vault
            Route::get('/api-vault', [IntegrationsController::class, 'getApiVault']);
            Route::post('/api-vault', [IntegrationsController::class, 'createApiVaultKey']);
            Route::post('/api-vault/{id}/reveal', [IntegrationsController::class, 'revealVaultKey']);
            Route::post('/api-vault/{id}/rotate', [IntegrationsController::class, 'rotateVaultKey']);
            Route::delete('/api-vault/{id}', [IntegrationsController::class, 'deleteVaultKey']);

            // Communication, Storage, Analytics
            Route::get('/communication', [IntegrationsController::class, 'getCommunicationServices']);
            Route::put('/communication/{id}', [IntegrationsController::class, 'updateCommunicationService']);
            Route::post('/communication/{id}/test', [IntegrationsController::class, 'testCommunicationService']);

            Route::get('/storage', [IntegrationsController::class, 'getStorageProviders']);
            Route::put('/storage/{id}', [IntegrationsController::class, 'updateStorageProvider']);

            Route::get('/analytics', [IntegrationsController::class, 'getAnalyticsServices']);
            Route::put('/analytics/{id}', [IntegrationsController::class, 'updateAnalyticsService']);

            // Webhooks
            Route::get('/webhooks', [IntegrationsController::class, 'getWebhooks']);
            Route::post('/webhooks', [IntegrationsController::class, 'createWebhook']);
            Route::post('/webhooks/{id}/test', [IntegrationsController::class, 'testWebhook']);

            // Marketplace
            Route::get('/marketplace', [IntegrationsController::class, 'getMarketplace']);
            Route::post('/marketplace/{id}/toggle', [IntegrationsController::class, 'toggleMarketplaceItem']);

            // Usage & Audits & System Settings
            Route::get('/usage-analytics', [IntegrationsController::class, 'getUsageAnalytics']);
            Route::get('/audit-logs', [IntegrationsController::class, 'getAuditLogs']);
            Route::get('/system-settings', [IntegrationsController::class, 'getSystemSettings']);
            Route::post('/system-settings', [IntegrationsController::class, 'updateSystemSettings']);

            // Auth Providers Governance
            Route::get('/auth-providers', [\App\Http\Controllers\Api\V1\SuperAdmin\AuthProvidersController::class, 'index']);
            Route::put('/auth-providers/{id}', [\App\Http\Controllers\Api\V1\SuperAdmin\AuthProvidersController::class, 'update']);
            Route::post('/auth-providers/{id}/test', [\App\Http\Controllers\Api\V1\SuperAdmin\AuthProvidersController::class, 'test']);

            // CMS Governance
            Route::put('/cms/sections/{id}', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'updateLandingSection']);
            Route::post('/cms/sections/reorder', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'reorderLandingSections']);
            Route::put('/cms/pages/{slug}', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'updatePage']);

            // Platform Updates
            Route::get('/platform/updates', [\App\Http\Controllers\Api\V1\SuperAdmin\PlatformUpdateController::class, 'index']);
            Route::post('/platform/updates/upload', [\App\Http\Controllers\Api\V1\SuperAdmin\PlatformUpdateController::class, 'uploadAndUpdate']);
        });
    });

    // Public CMS Routes
    Route::get('/cms/landing', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'getLandingSections']);
    Route::get('/cms/pages', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'getPages']);
    Route::get('/cms/pages/{slug}', [\App\Http\Controllers\Api\V1\SuperAdmin\CmsGovernanceController::class, 'getPage']);
});
