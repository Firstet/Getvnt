<?php

namespace App\Services\Payments;

use App\Models\PaymentGatewayConfig;
use InvalidArgumentException;

class PaymentGatewayFactory
{
    public static function make(string $provider): PaymentGatewayInterface
    {
        $normalized = strtolower(trim($provider));

        return match ($normalized) {
            'paystack' => new PaystackGateway(),
            'flutterwave', 'flw' => new FlutterwaveGateway(),
            'stripe' => new StripeGateway(),
            default => throw new InvalidArgumentException("Unsupported payment gateway provider: {$provider}"),
        };
    }

    public static function getSecretForGateway(string $gateway, ?string $tenantId = null): string
    {
        $normalized = strtolower(trim($gateway));

        $configQuery = PaymentGatewayConfig::where('provider_name', $normalized)
            ->where('is_enabled', true);

        if ($tenantId) {
            $configQuery->where('tenant_id', $tenantId);
        }

        $config = $configQuery->first();
        if ($config && !empty($config->webhook_secret)) {
            return $config->webhook_secret;
        }
        if ($config && !empty($config->api_secret)) {
            return $config->api_secret;
        }

        if (app()->environment('testing')) {
            return match ($normalized) {
                'paystack' => 'sk_test_mock',
                'flutterwave', 'flw' => 'FLWSECK_TEST_mock',
                'stripe' => 'whsec_mock',
                default => 'secret_mock',
            };
        }

        // Fallback to environment variables
        return match ($normalized) {
            'paystack' => env('PAYSTACK_WEBHOOK_SECRET') ?: (env('PAYSTACK_SECRET_KEY') ?: 'sk_test_mock'),
            'flutterwave', 'flw' => env('FLUTTERWAVE_SECRET_HASH') ?: (env('FLUTTERWAVE_SECRET_KEY') ?: 'FLWSECK_TEST_mock'),
            'stripe' => env('STRIPE_WEBHOOK_SECRET') ?: (env('STRIPE_SECRET_KEY') ?: 'whsec_mock'),
            default => 'secret_mock',
        };
    }
}
