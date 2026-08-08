import React, { useEffect, useState } from 'react';
import {
  House, Ticket, Heart, Flame, MessageSquare, PackagePlus, User,
  Search, Bell, Sparkles, ChevronRight, ChevronLeft, Calendar, MapPin, Bot,
  CircleHelp, Building2, DollarSign, Zap, Send, Mail, ArrowRight, X, Menu,
  Clock, ShieldCheck, Crown, Compass, Tag, Layers, LogOut, Lock, AlertCircle,
  Rss, ExternalLink, Share2, BookOpen, CheckCircle, Smartphone, Download
} from 'lucide-react';
import { useResponsiveSidebar, AuthProvider, useAuth, PasswordField, SaaSAuthModal, getAppUrl, apiClient } from '../../../shared/src';
import { useBrand } from '../../../shared/src/context/BrandContext';
import GetvntLogo from './components/GetvntLogo';
import { FooterPageViews } from './components/FooterPageViews';
import { GetvntPulseBlog } from './components/GetvntPulseBlog';
import { HomeNewsCarousel } from './components/HomeNewsCarousel';
import { AndroidAppPromotion } from './components/AndroidAppPromotion';
import { TicketCheckoutModal } from './components/TicketCheckoutModal';
import { TicketManagementPortal } from './components/TicketManagementPortal';
import { SaaSStoryLandingPage } from './components/SaaSStoryLandingPage';
import './styles.css';

interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  banner_url: string;
  start_date: string;
  venue_name: string;
  city: string;
  country: string;
  ticket_types?: { price: number; name: string }[];
}

