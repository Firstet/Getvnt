import React, { useState, useEffect } from 'react';
import { CreditCard, Save, CheckCircle2, ShieldCheck, RefreshCw, Key, Globe, Eye, EyeOff, Plus, Trash2, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { ConfirmModal } from '@getvnt/shared';

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

const DEFAULT_FALLBACK_GATEWAYS: Gateway[] = [
  { id: 'gw-paystack', provider: 'paystack', environment: 'sandbox', is_enabled: true, currency: 'USD', public_key: '', secret_key: '' },
  { id: 'gw-flutterwave', provider: 'flutterwave', environment: 'sandbox', is_enabled: true, currency: 'USD', public_key: '', secret_key: '' },
  { id: 'gw-stripe', provider: 'stripe', environment: 'sandbox', is_enabled: true, currency: 'USD', public_key: '', secret_key: '' },
  { id: 'gw-monnify', provider: 'monnify', environment: 'sandbox', is_enabled: true, currency: 'USD', public_key: '', secret_key: '' },
  { id: 'gw-remita', provider: 'remita', environment: 'sandbox', is_enabled: true, currency: 'USD', public_key: '', secret_key: '' },
  { id: 'gw-square', provider: 'square', environment: 'sandbox', is_enabled: true, currency: 'USD', public_key: '', secret_key: '' },
  { id: 'gw-paypal', provider: 'paypal', environment: 'sandbox', is_enabled: true, currency: 'USD', public_key: '', secret_key: '' },
  { id: 'gw-banktransfer', provider: 'bank_transfer', environment: 'sandbox', is_enabled: true, currency: 'USD', public_key: '', secret_key: '' },
];

export function PaymentGatewayControl({ gateways, token, onRefresh }: Props) {
  const activeGateways = gateways && gateways.length > 0 ? gateways : DEFAULT_FALLBACK_GATEWAYS;

  const [formData, setFormData] = useState<Record<string, Gateway>>(() => {
    const map: Record<string, Gateway> = {};
    activeGateways.forEach(g => { map[g.id] = { ...g }; });
    return map;
  });

  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  // Toast Notification State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

  // Modal State for Adding New Gateway
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGateway, setNewGateway] = useState({
    provider: 'stripe',
    custom_provider: '',
    public_key: '',
    secret_key: '',
    webhook_secret: '',
    merchant_id: '',
    environment: 'sandbox',
    is_enabled: true,
  });
  const [adding, setAdding] = useState(false);

  // Sync state whenever gateways prop updates from parent API fetch
  useEffect(() => {
    const list = gateways && gateways.length > 0 ? gateways : DEFAULT_FALLBACK_GATEWAYS;
    const map: Record<string, Gateway> = {};
    list.forEach(g => { map[g.id] = { ...g }; });
    setFormData(map);
  }, [gateways]);

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
      const isFallback = id.startsWith('gw-');
      const url = isFallback ? '/api/v1/admin/payment-gateways' : `/api/v1/admin/payment-gateways/${id}`;
      const method = isFallback ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          provider: payload.provider,
          public_key: payload.public_key,
          secret_key: payload.secret_key,
          webhook_secret: payload.webhook_secret,
          merchant_id: payload.merchant_id,
          callback_url: payload.callback_url || `https://api.getvnt.com/v1/payments/${payload.provider}/callback`,
          environment: payload.environment || 'sandbox',
          is_enabled: Boolean(payload.is_enabled),
          currency: payload.currency || 'USD',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedId(id);
        setTimeout(() => setSavedId(null), 3000);
        showToast(`Payment Gateway "${payload.provider.toUpperCase()}" credentials saved!`, 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to save gateway config.', 'error');
      }
    } catch (e: any) {
      showToast('Save failed: ' + e.message, 'error');
    } finally {
      setSavingId(null);
    }
  };

  const executeDelete = async (id: string, providerName: string) => {
    setConfirmModal(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/admin/payment-gateways/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Payment Gateway "${providerName.toUpperCase()}" deleted.`, 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to delete gateway.', 'error');
      }
    } catch (e: any) {
      showToast('Delete failed: ' + e.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateNewGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalProvider = newGateway.provider === 'custom' ? newGateway.custom_provider : newGateway.provider;
    if (!finalProvider) {
      showToast('Please select or enter a payment gateway provider name.', 'error');
      return;
    }

    setAdding(true);
    try {
      const res = await fetch('/api/v1/admin/payment-gateways', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          provider: finalProvider,
          public_key: newGateway.public_key,
          secret_key: newGateway.secret_key,
          webhook_secret: newGateway.webhook_secret,
          merchant_id: newGateway.merchant_id,
          callback_url: `https://api.getvnt.com/v1/payments/${finalProvider}/callback`,
          environment: newGateway.environment,
          is_enabled: newGateway.is_enabled,
          currency: 'USD',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewGateway({ provider: 'stripe', custom_provider: '', public_key: '', secret_key: '', webhook_secret: '', merchant_id: '', environment: 'sandbox', is_enabled: true });
        showToast(`Payment Gateway "${finalProvider.toUpperCase()}" added successfully!`, 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to create payment gateway.', 'error');
      }
    } catch (e: any) {
      showToast('Creation error: ' + e.message, 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Sleek Custom Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            background: toast.type === 'success' ? '#052e16' : '#450a0a',
            border: `1px solid ${toast.type === 'success' ? '#10b981' : '#f87171'}`,
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '420px',
            fontSize: '13.5px',
            fontWeight: 700
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={20} color="#10b981" /> : <AlertTriangle size={20} color="#f87171" />}
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={22} color="#c084fc" /> Payment Gateway Configuration
          </h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>
            Add, edit, enable, or delete payment providers (Paystack, Flutterwave, Stripe, Monnify, Remita, Square, PayPal, Bank Transfer). Settings save directly to DB.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
          >
            <Plus size={16} /> + Add Payment Gateway
          </button>
          <button onClick={onRefresh} style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Grid of Gateways */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {activeGateways.map(gw => {
          const item = formData[gw.id] || gw;
          const isSaving = savingId === gw.id;
          const isJustSaved = savedId === gw.id;
          const isDeleting = deletingId === gw.id;
          const isSecretVisible = Boolean(showSecret[gw.id]);

          return (
            <div key={gw.id} style={{ background: '#0f172a', border: `1px solid ${item.is_enabled ? '#3b82f644' : '#1e293b'}`, borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Header & Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {gw.provider.replace('_', ' ')}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>ID: {gw.id}</span>
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
                    Public Key / Public Client ID
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

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => handleSave(gw.id)}
                  disabled={isSaving}
                  style={{
                    flex: 1,
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
                    gap: '8px'
                  }}
                >
                  <Save size={14} />
                  {isSaving ? 'Saving to Database...' : isJustSaved ? '✓ Credentials Saved!' : `Save ${gw.provider.toUpperCase()} Settings`}
                </button>

                {!gw.id.startsWith('gw-') && (
                  <button
                    type="button"
                    onClick={() => setConfirmModal({ isOpen: true, id: gw.id, name: gw.provider })}
                    disabled={isDeleting}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #7f1d1d',
                      color: '#f87171',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} />
                    {isDeleting ? '...' : 'Delete'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Gateway Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={20} color="#a855f7" /> Add New Payment Gateway
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewGateway} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Select Provider</label>
                <select
                  value={newGateway.provider}
                  onChange={e => setNewGateway(prev => ({ ...prev, provider: e.target.value }))}
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px' }}
                >
                  <option value="stripe">Stripe</option>
                  <option value="paystack">Paystack</option>
                  <option value="flutterwave">Flutterwave</option>
                  <option value="monnify">Monnify</option>
                  <option value="remita">Remita</option>
                  <option value="square">Square</option>
                  <option value="paypal">PayPal</option>
                  <option value="klarna">Klarna</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="custom">Other / Custom Gateway...</option>
                </select>
              </div>

              {newGateway.provider === 'custom' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Custom Provider Name</label>
                  <input
                    type="text"
                    value={newGateway.custom_provider}
                    onChange={e => setNewGateway(prev => ({ ...prev, custom_provider: e.target.value }))}
                    placeholder="my_payment_provider"
                    required
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px' }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Environment</label>
                  <select
                    value={newGateway.environment}
                    onChange={e => setNewGateway(prev => ({ ...prev, environment: e.target.value }))}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="sandbox">Sandbox (Testing)</option>
                    <option value="live">Live Production</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Initial Status</label>
                  <button
                    type="button"
                    onClick={() => setNewGateway(prev => ({ ...prev, is_enabled: !prev.is_enabled }))}
                    style={{ width: '100%', background: newGateway.is_enabled ? '#052e16' : '#1e293b', color: newGateway.is_enabled ? '#34d399' : '#64748b', border: `1px solid ${newGateway.is_enabled ? '#34d399' : '#334155'}`, padding: '9px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
                  >
                    {newGateway.is_enabled ? '✓ Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Public Key / Client ID</label>
                <input
                  type="text"
                  value={newGateway.public_key}
                  onChange={e => setNewGateway(prev => ({ ...prev, public_key: e.target.value }))}
                  placeholder="pk_test_..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Secret Key</label>
                <input
                  type="password"
                  value={newGateway.secret_key}
                  onChange={e => setNewGateway(prev => ({ ...prev, secret_key: e.target.value }))}
                  placeholder="sk_test_..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ flex: 1, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  style={{ flex: 1, background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}
                >
                  {adding ? 'Adding Gateway...' : 'Save & Create Gateway'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sleek Custom Confirm Modal for Gateway Deletion */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title="Delete Payment Gateway"
          message={`Are you sure you want to permanently delete Payment Gateway "${confirmModal.name.toUpperCase()}"? This action cannot be undone.`}
          confirmText="Yes, Delete Gateway"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => executeDelete(confirmModal.id, confirmModal.name)}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
