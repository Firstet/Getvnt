import React, { useState } from 'react';
import { Award, Check, X, Search } from 'lucide-react';

interface Props { token: string; }

export function Subscriptions({ token }: Props) {
  const [plans] = useState([
    { id: 'starter', name: 'Starter', price: 0, currency: 'USD', billing: 'free', features: ['5 events/month', '100 tickets/event', 'Basic analytics', 'Email support'], color: '#64748b', highlight: false },
    { id: 'pro', name: 'Organizer Pro', price: 29, currency: 'USD', billing: 'monthly', features: ['Unlimited events', 'Unlimited tickets', 'Advanced analytics', 'Custom website', 'Priority support', 'AI Event Builder', 'QR Door Check-In', 'CRM & Marketing'], color: '#a855f7', highlight: true },
    { id: 'enterprise', name: 'Enterprise', price: 99, currency: 'USD', billing: 'monthly', features: ['Everything in Pro', 'Dedicated account manager', 'White-label option', 'API access', 'SLA guarantee', 'Custom integrations', 'Multi-team access'], color: '#ec4899', highlight: false },
  ]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSavePrice = async (planId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/subscriptions/${planId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });
      const data = await res.json();
      if (data.success) { alert('Plan price updated!'); setEditingPlan(null); }
      else alert(data.message || 'Update failed. Endpoint may need registration.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Award size={22} color="#c084fc" /> Subscription Plan Manager
      </h2>
      <p style={{ margin: '0 0 32px', color: '#64748b', fontSize: '14px' }}>
        Manage all GETVNT subscription tiers. Changes apply to all new sign-ups immediately.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {plans.map(plan => (
          <div key={plan.id} style={{ background: '#0f172a', border: `2px solid ${plan.highlight ? plan.color : '#1e293b'}`, borderRadius: '20px', padding: '28px', position: 'relative' }}>
            {plan.highlight && (
              <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', fontSize: '11px', fontWeight: 900, padding: '4px 14px', borderRadius: '99px' }}>
                MOST POPULAR
              </span>
            )}
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>{plan.name}</div>
            {editingPlan === plan.id ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: '#94a3b8', fontSize: '20px' }}>$</span>
                <input
                  type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} autoFocus
                  style={{ background: '#1e293b', border: `1px solid ${plan.color}`, borderRadius: '8px', padding: '6px 12px', color: '#fff', fontSize: '22px', fontWeight: 900, width: '90px' }}
                />
                <span style={{ color: '#64748b', fontSize: '13px' }}>/mo</span>
                <button onClick={() => handleSavePrice(plan.id)} disabled={saving} style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}>
                  {saving ? '...' : <Check size={14} />}
                </button>
                <button onClick={() => setEditingPlan(null)} style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: plan.color }}>
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.price > 0 && <span style={{ color: '#64748b', fontSize: '14px' }}>/month</span>}
              </div>
            )}

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <Check size={14} color={plan.color} />
                  {f}
                </li>
              ))}
            </ul>

            {editingPlan !== plan.id && (
              <button
                onClick={() => { setEditingPlan(plan.id); setNewPrice(String(plan.price)); }}
                style={{ width: '100%', background: '#1e293b', border: `1px solid ${plan.color}`, color: plan.color, padding: '10px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}
              >
                Edit Price & Features
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Active Subscriptions Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{plan.name}</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: plan.color, margin: '4px 0' }}>—</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>subscribers (live count coming from DB)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
