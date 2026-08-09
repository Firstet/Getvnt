import React from 'react';
import { GetvntLogo } from '../GetvntLogo';
import {
  LayoutDashboard, Cpu, GitMerge, CreditCard, Percent, KeyRound,
  Mail, HardDrive, BarChart3, Webhook, Store, Activity, ShieldCheck, Settings,
  ShieldAlert, ChevronLeft, ChevronRight, X, Crown, Users, Palette, Rss, Globe, Flag, UploadCloud, Shield, Sparkles
} from 'lucide-react';

export type IntegrationTab =
  | 'dashboard'
  | 'operations_center'
  | 'branding'
  | 'landing_cms'
  | 'plans'
  | 'users'
  | 'verification'
  | 'auth_providers'
  | 'ai_providers'
  | 'ai_routing'
  | 'payment_gateways'
  | 'commission_rules'
  | 'api_vault'
  | 'communication'
  | 'storage'
  | 'analytics'
  | 'webhooks'
  | 'marketplace'
  | 'news_center'
  | 'usage_analytics'
  | 'audit_logs'
  | 'feature_flags'
  | 'platform_updates'
  | 'system_settings';

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
    // 1. Platform Overview
    { id: 'dashboard', label: 'Platform Dashboard', icon: LayoutDashboard, section: '1. Platform Overview' },
    { id: 'operations_center', label: 'Operations & Health Desk', icon: Activity, section: '1. Platform Overview' },
    { id: 'usage_analytics', label: 'Usage Telemetry', icon: BarChart3, section: '1. Platform Overview' },

    // 2. Identity & Verification
    { id: 'users', label: 'User Directory & Orgs', icon: Users, section: '2. Identity & Verification' },
    { id: 'auth_providers', label: 'OAuth & Identity Providers', icon: KeyRound, section: '2. Identity & Verification' },
    { id: 'audit_logs', label: 'Trust & Security Logs', icon: ShieldCheck, section: '2. Identity & Verification' },

    // 3. Marketplace
    { id: 'marketplace', label: 'Marketplace Catalog', icon: Store, section: '3. Marketplace' },
    { id: 'landing_cms', label: 'Promotions & CMS', icon: Globe, section: '3. Marketplace' },

    // 4. Financial Center
    { id: 'commission_rules', label: 'Commission Rules (5% Fee)', icon: Percent, section: '4. Financial Center' },
    { id: 'payment_gateways', label: 'Payment Gateways', icon: CreditCard, section: '4. Financial Center' },
    { id: 'plans', label: 'Subscription Tiers', icon: Crown, section: '4. Financial Center' },

    // 5. CMS & Media
    { id: 'branding', label: 'Platform Branding', icon: Palette, section: '5. CMS & Media' },
    { id: 'news_center', label: 'News & Media Hub', icon: Rss, section: '5. CMS & Media' },

    // 6. Website Builder
    { id: 'storage', label: 'Website Media Storage', icon: HardDrive, section: '6. Website Builder' },

    // 7. AI Center
    { id: 'ai_providers', label: 'AI LLM Providers Fleet', icon: Cpu, section: '7. AI Center' },
    { id: 'ai_routing', label: 'AI Routing Engine', icon: GitMerge, section: '7. AI Center' },

    // 8. Communications
    { id: 'communication', label: 'Email, SMS & WhatsApp', icon: Mail, section: '8. Communications' },
    { id: 'webhooks', label: 'Webhooks & Events', icon: Webhook, section: '8. Communications' },

    // 9. Platform Settings
    { id: 'feature_flags', label: 'Feature Flags & Modular OS', icon: Flag, section: '9. Platform Settings' },
    { id: 'api_vault', label: 'Encrypted API Vault', icon: KeyRound, section: '9. Platform Settings' },
    { id: 'platform_updates', label: 'Platform Updates', icon: UploadCloud, section: '9. Platform Settings' },
    { id: 'system_settings', label: 'System Configurations', icon: Settings, section: '9. Platform Settings' },
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
