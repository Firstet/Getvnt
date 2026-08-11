import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useAuth } from '../context/AuthContext';

interface SaaSAuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess?: (user: any) => void;
  onNavigateToOnboarding?: () => void;
}

export const SaaSAuthModal: React.FC<SaaSAuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
  onNavigateToOnboarding,
}) => {
  const { brand } = useBrand();
  const { login, registerMarketplace } = useAuth();

  const loginWithGoogle = () => {
    if (brand?.google_login_enabled === false) {
      setError('Google Sign-In is currently disabled by Super Admin.');
      return;
    }
    const isWorkspace = window.location.host.includes('app') || window.location.pathname.includes('workspace');
    const target = isWorkspace ? 'workspace' : 'marketplace';
    const clientIdParam = brand?.google_client_id ? `&client_id=${encodeURIComponent(brand.google_client_id)}` : '';
    window.location.href = `/api/v1/auth/google?redirect_to=${target}${clientIdParam}`;
  };

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>( initialMode);
  // Progressive Login Step: 1 = Email, 2 = Password
  const [loginStep, setLoginStep] = useState<1 | 2>(1);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password strength
  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0–4
  };
  const pwStrength = getPasswordStrength(password);
  const pwStrengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const pwStrengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'][pwStrength];

  if (!isOpen) return null;

  // ── Handlers ──
  const handleProgressiveEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError(null);
    setLoginStep(2);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter your email address first.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api/v1';
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await res.json();
      setForgotSent(true);
      setSuccessMsg(json.message || 'Reset instructions sent to your email.');
    } catch {
      setError('Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        if (onSuccess) onSuccess(res.data.user);
        onClose();
      } else {
        setError(res.message || 'Invalid email or password. Please try again.');
      }
    } catch {
      setError('Connection failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await registerMarketplace({
        name: fullName.trim(),
        email,
        password,
      });

      if (res.success) {
        if (onSuccess) onSuccess(res.data.user);
        onClose();
        if (onNavigateToOnboarding) onNavigateToOnboarding();
      } else {
        // Parse validation errors from Laravel
        if (res.errors) {
          const firstError = Object.values(res.errors as Record<string, string[]>)[0];
          setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
        } else {
          setError(res.message || 'Account creation failed. Please try again.');
        }
      }
    } catch {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111111',
          border: '1px solid #262626',
          borderRadius: '24px',
          maxWidth: '440px',
          width: '100%',
          padding: '36px 32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(37, 99, 235, 0.15)',
          position: 'relative',
          animation: 'saasModalEnter 0.25s ease-out',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#A3A3A3',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '20px',
              marginBottom: '12px',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
            }}
          >
            G
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.4px', marginBottom: '4px' }}>
            {mode === 'login' ? 'Welcome Back' : `Join ${brand?.platform_name || 'GETVNT'}`}
          </h2>
          <p style={{ color: '#737373', fontSize: '13.5px' }}>
            {mode === 'login' ? 'Sign in to access your account & tickets' : 'Create your free account to get started'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '12px 14px',
              borderRadius: '14px',
              fontSize: '13px',
              marginBottom: '20px',
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}
        {successMsg && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34D399',
              padding: '12px 14px',
              borderRadius: '14px',
              fontSize: '13px',
              marginBottom: '20px',
              lineHeight: 1.4,
            }}
          >
            {successMsg}
          </div>
        )}

        {/* ── MODE 1: PROGRESSIVE SIGN IN ── */}
        {mode === 'login' && (
          <div>
            {loginStep === 1 ? (
              <form onSubmit={handleProgressiveEmailContinue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Social Login Button */}
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    background: '#171717',
                    border: '1px solid #262626',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#262626' }} />
                  <span style={{ padding: '0 12px', fontSize: '11px', color: '#525252', fontWeight: 800 }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: '#262626' }} />
                </div>

                {/* Email Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      className="search-field"
                      style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', paddingLeft: '40px', color: '#FFF' }}
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail size={16} color="#737373" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  className="btn-cta"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    justifyContent: 'center',
                    boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
                    marginTop: '4px',
                  }}
                >
                  Continue <ArrowRight size={16} />
                </button>

              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button
                  type="button"
                  style={{ fontSize: '12.5px', color: '#737373', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setMode('forgot'); setError(null); setSuccessMsg(null); setForgotSent(false); }}
                >
                  Forgot Password?
                </button>
              </div>
              </form>
            ) : (
              /* Step 2: Password Screen */
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#E5E5E5', fontWeight: 700 }}>{email}</span>
                  <button
                    type="button"
                    onClick={() => setLoginStep(1)}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      required
                      className="search-field"
                      style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', paddingLeft: '40px', color: '#FFF' }}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock size={16} color="#737373" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    background: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    justifyContent: 'center',
                    boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
                    marginTop: '4px',
                  }}
                >
                  {loading ? 'Authenticating…' : 'Sign In'} <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => setLoginStep(1)}
                  style={{ background: 'none', border: 'none', color: '#737373', fontSize: '13px', cursor: 'pointer', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={14} /> Back to email
                </button>
              </form>
            )}

            {/* Switch to Register */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #262626', fontSize: '13.5px', color: '#737373' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
              style={{ background: 'none', border: 'none', color: '#60A5FA', fontWeight: 800, cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* ── MODE: FORGOT PASSWORD ── */}
      {mode === 'forgot' && (
        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {forgotSent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📬</div>
              <h3 style={{ color: '#FFFFFF', fontWeight: 800, marginBottom: '8px' }}>Check Your Inbox</h3>
              <p style={{ color: '#737373', fontSize: '13.5px', lineHeight: 1.5 }}>
                If <strong style={{ color: '#E5E5E5' }}>{email}</strong> is registered, you'll receive a reset link shortly.
              </p>
            </div>
          ) : (
            <>
              <p style={{ color: '#737373', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '4px' }}>
                Enter your registered email and we'll send you a password reset link.
              </p>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    className="search-field"
                    style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', paddingLeft: '40px', color: '#FFF' }}
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail size={16} color="#737373" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-cta"
                style={{
                  width: '100%', padding: '14px', borderRadius: '16px',
                  background: '#2563EB', color: '#FFFFFF', fontWeight: 800, fontSize: '14px',
                  justifyContent: 'center', boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)',
                }}
              >
                {loading ? 'Sending…' : 'Send Reset Link'} <ArrowRight size={16} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); setForgotSent(false); }}
            style={{ background: 'none', border: 'none', color: '#737373', fontSize: '13px', cursor: 'pointer', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </form>
      )}

        {/* ── MODE 2: MODAL SIGN UP (STEP 1: NO ORGANIZER INFO ASKED) ── */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Google Signup */}
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                background: '#171717',
                border: '1px solid #262626',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#262626' }} />
              <span style={{ padding: '0 12px', fontSize: '11px', color: '#525252', fontWeight: 800 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#262626' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  className="search-field"
                  style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', paddingLeft: '40px', color: '#FFF' }}
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <User size={16} color="#737373" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  className="search-field"
                  style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', paddingLeft: '40px', color: '#FFF' }}
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={16} color="#737373" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#A3A3A3', marginBottom: '6px', textTransform: 'uppercase' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="search-field"
                  style={{ background: '#0A0A0A', border: '1px solid #262626', borderRadius: '14px', paddingLeft: '40px', paddingRight: '44px', color: '#FFF' }}
                  placeholder="min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={16} color="#737373" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#737373', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password.length > 0 && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '4px', borderRadius: '4px', background: '#262626', overflow: 'hidden' }}>
                    <div style={{ width: `${(pwStrength / 4) * 100}%`, height: '100%', background: pwStrengthColor, borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: pwStrengthColor, minWidth: '36px' }}>{pwStrengthLabel}</span>
                </div>
              )}
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: '#A3A3A3', cursor: 'pointer', marginTop: '4px' }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ accentColor: '#2563EB', marginTop: '3px' }}
              />
              <span>
                I agree to the <a href="/terms" style={{ color: '#60A5FA', textDecoration: 'none' }}>Terms of Service</a> and <a href="/privacy" style={{ color: '#60A5FA', textDecoration: 'none' }}>Privacy Policy</a>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agreedTerms || !email || !password || !fullName}
              className="btn-cta"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                background: (agreedTerms && email && password && fullName) ? '#2563EB' : '#262626',
                color: (agreedTerms && email && password && fullName) ? '#FFFFFF' : '#737373',
                fontWeight: 800,
                fontSize: '14px',
                justifyContent: 'center',
                cursor: (agreedTerms && email && password && fullName) ? 'pointer' : 'not-allowed',
                boxShadow: (agreedTerms && email && password && fullName) ? '0 4px 18px rgba(37, 99, 235, 0.4)' : 'none',
                marginTop: '6px',
              }}
            >
              {loading ? 'Creating Account…' : 'Create Account'} <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #262626', fontSize: '13.5px', color: '#737373' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
                style={{ background: 'none', border: 'none', color: '#60A5FA', fontWeight: 800, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes saasModalEnter {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};
