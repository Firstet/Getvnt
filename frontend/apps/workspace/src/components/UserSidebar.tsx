import React from 'react';
import {
  House, Compass, Ticket, Heart, Users, Bell, Building2, Settings, Crown, LogOut
} from 'lucide-react';
import { IconContainer } from '../../../../shared/src';

interface UserSidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  userName = 'Valued Attendee',
  userEmail = 'user@getvnt.com',
}) => {
  const menuGroups = [
    {
      category: 'DISCOVERY',
      items: [
        { id: 'dashboard',      icon: <IconContainer icon={House}    color="#38BDF8" bg="rgba(56,189,248,0.12)" containerSize={26} size={14} />, label: 'Home' },
        { id: 'explore_events', icon: <IconContainer icon={Compass}  color="#60A5FA" bg="rgba(96,165,250,0.12)" containerSize={26} size={14} />, label: 'Explore Events' },
      ]
    },
    {
      category: 'MY ACTIVITY',
      items: [
        { id: 'my_tickets',     icon: <IconContainer icon={Ticket}   color="#FBBF24" bg="rgba(245,158,11,0.12)" containerSize={26} size={14} />, label: 'My Tickets' },
        { id: 'saved_events',   icon: <IconContainer icon={Heart}    color="#F472B6" bg="rgba(244,114,182,0.12)" containerSize={26} size={14} />, label: 'Wishlist' },
        { id: 'following',      icon: <IconContainer icon={Users}    color="#A5B4FC" bg="rgba(165,180,252,0.12)" containerSize={26} size={14} />, label: 'Community' },
        { id: 'messages',       icon: <IconContainer icon={Bell}     color="#34D399" bg="rgba(16,185,129,0.12)" containerSize={26} size={14} />, label: 'Messages' },
        { id: 'notifications',  icon: <IconContainer icon={Bell}     color="#38BDF8" bg="rgba(56,189,248,0.12)" containerSize={26} size={14} />, label: 'Notifications' },
      ]
    },
    {
      category: 'ACCOUNT',
      items: [
        { id: 'profile',        icon: <IconContainer icon={Building2} color="#C084FC" bg="rgba(192,132,252,0.12)" containerSize={26} size={14} />, label: 'Profile' },
        { id: 'settings',       icon: <IconContainer icon={Settings}  color="#94A3B8" bg="rgba(148,163,184,0.12)" containerSize={26} size={14} />, label: 'Settings' },
      ]
    },
    {
      category: 'GROWTH',
      items: [
        { id: 'onboarding',     icon: <IconContainer icon={Crown}     color="#FBBF24" bg="rgba(245,158,11,0.18)" containerSize={26} size={14} />, label: 'Become an Organizer' },
      ]
    }
  ];

  return (
    <aside style={{
      width: 250,
      minHeight: '100vh',
      backgroundColor: '#090D16',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 16px',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ padding: '0 8px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-[#38BDF8], #0284C7', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#fff', fontSize: 16 }}>
            V
          </div>
          <div>
            <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>GETVNT</div>
            <div style={{ color: '#38BDF8', fontSize: 11, fontWeight: 600 }}>Attendee OS</div>
          </div>
        </div>

        {menuGroups.map((grp) => (
          <div key={grp.category} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', padding: '0 8px 6px' }}>
              {grp.category}
            </div>
            {grp.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: isActive ? 'rgba(56,189,248,0.12)' : 'transparent',
                    color: isActive ? '#38BDF8' : '#94A3B8',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    marginBottom: 2
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        <div style={{ padding: '0 8px 12px' }}>
          <div style={{ color: '#F8FAFC', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userName}
          </div>
          <div style={{ color: '#64748B', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userEmail}
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 10px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: 'rgba(239,68,68,0.08)',
            color: '#F87171',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
