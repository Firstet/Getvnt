<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password</title>
</head>
<body style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px;">
    <div style="max-width: 600px; margin: 0 auto; background: #1e293b; padding: 24px; border-radius: 8px;">
        <h2 style="color: #6366f1;">GETVNT Password Reset</h2>
        <p>You requested a password reset for your GETVNT account.</p>
        <p>Click the link below to reset your password. This link is valid for 60 minutes.</p>
        <p style="margin: 24px 0;">
            <a href="{{ $resetUrl }}" style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Reset Password</a>
        </p>
        <p style="font-size: 12px; color: #94a3b8;">If you did not request this, please ignore this email.</p>
    </div>
</body>
</html>
