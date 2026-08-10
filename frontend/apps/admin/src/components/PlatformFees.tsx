import React, { useState, useEffect } from 'react';
import { Sliders, Save } from 'lucide-react';

interface Props { feeRules: any; token: string; onRefresh: () => void; }

export function PlatformFees({ feeRules, token, onRefresh }: Props) {
  const [platformFee, setPlatformFee] = useState(feeRules?.platform_fee ?? '5.0');
  const [processingFee, setProcessingFee] = useState(feeRules?.processing_fee ?? '1.5');
  const [fixedFee, setFixedFee] = useState(feeRules?.fixed_fee ?? '0.30');
  const [minPayout, setMinPayout] = useState(feeRules?.min_payout_amount ?? '500');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (feeRules) {
      if (feeRules.platform_fee !== undefined) setPlatformFee(String(feeRules.platform_fee));
      if (feeRules.processing_fee !== undefined) setProcessingFee(String(feeRules.processing_fee));
      if (feeRules.fixed_fee !== undefined) setFixedFee(String(feeRules.fixed_fee));
      if (feeRules.min_payout_amount !== undefined) setMinPayout(String(feeRules.min_payout_amount));
    }
  }, [feeRules]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/v1/admin/fee-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          platform_fee: parseFloat(platformFee),
          processing_fee: parseFloat(processingFee),
          fixed_fee: parseFloat(fixedFee),
          min_payout_amount: parseFloat(minPayout),
        }),
      });
      const data = await res.json();
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); onRefresh(); }
      else alert(data.message || 'Failed to update fee rules.');
    } finally { setSaving(false); }
  };

  const field = (label: string, value: string, setter: (v: string) => void, help: string, suffix = '%') => (
    <div style={{ background: '#1e293b', borderRadius: '14px', padding: '20px' }}>
      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="number" step="0.01" value={value} onChange={e => setter(e.target.value)}
          style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '20px', fontWeight: 900, width: '120px' }}
        />
        <span style={{ color: '#94a3b8', fontSize: '18px', fontWeight: 700 }}>{suffix}</span>
      </div>
      <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#64748b' }}>{help}</p>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Sliders size={22} color="#c084fc" /> Platform Fee Configuration
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px' }}>
        Changes apply immediately to all new ticket purchases across the entire platform.
      </p>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {field('GETVNT Platform Fee', String(platformFee), setPlatformFee, 'Percentage taken from each ticket sale for GETVNT.')}
          {field('Payment Processing Fee', String(processingFee), setProcessingFee, 'Gateway processing charge passed on per transaction.')}
          {field('Fixed Fee Per Ticket', String(fixedFee), setFixedFee, 'Flat fee added to every ticket regardless of price.', '$')}
          {field('Minimum Payout Amount', String(minPayout), setMinPayout, 'Organizer must accumulate this amount before requesting payout.', '$')}
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '14px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Live Preview: $100 ticket</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              GETVNT earns: <strong style={{ color: '#fbbf24' }}>${(100 * parseFloat(platformFee) / 100 + parseFloat(processingFee) * 100 / 100 + parseFloat(fixedFee)).toFixed(2)}</strong>
              &nbsp;— Organizer receives: <strong style={{ color: '#34d399' }}>${(100 - 100 * parseFloat(platformFee) / 100 - 100 * parseFloat(processingFee) / 100 - parseFloat(fixedFee)).toFixed(2)}</strong>
            </div>
          </div>
          <button type="submit" disabled={saving} style={{ background: saved ? '#059669' : 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}>
            <Save size={16} /> {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Fee Rules'}
          </button>
        </div>
      </form>
    </div>
  );
}
