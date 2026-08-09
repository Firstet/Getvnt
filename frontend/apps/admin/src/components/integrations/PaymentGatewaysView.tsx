import React, { useState } from 'react';
import { CreditCard, Plus, RefreshCw, CheckCircle, Trash2, Edit3, Shield, Globe, Lock } from 'lucide-react';
import { PasswordField, ConfirmModal } from '../../../../../shared/src';

interface Props {
  gateways: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const PaymentGatewaysView: React.FC<Props> = ({ gateways, onRefresh, onToast }) => {
  const [testingId, setTestingId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<any | null>(null);
  
  // Enterprise Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const handleTestConnection = async (id: number, name: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/v1/admin/integrations/payment-gateways/${id}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`✅ ${data.message}`);
      }
    } catch (err) {
      onToast('❌ Failed to test gateway connection.');
    } finally {
      setTestingId(null);
    }
  };

  const promptDisconnectGateway = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Disconnect Payment Gateway',
      message: `Are you sure you want to disconnect ${name}? Active event checkouts using ${name} will be paused.`,
      confirmText: 'Disconnect Gateway',
      onConfirm: () => executeDeleteGateway(id, name),
    });
  };

  const executeDeleteGateway = async (id: number, name: string) => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    try {
      const res = await fetch(`/api/v1/admin/integrations/payment-gateways/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`🗑️ ${name} disconnected.`);
        onRefresh();
      }
    } catch (err) {
      onToast('❌ Failed to delete payment gateway.');
    }
  };

  const handleToggleGatewayStatus = async (gateway: any) => {
    const newStatus = gateway.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/v1/admin/integrations/payment-gateways/${gateway.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: gateway.name,
          slug: gateway.slug,
          status: newStatus,
          currency: gateway.currency,
          environment: gateway.environment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`⚡ ${gateway.name} payment gateway is now ${newStatus.toUpperCase()}`);
        onRefresh();
      }
    } catch {
      onToast('❌ Failed to update gateway status.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Payment Gateway Integrations &amp; Settlement</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Manage payment drivers, public/secret credentials, webhook secrets, callback URLs, &amp; processing fees.
          </p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setSelectedGateway(null);
            setDrawerOpen(true);
          }}
        >
          <Plus size={16} /> Connect Payment Gateway
        </button>
      </div>

      {/* Gateway Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

        {gateways.map((g) => (
          <div key={g.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60A5FA',
                  }}
                >
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{g.name}</h3>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Default Currency: {g.currency}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ background: g.environment === 'live' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: g.environment === 'live' ? '#34D399' : '#FBBF24', padding: '3px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>
                  {g.environment.toUpperCase()}
                </span>
                
                {/* 1-Click Toggle Gateway Button */}
                <button
                  type="button"
                  onClick={() => handleToggleGatewayStatus(g)}
                  style={{
                    background: g.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                    border: `1px solid ${g.status === 'active' ? '#10B981' : '#EF4444'}`,
                    color: g.status === 'active' ? '#34D399' : '#F87171',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 900,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.status === 'active' ? '#10B981' : '#EF4444' }} />
                  {g.status === 'active' ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Public / API Key:</span>
                <span style={{ fontFamily: 'monospace', color: '#60A5FA' }}>{g.public_key || 'Not Set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Secret Key:</span>
                <span style={{ fontFamily: 'monospace', color: '#F87171' }}>{g.secret_key_masked || 'sk_live_...****'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Callback URL:</span>
                <span style={{ fontFamily: 'monospace', color: '#9CA3AF', fontSize: '11px' }}>{g.callback_url || 'https://api.getvnt.com/v1/payments/callback'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Transaction Fee Rate:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>{g.transaction_fee_percent}% + ₦{g.flat_fee}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {g.supported_countries &&
                g.supported_countries.map((c: string) => (
                  <span key={c} style={{ background: 'rgba(255,255,255,0.06)', color: '#E5E7EB', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    <Globe size={11} style={{ display: 'inline', marginRight: '4px' }} /> {c}
                  </span>
                ))}
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--admin-border)', paddingTop: '14px' }}>
              <button
                className="admin-btn admin-btn-success"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => handleTestConnection(g.id, g.name)}
                disabled={testingId === g.id}
              >
                <CheckCircle size={14} /> {testingId === g.id ? 'Testing...' : 'Test Connection'}
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => {
                  setSelectedGateway(g);
                  setDrawerOpen(true);
                }}
              >
                <Edit3 size={14} /> Configure
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', color: '#EF4444' }}
                onClick={() => promptDisconnectGateway(g.id, g.name)}
              >
                <Trash2 size={14} /> Disconnect
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Drawer */}
      {drawerOpen && (
        <div className="modal-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              {selectedGateway ? `Configure ${selectedGateway.name}` : 'Connect Payment Gateway'}
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  name: formData.get('name'),
                  slug: formData.get('slug') || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
                  public_key: formData.get('public_key'),
                  secret_key: formData.get('secret_key'),
                  webhook_secret: formData.get('webhook_secret'),
                  callback_url: formData.get('callback_url'),
                  environment: formData.get('environment'),
                  currency: formData.get('currency'),
                  transaction_fee_percent: parseFloat(formData.get('transaction_fee_percent') as string || '1.5'),
                  flat_fee: parseFloat(formData.get('flat_fee') as string || '100'),
                  status: formData.get('status'),
                };

                const url = selectedGateway
                  ? `/api/v1/admin/integrations/payment-gateways/${selectedGateway.id}`
                  : '/api/v1/admin/integrations/payment-gateways';

                const method = selectedGateway ? 'PUT' : 'POST';

                try {
                  const res = await fetch(url, {
                    method,
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                  });
                  const json = await res.json();
                  if (json.success) {
                    onToast(selectedGateway ? 'Payment gateway updated!' : 'Payment gateway connected!');
                    setDrawerOpen(false);
                    onRefresh();
                  }
                } catch (err) {
                  onToast('Error saving payment gateway.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Gateway Name</label>
                <input className="admin-input" name="name" defaultValue={selectedGateway?.name || ''} required placeholder="e.g. Paystack" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Public Key / App ID</label>
                <input className="admin-input" name="public_key" defaultValue={selectedGateway?.public_key || ''} placeholder="pk_live_..." />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Secret Key</label>
                <PasswordField className="admin-input" name="secret_key" defaultValue={selectedGateway?.secret_key || ''} placeholder="sk_live_..." />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Webhook Secret</label>
                <PasswordField className="admin-input" name="webhook_secret" defaultValue={selectedGateway?.webhook_secret || ''} placeholder="whsec_..." />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Callback URL</label>
                <input className="admin-input" name="callback_url" defaultValue={selectedGateway?.callback_url || ''} placeholder="https://api.getvnt.com/v1/payments/callback" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Environment Mode</label>
                <select className="admin-input" name="environment" defaultValue={selectedGateway?.environment || 'live'}>
                  <option value="live">Live (Production)</option>
                  <option value="test">Test (Sandbox)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Base Currency</label>
                <input className="admin-input" name="currency" defaultValue={selectedGateway?.currency || 'NGN'} required />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Transaction Fee Rate (%)</label>
                <input className="admin-input" type="number" step="0.01" name="transaction_fee_percent" defaultValue={selectedGateway?.transaction_fee_percent || '1.50'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Flat Fee per Transaction</label>
                <input className="admin-input" type="number" step="1" name="flat_fee" defaultValue={selectedGateway?.flat_fee || '100'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Status</label>
                <select className="admin-input" name="status" defaultValue={selectedGateway?.status || 'active'}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>Save Gateway</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDrawerOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enterprise Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText || 'Disconnect'}
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
