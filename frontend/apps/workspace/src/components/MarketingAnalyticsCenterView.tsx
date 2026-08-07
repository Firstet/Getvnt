import React, { useState } from 'react';
import {
  Share2, BarChart3, TrendingUp, DollarSign, Sparkles, MessageSquare,
  Mail, Globe, ShieldCheck, ArrowUpRight, Zap, Target, PieChart
} from 'lucide-react';

export const MarketingAnalyticsCenterView: React.FC<{ onTriggerToast: (msg: string) => void }> = ({ onTriggerToast }) => {
  const [selectedChannel, setSelectedChannel] = useState('all');

  const channels = [
    { id: 'email', name: 'Email Campaigns', clicks: 14200, sales: '₦12.4M', conv: '4.8%' },
    { id: 'sms', name: 'SMS Broadcasts', clicks: 8900, sales: '₦6.2M', conv: '5.2%' },
    { id: 'whatsapp', name: 'WhatsApp VIP', clicks: 12400, sales: '₦8.9M', conv: '6.4%' },
    { id: 'instagram', name: 'Instagram Ads', clicks: 18400, sales: '₦4.8M', conv: '2.1%' },
    { id: 'facebook', name: 'Facebook Ads', clicks: 9200, sales: '₦1.9M', conv: '1.8%' },
    { id: 'tiktok', name: 'TikTok Viral', clicks: 22100, sales: '₦3.4M', conv: '3.1%' },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #06B6D4, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={20} color="#FFF" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: 0 }}>
              Marketing Center & AI Insights
            </h1>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            Multi-channel campaign tracking across Email, SMS, WhatsApp, Instagram, TikTok, Facebook, and Meta Ads.
          </p>
        </div>

        <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF' }} onClick={() => onTriggerToast('Syncing live ad attribution data...')}>
          <Sparkles size={16} /> Run AI Attribution Audit
        </button>
      </div>

      {/* AI Insights Bar */}
      <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '20px', padding: '20px', marginBottom: '28px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} /> AI Explains Your Marketing Performance
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#D1D5DB' }}>
            💡 <strong style={{ color: '#FFF' }}>WhatsApp VIP Broadcasts</strong> generated 68% of all early bird sales with an outstanding 6.4% conversion rate.
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#D1D5DB' }}>
            💡 <strong style={{ color: '#FFF' }}>Instagram Ad Traffic</strong> declined 12% last week due to saturated audience targeting. AI recommends refreshing video creative.
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#D1D5DB' }}>
            💡 <strong style={{ color: '#FFF' }}>Corporate & Tech Executives</strong> converted most frequently on VIP tickets via LinkedIn campaign links.
          </div>
        </div>
      </div>

      {/* Multi-Channel Table */}
      <div style={{ background: 'rgba(13, 17, 32, 0.85)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 800, fontSize: '16px', color: '#FFF' }}>
          Channel Performance Breakdown
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#07090F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>Channel</th>
              <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>Link Clicks</th>
              <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>Revenue Attributed</th>
              <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>Conversion Rate</th>
              <th style={{ padding: '14px 20px', color: '#9CA3AF', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => (
              <tr key={ch.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '14px 20px', fontWeight: 800, color: '#FFF' }}>{ch.name}</td>
                <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{ch.clicks.toLocaleString()} clicks</td>
                <td style={{ padding: '14px 20px', fontWeight: 800, color: '#34D399' }}>{ch.sales}</td>
                <td style={{ padding: '14px 20px', color: '#60A5FA', fontWeight: 800 }}>{ch.conv}</td>
                <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                  <button className="btn-cta" style={{ padding: '6px 12px', fontSize: '11.5px', background: 'rgba(79,70,229,0.2)', color: '#A5B4FC' }} onClick={() => onTriggerToast(`Optimizing ${ch.name} via AI...`)}>
                    Boost Campaign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
