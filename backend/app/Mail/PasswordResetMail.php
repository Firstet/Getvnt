<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $token;
    public string $resetUrl;

    public function __construct(string $token, string $resetUrl)
    {
        $this->token = $token;
        $this->resetUrl = $resetUrl;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Your GETVNT Password',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.password-reset',
            with: [
                'token' => $this->token,
                'resetUrl' => $this->resetUrl,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
