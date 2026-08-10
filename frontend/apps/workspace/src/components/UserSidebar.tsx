import React from 'react';
import {
  Home, Ticket, Heart, MessageSquare, Bell, User, Settings, Sparkles,
  LayoutDashboard, Calendar, ShoppingCart, Users, Wallet, BarChart3,
  Megaphone, Globe, Bot, ShieldCheck, LogOut, Award, Zap
} from 'lucide-react';

interface UserSidebarProps {
  role: 'attendee' | 'trusted_organizer' | 'organizer_pro' | 'super_admin';
  verificationStatus: 'unverified' | 'pending' | 'approved' | 'rejected';
  subscriptionPlan: 'starter' | 'pro' | 'enterprise';
  verifiedBadge: boolean;
  activeView: string;
  onSelectView: (view: string) => void;
  onOpenBecomeOrganizer: () => void;
  onLogout: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  role,
  verificationStatus,
  subscriptionPlan,
  verifiedBadge,
  activeView,
  onSelectView,
  onOpenBecomeOrganizer,
  onLogout,
}) => {
  const isOrganizer = role === 'trusted_organizer' || role === 'super_admin' || verificationStatus === 'approved';
  const isPro = subscriptionPlan === 'pro' || subscriptionPlan === 'enterprise' || role === 'super_admin';

  const attendeeNav = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'tickets', label: 'My Tickets & Passes', icon: Ticket },
    { key: 'wishlist', label: 'Saved Wishlist', icon: Heart },
    { key: 'community', label: 'Community', icon: MessageSquare },
    { key: 'messages', label: 'Direct Messages', icon: MessageSquare },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const organizerNav = [
    { key: 'dashboard', label: 'Overview & Analytics', icon: LayoutDashboard },
    { key: 'events', label: 'Events Directory', icon: Calendar },
    { key: 'orders', label: 'Ticket Orders', icon: ShoppingCart },
    { key: 'tickets_inventory', label: 'Tickets & QR Scanner', icon: Ticket },
    { key: 'customers', label: 'Customers & CRM', icon: Users },
    { key: 'wallet', label: 'Wallet & Payout OS', icon: Wallet },
    { key: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
    { key: 'marketing', label: 'Marketing & Campaigns', icon: Megaphone },
    { key: 'community', label: 'Community Hub', icon: MessageSquare },
    { key: 'ai_assistant', label: 'AI Operations Assistant', icon: Bot },
    { key: 'settings', label: 'Organization Profile', icon: Settings },
  ];

  const proNav = [
    { key: 'website_builder', label: 'Pro Website Builder', icon: Globe, badge: 'PRO' },
    { key: 'automation', label: 'Automation Rules', icon: Zap, badge: 'PRO' },
  ];

  return (
    <aside style={{ width: '280px', background: '#0f172a', borderRight: '1px solid #1e293b', padding: '24px 16px', display: 'flex', flexDirection: 'column', color: '#f8fafc' }}>
      
      {/* Brand Logo Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '20px' }}>
          G
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>GETVNT OS</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <span style={{ fontSize: '11px', color: isOrganizer ? '#34d399' : '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>
              {isOrganizer ? (isPro ? 'ORGANIZER PRO' : 'TRUSTED ORGANIZER') : 'ATTENDEE ACCOUNT'}
            </span>
            {verifiedBadge && <ShieldCheck size={12} color="#34d399" />}
          </div>
        </div>
      </div>

      {/* Become Organizer CTA Banner for Attendee */}
      {!isOrganizer && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Sparkles size={14} /> Host & Sell Tickets
          </div>
          <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
            {verificationStatus === 'pending'
              ? 'Your onboarding request is currently under review by Super Admin.'
              : 'Verify your business identity to unlock Organizer Workspace.'}
          </p>
          <button
            onClick={onOpenBecomeOrganizer}
            disabled={verificationStatus === 'pending'}
            style={{
              width: '100%',
              background: verificationStatus === 'pending' ? '#334155' : 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              cursor: verificationStatus === 'pending' ? 'not-allowed' : 'pointer'
            }}
          >
            {verificationStatus === 'pending' ? '⏳ Under Review...' : '🚀 Become Organizer Now'}
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '8px 12px 4px' }}>
          {!isOrganizer ? 'Attendee Dashboard' : 'Organizer Workspace'}
        </div>

        {(!isOrganizer ? attendeeNav : organizerNav).map(item => {
          const IconC = item.icon;
          const isActive = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectView(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: isActive ? '#1e293b' : 'transparent',
                color: isActive ? '#60a5fa' : '#94a3b8',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <IconC size={18} color={isActive ? '#60a5fa' : '#94a3b8'} />
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        })}

        {/* Pro Navigation Items */}
        {isOrganizer && (
          <>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', padding: '16px 12px 4px' }}>
              Organizer Pro Tools
            </div>
            {proNav.map(item => {
              const IconC = item.icon;
              const isActive = activeView === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectView(item.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: isActive ? '#1e293b' : 'transparent',
                    color: isActive ? '#c084fc' : '#94a3b8',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <IconC size={18} color={isActive ? '#c084fc' : '#94a3b8'} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: '9px', fontWeight: 900, background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* Footer Logout */}
      <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', marginTop: '16px' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'transparent',
            color: '#f87171',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>

    </aside>
  );
};
