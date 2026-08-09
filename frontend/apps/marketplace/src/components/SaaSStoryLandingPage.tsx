import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, Download, QrCode,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Star, Play, ChevronRight,
  Crown, Clock, HelpCircle, Rss, Search, Heart, Share2, Music, Briefcase, Mic, GraduationCap, Laptop, Trophy, Utensils, Shirt, Award, Globe, Cpu, Lock, Check, Layers, BarChart3
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
    { name: 'Bankole & Partners Live', followers: '98k Followers • ₦320M GMV', growth: '↑ 84.20%', avatar: '', rating: '4.8 ★', isFeatured: false },
    { name: 'Samora & Co. Studios', followers: '215k Followers • ₦890M GMV', growth: '↑ 633.46%', avatar: '/tech_summit_banner.png', rating: '5.0 ★', isFeatured: true },
    { name: 'De Brilliance Luxury Events', followers: '64k Followers • ₦190M GMV', growth: '↑ 52.10%', avatar: '', rating: '4.7 ★', isFeatured: false },
  ];

  return (
    <div className="tixup-inspired-marketplace" style={{ color: '#F9FAFB', overflowX: 'hidden', width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }}>
      
      {/* ── 1. HERO SECTION (AFRICA'S AI EVENT OPERATING SYSTEM) ── */}
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
            <span>GETVNT OS • Africa's AI-Powered Event Operating System</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '20px', fontFamily: 'var(--font-heading)', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            Sell Tickets for Free. <br />
            <span style={{ color: '#60A5FA', background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Build Your Event Operating System.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: '#D1D5DB', lineHeight: 1.55, maxWidth: '760px', margin: '0 auto 36px auto', fontWeight: 500, textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>
            Create events, sell tickets online, build custom event websites, and scale your brand with AI-powered marketing and instant &lt;500ms QR check-ins.
          </p>

          {/* CTAs & Live Search Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button className="tixup-btn-primary" style={{ padding: '14px 32px', fontSize: '15px', fontWeight: 900 }} onClick={onNavigateToWorkspace}>
              Create Event Free <ArrowRight size={18} />
            </button>
            <button className="btn-cta" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', padding: '14px 28px', fontSize: '15px', fontWeight: 800 }} onClick={() => onNavigateToTab('events')}>
              Explore Live Events
            </button>
          </div>

          {/* Integrated Search Bar */}
          <div className="hero-search-container">
            <div className="hero-search-field">
              <Search size={18} color="#60A5FA" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search events by title, artist, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="tixup-btn-primary hero-search-btn" onClick={() => onNavigateToTab('events')}>
              Search Events
            </button>
          </div>

          {/* Platform Telemetry Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '48px', background: 'rgba(13,17,32,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px 28px', backdropFilter: 'blur(12px)' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>1.2M+</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Tickets Verified</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#34D399' }}>4.9 / 5.0</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Organizer Rating</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#60A5FA' }}>&lt; 500ms</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>QR Gate Scan</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#F59E0B' }}>₦0 / mo</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Core Subscription Fee</div>
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

        <div className="tixup-featured-card" onClick={() => onSelectEvent(featuredEvent)} style={{ cursor: 'pointer' }}>
          <LazyImage src={featuredEvent.banner_url} alt={featuredEvent.title} className="tixup-featured-img-wrap" />
          <div className="tixup-featured-overlay" />
          <div className="tixup-featured-content">
            <span className="tixup-category-badge">🔥 FEATURED HEADLINER</span>
            <h3 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#FFF', margin: '12px 0 8px 0', fontFamily: 'var(--font-heading)' }}>{featuredEvent.title}</h3>
            <p style={{ color: '#D1D5DB', fontSize: '15px', marginBottom: '20px', maxWidth: '640px' }}>
              📍 {featuredEvent.venue_name} • 📅 {new Date(featuredEvent.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <button className="tixup-btn-primary" onClick={(e) => { e.stopPropagation(); onSelectEvent(featuredEvent); }}>
              Get Tickets Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 3. EXPLORE CATEGORIES (11 CATEGORY CARDS) ── */}
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
                background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px',
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.icon}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>{cat.label}</div>
              <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 4. UPCOMING EVENTS GRID ── */}
      <section className="landing-section-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>LIVE ON GETVNT</span>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>Upcoming Events Across Africa</h2>
          </div>
          <button className="btn-cta" style={{ background: 'rgba(255,255,255,0.06)', color: '#FFF' }} onClick={() => onNavigateToTab('events')}>
            View All Events <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredEvents.slice(0, 6).map((ev) => (
            <div key={ev.id} className="tixup-event-card" onClick={() => onSelectEvent(ev)} style={{ cursor: 'pointer' }}>
              <LazyImage src={ev.banner_url} alt={ev.title} className="tixup-event-img-wrap" />
              <div className="tixup-event-info" style={{ padding: '16px' }}>
                <span style={{ color: '#60A5FA', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{ev.category || 'LIVE EVENT'}</span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', margin: '6px 0 4px', lineHeight: 1.3 }}>{ev.title}</h4>
                <p style={{ color: '#9CA3AF', fontSize: '12.5px', margin: 0 }}>📍 {ev.venue_name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#34D399' }}>₦{(ev.ticket_types?.[0]?.price || 15000).toLocaleString()}</span>
                  <span style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 700 }}>Get Passes →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 7. WHY GETVNT (6 KEY VALUE PILLARS) ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>THE GETVNT ADVANTAGE</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>Why Organizers Choose GetVNT</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            { icon: <Cpu size={24} color="#60A5FA" />, title: 'AI-Powered Event Tools', desc: 'Generate event descriptions, promotional copy, poster graphics, and sponsorship decks automatically.' },
            { icon: <Zap size={24} color="#34D399" />, title: 'Instant Free Ticketing', desc: 'Create unlimited events and sell tickets online for 0% monthly subscription. GetVNT earns a 5% processing fee on paid tickets.' },
            { icon: <Shield size={24} color="#A78BFA" />, title: 'Organizer Verification', desc: 'Build attendee trust with verified promoter badges, government ID verification, and secure bank payouts.' },
            { icon: <Globe size={24} color="#F59E0B" />, title: 'Framer-Grade Website Builder', desc: 'Build responsive event websites with custom domains (www.myfestival.com), SEO tools, blog hub, and sponsor logos.' },
            { icon: <BarChart3 size={24} color="#EC4899" />, title: 'Real-Time Analytics', desc: 'Track sales funnels, attendee traffic heatmaps, revenue disbursals, and campaign conversion rates.' },
            { icon: <Lock size={24} color="#38BDF8" />, title: 'PCI-DSS Secure Payments', desc: 'Settle revenues via Paystack, Flutterwave, and Stripe with 256-bit SSL encryption and instant payout options.' },
          ].map((pillar, idx) => (
            <div key={idx} style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pillar.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', margin: 0 }}>{pillar.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 8. ORGANIZER OS SHOWCASE ── */}
      <section className="landing-section-wrap">
        <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(13,17,32,0.95) 100%)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '32px', padding: 'clamp(32px, 5vw, 64px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>ORGANIZER OS</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#FFF', margin: '10px 0 16px', fontFamily: 'var(--font-heading)' }}>
              Your Entire Event Business in One Dashboard.
            </h2>
            <p style={{ color: '#D1D5DB', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Organizer OS provides 20 core suites to run your live events: Website Builder, Gate Check-ins, Customer CRM, Ad Studio, Revenue Wallets, and AI Copilot.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#FFF', marginBottom: '28px' }}>
              <div>✓ Sub-second offline QR gate check-in app</div>
              <div>✓ Automatic Paystack &amp; Stripe bank settlement</div>
              <div>✓ Multi-user team workspace access</div>
            </div>
            <button className="tixup-btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }} onClick={onNavigateToWorkspace}>
              Launch Organizer OS <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ background: '#05070E', borderRadius: '20px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
            <img src="/tech_summit_banner.png" alt="Organizer OS" style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
          </div>
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 9. BUILD YOUR EVENT WEBSITE (WEBSITE OS PRICING MODEL) ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>GETVNT ECOSYSTEM MODEL</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Sell tickets for free. Build your event brand with GetVNT Websites.
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '15px', maxWidth: '640px', margin: '12px auto 0', lineHeight: 1.6 }}>
            Never pay a monthly subscription to list events or sell tickets. We only charge a 5% Platform Processing Fee on paid tickets sold.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Starter Plan */}
          <div style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>STARTER</span>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', margin: '10px 0 4px' }}>Free Forever</div>
            <div style={{ fontSize: '12.5px', color: '#60A5FA', fontFamily: 'monospace' }}>organizer.getvnt.com</div>
            <p style={{ color: '#9CA3AF', fontSize: '13.5px', margin: '16px 0 24px', lineHeight: 1.5 }}>
              Perfect for new event organizers starting out. Unlimited events and ticket sales.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#D1D5DB', marginBottom: '32px', flex: 1 }}>
              <div>✓ Free Organizer Portal &amp; Ticket Creation</div>
              <div>✓ Basic Event Landing Page Subdomain</div>
              <div>✓ QR Door Entrance Scanner App</div>
              <div>✓ 5% Platform Processing Fee on Paid Tickets</div>
            </div>
            <button className="btn-cta" style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: '#FFF', justifyContent: 'center' }} onClick={onNavigateToWorkspace}>
              Start Free Today
            </button>
          </div>

          {/* Professional Plan */}
          <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(13,17,32,0.95) 100%)', border: '2px solid #2563EB', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 50px rgba(37,99,235,0.3)' }}>
            <span style={{ position: 'absolute', top: '16px', right: '16px', background: '#2563EB', color: '#FFF', padding: '4px 12px', borderRadius: '99px', fontSize: '10.5px', fontWeight: 900 }}>
              MOST POPULAR
            </span>
            <span style={{ color: '#60A5FA', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>PROFESSIONAL</span>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', margin: '10px 0 4px' }}>₦120,000 <span style={{ fontSize: '14px', color: '#9CA3AF' }}>/year</span></div>
            <div style={{ fontSize: '12.5px', color: '#34D399', fontFamily: 'monospace' }}>www.myfestival.com</div>
            <p style={{ color: '#9CA3AF', fontSize: '13.5px', margin: '16px 0 24px', lineHeight: 1.5 }}>
              For growing organizers wanting custom domain branding, Framer-grade website builder, &amp; SEO.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#D1D5DB', marginBottom: '32px', flex: 1 }}>
              <div>✓ Everything in Starter</div>
              <div>✓ Custom Domain Connection &amp; Auto SSL</div>
              <div>✓ Framer-Grade Website Builder (12 Templates)</div>
              <div>✓ Blog, SEO, Sponsors, &amp; Gallery CMS</div>
              <div>✓ Email Newsletter &amp; Audience CRM</div>
            </div>
            <button className="tixup-btn-primary" style={{ width: '100%', height: '48px', justifyContent: 'center' }} onClick={onNavigateToWorkspace}>
              Build Organizer Brand <ArrowRight size={16} />
            </button>
          </div>

          {/* Enterprise Plan */}
          <div style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#C084FC', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>ENTERPRISE</span>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', margin: '10px 0 4px' }}>Custom</div>
            <div style={{ fontSize: '12.5px', color: '#C084FC', fontFamily: 'monospace' }}>White-Label OS</div>
            <p style={{ color: '#9CA3AF', fontSize: '13.5px', margin: '16px 0 24px', lineHeight: 1.5 }}>
              For large festival promoters, stadium venues, &amp; enterprise agencies.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#D1D5DB', marginBottom: '32px', flex: 1 }}>
              <div>✓ Multiple Team Admins &amp; Role Access</div>
              <div>✓ Dedicated Sponsor Portal &amp; White-Label</div>
              <div>✓ Enterprise API Vault &amp; Custom Webhooks</div>
              <div>✓ Dedicated Account Manager &amp; Priority Payouts</div>
            </div>
            <button className="btn-cta" style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: '#FFF', justifyContent: 'center' }} onClick={onNavigateToWorkspace}>
              Contact Enterprise Team
            </button>
          </div>
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 10. TESTIMONIALS ── */}
      <section className="landing-section-wrap">
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>PROMOTER STORIES</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>Trusted by Africa's Top Organizers</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {topOrganizers.map((org, idx) => (
            <div key={idx} style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: '#FBBF24', fontSize: '13px', fontWeight: 900 }}>{org.rating}</span>
                  <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 800 }}>{org.growth}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', margin: '0 0 6px' }}>{org.name}</h4>
                <p style={{ color: '#9CA3AF', fontSize: '13px', margin: 0 }}>{org.followers}</p>
              </div>
            </div>
          ))}
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

      {/* ── 11. STRIPE-GRADE 2-COLUMN FAQ ACCORDION ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto clamp(60px, 8vw, 120px) auto', padding: '0 clamp(20px, 4vw, 48px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ color: '#60A5FA', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>HELP &amp; KNOWLEDGE BASE</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '15px', marginTop: '10px', maxWidth: '640px', margin: '10px auto 0', lineHeight: 1.5 }}>
            Everything you need to know about GETVNT's flat 5% platform fee, payouts, verification, and custom event websites.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', alignItems: 'start' }}>
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
                  background: isOpen ? 'rgba(37,99,235,0.08)' : 'rgba(13,17,32,0.75)',
                  border: `1px solid ${isOpen ? 'rgba(37,99,235,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isOpen ? '0 10px 30px rgba(0,0,0,0.35)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: isOpen ? '#60A5FA' : '#FFF', margin: 0, fontFamily: 'var(--font-heading)', transition: 'color 0.2s ease', lineHeight: 1.4 }}>
                    {idx + 1}. {faq.question}
                  </h4>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isOpen ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s ease' }}>
                    <ChevronRight size={16} color={isOpen ? '#60A5FA' : '#9CA3AF'} style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  </div>
                </div>
                {isOpen && (
                  <p style={{ color: '#D1D5DB', fontSize: '14px', lineHeight: 1.6, marginTop: '14px', marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="glass-section-divider" />

      {/* ── 12. FINAL CALL-TO-ACTION BANNER ── */}
      <section className="landing-section-wrap" style={{ marginBottom: 0 }}>
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(124,58,237,0.15) 50%, rgba(13,17,32,0.95) 100%)',
          border: '1px solid rgba(37,99,235,0.35)',
          borderRadius: '28px',
          padding: 'clamp(40px, 6vw, 72px) clamp(24px, 4vw, 48px)',
          textAlign: 'center',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(37, 99, 235, 0.2)'
        }}>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 900, color: '#FFF', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            Ready to Build Your Event Business on GetVNT OS?
          </h2>
          <p style={{ color: '#D1D5DB', fontSize: 'clamp(15px, 1.8vw, 18px)', maxWidth: '640px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            Join thousands of event organizers selling tickets and building custom event websites across Africa.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="tixup-btn-primary" style={{ padding: '16px 36px', fontSize: '15px', fontWeight: 900 }} onClick={onNavigateToWorkspace}>
              Launch Your Event OS Free <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
