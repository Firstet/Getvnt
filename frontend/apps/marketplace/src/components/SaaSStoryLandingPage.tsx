import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, Download, QrCode,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Star, Play, ChevronRight,
  Crown, Clock, HelpCircle, Rss, Search, Heart, Share2, Music, Briefcase, Mic, GraduationCap, Laptop, Trophy, Utensils, Shirt, Award
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

  const categoryCards = [
    { id: 'Music', label: 'Music & Concerts', icon: <Music size={24} color="#60A5FA" />, count: '142 Events', bgImage: '/afrobeat_festival_banner.png' },
    { id: 'Business', label: 'Business & Summits', icon: <Briefcase size={24} color="#34D399" />, count: '89 Events', bgImage: '/luxury_vip_lounge.png' },
    { id: 'Tech', label: 'Tech & AI Conferences', icon: <Laptop size={24} color="#A78BFA" />, count: '116 Events', bgImage: '/tech_summit_banner.png' },
    { id: 'Comedy', label: 'Comedy Shows', icon: <Mic size={24} color="#FBBF24" />, count: '45 Events', bgImage: '/concert_crowd_bg.png' },
    { id: 'Education', label: 'Education & Workshops', icon: <GraduationCap size={24} color="#F472B6" />, count: '62 Events', bgImage: '/tech_summit_banner.png' },
    { id: 'Sports', label: 'Sports & Esports', icon: <Trophy size={24} color="#60A5FA" />, count: '38 Events', bgImage: '/concert_crowd_bg.png' },
    { id: 'Food', label: 'Food & Wine Festivals', icon: <Utensils size={24} color="#34D399" />, count: '51 Events', bgImage: '/luxury_vip_lounge.png' },
    { id: 'Fashion', label: 'Fashion & Arts', icon: <Shirt size={24} color="#FBBF24" />, count: '29 Events', bgImage: '/afrobeat_festival_banner.png' },
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
    { name: 'AfroNation Global Events', followers: '142k Followers • ₦480M GMV', growth: '↑ 148.50%', avatar: '/afrobeat_festival_banner.png', rating: '4.9 ★', isFeatured: false },
    { name: 'Bankole & Partners Live', followers: '98k Followers • ₦320M GMV', growth: '↑ 84.20%', avatar: '', rating: '4.8 ★', isFeatured: false },
    { name: 'Samora & Co. Studios', followers: '215k Followers • ₦890M GMV', growth: '↑ 633.46%', avatar: '/tech_summit_banner.png', rating: '5.0 ★', isFeatured: true },
    { name: 'De Brilliance Luxury Events', followers: '64k Followers • ₦190M GMV', growth: '↑ 52.10%', avatar: '', rating: '4.7 ★', isFeatured: false },
    { name: 'Opemipo Live Entertainment', followers: '51k Followers • ₦140M GMV', growth: '↑ 41.80%', avatar: '', rating: '4.7 ★', isFeatured: false },
  ];

  return (
    <div className="tixup-inspired-marketplace" style={{ color: '#F9FAFB', overflowX: 'hidden', width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }}>
      
      {/* ── 1. HERO SECTION (CINEMATIC EDGE-TO-EDGE BACKDROP) ── */}
      <section
        className="tixup-hero-section"
        style={{
          position: 'relative',
          backgroundImage: 'linear-gradient(180deg, rgba(6,9,19,0.78) 0%, rgba(6,9,19,0.92) 85%, #060913 100%), url(/concert_crowd_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: 'min(100%, 1400px)', height: '540px', background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(124,58,237,0.12) 45%, transparent 75%)', filter: 'blur(110px)', pointerEvents: 'none' }} />

        <div className="landing-section-wrap" style={{ position: 'relative', zIndex: 2, marginBottom: 0 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '99px', background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.4)', color: '#60A5FA', fontSize: '12px', fontWeight: 800, marginBottom: '24px', maxWidth: '100%', backdropFilter: 'blur(10px)' }}>
            <Sparkles size={14} color="#60A5FA" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>GETVNT OS v2.0 • Premium Global Ticketing Infrastructure</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '20px', fontFamily: 'var(--font-heading)', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            Discover &amp; Experience <br />
            <span style={{ color: '#60A5FA', background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>World-Class Live Events.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: '#D1D5DB', lineHeight: 1.55, maxWidth: '740px', margin: '0 auto 36px auto', fontWeight: 500, textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>
            Book verified passes for concerts, festivals, and summits. Powered by instant <strong style={{ color: '#FFF' }}>&lt;500ms encrypted QR check-in</strong>.
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

      {/* ── 2. FEATURED EVENT DROP (NETFLIX / APPLE TV BLURRED BACKDROP STYLE) ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Crown size={26} color="#F59E0B" />
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, color: '#FFF', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Featured Event Drop
            </h2>
          </div>
          <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 800 }}>
            🔥 88% Sold Out
          </span>
        </div>

        <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,153,0,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Netflix/Apple TV Blurred Hero Banner Backdrop Layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${featuredEvent.banner_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(45px) brightness(0.22)',
              transform: 'scale(1.25)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, background: 'linear-gradient(135deg, rgba(13,17,32,0.85) 0%, rgba(7,9,15,0.92) 100%)', padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
            
            <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '1/1', maxHeight: '360px', width: '100%', position: 'relative', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
              <LazyImage src={featuredEvent.banner_url} alt={featuredEvent.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(10px)', color: '#FF9900', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '99px', border: '1px solid rgba(255,153,0,0.4)' }}>
                ⭐ FEATURED PASS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#FF9900', textTransform: 'uppercase', margin: '0 0 16px 0', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                {featuredEvent.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#D1D5DB', fontSize: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="#60A5FA" /> {featuredEvent.venue_name}
                </span>
                <span style={{ color: '#4B5563' }}>|</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="#34D399" /> Sep 30, 2026 • 07:00 PM GMT+1
                </span>
              </div>

              <p style={{ color: '#9CA3AF', fontSize: '15.5px', lineHeight: 1.6, marginBottom: '32px' }}>
                PARKFLIX is an outdoor cinema experience, it isn't just another event. It's an experience where people come together to relax, connect, and enjoy a carefully curated night under the stars.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onSelectEvent(featuredEvent)}
                  className="tixup-btn-primary"
                  style={{ padding: '0 36px', height: '54px', fontSize: '16px' }}
                >
                  Get Ticket • ₦35,000
                </button>
                <span style={{ color: '#9CA3AF', fontSize: '13.5px', fontWeight: 600 }}>
                  ⚡ Instant Digital Pass via Email &amp; SMS
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 3. EXPLORE CATEGORIES (DISTINCT IMAGE-BACKED CARDS WITH HOVER ZOOM) ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>BROWSE BY INTEREST</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Explore Categories
          </h2>
        </div>

        <div className="category-icon-grid">
          {categoryCards.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: selectedCategory === cat.id ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.12)',
                minHeight: '160px',
                cursor: 'pointer',
                boxSizing: 'border-box',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease'
              }}
              className="category-icon-card-wrap"
            >
              {/* Category Card Background Image */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${cat.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="category-card-bg-img"
              />

              {/* Dark Overlay for 100% Contrast */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: selectedCategory === cat.id
                    ? 'linear-gradient(135deg, rgba(37,99,235,0.75) 0%, rgba(13,17,32,0.92) 100%)'
                    : 'linear-gradient(135deg, rgba(6,9,19,0.72) 0%, rgba(13,17,32,0.9) 100%)',
                  transition: 'background 0.3s ease'
                }}
              />

              {/* Card Content */}
              <div style={{ position: 'relative', zIndex: 2, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', height: '100%', textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(7,9,15,0.65)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', margin: '0 0 4px 0', fontFamily: 'var(--font-heading)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{cat.label}</h3>
                  <span style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 700 }}>{cat.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 4. UPCOMING EVENTS (HORIZONTAL CARDS) ── */}
      <section className="landing-section-wrap">
        <div style={{ marginBottom: '28px' }}>
          <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>SCHEDULE</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
            Upcoming Events
          </h2>
        </div>

        <div className="tixup-grid-2col">
          {filteredEvents.slice(0, 4).map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              style={{
                background: 'rgba(13,17,32,0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              className="tixup-event-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, minWidth: 0 }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 900, textTransform: 'uppercase' }}>
                    {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span style={{ fontSize: '22px', color: '#FFF', fontWeight: 900, lineHeight: 1 }}>
                    {new Date(ev.start_date).getDate()}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#FFF', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-heading)' }}>
                    {ev.title}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    20:00 • {ev.venue_name}, {ev.city}
                  </div>
                </div>
              </div>

              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ChevronRight size={18} color="#60A5FA" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 5. LATEST VERIFIED EVENTS (RICHER CARDS) ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>DISCOVER ALL</span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', margin: '4px 0 0 0', fontFamily: 'var(--font-heading)' }}>
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
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', marginBottom: '8px', lineHeight: 1.3, fontFamily: 'var(--font-heading)' }}>{ev.title}</h3>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '14px' }}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {ev.venue_name}, {ev.city}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFF' }}>
                    {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : 'FREE'}
                  </span>
                  <button className="tixup-btn-primary" style={{ minHeight: '44px', padding: '0 20px', fontSize: '13.5px' }} onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}>
                    Get Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 6. EVENTS YOU WILL LIKE (AI RECOMMENDATIONS) ── */}
      <section className="landing-section-wrap">
        <div style={{ marginBottom: '28px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>AI PERSONALIZED MATCH</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', margin: '4px 0 0 0', fontFamily: 'var(--font-heading)' }}>
            Events You Will Like
          </h2>
        </div>

        <div className="tixup-grid-2col">
          {[
            { id: 'rec-1', tag: '⚡ AI MATCH: Because you liked Afrobeats', title: 'Sneakers Fest: The Culture Experience', date: 'SEP 12', time: '20:00', venue: 'Elysium Oasis, Car Park, Onikoko Road, Abeokuta' },
            { id: 'rec-2', tag: '🔥 Trending in Lagos', title: 'Omidan Ogun 2026', date: 'OCT 11', time: '10:00', venue: 'Olusegun Obasanjo Presidential Library, Abeokuta' },
            { id: 'rec-3', tag: '🎭 Popular Comedy Special', title: 'Jamisdepe Comedy Hangout (TUNGBAFIESTA) & AFTER PARTY', date: 'SEP 20', time: '15:00', venue: 'The Mayfair Executive, Ibara Housing Estate, Abeokuta' },
            { id: 'rec-4', tag: '💼 Recommended for Founders', title: 'Mask Night party Crazy Games & After Party', date: 'AUG 30', time: '22:00', venue: 'Ajah Lekki Phase one Admiralty' },
          ].map((ev, idx) => (
            <div
              key={idx}
              onClick={() => onSelectEvent(events[0])}
              style={{
                background: 'rgba(13,17,32,0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
              className="tixup-event-card"
            >
              <div style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 800 }}>
                {ev.tag}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '10.5px', color: '#60A5FA', fontWeight: 900, textTransform: 'uppercase' }}>
                      {ev.date.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '20px', color: '#FFF', fontWeight: 900, lineHeight: 1 }}>
                      {ev.date.split(' ')[1]}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: idx === 3 ? '#FF9900' : '#FFF', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-heading)' }}>
                      {ev.title}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ev.time} &nbsp; {ev.venue}
                    </div>
                  </div>
                </div>

                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ChevronRight size={18} color="#60A5FA" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 7. TOP RATED ORGANIZERS LEADERBOARD (SUBTLE ARENA BACKDROP) ── */}
      <section className="landing-section-wrap">
        <div style={{ marginBottom: '28px' }}>
          <span style={{ color: '#2563EB', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>PROMOTER LEADERBOARD</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
            Top Rated Organizers
          </h2>
        </div>

        <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
          {/* Subtle 6% Opacity Arena Crowd Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/concert_crowd_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.06,
              mixBlendMode: 'luminosity',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Table Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px 14px 24px', fontSize: '11px', color: '#6B7280', fontWeight: 800, letterSpacing: '1px' }}>
              <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
                <span style={{ width: '20px', textAlign: 'center' }}>#</span>
                <span>ORGANIZER NAME</span>
              </div>
              <span>7D % GROWTH</span>
            </div>

            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {topOrganizers.map((org, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(13,17,32,0.85)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ width: '24px', textAlign: 'center', fontSize: '16px', fontWeight: 900, color: '#FFF', display: 'flex', justifyContent: 'center' }}>
                      {idx === 0 ? <Crown size={22} color="#F59E0B" /> : idx + 1}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#7C3AED,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#FFF' }}>
                        {org.avatar ? <LazyImage src={org.avatar} alt={org.name} objectFit="cover" style={{ width: '100%', height: '100%' }} /> : org.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '16.5px', fontWeight: 800, color: org.isFeatured ? '#FF9900' : '#FFF', fontFamily: 'var(--font-heading)' }}>
                          {org.name}
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#9CA3AF' }}>
                          {org.followers} &nbsp;•&nbsp; <span style={{ color: '#F59E0B' }}>{org.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <svg width="100" height="24" viewBox="0 0 100 24" fill="none">
                      <path d={idx % 2 === 0 ? "M0 18 Q 35 22, 60 12 T 85 4 T 100 8" : "M0 6 Q 30 20, 60 16 T 85 22 T 100 18"} stroke="#10B981" strokeWidth="2" fill="none" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>{org.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 8. UNBOXED ANDROID SCANNER APP SHOWCASE ── */}
      <section className="landing-section-wrap">
        <AndroidAppPromotion />
      </section>

      <div className="glass-section-divider" />

      {/* ── 9. APPLE NEWS-STYLE PULSE BLOG ── */}
      <section className="landing-section-wrap">
        <HomeNewsCarousel
          onOpenArticle={(slug) => onNavigateToBlog(slug)}
          onOpenBlogHub={() => onNavigateToBlog()}
        />
      </section>

      <div className="glass-section-divider" />

      {/* ── 10. FAQ ACCORDION ── */}
      <section style={{ maxWidth: '880px', margin: '0 auto clamp(60px, 8vw, 120px) auto', padding: '0 clamp(20px, 4vw, 72px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>KNOWLEDGE BASE</span>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '22px 26px', cursor: 'pointer', width: '100%', boxSizing: 'border-box', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', margin: 0, fontFamily: 'var(--font-heading)' }}>{faq.question}</h4>
                <ChevronRight size={18} color="#60A5FA" style={{ transform: openFaq === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
              </div>
              {openFaq === idx && (
                <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6, marginTop: '16px', marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 11. PRE-FOOTER PROMOTER CTA BANNER ── */}
      <section className="landing-section-wrap" style={{ marginBottom: 0 }}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(124,58,237,0.15) 50%, rgba(13,17,32,0.95) 100%)',
          border: '1px solid rgba(37,99,235,0.35)',
          borderRadius: '24px',
          padding: 'clamp(36px, 5vw, 64px) clamp(24px, 4vw, 48px)',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>
          {/* Subtle Stage Lighting Background Layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/concert_crowd_bg.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.12,
              mixBlendMode: 'luminosity',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '99px', background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.35)', color: '#60A5FA', fontSize: '12px', fontWeight: 800, marginBottom: '20px' }}>
              <Sparkles size={14} color="#60A5FA" />
              <span>FOR EVENT ORGANIZERS &amp; PROMOTERS</span>
            </div>

            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#FFF', margin: '0 0 16px 0', fontFamily: 'var(--font-heading)' }}>
              Ready to Host Your Next World-Class Event?
            </h2>

            <p style={{ color: '#9CA3AF', fontSize: 'clamp(15px, 1.8vw, 18px)', maxWidth: '640px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
              Launch your event page in under 3 minutes with custom ticket tiers, real-time settlements, and sub-500ms encrypted QR gate scanning.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={onNavigateToWorkspace}
                className="tixup-btn-primary"
                style={{ padding: '0 36px', height: '54px', fontSize: '16px' }}
              >
                <Sparkles size={16} /> Become an Organizer
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
