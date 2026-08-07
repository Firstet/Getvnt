import React, { useState } from 'react';
import { Flag, Check, X, Shield, Sparkles, Save } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
}

export const FeatureFlagsView: React.FC<Props> = ({ onToast }) => {
  const [flags, setFlags] = useState<Record<string, Record<string, boolean>>>({
    ai_copywriter:       { starter: false, professional: true,  enterprise: true },
    qr_studio:           { starter: true,  professional: true,  enterprise: true },
    sponsorship_builder: { starter: false, professional: true,  enterprise: true },
    ticket_designer:     { starter: true,  professional: true,  enterprise: true },
    custom_branding:     { starter: false, professional: false, enterprise: true },
    multi_currency:      { starter: false, professional: true,  enterprise: true },
    custom_domain:       { starter: false, professional: false, enterprise: true },
    crm_loyalty:         { starter: false, professional: true,  enterprise: true },
  });

  const featureLabels: Record<string, { name: string; desc: string }> = {
    ai_copywriter:       { name: 'AI Copywriter & Pricing Advisor', desc: 'AI marketing text generation & dynamic ticket pricing.' },
    qr_studio:           { name: 'QR Ticket Verification Studio', desc: 'Offline QR check-in & access control scanner.' },
    sponsorship_builder: { name: 'Sponsorship Pitch Deck Builder', desc: 'Generate PDF sponsorship decks for event sponsors.' },
    ticket_designer:     { name: 'Visual Ticket Designer Desk', desc: 'Custom ticket badge canvas & PDF ticket generator.' },
    custom_branding:     { name: 'White-Label Branding & Logos', desc: 'Remove GETVNT watermark and use custom brand logos.' },
    multi_currency:      { name: 'Multi-Currency Gateways (Paystack/Stripe)', desc: 'Collect payments in NGN, USD, KES, GHS, EUR & GBP.' },
    custom_domain:       { name: 'Custom Domain Mapping (CNAME)', desc: 'Host event workspace on organizer\'s own domain name.' },
    crm_loyalty:         { name: 'Attendee CRM & Loyalty Engine', desc: 'Track VIP attendees, purchase history & email campaigns.' },
  };

  const handleToggle = (featureKey: string, tier: string) => {
    setFlags((prev) => ({
      ...prev,
      [featureKey]: {
        ...prev[featureKey],
        [tier]: !prev[featureKey]?.[tier],
      },
    }));
  };

  const handleSave = () => {
    onToast('✅ Feature flags & module permissions published globally across all plans!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Platform Feature Flags & Capability Matrix</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            Control which platform modules and enterprise tools are accessible for each subscription plan.
          </p>
        </div>

        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          <Save size={15} /> Save Capability Rules
        </button>
      </div>

      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--admin-border)', color: '#9CA3AF', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Feature / Capability Module</th>
                <th style={{ padding: '12px', textAlign: 'center', width: '120px' }}>Starter</th>
                <th style={{ padding: '12px', textAlign: 'center', width: '120px' }}>Professional</th>
                <th style={{ padding: '12px', textAlign: 'center', width: '120px' }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(featureLabels).map((key) => {
                const item = featureLabels[key];
                return (
                  <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 800, color: '#FFF' }}>{item.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '2px' }}>{item.desc}</div>
                    </td>

                    {['starter', 'professional', 'enterprise'].map((tier) => (
                      <td key={tier} style={{ padding: '14px 12px', textAlign: 'center' }}>
                        <button
                          type="button"
                          className="admin-btn"
                          onClick={() => handleToggle(key, tier)}
                          style={{
                            background: flags[key]?.[tier] ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                            color: flags[key]?.[tier] ? '#34D399' : '#F87171',
                            border: flags[key]?.[tier] ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {flags[key]?.[tier] ? <Check size={13} /> : <X size={13} />}
                          {flags[key]?.[tier] ? 'Enabled' : 'Disabled'}
                        </button>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
