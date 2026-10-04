<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetMail;
use App\Models\EmailVerificationToken;
use App\Models\PhoneOtp;
use App\Models\User;
use App\Services\Sms\SmsServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected SmsServiceInterface $smsService;

    public function __construct(SmsServiceInterface $smsService)
    {
        $this->smsService = $smsService;
    }

    protected function getTokenAbilities(User $user): array
    {
        if ($user->isSuperAdmin()) {
            return ['*'];
        }
        if (in_array($user->role, ['organizer_pro', 'trusted_organizer', 'enterprise'])) {
            return ['organizer:access', 'events:manage'];
        }
        return ['attendee:access'];
    }

    public function registerMarketplace(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $name = $request->name
            ?? trim(($request->first_name ?? '') . ' ' . ($request->last_name ?? ''))
            ?: $request->username
            ?: explode('@', $request->email)[0];

        $user = User::create([
            'id'                  => (string) Str::uuid(),
            'name'                => $name,
            'email'               => strtolower($request->email),
            'password'            => Hash::make($request->password),
            'role'                => 'attendee',
            'verification_status' => 'unverified',
            'subscription_plan'   => 'starter',
            'verified_badge'      => false,
            'is_active'           => true,
        ]);

        $token = $user->createToken('getvnt_auth_token', $this->getTokenAbilities($user))->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'data'    => [
                'token'               => $token,
                'user'                => $user,
                'role'                => $user->role,
                'verification_status' => $user->verification_status,
                'subscription_plan'   => $user->subscription_plan,
            ],
            'message' => 'Account created successfully. Welcome to GETVNT!',
        ], 201);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', strtolower($request->email))->first();

        if (!$user) {
            return response()->json([
                'success' => true,
                'message' => 'If an account exists for this email, a reset link has been sent.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->where('email', $user->email)->delete();
        DB::table('password_reset_tokens')->insert([
            'email'      => $user->email,
            'token'      => Hash::make($token),
            'created_at' => now(),
        ]);

        $resetUrl = env('WORKSPACE_URL', 'https://app.getvnt.com') . "/reset-password?token={$token}&email=" . urlencode($user->email);
        Mail::to($user->email)->queue(new PasswordResetMail($token, $resetUrl));

        return response()->json([
            'success' => true,
            'message' => 'If an account exists for this email, a reset link has been sent.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'                 => 'required|email',
            'token'                 => 'required|string',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', strtolower($request->email))
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token.',
            ], 422);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', strtolower($request->email))->delete();
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token.',
            ], 422);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired reset token.',
            ], 422);
        }

        $user = User::where('email', strtolower($request->email))->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $user->update(['password' => Hash::make($request->password)]);
        DB::table('password_reset_tokens')->where('email', strtolower($request->email))->delete();

        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully. Please sign in with your new password.',
        ]);
    }

    public function sendEmailVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', strtolower($request->email))->first();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $plainToken = Str::random(32);
        EmailVerificationToken::create([
            'email'      => strtolower($user->email),
            'token'      => Hash::make($plainToken),
            'attempts'   => 0,
            'expires_at' => now()->addHours(24),
        ]);

        return response()->json([
            'success'          => true,
            'verification_code' => $plainToken, // Returned for testing / client app email simulation
            'message'          => 'Email verification link sent.',
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate(['token' => 'required|string', 'email' => 'required|email']);

        $user = User::where('email', strtolower($request->email))->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        $record = EmailVerificationToken::where('email', strtolower($request->email))
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$record) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired verification token.'], 422);
        }

        $record->increment('attempts');
        if ($record->attempts > 5) {
            $record->delete();
            return response()->json(['success' => false, 'message' => 'Maximum verification attempts exceeded.'], 422);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json(['success' => false, 'message' => 'Invalid verification token.'], 422);
        }

        $user->forceFill(['email_verified_at' => now()])->save();
        $record->delete();

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ]);
    }

    public function sendPhoneOtp(Request $request)
    {
        $request->validate(['phone' => 'required|string']);
        $phone = $request->phone;

        $plainOtp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        PhoneOtp::create([
            'phone'      => $phone,
            'otp'        => Hash::make($plainOtp),
            'attempts'   => 0,
            'expires_at' => now()->addMinutes(10),
        ]);

        $this->smsService->sendSms($phone, "Your GETVNT verification OTP code is: {$plainOtp}");

        return response()->json([
            'success' => true,
            'message' => 'Phone OTP code sent successfully.',
        ]);
    }

    public function verifyPhone(Request $request)
    {
        $request->validate(['otp' => 'required|string', 'phone' => 'required|string']);

        $user = $request->user() ?: User::where('phone', $request->phone)->first();

        $record = PhoneOtp::where('phone', $request->phone)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$record) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired OTP code.'], 422);
        }

        $record->increment('attempts');
        if ($record->attempts > 5) {
            $record->delete();
            return response()->json(['success' => false, 'message' => 'Maximum OTP verification attempts exceeded.'], 422);
        }

        if (!Hash::check($request->otp, $record->otp)) {
            return response()->json(['success' => false, 'message' => 'Invalid OTP code.'], 422);
        }

        if ($user) {
            $user->forceFill(['phone_verified_at' => now()])->save();
        }
        $record->delete();

        return response()->json([
            'success' => true,
            'message' => 'Phone number verified successfully.',
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $user->createToken('getvnt_auth_token', $this->getTokenAbilities($user))->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'data'    => [
                'token'                => $token,
                'user'                 => $user->load('tenant'),
                'role'                 => $user->role,
                'verification_status'  => $user->verification_status,
                'subscription_plan'    => $user->subscription_plan,
                'is_trusted_organizer' => $user->isTrustedOrganizer(),
                'is_super_admin'        => $user->isSuperAdmin(),
            ],
            'message' => 'Login successful.',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('tenant');

        return response()->json([
            'success' => true,
            'data'    => [
                'user'                 => $user,
                'role'                 => $user->role,
                'verification_status'  => $user->verification_status,
                'subscription_plan'    => $user->subscription_plan,
                'verified_badge'       => (bool) $user->verified_badge,
                'is_trusted_organizer' => $user->isTrustedOrganizer(),
                'is_super_admin'        => $user->isSuperAdmin(),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'       => 'sometimes|string|max:255',
            'phone'      => 'nullable|string',
            'bio'        => 'nullable|string',
            'country'    => 'nullable|string',
            'language'   => 'nullable|string',
            'timezone'   => 'nullable|string',
            'avatar_url' => 'nullable|string',
        ]);

        $allowedData = $request->only([
            'name', 'phone', 'bio', 'country', 'language', 'timezone', 'avatar_url'
        ]);

        $user->update($allowedData);

        return response()->json([
            'success' => true,
            'data'    => $user,
            'message' => 'Profile updated successfully.',
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        $currentTokenId = $user->currentAccessToken()?->id;
        if ($currentTokenId) {
            $user->tokens()->where('id', '!=', $currentTokenId)->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Incorrect password.',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully.',
        ]);
    }

    private function getGoogleCredential(string $settingKey, string $configKey, string $envKey, ?string $default = null): ?string
    {
        try {
            $setting = \App\Models\SystemSetting::where('key', $settingKey)->value('value');
            if ($setting !== null) {
                $val = trim((string)$setting);
                if ($val !== '' && !in_array(strtolower($val), ['null', 'not_configured', 'none', 'false', '0'], true)) {
                    return $val;
                }
            }
        } catch (\Throwable $e) {
        }

        $configVal = config($configKey);
        if ($configVal !== null) {
            $val = trim((string)$configVal);
            if ($val !== '' && !in_array(strtolower($val), ['null', 'not_configured', 'none', 'false', '0'], true)) {
                return $val;
            }
        }

        $envVal = env($envKey);
        if ($envVal !== null) {
            $val = trim((string)$envVal);
            if ($val !== '' && !in_array(strtolower($val), ['null', 'not_configured', 'none', 'false', '0'], true)) {
                return $val;
            }
        }

        return $default;
    }

    public function googleRedirect(Request $request)
    {
        $clientId     = $this->getGoogleCredential('google_client_id', 'services.google.client_id', 'GOOGLE_CLIENT_ID');
        $clientSecret = $this->getGoogleCredential('google_client_secret', 'services.google.client_secret', 'GOOGLE_CLIENT_SECRET');
        $redirectUri  = $this->getGoogleCredential('google_redirect_uri', 'services.google.redirect', 'GOOGLE_REDIRECT_URI', 'https://api.getvnt.com/api/v1/auth/google/callback');

        if (!$clientId || !$clientSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Google OAuth client credentials have not been configured in Super Admin System Settings or server environment.',
            ], 400);
        }

        $requestedRedirect = $request->get('redirect_to', 'workspace');
        $allowList = ['marketplace', 'workspace', 'admin'];
        $redirectTo = in_array($requestedRedirect, $allowList, true) ? $requestedRedirect : 'workspace';

        $stateKey = Str::random(32);
        Cache::put("google_oauth_state:{$stateKey}", [
            'redirect_to' => $redirectTo,
            'ip'          => $request->ip(),
        ], 300);

        $targetUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
            'client_id'     => $clientId,
            'redirect_uri'  => $redirectUri,
            'response_type' => 'code',
            'scope'         => 'openid profile email',
            'access_type'   => 'offline',
            'prompt'        => 'consent',
            'state'         => $stateKey,
        ]);

        return response()->json([
            'success' => true,
            'url'     => $targetUrl,
            'message' => 'Google OAuth authorization URL generated.',
        ]);
    }

    public function googleCallback(Request $request)
    {
        $code  = $request->get('code');
        $state = $request->get('state', '');

        $stateData = Cache::pull("google_oauth_state:{$state}");
        if (!$stateData) {
            $frontendBase = env('WORKSPACE_URL', 'https://app.getvnt.com');
            return redirect($frontendBase . '/?oauth_error=invalid_state');
        }

        $redirectTo = $stateData['redirect_to'] ?? 'workspace';
        $frontendUrls = [
            'marketplace' => env('MARKETPLACE_URL', 'https://getvnt.com'),
            'workspace'   => env('WORKSPACE_URL', 'https://app.getvnt.com'),
            'admin'       => env('ADMIN_URL', 'https://admin.getvnt.com'),
        ];
        $frontendBase = $frontendUrls[$redirectTo] ?? $frontendUrls['workspace'];

        if (!$code) {
            return redirect($frontendBase . '/?oauth_error=missing_code');
        }

        $clientId     = $this->getGoogleCredential('google_client_id', 'services.google.client_id', 'GOOGLE_CLIENT_ID');
        $clientSecret = $this->getGoogleCredential('google_client_secret', 'services.google.client_secret', 'GOOGLE_CLIENT_SECRET');
        $redirectUri  = $this->getGoogleCredential('google_redirect_uri', 'services.google.redirect', 'GOOGLE_REDIRECT_URI', 'https://api.getvnt.com/api/v1/auth/google/callback');

        try {
            $tokenResponse = Http::post('https://oauth2.googleapis.com/token', [
                'code'          => $code,
                'client_id'     => $clientId,
                'client_secret' => $clientSecret,
                'redirect_uri'  => $redirectUri,
                'grant_type'    => 'authorization_code',
            ]);

            if (!$tokenResponse->successful()) {
                return redirect($frontendBase . '/?oauth_error=token_exchange_failed');
            }

            $accessToken  = $tokenResponse->json('access_token');
            $userResponse = Http::withToken($accessToken)->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if (!$userResponse->successful()) {
                return redirect($frontendBase . '/?oauth_error=userinfo_failed');
            }

            $googleUser    = $userResponse->json();
            $emailVerified = $googleUser['email_verified'] ?? false;
            if (!$emailVerified) {
                return redirect($frontendBase . '/?oauth_error=unverified_google_email');
            }

            $email  = strtolower($googleUser['email'] ?? '');
            $name   = $googleUser['name'] ?? 'Google User';
            $avatar = $googleUser['picture'] ?? null;

            $wasRecentlyCreated = false;
            $user = User::where('email', $email)->first();
            if (!$user) {
                $user = User::create([
                    'id'                => (string) Str::uuid(),
                    'name'              => $name,
                    'email'             => $email,
                    'password'          => Hash::make(Str::random(24)),
                    'role'              => 'attendee',
                    'avatar_url'        => $avatar,
                    'email_verified_at' => now(),
                    'is_active'         => true,
                ]);
                $wasRecentlyCreated = true;
            }

            $exchangeCode = Str::random(40);
            Cache::put("google_exchange:{$exchangeCode}", [
                'user_id'     => $user->id,
                'was_created' => $wasRecentlyCreated,
            ], 60);

            return redirect($frontendBase . '/auth/google/callback?code=' . urlencode($exchangeCode) . '&is_new=' . ($wasRecentlyCreated ? '1' : '0'));

        } catch (\Throwable $e) {
            return redirect($frontendBase . '/?oauth_error=' . urlencode($e->getMessage()));
        }
    }

    public function googleExchange(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $data = Cache::pull("google_exchange:{$request->code}");
        if (!$data || !isset($data['user_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OAuth exchange code.',
            ], 422);
        }

        $user  = User::findOrFail($data['user_id']);
        $token = $user->createToken('google_oauth_token', $this->getTokenAbilities($user))->plainTextToken;

        return response()->json([
            'success' => true,
            'token'   => $token,
            'data'    => [
                'token'                => $token,
                'user'                 => $user->load('tenant'),
                'role'                 => $user->role,
                'verification_status'  => $user->verification_status,
                'subscription_plan'    => $user->subscription_plan,
                'is_trusted_organizer' => $user->isTrustedOrganizer(),
                'is_super_admin'        => $user->isSuperAdmin(),
                'is_new'               => $data['was_created'] ?? false,
            ],
            'message' => 'Google OAuth login successful.',
        ]);
    }
}
