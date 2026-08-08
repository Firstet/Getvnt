import React, { useState, useEffect } from 'react';
import { Crown, Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  commission_rate: number;
  trial_days: number;
  is_active: boolean;
  is_featured: boolean;
  features?: Array<{ id: string; name: string; pivot?: { value: string } }>;
}

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  default_value: string;
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  price_monthly: 0,
  price_annual: 0,
  commission_rate: 2.5,
  trial_days: 14,
};

export const PlansManagerView: React.FC<{ onTriggerToast: (msg: string) => void }> = ({ onTriggerToast }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form fields
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedFeatures, setSelectedFeatures] = useState<{ [key: string]: string }>({});

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/plans', { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success && json.data) {
        setPlans(json.data.plans || []);
        setFeatureFlags(json.data.feature_flags || []);
      }
    } catch (err) {
      console.error('Failed fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingPlan(null);
    setForm(EMPTY_FORM);
    setSelectedFeatures({});
    setModalMode('create');
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || '',
      price_monthly: plan.price_monthly,
      price_annual: plan.price_annual,
      commission_rate: plan.commission_rate,
      trial_days: plan.trial_days,
    });
    // Prefill feature flag values from plan
    const feats: { [key: string]: string } = {};
    plan.features?.forEach((f) => {
      feats[f.id] = f.pivot?.value ?? '';
    });
    setSelectedFeatures(feats);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingPlan(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = modalMode === 'edit' && editingPlan
        ? `/api/v1/admin/plans/${editingPlan.id}`
        : '/api/v1/admin/plans';
      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          price_monthly: Number(form.price_monthly),
          price_annual: Number(form.price_annual),
          commission_rate: Number(form.commission_rate),
          trial_days: Number(form.trial_days),
          features: selectedFeatures,
        }),
      });
      const json = await res.json();
      if (json.success) {
        onTriggerToast(modalMode === 'edit' ? `Plan "${form.name}" updated!` : `Plan "${form.name}" created!`);
        closeModal();
        fetchPlans();
      } else {
        onTriggerToast(json.message || 'Something went wrong.');
      }
    } catch {
      onTriggerToast('Network error saving plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      const res = await fetch(`/api/v1/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        onTriggerToast('Plan deleted.');
        setDeletingId(null);
        fetchPlans();
      }
    } catch {
      onTriggerToast('Error deleting plan.');
    }
  };

  const set = (key: keyof typeof EMPTY_FORM, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  if (loading) return (
    <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#9CA3AF' }}>
      <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading Plans...
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-heading)' }}>
            Subscription Plans &amp; Feature Flags Builder
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            Configure database-driven pricing, commission tiers, and feature flags.
          </p>
        </div>
        <button className="btn-cta" style={{ background: '#2563EB', color: '#FFF' }} onClick={openCreate}>
          <Plus size={16} /> Create Custom Plan
        </button>
      </div>

      {/* Plans Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {plans.map((p) => (
          <div
            key={p.id}
            style={{
              background: '#141A2E',
              border: `1px solid ${p.is_featured ? 'rgba(245,158,11,0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
              borderRadius: '24px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            {p.is_featured && (
              <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#F59E0B', color: '#000', fontSize: '11px', fontWeight: 900, padding: '4px 12px', borderRadius: '99px' }}>
                ⭐ FEATURED
              </div>
            )}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="sponsored-tag" style={{ background: 'rgba(37, 99, 235, 0.2)', color: '#60A5FA' }}>{p.slug}</span>
                <span style={{ fontSize: '13px', color: '#22C55E', fontWeight: 800 }}>{p.commission_rate}% Fee</span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', marginBottom: '8px' }}>{p.name}</h3>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#F59E0B', marginBottom: '12px' }}>
                ₦{Number(p.price_monthly).toLocaleString()}<span style={{ fontSize: '14px', color: '#9CA3AF' }}>/mo</span>
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '20px', lineHeight: '1.5' }}>{p.description}</p>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '10px' }}>Configured Features &amp; AI Limits</div>
                {p.features?.map((f) => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                    <span style={{ color: '#D1D5DB' }}>{f.name}</span>
                    <span style={{ color: '#60A5FA', fontWeight: 800 }}>{f.pivot?.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-cta"
                style={{ flex: 1, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.4)', color: '#60A5FA', justifyContent: 'center' }}
                onClick={() => openEdit(p)}
              >
                <Edit2 size={14} /> Edit Plan
              </button>
              <button
                className="btn-cta"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', padding: '0 14px' }}
                onClick={() => setDeletingId(p.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalMode && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={closeModal}
        >
          <div
            style={{ background: '#0D1222', border: '1px solid rgba(37, 99, 235, 0.4)', borderRadius: '28px', padding: '36px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#FFF' }}>
                {modalMode === 'edit' ? `Edit "${editingPlan?.name}"` : 'Create Subscription Plan'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Row 1: Name + Slug */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Plan Name</label>
                  <input
                    type="text" required className="admin-input"
                    placeholder="e.g. Gold VIP"
                    value={form.name}
                    onChange={(e) => {
                      set('name', e.target.value);
                      if (modalMode === 'create') set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Slug (URL Key)</label>
                  <input
                    type="text" required className="admin-input"
                    placeholder="gold-vip"
                    value={form.slug}
                    onChange={(e) => set('slug', e.target.value)}
                    disabled={modalMode === 'edit'} // can't change slug on edit
                    style={modalMode === 'edit' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  placeholder="Describe what this plan offers..."
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  style={{ resize: 'vertical', minHeight: '64px' }}
                />
              </div>

              {/* Row 2: Prices */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Monthly Price (₦)</label>
                  <input
                    type="number" min="0" required className="admin-input"
                    value={form.price_monthly}
                    onChange={(e) => set('price_monthly', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Annual Price (₦)</label>
                  <input
                    type="number" min="0" required className="admin-input"
                    value={form.price_annual}
                    onChange={(e) => set('price_annual', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3: Commission + Trial */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Commission Rate (%)</label>
                  <input
                    type="number" step="0.1" min="0" max="100" required className="admin-input"
                    value={form.commission_rate}
                    onChange={(e) => set('commission_rate', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Trial Period (Days)</label>
                  <input
                    type="number" min="0" required className="admin-input"
                    value={form.trial_days}
                    onChange={(e) => set('trial_days', e.target.value)}
                  />
                </div>
              </div>

              {/* Feature Flags */}
              {featureFlags.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ ...labelStyle, marginBottom: '12px', display: 'block', fontSize: '13px' }}>Feature Flags &amp; Limits</label>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {featureFlags.map((ff) => (
                      <div key={ff.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: '#D1D5DB', flex: 1 }}>{ff.name}</span>
                        <input
                          type="text"
                          className="admin-input"
                          style={{ width: '140px', padding: '6px 12px', fontSize: '12px' }}
                          placeholder={ff.default_value}
                          value={selectedFeatures[ff.id] ?? ''}
                          onChange={(e) => setSelectedFeatures({ ...selectedFeatures, [ff.id]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : <><Save size={15} /> {modalMode === 'edit' ? 'Save Changes' : 'Create Plan'}</>}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingId && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setDeletingId(null)}
        >
          <div
            style={{ background: '#0D1222', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '24px', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>Delete Plan?</h3>
            <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginBottom: '24px' }}>
              This action is permanent and cannot be undone. Any active subscribers on this plan will not be affected until their billing cycle ends.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="admin-btn"
                style={{ background: '#DC2626', color: '#FFF', border: 'none' }}
                onClick={() => handleDelete(deletingId)}
              >
                <Trash2 size={15} /> Yes, Delete
              </button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeletingId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 800,
  color: '#9CA3AF',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '6px',
};
