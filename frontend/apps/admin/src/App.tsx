import React, { useEffect, useState } from 'react';
import { IntegrationsNav, IntegrationTab } from './components/integrations/IntegrationsNav';
import { GetvntLogo } from './components/GetvntLogo';
import { DashboardView } from './components/integrations/DashboardView';
import { PlansManagerView } from './components/integrations/PlansManagerView';
import { UsersManagerView } from './components/integrations/UsersManagerView';
import { AiProvidersView } from './components/integrations/AiProvidersView';
import { AiRoutingView } from './components/integrations/AiRoutingView';
import { PaymentGatewaysView } from './components/integrations/PaymentGatewaysView';
import { CommissionRulesView } from './components/integrations/CommissionRulesView';
import { ApiVaultView } from './components/integrations/ApiVaultView';
import { CommunicationServicesView } from './components/integrations/CommunicationServicesView';
import { StorageProvidersView } from './components/integrations/StorageProvidersView';
import { AnalyticsServicesView } from './components/integrations/AnalyticsServicesView';
import { WebhooksView } from './components/integrations/WebhooksView';
import { MarketplaceView } from './components/integrations/MarketplaceView';
import { UsageAnalyticsView } from './components/integrations/UsageAnalyticsView';
import { AuditLogsView } from './components/integrations/AuditLogsView';
import { SystemSettingsView } from './components/integrations/SystemSettingsView';
import { BrandingSettingsView } from './components/integrations/BrandingSettingsView';
import { OperationsCustomerSuccessCenterView } from './components/integrations/OperationsCustomerSuccessCenterView';
import { NewsEntertainmentCenterView } from './components/integrations/NewsEntertainmentCenterView';
import { AuthProvidersView } from './components/integrations/AuthProvidersView';
import { LandingPageCmsView } from './components/integrations/LandingPageCmsView';
import { PlatformUpdateManagerView } from './components/integrations/PlatformUpdateManagerView';
import { FeatureFlagsView } from './components/integrations/FeatureFlagsView';
import { useResponsiveSidebar } from '../../../shared/src/hooks/useResponsiveSidebar';
import { apiClient, GeneralAiAssistantModal, PasswordField, getAppUrl } from '../../../shared/src';
import { CheckCircle, ShieldAlert, Menu, Lock, LogOut, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff, KeyRound, Bot, Globe, LayoutDashboard } from 'lucide-react';
import './styles.css';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Super Admin Dashboard Error Boundary Caught Exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', color: '#FFF', margin: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#F87171', marginBottom: '12px' }}>
            ⚠️ View Rendering Exception
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering this section.'}
          </p>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload Section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<IntegrationTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAdminAiModal, setShowAdminAiModal] = useState<boolean>(false);

  // Super Admin Authentication State
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('getvnt_admin_token'));
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('admin@getvnt.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Responsive Sidebar Control Hook
  const {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isCollapsed,
    isDrawerOpen,
    toggleSidebar,
    toggleMobileDrawer,
    closeMobileDrawer,
  } = useResponsiveSidebar();

  // Core Data States
  const [platformStats, setPlatformStats] = useState<any | null>(null);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [aiRoutes, setAiRoutes] = useState<any[]>([]);
  const [paymentGateways, setPaymentGateways] = useState<any[]>([]);
  const [commissionRules, setCommissionRules] = useState<any[]>([]);
  const [apiVaultKeys, setApiVaultKeys] = useState<any[]>([]);
  const [communicationServices, setCommunicationServices] = useState<any[]>([]);
  const [storageProviders, setStorageProviders] = useState<any[]>([]);
  const [analyticsServices, setAnalyticsServices] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [marketplaceApps, setMarketplaceApps] = useState<any[]>([]);

  useEffect(() => {
    if (adminToken) {
      verifyAdminUser(adminToken);
    } else {
      setAuthLoading(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken && adminUser) {
      fetchAllData();
    }
  }, [adminToken, adminUser]);

  const verifyAdminUser = async (tokenStr: string) => {
    try {
      const json = await apiClient.get('/auth/me', {
        headers: { 'Authorization': `Bearer ${tokenStr}` }
      });
      if (json.success && (json.data.role === 'super_admin' || json.data.role === 'platform_staff')) {
        setAdminUser(json.data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to verify admin user:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      const json = await apiClient.post('/auth/login', { email: loginEmail, password: loginPassword }, {
        headers: { 'X-App-Platform': 'super_admin_console' }
      });

      if (json.success) {
        const u = json.data.user;
        if (u.role === 'super_admin' || u.role === 'platform_staff') {
          setAdminToken(json.data.token);
          setAdminUser(u);
          localStorage.setItem('getvnt_admin_token', json.data.token);
          triggerToast('Super Admin authenticated successfully!');
        } else {
          setLoginError('Access Denied: Super Admin authorization required.');
        }
      } else {
        setLoginError(json.message || 'Invalid credentials.');
      }
    } catch (err) {
      setLoginError('Failed connecting to backend API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillCredentials = () => {
    setLoginEmail('admin@getvnt.com');
    setLoginPassword('password123');
    triggerToast('Demo Super Admin credentials auto-filled.');
  };

  const handleLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('getvnt_admin_token');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Body scroll lock effect for AI Assistant modal
  useEffect(() => {
    if (showAdminAiModal) {
      document.body.classList.add('body-scroll-lock');
    } else {
      document.body.classList.remove('body-scroll-lock');
    }
    return () => document.body.classList.remove('body-scroll-lock');
  }, [showAdminAiModal]);

  const fetchAllData = async () => {
    try {
      const [
        statsRes, dashRes, aiProvRes, aiRouteRes, payGateRes, commRes, vaultRes,
        commServRes, storageRes, analyticsRes, webhooksRes, mktRes
      ] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/integrations/dashboard'),
        apiClient.get('/admin/integrations/ai-providers'),
        apiClient.get('/admin/integrations/ai-routing'),
        apiClient.get('/admin/integrations/payment-gateways'),
        apiClient.get('/admin/integrations/commission-rules'),
        apiClient.get('/admin/integrations/api-vault'),
        apiClient.get('/admin/integrations/communication'),
        apiClient.get('/admin/integrations/storage'),
        apiClient.get('/admin/integrations/analytics'),
        apiClient.get('/admin/integrations/webhooks'),
        apiClient.get('/admin/integrations/marketplace'),
      ]);

      if (statsRes?.success) setPlatformStats(statsRes.data);
      if (dashRes?.success) setDashboardData(dashRes.data);
      if (aiProvRes?.success) setAiProviders(aiProvRes.data);
      if (aiRouteRes?.success) setAiRoutes(aiRouteRes.data);
      if (payGateRes?.success) setPaymentGateways(payGateRes.data);
      if (commRes?.success) setCommissionRules(commRes.data);
      if (vaultRes?.success) setApiVaultKeys(vaultRes.data);
      if (commServRes?.success) setCommunicationServices(commServRes.data);
      if (storageRes?.success) setStorageProviders(storageRes.data);
      if (analyticsRes?.success) setAnalyticsServices(analyticsRes.data);
      if (webhooksRes?.success) setWebhooks(webhooksRes.data);
      if (mktRes?.success) setMarketplaceApps(mktRes.data);
    } catch (err) {
      console.error('Failed fetching Super Admin data:', err);
    }
  };

  const isSmallScreen = isMobile || isTablet;

  if (authLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#060913', color: '#FFF' }}>
        <Sparkles size={36} color="#EF4444" className="animate-spin" />
      </div>
    );
  }

  // 1. SUPER ADMIN SIGN IN VIEW (When unauthenticated)
  if (!adminToken || !adminUser) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, #111827 0%, #060913 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="admin-card-glass" style={{ borderRadius: '28px', width: '100%', maxWidth: '440px', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <GetvntLogo variant="auto" theme="dark" mode="full" height={48} />
            <button type="button" onClick={handleQuickFillCredentials} className="quick-fill-btn">
              <KeyRound size={12} /> Auto-fill Demo
            </button>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>Super Admin Sign In</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginBottom: '24px', lineHeight: '1.5' }}>
            Enter platform operator credentials to access platform control plane, user directory & vault.
          </p>

          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#F87171', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px' }}>
              <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} /> {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Super Admin Email</label>
              <input
                type="email"
                required
                className="admin-input"
                placeholder="admin@getvnt.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '6px' }}>Security Password</label>
              <PasswordField
                required
                className="admin-input"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)', color: '#FFF', justifyContent: 'center', padding: '14px', fontWeight: 800, borderRadius: '12px' }}
            >
              {isSubmitting ? 'Authenticating...' : 'Authenticate & Enter Console'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#6B7280' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} /> 256-Bit Key Vault
            </span>
            <span className="admin-badge admin-badge-active" style={{ fontSize: '10px' }}>Sanctum Auth</span>
          </div>
        </div>
      </div>
    );
  }

  const getHeaderInfo = (tab: IntegrationTab) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Super Admin Control Plane',
          subtitle: 'Multi-tenant organization oversight, AI fleet telemetry & security vault.'
        };
      case 'operations_center':
        return {
          title: 'Operations & Customer Success Center',
          subtitle: 'Real-time support tickets, system health alerts & platform incident response.'
        };
      case 'users':
        return {
          title: 'User Directory & Role Architecture',
          subtitle: 'Super Admin operators, Organization Workspace Members & Marketplace Attendees.'
        };
      case 'plans':
        return {
          title: 'Subscription Plan Builder',
          subtitle: 'Configure subscription tiers, limits, features & platform commission rules.'
        };
      case 'ai_providers':
        return {
          title: 'AI Fleet Providers',
          subtitle: 'OpenAI, Anthropic, Gemini & DeepSeek API integrations & model settings.'
        };
      case 'ai_routing':
        return {
          title: 'AI Smart Routing Matrix',
          subtitle: 'Latency-based load balancing, token cost optimization & fallback rules.'
        };
      case 'payment_gateways':
        return {
          title: 'Settlement Payment Gateways',
          subtitle: 'Paystack, Flutterwave & Stripe credentials & payout routing.'
        };
      case 'commission_rules':
        return {
          title: 'Platform Commission & Revenue Rules',
          subtitle: 'Configure tier-based fees, organizer payout schedules & gateway splits.'
        };
      case 'api_vault':
        return {
          title: 'Security Credentials Vault',
          subtitle: 'AES-256 encrypted platform keys, webhooks & service account tokens.'
        };
      case 'communication':
        return {
          title: 'Messaging & Email Drivers',
          subtitle: 'SendGrid, Resend, Twilio & WhatsApp Gateway API settings.'
        };
      case 'storage':
        return {
          title: 'Media & Storage Drivers',
          subtitle: 'AWS S3, Cloudflare R2, Google Cloud Storage & local disk configurations.'
        };
      case 'analytics':
        return {
          title: 'Analytics & Telemetry Drivers',
          subtitle: 'PostHog, Segment, Mixpanel & Google Analytics 4 tracking.'
        };
      case 'webhooks':
        return {
          title: 'System Webhooks Engine',
          subtitle: 'Dispatch & retry automated webhooks on platform order events.'
        };
      case 'marketplace':
        return {
          title: 'App Marketplace Store',
          subtitle: 'Manage 3rd party plugins, integrations & developer apps.'
        };
      case 'usage_analytics':
        return {
          title: 'Platform Consumption Metrics',
          subtitle: 'Monitor API calls, storage bandwidth & AI token spend.'
        };
      case 'audit_logs':
        return {
          title: 'Security Audit Trail',
          subtitle: 'Full chronological history of all administrative actions & system events.'
        };
      case 'system_settings':
        return {
          title: 'Core Environment Settings',
          subtitle: 'Database connection parameters, maintenance mode & caching.'
        };
      case 'branding':
        return {
          title: 'White-Label Branding System',
          subtitle: 'Configure logos, dark/light themes & custom portal domains.'
        };
      case 'news_center':
        return {
          title: 'Pulse News & Entertainment Hub',
          subtitle: 'Manage world entertainment news, blog articles & dynamic RSS feeds.'
        };
      default:
        return {
          title: 'Super Admin Control Plane',
          subtitle: 'Database-driven platform overview & security vault.'
        };
    }
  };

  const currentHeader = getHeaderInfo(activeTab);

  return (
    <div className="admin-layout">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle size={18} color="#22C55E" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Sidebar */}
      <IntegrationsNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        isDrawerOpen={isDrawerOpen}
        isMobile={isMobile}
        isTablet={isTablet}
        onToggleSidebar={toggleSidebar}
        onCloseDrawer={closeMobileDrawer}
      />

      {/* Main Admin Content Container */}
      <main className={`admin-content ${isCollapsed ? 'collapsed' : ''}`}>
        <header className="admin-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              {isSmallScreen && (
                <button
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '8px', borderRadius: '10px' }}
                  onClick={toggleMobileDrawer}
                >
                  <Menu size={20} />
                </button>
              )}
              <GetvntLogo variant="auto" theme="dark" mode="icon" height={28} />
              <span className="admin-badge" style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                GETVNT Control Plane v1.0
              </span>
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                ● 100% Uptime
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#FFF' }}>
              {currentHeader.title}
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '3px' }}>
              {currentHeader.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={getAppUrl('marketplace')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', textDecoration: 'none', fontSize: '12.5px', fontWeight: 700, padding: '7px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Globe size={14} /> Marketplace
            </a>
            <a
              href={getAppUrl('workspace')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#06B6D4', textDecoration: 'none', fontSize: '12.5px', fontWeight: 700, padding: '7px 12px', background: 'rgba(6,182,212,0.1)', borderRadius: '10px', border: '1px solid rgba(6,182,212,0.2)' }}
            >
              <LayoutDashboard size={14} /> Organizer OS
            </a>

            {/* User Profile Capsule */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '8px 14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#FFF', fontSize: '13px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                SA
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFF', lineHeight: 1.2 }}>
                  {adminUser.first_name ? `${adminUser.first_name} ${adminUser.last_name || ''}` : adminUser.name}
                </div>
                <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444' }} /> Super Admin Operator
                </div>
              </div>
              <button className="header-icon-btn" title="Sign Out" onClick={handleLogout} style={{ marginLeft: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '8px', color: '#9CA3AF', cursor: 'pointer' }}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* View Switcher Wrapped in Error Boundary */}
        <ErrorBoundary key={activeTab}>
          {activeTab === 'dashboard' && (
            <DashboardView data={dashboardData} platformStats={platformStats} onNavigate={(tab) => setActiveTab(tab)} onToast={triggerToast} />
          )}

          {activeTab === 'operations_center' && (
            <OperationsCustomerSuccessCenterView onTriggerToast={triggerToast} />
          )}

          {activeTab === 'branding' && (
            <BrandingSettingsView onToast={triggerToast} />
          )}

          {activeTab === 'plans' && (
            <PlansManagerView onTriggerToast={triggerToast} />
          )}

          {activeTab === 'users' && (
            <UsersManagerView onTriggerToast={triggerToast} />
          )}

          {activeTab === 'ai_providers' && (
            <AiProvidersView providers={aiProviders} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'ai_routing' && (
            <AiRoutingView routes={aiRoutes} providers={aiProviders} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'payment_gateways' && (
            <PaymentGatewaysView gateways={paymentGateways} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'commission_rules' && (
            <CommissionRulesView rules={commissionRules} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'api_vault' && (
            <ApiVaultView vaultKeys={apiVaultKeys} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'communication' && (
            <CommunicationServicesView services={communicationServices} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'storage' && (
            <StorageProvidersView providers={storageProviders} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsServicesView analytics={analyticsServices} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'webhooks' && (
            <WebhooksView webhooks={webhooks} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView marketplace={marketplaceApps} onRefresh={fetchAllData} onToast={triggerToast} />
          )}

          {activeTab === 'news_center' && (
            <NewsEntertainmentCenterView onToast={triggerToast} />
          )}

          {activeTab === 'usage_analytics' && (
            <UsageAnalyticsView onToast={triggerToast} />
          )}

          {activeTab === 'audit_logs' && (
            <AuditLogsView onToast={triggerToast} />
          )}

          {activeTab === 'landing_cms' && (
            <LandingPageCmsView onToast={triggerToast} />
          )}

          {activeTab === 'auth_providers' && (
            <AuthProvidersView onToast={triggerToast} />
          )}

          {activeTab === 'feature_flags' && (
            <FeatureFlagsView onToast={triggerToast} />
          )}

          {activeTab === 'platform_updates' && (
            <PlatformUpdateManagerView onToast={triggerToast} />
          )}

          {activeTab === 'system_settings' && (
            <SystemSettingsView onToast={triggerToast} />
          )}
        </ErrorBoundary>

        {/* Floating Super Admin Platform AI Assistant Action Button */}
        <button
          className="admin-btn admin-btn-primary"
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 900,
            background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)', color: '#FFF',
            padding: '12px 20px', borderRadius: '99px', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '13px'
          }}
          onClick={() => setShowAdminAiModal(true)}
        >
          <Bot size={18} /> Platform AI Operations
        </button>

        {/* Specialized Platform AI Assistant Modal */}
        <GeneralAiAssistantModal
          isOpen={showAdminAiModal}
          onClose={() => setShowAdminAiModal(false)}
          onToast={triggerToast}
          moduleContext={
            activeTab === 'ai_providers' || activeTab === 'ai_routing' ? 'platform_providers' :
            activeTab === 'api_vault' ? 'platform_vault' :
            activeTab === 'operations_center' ? 'platform_operations' : 'platform_dashboard'
          }
        />
      </main>
    </div>
  );
}
