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
    title: 'PARKFLIX EXPERIENCE',
    venue_name: 'AFROGRAMS, ITA-EKO ABEOKUTA',
    city: 'Abeokuta',
    country: 'Nigeria',
    start_date: '2026-09-30T19:00:00Z',
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
    { name: 'AfroNation Global Events', growth: '↑ 148.50%', avatar: '/afrobeat_festival_banner.png', isFeatured: false },
    { name: 'Bankole & Partners Live', growth: '↑ 84.20%', avatar: '', isFeatured: false },
    { name: 'Samora & Co. Studios', growth: '↑ 633.46%', avatar: '/tech_summit_banner.png', isFeatured: true },
    { name: 'De Brilliance Luxury Events', growth: '↑ 52.10%', avatar: '', isFeatured: false },
    { name: 'Opemipo Live Entertainment', growth: '↑ 41.80%', avatar: '', isFeatured: false },
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

          {/* Integrated Search Bar */}
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

      {/* ── 2. FEATURED EVENT (IMAGE 3 SCREENSHOT MATCH) ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Crown size={24} color="#F59E0B" />
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: 900, color: '#FFF', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Featured Event
          </h2>
        </div>

        <div style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
          
          <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '1/1', maxHeight: '340px', width: '100%' }}>
            <LazyImage src={featuredEvent.banner_url} alt={featuredEvent.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900, color: '#FF9900', textTransform: 'uppercase', margin: '0 0 16px 0', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}>
              {featuredEvent.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9CA3AF', fontSize: '13.5px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#9CA3AF" /> {featuredEvent.venue_name}
              </span>
              <span style={{ color: '#4B5563' }}>|</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="#9CA3AF" /> Wed • Sep 30, 2026 • 07:00 pm GMT+1
              </span>
            </div>

            <p style={{ color: '#9CA3AF', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '28px' }}>
              PARKFLIX is an outdoor cinema experience, it isn't just another event. It's an experience where people come together to relax, connect, and enjoy a carefully curated night under the stars.
            </p>

            <div>
              <button
                onClick={() => onSelectEvent(featuredEvent)}
                className="tixup-btn-primary"
                style={{ padding: '14px 32px', borderRadius: '12px', background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: '14.5px', border: 'none', cursor: 'pointer' }}
              >
                Get Ticket
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. EXPLORE CATEGORIES (HORIZONTAL PILLS) ── */}
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

      {/* ── 4. UPCOMING EVENTS (2-COL HORIZONTAL CARDS) ── */}
      <section className="landing-section-wrap">
        <div style={{ marginBottom: '24px' }}>
          <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>CALENDAR SCHEDULE</span>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
            Upcoming Events
          </h2>
        </div>

        <div className="tixup-grid-2col">
          {filteredEvents.slice(0, 4).map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              className="tixup-event-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '12px', background: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '10px', color: '#60A5FA', fontWeight: 900, textTransform: 'uppercase' }}>
                    {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span style={{ fontSize: '20px', color: '#FFF', fontWeight: 900, lineHeight: 1 }}>
                    {new Date(ev.start_date).getDate()}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#FFF', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.title}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    20:00 • {ev.venue_name}, {ev.city}
                  </div>
                </div>
              </div>

              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ChevronRight size={16} color="#60A5FA" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. LATEST EVENTS (4-COL GRID) ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>EXPLORE ALL</span>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', margin: '4px 0 0 0', fontFamily: 'var(--font-heading)' }}>
              Latest Events
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

      {/* ── 6. EVENTS YOU WILL LIKE (IMAGE 1 SCREENSHOT MATCH) ── */}
      <section className="landing-section-wrap">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Events You Will Like
          </h2>
        </div>

        <div className="tixup-grid-2col">
          {[
            { id: 'rec-1', title: 'Sneakers Fest: The Culture Experience', date: 'SEP 12', time: '20:00', venue: 'Elysium Oasis, Car Park, Onikoko Road, Adjacent to Ogun Fire Service Station, Abeokuta' },
            { id: 'rec-2', title: 'Omidan Ogun 2026', date: 'OCT 11', time: '10:00', venue: 'Olusegun Obasanjo Presidential Library, Abeokuta' },
            { id: 'rec-3', title: 'Jamisdepe Comedy Hangout (TUNGBAFIESTA) & HEADSET AFTER PARTY', date: 'SEP 20', time: '15:00', venue: 'The Mayfair Executive, Ibara Housing Estate, Abeokuta Ogun State.' },
            { id: 'rec-4', title: 'Mask Night party Crazy Games & After Party', date: 'AUG 30', time: '22:00', venue: 'Ajah Lekki Phase one Admiralty' },
          ].map((ev, idx) => (
            <div
              key={idx}
              onClick={() => onSelectEvent(events[0])}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              className="tixup-event-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                {/* Date Block */}
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '10.5px', color: '#60A5FA', fontWeight: 900, textTransform: 'uppercase' }}>
                    {ev.date.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '20px', color: '#FFF', fontWeight: 900, lineHeight: 1 }}>
                    {ev.date.split(' ')[1]}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: idx === 3 ? '#FF9900' : '#FFF', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ev.time} &nbsp; {ev.venue}
                  </div>
                </div>
              </div>

              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ChevronRight size={16} color="#60A5FA" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. TOP RATED ORGANIZERS (IMAGE 2 SCREENSHOT MATCH) ── */}
      <section className="landing-section-wrap">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', margin: 0, fontFamily: 'var(--font-heading)' }}>
            Top Rated Organizers
          </h2>
        </div>

        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          {/* Table Column Headers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px 12px 24px', fontSize: '11px', color: '#6B7280', fontWeight: 800, letterSpacing: '1px' }}>
            <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
              <span style={{ width: '20px', textAlign: 'center' }}>#</span>
              <span>NAME</span>
            </div>
            <span>7D %</span>
          </div>

          {/* Leaderboard Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topOrganizers.map((org, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <div style={{ width: '24px', textAlign: 'center', fontSize: '16px', fontWeight: 900, color: '#FFF', display: 'flex', justifyContent: 'center' }}>
                    {idx === 0 ? <Crown size={20} color="#F59E0B" /> : idx + 1}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#7C3AED,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#FFF' }}>
                      {org.avatar ? <LazyImage src={org.avatar} alt={org.name} objectFit="cover" style={{ width: '100%', height: '100%' }} /> : org.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: org.isFeatured ? '#FF9900' : '#FFF' }}>
                      {org.name}
                    </span>
                  </div>
                </div>

                {/* 7D % Sparkline Curve */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
                    <path d={idx % 2 === 0 ? "M0 18 Q 35 22, 60 12 T 85 4 T 100 8" : "M0 6 Q 30 20, 60 16 T 85 22 T 100 18"} stroke="#10B981" strokeWidth="2" fill="none" />
                  </svg>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#10B981' }}>{org.growth}</span>
                </div>
              </div>
            ))}
          </div>
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
