import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, Download, QrCode,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Star, Play, ChevronRight,
  Compass, Crown, Clock, HelpCircle, BarChart3, Layers, Bot, Globe, Check, ArrowUpRight, Ticket, Rss, Search, Award, Heart
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
    { name: 'All Cities', flag: '🌍' },
    { name: 'Lagos', flag: '🇳🇬' },
    { name: 'Nairobi', flag: '🇰🇪' },
    { name: 'Cape Town', flag: '🇿🇦' },
    { name: 'Accra', flag: '🇬🇭' },
    { name: 'London', flag: '🇬🇧' },
  ];

  const categoriesList = [
    { id: 'All', label: '⚡ All Events' },
    { id: 'Music', label: '🎵 Music' },
    { id: 'Tech', label: '💻 Tech' },
    { id: 'Business', label: '💼 Business' },
    { id: 'Comedy', label: '🎭 Comedy' },
    { id: 'Networking', label: '🤝 Networking' },
    { id: 'Education', label: '📚 Education' },
    { id: 'Fashion', label: '👗 Fashion' },
    { id: 'Food', label: '🍷 Food & Drinks' },
    { id: 'Sports', label: '⚽ Sports' },
    { id: 'Lifestyle', label: '✨ Lifestyle' },
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesCity = selectedCity === 'All' || selectedCity === 'All Cities' || ev.city?.toLowerCase() === selectedCity.toLowerCase();
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

  const topOrganizers = [
    { name: 'AfroNation Global', eventsHosted: '48 Events', rating: '4.95 ★', verified: true, avatar: '/afrobeat_festival_banner.png' },
    { name: 'Nairobi Tech Summit', eventsHosted: '32 Events', rating: '4.98 ★', verified: true, avatar: '/tech_summit_banner.png' },
    { name: 'Lagos Fashion Week', eventsHosted: '26 Events', rating: '4.92 ★', verified: true, avatar: '/fashion_week_banner.png' },
    { name: 'Cape Town Jazz Fest', eventsHosted: '19 Events', rating: '4.96 ★', verified: true, avatar: '/jazz_fest_banner.png' },
  ];

  return (
    <div className="tixup-inspired-marketplace" style={{ color: '#F9FAFB', overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      
      {/* ── 1. HERO SECTION ── */}
      <section className="tixup-hero-section">
        
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: 'min(100%, 1200px)', height: '480px', background: 'radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(124,58,237,0.08) 50%, transparent 75%)', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <div className="landing-section-wrap" style={{ position: 'relative', zIndex: 2, marginBottom: 0 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '99px', background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(37,99,235,0.35)', color: '#60A5FA', fontSize: '12px', fontWeight: 800, marginBottom: '24px', maxWidth: '100%' }}>
            <Sparkles size={14} color="#60A5FA" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>GETVNT OS v2.0 • Premium Global Ticketing Infrastructure</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
            Discover &amp; Experience <br />
            <span style={{ color: '#60A5FA', background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>World-Class Live Events.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: '#9CA3AF', lineHeight: 1.55, maxWidth: '720px', margin: '0 auto 36px auto', fontWeight: 500 }}>
            Book verified passes for concerts, festivals, and summits. Powered by instant <strong style={{ color: '#E2E8F0' }}>&lt;500ms encrypted QR check-in</strong>.
          </p>

          {/* Integrated Fluid Search Bar */}
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
                  <option key={c.name} value={c.name === 'All Cities' ? 'All' : c.name} style={{ background: '#0D1120', color: '#FFF' }}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={() => {}} className="tixup-btn-primary hero-search-btn">
              <Search size={16} /> Discover Events
            </button>
          </div>

        </div>
      </section>

      {/* ── 2. FEATURED EVENT SHOWCASE (TIXUP SPEC) ── */}
      <section className="landing-section-wrap">
        <div className="featured-event-responsive-card" style={{ overflow: 'hidden', boxSizing: 'border-box' }}>
          
          <div style={{ borderRadius: '20px', overflow: 'hidden', minHeight: '260px', position: 'relative' }}>
            <LazyImage src={featuredEvent.banner_url} alt={featuredEvent.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
            <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(245,158,11,0.95)', color: '#0B0F19', fontSize: '11px', fontWeight: 900, padding: '6px 14px', borderRadius: '99px', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
              <Crown size={13} style={{ display: 'inline', marginRight: '4px' }} /> FEATURED DROP
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
            <div>
              <span style={{ color: '#F87171', fontSize: '12px', fontWeight: 800, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 12px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} /> Live Flash Drop • 88% Sold Out
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', marginTop: '14px', marginBottom: '14px', fontFamily: 'var(--font-heading)', lineHeight: 1.15 }}>
                {featuredEvent.title}
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                {featuredEvent.venue_name}, {featuredEvent.city} • Experience live Afrobeats stars, VIP champagne lounge seating, and instant encrypted ticket delivery.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.5px' }}>TICKET STARTS AT</span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#F59E0B' }}>₦35,000</div>
              </div>
              <button
                onClick={() => onSelectEvent(featuredEvent)}
                className="tixup-btn-primary"
                style={{ padding: '14px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#07090F', fontWeight: 900, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(245,158,11,0.35)' }}
              >
                <Zap size={16} /> Get VIP Ticket
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. EXPLORE CATEGORIES (HORIZONTAL SCROLL PILLS) ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#FFF', fontFamily: 'var(--font-heading)' }}>Explore Categories</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '12px 22px',
                borderRadius: '99px',
                border: '1px solid',
                borderColor: selectedCategory === cat.id ? '#2563EB' : 'rgba(255,255,255,0.12)',
                background: selectedCategory === cat.id ? 'rgba(37,99,235,0.22)' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === cat.id ? '#60A5FA' : '#9CA3AF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. UPCOMING EVENTS (2-COLUMN HORIZONTAL CARDS) ── */}
      <section className="landing-section-wrap">
        <div style={{ marginBottom: '28px' }}>
          <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>CALENDAR SCHEDULE</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Upcoming Events This Month
          </h2>
        </div>

        <div className="tixup-grid-2col">
          {filteredEvents.slice(0, 4).map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              style={{
                background: 'rgba(13, 17, 32, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              className="tixup-event-card"
            >
              {/* Date Block */}
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 800, textTransform: 'uppercase' }}>
                  {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span style={{ fontSize: '22px', color: '#FFF', fontWeight: 900, lineHeight: 1 }}>
                  {new Date(ev.start_date).getDate()}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, marginBottom: '4px' }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {new Date(ev.start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {ev.city}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ev.title}
                </h3>
                <div style={{ fontSize: '13px', color: '#60A5FA', fontWeight: 700 }}>
                  {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : 'FREE'}
                </div>
              </div>

              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ArrowRight size={18} color="#60A5FA" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. LATEST EVENTS (4-COLUMN GRID, 16:9 IMAGES) ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>EXPLORE ALL</span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', margin: '6px 0 0 0', fontFamily: 'var(--font-heading)' }}>
              Latest Verified Events
            </h2>
          </div>
        </div>

        <div className="tixup-grid-4col">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className="tixup-event-card"
            >
              <div className="tixup-card-image-wrap">
                <LazyImage src={ev.banner_url} alt={ev.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(8px)', color: '#60A5FA', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.3)' }}>
                  {ev.category || 'General'}
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', marginBottom: '8px', lineHeight: 1.3 }}>{ev.title}</h3>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '14px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {ev.venue_name}, {ev.city}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFF' }}>
                    {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : 'FREE'}
                  </span>
                  <button className="tixup-btn-primary" style={{ minHeight: '40px', padding: '8px 16px', fontSize: '13px' }} onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}>
                    Get Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. EVENTS YOU WILL LIKE (3-COLUMN RECOMMENDATIONS) ── */}
      <section className="landing-section-wrap">
        <div style={{ marginBottom: '32px' }}>
          <span style={{ color: '#C084FC', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>RECOMMENDED FOR YOU</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Events You Will Like
          </h2>
        </div>

        <div className="tixup-grid-3col">
          {filteredEvents.slice(0, 3).map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className="tixup-event-card"
            >
              <div className="tixup-card-image-wrap">
                <LazyImage src={ev.banner_url} alt={ev.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(239,68,68,0.9)', color: '#FFF', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={12} fill="#FFF" /> 98% Match
                </span>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>{ev.title}</h3>
                  <div style={{ fontSize: '13.5px', color: '#9CA3AF', marginBottom: '16px' }}>
                    {ev.venue_name}, {ev.city}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#60A5FA' }}>
                    {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : 'FREE'}
                  </span>
                  <button className="tixup-btn-primary" style={{ minHeight: '44px', padding: '10px 20px', fontSize: '13.5px' }} onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}>
                    Book Pass
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. TOP RATED ORGANIZERS ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#F59E0B', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>VERIFIED DIRECTORS</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Top Rated Event Organizers
          </h2>
        </div>

        <div className="tixup-grid-4col">
          {topOrganizers.map((org, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(13, 17, 32, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '24px',
                textAlign: 'center',
                transition: 'all 0.25s ease'
              }}
              className="tixup-event-card"
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px auto', border: '2px solid #2563EB' }}>
                <LazyImage src={org.avatar} alt={org.name} objectFit="cover" style={{ width: '100%', height: '100%' }} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {org.name} <Award size={15} color="#60A5FA" />
              </h3>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '14px' }}>{org.eventsHosted}</div>
              <div style={{ fontSize: '13.5px', color: '#F59E0B', fontWeight: 800 }}>{org.rating}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. DOWNLOAD GETVNT APP ── */}
      <section className="landing-section-wrap">
        <AndroidAppPromotion />
      </section>

      {/* ── 9. BLOG / PULSE MEDIA ── */}
      <section className="landing-section-wrap">
        <HomeNewsCarousel
          onOpenArticle={(slug) => onNavigateToBlog(slug)}
          onOpenBlogHub={() => onNavigateToBlog()}
        />
      </section>

      {/* ── 10. FAQ ACCORDION ── */}
      <section style={{ maxWidth: '880px', margin: '0 auto clamp(60px, 8vw, 120px) auto', padding: '0 clamp(16px, 3vw, 80px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>QUESTIONS</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px 24px', cursor: 'pointer', width: '100%', boxSizing: 'border-box', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', margin: 0 }}>{faq.question}</h4>
                <ChevronRight size={18} color="#60A5FA" style={{ transform: openFaq === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
              </div>
              {openFaq === idx && (
                <p style={{ color: '#9CA3AF', fontSize: '14.5px', lineHeight: 1.6, marginTop: '14px', marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
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
