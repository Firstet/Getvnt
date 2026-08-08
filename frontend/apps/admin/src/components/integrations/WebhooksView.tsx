import React, { useState } from 'react';
import { Webhook, Plus, Send, CheckCircle, Code, Clock } from 'lucide-react';

interface Props {
  webhooks: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const WebhooksView: React.FC<Props> = ({ webhooks, onRefresh, onToast }) => {
  const [testingId, setTestingId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const handleTestDelivery = async (id: number, url: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/v1/admin/integrations/webhooks/${id}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`✅ ${data.message}`);
        onRefresh();
      }
    } catch (err) {
      onToast('Failed to trigger test webhook payload.');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Webhook Endpoints & Real-Time Event Dispatcher</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Register endpoint URLs to receive instant HTTP callbacks for payments, ticket sales, check-ins, & refunds.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setDrawerOpen(true)}>
          <Plus size={16} /> Register Endpoint
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {webhooks.map((wh) => (
          <div key={wh.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{wh.name}</h3>
                <span style={{ fontFamily: 'monospace', color: '#60A5FA', fontSize: '13px' }}>{wh.endpoint_url}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="admin-badge admin-badge-active">HTTP 200 OK</span>
                <span className={`admin-badge ${wh.status === 'active' ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                  {wh.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Subscribed Events Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {wh.events &&
                wh.events.map((ev: string) => (
                  <span key={ev} style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                    {ev}
                  </span>
                ))}
            </div>

            {/* Payload Preview */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#34D399' }}>
              <div style={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '11px', fontWeight: 700 }}>PAYLOAD PREVIEW SAMPLE</div>
              {wh.payload_preview || '{"event": "ticket.issued", "order_id": "ORD-2026-9912", "amount": 15000}'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border)', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                Last Delivered: {wh.last_delivery_at ? new Date(wh.last_delivery_at).toLocaleTimeString() : '1 min ago'}
              </span>
              <button
                className="admin-btn admin-btn-success"
                style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={() => handleTestDelivery(wh.id, wh.endpoint_url)}
                disabled={testingId === wh.id}
              >
                <Send size={13} /> {testingId === wh.id ? 'Dispatching Ping...' : 'Trigger Test Ping'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Register Modal */}
      {drawerOpen && (
        <div className="modal-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Register Webhook Endpoint</h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  name: formData.get('name'),
                  endpoint_url: formData.get('endpoint_url'),
                  secret: formData.get('secret') || 'whsec_' + Math.random().toString(36).substring(2),
                  events: ['payment.success', 'ticket.issued', 'checkin.completed'],
                  status: 'active',
                };

                try {
                  const res = await fetch('/api/v1/admin/integrations/webhooks', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                  });
                  const json = await res.json();
                  if (json.success) {
                    onToast('Webhook Endpoint registered successfully!');
                    setDrawerOpen(false);
                    onRefresh();
                  }
                } catch (err) {
                  onToast('Error registering webhook.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Endpoint Label Name</label>
                <input className="admin-input" name="name" required placeholder="e.g. Primary ERP Sync Webhook" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>HTTPS Destination URL</label>
                <input className="admin-input" name="endpoint_url" required placeholder="https://api.yourdomain.com/webhooks" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Signing Secret (Optional)</label>
                <input className="admin-input" name="secret" placeholder="whsec_..." />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>Save Endpoint</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDrawerOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
