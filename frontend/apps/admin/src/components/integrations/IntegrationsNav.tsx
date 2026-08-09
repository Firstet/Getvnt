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
    // 1. DASHBOARD & HEALTH
    { id: 'dashboard', label: 'Dashboard & Health', icon: LayoutDashboard, section: 'DASHBOARD' },
    
    // 2. MARKETPLACE & CMS
    { id: 'marketplace', label: 'Marketplace Catalog', icon: Store, section: 'MARKETPLACE' },
    { id: 'events', label: 'Events Moderation', icon: Calendar, section: 'MARKETPLACE' },
    { id: 'categories', label: 'Categories & Taxonomy', icon: Layers, section: 'MARKETPLACE' },
    { id: 'landing_cms', label: 'Landing Page CMS', icon: Palette, section: 'MARKETPLACE' },

    // 3. USERS & ORGANIZERS
    { id: 'users', label: 'User Directory & Roles', icon: Users, section: 'USERS' },
    { id: 'organizers', label: 'Organizers Directory', icon: Briefcase, section: 'USERS' },

    // 4. VERIFICATION & KYC
    { id: 'verification', label: 'Verification Center (KYC)', icon: ShieldAlert, section: 'VERIFICATION' },

    // 5. FINANCE & WALLETS
    { id: 'transactions', label: 'Transactions Log', icon: Activity, section: 'FINANCE' },
    { id: 'payouts', label: 'Payouts Settlement', icon: DollarSign, section: 'FINANCE' },
    { id: 'wallets', label: 'Platform Wallets & Vault', icon: Wallet, section: 'FINANCE' },
    { id: 'commission_rules', label: 'Platform Fees (5%)', icon: Percent, section: 'FINANCE' },
    { id: 'payment_gateways', label: 'Payment Gateways', icon: CreditCard, section: 'FINANCE' },

    // 6. PLATFORM & INTEGRATIONS
    { id: 'feature_flags', label: 'Feature Flags Engine', icon: Flag, section: 'PLATFORM' },
    { id: 'plans', label: 'Subscription Plans', icon: Crown, section: 'PLATFORM' },
    { id: 'ai_providers', label: 'AI Providers & Models', icon: Cpu, section: 'PLATFORM' },
    { id: 'api_vault', label: 'API Vault & Webhooks', icon: KeyRound, section: 'PLATFORM' },

    // 7. WEBSITES & DOMAINS
    { id: 'website_builder', label: 'Website Builder OS', icon: Globe, section: 'WEBSITES' },
    { id: 'domains', label: 'Domains & DNS Router', icon: Globe2, section: 'WEBSITES' },
    { id: 'templates', label: 'Category Templates', icon: LayoutDashboard, section: 'WEBSITES' },

    // 8. REPORTS & TELEMETRY
    { id: 'analytics', label: 'System Telemetry & Analytics', icon: BarChart3, section: 'REPORTS' },

    // 9. AUDIT LOGS & SECURITY
    { id: 'audit_logs', label: 'System Audit Logs', icon: ShieldCheck, section: 'AUDIT LOGS' },
    { id: 'security', label: 'Security & Anti-Fraud', icon: Lock, section: 'AUDIT LOGS' },

    // 10. SYSTEM SETTINGS
    { id: 'system_settings', label: 'Global Platform Settings', icon: Settings, section: 'SETTINGS' },
    { id: 'branding', label: 'Global Brand Registry', icon: Sparkles, section: 'SETTINGS' },
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
