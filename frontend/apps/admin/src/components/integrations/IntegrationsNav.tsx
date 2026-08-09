import React from 'react';
import { GetvntLogo } from '../GetvntLogo';
import {
  LayoutDashboard, Cpu, GitMerge, CreditCard, Percent, KeyRound,
  Mail, HardDrive, BarChart3, Webhook, Store, Activity, ShieldCheck, Settings,
  ShieldAlert, ChevronLeft, ChevronRight, X, Crown, Users, Palette, Rss, Globe, Flag, UploadCloud, Shield, Sparkles,
  Calendar, Layers, DollarSign, Wallet, FileText, Image, MessageSquare, Lock, Globe2, Tag
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
    // 1. Platform Overview
    { id: 'dashboard', label: 'Platform Overview', icon: LayoutDashboard, section: 'OVERVIEW' },
    
    // 2. Core Marketplace & Events
    { id: 'marketplace', label: 'Marketplace Catalog', icon: Store, section: 'MARKETPLACE & EVENTS' },
    { id: 'events', label: 'Events Moderation', icon: Calendar, section: 'MARKETPLACE & EVENTS' },
    { id: 'categories', label: 'Categories & Taxonomy', icon: Layers, section: 'MARKETPLACE & EVENTS' },

    // 3. Organizers & KYC Verification
    { id: 'organizers', label: 'Organizers Directory', icon: Users, section: 'ORGANIZERS & KYC' },
    { id: 'verification', label: 'Verification Center', icon: ShieldAlert, section: 'ORGANIZERS & KYC' },

    // 4. Financial Center
    { id: 'transactions', label: 'Transactions Log', icon: Activity, section: 'FINANCIAL CENTER' },
    { id: 'payouts', label: 'Payouts Settlement', icon: DollarSign, section: 'FINANCIAL CENTER' },
    { id: 'wallets', label: 'Platform Wallets & Vault', icon: Wallet, section: 'FINANCIAL CENTER' },
    { id: 'commission_rules', label: 'Platform Fees (5%)', icon: Percent, section: 'FINANCIAL CENTER' },
    { id: 'payment_gateways', label: 'Payment Gateways', icon: CreditCard, section: 'FINANCIAL CENTER' },
    { id: 'plans', label: 'Subscription Plans', icon: Crown, section: 'FINANCIAL CENTER' },

    // 5. Website Builder & CMS
    { id: 'website_builder', label: 'Website Builder OS', icon: Globe, section: 'WEBSITE BUILDER & CMS' },
    { id: 'domains', label: 'Domains & DNS Router', icon: Globe2, section: 'WEBSITE BUILDER & CMS' },
    { id: 'templates', label: 'Event Category Templates', icon: LayoutDashboard, section: 'WEBSITE BUILDER & CMS' },
    { id: 'landing_cms', label: 'Landing Page CMS', icon: Palette, section: 'WEBSITE BUILDER & CMS' },
    { id: 'blogs', label: 'GetVNT Pulse Blogs', icon: Rss, section: 'WEBSITE BUILDER & CMS' },
    { id: 'media', label: 'Media Assets Library', icon: Image, section: 'WEBSITE BUILDER & CMS' },

    // 6. AI & Communications
    { id: 'ai_center', label: 'AI Engine Center', icon: Cpu, section: 'AI & COMMUNICATIONS' },
    { id: 'communication', label: 'Communications & SMS', icon: Mail, section: 'AI & COMMUNICATIONS' },
    { id: 'marketing', label: 'Promotions & Coupons', icon: Tag, section: 'AI & COMMUNICATIONS' },

    // 7. Governance, Security & Settings
    { id: 'feature_flags', label: 'Feature Flags & Modular OS', icon: Flag, section: 'GOVERNANCE & SECURITY' },
    { id: 'countries', label: 'Countries & Regions', icon: Globe, section: 'GOVERNANCE & SECURITY' },
    { id: 'currencies', label: 'Currencies & Rates', icon: DollarSign, section: 'GOVERNANCE & SECURITY' },
    { id: 'roles', label: 'Roles & Staff', icon: Shield, section: 'GOVERNANCE & SECURITY' },
    { id: 'permissions', label: 'RBAC Permissions Matrix', icon: KeyRound, section: 'GOVERNANCE & SECURITY' },
    { id: 'audit_logs', label: 'System Audit Logs', icon: ShieldCheck, section: 'GOVERNANCE & SECURITY' },
    { id: 'security', label: 'Security & Anti-Fraud', icon: Lock, section: 'GOVERNANCE & SECURITY' },
    { id: 'system_settings', label: 'Platform System Settings', icon: Settings, section: 'GOVERNANCE & SECURITY' },
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
