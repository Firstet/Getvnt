import React, { useState, useEffect } from 'react';
import { Activity, Cpu, CreditCard, Mail, HardDrive, AlertTriangle } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
}

export const UsageAnalyticsView: React.FC<Props> = ({ onToast }) => {
  const [analytics, setAnalytics] = useState<any | null>(null);

  const defaultAnalytics = {
    ai_summary: { total_requests: 0, tokens_used: 0, avg_response_time_ms: 0, total_cost_usd: '0.00' },
    payments_summary: { total_transactions: 0, total_gmv_ngn: 0, platform_commission: 0, gateway_success_rate_percent: 100 },
    communication_summary: { emails_sent: 0, sms_sent: 0 },
    storage_summary: { storage_used_gb: 0, bandwidth_gb: 0 },
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/admin/integrations/usage-analytics', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setAnalytics(json.data);
        else setAnalytics(defaultAnalytics);
      })
      .catch(() => setAnalytics(defaultAnalytics));
  }, []);

  if (!analytics) return <div style={{ color: '#9CA3AF', padding: '40px 0' }}>Loading Usage Telemetry...</div>;

  const { ai_summary, payments_summary, communication_summary, storage_summary } = analytics;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Usage Telemetry & Metering Analytics</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Comprehensive token consumption, API bandwidth, gateway volume, & storage billing metrics.
          </p>
        </div>
      </div>

      {/* 4 Category Metric Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {/* AI Metrics */}
        <div className="admin-card">
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} /> AI Providers Token Telemetry
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Total LLM Requests</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFF' }}>{ai_summary.total_requests.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Total Tokens Consumed</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B' }}>{(ai_summary.tokens_used / 1000000).toFixed(2)}M Tokens</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Avg LLM Response Time</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>{ai_summary.avg_response_time_ms}ms</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Total Billing Cost</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#34D399' }}>${ai_summary.total_cost_usd}</div>
            </div>
          </div>
        </div>

        {/* Payments Metrics */}
        <div className="admin-card">
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} /> Payment Gateways Volume & Success Rate
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Completed Transactions</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFF' }}>{payments_summary.total_transactions.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Processed GMV Volume</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#60A5FA' }}>₦{payments_summary.total_gmv_ngn.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Getvnt Platform Revenue</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B' }}>₦{payments_summary.platform_commission.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Gateway Success Rate</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>{payments_summary.gateway_success_rate_percent}%</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Communication */}
        <div className="admin-card">
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', color: '#EC4899', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={20} /> Communication Volume Dispatch
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>SendGrid Emails Sent</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>{communication_summary.emails_sent.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Twilio SMS Dispatched</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>{communication_summary.sms_sent.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="admin-card">
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', color: '#06B6D4', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={20} /> Cloud Storage & CDN Bandwidth
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Media Storage Used</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>{storage_summary.storage_used_gb} GB</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>CDN Outbound Bandwidth</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#60A5FA' }}>{storage_summary.bandwidth_gb} GB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
