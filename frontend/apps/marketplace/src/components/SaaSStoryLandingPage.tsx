import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, Download, QrCode,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Star, Play, ChevronRight,
  Compass, Crown, Clock, HelpCircle, BarChart3, Layers, Bot, Globe, Check, ArrowUpRight, Ticket, Rss, Search, ShieldCheck, Activity, Cpu
} from 'lucide-react';
import { LazyImage } from '../../../../shared/src';
import { AndroidAppPromotion } from './AndroidAppPromotion';
import { HomeNewsCarousel } from './HomeNewsCarousel';

interface SaaSStoryLandingPageProps {
  events: any[];
  onSelectEvent: (event: any) => void;
  onNavigateToWorkspace: () => void;
  onNavigateToBlog: (slug?: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const SaaSStoryLandingPage: React.FC<SaaSStoryLandingPageProps> = ({
  events,
  onSelectEvent,
  onNavigateToWorkspace,
  onNavigateToBlog,
  onNavigateToTab,
}) => {
  const [activeDashboardTab, setActiveDashboardTab] = useState<'revenue' | 'gate' | 'ai'>('revenue');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredEvent = events[0] || {
    id: 'feat-1',
    title: 'Afrobeats Worldwide Festival Lagos 2026',
    venue_name: 'Eko Atlantic City',
    city: 'Lagos',
    country: 'Nigeria',
    start_date: '2026-11-20T18:00:00Z',
    banner_url: '/afrobeat_festival_banner.png',
    ticket_types: [{ price: 35000, name: 'VIP Pass' }]
  };

  const citiesList = [
    { name: 'All Africa', flag: '🌍' },
    { name: 'Lagos', flag: '🇳🇬' },
    { name: 'Nairobi', flag: '🇰🇪' },
    { name: 'Cape Town', flag: '🇿🇦' },
    { name: 'Accra', flag: '🇬🇭' },
    { name: 'London', flag: '🇬🇧' },
  ];

  const categoriesList = [
    { id: 'All', label: '⚡ All Events' },
    { id: 'Music', label: '🎵 Music & Concerts' },
    { id: 'Technology', label: '💻 Tech & AI' },
    { id: 'Culture', label: '🎪 Cultural Festivals' },
    { id: 'Nightlife', label: '🍸 Nightlife' },
    { id: 'Sports', label: '⚽ Sports' },
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesCity = selectedCity === 'All' || selectedCity === 'All Africa' || ev.city?.toLowerCase() === selectedCity.toLowerCase();
    const matchesCat = selectedCategory === 'All' || ev.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery || ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) || ev.venue_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCat && matchesSearch;
  });

  const faqs = [
    { question: 'How quickly can I set up an event on GETVNT?', answer: 'Launch a full event page with custom ticket tiers, seat maps, and AI marketing copy in under 3 minutes using Getvnt Organizer OS.' },
    { question: 'How do payout settlements work for ticket sales?', answer: 'Ticket sales are settled directly into your connected Paystack, Flutterwave, or Stripe bank account in real-time or within 24 hours.' },
    { question: 'Is offline gate check-in supported if internet drops at the venue?', answer: 'Yes! The GETVNT Android App features offline RSA encrypted QR code scanning that syncs seamlessly once connectivity is restored.' },
    { question: 'What platform fees does GETVNT charge?', answer: 'Free events are 100% free. Paid events start at 2.5% + ₦100 per ticket, or 0% platform fee on custom Enterprise plans.' },
  ];

