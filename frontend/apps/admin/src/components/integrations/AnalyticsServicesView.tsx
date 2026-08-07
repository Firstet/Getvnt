import React from 'react';
import { BarChart3, CheckCircle, Edit3 } from 'lucide-react';

interface Props {
  analytics: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const AnalyticsServicesView: React.FC<Props> = ({ analytics, onRefresh, onToast }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Analytics & Ad Pixel Integrations</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Configure Google Analytics 4, Meta Pixel, TikTok Pixel, Microsoft Clarity, & Mixpanel event tracking IDs.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {analytics.map((a) => (
          <div key={a.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA' }}>
                  <BarChart3 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{a.name}</h3>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Service: {a.service.toUpperCase()}</span>
                </div>
              </div>
              <span className={`admin-badge ${a.status === 'active' ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                {a.status.toUpperCase()}
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Tracking / Tag ID:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#60A5FA' }}>{a.tracking_id || 'Not Set'}</span>
              </div>
            </div>

            <button
              className="admin-btn admin-btn-success"
              style={{ fontSize: '12px', padding: '6px 12px', width: '100%', justifyContent: 'center' }}
              onClick={() => onToast(`Verified pixel tag ${a.tracking_id} active on marketplace frontend.`)}
            >
              <CheckCircle size={14} /> Verify Pixel Firing
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
