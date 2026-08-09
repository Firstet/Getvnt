import React, { useState, useEffect } from 'react';
import {
  House, PackagePlus, CreditCard, Settings, LogOut,
  ArrowRight, AlertCircle, ChevronRight, CheckCircle2,
  Check, Crown, Sparkles, TrendingUp, Users, Ticket,
  BarChart3, Calendar, MapPin, Key, DollarSign,
  Bell, Menu, X, RefreshCw, Building2, Globe,
  ShieldCheck, Zap, Upload, Image as ImageIcon, ShieldAlert,
  Eye, EyeOff, Compass
} from 'lucide-react';
import {
  AuthProvider, useAuth, getRoleBadgeLabel, GeneralAiAssistantModal, PasswordField,
  IconContainer, LazyLogo, SkeletonDashboard, SkeletonTable, SkeletonCanvas,
  SkeletonCardGrid, RouteErrorBoundary, AppLoader, BrandLogo,
  SaaSAuthModal, SaaSOnboardingWizard, SaaSVerificationBanner, getAppUrl, apiClient
} from '../../../shared/src';
import { useBrand } from '../../../shared/src/context/BrandContext';
import { AiAssistantHub } from './components/AiAssistantHub';
import { AppcuesTourEngine } from './components/AppcuesTourEngine';
import { EventCreationWizardModal } from './components/EventCreationWizardModal';
import { AndroidAppModal } from './components/AndroidAppModal';
import { MobileAppResourceCard } from './components/MobileAppResourceCard';
import { Bot, QrCode, Palette as PaletteIcon, Share2, Award, Briefcase, Tag, Smartphone } from 'lucide-react';
import './styles.css';

// ─── LAZY LOADED ROUTE COMPONENTS WITH PRELOAD SUPPORTS ──────────────────────
const QrStudioViewLazy = React.lazy(() => import('./components/QrStudioView').then(m => ({ default: m.QrStudioView })));
const TicketDesignerDeskLazy = React.lazy(() => import('./components/TicketDesignerDesk').then(m => ({ default: m.TicketDesignerDesk })));
const PromotionAdStudioLazy = React.lazy(() => import('./components/PromotionAdStudio').then(m => ({ default: m.PromotionAdStudio })));
const CrmLoyaltyViewLazy = React.lazy(() => import('./components/CrmLoyaltyView').then(m => ({ default: m.CrmLoyaltyView })));
const SponsorshipDeckBuilderLazy = React.lazy(() => import('./components/SponsorshipDeckBuilder').then(m => ({ default: m.SponsorshipDeckBuilder })));
const AutomationRulesEngineViewLazy = React.lazy(() => import('./components/AutomationRulesEngineView').then(m => ({ default: m.AutomationRulesEngineView })));
const MarketingAnalyticsCenterViewLazy = React.lazy(() => import('./components/MarketingAnalyticsCenterView').then(m => ({ default: m.MarketingAnalyticsCenterView })));
const EventWebsiteBuilderViewLazy = React.lazy(() => import('./components/EventWebsiteBuilderView').then(m => ({ default: m.EventWebsiteBuilderView })));

// Route Prefetch Map
const preloadedRoutes = new Set<string>();
const prefetchRoute = (routeId: string) => {
  if (preloadedRoutes.has(routeId)) return;
  preloadedRoutes.add(routeId);
  switch (routeId) {
    case 'qr_studio': import('./components/QrStudioView'); break;
    case 'ticket_designer': import('./components/TicketDesignerDesk'); break;
    case 'ad_studio': import('./components/PromotionAdStudio'); break;
    case 'crm': import('./components/CrmLoyaltyView'); break;
    case 'sponsorship': import('./components/SponsorshipDeckBuilder'); break;
    case 'automation': import('./components/AutomationRulesEngineView'); break;
    case 'marketing': import('./components/MarketingAnalyticsCenterView'); break;
    case 'website_builder': import('./components/EventWebsiteBuilderView'); break;
  }
};

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="toast" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <CheckCircle2 size={16} color="#34D399" />
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', marginLeft: 'auto', display: 'flex' }}>
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Quick Stat Card ──────────────────────────────────────────────────────────
function StatCard({
  label, value, trend, trendColor = '#34D399', icon, iconBg = 'rgba(79,70,229,0.15)', iconColor = '#A5B4FC'
}: {
  label: string; value: string; trend?: string; trendColor?: string;
  icon: React.ReactNode; iconBg?: string; iconColor?: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon-box" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className="stat-trend" style={{ color: trendColor }}>
          <TrendingUp size={12} /> {trend}
        </div>
      )}
    </div>
  );
}

