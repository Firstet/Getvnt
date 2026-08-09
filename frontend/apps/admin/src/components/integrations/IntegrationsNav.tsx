import React from 'react';
import { GetvntLogo } from '../GetvntLogo';
import {
  LayoutDashboard, Cpu, GitMerge, CreditCard, Percent, KeyRound,
  Mail, HardDrive, BarChart3, Webhook, Store, Activity, ShieldCheck, Settings,
  ShieldAlert, ChevronLeft, ChevronRight, X, Crown, Users, Palette, Rss, Globe, Flag, UploadCloud, Shield, Sparkles,
  Calendar, Layers, DollarSign, Wallet, FileText, Image, MessageSquare, Lock, Globe2, Tag, Briefcase
} from 'lucide-react';

export type IntegrationTab =
  | 'dashboard'
  | 'marketplace'
  | 'organizers'
  | 'verification'
  | 'events'
  | 'categories'
  | 'transactions'
  | 'payouts'
  | 'wallets'
  | 'website_builder'
  | 'domains'
  | 'templates'
  | 'landing_cms'
  | 'blogs'
  | 'media'
  | 'ai_center'
  | 'communication'
  | 'marketing'
  | 'feature_flags'
  | 'plans'
  | 'commission_rules'
  | 'payment_gateways'
  | 'countries'
  | 'currencies'
  | 'roles'
  | 'permissions'
  | 'audit_logs'
  | 'security'
  | 'system_settings'
  | 'operations_center'
  | 'users'
  | 'ai_providers'
  | 'ai_routing'
  | 'api_vault'
  | 'storage'
  | 'analytics'
  | 'webhooks'
  | 'usage_analytics'
  | 'branding'
  | 'news_center'
  | 'auth_providers'
  | 'platform_updates';

interface Props {
  activeTab: IntegrationTab;
  setActiveTab: (tab: IntegrationTab) => void;
  isCollapsed: boolean;
  isDrawerOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  onToggleSidebar: () => void;
  onCloseDrawer: () => void;
}

export const IntegrationsNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  isDrawerOpen,
  isMobile,
  isTablet,
  onToggleSidebar,
  onCloseDrawer,
}) => {
  const menuItems = [
    // 1. Dashboard
    { id: 'dashboard', label: '1. Dashboard & Telemetry', icon: LayoutDashboard, section: 'CORE PLATFORM' },

    // 2. Identity & Access
    { id: 'users', label: '2. Identity & Access', icon: Users, section: 'GOVERNANCE' },

    // 3. Verification Center
    { id: 'verification', label: '3. Verification Center (KYC)', icon: ShieldAlert, section: 'GOVERNANCE' },

    // 4. Marketplace CMS
    { id: 'landing_cms', label: '4. Marketplace CMS', icon: Palette, section: 'STOREFRONT' },

    // 5. Event Management
    { id: 'events', label: '5. Event Management', icon: Calendar, section: 'STOREFRONT' },

    // 6. Financial Center
    { id: 'transactions', label: '6. Financial Center & Fees', icon: DollarSign, section: 'FINANCE' },

    // 7. Subscriptions
    { id: 'plans', label: '7. Subscriptions Builder', icon: Crown, section: 'FINANCE' },

    // 8. AI Control Center
    { id: 'ai_center', label: '8. AI Control Center', icon: Cpu, section: 'AI ENGINE' },

    // 9. Integrations
    { id: 'api_vault', label: '9. Integrations & API Vault', icon: KeyRound, section: 'INFRASTRUCTURE' },

    // 10. Platform Configuration
    { id: 'feature_flags', label: '10. Platform Configuration', icon: Flag, section: 'INFRASTRUCTURE' },

    // 11. Website Builder Manager
    { id: 'website_builder', label: '11. Website Builder Manager', icon: Globe, section: 'SITES & DOMAINS' },

    // 12. Reports
    { id: 'analytics', label: '12. Telemetry Reports', icon: BarChart3, section: 'ANALYTICS' },

    // 13. Audit Center
    { id: 'audit_logs', label: '13. Security Audit Center', icon: ShieldCheck, section: 'SECURITY' },

    // 14. Settings
    { id: 'system_settings', label: '14. Global Platform Settings', icon: Settings, section: 'SETTINGS' },
  ];

  let currentSection = '';
  const isOverlayDrawer = isMobile || isTablet;

  const sidebarContent = (
    <aside
      className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${isOverlayDrawer ? 'drawer' : ''}`}
      style={{
        width: isOverlayDrawer ? '280px' : isCollapsed ? '72px' : '280px',
        height: '100vh',
        position: isOverlayDrawer ? 'relative' : 'sticky',
        top: 0,
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header OS Logo */}
      <div className="admin-logo" style={{ justifyContent: isCollapsed && !isOverlayDrawer ? 'center' : 'space-between', flexShrink: 0, paddingBottom: '14px', borderBottom: '1px solid var(--admin-border)', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <GetvntLogo
            mode={isCollapsed && !isOverlayDrawer ? 'icon' : 'full'}
            variant="auto"
            theme="dark"
            height={isCollapsed && !isOverlayDrawer ? 32 : 42}
          />
        </div>
        {(!isCollapsed || isOverlayDrawer) && (
          <span style={{ fontSize: '10px', fontWeight: 900, background: 'linear-gradient(135deg, #7C3AED, #2563EB)', color: '#FFF', padding: '2px 8px', borderRadius: '99px', letterSpacing: '0.5px' }}>
            SUPER ADMIN OS
          </span>
        )}
        {isOverlayDrawer && (
          <button onClick={onCloseDrawer} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <ul className="admin-menu" style={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const showSection = item.section !== currentSection;
          if (showSection) currentSection = item.section;

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <React.Fragment key={item.id}>
              {showSection && (!isCollapsed || isOverlayDrawer) && (
                <div className="admin-menu-section-label" style={{ color: '#60A5FA', fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: '12px', marginBottom: '4px' }}>
                  {item.section}
                </div>
              )}
              <li
                className={`admin-menu-item ${isActive ? 'active' : ''}`}
                title={isCollapsed && !isOverlayDrawer ? item.label : undefined}
                style={{
                  justifyContent: isCollapsed && !isOverlayDrawer ? 'center' : 'flex-start',
                  padding: isCollapsed && !isOverlayDrawer ? '12px' : '9px 12px',
                }}
                onClick={() => {
                  setActiveTab(item.id as IntegrationTab);
                  if (isOverlayDrawer) onCloseDrawer();
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={17} />
                  {(!isCollapsed || isOverlayDrawer) && <span style={{ fontSize: '13px' }}>{item.label}</span>}
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </ul>

      {!isOverlayDrawer && (
        <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '12px', marginTop: 'auto', flexShrink: 0 }}>
          <button
            onClick={onToggleSidebar}
            className="admin-btn admin-btn-secondary"
            style={{
              width: '100%',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              padding: '8px 12px',
              fontSize: '12px',
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!isCollapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      )}
    </aside>
  );

  if (isOverlayDrawer) {
    if (!isDrawerOpen) return null;
    return (
      <div className="modal-overlay" style={{ justifyContent: 'flex-start' }} onClick={onCloseDrawer}>
        <div onClick={(e) => e.stopPropagation()} style={{ height: '100%' }}>
          {sidebarContent}
        </div>
      </div>
    );
  }

  return sidebarContent;
};
