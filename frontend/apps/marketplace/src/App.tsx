import React, { useEffect, useState } from 'react';
import {
  House, Ticket, Heart, Flame, MessageSquare, PackagePlus, User,
  Search, Bell, Sparkles, ChevronRight, ChevronLeft, Calendar, MapPin, Bot,
  CircleHelp, Building2, DollarSign, Zap, Send, Mail, ArrowRight, X, Menu,
  Clock, ShieldCheck, Crown, Compass, Tag, Layers, LogOut, Lock, AlertCircle,
  Rss, ExternalLink, Share2, BookOpen, CheckCircle, Smartphone, Download
} from 'lucide-react';
import { useResponsiveSidebar, AuthProvider, useAuth, PasswordField, SaaSAuthModal, getAppUrl, apiClient, FloatingAiAssistant } from '../../../shared/src';
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
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
      
      {/* ── 1. REDESIGNED STICKY TOP NAVBAR (3-COLUMN RESPONSIVE LAYOUT) ── */}
      <header className={`top-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          
          {/* Column 1: Getvnt Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
              <GetvntLogo height={46} theme="dark" />
            </a>
          </div>

          {/* Column 2: Center Header Navigation Menu (16px, 600 weight, 36px gap) */}
          <nav className="header-nav-links">
            <div
              className="header-nav-item-wrap"
              onMouseEnter={() => setShowExploreDropdown(true)}
              onMouseLeave={() => setShowExploreDropdown(false)}
              style={{ position: 'relative' }}
            >
              <a
                className={`header-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
              >
                Explore Events <ChevronRight size={14} style={{ transform: showExploreDropdown ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </a>

              {/* Mega Dropdown Menu */}
              {showExploreDropdown && (
                <div className="header-mega-menu">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>CURATED SELECTIONS</div>
                      <a style={{ display: 'block', padding: '8px 12px', color: '#FFF', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', marginBottom: '4px' }} onClick={() => { navigateTo('home'); setShowExploreDropdown(false); }}>
                        ⭐ Featured Events
                      </a>
                      <a style={{ display: 'block', padding: '8px 12px', color: '#FFF', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', borderRadius: '8px', marginBottom: '4px' }} onClick={() => { navigateTo('home'); setShowExploreDropdown(false); }}>
                        🔥 Latest Events
                      </a>
                      <a style={{ display: 'block', padding: '8px 12px', color: '#FFF', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', borderRadius: '8px', marginBottom: '4px' }} onClick={() => { navigateTo('home'); setShowExploreDropdown(false); }}>
                        ⚡ Trending Across Africa
                      </a>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>POPULAR CATEGORIES</div>
                      {['Music & Concerts', 'Tech & AI', 'Business & Summits', 'Comedy Shows', 'Networking'].map((cat) => (
                        <a key={cat} style={{ display: 'block', padding: '6px 12px', color: '#9CA3AF', fontSize: '13px', textDecoration: 'none' }} onClick={() => { navigateTo('home'); setShowExploreDropdown(false); }}>
                          {cat}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a className={`header-nav-item ${activeTab === 'manage_ticket' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('manage_ticket'); }}>
              Manage Ticket
            </a>
            <a className={`header-nav-item ${activeTab === 'pulse' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('pulse'); }}>
              Pulse
            </a>
            <a className={`header-nav-item ${activeTab === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>
              Pricing
            </a>
            <a className={`header-nav-item ${activeTab === 'help' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('help'); }}>
              Help
            </a>
          </nav>

          {/* Column 3: Right Action Area (Pill Search Capsule, Login, Become an Organizer CTA) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 1.5vw, 20px)', flexShrink: 0 }}>
            <div className="header-pill-search">
              <Search size={15} color="#60A5FA" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#FFF', fontSize: '13.5px', outline: 'none' }}
              />
            </div>

            <a
              href={getAppUrl('workspace')}
              style={{ color: '#A5B4FC', fontWeight: 600, fontSize: '14.5px', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s ease', flexShrink: 0 }}
              className="desktop-only-link"
            >
              Login
            </a>

            <a
              href={getAppUrl('workspace')}
              className="header-cta-primary"
            >
              Get Started
            </a>

            {/* Mobile Touch Targets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="mobile-hamburger-btn"
                aria-label="Search Events"
                onClick={() => navigateTo('home')}
                style={{ width: '48px', height: '48px' }}
              >
                <Search size={20} color="#FFF" />
              </button>

              <button
                className="mobile-hamburger-btn"
                aria-label="Toggle Mobile Menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ width: '48px', height: '48px' }}
              >
                {mobileMenuOpen ? <X size={22} color="#FFF" /> : <Menu size={22} color="#FFF" />}
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* ── MOBILE FULL-SCREEN SLIDING DRAWER ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(8,10,20,0.98)',
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
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Explore Events', tab: 'home' },
              { label: 'Categories', tab: 'home' },
              { label: 'Upcoming Events', tab: 'home' },
              { label: 'Featured Events', tab: 'home' },
              { label: 'Latest Events', tab: 'home' },
              { label: 'Events You Will Like', tab: 'home' },
              { label: 'Top Organizers', tab: 'home' },
              { label: 'Pulse Blog', tab: 'pulse' },
              { label: 'Pricing', tab: 'about' },
              { label: 'Help Center', tab: 'help' },
              { label: 'Login', external: getAppUrl('workspace') },
            ].map((item, idx) => (
              item.external ? (
                <a
                  key={idx}
                  href={item.external}
                  style={{ fontSize: '16px', fontWeight: 600, color: '#A5B4FC', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={idx}
                  style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => { navigateTo(item.tab as TabType); setMobileMenuOpen(false); }}
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
            <a
              href={getAppUrl('workspace')}
              className="header-cta-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Get Started
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

      {/* ── 3. SINGLE ENTERPRISE GLOBAL FOOTER ── */}
      <footer style={{
        position: 'relative',
        background: '#05070D',
        backgroundImage: 'linear-gradient(180deg, rgba(5,7,13,0.92) 0%, rgba(5,7,13,0.98) 100%), url(/concert_crowd_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '64px',
        paddingBottom: '48px',
        width: '100%'
      }}>
        <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', paddingInline: 'clamp(20px, 4vw, 72px)', boxSizing: 'border-box' }}>
          
          {/* Top Row: Newsletter Card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(13,17,32,0.9) 100%)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '24px', padding: 'clamp(24px, 4vw, 36px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '56px' }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFF', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>Subscribe to Event Intelligence</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>Get weekly curated drops, concert announcements, and promoter strategy reports.</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.currentTarget;
                const btn = target.querySelector('button');
                if (btn) {
                  btn.innerText = '✓ Subscribed!';
                  btn.style.background = '#10B981';
                  setTimeout(() => {
                    btn.innerText = 'Subscribe';
                    btn.style.background = '';
                    target.reset();
                  }, 2500);
                }
              }}
              style={{ display: 'flex', gap: '10px', flex: 1, maxWidth: '460px' }}
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                required
                style={{ flex: 1, background: 'rgba(7,9,15,0.85)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0 20px', color: '#FFF', outline: 'none', fontSize: '14px', height: '48px' }}
              />
              <button type="submit" className="tixup-btn-primary" style={{ height: '48px', padding: '0 24px' }}>
                Subscribe
              </button>
            </form>
          </div>

          {/* 4 Clean Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
            
            {/* Col 1: Brand & Operational Status */}
            <div>
              <GetvntLogo height={40} theme="dark" />
              <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '16px', lineHeight: '1.6', maxWidth: '300px' }}>
                The premier AI-powered Event Business Operating System &amp; Global Ticket Marketplace for Africa and beyond.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                <span style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', fontSize: '12px', color: '#34D399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                  ● 100% Uptime Operational
                </span>
                <a href="/downloads/getvnt-organizer-v1.0.apk" download style={{ color: '#60A5FA', textDecoration: 'none', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  📱 Download Android Gate Scanner APK v1.0
                </a>
              </div>
            </div>

            {/* Col 2: Discover Events */}
            <div>
              <h4 style={{ fontSize: '14.5px', fontWeight: 900, color: '#FFF', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Discover</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#9CA3AF' }}>
                <li><a style={{ color: '#9CA3AF', textDecoration: 'none', cursor: 'pointer' }} onClick={() => navigateTo('home')}>Explore All Events</a></li>
                <li><a style={{ color: '#9CA3AF', textDecoration: 'none', cursor: 'pointer' }} onClick={() => navigateTo('home')}>Featured Concerts</a></li>
                <li><a style={{ color: '#9CA3AF', textDecoration: 'none', cursor: 'pointer' }} onClick={() => navigateTo('home')}>Tech &amp; AI Summits</a></li>
                <li><a style={{ color: '#9CA3AF', textDecoration: 'none', cursor: 'pointer' }} onClick={() => navigateTo('pulse')}>Pulse Entertainment Blog</a></li>
              </ul>
            </div>

            {/* Col 3: Organizers */}
            <div>
              <h4 style={{ fontSize: '14.5px', fontWeight: 900, color: '#FFF', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Organizers</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#9CA3AF' }}>
                <li><a href={getAppUrl('workspace')} style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 700 }}>Getvnt Organizer OS</a></li>
                <li><a href="/guides" style={{ color: '#9CA3AF', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>AI Event Marketing Guide</a></li>
                <li><a href="/guides" style={{ color: '#9CA3AF', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>Ticket Designer Desk</a></li>
                <li><a href="/guides" style={{ color: '#9CA3AF', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>Branded QR Code Studio</a></li>
              </ul>
            </div>

            {/* Col 4: Support & Legal */}
            <div>
              <h4 style={{ fontSize: '14.5px', fontWeight: 900, color: '#FFF', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>Support &amp; Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#9CA3AF' }}>
                <li><a href="/help" style={{ color: '#9CA3AF', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('help'); }}>Help Center &amp; FAQs</a></li>
                <li><a href="/manage_ticket" style={{ color: '#9CA3AF', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('manage_ticket'); }}>Lookup Ticket Order</a></li>
                <li><a href="/api-docs" style={{ color: '#9CA3AF', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('api'); }}>Developer API &amp; Webhooks</a></li>
                <li><a href="/privacy" style={{ color: '#9CA3AF', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy Policy &amp; Security</a></li>
                <li><a href="/terms" style={{ color: '#9CA3AF', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms of Service</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#6B7280', flexWrap: 'wrap', gap: '16px' }}>
            <div>{brand.copyright_text || `© ${new Date().getFullYear()} Getvnt Technologies Ltd. All rights reserved.`}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {brand.support_email && (
                <a href={`mailto:${brand.support_email}`} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '13px' }}>{brand.support_email}</a>
              )}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#9CA3AF', fontSize: '14px', textDecoration: 'none', fontWeight: 800 }}>𝕏</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#9CA3AF', fontSize: '14px', textDecoration: 'none', fontWeight: 800 }}>IG</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#9CA3AF', fontSize: '14px', textDecoration: 'none', fontWeight: 800 }}>in</a>
            </div>
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

      {/* Floating AI Assistant Chatbot */}
      <FloatingAiAssistant role="attendee" />
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
