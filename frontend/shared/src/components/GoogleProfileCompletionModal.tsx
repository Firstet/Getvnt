import React, { useState } from 'react';
import { User, Phone, Globe, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface GoogleProfileCompletionModalProps {
  isOpen: boolean;
  token: string;
  initialName?: string;
  initialEmail?: string;
  onSuccess: (updatedUser: any) => void;
  onClose?: () => void;
}

export const GoogleProfileCompletionModal: React.FC<GoogleProfileCompletionModalProps> = ({
  isOpen,
  token,
  initialName = '',
  initialEmail = '',
  onSuccess,
  onClose,
}) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [rolePreference, setRolePreference] = useState<'attendee' | 'organizer'>('attendee');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your official full name.');
      return;
    }
    if (!agreedTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiBase = (import.meta as any).env?.VITE_API_URL || 'https://api.getvnt.com';
      const response = await fetch(`${apiBase}/api/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          country: country,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onSuccess(data.data);
      } else {
        setError(data.message || 'Failed to update profile. Please try again.');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(145deg, #0d1222 0%, #151c33 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15)',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top Header Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '99px',
            background: 'rgba(52, 211, 153, 0.12)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            color: '#34D399',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '16px',
            letterSpacing: '0.5px',
          }}
        >
          <ShieldCheck size={14} /> Google Account Authenticated
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
          Confirm Account Registration Details
        </h2>
        <p style={{ color: '#94A3B8', fontSize: '13.5px', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          Welcome to GETVNT{initialEmail ? ` (${initialEmail})` : ''}! Please verify your official name and contact details to complete your first-time registration.
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#F87171',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#CBD5E1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Full Name (Corresponding with official ID) *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Babatunde Smith"
                required
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  paddingLeft: '42px',
                  paddingRight: '16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Make sure this name is accurate for event tickets and organizer payouts.
            </span>
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#CBD5E1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Phone Number (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  paddingLeft: '42px',
                  paddingRight: '16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Country */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#CBD5E1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Country / Location
            </label>
            <div style={{ position: 'relative' }}>
              <Globe size={18} color="#64748B" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  paddingLeft: '42px',
                  paddingRight: '16px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Nigeria">🇳🇬 Nigeria</option>
                <option value="Ghana">🇬🇭 Ghana</option>
                <option value="Kenya">🇰🇪 Kenya</option>
                <option value="South Africa">🇿🇦 South Africa</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="Other">🌐 Other Country</option>
              </select>
            </div>
          </div>

          {/* Primary Purpose Card Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#CBD5E1', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Account Purpose
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div
                onClick={() => setRolePreference('attendee')}
                style={{
                  background: rolePreference === 'attendee' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${rolePreference === 'attendee' ? '#6366F1' : '#334155'}`,
                  borderRadius: '14px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 800, color: rolePreference === 'attendee' ? '#818CF8' : '#FFFFFF', marginBottom: '4px' }}>
                  🎟️ Attendee
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.3 }}>
                  Discover events &amp; purchase tickets
                </div>
              </div>

              <div
                onClick={() => setRolePreference('organizer')}
                style={{
                  background: rolePreference === 'organizer' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${rolePreference === 'organizer' ? '#6366F1' : '#334155'}`,
                  borderRadius: '14px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 800, color: rolePreference === 'organizer' ? '#818CF8' : '#FFFFFF', marginBottom: '4px' }}>
                  🎪 Event Organizer
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.3 }}>
                  Host events, sell tickets &amp; manage payouts
                </div>
              </div>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '24px', fontSize: '12.5px', color: '#94A3B8' }}>
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#6366F1', cursor: 'pointer' }}
            />
            <span>I confirm this profile information is accurate and agree to the Terms of Service.</span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '50px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              border: 'none',
              borderRadius: '14px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 800,
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span>Saving Registration Details...</span>
            ) : (
              <>
                <span>Save &amp; Complete Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
