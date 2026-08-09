import React, { useState, useEffect } from 'react';
import { KeyRound, CheckCircle, ShieldCheck, Eye, EyeOff, Copy, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { PasswordField } from '../../../../../shared/src';

interface Props {
  onToast: (msg: string) => void;
}

export const AuthProvidersView: React.FC<Props> = ({ onToast }) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<number | null>(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/auth-providers', { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) {
        setProviders(json.data || []);
      }
    } catch {
      onToast('Error loading auth providers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleToggle = async (provider: any) => {
    try {
      const res = await fetch(`/api/v1/admin/auth-providers/${provider.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_enabled: !provider.is_enabled }),
      });
      const json = await res.json();
      if (json.success) {
        onToast(`Status for ${provider.name} updated to ${!provider.is_enabled ? 'Enabled' : 'Disabled'}.`);
        fetchProviders();
      }
    } catch {
      onToast('Error updating status.');
    }
  };

  const handleSave = async (provider: any, e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      client_id: formData.get('client_id'),
      client_secret: formData.get('client_secret'),
      redirect_uri: formData.get('redirect_uri'),
    };

    try {
      const res = await fetch(`/api/v1/admin/auth-providers/${provider.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        onToast(`✅ Saved credentials for ${provider.name}!`);
        fetchProviders();
      }
    } catch {
      onToast('Failed to save credentials.');
    }
  };

  const handleTest = async (provider: any) => {
    setTestingId(provider.id);
    try {
      const res = await fetch(`/api/v1/admin/auth-providers/${provider.id}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        onToast(json.message);
      } else {
        onToast(`❌ ${json.message || 'Test failed.'}`);
      }
    } catch {
      onToast('Failed to connect to backend test service.');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Authentication & Social Identity Providers</h2>
        <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
          Configure OAuth 2.0 and Social Sign-In credentials without editing code or <code>.env</code> files. All secrets are stored encrypted in the database.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Loading OAuth Providers...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="admin-card"
              style={{
                border: provider.is_enabled ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--admin-border)',
                background: provider.is_enabled ? 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(13,17,32,0.95))' : 'rgba(13,17,32,0.8)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#60A5FA' }}>
                    {provider.provider_slug.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{provider.name}</h3>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>OAuth 2.0 Protocol</span>
                  </div>
                </div>

                {/* Enable Switch */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <div
                    onClick={() => handleToggle(provider)}
                    style={{
                      width: '40px', height: '22px', borderRadius: '11px', cursor: 'pointer',
                      background: provider.is_enabled ? '#2563EB' : 'rgba(255,255,255,0.12)',
                      position: 'relative', transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: '3px',
                      left: provider.is_enabled ? '21px' : '3px',
                      width: '16px', height: '16px', borderRadius: '50%', background: '#FFF', transition: 'left 0.2s',
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: provider.is_enabled ? '#34D399' : '#9CA3AF' }}>
                    {provider.is_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>

              <form onSubmit={(e) => handleSave(provider, e)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Client ID / App Key
                  </label>
                  <input
                    className="admin-input"
                    name="client_id"
                    defaultValue={provider.client_id || ''}
                    style={{ fontFamily: 'monospace', fontSize: '12.5px' }}
                    placeholder="Enter Client ID"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Client Secret Key
                  </label>
                  <PasswordField
                    className="admin-input"
                    name="client_secret"
                    defaultValue={provider.client_secret || ''}
                    style={{ fontFamily: 'monospace', fontSize: '12.5px' }}
                    placeholder="Enter Secret Key"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Authorized Redirect Callback URI
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      className="admin-input"
                      name="redirect_uri"
                      defaultValue={provider.redirect_uri || ''}
                      style={{ fontFamily: 'monospace', fontSize: '11px', color: '#34D399', background: 'rgba(0,0,0,0.3)' }}
                      placeholder={`https://api.getvnt.com/api/v1/auth/${provider.provider_slug}/callback`}
                      id={`redirect_uri_${provider.id}`}
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 10px', whiteSpace: 'nowrap', fontSize: '10px' }}
                      title="Auto-fill production callback URL"
                      onClick={() => {
                        const el = document.getElementById(`redirect_uri_${provider.id}`) as HTMLInputElement;
                        if (el) el.value = `https://api.getvnt.com/api/v1/auth/${provider.provider_slug}/callback`;
                        onToast(`Production callback URL set for ${provider.name}`);
                      }}
                    >
                      Use Prod URL
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 10px' }}
                      onClick={() => {
                        const el = document.getElementById(`redirect_uri_${provider.id}`) as HTMLInputElement;
                        navigator.clipboard.writeText(el?.value || provider.redirect_uri || '');
                        onToast('Copied Callback URI to clipboard!');
                      }}
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                  <p style={{ fontSize: '10.5px', color: '#6B7280', marginTop: '5px' }}>
                    Copy this URL into your OAuth app's authorized redirect list.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1, fontSize: '12px', justifyContent: 'center' }}>
                    Save Credentials
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-success"
                    style={{ fontSize: '12px' }}
                    onClick={() => handleTest(provider)}
                    disabled={testingId === provider.id}
                  >
                    {testingId === provider.id ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
