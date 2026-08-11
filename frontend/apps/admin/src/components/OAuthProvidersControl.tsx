import React, { useState, useEffect } from 'react';
import { ShieldCheck, Key, Globe, Save, CheckCircle2, Eye, EyeOff, AlertTriangle, ExternalLink, Copy } from 'lucide-react';

interface Props {
  token: string;
  onRefresh: () => void;
}

export function OAuthProvidersControl({ token, onRefresh }: Props) {
  const [form, setForm] = useState({
    google_auth_enabled: 'true',
    google_client_id: '',
    google_client_secret: '',
    google_redirect_uri: 'https://api.getvnt.com/api/v1/auth/google/callback',
    
    github_auth_enabled: 'false',
    github_client_id: '',
    github_client_secret: '',
    github_redirect_uri: 'https://api.getvnt.com/api/v1/auth/github/callback',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);
  const [showGithubSecret, setShowGithubSecret] = useState(false);

  useEffect(() => {
    // Fetch initial settings from DB
    fetch('/api/v1/admin/system-settings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const sys = data.data;
          setForm(prev => ({
            ...prev,
            google_auth_enabled: sys.google_auth_enabled ?? 'true',
            google_client_id: sys.google_client_id ?? '',
            google_client_secret: sys.google_client_secret ?? '',
            google_redirect_uri: sys.google_redirect_uri ?? 'https://api.getvnt.com/api/v1/auth/google/callback',
            github_auth_enabled: sys.github_auth_enabled ?? 'false',
            github_client_id: sys.github_client_id ?? '',
            github_client_secret: sys.github_client_secret ?? '',
            github_redirect_uri: sys.github_redirect_uri ?? 'https://api.getvnt.com/api/v1/auth/github/callback',
          }));
        }
      })
      .catch(() => {});
  }, [token]);

  const update = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = Object.entries(form).map(([key, value]) => ({ key, value }));
      let allOk = true;
      for (const { key, value } of updates) {
        const res = await fetch('/api/v1/admin/system-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ key, value }),
        });
        const data = await res.json();
        if (!data.success) allOk = false;
      }
      if (allOk) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        onRefresh();
      } else {
        alert('Failed to save some credentials.');
      }
    } finally {
      setSaving(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const copyRedirectUri = () => {
    navigator.clipboard.writeText(form.google_redirect_uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleConfigured = !!(form.google_client_id && form.google_client_secret);

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShieldCheck size={20} color="#34d399" /> Social & Google OAuth Credentials
      </h3>
      <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '13px' }}>
        Configure Google Client ID, Client Secret, and Callback URL. Saved keys override backend .env values dynamically.
      </p>

      {/* ── Setup Status Banner ── */}
      {!googleConfigured ? (
        <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FCD34D', fontWeight: 800, fontSize: '14px' }}>
            <AlertTriangle size={18} /> Google OAuth Not Configured
          </div>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
            "Continue with Google" is disabled until you add your credentials below. Follow these steps:
          </p>
          <ol style={{ color: '#CBD5E1', fontSize: '13px', margin: 0, paddingLeft: '20px', lineHeight: 2 }}>
            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: '#60A5FA', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Google Cloud Console <ExternalLink size={11} /></a></li>
            <li>Create a project → <strong>APIs & Services → Credentials → Create OAuth 2.0 Client ID</strong></li>
            <li>Application type: <code style={{ background: '#1e293b', padding: '1px 6px', borderRadius: '4px' }}>Web application</code></li>
            <li>Add Authorized Redirect URI (copy button below)</li>
            <li>Paste the Client ID and Client Secret in the fields below → Save</li>
          </ol>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px' }}>
            <code style={{ flex: 1, color: '#94A3B8', fontSize: '12px', wordBreak: 'break-all' }}>{form.google_redirect_uri}</code>
            <button
              type="button"
              onClick={copyRedirectUri}
              style={{ background: copied ? '#059669' : '#1e293b', border: 'none', color: copied ? '#fff' : '#60A5FA', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
            >
              <Copy size={11} /> {copied ? 'Copied!' : 'Copy Redirect URI'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '14px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', color: '#34D399', fontWeight: 700, fontSize: '13px' }}>
          <CheckCircle2 size={16} /> Google OAuth is configured and active — "Continue with Google" is live.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          
          {/* Google Auth Card */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="#60a5fa" /> Google Authenticator / OAuth
              </div>
              <button
                type="button"
                onClick={() => update('google_auth_enabled', form.google_auth_enabled === 'true' ? 'false' : 'true')}
                style={{
                  background: form.google_auth_enabled === 'true' ? '#052e16' : '#1e293b',
                  color: form.google_auth_enabled === 'true' ? '#34d399' : '#64748b',
                  border: `1px solid ${form.google_auth_enabled === 'true' ? '#34d399' : '#334155'}`,
                  padding: '4px 10px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {form.google_auth_enabled === 'true' ? '✓ ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Google Client ID */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                Google Client ID (Authenticator ID)
              </label>
              <input
                type="text"
                value={form.google_client_id}
                onChange={e => update('google_client_id', e.target.value)}
                placeholder="109283719283-xxx.apps.googleusercontent.com"
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
              />
            </div>

            {/* Google Client Secret */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  Google Client Secret
                </label>
                <button type="button" onClick={() => setShowGoogleSecret(!showGoogleSecret)} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {showGoogleSecret ? <EyeOff size={11} /> : <Eye size={11} />}
                  {showGoogleSecret ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showGoogleSecret ? 'text' : 'password'}
                value={form.google_client_secret}
                onChange={e => update('google_client_secret', e.target.value)}
                placeholder="GOCSPX-..."
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
              />
            </div>

            {/* Google Callback URL */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                Google Callback / Redirect API URL
              </label>
              <input
                type="text"
                value={form.google_redirect_uri}
                onChange={e => update('google_redirect_uri', e.target.value)}
                placeholder="https://api.getvnt.com/api/v1/auth/google/callback"
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}
              />
            </div>
          </div>

          {/* GitHub Auth Card */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} color="#c084fc" /> GitHub OAuth
              </div>
              <button
                type="button"
                onClick={() => update('github_auth_enabled', form.github_auth_enabled === 'true' ? 'false' : 'true')}
                style={{
                  background: form.github_auth_enabled === 'true' ? '#052e16' : '#1e293b',
                  color: form.github_auth_enabled === 'true' ? '#34d399' : '#64748b',
                  border: `1px solid ${form.github_auth_enabled === 'true' ? '#34d399' : '#334155'}`,
                  padding: '4px 10px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {form.github_auth_enabled === 'true' ? '✓ ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* GitHub Client ID */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                GitHub Client ID
              </label>
              <input
                type="text"
                value={form.github_client_id}
                onChange={e => update('github_client_id', e.target.value)}
                placeholder="Ov23rt..."
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
              />
            </div>

            {/* GitHub Client Secret */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                  GitHub Client Secret
                </label>
                <button type="button" onClick={() => setShowGithubSecret(!showGithubSecret)} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {showGithubSecret ? <EyeOff size={11} /> : <Eye size={11} />}
                  {showGithubSecret ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showGithubSecret ? 'text' : 'password'}
                value={form.github_client_secret}
                onChange={e => update('github_client_secret', e.target.value)}
                placeholder="ghs_..."
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
              />
            </div>

            {/* GitHub Callback URL */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>
                GitHub Callback API URL
              </label>
              <input
                type="text"
                value={form.github_redirect_uri}
                onChange={e => update('github_redirect_uri', e.target.value)}
                placeholder="https://api.getvnt.com/api/v1/auth/github/callback"
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}
              />
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            background: saved ? '#059669' : 'linear-gradient(135deg,#10b981,#059669)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
        >
          <Save size={15} />
          {saving ? 'Saving Credentials...' : saved ? '✓ OAuth Credentials Saved to Database!' : 'Save OAuth & Authenticator Credentials'}
        </button>
      </form>
    </div>
  );
}
