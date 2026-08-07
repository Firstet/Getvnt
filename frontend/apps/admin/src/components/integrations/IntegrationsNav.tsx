import React from 'react';
import { GetvntLogo } from '../GetvntLogo';
import {
  LayoutDashboard, Cpu, GitMerge, CreditCard, Percent, KeyRound,
  Mail, HardDrive, BarChart3, Webhook, Store, Activity, ShieldCheck, Settings,
  ShieldAlert, ChevronLeft, ChevronRight, X, Crown, Users, Palette, Rss, Globe, Flag, UploadCloud, Shield
} from 'lucide-react';

export type IntegrationTab =
  | 'dashboard'
  | 'operations_center'
  | 'branding'
  | 'landing_cms'
  | 'plans'
  | 'users'
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core Overview' },
    { id: 'operations_center', label: 'Operations & Health Desk', icon: Activity, section: 'Core Overview' },
    { id: 'branding', label: 'Platform Branding & Media', icon: Palette, section: 'Core Overview' },
    { id: 'landing_cms', label: 'Landing Page CMS & Pages', icon: Globe, section: 'Core Overview' },
    { id: 'plans', label: 'Subscription Plans', icon: Crown, section: 'Subscriptions & Users' },
    { id: 'users', label: 'User Directory & Orgs', icon: Users, section: 'Subscriptions & Users' },
    { id: 'auth_providers', label: 'OAuth & Identity Providers', icon: KeyRound, section: 'Credentials' },
    { id: 'ai_providers', label: 'AI Providers', icon: Cpu, section: 'AI Engine' },
    { id: 'ai_routing', label: 'AI Routing', icon: GitMerge, section: 'AI Engine' },
    { id: 'payment_gateways', label: 'Payment Gateways', icon: CreditCard, section: 'Finance' },
    { id: 'commission_rules', label: 'Commission Rules', icon: Percent, section: 'Finance' },
    { id: 'api_vault', label: 'API Key Vault', icon: KeyRound, section: 'Credentials' },
    { id: 'communication', label: 'Communication Services', icon: Mail, section: 'Services' },
    { id: 'storage', label: 'Storage Providers', icon: HardDrive, section: 'Services' },
    { id: 'analytics', label: 'Analytics Services', icon: BarChart3, section: 'Services' },
    { id: 'webhooks', label: 'Webhooks & Events', icon: Webhook, section: 'Integrations' },
    { id: 'marketplace', label: 'Marketplace Catalog', icon: Store, section: 'Integrations' },
    { id: 'news_center', label: 'News & Media Hub', icon: Rss, section: 'Integrations' },
    { id: 'usage_analytics', label: 'Usage Analytics', icon: Activity, section: 'Monitoring' },
    { id: 'audit_logs', label: 'Audit Logs', icon: ShieldCheck, section: 'Security' },
    { id: 'feature_flags', label: 'Feature Flags & Capabilities', icon: Flag, section: 'Platform Engine' },
    { id: 'platform_updates', label: 'Platform Update Manager', icon: UploadCloud, section: 'Platform Engine' },
    { id: 'system_settings', label: 'Tenant BYOK & Rules', icon: Settings, section: 'Configuration' },
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
      <div className="admin-logo" style={{ justifyContent: isCollapsed && !isOverlayDrawer ? 'center' : 'space-between', flexShrink: 0, paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <GetvntLogo
            mode={isCollapsed && !isOverlayDrawer ? 'icon' : 'full'}
            variant="auto"
            theme="dark"
            height={isCollapsed && !isOverlayDrawer ? 32 : 42}
          />
        </div>
        {isOverlayDrawer && (
          <button
            onClick={onCloseDrawer}
            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
          >
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
                <div className="admin-menu-section-label">{item.section}</div>
              )}
              <li
                className={`admin-menu-item ${isActive ? 'active' : ''}`}
                title={isCollapsed && !isOverlayDrawer ? item.label : undefined}
                style={{
                  justifyContent: isCollapsed && !isOverlayDrawer ? 'center' : 'flex-start',
                  padding: isCollapsed && !isOverlayDrawer ? '12px' : '10px 14px',
                }}
                onClick={() => {
                  setActiveTab(item.id as IntegrationTab);
                  if (isOverlayDrawer) onCloseDrawer();
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} />
                  {(!isCollapsed || isOverlayDrawer) && <span>{item.label}</span>}
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