// ─── Main WorkspaceContent ────────────────────────────────────────────────────
function WorkspaceContent() {
  const { user, token, loading, isImpersonating, impersonatedOrg, stopImpersonation, login, registerOrganizer, logout, switchOrganization, refreshUser } = useAuth();
  const { brand } = useBrand();

  const [view, setView] = useState<'login' | 'register' | 'onboarding' | 'dashboard' | 'ai_assistant' | 'marketing' | 'automation' | 'qr_studio' | 'ticket_designer' | 'website_builder' | 'ad_studio' | 'crm' | 'sponsorship' | 'billing' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const orgLogoInputRef = React.useRef<HTMLInputElement>(null);
  const [orgLogoUploading, setOrgLogoUploading] = useState(false);

  // Auth form state
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe] = useState(true);

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regBusinessType] = useState('Corporate');
  const [regIndustry] = useState('Entertainment & Music');
  const [regPlanSlug, setRegPlanSlug] = useState('professional');

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingAddress, setOnboardingAddress] = useState('');
  const [onboardingTaxId, setOnboardingTaxId] = useState('');
  const [onboardingLogo, setOnboardingLogo] = useState('');
  const [onboardingPrimaryColor, setOnboardingPrimaryColor] = useState('#4F46E5');
  const [onboardingPaymentProvider, setOnboardingPaymentProvider] = useState('platform');

  // Data state
  const [plans, setPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [upgradingPlan, setUpgradingPlan] = useState<any | null>(null);
  const [showCreateEventWizard, setShowCreateEventWizard] = useState<boolean>(false);
  const [showOnboardingTour, setShowOnboardingTour] = useState<boolean>(() => {
    return !localStorage.getItem('getvnt_organizer_onboarding_completed');
  });
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);
  const [matrixTab, setMatrixTab] = useState<'Upcoming' | 'Live' | 'Past' | 'Draft' | 'Archived'>('Upcoming');
  const [hasDownloadedApp, setHasDownloadedApp] = useState<boolean>(() => {
    return localStorage.getItem('getvnt_app_downloaded') === 'true';
  });

  // Route guard
  useEffect(() => {
    if (!token && !loading) {
      setView('login');
    } else if (user) {
      const completed = user.tenant?.settings?.onboarding_completed;
      if (!completed && user.role !== 'super_admin') {
        setView('onboarding');
      } else if (view === 'login' || view === 'register' || view === 'onboarding') {
        setView('dashboard');
      }
    }
  }, [token, user, loading]);

  // Fetch public plans
  useEffect(() => { fetchPlans(); }, []);
  useEffect(() => { if (token) fetchInvoices(); }, [token]);

  // Body scroll lock effect for mobile sidebar and dialogs
  useEffect(() => {
    if (sidebarOpen || showAndroidModal || showCreateEventWizard) {
      document.body.classList.add('body-scroll-lock');
    } else {
      document.body.classList.remove('body-scroll-lock');
    }
    return () => document.body.classList.remove('body-scroll-lock');
  }, [sidebarOpen, showAndroidModal, showCreateEventWizard]);

  const fetchPlans = async () => {
    try {
      const json = await apiClient.get('/subscriptions/plans');
      if (json.success && json.data) setPlans(Array.isArray(json.data) ? json.data : []);
    } catch {}
  };

  const fetchInvoices = async () => {
    try {
      const json = await apiClient.get('/subscriptions/invoices');
      if (json.success && json.data) setInvoices(Array.isArray(json.data) ? json.data : []);
    } catch {}
  };

  const triggerToast = (msg: string) => setToast(msg);

  // ── Auth handlers ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      const res = await login({ email: loginEmail, password: loginPassword, remember: rememberMe });
      if (res.success) {
        setView(res.data.user?.tenant?.settings?.onboarding_completed ? 'dashboard' : 'onboarding');
      } else {
        setAuthError(res.message || 'Login failed. Check your credentials.');
      }
    } catch {
      setAuthError('Network error — ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      const res = await registerOrganizer({
        first_name: regFirstName, last_name: regLastName,
        email: regEmail, phone: regPhone, password: regPassword,
        business_name: regBusinessName, business_type: regBusinessType,
        industry: regIndustry, plan_slug: regPlanSlug, terms: true
      });
      if (res.success) {
        setView('onboarding');
      } else {
        setAuthError(res.message || 'Registration failed.');
      }
    } catch {
      setAuthError('Error submitting registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnboardingStep = async (step: number, isFinal = false) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const json = await apiClient.post('/onboarding/step', {
        step, business_address: onboardingAddress, tax_id: onboardingTaxId,
        logo_url: onboardingLogo, primary_color: onboardingPrimaryColor,
        payment_provider: onboardingPaymentProvider, is_completed: isFinal
      });
      if (json.success) {
        await refreshUser();
        if (isFinal) setView('dashboard');
        else setOnboardingStep(step + 1);
      }
    } catch {} finally { setIsSubmitting(false); }
  };

  const handleUpgradePlan = async (planId: string, billingCycle = 'monthly') => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const json = await apiClient.post('/subscriptions/subscribe', {
        plan_id: planId, billing_cycle: billingCycle, payment_method: 'paystack'
      });
      if (json.success) {
        await refreshUser();
        fetchInvoices();
        setUpgradingPlan(null);
        triggerToast(`Successfully subscribed to ${json.data?.subscription?.plan?.name || 'new'} plan!`);
      }
    } catch {} finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading screen ──
  if (loading) {
    return <AppLoader message="Loading GETVNT Workspace..." fullScreen />;
  }
        // ─────────────────────────────────────────────────────────────
  // 1. LOGIN & REGISTER VIEWS (MODERN SAAS BACKDROP MODAL)
  // ─────────────────────────────────────────────────────────────
  if (view === 'login' || view === 'register') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SaaSAuthModal
          isOpen={true}
          initialMode={view === 'register' ? 'register' : 'login'}
          onClose={() => setView('dashboard')}
          onSuccess={() => setView(user?.tenant?.settings?.onboarding_completed ? 'dashboard' : 'onboarding')}
          onNavigateToOnboarding={() => setView('onboarding')}
        />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. ONBOARDING WIZARD (7-STEP EXPERIENCE)
  // ─────────────────────────────────────────────────────────────
  if (view === 'onboarding') {
    return (
      <SaaSOnboardingWizard
        onComplete={() => setView('dashboard')}
        onToast={triggerToast}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. MAIN WORKSPACE APP
  // ─────────────────────────────────────────────────────────────
  // NAVIGATION ITEMS
  // ─────────────────────────────────────────────────────────────
  const navModules = [
    {
      category: 'ORGANIZER OS OVERVIEW',
      items: [
        { id: 'dashboard', icon: <IconContainer icon={House} color="#38BDF8" bg="rgba(56,189,248,0.12)" containerSize={28} size={15} />, label: 'Organizer OS Dashboard' },
        { id: 'ai_assistant', icon: <IconContainer icon={Bot} color="#06B6D4" bg="rgba(6,182,212,0.12)" containerSize={28} size={15} />, label: 'AI Studio Assistant' },
      ],
    },
    {
      category: 'EVENTS & TICKETING',
      items: [
        { id: 'ticket_designer', icon: <IconContainer icon={PaletteIcon} color="#FBBF24" bg="rgba(245,158,11,0.12)" containerSize={28} size={15} />, label: 'Ticket Designer Desk' },
      ],
    },
    {
      category: 'ORDERS & GATE CONTROL',
      items: [
        { id: 'qr_studio', icon: <IconContainer icon={QrCode} color="#60A5FA" bg="rgba(96,165,250,0.12)" containerSize={28} size={15} />, label: 'QR Gate & Entrance Scanner' },
      ],
    },
    {
      category: 'WEBSITE OS & DOMAINS',
      items: [
        { id: 'website_builder', icon: <IconContainer icon={Globe} color="#38BDF8" bg="rgba(56,189,248,0.12)" containerSize={28} size={15} />, label: 'Event Website Builder' },
      ],
    },
    {
      category: 'MARKETING SUITE',
      items: [
        { id: 'marketing', icon: <IconContainer icon={Share2} color="#34D399" bg="rgba(16,185,129,0.12)" containerSize={28} size={15} />, label: 'Marketing & AI Insights' },
        { id: 'automation', icon: <IconContainer icon={Zap} color="#FBBF24" bg="rgba(245,158,11,0.12)" containerSize={28} size={15} />, label: 'AI Automation Engine' },
        { id: 'ad_studio', icon: <IconContainer icon={Share2} color="#60A5FA" bg="rgba(96,165,250,0.12)" containerSize={28} size={15} />, label: 'Promotion & Ad Studio' },
        { id: 'sponsorship', icon: <IconContainer icon={Briefcase} color="#C084FC" bg="rgba(192,132,252,0.12)" containerSize={28} size={15} />, label: 'AI Sponsorship Decks' },
      ],
    },
    {
      category: 'AUDIENCE & CRM',
      items: [
        { id: 'crm', icon: <IconContainer icon={Award} color="#F472B6" bg="rgba(244,114,182,0.12)" containerSize={28} size={15} />, label: 'Attendee CRM & Loyalty' },
      ],
    },
    {
      category: 'COMMERCE & FINANCE',
      items: [
        { id: 'billing', icon: <IconContainer icon={CreditCard} color="#34D399" bg="rgba(16,185,129,0.12)" containerSize={28} size={15} />, label: 'Finance & Subscriptions' },
      ],
    },
    {
      category: 'WORKSPACE SETTINGS',
      items: [
        { id: 'settings', icon: <IconContainer icon={Settings} color="#94A3B8" bg="rgba(148,163,184,0.12)" containerSize={28} size={15} />, label: 'Organization & Verification' },
      ],
    },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isImpersonating && (
        <div style={{
          background: 'linear-gradient(90deg, #7C3AED, #EC4899)',
          color: '#FFF',
          padding: '10px 24px',
          fontWeight: 800,
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          position: 'sticky',
          top: 0,
          zIndex: 9999,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="#FFF" />
            <span>SUPER ADMIN IMPERSONATION MODE: Viewing workspace for {impersonatedOrg || user?.tenant?.name || 'Organization'}</span>
          </div>
          <button
            onClick={stopImpersonation}
            style={{
              background: 'rgba(0,0,0,0.3)',
              color: '#FFF',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Exit Impersonation →
          </button>
        </div>
      )}
      <div className="app-container">
      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 39 }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar-desktop${sidebarOpen ? ' open' : ''}`}>
        <a className="sidebar-logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }} onClick={() => setView('dashboard')}>
          <BrandLogo variant="white" height={30} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              {brand?.platform_name || 'Getvnt'}
            </span>
            <span style={{ fontSize: '10.5px', color: '#9CA3AF', fontWeight: 600, marginTop: '2px' }}>
              {user?.tenant?.name || 'Organizer Workspace'}
            </span>
          </div>
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
          {navModules.map((module, mIdx) => (
            <div key={mIdx}>
              <div className="sidebar-section-label" style={{ fontSize: '10px', fontWeight: 900, color: '#6B7280', letterSpacing: '0.8px', marginBottom: '6px', paddingLeft: '8px' }}>
                {module.category}
              </div>
              <ul className="sidebar-nav">
                {module.items.map(item => (
                  <li key={item.id}>
                    <a
                      className={`sidebar-link${view === item.id ? ' active' : ''}`}
                      onMouseEnter={() => prefetchRoute(item.id)}
                      onClick={() => { setView(item.id as any); setSidebarOpen(false); }}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <a href={getAppUrl('marketplace')} className="sidebar-link" style={{ color: '#9CA3AF' }}>
            <Globe size={17} /> Public Storefront
          </a>
          <a href={getAppUrl('admin')} className="sidebar-link" style={{ color: '#F87171' }}>
            <ShieldAlert size={17} color="#EF4444" /> Super Admin Control
          </a>
          <a
            className="sidebar-link"
            style={{ color: '#60A5FA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={() => setShowAndroidModal(true)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={17} color="#60A5FA" /> Mobile App
            </span>
            {!hasDownloadedApp && (
              <span style={{ fontSize: '9px', fontWeight: 900, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#FFFFFF', padding: '2px 7px', borderRadius: '99px', textTransform: 'uppercase' }}>
                NEW
              </span>
            )}
          </a>
        </div>

        <div className="sidebar-footer">
          <div style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.12),rgba(6,182,212,0.08))', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '14px', padding: '14px 16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Active Plan</div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#A5B4FC' }}>
              {user?.tenant?.subscription?.plan?.name || 'Starter'} Plan
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
              {user?.tenant?.subscription?.plan?.commission_rate || 5}% commission rate
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main wrapper ── */}
      <div className="main-wrapper">
        {/* ── Top header ── */}
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile menu btn */}
            <button className="header-icon-btn" style={{ display: 'none' }} onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <style>{`@media(max-width:900px){.header-icon-btn:first-child{display:flex!important}}`}</style>

            <span style={{ fontSize: '13px', fontWeight: 700, color: '#6B7280' }}>Organization:</span>
            <select
              className="search-field"
              style={{ width: 'auto', minWidth: '140px', padding: '7px 36px 7px 12px', fontSize: '13px', fontWeight: 700 }}
              value={user?.tenant_id || ''}
              onChange={e => switchOrganization(e.target.value)}
            >
              {user?.tenants?.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <span className="sponsored-tag badge-green" style={{
              background: 'rgba(16,185,129,0.12)', color: '#34D399', border: '1px solid rgba(16,185,129,0.25)'
            }}>
              <ShieldCheck size={11} /> {user?.tenant?.subscription?.plan?.name || 'Starter'} Plan Active
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-cta"
              title="Replay Interactive Product Tour"
              onClick={() => {
                setView('dashboard');
                setShowOnboardingTour(false);
                setTimeout(() => {
                  setShowOnboardingTour(true);
                  triggerToast('🚀 Interactive Product Tour started!');
                }, 50);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 18px',
                height: '40px',
                width: 'fit-content',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <Compass size={16} color="#FFFFFF" /> Guided Tour
            </button>
            <button className="header-icon-btn" title="Refresh data" onClick={() => { fetchPlans(); fetchInvoices(); }}>
              <RefreshCw size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#4F46E5,#06B6D4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 800, color: '#FFF', flexShrink: 0
              }}>
                {(user?.name || user?.first_name || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'none', textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1.2 }}>{user?.name || user?.first_name}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{user?.email}</div>
              </div>
              <style>{`@media(min-width:640px){.user-name-block{display:block!important}}`}</style>
            </div>
            <button className="header-icon-btn" title="Sign Out" onClick={logout}>
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="content-area">

          {/* ══════════════════════════════════════════
              DASHBOARD VIEW (AI EVENT BUSINESS OPERATING SYSTEM)
          ══════════════════════════════════════════ */}
          {view === 'dashboard' && (
            <div>
              {/* 1. TOP WELCOME & EXECUTIVE AI SUMMARY BAR */}
              <div className="card" style={{ background: 'linear-gradient(135deg,rgba(79,70,229,0.22) 0%,rgba(6,182,212,0.18) 100%)', border: '1px solid rgba(79,70,229,0.4)', marginBottom: '28px', padding: '28px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: 0 }}>
                      Good Morning, {user?.first_name || user?.name || 'Organizer'} 👋
                    </h1>
                    <p style={{ color: '#A5B4FC', fontSize: '14px', marginTop: '4px', fontWeight: 600 }}>
                      Welcome to <strong style={{ color: '#FFF' }}>GetVNT Organizer OS</strong> — Africa's AI-Powered Event Operating System.
                    </p>
                  </div>

                  {/* Telemetry & Subscription Chips */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}>
                      <span style={{ color: '#9CA3AF' }}>Active Plan:</span> <strong style={{ color: '#34D399' }}>{user?.tenant?.subscription?.plan?.name || 'Professional'}</strong>
                    </div>
                    <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}>
                      <span style={{ color: '#9CA3AF' }}>AI Prompts:</span> <strong style={{ color: '#06B6D4' }}>1,420 / 2,000 Remaining</strong>
                    </div>
                    <div style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}>
                      <span style={{ color: '#9CA3AF' }}>Storage:</span> <strong style={{ color: '#FFF' }}>4.2 GB / 10 GB</strong>
                    </div>
                  </div>
                </div>

                {/* AI Executive Summary Card */}
                <div style={{ background: 'rgba(13, 17, 32, 0.85)', borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(79,70,229,0.3)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,#7C3AED,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={20} color="#FFF" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI EXECUTIVE SUMMARY RECOMMENDATION</div>
                    <div style={{ fontSize: '13.5px', color: '#FFF', fontWeight: 700, marginTop: '2px' }}>
                      "Your ticket sales increased by 18% this week. Your next event (Afrobeat Fest 2026) starts in 5 days. AI recommends sending a SMS/Email reminder today."
                    </div>
                  </div>
                  <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', padding: '8px 16px', fontSize: '12px' }} onClick={() => setView('ad_studio')}>
                    Launch Reminder Campaign
                  </button>
                </div>
              </div>

              {/* 2. ENTERPRISE QUICK ACTIONS GRID (10 LAUNCHERS) */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '14px' }}>
                  ENTERPRISE OPERATING LAUNCHERS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                  {[
                    { label: 'Create Event Wizard', icon: PackagePlus, color: '#4F46E5', action: () => setShowCreateEventWizard(true) },
                    { label: 'Sell Tickets', icon: Ticket, color: '#06B6D4', action: () => setView('ticket_designer') },
                    { label: 'Generate Event Website', icon: Globe, color: '#A5B4FC', action: () => setView('website_builder') },
                    { label: 'Generate Flyer with AI', icon: Sparkles, color: '#FCD34D', action: () => setView('ad_studio') },
                    { label: 'Invite Speakers', icon: Users, color: '#34D399', action: () => setView('crm') },
                    { label: 'Create Discount Code', icon: Tag, color: '#F472B6', action: () => setView('billing') },
                    { label: 'Launch Marketing', icon: Share2, color: '#60A5FA', action: () => setView('ad_studio') },
                    { label: 'Scan Tickets', icon: QrCode, color: '#34D399', action: () => setView('qr_studio') },
                    { label: 'Create Branded QR', icon: PaletteIcon, color: '#A5B4FC', action: () => setView('qr_studio') },
                    { label: 'Sponsorship Proposal', icon: Briefcase, color: '#F59E0B', action: () => setView('sponsorship') },
                  ].map((qa, i) => {
                    const QAIcon = qa.icon;
                    return (
                      <button
                        key={i}
                        className="btn-cta"
                        style={{
                          background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#FFF', padding: '14px', borderRadius: '16px', flexDirection: 'column',
                          alignItems: 'flex-start', gap: '10px', height: '90px', justifyContent: 'space-between',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={qa.action}
                      >
                        <QAIcon size={20} color={qa.color} />
                        <span style={{ fontSize: '13px', fontWeight: 800, textAlign: 'left' }}>{qa.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. KPI CARDS ROW */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <StatCard
                  label="Events Overview" value="3 Upcoming" trend="12 Completed • 0 Cancelled" trendColor="#34D399"
                  icon={<Calendar size={20} />} iconBg="rgba(79,70,229,0.15)" iconColor="#A5B4FC"
                />
                <StatCard
                  label="Total Platform Revenue" value="₦34,200,000" trend="Today: ₦1.25M • Week: ₦8.45M" trendColor="#F59E0B"
                  icon={<DollarSign size={20} />} iconBg="rgba(245,158,11,0.15)" iconColor="#F59E0B"
                />
                <StatCard
                  label="Tickets Sold & Attendance" value="1,840 Sold" trend="84.2% Attendance Rate" trendColor="#06B6D4"
                  icon={<Ticket size={20} />} iconBg="rgba(6,182,212,0.15)" iconColor="#06B6D4"
                />
                <StatCard
                  label="Avg Ticket & Conversion" value="₦18,500 Avg" trend="4.2% Checkout Conversion" trendColor="#34D399"
                  icon={<BarChart3 size={20} />} iconBg="rgba(16,185,129,0.15)" iconColor="#34D399"
                />
              </div>

              {/* 4. AI EVENT COACH & HEALTH SCORE ROW */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '36px' }}>
                
                {/* AI Coach Widget */}
                <div className="card" style={{ background: 'rgba(13, 17, 32, 0.9)', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Bot size={20} color="#06B6D4" />
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', margin: 0 }}>AI Proactive Event Coach</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { msg: 'Your event page is missing sponsor information.', action: 'Add Sponsors', view: 'sponsorship' },
                      { msg: 'Your ticket price is 25% higher than similar events.', action: 'Adjust Pricing', view: 'billing' },
                      { msg: 'You are likely to sell out in 6 days.', action: 'Increase Capacity', view: 'settings' },
                      { msg: 'Add Instagram promotion to increase registrations.', action: 'Launch Campaign', view: 'ad_studio' },
                    ].map((item, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ fontSize: '12.5px', color: '#D1D5DB' }}>💡 {item.msg}</div>
                        <button className="btn-cta" style={{ padding: '6px 12px', fontSize: '11px', background: '#4F46E5', color: '#FFF', whiteSpace: 'nowrap' }} onClick={() => setView(item.view as any)}>
                          {item.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Event Health Score */}
                <div className="card" style={{ background: 'rgba(13, 17, 32, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Award size={20} color="#FCD34D" />
                      <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', margin: 0 }}>AI Event Health Score</h3>
                    </div>
                    <span style={{ fontSize: '22px', fontWeight: 900, color: '#34D399' }}>88 / 100</span>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#9CA3AF', marginBottom: '16px' }}>
                    Scored across Description, Images, Pricing, Marketing, Venue, SEO, Speakers, Sponsors, and Ticket Structure.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', color: '#D1D5DB' }}>
                    <div>✅ Description: <strong style={{ color: '#FFF' }}>95%</strong></div>
                    <div>✅ Images & Media: <strong style={{ color: '#FFF' }}>100%</strong></div>
                    <div>✅ Ticket Pricing: <strong style={{ color: '#FFF' }}>85%</strong></div>
                    <div>✅ SEO Metadata: <strong style={{ color: '#FFF' }}>95%</strong></div>
                    <div>⚡ Sponsors: <strong style={{ color: '#FCD34D' }}>75%</strong></div>
                    <div>⚡ Marketing Campaigns: <strong style={{ color: '#60A5FA' }}>80%</strong></div>
                  </div>
                </div>

              </div>

              {/* 5. EVENTS OPERATIONS MATRIX */}
              <div className="card" style={{ background: 'rgba(13, 17, 32, 0.9)', borderRadius: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', margin: 0 }}>Event Operations Matrix</h3>
                  
                  {/* Event Status Tabs */}
                  <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', flexWrap: 'wrap' }}>
                    {(['Upcoming', 'Live', 'Past', 'Draft', 'Archived'] as const).map((tab) => (
                      <button
                        key={tab}
                        className="btn-cta"
                        onClick={() => setMatrixTab(tab)}
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 800,
                          background: matrixTab === tab ? '#4F46E5' : 'transparent',
                          color: matrixTab === tab ? '#FFF' : '#9CA3AF',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {(() => {
                    const matrixData: Record<string, any[]> = {
                      Upcoming: [
                        { name: 'Afrobeat Festival 2026', date: 'Aug 15, 2026', location: 'Eko Hotel, Lagos', sold: 1240, cap: 1500, rev: '₦24.8M', score: 92, badge: 'High Demand' },
                        { name: 'Tech Summit Nigeria', date: 'Sep 3, 2026', location: 'NESS, Abuja', sold: 420, cap: 600, rev: '₦8.4M', score: 85, badge: 'Selling Fast' },
                        { name: 'Lagos Fashion & Style Expo', date: 'Oct 12, 2026', location: 'Landmark Centre, Victoria Island', sold: 610, cap: 1000, rev: '₦12.2M', score: 89, badge: 'Early Bird' },
                      ],
                      Live: [
                        { name: 'Afro-Fusion Rave Live ⚡', date: 'TONIGHT (Active Now)', location: 'Hard Rock Beach, Lagos', sold: 1450, cap: 1500, rev: '₦29.0M', score: 98, badge: 'LIVE NOW 🔴' },
                        { name: 'Burna Boy VIP Lounge', date: 'Today, 20:00 WAT', location: 'Eko Atlantic, Lagos', sold: 800, cap: 800, rev: '₦40.0M', score: 99, badge: 'SOLD OUT 🔴' },
                      ],
                      Past: [
                        { name: 'Detty December Festival 2025', date: 'Dec 28, 2025', location: 'Tafawa Balewa Square, Lagos', sold: 8500, cap: 8500, rev: '₦170.0M', score: 97, badge: 'Concluded' },
                        { name: 'Homecoming Festival 2025', date: 'Apr 20, 2025', location: 'Harbour Point, VI Lagos', sold: 3200, cap: 3200, rev: '₦64.0M', score: 94, badge: 'Concluded' },
                      ],
                      Draft: [
                        { name: 'Lagos Jazz & Wine Night (Draft)', date: 'Unpublished (Draft)', location: 'Civic Centre, Victoria Island', sold: 0, cap: 400, rev: '₦0.00', score: 65, badge: 'In Progress' },
                      ],
                      Archived: [
                        { name: 'Summer Beach Rave 2024 (Archived)', date: 'Aug 10, 2024', location: 'Elegushi Beach, Lagos', sold: 2100, cap: 2500, rev: '₦31.5M', score: 82, badge: 'Archived' },
                      ],
                    };

                    const list = matrixData[matrixTab] || [];
                    if (list.length === 0) {
                      return (
                        <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', gridColumn: '1 / -1' }}>
                          No {matrixTab.toLowerCase()} events recorded for this organization workspace.
                        </div>
                      );
                    }

                    return list.map((evt, idx) => (
                      <div key={idx} style={{ background: 'rgba(7, 9, 15, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF' }}>{evt.name}</div>
                            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>📅 {evt.date} • 📍 {evt.location}</div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 900, background: matrixTab === 'Live' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)', color: matrixTab === 'Live' ? '#F87171' : '#34D399', padding: '4px 10px', borderRadius: '8px' }}>
                            Score: {evt.score}/100
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#FFF', fontWeight: 800, marginBottom: '6px', marginTop: '16px' }}>
                          <span>Sales Progress</span>
                          <span>{evt.sold} / {evt.cap} Tickets</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (evt.sold / evt.cap) * 100)}%`, background: 'linear-gradient(90deg, #4F46E5, #06B6D4)' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: 900, color: '#FCD34D' }}>{evt.rev} Revenue</div>
                          <button
                            className="btn-cta"
                            style={{ padding: '6px 14px', fontSize: '12px', background: 'rgba(79,70,229,0.2)', color: '#A5B4FC' }}
                            onClick={() => {
                              if (matrixTab === 'Draft') {
                                setShowCreateEventWizard(true);
                              } else {
                                setView('ticket_designer');
                              }
                            }}
                          >
                            Manage Event
                          </button>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* PERMANENT MOBILE APP RESOURCE CARD */}
              <MobileAppResourceCard onOpenModal={() => setShowAndroidModal(true)} />
            </div>
          )}

          {/* ══════════════════════════════════════════
              MARKETING & AI INSIGHTS VIEW
          ══════════════════════════════════════════ */}


          {/* ══════════════════════════════════════════
              BILLING VIEW
          ══════════════════════════════════════════ */}
          {view === 'billing' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '6px' }}>Billing & Subscriptions</h1>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>Manage subscription plans, billing cycles, and invoice receipts.</p>
              </div>

              {/* Current plan hero */}
              <div className="sponsored-hero" style={{ background: 'linear-gradient(135deg,rgba(30,27,75,0.9) 0%,rgba(13,17,32,0.95) 100%)', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <span className="sponsored-tag" style={{ marginBottom: '14px', display: 'inline-flex' }}>Current Subscription</span>
                    <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#FFF', margin: '0 0 8px' }}>
                      {user?.tenant?.subscription?.plan?.name || 'Starter'} Plan
                    </h2>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>
                      Status: <span style={{ color: '#34D399', fontWeight: 800, textTransform: 'capitalize' }}>{user?.tenant?.subscription?.status || 'Active'}</span>
                      {' • '}Commission: <span style={{ color: '#A5B4FC', fontWeight: 800 }}>{user?.tenant?.subscription?.plan?.commission_rate || 5}%</span>
                    </p>
                  </div>
                  <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF' }}
                    onClick={() => plans.length > 0 && setUpgradingPlan(plans[plans.length - 1])}>
                    <Crown size={16} /> Upgrade Plan
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Available Subscription Plans</h2>
              {plans.length === 0 ? (
                <div className="loading-pulse">
                  <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Loading plans…
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                  {plans.map(p => {
                    const isCurrent = user?.tenant?.subscription?.plan_id === p.id;
                    return (
                      <div key={p.id} style={{
                        background: p.is_featured ? 'linear-gradient(135deg,rgba(79,70,229,0.12),rgba(6,182,212,0.06))' : 'rgba(22,29,46,0.8)',
                        border: `1px solid ${p.is_featured ? 'rgba(79,70,229,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between', position: 'relative', transition: 'all 0.2s ease'
                      }}>
                        {p.is_featured && (
                          <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                            <span className="sponsored-tag" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', border: 'none' }}>
                              Most Popular
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '10px' }}>{p.name}</h3>
                          <div style={{ fontSize: '30px', fontWeight: 900, color: '#F59E0B', marginBottom: '6px' }}>
                            ₦{p.price_monthly?.toLocaleString() || '0'}
                            <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 600 }}>/mo</span>
                          </div>
                          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px', lineHeight: '1.6' }}>{p.description}</p>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#D1D5DB' }}>
                              <Check size={15} color="#34D399" style={{ flexShrink: 0 }} /> {p.commission_rate}% Platform Commission
                            </li>
                            {p.features?.slice(0, 5).map((f: any) => (
                              <li key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#D1D5DB' }}>
                                <Check size={15} color="#34D399" style={{ flexShrink: 0 }} />
                                {f.name}: <span style={{ color: '#A5B4FC', fontWeight: 700 }}>{f.pivot?.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          className="btn-cta"
                          disabled={isCurrent || isSubmitting}
                          style={{
                            background: isCurrent ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#4F46E5,#06B6D4)',
                            color: isCurrent ? '#6B7280' : '#FFF',
                            border: isCurrent ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            justifyContent: 'center', cursor: isCurrent ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => !isCurrent && handleUpgradePlan(p.id, 'monthly')}
                        >
                          {isCurrent ? '✓ Current Plan' : `Switch to ${p.name}`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Invoice Table */}
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Invoice Receipts</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {invoices.length === 0 ? (
                  <div className="loading-pulse" style={{ minHeight: '120px' }}>
                    <DollarSign size={18} color="#4B5563" />
                    <span style={{ color: '#4B5563' }}>No invoices yet. Invoices appear after subscription payments.</span>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map(inv => (
                          <tr key={inv.id}>
                            <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{inv.invoice_number}</td>
                            <td style={{ color: '#F59E0B', fontWeight: 800 }}>₦{inv.amount?.toLocaleString()}</td>
                            <td>
                              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 800 }}>
                                {inv.status}
                              </span>
                            </td>
                            <td style={{ color: '#6B7280', fontSize: '13px' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              SETTINGS VIEW
          ══════════════════════════════════════════ */}
          {view === 'settings' && (
            <div>
              <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '6px' }}>Organization Settings</h1>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>Manage branding, workspace details, and staff permissions.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {/* Org Details */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <Building2 size={18} color="#A5B4FC" />
                    <h3 style={{ fontWeight: 800, fontSize: '16px' }}>Organization Details</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Organization Name</label>
                      <input type="text" className="search-field" defaultValue={user?.tenant?.name} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Workspace Slug</label>
                      <input type="text" className="search-field" defaultValue={user?.tenant?.slug} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Website</label>
                      <input type="url" className="search-field" placeholder="https://yoursite.com" />
                    </div>
                  </div>
                  <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', marginTop: '20px' }}
                    onClick={() => triggerToast('Organization details saved!')}>
                    Save Changes
                  </button>
                </div>

                {/* Brand Identity */}
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <Globe size={18} color="#06B6D4" />
                    <h3 style={{ fontWeight: 800, fontSize: '16px' }}>Brand Identity &amp; Media Assets</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Organization Logo */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Organization Logo</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#0D1120', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          {user?.tenant?.logo_url ? (
                            <img src={user.tenant.logo_url} alt="Logo" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <ImageIcon size={24} color="#6B7280" />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          {/* Hidden file input */}
                          <input
                            ref={orgLogoInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml,image/webp"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setOrgLogoUploading(true);
                              const formData = new FormData();
                              formData.append('file', file);
                              formData.append('folder', 'logos');
                              try {
                                // Step 1: Upload file to storage
                                const uploadRes = await fetch('/api/v1/media/upload', {
                                  method: 'POST',
                                  headers: { 'Authorization': `Bearer ${token || ''}` },
                                  body: formData,
                                });
                                const uploadJson = await uploadRes.json();
                                if (!uploadJson.success) {
                                  triggerToast(uploadJson.message || 'Upload failed.');
                                  return;
                                }
                                // Step 2: Save logo_url to tenant record in database
                                const saveRes = await fetch('/api/v1/workspace/organization', {
                                  method: 'PUT',
                                  headers: {
                                    'Authorization': `Bearer ${token || ''}`,
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json',
                                  },
                                  body: JSON.stringify({ logo_url: uploadJson.data.url }),
                                });
                                const saveJson = await saveRes.json();
                                if (saveJson.success) {
                                  triggerToast('Organization logo saved successfully!');
                                  refreshUser();
                                } else {
                                  triggerToast(saveJson.message || 'Logo uploaded but could not save.');
                                }
                              } catch {
                                triggerToast('Network error. Please try again.');
                              } finally {
                                setOrgLogoUploading(false);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            className="btn-cta btn-cta-ghost"
                            style={{ padding: '8px 14px', fontSize: '12px' }}
                            disabled={orgLogoUploading}
                            onClick={() => orgLogoInputRef.current?.click()}
                          >
                            <Upload size={14} /> {orgLogoUploading ? 'Uploading…' : 'Upload Organization Logo'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Primary Accent Color</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="color" defaultValue="#4F46E5" style={{ width: '44px', height: '40px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                        <input type="text" className="search-field" defaultValue="#4F46E5" style={{ flex: 1 }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Custom Subdomain</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                        <input type="text" className="search-field" placeholder="yourname" style={{ borderRadius: '10px 0 0 10px' }} defaultValue={user?.tenant?.slug} />
                        <span style={{ padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: 'none', borderRadius: '0 10px 10px 0', fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                          .getvnt.com
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', marginTop: '20px' }}
                    onClick={() => triggerToast('Brand settings saved!')}>
                    Save Brand Settings
                  </button>
                </div>
              </div>

              {/* Account info */}
              <div className="card" style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={18} color="#34D399" />
                    <h3 style={{ fontWeight: 800, fontSize: '16px' }}>Account Information</h3>
                  </div>
                  <div style={{
                    padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 900,
                    letterSpacing: '0.8px', textTransform: 'uppercase',
                    background: user?.role === 'super_admin' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.18)',
                    color: user?.role === 'super_admin' ? '#F87171' : '#06B6D4',
                    border: user?.role === 'super_admin' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)'
                  }}>
                    {getRoleBadgeLabel(user?.role)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { label: 'FULL NAME', value: user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Organizer' },
                    { label: 'EMAIL ADDRESS', value: user?.email || '—' },
                    { label: 'ACCOUNT ROLE', value: getRoleBadgeLabel(user?.role) },
                    { label: 'MEMBER SINCE', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '01/08/2026' },
                  ].map((row, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{row.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#E5E7EB', fontFamily: row.label === 'ACCOUNT ROLE' ? 'monospace' : 'inherit' }}>
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              ENTERPRISE MODULE VIEWS (PROGRESSIVE SUSPENSE)
          ══════════════════════════════════════════ */}
          <RouteErrorBoundary>
            <React.Suspense fallback={<AppLoader fullScreen={false} />}>
              {view === 'ai_assistant' && (
                <AiAssistantHub currentModule={view} onNavigateToTab={(tab) => setView(tab as any)} onToast={triggerToast} />
              )}

              {view === 'qr_studio' && (
                <QrStudioViewLazy token={token} onToast={triggerToast} />
              )}

              {view === 'ticket_designer' && (
                <TicketDesignerDeskLazy onToast={triggerToast} />
              )}

              {view === 'ad_studio' && (
                <PromotionAdStudioLazy onToast={triggerToast} />
              )}

              {view === 'crm' && (
                <CrmLoyaltyViewLazy token={token} onToast={triggerToast} />
              )}

              {view === 'sponsorship' && (
                <SponsorshipDeckBuilderLazy onToast={triggerToast} />
              )}

              {view === 'automation' && (
                <AutomationRulesEngineViewLazy onTriggerToast={triggerToast} />
              )}

              {view === 'marketing' && (
                <MarketingAnalyticsCenterViewLazy onTriggerToast={triggerToast} />
              )}

              {view === 'website_builder' && (
                <EventWebsiteBuilderViewLazy onToast={triggerToast} />
              )}
            </React.Suspense>
          </RouteErrorBoundary>

        </main>
      </div>

      {/* ── Upgrade Modal ── */}
      {upgradingPlan && (
        <div className="modal-overlay" onClick={() => setUpgradingPlan(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>
              Upgrade to {upgradingPlan.name}
            </h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>
              Switch your workspace to the <strong style={{ color: '#A5B4FC' }}>{upgradingPlan.name}</strong> plan at ₦{upgradingPlan.price_monthly?.toLocaleString()}/month.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', flex: 1, justifyContent: 'center' }}
                onClick={() => handleUpgradePlan(upgradingPlan.id, 'monthly')} disabled={isSubmitting}>
                {isSubmitting ? 'Processing…' : 'Confirm Upgrade'}
              </button>
              <button className="btn-cta btn-cta-ghost" style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF' }}
                onClick={() => setUpgradingPlan(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ── Conversational GETVNT AI Assistant Hub ── */}
      <AiAssistantHub
        currentModule={view}
        onNavigateToTab={(tab) => setView(tab as any)}
        onToast={triggerToast}
      />

      {/* ── Data-Driven Attached Appcues Tour Engine & Floating Tooltips ── */}
      <AppcuesTourEngine
        isActive={showOnboardingTour && !!user && !['login', 'register'].includes(view)}
        onClose={() => setShowOnboardingTour(false)}
        onNavigateToTab={(tab) => setView(tab as any)}
        onToast={triggerToast}
        onOpenWizard={() => setShowCreateEventWizard(true)}
      />

      {/* ── 7-Step Guided Event Creation Wizard Modal ── */}
      <EventCreationWizardModal
        isOpen={showCreateEventWizard}
        onClose={() => setShowCreateEventWizard(false)}
        onToast={triggerToast}
        onEventCreated={() => {
          setView('dashboard');
        }}
      />

      {/* ── GETVNT Mobile App Promotional Modal ── */}
      <AndroidAppModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        onDownload={() => {
          localStorage.setItem('getvnt_app_downloaded', 'true');
          setHasDownloadedApp(true);
        }}
      />

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <WorkspaceContent />
    </AuthProvider>
  );
}
