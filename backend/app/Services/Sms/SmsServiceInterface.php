<?php

namespace App\Services\Sms;

interface SmsServiceInterface
{
    public function sendSms(string $to, string $message): bool;
}
