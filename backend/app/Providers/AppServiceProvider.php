<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Services\Sms\SmsServiceInterface::class,
            \App\Services\Sms\LogSmsDriver::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth-sensitive', function (Request $request) {
            $email = strtolower((string) $request->input('email', ''));
            return Limit::perMinute(5)->by($request->ip() . '|' . $email);
        });

        RateLimiter::for('verify-token', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('ai-chat', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('orders-checkout', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        RateLimiter::for('orders-lookup', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        RateLimiter::for('media-upload', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });
    }
}
