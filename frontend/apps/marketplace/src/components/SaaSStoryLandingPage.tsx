import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, Download, QrCode,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Star, Play, ChevronRight,
  Compass, Crown, Clock, HelpCircle, BarChart3, Layers, Bot, Globe, Check, ArrowUpRight, Ticket, Rss, Search
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
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
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
    <div className="tixup-inspired-marketplace" style={{ color: '#F9FAFB', overflowX: 'hidden' }}>
      
      {/* ── 1. HERO WITH INTEGRATED SEARCH (Mobile Optimized) ── */}
      <section className="hero-landing-section">
        
        {/* Background Ambient Radial Glow */}
        <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '920px', height: '460px', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)', filter: 'blur(90px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 2 }}>
          
          {/* Release Tag Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '99px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', color: '#60A5FA', fontSize: '11.5px', fontWeight: 800, marginBottom: '20px', maxWidth: '100%' }}>
            <Sparkles size={14} color="#60A5FA" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>GETVNT OS v2.0 • Discover &amp; Host World-Class Events</span>
          </div>

          {/* Large Hero Title */}
          <h1 style={{ fontSize: 'clamp(32px, 7vw, 68px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            Discover &amp; Experience <br />
            <span style={{ color: '#60A5FA' }}>World-Class Events.</span>
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: 'clamp(15px, 2.2vw, 19px)', color: '#9CA3AF', lineHeight: 1.55, maxWidth: '680px', margin: '0 auto 28px auto', fontWeight: 500 }}>
            Book verified tickets for concerts, Afrobeats festivals, and tech summits. Powered by instant <strong style={{ color: '#E2E8F0' }}>&lt;500ms gate scanning</strong>.
          </p>

          {/* Responsive Hero Search Bar */}
          <div className="hero-search-container">
            
            {/* Input 1: Search Query */}
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

            {/* Input 2: City Selector */}
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

            {/* Search Submit CTA Button */}
            <button
              onClick={() => {}}
              className="btn-cta hero-search-btn"
            >
              <Search size={16} /> Discover Events
            </button>
          </div>

        </div>
      </section>

      {/* ── 2. FEATURED EVENTS SHOWCASE (Mobile Responsive Grid) ── */}
      <section className="landing-section-wrap">
        <div className="featured-event-responsive-card">
          
          <div style={{ borderRadius: '20px', overflow: 'hidden', minHeight: '220px', position: 'relative' }}>
            <LazyImage src={featuredEvent.banner_url} alt={featuredEvent.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
            <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(245,158,11,0.95)', color: '#0B0F19', fontSize: '10.5px', fontWeight: 900, padding: '4px 10px', borderRadius: '99px' }}>
              <Crown size={12} style={{ display: 'inline', marginRight: '4px' }} /> FEATURED DROP
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ color: '#F87171', fontSize: '11.5px', fontWeight: 800, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 10px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={12} /> Live Flash Drop • 88% Sold Out
              </span>
              <h2 style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 900, color: '#FFF', marginTop: '10px', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
                {featuredEvent.title}
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '13.5px', lineHeight: 1.55, marginBottom: '20px' }}>
                {featuredEvent.venue_name}, {featuredEvent.city} • Experience live Afrobeats stars, VIP champagne lounge seating, and instant encrypted ticket delivery.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#9CA3AF', fontWeight: 700 }}>TICKET STARTS AT</span>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#F59E0B' }}>₦35,000</div>
              </div>
              <button
                onClick={() => onSelectEvent(featuredEvent)}
                className="btn-cta"
                style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#07090F', fontWeight: 900, fontSize: '13.5px', border: 'none', cursor: 'pointer' }}
              >
                <Zap size={15} /> Get VIP Ticket
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. GETVNT PULSE BLOG (1 Row Auto-Scrolling Carousel with Mobile Touch Snap) ── */}
      <section className="landing-section-wrap">
        <HomeNewsCarousel
          onOpenArticle={(slug) => onNavigateToBlog(slug)}
          onOpenBlogHub={() => onNavigateToBlog()}
        />
      </section>

      {/* ── 4. BROWSE CATEGORIES ── */}
      <section className="landing-section-wrap" style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-heading)' }}>Browse Categories</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '9px 18px',
                borderRadius: '99px',
                border: '1px solid',
                borderColor: selectedCategory === cat.id ? '#2563EB' : 'rgba(255,255,255,0.1)',
                background: selectedCategory === cat.id ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === cat.id ? '#60A5FA' : '#9CA3AF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 5. TRENDING EVENTS GRID ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>CURATED SELECTION</span>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 900, color: '#FFF', margin: '4px 0 0 0', fontFamily: 'var(--font-heading)' }}>
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
              }}
              className="carousel-card"
            >
              <div className="carousel-banner-wrap" style={{ height: '180px' }}>
                <LazyImage src={ev.banner_url} alt={ev.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
                <span className="badge-date">
                  {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(8px)', color: '#60A5FA', fontSize: '10.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(37,99,235,0.3)' }}>
                  {ev.category || 'General'}
                </span>
              </div>

              <div className="carousel-body" style={{ padding: '16px' }}>
                <div>
                  <h3 className="carousel-title" style={{ fontSize: '16px' }}>{ev.title}</h3>
                  <div className="carousel-venue" style={{ fontSize: '12.5px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {ev.venue_name}, {ev.city}
                  </div>
                </div>

                <div className="carousel-footer" style={{ marginTop: '12px', paddingTop: '12px' }}>
                  <span className="price-text" style={{ fontSize: '16px' }}>
                    {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : 'FREE'}
                  </span>
                  <button className="btn-buy" style={{ padding: '7px 14px', fontSize: '12.5px' }} onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}>
                    Get Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. WHY GETVNT ── */}
      <section className="landing-section-wrap">
        <div className="responsive-split-grid">
          <div>
            <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>WHY GETVNT</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: '#FFF', marginTop: '6px', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
              Built for Scale &amp; Zero Ticket Fraud.
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
              GETVNT combines high-speed mobile scanning, real-time analytics, and automated multi-currency payouts into one seamless platform.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ color: '#34D399', fontSize: '13.5px', fontWeight: 700 }}>✓ Sub-500ms encrypted QR gate check-in</div>
              <div style={{ color: '#34D399', fontSize: '13.5px', fontWeight: 700 }}>✓ Direct bank settlement via Paystack &amp; Stripe</div>
              <div style={{ color: '#34D399', fontSize: '13.5px', fontWeight: 700 }}>✓ AI Marketing Assistant &amp; Price Optimizer</div>
            </div>
          </div>
          <div style={{ background: '#0D1120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
            <Shield size={56} color="#60A5FA" style={{ margin: '0 auto 14px auto' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF' }}>100% Anti-Counterfeiting RSA Security</h3>
            <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '8px', lineHeight: 1.5 }}>Every ticket is assigned a dynamic 4096-bit cryptographic signature that prevents screenshots and duplicate pass entries.</p>
          </div>
        </div>
      </section>

      {/* ── 7. ORGANIZER OS ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ color: '#F59E0B', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>ORGANIZER OS</span>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
            Complete Platform Capability Suite
          </h2>
        </div>
        <div className="responsive-organizer-grid">
          {[
            { title: 'Ticket Designer Desk', desc: 'Design custom PDF & mobile passes with custom QR codes and VIP badges.', icon: <Layers size={20} color="#FBBF24" /> },
            { title: 'Audience CRM & Loyalty', desc: 'Track repeat buyers, send automated WhatsApp broadcasts, and issue VIP perks.', icon: <Users size={20} color="#F472B6" /> },
            { title: 'AI Sponsorship Decks', desc: 'Generate multi-page sponsorship pitch decks tailored for corporate partners.', icon: <BarChart3 size={20} color="#C084FC" /> },
            { title: 'Branded QR Studio', desc: 'Create high-contrast custom branded QR codes with embedded logos.', icon: <QrCode size={20} color="#38BDF8" /> },
          ].map((card, idx) => (
            <div key={idx} style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>{card.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. AI EVENT MANAGEMENT FEATURES ── */}
      <section className="landing-section-wrap">
        <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(13,17,32,0.9) 100%)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '24px', padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#C084FC', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>🤖 AI CO-PILOT ENGINE</span>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, color: '#FFF', marginTop: '6px', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
              Autonomous Marketing &amp; Price Optimization
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.55, marginBottom: '20px' }}>
              Our AI engine continuously analyzes attendee buying behavior and recommends ticket pricing adjustments to maximize revenue without reducing conversion velocity.
            </p>
            <button className="btn-cta" style={{ background: '#7C3AED', color: '#FFF', padding: '11px 22px', borderRadius: '12px', fontWeight: 800, fontSize: '13.5px', border: 'none', cursor: 'pointer' }}>
              Explore AI Suite
            </button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ color: '#C084FC', fontSize: '11.5px', fontWeight: 800, marginBottom: '6px' }}>AI PRICE RECOMMENDATION</div>
            <p style={{ color: '#E2E8F0', fontSize: '13.5px', lineHeight: 1.5, margin: 0 }}>
              "Ticket velocity is 28% above average. Increasing Tier 2 passes by ₦5,000 will yield an estimated +₦3.4M in GMV."
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. LIVE DASHBOARD PREVIEW ── */}
      <section className="landing-section-wrap" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ color: '#06B6D4', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase' }}>EXECUTIVE CONTROL</span>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
            Real-Time Revenue Radar
          </h2>
        </div>
        <div style={{ background: '#0D1120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.8)', padding: '20px', textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '10.5px', color: '#9CA3AF', fontWeight: 800 }}>LIVE TICKET REVENUE</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFF', margin: '3px 0' }}>₦48,650,000</div>
              <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 700 }}>↑ +42% vs last week</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '10.5px', color: '#9CA3AF', fontWeight: 800 }}>ATTENDEE CHECK-INS</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#60A5FA', margin: '3px 0' }}>14,280 / 15,000</div>
              <div style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 700 }}>95% Gate Occupancy</div>
            </div>
          </div>
          <div style={{ height: '140px', background: 'linear-gradient(180deg, rgba(37,99,235,0.15) 0%, transparent 100%)', borderRadius: '14px', border: '1px solid rgba(37,99,235,0.3)', padding: '12px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {[40, 65, 55, 80, 95, 70, 85, 100, 90, 110, 125, 140].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}px`, background: 'linear-gradient(180deg, #60A5FA 0%, #2563EB 100%)', borderRadius: '3px 3px 0 0' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. MOBILE SCANNER APP ── */}
      <section className="landing-section-wrap">
        <AndroidAppPromotion />
      </section>

      {/* ── 11. TESTIMONIALS ── */}
      <section className="landing-section-wrap">
        <div style={{ background: 'linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(13,17,32,0.9) 100%)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '24px', padding: '28px', textAlign: 'center' }}>
          <span style={{ color: '#C084FC', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase' }}>ORGANIZER STORIES</span>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, color: '#FFF', marginTop: '4px', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
            Trusted by Festival Directors &amp; Promoters
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', textAlign: 'left' }}>
            {[
              { quote: '"GETVNT transformed how we run Afrobeats festivals in Lagos. Gate scan times dropped below 400ms."', author: 'Tunde Bakare', role: 'AfroNation Lagos' },
              { quote: '"The AI assistant generated our entire sponsorship deck. We sold out 15,000 passes in less than 4 days."', author: 'Amina Osei', role: 'Nairobi Tech Expo' },
            ].map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                <p style={{ color: '#E2E8F0', fontSize: '13.5px', lineHeight: 1.55, fontStyle: 'italic', marginBottom: '14px' }}>{t.quote}</p>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>{t.author}</div>
                <div style={{ fontSize: '11.5px', color: '#60A5FA', fontWeight: 600 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. FAQ ACCORDION ── */}
      <section style={{ maxWidth: '840px', margin: '0 auto 80px auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase' }}>QUESTIONS</span>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px 20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFF', margin: 0 }}>{faq.question}</h4>
                <ChevronRight size={17} color="#60A5FA" style={{ transform: openFaq === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
              </div>
              {openFaq === idx && (
                <p style={{ color: '#9CA3AF', fontSize: '13.5px', lineHeight: 1.55, marginTop: '10px', marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
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
