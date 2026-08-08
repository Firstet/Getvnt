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
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active Tab state — supports Home, Pulse, Tickets, Wishlist, Manage Ticket, plus full standalone Footer Pages
  type TabType = 'home' | 'tickets' | 'wishlist' | 'pulse' | 'about' | 'help' | 'privacy' | 'terms' | 'api' | 'refunds' | 'guides' | 'manage_ticket';
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

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
      <header className="top-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(7, 9, 15, 0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>
            <GetvntLogo height={45} theme="dark" />
          </a>
        </div>

        {/* Center Header Navigation Links */}
        <nav className="header-nav-links" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flex: 1 }}>
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

        {/* Organizer B2B Conversion Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="header-search" style={{ maxWidth: '220px' }}>
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
            href={getAppUrl('admin')}
            style={{ color: '#EF4444', fontWeight: 800, fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Super Admin
          </a>

          <a
            href={getAppUrl('workspace')}
            style={{ color: '#A5B4FC', fontWeight: 800, fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Organizer Login
          </a>

          <a
            href={getAppUrl('workspace')}
            className="btn-cta"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              color: '#FFF', padding: '9px 18px', fontSize: '13px', fontWeight: 900,
              borderRadius: '99px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)', whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={14} /> Become an Organizer
          </a>
        </div>
      </header>

      {/* ── 2. MAIN PAGE CONTENT ── */}
      <div className="main-wrapper" style={{ flex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '24px 28px' }}>
        
        {/* VIEW 1: HOME LANDING PAGE */}
        {activeTab === 'home' && (
          <main className="content-area">
            {/* FEATURED HERO CAROUSEL */}
            <section
              className="sponsored-hero"
              style={{ background: `${currentHero.gradient}, url(${currentHero.image}) center/cover no-repeat` }}
              onMouseEnter={() => setIsHeroPaused(true)}
              onMouseLeave={() => setIsHeroPaused(false)}
            >
              <div className="hero-content-wrap">
                <span className="sponsored-tag">{currentHero.tag}</span>
                <h1 className="hero-title-main">{currentHero.title}</h1>
                <p className="hero-desc-main">{currentHero.description}</p>
                <button className="btn-cta" onClick={() => setSelectedEvent(events[0] || null)}>
                  {currentHero.cta} <ChevronRight size={14} />
                </button>
              </div>

              <button className="hero-nav-arrow hero-nav-prev" title="Previous Slide" onClick={handlePrevHero}>
                <ChevronLeft size={20} color="#FFF" />
              </button>
              <button className="hero-nav-arrow hero-nav-next" title="Next Slide" onClick={handleNextHero}>
                <ChevronRight size={20} color="#FFF" />
              </button>

              <div className="hero-switcher-dots">
                {heroItems.map((_, idx) => (
                  <div
                    key={idx}
                    className={`hero-dot ${activeHeroIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveHeroIndex(idx)}
                  />
                ))}
              </div>
            </section>

            {/* FLASH EARLY BIRD TICKET DROP */}
            <section className="flash-drop-card">
              <div style={{ flex: 1, maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span className="flash-timer-badge">
                    <Clock size={14} /> Live Flash Drop • 04h : 18m : 32s
                  </span>
                  <span style={{ fontSize: '12px', color: '#FBBF24', fontWeight: 700 }}>
                    🔥 88% Sold Out
                  </span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>
                  Early-Bird Pass Flash Discount Drop
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                  Unlock exclusive 20% discount on VIP &amp; General Admission passes for top Afrobeats and Tech summits across Africa.
                </p>
                <div className="flash-progress-bg">
                  <div className="flash-progress-fill" style={{ width: '88%' }}></div>
                </div>
              </div>
              <button
                className="btn-cta"
                style={{ background: '#7C3AED', color: '#FFF' }}
                onClick={() => setSelectedEvent(events[0] || null)}
              >
                <Zap size={16} /> Claim Flash Discount
              </button>
            </section>

            {/* DESTINATION CITIES SELECTOR */}
            <section style={{ marginBottom: '24px' }}>
              <div className="section-title-row">
                <h2 className="section-h2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={20} color="#2563EB" /> Popular Event Destinations
                </h2>
              </div>
              <div className="city-selector-bar">
                {citiesList.map((c) => (
                  <div
                    key={c.name}
                    className={`city-pill ${selectedCity === c.name || (c.name === 'All Africa' && selectedCity === 'All') ? 'active' : ''}`}
                    onClick={() => setSelectedCity(c.name === 'All Africa' ? 'All' : c.name)}
                  >
                    {c.flag} {c.name}
                  </div>
                ))}
              </div>
            </section>

            {/* CATEGORY EXPLORER */}
            <section>
              <div className="section-title-row">
                <h2 className="section-h2">Explore Categories</h2>
              </div>
              <div className="category-scroll">
                {categoriesList.map((cat) => (
                  <div
                    key={cat}
                    className={`category-pill ${category === cat || (cat === 'Music & Concerts' && category === 'Music') ? 'active' : ''}`}
                    onClick={() => setCategory(cat === 'Music & Concerts' ? 'Music' : cat === 'Tech & AI' ? 'Technology' : cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </section>

            {/* UPCOMING EVENTS CAROUSEL */}
            <section style={{ marginBottom: '48px' }}>
              <div className="section-title-row">
                <h2 className="section-h2">Upcoming Events</h2>
                <a href="#" className="see-all-link">See all</a>
              </div>

              <div className="carousel-h-scroll">
                {events.map((ev) => (
                  <div key={ev.id} className="carousel-card">
                    <div className="carousel-banner-wrap">
                      <img src={ev.banner_url} alt={ev.title} loading="lazy" className="carousel-img" />
                      <span className="badge-date">
                        {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="carousel-body">
                      <div>
                        <h3 className="carousel-title">{ev.title}</h3>
                        <div className="carousel-venue">
                          <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {ev.venue_name}, {ev.city}
                        </div>
                      </div>
                      <div className="carousel-footer">
                        <span className="price-text">
                          {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : 'Free'}
                        </span>
                        <button className="btn-buy" onClick={() => setSelectedEvent(ev)}>
                          Get Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* GETVNT PULSE — LANDING PAGE COMPACT NEWS STAND (EXACTLY 4 ITEMS IN 1 SINGLE ROW) */}
            {/* 4-COLUMN AUTO-SCROLLING GOOGLE NEWS CAROUSEL (5-min auto update) */}
            <HomeNewsCarousel
              onOpenArticle={(slug) => {
                setActiveTab('pulse');
                setActiveArticleSlug(slug);
                window.history.pushState(null, '', `/blog/${slug}`);
              }}
              onOpenBlogHub={() => {
                setActiveTab('pulse');
                setActiveArticleSlug(null);
                window.history.pushState(null, '', '/blog');
              }}
            />

            {/* VIP & BACKSTAGE PASSES BANNER */}
            <section className="vip-card">
              <div style={{ flex: 1, maxWidth: '640px' }}>
                <span className="vip-pill">
                  <Crown size={12} style={{ display: 'inline', marginRight: '4px' }} /> Premium Experience
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '10px 0 8px 0', fontFamily: 'var(--font-heading)' }}>
                  Getvnt VIP Access &amp; Backstage Passes
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.5' }}>
                  Enjoy fast-track skip the line access, private luxury lounge seating, complimentary cocktails, and artist meet &amp; greets.
                </p>
              </div>
              <button className="btn-cta" style={{ background: '#FFF', color: '#0B0F19', fontWeight: 800 }}>
                Explore VIP Passes
              </button>
            </section>

            {/* LATEST EVENTS MAIN GRID */}
            <section style={{ marginBottom: '48px' }}>
              <div className="section-title-row">
                <h2 className="section-h2">Latest Events Across Africa</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  {events.length} events found
                </span>
              </div>

              <div className="events-main-grid">
                {events.map((ev) => (
                  <div key={ev.id} className="carousel-card" style={{ width: '100%' }}>
                    <div className="carousel-banner-wrap" style={{ height: '180px' }}>
                      <img src={ev.banner_url} alt={ev.title} loading="lazy" className="carousel-img" />
                      <span className="badge-date">{ev.category}</span>
                    </div>
                    <div className="carousel-body">
                      <div>
                        <h3 className="carousel-title" style={{ fontSize: '17px' }}>{ev.title}</h3>
                        <div className="carousel-venue" style={{ fontSize: '13px' }}>
                          <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          {ev.venue_name}, {ev.city}, {ev.country}
                        </div>
                      </div>
                      <div className="carousel-footer">
                        <span className="price-text">
                          {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : '₦25,000'}
                        </span>
                        <button className="btn-buy" onClick={() => setSelectedEvent(ev)}>
                          Buy Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TOP RATED ORGANIZERS LEADERBOARD */}
            <section className="organizers-card">
              <h2 className="organizers-title">Top Rated Event Organizers</h2>
              {topOrganizers.map((org) => (
                <div key={org.rank} className="organizer-row">
                  <div className="organizer-left">
                    <span className="org-rank">#{org.rank}</span>
                    <div className="org-avatar">
                      {org.name.charAt(0)}
                    </div>
                    <span className="org-name">{org.name}</span>
                  </div>
                  <div className="organizer-right">
                    <span className="org-sales">{org.buyers} buyers</span>
                    <span className="org-trend">{org.trend}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* FAQ ACCORDION */}
            <section className="faq-section">
              <div className="section-title-row">
                <h2 className="section-h2">Common Questions</h2>
                <a href="#" className="see-all-link" onClick={(e) => { e.preventDefault(); setActiveTab('help'); }}>View full FAQ</a>
              </div>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="faq-item"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <div className="faq-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CircleHelp color="#2563EB" size={20} />
                      <span>{faq.question}</span>
                    </div>
                    <ChevronRight size={18} style={{ transform: openFaq === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                  {openFaq === idx && (
                    <div className="faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </section>

            {/* FINAL CONVERSION SECTION BEFORE FOOTER: GETVNT MOBILE APP SHOWCASE */}
            <AndroidAppPromotion />
          </main>
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

      {/* ── 3. FULL ENTERPRISE FOOTER ── */}
      <footer style={{ background: '#04060E', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '56px 28px 32px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          {/* Col 1: Platform Brand */}
          <div>
            <GetvntLogo height={38} theme="dark" />
            <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '16px', lineHeight: '1.6', maxWidth: '280px' }}>
              Getvnt is the premier AI-powered Event Business Operating System &amp; Global Ticket Marketplace across Africa and worldwide.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', fontSize: '12px', color: '#60A5FA', fontWeight: 700 }}>
                ● 100% Uptime Operational
              </span>
            </div>
          </div>

          {/* Col 2: Discover Events */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Discover Events &amp; Blog</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9CA3AF' }}>
              <li><a href="/blog" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('pulse'); }}>Pulse Entertainment Blog</a></li>
              <li><a href="/about" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>Music Concerts &amp; Afrobeats</a></li>
              <li><a href="/about" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('about'); }}>Lagos &amp; Nairobi Event Guides</a></li>
              <li><a href="/refunds" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('refunds'); }}>VIP Pass Flash Drops</a></li>
            </ul>
          </div>

          {/* Col 3: Organizers */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>For Event Organizers</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9CA3AF' }}>
              <li><a href={getAppUrl('workspace')} style={{ color: '#06B6D4', textDecoration: 'none', fontWeight: 700 }}>Getvnt Organizer OS</a></li>
              <li><a href={getAppUrl('admin')} style={{ color: '#EF4444', textDecoration: 'none', fontWeight: 700 }}>Super Admin Console</a></li>
              <li><a href="/guides" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>AI Event Marketing Guide</a></li>
              <li><a href="/guides" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>Ticket Designer Desk</a></li>
              <li><a href="/guides" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('guides'); }}>Branded QR Code Studio</a></li>
            </ul>
          </div>

          {/* Col 4: GETVNT Mobile App */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>GETVNT Mobile</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9CA3AF' }}>
              <li><a href="/downloads/getvnt-organizer-v1.0.apk" download style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>📱 Download Android APK v1.0</a></li>
              <li><span style={{ fontSize: '12px', color: '#64748B' }}>Min OS: Android 8.0+ (28 MB)</span></li>
              <li><a href="/help" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('help'); }}>Mobile App System Requirements</a></li>
              <li><a href="/help" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('help'); }}>Release Notes (v1.0 Build 104)</a></li>
            </ul>
          </div>

          {/* Col 5: Support & Legal */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Support &amp; Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9CA3AF' }}>
              <li><a href="/help" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('help'); }}>Help &amp; Knowledge Center</a></li>
              <li><a href="/api-docs" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('api'); }}>Developer API &amp; Webhooks</a></li>
              <li><a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('privacy'); }}>Privacy Policy &amp; Security</a></li>
              <li><a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); navigateTo('terms'); }}>Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6B7280', flexWrap: 'wrap', gap: '12px' }}>
          <div>{brand.copyright_text || `© ${new Date().getFullYear()} Getvnt Enterprise Platform. All rights reserved.`}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {brand.support_email && (
              <a href={`mailto:${brand.support_email}`} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '12px' }}>{brand.support_email}</a>
            )}
            {brand.social_links?.twitter && (
              <a href={brand.social_links.twitter} target="_blank" rel="noreferrer" style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>𝕏</a>
            )}
            {brand.social_links?.instagram && (
              <a href={brand.social_links.instagram} target="_blank" rel="noreferrer" style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>IG</a>
            )}
            {brand.social_links?.linkedin && (
              <a href={brand.social_links.linkedin} target="_blank" rel="noreferrer" style={{ color: '#6B7280', fontSize: '12px', textDecoration: 'none' }}>in</a>
            )}
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
