import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, Edit3 } from 'lucide-react';

interface Props {
  services: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const CommunicationServicesView: React.FC<Props> = ({ services, onRefresh, onToast }) => {
  const [testingId, setTestingId] = useState<number | null>(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const handleTest = async (id: number, name: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/v1/admin/integrations/communication/${id}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`✅ ${data.message}`);
      }
    } catch (err) {
      onToast('Failed to send test payload.');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Communication Services (Email, SMS, WhatsApp & Push)</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Configure transactional email dispatchers, SMS gateways, WhatsApp Business API, and Firebase Push notifications.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {services.map((svc) => (
          <div key={svc.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F472B6' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{svc.name}</h3>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Driver: {svc.type.toUpperCase()}</span>
                </div>
              </div>
              <span className={`admin-badge ${svc.status === 'active' ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                {svc.status.toUpperCase()}
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Sender Identity:</span>
                <span style={{ fontWeight: 600, color: '#FFF' }}>{svc.sender_id || 'tickets@getvnt.com'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Domain / Endpoint:</span>
                <span style={{ color: '#60A5FA' }}>{svc.domain || 'mail.getvnt.com'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Rate Limit:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>{svc.rate_limit_per_min} msg/min</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--admin-border)', paddingTop: '12px' }}>
              <button
                className="admin-btn admin-btn-success"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => handleTest(svc.id, svc.name)}
                disabled={testingId === svc.id}
              >
                <Send size={13} /> {testingId === svc.id ? 'Sending Ping...' : 'Send Test Dispatch'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