  return (
    <div className="tixup-inspired-marketplace" style={{ color: '#F9FAFB', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      
      {/* ── 1. HERO WITH INTEGRATED SEARCH ── */}
      <section className="hero-landing-section">
        
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: 'clamp(320px, 90vw, 1100px)', height: '480px', background: 'radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(124,58,237,0.08) 50%, transparent 75%)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 'var(--container-max-width)', margin: '0 auto', padding: '0 clamp(16px, 3vw, 48px)', position: 'relative', zIndex: 2, boxSizing: 'border-box' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '99px', background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(37,99,235,0.35)', color: '#60A5FA', fontSize: '11.5px', fontWeight: 800, marginBottom: '24px', maxWidth: '100%' }}>
            <Sparkles size={14} color="#60A5FA" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>GETVNT OS v2.0 • The Event Infrastructure for Africa &amp; Global Cities</span>
          </div>

          <h1 style={{ fontSize: 'var(--font-hero)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
            Discover &amp; Experience <br />
            <span style={{ color: '#60A5FA', background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>World-Class Events.</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2.2vw, 20px)', color: '#9CA3AF', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 36px auto', fontWeight: 500 }}>
            Book verified tickets for concerts, Afrobeats festivals, and tech summits. Powered by instant <strong style={{ color: '#E2E8F0' }}>&lt;500ms gate scanning</strong> and encrypted QR verification.
          </p>

          <div className="hero-search-container">
            <div className="hero-search-field">
              <Search size={18} color="#60A5FA" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#FFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div className="hero-city-field">
              <MapPin size={16} color="#34D399" style={{ flexShrink: 0 }} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#FFF', fontSize: '13.5px', outline: 'none', cursor: 'pointer' }}
              >
                {citiesList.map((c) => (
                  <option key={c.name} value={c.name === 'All Africa' ? 'All' : c.name} style={{ background: '#0D1120', color: '#FFF' }}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={() => {}} className="btn-cta hero-search-btn">
              <Search size={16} /> Discover Events
            </button>
          </div>

        </div>
      </section>

      {/* ── 2. FEATURED EVENTS SHOWCASE ── */}
      <section className="landing-section-wrap">
        <div className="featured-event-responsive-card" style={{ overflow: 'hidden', boxSizing: 'border-box' }}>
          
          <div style={{ borderRadius: '20px', overflow: 'hidden', minHeight: '240px', position: 'relative' }}>
            <LazyImage src={featuredEvent.banner_url} alt={featuredEvent.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
            <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(245,158,11,0.95)', color: '#0B0F19', fontSize: '11px', fontWeight: 900, padding: '5px 12px', borderRadius: '99px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
              <Crown size={13} style={{ display: 'inline', marginRight: '4px' }} /> FEATURED DROP
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
            <div>
              <span style={{ color: '#F87171', fontSize: '11.5px', fontWeight: 800, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 12px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} /> Live Flash Drop • 88% Sold Out
              </span>
              <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#FFF', marginTop: '12px', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
                {featuredEvent.title}
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                {featuredEvent.venue_name}, {featuredEvent.city} • Experience live Afrobeats stars, VIP champagne lounge seating, and instant encrypted ticket delivery.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.5px' }}>TICKET STARTS AT</span>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#F59E0B' }}>₦35,000</div>
              </div>
              <button
                onClick={() => onSelectEvent(featuredEvent)}
                className="btn-cta"
                style={{ padding: '14px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#07090F', fontWeight: 900, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(245,158,11,0.35)' }}
              >
                <Zap size={16} /> Get VIP Ticket
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. GETVNT PULSE BLOG CAROUSEL ── */}
      <section className="landing-section-wrap">
        <HomeNewsCarousel
          onOpenArticle={(slug) => onNavigateToBlog(slug)}
          onOpenBlogHub={() => onNavigateToBlog()}
        />
      </section>

      {/* ── 4. BROWSE CATEGORIES ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-heading)' }}>Browse Categories</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '99px',
                border: '1px solid',
                borderColor: selectedCategory === cat.id ? '#2563EB' : 'rgba(255,255,255,0.12)',
                background: selectedCategory === cat.id ? 'rgba(37,99,235,0.22)' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === cat.id ? '#60A5FA' : '#9CA3AF',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 5. TRENDING EVENTS GRID ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>CURATED SELECTION</span>
            <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#FFF', margin: '6px 0 0 0', fontFamily: 'var(--font-heading)' }}>
              Trending Events Across Africa
            </h2>
          </div>
        </div>

        <div className="responsive-event-cards-grid">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              style={{
                background: 'rgba(13,17,32,0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                width: '100%',
                boxSizing: 'border-box'
              }}
              className="carousel-card"
            >
              <div className="carousel-banner-wrap" style={{ height: '190px' }}>
                <LazyImage src={ev.banner_url} alt={ev.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
                <span className="badge-date">
                  {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(8px)', color: '#60A5FA', fontSize: '10.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(37,99,235,0.3)' }}>
                  {ev.category || 'General'}
                </span>
              </div>

              <div className="carousel-body" style={{ padding: '18px' }}>
                <div>
                  <h3 className="carousel-title" style={{ fontSize: '16.5px' }}>{ev.title}</h3>
                  <div className="carousel-venue" style={{ fontSize: '13px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {ev.venue_name}, {ev.city}
                  </div>
                </div>

                <div className="carousel-footer" style={{ marginTop: '14px', paddingTop: '14px' }}>
                  <span className="price-text" style={{ fontSize: '17px' }}>
                    {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : 'FREE'}
                  </span>
                  <button className="btn-buy" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}>
                    Get Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. WHY GETVNT (ASYMMETRICAL SPLIT SHOWCASE) ── */}
      <section className="landing-section-wrap">
        <div className="responsive-split-grid" style={{ overflow: 'hidden', boxSizing: 'border-box' }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>WHY GETVNT</span>
            <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#FFF', marginTop: '8px', marginBottom: '20px', fontFamily: 'var(--font-heading)', lineHeight: 1.15 }}>
              Built for High Scale &amp; Zero Ticket Fraud.
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.65, marginBottom: '28px' }}>
              GETVNT combines high-speed mobile scanning, real-time revenue analytics, and automated multi-currency payouts into one seamless operating system.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="#34D399" style={{ flexShrink: 0 }} /> Sub-500ms encrypted QR gate check-in
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="#34D399" style={{ flexShrink: 0 }} /> Direct bank settlement via Paystack &amp; Stripe
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '14px', fontWeight: 600 }}>
                <CheckCircle2 size={18} color="#34D399" style={{ flexShrink: 0 }} /> AI Marketing Assistant &amp; Price Optimizer
              </div>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(13,18,34,0.95) 0%, rgba(7,9,15,0.98) 100%)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '28px', padding: '32px', textAlign: 'center', width: '100%', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
            <Shield size={64} color="#60A5FA" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF' }}>100% Anti-Counterfeiting RSA Security</h3>
            <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '10px', lineHeight: 1.6 }}>Every pass is assigned a dynamic 4096-bit cryptographic signature that prevents screenshots and duplicate pass entry attempts.</p>
          </div>
        </div>
      </section>

      {/* ── 7. ORGANIZER OS FEATURE CARDS ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#F59E0B', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>ORGANIZER OS</span>
          <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Complete Event Operating Suite
          </h2>
        </div>
        <div className="responsive-organizer-grid">
          {[
            { title: 'Ticket Designer Desk', desc: 'Design custom PDF & mobile passes with custom QR codes and VIP badges.', icon: <Layers size={22} color="#FBBF24" /> },
            { title: 'Audience CRM & Loyalty', desc: 'Track repeat buyers, send automated WhatsApp broadcasts, and issue VIP perks.', icon: <Users size={22} color="#F472B6" /> },
            { title: 'AI Sponsorship Decks', desc: 'Generate multi-page sponsorship pitch decks tailored for corporate partners.', icon: <BarChart3 size={22} color="#C084FC" /> },
            { title: 'Branded QR Studio', desc: 'Create high-contrast custom branded QR codes with embedded logos.', icon: <QrCode size={22} color="#38BDF8" /> },
          ].map((card, idx) => (
            <div key={idx} style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '22px', padding: '24px', width: '100%', boxSizing: 'border-box', transition: 'all 0.2s ease' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>{card.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '13.5px', lineHeight: 1.55, margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. AI CO-PILOT ENGINE SHOWCASE ── */}
      <section className="landing-section-wrap">
        <div className="responsive-ai-card-wrap">
          <div>
            <span style={{ color: '#C084FC', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>🤖 AI CO-PILOT ENGINE</span>
            <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#FFF', marginTop: '8px', marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>
              Autonomous Marketing &amp; Price Optimization
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
              Our AI engine continuously analyzes attendee buying behavior and recommends ticket pricing adjustments to maximize revenue without reducing conversion velocity.
            </p>
            <button
              onClick={onNavigateToWorkspace}
              className="btn-cta"
              style={{ background: '#7C3AED', color: '#FFF', padding: '12px 24px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
            >
              Explore AI Suite <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
            </button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ color: '#C084FC', fontSize: '12px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> AI PRICE RECOMMENDATION STREAM
            </div>
            <p style={{ color: '#E2E8F0', fontSize: '14px', lineHeight: 1.55, margin: 0 }}>
              "Ticket velocity is 28% above average. Increasing Tier 2 passes by ₦5,000 will yield an estimated +₦3.4M in GMV."
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. EXECUTIVE REVENUE RADAR (HERO DASHBOARD PREVIEW) ── */}
      <section className="landing-section-wrap" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ color: '#06B6D4', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>EXECUTIVE CONTROL</span>
          <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Real-Time Revenue &amp; Gate Telemetry Radar
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '15px', marginTop: '8px', maxWidth: '640px', margin: '8px auto 0 auto' }}>
            Monitor ticket sales velocity, attendee gate scans, and financial payouts in real time.
          </p>
        </div>

        {/* Dashboard Tab Controls */}
        <div style={{ display: 'inline-flex', gap: '8px', padding: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'revenue', label: '💰 Live Revenue Radar' },
            { id: 'gate', label: '🎟️ Gate Telemetry (<500ms)' },
            { id: 'ai', label: '🤖 AI Yield Optimizer' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDashboardTab(tab.id as any)}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                border: 'none',
                background: activeDashboardTab === tab.id ? '#2563EB' : 'transparent',
                color: activeDashboardTab === tab.id ? '#FFF' : '#9CA3AF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Showcase Shell */}
        <div style={{ background: '#0D1120', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.85)', padding: '24px', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 800 }}>LIVE TICKET REVENUE</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: '4px 0' }}>₦48,650,000</div>
              <div style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 700 }}>↑ +42% vs last week</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 800 }}>ATTENDEE CHECK-INS</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#60A5FA', margin: '4px 0' }}>14,280 / 15,000</div>
              <div style={{ fontSize: '11.5px', color: '#60A5FA', fontWeight: 700 }}>95% Gate Occupancy</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 800 }}>SCAN SPEED</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#34D399', margin: '4px 0' }}>380ms</div>
              <div style={{ fontSize: '11.5px', color: '#34D399', fontWeight: 700 }}>RSA 4096 Encrypted</div>
            </div>
          </div>

          {/* Dynamic Telemetry Chart Bar Stream */}
          <div style={{ height: '160px', background: 'linear-gradient(180deg, rgba(37,99,235,0.18) 0%, transparent 100%)', borderRadius: '16px', border: '1px solid rgba(37,99,235,0.3)', padding: '16px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {[45, 70, 60, 90, 110, 80, 95, 120, 105, 130, 145, 160].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}px`, background: 'linear-gradient(180deg, #60A5FA 0%, #2563EB 100%)', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease' }} />
            ))}
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={onNavigateToWorkspace}
              className="btn-cta"
              style={{ background: '#2563EB', color: '#FFF', padding: '12px 28px', borderRadius: '14px', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(37,99,235,0.4)' }}
            >
              Launch Organizer Workspace OS <ArrowUpRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
            </button>
          </div>

        </div>
      </section>

      {/* ── 10. MOBILE SCANNER APP SHOWCASE ── */}
      <section className="landing-section-wrap">
        <AndroidAppPromotion />
      </section>

      {/* ── 11. ORGANIZER TESTIMONIALS ── */}
      <section className="landing-section-wrap">
        <div className="responsive-testimonial-card-wrap">
          <span style={{ color: '#C084FC', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>ORGANIZER STORIES</span>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#FFF', marginTop: '6px', marginBottom: '28px', fontFamily: 'var(--font-heading)' }}>
            Trusted by Festival Directors &amp; Promoters
          </h2>
          <div className="responsive-testimonial-grid">
            {[
              { quote: '"GETVNT transformed how we run Afrobeats festivals in Lagos. Gate scan times dropped below 400ms."', author: 'Tunde Bakare', role: 'AfroNation Lagos' },
              { quote: '"The AI assistant generated our entire sponsorship deck. We sold out 15,000 passes in less than 4 days."', author: 'Amina Osei', role: 'Nairobi Tech Expo' },
            ].map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <p style={{ color: '#E2E8F0', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '16px' }}>{t.quote}</p>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFF' }}>{t.author}</div>
                <div style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 600 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. FAQ ACCORDION ── */}
      <section style={{ maxWidth: '880px', margin: '0 auto clamp(60px, 8vw, 100px) auto', padding: '0 clamp(16px, 3.5vw, 48px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>QUESTIONS</span>
          <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px 22px', cursor: 'pointer', width: '100%', boxSizing: 'border-box', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#FFF', margin: 0 }}>{faq.question}</h4>
                <ChevronRight size={18} color="#60A5FA" style={{ transform: openFaq === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
              </div>
              {openFaq === idx && (
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, marginTop: '12px', marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
