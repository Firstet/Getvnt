import React, { useState } from 'react';
import { Activity, Download, TrendingUp, Users, Calendar } from 'lucide-react';

interface Props { token: string; overviewData: any; }

export function ReportsGrowth({ token, overviewData }: Props) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (reportType: string, format: string) => {
    setExporting(`${reportType}_${format}`);
    try {
      const res = await fetch(`/api/v1/admin/reports/${reportType}?format=${format}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `getvnt_${reportType}_report_${Date.now()}.${format}`;
        a.click();
      } else {
        alert('Report generation endpoint not implemented yet. Add GET /api/v1/admin/reports/{type}?format=csv|xlsx|pdf.');
      }
    } finally { setExporting(null); }
  };

  const o = overviewData || {};

  const reportCards = [
    { title: 'User Growth Report', key: 'users', icon: Users, description: 'Registration trends, churn, and role distribution over time.', color: '#3b82f6' },
    { title: 'Revenue Report', key: 'revenue', icon: TrendingUp, description: 'Gross ticket revenue, platform fees, net payouts by month.', color: '#34d399' },
    { title: 'Event Performance Report', key: 'events', icon: Calendar, description: 'Top-performing events, sell-out rates, category breakdown.', color: '#a855f7' },
    { title: 'Organizer Performance', key: 'organizers', icon: Activity, description: 'Top earners, event frequency, ticket volume per organizer.', color: '#f59e0b' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={22} color="#c084fc" /> Reports & Growth Analytics
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px' }}>
        Generate and download detailed platform reports in CSV, Excel, or PDF format.
      </p>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Users', value: o.total_users ?? '—', color: '#3b82f6' },
          { label: 'Total Events', value: o.total_events ?? '—', color: '#a855f7' },
          { label: 'Tickets Sold', value: o.tickets_sold_all_time ?? '—', color: '#34d399' },
          { label: 'Platform Revenue', value: o.platform_revenue_all_time ? `$${parseFloat(o.platform_revenue_all_time).toLocaleString()}` : '—', color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{s.label}</span>
            <div style={{ fontSize: '28px', fontWeight: 900, margin: '6px 0 0', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Report Download Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {reportCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.key} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: card.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={card.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>{card.title}</div>
                </div>
              </div>
              <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{card.description}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['csv', 'xlsx', 'pdf'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(card.key, fmt)}
                    disabled={exporting === `${card.key}_${fmt}`}
                    style={{ flex: 1, background: '#1e293b', border: `1px solid ${card.color}33`, color: card.color, padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Download size={12} />
                    {exporting === `${card.key}_${fmt}` ? '...' : fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
