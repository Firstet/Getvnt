import React, { useState, useEffect } from 'react';
import { Ticket, Heart, MessageSquare, Bell, User, Sparkles, ExternalLink, QrCode } from 'lucide-react';

interface AttendeeDashboardViewProps {
  user: any;
  verificationStatus: string;
  onBecomeOrganizer: () => void;
}

export const AttendeeDashboardView: React.FC<AttendeeDashboardViewProps> = ({
  user,
  verificationStatus,
  onBecomeOrganizer,
}) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'wishlist' | 'community' | 'notifications' | 'profile'>('tickets');
  const [tickets, setTickets] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) return;

    setLoading(true);
    fetch('/api/v1/attendee/tickets', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
      .then(res => res.json())
      .then(data => { if (data.success) setTickets(data.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch('/api/v1/attendee/wishlist', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
      .then(res => res.json())
      .then(data => { if (data.success) setWishlist(data.data || []); })
      .catch(() => {});

    fetch('/api/v1/attendee/notifications', {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
      .then(res => res.json())
      .then(data => { if (data.success) setNotifications(data.data || []); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#f8fafc' }}>
      
      {/* Become Organizer CTA Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        borderRadius: '20px',
        padding: '28px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 30px -5px rgba(124, 58, 237, 0.4)',
        marginBottom: '32px'
      }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> GETVNT Event OS • Attendee Identity
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, margin: '6px 0', color: '#ffffff' }}>
            Host Your Own Events &amp; Sell Tickets Global
          </h2>
          <p style={{ margin: 0, color: '#e0e7ff', fontSize: '14px', maxWidth: '640px', lineHeight: '1.5' }}>
            Complete your 2-minute business onboarding verification to unlock your Organizer Workspace, double-entry wallet, ticket management, and AI event assistant.
          </p>
        </div>

        <button
          onClick={onBecomeOrganizer}
          disabled={verificationStatus === 'pending'}
          style={{
            background: '#ffffff',
            color: '#4f46e5',
            fontWeight: 900,
            fontSize: '15px',
            padding: '14px 28px',
            borderRadius: '12px',
            border: 'none',
            cursor: verificationStatus === 'pending' ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap'
          }}
        >
          {verificationStatus === 'pending' ? '⏳ Onboarding Under Review...' : '🚀 Become Organizer Now'}
        </button>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '12px', marginBottom: '28px' }}>
        {[
          { key: 'tickets', label: `🎟️ My Tickets (${tickets.length})` },
          { key: 'wishlist', label: `❤️ Wishlist (${wishlist.length})` },
          { key: 'community', label: '💬 Community' },
          { key: 'notifications', label: `🔔 Notifications (${notifications.length})` },
          { key: 'profile', label: '👤 Profile & Settings' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background: activeTab === tab.key ? '#1e293b' : 'transparent',
              color: activeTab === tab.key ? '#60a5fa' : '#94a3b8',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: My Tickets */}
      {activeTab === 'tickets' && (
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Purchased Passes &amp; QR Codes</h3>
          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <div style={{ background: '#0f172a', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #1e293b' }}>
              <Ticket size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#94a3b8', fontSize: '15px', margin: '0 0 16px' }}>You have not purchased any event tickets yet.</p>
              <a href="https://getvnt.com" target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Browse Events on GETVNT Marketplace <ExternalLink size={14} />
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {tickets.map((t: any) => (
                <div key={t.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                  {t.qr_code_url ? (
                    <img src={t.qr_code_url} alt="QR Pass" style={{ width: '160px', height: '160px', borderRadius: '12px', background: '#fff', padding: '8px', margin: '0 auto 16px' }} />
                  ) : (
                    <div style={{ width: '160px', height: '160px', borderRadius: '12px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <QrCode size={48} color="#60a5fa" />
                    </div>
                  )}
                  <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: '#fff' }}>{t.event?.title || 'GETVNT Event Pass'}</h4>
                  <div style={{ color: '#34d399', fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>CODE: {t.ticket_code}</div>
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>Tier: {t.ticket_type?.name || 'General Admission'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '32px', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Attendee Account Settings</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Your personal identity information on GETVNT Event OS.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</label>
              <input type="text" value={user?.name || ''} readOnly style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</label>
              <input type="text" value={user?.email || ''} readOnly style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>Account Identity Role</label>
              <input type="text" value="Attendee Account (Default)" readOnly style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#60a5fa', fontSize: '14px', fontWeight: 700 }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