function MarketplaceContent() {
  const { user, login, registerMarketplace, logout } = useAuth();
  const { brand } = useBrand();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active Tab state — supports Home, Pulse, Tickets, Wishlist, Manage Ticket, plus full standalone Footer Pages
  type TabType = 'home' | 'tickets' | 'wishlist' | 'pulse' | 'about' | 'help' | 'privacy' | 'terms' | 'api' | 'refunds' | 'guides' | 'manage_ticket';
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // Body scroll lock effect for accessibility and touch UX
  useEffect(() => {
    if (mobileMenuOpen || selectedEvent) {
      document.body.classList.add('body-scroll-lock');
    } else {
      document.body.classList.remove('body-scroll-lock');
    }
    return () => document.body.classList.remove('body-scroll-lock');
  }, [mobileMenuOpen, selectedEvent]);

  // News Stream & Standalone Blog Article State
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(null);

  // Central Router Navigator: updates state & browser URL pathname
  const navigateTo = (tab: TabType, slug: string | null = null, pushState = true) => {
    setActiveTab(tab);
    let targetPath = '/';
    if (tab === 'pulse') {
      setActiveArticleSlug(slug);
      targetPath = slug ? `/blog/${slug}` : '/blog';
    } else {
      setActiveArticleSlug(null);
      const pathMap: Record<string, string> = {
        home: '/',
        about: '/about',
        help: '/help',
        privacy: '/privacy',
        terms: '/terms',
        api: '/api-docs',
        refunds: '/refunds',
        guides: '/guides',
        manage_ticket: '/manage-ticket',
      };
      targetPath = pathMap[tab] || '/';
    }

    if (pushState && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync URL pathname with active tab on mount & popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').trim();
        setActiveTab('pulse');
        setActiveArticleSlug(slug || null);
      } else if (path === '/blog' || path === '/pulse') {
        setActiveTab('pulse');
        setActiveArticleSlug(null);
      } else if (path === '/manage-ticket' || path === '/manage') {
        setActiveTab('manage_ticket');
      } else if (path === '/about') {
        setActiveTab('about');
      } else if (path === '/help') {
        setActiveTab('help');
      } else if (path === '/privacy') {
        setActiveTab('privacy');
      } else if (path === '/terms') {
        setActiveTab('terms');
      } else if (path === '/api-docs' || path === '/api') {
        setActiveTab('api');
      } else if (path === '/refunds') {
        setActiveTab('refunds');
      } else if (path === '/guides') {
        setActiveTab('guides');
      } else {
        setActiveTab('home');
        setActiveArticleSlug(null);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch Public Events
  useEffect(() => {
    apiClient.get('/marketplace/events')
      .then((json) => {
        if (json.success && json.data) {
          setEvents(Array.isArray(json.data) ? json.data : []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Attendee Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Responsive Hook
  const { isMobile, isTablet, isDrawerOpen, toggleMobileDrawer, closeMobileDrawer } = useResponsiveSidebar();

  const heroItems = [
    {
      tag: 'SPONSORED CONTENT',
      title: 'Afrobeat Festival Lagos 2026',
      description: 'Africa\'s biggest music & culture celebration. 3 explosive days of live Afrobeats stars, food, culture, and interactive installations.',
      cta: 'Claim Offer & Buy Tickets',
      image: '/afrobeat_festival_banner.png',
      gradient: 'linear-gradient(135deg, rgba(21, 26, 51, 0.85) 0%, rgba(8, 13, 31, 0.95) 100%)',
    },
    {
      tag: 'TECH & AI SUMMIT',
      title: 'Nairobi AI & DeepTech Expo 2026',
      description: 'East Africa\'s largest gathering of AI engineers, startup founders, and global venture investors at KICC Nairobi.',
      cta: 'Reserve Delegate Pass',
      image: '/nairobi_tech_summit_banner.png',
      gradient: 'linear-gradient(135deg, rgba(30, 27, 75, 0.85) 0%, rgba(11, 19, 43, 0.95) 100%)',
    },
    {
      tag: 'CULINARY & LIFESTYLE',
      title: 'Cape Town International Wine & Food Festival',
      description: 'Savor world-class wines, Michelin-starred popups, and live sunset jazz against Table Mountain in Cape Town.',
      cta: 'Book VIP Tasting Pass',
      image: '/capetown_wine_food_banner.png',
      gradient: 'linear-gradient(135deg, rgba(43, 21, 31, 0.85) 0%, rgba(13, 10, 26, 0.95) 100%)',
    }
  ];

  // Auto change carousel slide every 5 seconds
  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHeroPaused, heroItems.length]);

  const handleNextHero = () => {
    setActiveHeroIndex((prev) => (prev + 1) % heroItems.length);
  };

  const handlePrevHero = () => {
    setActiveHeroIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const citiesList = [
    { name: 'All Africa', flag: '🌍' },
    { name: 'Lagos', flag: '🇳🇬' },
    { name: 'Nairobi', flag: '🇰🇪' },
    { name: 'Cape Town', flag: '🇿🇦' },
    { name: 'Accra', flag: '🇬🇭' },
    { name: 'London', flag: '🇬🇧' },
    { name: 'Johannesburg', flag: '🇿🇦' },
  ];

  const categoriesList = [
    'All', 'Music & Concerts', 'Tech & AI', 'Cultural Festivals', 'Nightlife & Parties', 'Sports', 'Food & Wine'
  ];

  const topOrganizers = [
    { rank: 1, name: 'AfroNation Events Ltd', sales: '₦245M GMV', trend: '🔥 Top 1 Seller', buyers: '48.2k' },
    { rank: 2, name: 'Nairobi Tech Summit Org', sales: '₦180M GMV', trend: '⭐ Verified Enterprise', buyers: '32.1k' },
    { rank: 3, name: 'Cape Town Arts Collective', sales: '₦120M GMV', trend: '⚡ Fast Growing', buyers: '19.5k' }
  ];

  const faqs = [
    { question: 'How do I receive my event ticket after payment?', answer: 'Tickets are generated instantly with a unique encrypted QR security code and sent directly to your email address and accessible under "My Tickets".' },
    { question: 'Can I transfer or resell my ticket to a friend?', answer: 'Yes! You can transfer tickets free of charge to any recipient email address from your attendee dashboard.' },
    { question: 'What payment options are supported?', answer: 'We accept all major credit/debit cards, Apple Pay, Google Pay, Paystack, Flutterwave, MoMo, and direct bank transfers.' },
    { question: 'How do organizers create events on Getvnt?', answer: 'Organizers can launch a complete workspace in under 2 minutes using Getvnt Organizer OS, complete with AI marketing copy generation and dynamic pricing tiers.' }
  ];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        const res = await login({ email: authEmail, password: authPassword });
        if (res.success) {
          setShowAuthModal(false);
        } else {
          setAuthError(res.message || 'Invalid credentials.');
        }
      } else {
        const res = await registerMarketplace({
          first_name: authFirstName,
          last_name: authLastName,
          email: authEmail,
          password: authPassword,
          terms: true
        });
        if (res.success) {
          setShowAuthModal(false);
        } else {
          setAuthError(res.message || 'Registration failed.');
        }
      }
    } catch (err) {
      setAuthError('Authentication request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentHero = heroItems[activeHeroIndex];

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#07090F', color: '#FFF' }}>
      
      {/* ── 1. FULL-WIDTH TOP HEADER ── */}
      {/* ── 1. STICKY TOP NAVBAR (TixUp / Linear Style) ── */}
      <header className="top-header">
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <GetvntLogo height={42} theme="dark" />
          </a>
        </div>

        {/* Center Header Navigation Links (Desktop Only) */}
        <nav className="header-nav-links">
          <a className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} style={{ color: activeTab === 'home' ? '#60A5FA' : '#D1D5DB', fontWeight: 800, fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            Explore Events
          </a>
          <a className={`nav-link ${activeTab === 'manage_ticket' ? 'active' : ''}`} style={{ color: activeTab === 'manage_ticket' ? '#34D399' : '#D1D5DB', fontWeight: 800, fontSize: '14px', textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => { e.preventDefault(); navigateTo('manage_ticket'); }}>
            <Ticket size={16} color="#34D399" /> Manage Ticket
          </a>
          <a className={`nav-link ${activeTab === 'pulse' ? 'active' : ''}`} style={{ color: activeTab === 'pulse' ? '#EC4899' : '#D1D5DB', fontWeight: 800, fontSize: '14px', textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => { e.preventDefault(); navigateTo('pulse'); }}>
            <Rss size={16} color="#EC4899" /> Pulse Blog
          </a>
          <a className={`nav-link ${activeTab === 'about' ? 'active' : ''}`} style={{ color: activeTab === 'about' ? '#60A5FA' : '#D1D5DB', fontWeight: 800, fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>
            About Us
          </a>
          <a className={`nav-link ${activeTab === 'help' ? 'active' : ''}`} style={{ color: activeTab === 'help' ? '#60A5FA' : '#D1D5DB', fontWeight: 800, fontSize: '14px', textDecoration: 'none', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); navigateTo('help'); }}>
            Help Center
          </a>
        </nav>

        {/* Right Desktop Action CTAs & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="header-search-desktop" style={{ maxWidth: '200px' }}>
            <div className="search-input-wrap">
              <Search className="search-icon" size={15} />
              <input
                type="text"
                className="search-field"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <a
            href={getAppUrl('workspace')}
            className="desktop-only-link"
            style={{ color: '#A5B4FC', fontWeight: 800, fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Organizer Login
          </a>

          <a
            href={getAppUrl('workspace')}
            className="btn-cta desktop-only-btn"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              color: '#FFF', padding: '9px 18px', fontSize: '13px', fontWeight: 900,
              borderRadius: '99px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)', whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={14} /> Become an Organizer
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-hamburger-btn"
            aria-label="Toggle Mobile Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} color="#FFF" /> : <Menu size={22} color="#FFF" />}
          </button>
        </div>
      </header>

      {/* ── MOBILE SLIDING DRAWER MENU ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(7,9,15,0.98)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 24px 32px 24px',
            gap: '14px',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <GetvntLogo height={38} theme="dark" />
            <button
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <a style={{ fontSize: '17px', fontWeight: 800, color: activeTab === 'home' ? '#60A5FA' : '#FFF', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}>
            Explore Events
          </a>
          <a style={{ fontSize: '17px', fontWeight: 800, color: '#34D399', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => { navigateTo('manage_ticket'); setMobileMenuOpen(false); }}>
            <Ticket size={18} /> Manage My Tickets
          </a>
          <a style={{ fontSize: '17px', fontWeight: 800, color: '#EC4899', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => { navigateTo('pulse'); setMobileMenuOpen(false); }}>
            <Rss size={18} /> Pulse Entertainment Blog
          </a>
          <a style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { navigateTo('about'); setMobileMenuOpen(false); }}>
            About Us
          </a>
          <a style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }} onClick={() => { navigateTo('help'); setMobileMenuOpen(false); }}>
            Help Center
          </a>

          <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href={getAppUrl('workspace')} className="btn-cta" style={{ textAlign: 'center', padding: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', borderRadius: '14px', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>
              Organizer Login
            </a>
            <a href={getAppUrl('workspace')} className="btn-cta" style={{ textAlign: 'center', padding: '14px', background: '#2563EB', color: '#FFF', borderRadius: '14px', fontWeight: 900, fontSize: '14px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
              Become an Organizer
            </a>
          </div>
        </div>
      )}

      {/* ── 2. MAIN PAGE CONTENT ── */}
      <div className="main-wrapper" style={{ flex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '24px 28px' }}>
        
        {/* VIEW 1: HOME STORYTELLING LANDING PAGE */}
        {activeTab === 'home' && (
          <SaaSStoryLandingPage
            events={events}
            onSelectEvent={(ev) => setSelectedEvent(ev)}
            onNavigateToWorkspace={() => { window.location.href = getAppUrl('workspace'); }}
            onNavigateToBlog={(slug) => {
              setActiveTab('pulse');
              setActiveArticleSlug(slug || null);
              window.history.pushState(null, '', slug ? `/blog/${slug}` : '/blog');
            }}
            onNavigateToTab={(tab) => navigateTo(tab as any)}
          />
        )}

        {/* VIEW 2: DEDICATED GETVNT PULSE BLOG / NEWS HUB PAGE */}
        {activeTab === 'pulse' && (
          <GetvntPulseBlog
            initialSlug={activeArticleSlug}
            onBackToFeed={() => {
              setActiveArticleSlug(null);
              window.history.pushState(null, '', '/blog');
            }}
            onSelectArticleSlug={(slug) => {
              setActiveArticleSlug(slug);
              window.history.pushState(null, '', `/blog/${slug}`);
            }}
            onBuyEventTickets={(event) => {
              setSelectedEvent(event);
            }}
          />
        )}

        {/* VIEW 2.5: FRICTIONLESS GUEST TICKET MANAGEMENT PORTAL */}
        {activeTab === 'manage_ticket' && (
          <TicketManagementPortal
            onBackToExplore={() => navigateTo('home')}
          />
        )}

        {/* VIEW 3: STANDALONE FOOTER PAGES (ABOUT, HELP, PRIVACY, TERMS, API, REFUNDS, GUIDES) */}
        {['about', 'help', 'privacy', 'terms', 'api', 'refunds', 'guides'].includes(activeTab) && (
          <FooterPageViews pageType={activeTab} onBackToHome={() => setActiveTab('home')} />
        )}

      </div>

      {/* ── 3. FULL ENTERPRISE SAAS FOOTER ── */}
      <footer style={{ background: '#04060E', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '64px 28px 36px', marginTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          
          {/* Col 1: Brand & Newsletter */}
          <div style={{ gridColumn: 'span 1' }}>
            <GetvntLogo height={38} theme="dark" />
            <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '16px', lineHeight: '1.6', maxWidth: '300px' }}>
              The premier AI-powered Event Business Operating System &amp; Global Ticket Marketplace for Africa and beyond.
            </p>
            
            {/* Newsletter Input Box */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFF', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Stay Updated on VIP Drops
              </div>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to GETVNT VIP newsletter!'); }} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="Enter email..."
                  required
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: '#FFF',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn-cta"
                  style={{ background: '#2563EB', color: '#FFF', padding: '8px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                >
                  Join
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <span style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', fontSize: '12px', color: '#34D399', fontWeight: 700 }}>
                ● 100% Uptime Operational
              </span>
            </div>
          </div>

          {/* Col 2: Discover Events */}
          <div>
            <h4 style={{ fontSize: '12.5px', fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>Discover &amp; Media</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#9CA3AF' }}>
              <li><a href="/blog" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('pulse'); }}>Pulse Entertainment Blog</a></li>
              <li><a href="/about" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>Music Concerts &amp; Afrobeats</a></li>
              <li><a href="/about" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>Lagos &amp; Nairobi Event Guides</a></li>
              <li><a href="/refunds" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('refunds'); }}>VIP Pass Flash Drops</a></li>
            </ul>
          </div>

          {/* Col 3: Organizers */}
          <div>
            <h4 style={{ fontSize: '12.5px', fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>For Event Organizers</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#9CA3AF' }}>
              <li><a href={getAppUrl('workspace')} style={{ color: '#06B6D4', textDecoration: 'none', fontWeight: 800 }}>Getvnt Organizer OS</a></li>
              <li><a href="/guides" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>AI Event Marketing Guide</a></li>
              <li><a href="/guides" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>Ticket Designer Desk</a></li>
              <li><a href="/guides" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>Branded QR Code Studio</a></li>
            </ul>
          </div>

          {/* Col 4: GETVNT Mobile & Support */}
          <div>
            <h4 style={{ fontSize: '12.5px', fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '18px' }}>GETVNT Mobile &amp; Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#9CA3AF' }}>
              <li><a href="/downloads/getvnt-organizer-v1.0.apk" download style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>📱 Download Android APK v1.0</a></li>
              <li><a href="/help" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('help'); }}>Help &amp; Knowledge Center</a></li>
              <li><a href="/api-docs" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('api'); }}>Developer API &amp; Webhooks</a></li>
              <li><a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy Policy &amp; Security</a></li>
              <li><a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#6B7280', flexWrap: 'wrap', gap: '16px' }}>
          <div>{brand.copyright_text || `© ${new Date().getFullYear()} Getvnt Enterprise Platform. All rights reserved.`}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {brand.support_email && (
              <a href={`mailto:${brand.support_email}`} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '12.5px' }}>{brand.support_email}</a>
            )}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#9CA3AF', fontSize: '13px', textDecoration: 'none', fontWeight: 800 }}>𝕏</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#9CA3AF', fontSize: '13px', textDecoration: 'none', fontWeight: 800 }}>IG</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#9CA3AF', fontSize: '13px', textDecoration: 'none', fontWeight: 800 }}>in</a>
          </div>
        </div>
      </footer>


      {/* ATTENDEE AUTH MODAL */}
      <SaaSAuthModal
        isOpen={showAuthModal}
        initialMode={authMode}
        onClose={() => setShowAuthModal(false)}
      />

      {/* EVENT TICKET CHECKOUT MODAL */}
      {selectedEvent && (
        <TicketCheckoutModal
          event={selectedEvent}
          currentUser={user}
          onClose={() => setSelectedEvent(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceContent />
    </AuthProvider>
  );
}
