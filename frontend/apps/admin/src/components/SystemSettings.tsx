import React, { useState } from 'react';
import { Settings, Save, ToggleLeft, ToggleRight } from 'lucide-react';

interface Props { settings: any; token: string; onRefresh: () => void; }

export function SystemSettings({ settings, token, onRefresh }: Props) {
  const [form, setForm] = useState({
    app_name: settings?.app_name ?? 'GETVNT',
    app_url: settings?.app_url ?? 'https://getvnt.com',
    support_email: settings?.support_email ?? 'support@getvnt.com',
    maintenance_mode: settings?.maintenance_mode === 'true' || settings?.maintenance_mode === true,
    registration_enabled: settings?.registration_enabled !== 'false' && settings?.registration_enabled !== false,
    email_verification_required: settings?.email_verification_required === 'true' || settings?.email_verification_required === true,
    max_events_per_organizer: settings?.max_events_per_organizer ?? '100',
    ticket_download_days: settings?.ticket_download_days ?? '365',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = Object.entries(form).map(([key, value]) => ({ key, value: String(value) }));
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
      if (allOk) { setSaved(true); setTimeout(() => setSaved(false), 3000); onRefresh(); }
    } finally { setSaving(false); }
  };

  const Toggle = ({ label, value, onChange, description }: { label: string; value: boolean; onChange: (v: boolean) => void; description: string }) => (
    <div style={{ background: '#1e293b', borderRadius: '14px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{description}</div>
      </div>
      <button type="button" onClick={() => onChange(!value)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: value ? '#34d399' : '#64748b', padding: 0 }}>
        {value ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
      </button>
    </div>
  );

  const Field = ({ label, valueKey, type = 'text', help }: { label: string; valueKey: keyof typeof form; type?: string; help?: string }) => (
    <div>
      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input
        type={type} value={String(form[valueKey])} onChange={e => update(valueKey, e.target.value)}
        style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px' }}
      />
      {help && <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64748b' }}>{help}</p>}
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Settings size={22} color="#c084fc" /> System Settings
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px' }}>
        Platform-wide configuration. All changes are persisted to the database immediately.
      </p>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#fff' }}>General</h3>
            <Field label="Application Name" valueKey="app_name" />
            <Field label="Application URL" valueKey="app_url" type="url" />
            <Field label="Support Email" valueKey="support_email" type="email" />
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#fff' }}>Limits</h3>
            <Field label="Max Events Per Organizer" valueKey="max_events_per_organizer" type="number" help="Set to 0 for unlimited." />
            <Field label="Ticket Download Window (Days)" valueKey="ticket_download_days" type="number" help="How many days after purchase tickets can be downloaded." />
          </div>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#fff' }}>Platform Toggles</h3>
          <Toggle label="Maintenance Mode" value={form.maintenance_mode} onChange={v => update('maintenance_mode', v)} description="When ON, the public site shows a maintenance page to all non-admins." />
          <Toggle label="User Registration" value={form.registration_enabled} onChange={v => update('registration_enabled', v)} description="Allow new users to create accounts on the platform." />
          <Toggle label="Email Verification Required" value={form.email_verification_required} onChange={v => update('email_verification_required', v)} description="Users must verify their email before accessing the platform." />
        </div>

        <button type="submit" disabled={saving} style={{ background: saved ? '#059669' : 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
          <Save size={16} /> {saving ? 'Saving...' : saved ? '✓ All Settings Saved!' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
