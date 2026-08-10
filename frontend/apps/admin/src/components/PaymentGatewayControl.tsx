import React, { useState } from 'react';
import { CreditCard, Save, CheckCircle2, ShieldCheck, RefreshCw, Key, Globe, Eye, EyeOff } from 'lucide-react';

interface Gateway {
  id: string;
  provider: string;
  public_key?: string;
  secret_key?: string;
  webhook_secret?: string;
  merchant_id?: string;
  callback_url?: string;
  environment?: string;
  is_enabled?: boolean;
  currency?: string;
}

interface Props {
  gateways: Gateway[];
  token: string;
  onRefresh: () => void;
}

export function PaymentGatewayControl({ gateways, token, onRefresh }: Props) {
  const [formData, setFormData] = useState<Record<string, Gateway>>(() => {
    const map: Record<string, Gateway> = {};
    gateways.forEach(g => { map[g.id] = { ...g }; });
    return map;
  });

  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  const updateField = (id: string, field: keyof Gateway, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const toggleShowSecret = (id: string) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async (id: string) => {
    const payload = formData[id];
    if (!payload) return;

    setSavingId(id);
    try {
      const res = await fetch(`/api/v1/admin/payment-gateways/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          public_key: payload.public_key,
          secret_key: payload.secret_key,
          webhook_secret: payload.webhook_secret,
          merchant_id: payload.merchant_id,
          callback_url: payload.callback_url,
          environment: payload.environment || 'sandbox',
          is_enabled: Boolean(payload.is_enabled),
          currency: payload.currency || 'USD',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedId(id);
        setTimeout(() => setSavedId(null), 3000);
        onRefresh();
      } else {
        alert(data.message || 'Failed to save gateway config.');
      }
    } catch (e: any) {
      alert('Save failed: ' + e.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={22} color="#c084fc" /> Payment Gateway Configuration
          </h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>
            Configure live and sandbox API credentials for all payment providers. Settings save directly to the database and override hardcoded backend values.
          </p>
        </div>
        <button onClick={onRefresh} style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {gateways.map(gw => {
          const item = formData[gw.id] || gw;
          const isSaving = savingId === gw.id;
          const isJustSaved = savedId === gw.id;
          const isSecretVisible = Boolean(showSecret[gw.id]);

          return (
            <div key={gw.id} style={{ background: '#0f172a', border: `1px solid ${item.is_enabled ? '#3b82f644' : '#1e293b'}`, borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Header & Status Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {gw.provider.replace('_', ' ')}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Provider ID: {gw.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={item.environment || 'sandbox'}
                    onChange={e => updateField(gw.id, 'environment', e.target.value)}
                    style={{ background: item.environment === 'live' ? '#052e16' : '#1e293b', color: item.environment === 'live' ? '#34d399' : '#fbbf24', border: `1px solid ${item.environment === 'live' ? '#059669' : '#78350f'}`, borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: 800 }}
                  >
                    <option value="sandbox">SANDBOX</option>
                    <option value="live">LIVE PRODUCTION</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => updateField(gw.id, 'is_enabled', !item.is_enabled)}
                    style={{ background: item.is_enabled ? '#052e16' : '#1e293b', color: item.is_enabled ? '#34d399' : '#94a3b8', border: `1px solid ${item.is_enabled ? '#34d399' : '#334155'}`, padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {item.is_enabled ? '✓ ACTIVE' : 'DISABLED'}
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Public Key / ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Public Key / Client ID
                  </label>
                  <input
                    type="text"
                    value={item.public_key || ''}
                    onChange={e => updateField(gw.id, 'public_key', e.target.value)}
                    placeholder={`pk_${item.environment === 'live' ? 'live' : 'test'}_...`}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
                  />
                </div>

                {/* Secret Key */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Secret Key
                    </label>
                    <button type="button" onClick={() => toggleShowSecret(gw.id)} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {isSecretVisible ? <EyeOff size={11} /> : <Eye size={11} />}
                      {isSecretVisible ? 'Hide Secret' : 'Show Secret'}
                    </button>
                  </div>
                  <input
                    type={isSecretVisible ? 'text' : 'password'}
                    value={item.secret_key || ''}
                    onChange={e => updateField(gw.id, 'secret_key', e.target.value)}
                    placeholder={`sk_${item.environment === 'live' ? 'live' : 'test'}_...`}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
                  />
                </div>

                {/* Webhook Secret & Merchant ID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Webhook Secret</label>
                    <input
                      type="password"
                      value={item.webhook_secret || ''}
                      onChange={e => updateField(gw.id, 'webhook_secret', e.target.value)}
                      placeholder="whsec_..."
                      style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Merchant ID</label>
                    <input
                      type="text"
                      value={item.merchant_id || ''}
                      onChange={e => updateField(gw.id, 'merchant_id', e.target.value)}
                      placeholder="MER-99201"
                      style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>
                </div>

                {/* Callback URL */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Callback / Redirect URL</label>
                  <input
                    type="text"
                    value={item.callback_url || `https://api.getvnt.com/v1/payments/${gw.provider}/callback`}
                    onChange={e => updateField(gw.id, 'callback_url', e.target.value)}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => handleSave(gw.id)}
                disabled={isSaving}
                style={{
                  background: isJustSaved ? '#059669' : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px'
                }}
              >
                <Save size={14} />
                {isSaving ? 'Saving to Database...' : isJustSaved ? '✓ Credentials Saved to DB!' : `Save ${gw.provider.toUpperCase()} Settings`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
