<?php

namespace App\Services\Sms;

use Illuminate\Support\Facades\Log;

class LogSmsDriver implements SmsServiceInterface
{
    public function sendSms(string $to, string $message): bool
    {
        Log::info("SMS Sent to {$to}: {$message}");
        return true;
    }
}
