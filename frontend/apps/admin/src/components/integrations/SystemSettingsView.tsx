import React, { useState, useEffect } from 'react';
import { Shield, Save } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
}

export const SystemSettingsView: React.FC<Props> = ({ onToast }) => {
  const [settings, setSettings] = useState<any>({
    starter:      { allow_custom_ai: false, allow_custom_payment: false, ai_monthly_token_quota: 50000 },
    professional: { allow_custom_ai: false, allow_custom_payment: true,  ai_monthly_token_quota: 500000 },
    enterprise:   { allow_custom_ai: true,  allow_custom_payment: true,  ai_monthly_token_quota: -1 },
  });

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  useEffect(() => {
    fetch('/api/v1/admin/integrations/system-settings', { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          // Merge only BYOK keys, not branding (branding is now in BrandingSettingsView)
          setSettings((prev: any) => ({
            ...prev,
            starter:      { ...prev.starter,      ...(json.data.starter      || {}) },
            professional: { ...prev.professional, ...(json.data.professional || {}) },
            enterprise:   { ...prev.enterprise,   ...(json.data.enterprise   || {}) },
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      // Fetch existing settings first, then merge BYOK changes
      const currentRes  = await fetch('/api/v1/admin/integrations/system-settings', { headers: getAuthHeaders() });
      const currentJson = await currentRes.json();
      const currentData = currentJson.data || {};

      const res  = await fetch('/api/v1/admin/integrations/system-settings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...currentData,
          starter:      settings.starter,
          professional: settings.professional,
          enterprise:   settings.enterprise,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onToast('✅ Tenant BYOK Permission Settings saved!');
      }
    } catch {
      onToast('Error saving settings.');
    }
  };

  const planConfigs = [
    {
      key:   'starter',
      label: 'Starter Plan',
      color: '#9CA3AF',
      badge: { text: 'Platform Default', cls: 'admin-badge-inactive' },
    },
    {
      key:   'professional',
      label: 'Professional Plan',
      color: '#60A5FA',
      badge: { text: 'Gateway BYOK Allowed', cls: 'admin-badge-warning' },
    },
    {
      key:   'enterprise',
      label: 'Enterprise Plan',
      color: '#10B981',
      badge: { text: 'Full BYOK Enabled', cls: 'admin-badge-active' },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Tenant Plan BYOK Permissions</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Control which subscription tiers can use Bring-Your-Own-Key (BYOK) integrations for AI and payment gateways.
            <br />
            <span style={{ color: '#4F46E5', fontWeight: 700 }}>Platform branding and media assets are managed in the Brand Registry tab.</span>
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          <Save size={15} /> Save BYOK Rules
        </button>
      </div>

      {/* ── TENANT BYOK PERMISSION CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {planConfigs.map(({ key, label, color, badge }) => (
          <div className="admin-card" key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color }}>{label}</h4>
              <span className={`admin-badge ${badge.cls}`}>{badge.text}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Allow Custom AI */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <div
                  onClick={() => setSettings({ ...settings, [key]: { ...settings[key], allow_custom_ai: !settings[key]?.allow_custom_ai } })}
                  style={{
                    width: '38px', height: '22px', borderRadius: '11px', cursor: 'pointer', flexShrink: 0,
                    background: settings[key]?.allow_custom_ai ? '#4F46E5' : 'rgba(255,255,255,0.12)',
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '3px',
                    left: settings[key]?.allow_custom_ai ? '19px' : '3px',
                    width: '16px', height: '16px', borderRadius: '50%', background: '#FFF', transition: 'left 0.2s',
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#D1D5DB' }}>Custom AI API Keys</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Allow tenants to plug in their own OpenAI, Anthropic, etc.</div>
                </div>
              </label>

              {/* Allow Custom Payment */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <div
                  onClick={() => setSettings({ ...settings, [key]: { ...settings[key], allow_custom_payment: !settings[key]?.allow_custom_payment } })}
                  style={{
                    width: '38px', height: '22px', borderRadius: '11px', cursor: 'pointer', flexShrink: 0,
                    background: settings[key]?.allow_custom_payment ? '#4F46E5' : 'rgba(255,255,255,0.12)',
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '3px',
                    left: settings[key]?.allow_custom_payment ? '19px' : '3px',
                    width: '16px', height: '16px', borderRadius: '50%', background: '#FFF', transition: 'left 0.2s',
                  }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#D1D5DB' }}>Custom Payment Gateway Keys</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Allow tenants to plug in their own Paystack, Stripe, etc.</div>
                </div>
              </label>

              {/* AI Token Quota */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  AI Token Quota / Month
                </label>
                <input
                  className="admin-input"
                  type="number"
                  value={settings[key]?.ai_monthly_token_quota ?? 0}
                  onChange={(e) => setSettings({ ...settings, [key]: { ...settings[key], ai_monthly_token_quota: parseInt(e.target.value) } })}
                  style={{ fontSize: '13px' }}
                />
                {settings[key]?.ai_monthly_token_quota === -1 && (
                  <p style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>∞ Unlimited tokens (Enterprise)</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Note */}
      <div className="admin-card" style={{ background: 'rgba(79, 70, 229, 0.06)', border: '1px solid rgba(79, 70, 229, 0.2)', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <Shield size={20} color="#818CF8" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>BYOK Security Note</div>
          <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>
            All tenant-provided API keys are encrypted at rest using AES-256. Keys are only decrypted in-memory during API calls and never logged. Audit trails are maintained for all key usage events. Keys cannot be exported after initial submission.
          </p>
        </div>
      </div>

    </div>
  );
};
