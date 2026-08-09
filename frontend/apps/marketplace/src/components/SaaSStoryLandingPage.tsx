import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, Download, QrCode,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Star, Play, ChevronRight,
  Crown, Clock, HelpCircle, Rss, Search, Heart, Share2, Music, Briefcase, Mic, GraduationCap, Laptop, Trophy, Utensils, Shirt, Award, Globe, Cpu, Lock, Check, Layers, BarChart3, SlidersHorizontal
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
    title: 'AFROBEAT FESTIVAL & TECH SUMMIT 2026',
    venue_name: 'EKO HOTEL CONVENTION CENTER',
    city: 'Lagos',
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

  // 11 Category Cards
  const categoryCards = [
    { id: 'Music', label: 'Music & Concerts', icon: <Music size={22} color="#60A5FA" />, count: '142 Events', bgImage: '/afrobeat_festival_banner.png' },
    { id: 'Business', label: 'Business & Summits', icon: <Briefcase size={22} color="#34D399" />, count: '89 Events', bgImage: '/luxury_vip_lounge.png' },
    { id: 'Technology', label: 'Tech & AI Conferences', icon: <Laptop size={22} color="#A78BFA" />, count: '116 Events', bgImage: '/tech_summit_banner.png' },
    { id: 'Comedy', label: 'Comedy Shows', icon: <Mic size={22} color="#FBBF24" />, count: '45 Events', bgImage: '/concert_crowd_bg.png' },
    { id: 'Sports', label: 'Sports & Esports', icon: <Trophy size={22} color="#60A5FA" />, count: '38 Events', bgImage: '/concert_crowd_bg.png' },
    { id: 'Education', label: 'Education & Workshops', icon: <GraduationCap size={22} color="#F472B6" />, count: '62 Events', bgImage: '/tech_summit_banner.png' },
    { id: 'Lifestyle', label: 'Lifestyle & Culture', icon: <Sparkles size={22} color="#F59E0B" />, count: '54 Events', bgImage: '/afrobeat_festival_banner.png' },
    { id: 'Food', label: 'Food & Wine Festivals', icon: <Utensils size={22} color="#34D399" />, count: '51 Events', bgImage: '/luxury_vip_lounge.png' },
    { id: 'Fashion', label: 'Fashion & Runway', icon: <Shirt size={22} color="#FBBF24" />, count: '29 Events', bgImage: '/afrobeat_festival_banner.png' },
    { id: 'Religious', label: 'Religious & Ministry', icon: <Heart size={22} color="#EC4899" />, count: '47 Events', bgImage: '/luxury_vip_lounge.png' },
    { id: 'Networking', label: 'Networking Mixers', icon: <Users size={22} color="#38BDF8" />, count: '73 Events', bgImage: '/tech_summit_banner.png' },
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesCity = selectedCity === 'All' || selectedCity === 'All Cities' || ev.city?.toLowerCase() === selectedCity.toLowerCase();
    const matchesCat = selectedCategory === 'All' || ev.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery || ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) || ev.venue_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesCat && matchesSearch;
  });

  // 18 High-Trust Production Q&As
  const faqs = [
    { question: 'What is GETVNT?', answer: 'GETVNT is Africa\'s AI-powered Event Operating System. We give organizers tools to create events, sell tickets online, build branded event websites, verify attendees, scan QR passes offline, and manage bank payouts—all in one dashboard.' },
    { question: 'Is it free to create and sell events on GETVNT?', answer: 'Yes. Anyone can create an account and list unlimited free or paid events with zero monthly subscription fees.' },
    { question: 'What fees does GETVNT charge on ticket sales?', answer: 'GETVNT charges a flat 5% platform fee on every paid ticket sold. Free events are 100% free with zero platform fees.' },
    { question: 'Are payment gateway transaction fees separate?', answer: 'Yes. Payment processors (Paystack, Flutterwave, Stripe) charge approximately 1.5% per transaction separately for secure payment processing.' },
    { question: 'How do organizers receive payouts?', answer: 'Revenues are automatically settled into your connected bank account or GETVNT wallet according to automated disbursal rules.' },
    { question: 'How long do payouts take after an event?', answer: 'Standard payouts process within 24 hours of ticket sales. Verified Trusted Organizers can also activate instant wallet disbursals in their Organizer OS dashboard.' },
    { question: 'What is a Trusted Organizer?', answer: 'A Trusted Organizer is a verified event promoter who has completed government ID, selfie biometrics, and bank verification, earning a verified badge and priority search ranking.' },
    { question: 'Why do organizers need to verify identity?', answer: 'Verification protects ticket buyers from fraudulent events, ensures ticket authenticity, and enables secure bank disbursals.' },
    { question: 'Which government IDs are accepted for verification?', answer: 'We accept National Identity Number (NIN), International Passport, Driver\'s License, and Voter\'s Card.' },
    { question: 'How long does identity verification take?', answer: 'Verification is powered by AI and usually completes in under 2 minutes. If manual review is required, our compliance team approves applications within 12 hours.' },
    { question: 'Can I build my own branded event website?', answer: 'Yes. You can create a full multi-page event website using our Website Builder OS with 12 specialized category templates.' },
    { question: 'Can I use my own custom domain?', answer: 'Yes. You can host your event website on a free subdomain (organizername.getvnt.com) or connect your custom domain (www.myfestival.com) with automated SSL certificates.' },
    { question: 'How are tickets validated at the venue?', answer: 'Every ticket includes an encrypted digital QR code that gate staff scan using the GETVNT Android Scanner App in under 500ms.' },
    { question: 'Can I scan tickets without internet connectivity?', answer: 'Yes. The GETVNT Android App supports offline RSA-encrypted QR validation that syncs automatically once internet connection is restored.' },
    { question: 'Can attendees transfer their tickets to someone else?', answer: 'Yes. Attendees can securely transfer digital QR tickets to friends or colleagues directly from their GETVNT attendee portal.' },
    { question: 'How do refunds work and who sets the refund policy?', answer: 'Event organizers set their own refund policies. Organizers can process instant full or partial refunds directly from their Organizer OS dashboard.' },
    { question: 'Can teams manage an organizer account together?', answer: 'Yes. You can invite team members to your workspace with role-based access for gate scanners, accountants, and co-organizers.' },
    { question: 'Is payment information secure on GETVNT?', answer: 'Yes. All checkout transactions are PCI-DSS Level 1 compliant and encrypted with 256-bit SSL.' },
  ];

  const topOrganizers = [
    { name: 'AfroNation Global Events', followers: '142k Followers • ₦480M GMV', growth: '↑ 148.50%', avatar: '/afrobeat_festival_banner.png', rating: '4.9 ★', isFeatured: false },
    { name: 'Bankole & Partners Live', followers: '98k Followers • ₦320M GMV', growth: '↑ 84.20%', avatar: '/tech_summit_banner.png', rating: '4.8 ★', isFeatured: false },
    { name: 'Samora & Co. Studios', followers: '215k Followers • ₦890M GMV', growth: '↑ 633.46%', avatar: '/luxury_vip_lounge.png', rating: '5.0 ★', isFeatured: true },
    { name: 'De Brilliance Luxury Events', followers: '64k Followers • ₦190M GMV', growth: '↑ 52.10%', avatar: '/afrobeat_festival_banner.png', rating: '4.7 ★', isFeatured: false },
  ];

  return (
    <div className="tixup-inspired-marketplace" style={{ color: '#F9FAFB', overflowX: 'hidden', width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }}>
      
      {/* ── 1. HERO EXPERIENCE (APPLE & AIRBNB INSPIRED) ── */}
      <section
        className="tixup-hero-section"
        style={{
          position: 'relative',
          backgroundImage: 'linear-gradient(180deg, rgba(6,9,19,0.85) 0%, rgba(6,9,19,0.96) 85%, #060913 100%), url(/concert_crowd_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingTop: 'clamp(40px, 6vw, 80px)',
          paddingBottom: 'clamp(60px, 8vw, 100px)',
        }}
      >
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: 'min(100%, 1500px)', height: '600px', background: 'radial-gradient(circle, rgba(37,99,235,0.28) 0%, rgba(124,58,237,0.16) 45%, transparent 75%)', filter: 'blur(120px)', pointerEvents: 'none' }} />

        <div className="landing-section-wrap" style={{ position: 'relative', zIndex: 2, marginBottom: 0 }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', borderRadius: '99px', background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(37,99,235,0.4)', color: '#60A5FA', fontSize: '13px', fontWeight: 800, marginBottom: '28px', maxWidth: '100%', backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}>
            <Sparkles size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
            <span>GETVNT OS • Africa's AI-Powered Event Operating System & Marketplace</span>
          </div>

          <h1 style={{ fontSize: 'clamp(42px, 6.5vw, 76px)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em', color: '#FFFFFF', marginBottom: '24px', fontFamily: 'var(--font-heading)', textShadow: '0 10px 40px rgba(0,0,0,0.9)' }}>
            Sell Tickets for Free. <br />
            <span style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 40%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Build Your Event Operating System.</span>
          </h1>

          <p style={{ fontSize: 'clamp(17px, 2vw, 22px)', color: '#E5E7EB', lineHeight: 1.55, maxWidth: '820px', margin: '0 auto 40px auto', fontWeight: 500, textShadow: '0 4px 16px rgba(0,0,0,0.9)' }}>
            Discover extraordinary concerts, tech summits, and festivals across Africa—or launch your own event with 0% subscription fees, custom websites, and instant QR check-ins.
          </p>

          {/* Airbnb-Style Floating Interactive Search Pill Bar */}
          <div style={{
            maxWidth: '960px',
            margin: '0 auto 48px auto',
            background: 'rgba(13, 18, 34, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '99px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            flexWrap: 'wrap'
          }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Search size={18} color="#60A5FA" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search events, artists, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '14px', fontWeight: 600, outline: 'none', width: '100%' }}
              />
            </div>

            {/* City Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <MapPin size={16} color="#34D399" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '13.5px', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
              >
                {citiesList.map(c => <option key={c.name} value={c.name} style={{ background: '#0D1222', color: '#FFF' }}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            {/* Category Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <SlidersHorizontal size={16} color="#A78BFA" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '13.5px', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
              >
                <option value="All" style={{ background: '#0D1222', color: '#FFF' }}>All Categories</option>
                {categoryCards.map(cat => <option key={cat.id} value={cat.id} style={{ background: '#0D1222', color: '#FFF' }}>{cat.label}</option>)}
              </select>
            </div>

            {/* Action Search Button */}
            <button
              className="tixup-btn-primary"
              style={{ padding: '12px 28px', borderRadius: '99px', fontSize: '14px', fontWeight: 900, whiteSpace: 'nowrap' }}
              onClick={() => onNavigateToTab('events')}
            >
              Discover <ArrowRight size={16} />
            </button>
          </div>

          {/* Social Telemetry Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', background: 'rgba(13,17,32,0.75)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px 32px', backdropFilter: 'blur(16px)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#FFF' }}>1,248,500+</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Tickets Verified</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#34D399' }}>4.95 / 5.0</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Organizer Rating</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#60A5FA' }}>&lt; 500ms</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>QR Gate Scan Latency</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#F59E0B' }}>₦0 / mo</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>Core Subscription Fee</div>
            </div>
          </div>

        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 2. FEATURED EVENT SHOWCASE ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>HEADLINE EVENT</span>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>Featured Festival Showcase</h2>
          </div>
        </div>

        <div className="tixup-featured-card" onClick={() => onSelectEvent(featuredEvent)} style={{ cursor: 'pointer', borderRadius: '28px', overflow: 'hidden' }}>
          <LazyImage src={featuredEvent.banner_url} alt={featuredEvent.title} className="tixup-featured-img-wrap" />
          <div className="tixup-featured-overlay" />
          <div className="tixup-featured-content">
            <span className="tixup-category-badge" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, letterSpacing: '1px' }}>
              🔥 SELLING FAST • HEADLINER
            </span>
            <h3 style={{ fontSize: 'clamp(26px, 4.5vw, 44px)', fontWeight: 900, color: '#FFF', margin: '14px 0 10px 0', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>{featuredEvent.title}</h3>
            <p style={{ color: '#E5E7EB', fontSize: '16px', marginBottom: '24px', maxWidth: '680px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span>📍 {featuredEvent.venue_name}</span>
              <span>📅 {new Date(featuredEvent.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span style={{ color: '#34D399', fontWeight: 800 }}>❤️ 1.4k Interested</span>
            </p>
            <button className="tixup-btn-primary" style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 900 }} onClick={(e) => { e.stopPropagation(); onSelectEvent(featuredEvent); }}>
              Get Tickets Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 3. EXPLORE CATEGORIES (11 VISUAL CARDS) ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>DISCOVER BY EXPERIENCE</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>Explore Event Categories</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {categoryCards.map((cat) => (
            <div
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); onNavigateToTab('events'); }}
              style={{
                background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '22px', padding: '24px 18px',
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.icon}
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFF' }}>{cat.label}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600 }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 4. UPCOMING EVENTS GRID (EDGE-TO-EDGE CARDS) ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>LIVE ON GETVNT</span>
            <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 38px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>Upcoming Events Across Africa</h2>
          </div>
          <button className="btn-cta" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', padding: '10px 22px', fontSize: '13.5px', fontWeight: 800 }} onClick={() => onNavigateToTab('events')}>
            View All Events <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredEvents.slice(0, 6).map((ev) => (
            <div key={ev.id} className="tixup-event-card" onClick={() => onSelectEvent(ev)} style={{ cursor: 'pointer', borderRadius: '24px', overflow: 'hidden', background: 'rgba(13,17,32,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <LazyImage src={ev.banner_url} alt={ev.title} className="tixup-event-img-wrap" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(6,9,19,0.85)', color: '#60A5FA', fontSize: '10.5px', fontWeight: 900, padding: '4px 10px', borderRadius: '99px', backdropFilter: 'blur(8px)', border: '1px solid rgba(96,165,250,0.3)' }}>
                  {ev.category || 'LIVE EVENT'}
                </span>
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(52,211,153,0.2)', color: '#34D399', fontSize: '10.5px', fontWeight: 900, padding: '4px 10px', borderRadius: '99px', border: '1px solid rgba(52,211,153,0.4)', backdropFilter: 'blur(8px)' }}>
                  ✓ VERIFIED
                </span>
              </div>
              <div className="tixup-event-info" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', margin: '0 0 6px 0', lineHeight: 1.35, fontFamily: 'var(--font-heading)' }}>{ev.title}</h4>
                <p style={{ color: '#9CA3AF', fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#60A5FA" /> {ev.venue_name}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>Starting from</span>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#34D399' }}>₦{(ev.ticket_types?.[0]?.price || 15000).toLocaleString()}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#60A5FA', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>Get Passes <ArrowRight size={14} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 5. TRUST & SECURITY MATRIX ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>THE GETVNT ADVANTAGE</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>Built for Trust, Speed &amp; Security</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            { icon: <Cpu size={26} color="#60A5FA" />, title: 'AI-Powered Event Copilot', desc: 'Generate high-converting promo graphics, event descriptions, and sponsorship decks in seconds.' },
            { icon: <Zap size={26} color="#34D399" />, title: 'Instant Free Ticketing', desc: 'Create unlimited events and sell tickets online for 0% monthly subscription. GETVNT earns a 5% processing fee on paid tickets.' },
            { icon: <Shield size={26} color="#A78BFA" />, title: 'Verified Organizer KYC', desc: 'Protect buyers with government ID verification, AI biometric selfie matching, and verified promoter badges.' },
            { icon: <Globe size={26} color="#F59E0B" />, title: 'Custom Event Website Builder', desc: 'Host branded event websites on custom domains (www.myfestival.com) with automated SSL certificates.' },
            { icon: <BarChart3 size={26} color="#EC4899" />, title: 'Real-Time Sales Telemetry', desc: 'Track ticket sales velocity, attendee rosters, check-in percentages, and instant revenue disbursals.' },
            { icon: <Lock size={26} color="#38BDF8" />, title: 'PCI-DSS Level 1 Encryption', desc: 'Process payments via Paystack, Flutterwave, and Stripe with 256-bit SSL encryption and automated payouts.' },
          ].map((pillar, idx) => (
            <div key={idx} style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pillar.icon}
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FFF', margin: 0, fontFamily: 'var(--font-heading)' }}>{pillar.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14.5px', lineHeight: 1.55, margin: 0 }}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 6. TRUSTED PROMOTERS SHOWCASE ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>PROMOTER SPOTLIGHT</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>Featured Verified Organizers</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {topOrganizers.map((org, idx) => (
            <div key={idx} style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ color: '#FBBF24', fontSize: '13.5px', fontWeight: 900 }}>{org.rating}</span>
                  <span style={{ color: '#34D399', fontSize: '12.5px', fontWeight: 800 }}>{org.growth}</span>
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>{org.name}</h4>
                <p style={{ color: '#9CA3AF', fontSize: '13px', margin: 0 }}>{org.followers}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 7. UNBOXED ANDROID SCANNER SHOWCASE ── */}
      <section className="landing-section-wrap">
        <AndroidAppPromotion />
      </section>

      <div className="glass-section-divider" />

      {/* ── 8. APPLE NEWS-STYLE PULSE BLOG ── */}
      <section className="landing-section-wrap">
        <HomeNewsCarousel
          onOpenArticle={(slug) => onNavigateToBlog(slug)}
          onOpenBlogHub={() => onNavigateToBlog()}
        />
      </section>

      <div className="glass-section-divider" />

      {/* ── 9. STRIPE-GRADE 2-COLUMN FAQ ACCORDION ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto clamp(60px, 8vw, 120px) auto', padding: '0 clamp(20px, 4vw, 48px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>HELP &amp; KNOWLEDGE BASE</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '15.5px', marginTop: '10px', maxWidth: '680px', margin: '10px auto 0', lineHeight: 1.55 }}>
            Everything you need to know about GETVNT's flat 5% platform fee, bank payouts, promoter verification, and event websites.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', alignItems: 'start' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                tabIndex={0}
                role="button"
                aria-expanded={isOpen}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenFaq(isOpen ? null : idx); } }}
                style={{
                  background: isOpen ? 'rgba(37,99,235,0.09)' : 'rgba(13,17,32,0.8)',
                  border: `1px solid ${isOpen ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '18px',
                  padding: '22px 26px',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isOpen ? '0 12px 32px rgba(0,0,0,0.4)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: isOpen ? '#60A5FA' : '#FFF', margin: 0, fontFamily: 'var(--font-heading)', transition: 'color 0.2s ease', lineHeight: 1.4 }}>
                    {idx + 1}. {faq.question}
                  </h4>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: isOpen ? 'rgba(37,99,235,0.25)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s ease' }}>
                    <ChevronRight size={16} color={isOpen ? '#60A5FA' : '#9CA3AF'} style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>
                </div>
                {isOpen && (
                  <p style={{ color: '#E5E7EB', fontSize: '14.5px', lineHeight: 1.6, marginTop: '16px', marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 10. UNFORGETTABLE CALL-TO-ACTION BANNER ── */}
      <section className="landing-section-wrap" style={{ marginBottom: 0 }}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.3) 0%, rgba(124,58,237,0.2) 50%, rgba(13,17,32,0.98) 100%)',
          border: '1px solid rgba(37,99,235,0.4)',
          borderRadius: '32px',
          padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 56px)',
          textAlign: 'center',
          overflow: 'hidden',
          boxShadow: '0 25px 70px rgba(37, 99, 235, 0.25)'
        }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: '#FFF', marginBottom: '18px', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            Ready to Build Your Event Business on GETVNT OS?
          </h2>
          <p style={{ color: '#E5E7EB', fontSize: 'clamp(16px, 2vw, 19px)', maxWidth: '680px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
            Join thousands of event organizers selling tickets and building custom event websites across Africa.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="tixup-btn-primary" style={{ padding: '16px 40px', fontSize: '16px', fontWeight: 900 }} onClick={onNavigateToWorkspace}>
              Launch Your Event OS Free <ArrowRight size={18} />
            </button>
            <button className="btn-cta" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', padding: '16px 32px', fontSize: '16px', fontWeight: 800 }} onClick={() => onNavigateToTab('events')}>
              Browse Live Events
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
