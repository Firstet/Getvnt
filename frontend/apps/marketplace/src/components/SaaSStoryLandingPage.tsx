import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, Download, QrCode,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Star, Play, ChevronRight,
  Compass, Crown, Clock, HelpCircle, BarChart3, Layers, Bot, Globe, Check, ArrowUpRight, Ticket
} from 'lucide-react';
import { LazyImage } from '../../../../shared/src';
import { HomeNewsCarousel } from './HomeNewsCarousel';
import { AndroidAppPromotion } from './AndroidAppPromotion';

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

  const categoriesList = ['All', 'Music & Concerts', 'Tech & AI', 'Cultural Festivals', 'Nightlife', 'Sports'];

  const filteredEvents = events.filter((ev) => {
    const matchesCity = selectedCity === 'All' || selectedCity === 'All Africa' || ev.city?.toLowerCase() === selectedCity.toLowerCase();
    const matchesCat = selectedCategory === 'All' || ev.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesCity && matchesCat;
  });

  const faqs = [
    { question: 'How quickly can I set up an event on GETVNT?', answer: 'You can launch a full event page with custom ticket tiers, seat maps, and AI marketing copy in under 3 minutes using the Getvnt Organizer OS.' },
    { question: 'How do payout settlements work for ticket sales?', answer: 'Ticket sales are settled directly into your connected Paystack, Flutterwave, or Stripe bank account in real-time or within 24 hours based on your plan.' },
    { question: 'Is offline gate check-in supported if internet drops at the venue?', answer: 'Yes! The GETVNT Android Mobile App features full offline RSA encrypted QR code scanning that syncs seamlessly once connectivity is restored.' },
    { question: 'What platform fees does GETVNT charge?', answer: 'Our Starter plan is completely free for free events. Paid events start at 2.5% + ₦100 per ticket, or 0% platform fee on custom Enterprise plans.' },
  ];

  return (
    <div className="saas-story-page" style={{ color: '#F9FAFB', overflowX: 'hidden' }}>
      
      {/* ── 1. HERO SECTION (Atmospheric Typography + Ambient Radial Glow) ── */}
      <section style={{ position: 'relative', paddingTop: '60px', paddingBottom: '96px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background Radial Orbs */}
        <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(124,58,237,0.12) 50%, transparent 100%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative', zIndex: 2, padding: '0 20px' }}>
          
          {/* Release Pill Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '99px', background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(37,99,235,0.3)', color: '#60A5FA', fontSize: '12px', fontWeight: 800, marginBottom: '24px' }}>
            <Sparkles size={14} color="#60A5FA" />
            <span>GETVNT OS v2.0 • The Event Infrastructure for Next-Gen Organizers</span>
          </div>

          {/* Hero Main Heading */}
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
            Powering World-Class <br className="hidden-mobile" />
            <span style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Events &amp; Ticket Commerce
            </span>
          </h1>

          {/* Hero Subheading */}
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#9CA3AF', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 36px auto', fontWeight: 500 }}>
            From stadium concerts to tech summits. Create high-converting event pages, execute instant <strong style={{ color: '#E2E8F0' }}>&lt;500ms gate check-ins</strong>, and automate revenue payouts.
          </p>

          {/* Hero CTA Button Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <a
              href="/organizer"
              onClick={(e) => { e.preventDefault(); onNavigateToWorkspace(); }}
              className="btn-cta"
              style={{ padding: '16px 32px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: '#FFF', fontSize: '15px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 12px 30px rgba(37,99,235,0.4)', transition: 'transform 0.2s ease' }}
            >
              Start Organizing Free <ArrowRight size={18} />
            </a>

            <button
              onClick={() => onNavigateToTab('manage_ticket')}
              style={{ padding: '16px 28px', borderRadius: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s ease' }}
            >
              <Ticket size={18} color="#34D399" /> Manage My Tickets
            </button>
          </div>

          {/* User Social Proof Avatar Capsule */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', padding: '10px 20px', borderRadius: '99px', background: 'rgba(13,17,32,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', marginLeft: '-6px' }}>
              {['#EF4444', '#3B82F6', '#10B981', '#F59E0B'].map((bg, idx) => (
                <div key={idx} style={{ width: '28px', height: '28px', borderRadius: '50%', background: bg, border: '2px solid #07090F', marginLeft: idx > 0 ? '-8px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: '#FFF' }}>
                  {['AF', 'NT', 'CT', 'LG'][idx]}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'left', fontSize: '12.5px' }}>
              <div style={{ color: '#FBBF24', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '3px' }}>
                ★ ★ ★ ★ ★ <span style={{ color: '#FFF', marginLeft: '4px' }}>4.9/5 Rating</span>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '11.5px' }}>Trusted by 1,200+ top event creators across Africa &amp; UK</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. FEATURED EVENT SHOWCASE (Asymmetrical Split Layout) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 112px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'stretch', background: 'linear-gradient(135deg, rgba(17,24,39,0.9) 0%, rgba(13,17,32,0.95) 100%)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '32px', padding: '36px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          
          {/* Subtle Ambient Glow */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Left Media Container */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', minHeight: '320px', position: 'relative' }}>
            <LazyImage src={featuredEvent.banner_url} alt={featuredEvent.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(7,9,15,0.9) 100%)' }} />
            
            <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(245,158,11,0.9)', backdropFilter: 'blur(10px)', color: '#0B0F19', fontSize: '11px', fontWeight: 900, padding: '5px 12px', borderRadius: '99px', letterSpacing: '0.5px' }}>
              <Crown size={12} style={{ display: 'inline', marginRight: '4px' }} /> FEATURED EVENT DROP
            </span>

            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#FFF', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#FBBF24" /> {featuredEvent.venue_name}, {featuredEvent.city}
              </span>
              <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 900, background: 'rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)' }}>
                🔥 92% Sold Out
              </span>
            </div>
          </div>

          {/* Right Information & Ticket Purchase Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px 0' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ color: '#F87171', fontSize: '12px', fontWeight: 800, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 10px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={12} /> Flash Drop Ends in 04h : 18m
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 900, color: '#FFF', lineHeight: 1.25, marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>
                {featuredEvent.title}
              </h2>

              <p style={{ color: '#9CA3AF', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
                Experience Africa's premier Afrobeats showcase live at Eko Atlantic. Featuring top headliners, VIP champagne lounges, fast-track check-in, and backstage meet &amp; greet passes.
              </p>

              {/* Lineup Highlights Micro-Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
                {['🎵 Live Afrobeats', '🍸 VIP Lounge', '⚡ Instant QR Ticket', '🛡️ 100% Guaranteed'].map((tag, idx) => (
                  <span key={idx} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px', color: '#E2E8F0', fontWeight: 700 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Ticket Price Starts At</span>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#F59E0B' }}>₦35,000</div>
              </div>

              <button
                onClick={() => onSelectEvent(featuredEvent)}
                className="btn-cta"
                style={{ padding: '14px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#07090F', fontWeight: 900, fontSize: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(245,158,11,0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Zap size={16} /> Get VIP Ticket Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. WHY GETVNT (Text-First Split Layout) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 128px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Text Narrative */}
          <div>
            <div style={{ color: '#38BDF8', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              THE EVENT OPERATING SYSTEM
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 42px)', fontWeight: 900, color: '#FFF', lineHeight: 1.18, marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
              Built for Scale. <br />
              <span style={{ color: '#94A3B8' }}>Designed for Zero-Friction Ticketing.</span>
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
              Traditional ticketing platforms lock your revenue and rely on slow manual gate check-ins. GETVNT combines high-speed mobile scanning, real-time analytics, and automated multi-currency payouts into one seamless platform.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Sub-500ms Gate Verification', desc: 'Scan encrypted QR codes instantly using mobile cameras, with full offline check-in support.', icon: <QrCode size={18} color="#38BDF8" /> },
                { title: 'Direct Instant Revenue Payouts', desc: 'Receive funds directly into your bank account via Paystack, Flutterwave, or Stripe.', icon: <DollarSign size={18} color="#34D399" /> },
                { title: 'AI Assistant Co-Pilot', desc: 'Generate marketing campaigns, optimize ticket pricing, and analyze attendee velocity on auto-pilot.', icon: <Bot size={18} color="#C084FC" /> },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '13.5px', color: '#9CA3AF', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Floating Visual Card Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(13,17,32,0.95) 0%, rgba(7,9,15,0.98) 100%)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '32px', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 800, textTransform: 'uppercase' }}>Live Platform Health</span>
                <span style={{ fontSize: '11px', color: '#34D399', background: 'rgba(16,185,129,0.15)', padding: '3px 8px', borderRadius: '99px', fontWeight: 800 }}>● 99.98% Active</span>
              </div>

              {/* Simulated Stats Metric Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700 }}>Total GMV Processed</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFF', margin: '4px 0' }}>₦12.8 Billion</div>
                  <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 700 }}>↑ +38% this quarter</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700 }}>Gate Scan Speed</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#60A5FA', margin: '4px 0' }}>380 ms</div>
                  <div style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 700 }}>Offline Sync Active</div>
                </div>
              </div>

              {/* Simulated Gate Flow Bar */}
              <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)', padding: '16px', borderRadius: '16px', color: '#E2E8F0', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} color="#60A5FA" />
                  <span>Encrypted RSA QR Verification</span>
                </div>
                <CheckCircle2 size={18} color="#34D399" />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 4. PLATFORM STATISTICS (Edge-to-Edge Floating Glass Telemetry Bar) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 128px auto', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(13,18,34,0.95) 0%, rgba(7,9,15,0.98) 100%)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: '32px', padding: '40px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
          {[
            { label: 'Total Volume Processed', value: '₦12.5B+', sub: 'Settled in real-time' },
            { label: 'Verified Tickets Sold', value: '850,000+', sub: 'Zero fake tickets' },
            { label: 'Gate Scan Latency', value: '<500ms', sub: 'Camera & barcode engine' },
            { label: 'African Markets', value: '12+', sub: 'NG, KE, ZA, GH, UK, AE' },
          ].map((stat, idx) => (
            <div key={idx}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#FFF', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #FFF 0%, #94A3B8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#60A5FA', marginTop: '6px' }}>{stat.label}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. LIVE DASHBOARD PREVIEW (Nearly Full-Width Showcase) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 128px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: '40px' }}>
          <span style={{ color: '#06B6D4', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
            ENTERPRISE OPERATING SYSTEM
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#FFF', marginTop: '8px', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            One Dashboard for Every Event Need
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', maxWidth: '640px', margin: '12px auto 0 auto' }}>
            Control venue capacity, stream real-time revenue, design custom tickets, and deploy AI marketing campaigns from a single unified workspace.
          </p>

          {/* Interactive Showcase Tabs */}
          <div style={{ display: 'inline-flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '16px', marginTop: '28px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: 'revenue', label: '📊 Real-Time Revenue Radar' },
              { id: 'gate', label: '⚡ Gate Scanner Studio' },
              { id: 'ai', label: '🤖 AI Marketing Co-Pilot' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDashboardTab(tab.id as any)}
                style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: activeDashboardTab === tab.id ? '#2563EB' : 'transparent', color: '#FFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Almost Full-Width Dashboard Mockup Container */}
        <div style={{ background: '#0D1120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.8)', textAlign: 'left' }}>
          {/* Dashboard Window Header Bar */}
          <div style={{ background: '#07090F', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, marginLeft: '12px' }}>getvnt.com/organizer/dashboard</span>
            </div>
            <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 800, background: 'rgba(56,189,248,0.12)', padding: '4px 10px', borderRadius: '99px' }}>
              GETVNT OS v2.0
            </span>
          </div>

          {/* Inner Interactive Content Mockup */}
          <div style={{ padding: '32px' }}>
            {activeDashboardTab === 'revenue' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 800 }}>LIVE TICKET SALES</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#FFF', margin: '4px 0' }}>₦48,650,000</div>
                    <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700 }}>↑ +42% vs last week</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 800 }}>ATTENDEE CHECK-INS</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#60A5FA', margin: '4px 0' }}>14,280 / 15,000</div>
                    <div style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 700 }}>95% Gate Occupancy</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 800 }}>SETTLED TO BANK</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#34D399', margin: '4px 0' }}>₦46,200,000</div>
                    <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700 }}>Instant Payout Active</div>
                  </div>
                </div>

                {/* Simulated Chart Graph */}
                <div style={{ height: '180px', background: 'linear-gradient(180deg, rgba(37,99,235,0.15) 0%, transparent 100%)', borderRadius: '16px', border: '1px solid rgba(37,99,235,0.3)', padding: '20px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                  {[40, 65, 55, 80, 95, 70, 85, 100, 90, 110, 125, 140].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}px`, background: 'linear-gradient(180deg, #60A5FA 0%, #2563EB 100%)', borderRadius: '6px 6px 0 0' }} />
                  ))}
                </div>
              </div>
            )}

            {activeDashboardTab === 'gate' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFF', marginBottom: '10px' }}>High-Speed Mobile Scanner Engine</h3>
                  <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                    Turn any smartphone into a professional gate check-in terminal. Verified QR codes are validated in under 500 milliseconds with optional offline caching.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ color: '#34D399', fontSize: '13px', fontWeight: 700 }}>✓ RSA 4096-bit anti-counterfeiting encryption</div>
                    <div style={{ color: '#34D399', fontSize: '13px', fontWeight: 700 }}>✓ Multi-lane staff sync across 50+ mobile devices</div>
                    <div style={{ color: '#34D399', fontSize: '13px', fontWeight: 700 }}>✓ Instant VIP notification alerts for venue managers</div>
                  </div>
                </div>
                <div style={{ background: '#000', borderRadius: '20px', border: '1px dashed rgba(37,99,235,0.5)', padding: '32px', textAlign: 'center' }}>
                  <QrCode size={80} color="#60A5FA" style={{ margin: '0 auto 16px auto' }} />
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#FFF' }}>SCAN PASSPORT / TICKET PASS</div>
                  <div style={{ fontSize: '12px', color: '#34D399', marginTop: '4px' }}>Ready for Gate Lane 1</div>
                </div>
              </div>
            )}

            {activeDashboardTab === 'ai' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '16px' }}>AI Marketing &amp; Sales Velocity Predictions</h3>
                <div style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ color: '#C084FC', fontSize: '13px', fontWeight: 800, marginBottom: '4px' }}>🤖 GETVNT AI RECOMMENDATION</div>
                  <p style={{ color: '#E2E8F0', fontSize: '14px', margin: 0 }}>
                    "Ticket velocity is trending 28% higher than projected. Increasing Tier 2 tickets by ₦5,000 will optimize total revenue by an estimated ₦3.4M without reducing conversion."
                  </p>
                </div>
                <button className="btn-cta" style={{ background: '#7C3AED', color: '#FFF', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', border: 'none' }}>
                  Apply AI Price Optimization
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── 6. ORGANIZER OPERATING SYSTEM (Feature Showcase) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 128px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
            SUITE OF TOOLS
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '8px', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            Everything You Need to Run Unforgettable Events
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { title: 'Ticket Designer Desk', desc: 'Customize branded PDF & mobile passes with custom QR codes, badges, and VIP perks.', icon: <Layers size={22} color="#FBBF24" /> },
            { title: 'Audience CRM & Loyalty', desc: 'Track repeat buyers, send automated WhatsApp broadcasts, and issue VIP loyalty rewards.', icon: <Users size={22} color="#F472B6" /> },
            { title: 'AI Sponsorship Decks', desc: 'Generate professional multi-page sponsorship pitch decks tailored for corporate brand partners.', icon: <BarChart3 size={22} color="#C084FC" /> },
            { title: 'Branded QR Code Studio', desc: 'Create high-contrast custom branded QR codes with embedded organizer logos.', icon: <QrCode size={22} color="#38BDF8" /> },
          ].map((card, idx) => (
            <div key={idx} style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '28px', transition: 'all 0.25s ease' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>{card.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. MOBILE APP SECTION ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 128px auto', padding: '0 24px' }}>
        <AndroidAppPromotion />
      </section>

      {/* ── 8. FEATURED EVENTS MAGAZINE SHOWCASE ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 128px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ color: '#EC4899', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
              DISCOVER EXPERIENCES
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', margin: '6px 0 0 0', fontFamily: 'var(--font-heading)' }}>
              Trending Events Across Africa &amp; Beyond
            </h2>
          </div>

          {/* City Destination Filter Bar */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {citiesList.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCity(c.name === 'All Africa' ? 'All' : c.name)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '99px',
                  border: '1px solid',
                  borderColor: selectedCity === c.name || (c.name === 'All Africa' && selectedCity === 'All') ? '#2563EB' : 'rgba(255,255,255,0.1)',
                  background: selectedCity === c.name || (c.name === 'All Africa' && selectedCity === 'All') ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                  color: selectedCity === c.name || (c.name === 'All Africa' && selectedCity === 'All') ? '#60A5FA' : '#9CA3AF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Magazine Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '24px' }}>
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              style={{
                background: 'rgba(13,17,32,0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
              className="carousel-card"
            >
              <div className="carousel-banner-wrap" style={{ height: '190px' }}>
                <LazyImage src={ev.banner_url} alt={ev.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
                <span className="badge-date">
                  {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(8px)', color: '#38BDF8', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.3)' }}>
                  {ev.category || 'General'}
                </span>
              </div>

              <div className="carousel-body">
                <div>
                  <h3 className="carousel-title" style={{ fontSize: '17px' }}>{ev.title}</h3>
                  <div className="carousel-venue" style={{ fontSize: '12.5px' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {ev.venue_name}, {ev.city}
                  </div>
                </div>

                <div className="carousel-footer">
                  <span className="price-text">
                    {ev.ticket_types?.[0] ? `₦${ev.ticket_types[0].price.toLocaleString()}` : 'FREE'}
                  </span>
                  <button className="btn-buy" onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}>
                    Get Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. TESTIMONIALS (Asymmetrical Quote Layout) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 128px auto', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(30,27,75,0.6) 0%, rgba(13,17,32,0.9) 100%)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '32px', padding: '48px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ color: '#C084FC', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            ORGANIZER STORIES
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', marginBottom: '36px', fontFamily: 'var(--font-heading)' }}>
            Loved by Event Directors Worldwide
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {[
              { quote: '"GETVNT transformed how we run Afrobeats festivals in Lagos. Gate scan times dropped below 400ms and our revenue was paid directly into our bank in 24 hours."', author: 'Tunde Bakare', role: 'Executive Producer, AfroNation Lagos' },
              { quote: '"The AI assistant generated our entire sponsorship deck and optimized our ticket pricing tiers. We sold out 15,000 delegate passes in less than 4 days."', author: 'Amina Osei', role: 'Operations Lead, Nairobi Tech Expo' },
              { quote: '"Zero ticket forgery. The encrypted QR gate validation gave our venue staff total security control across all 4 entry gates."', author: 'David Van Der Merwe', role: 'General Manager, Table Mountain Arena' },
            ].map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: '#E2E8F0', fontSize: '14.5px', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                  {t.quote}
                </p>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFF' }}>{t.author}</div>
                  <div style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 600 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. PRICING (Enterprise SaaS Tier Comparison) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 128px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: '40px' }}>
          <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
            TRANSPARENT PRICING
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#FFF', marginTop: '8px', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            Simple Fees. No Hidden Charges.
          </h2>

          {/* Monthly / Annual Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '99px', marginTop: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setBillingCycle('monthly')} style={{ padding: '6px 16px', borderRadius: '99px', border: 'none', background: billingCycle === 'monthly' ? '#2563EB' : 'transparent', color: '#FFF', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}>
              Monthly
            </button>
            <button onClick={() => setBillingCycle('annual')} style={{ padding: '6px 16px', borderRadius: '99px', border: 'none', background: billingCycle === 'annual' ? '#2563EB' : 'transparent', color: '#FFF', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}>
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', textAlign: 'left' }}>
          {[
            { name: 'Starter', price: '₦0', fee: '2.5% + ₦100 per ticket', desc: 'Perfect for free events, workshops, and boutique gatherings.', features: ['Unlimited Free Events', 'Standard QR Gate App', 'Basic Email Receipts', 'Paystack/Stripe Payouts'] },
            { name: 'Scale OS', price: billingCycle === 'annual' ? '₦15,000/mo' : '₦18,000/mo', fee: '1.8% per ticket', popular: true, desc: 'Ideal for growing promoters, concert series, and multi-day summits.', features: ['All Starter Features', 'AI Marketing Co-Pilot', 'Custom Ticket Designer', 'Offline QR Gate Sync', '24/7 Dedicated Support'] },
            { name: 'Enterprise', price: 'Custom', fee: '0% Platform Fee Available', desc: 'For stadium festivals, multi-venue tours, and government expos.', features: ['Custom Revenue Splits', 'Dedicated Account Manager', 'Custom Domain Integration', 'White-Label Mobile App', 'SLA 99.99% Uptime Guarantee'] },
          ].map((plan, idx) => (
            <div key={idx} style={{ background: plan.popular ? 'linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(13,17,32,0.95) 100%)' : 'rgba(13,17,32,0.85)', border: '1px solid', borderColor: plan.popular ? '#2563EB' : 'rgba(255,255,255,0.08)', borderRadius: '28px', padding: '32px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {plan.popular && (
                <span style={{ position: 'absolute', top: '-12px', right: '24px', background: '#2563EB', color: '#FFF', fontSize: '11px', fontWeight: 900, padding: '4px 12px', borderRadius: '99px' }}>
                  MOST POPULAR
                </span>
              )}
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '8px' }}>{plan.name}</h3>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>{plan.price}</div>
                <div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 800, marginBottom: '16px' }}>{plan.fee}</div>
                <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginBottom: '24px', lineHeight: 1.5 }}>{plan.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>
                      <Check size={16} color="#34D399" /> <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onNavigateToWorkspace}
                className="btn-cta"
                style={{ width: '100%', padding: '14px', borderRadius: '14px', background: plan.popular ? '#2563EB' : 'rgba(255,255,255,0.08)', border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontWeight: 800, fontSize: '14px', cursor: 'pointer', textAlign: 'center' }}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. FAQ ACCORDION ── */}
      <section style={{ maxWidth: '840px', margin: '0 auto 128px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#60A5FA', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
            GOT QUESTIONS?
          </span>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px 24px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', margin: 0 }}>{faq.question}</h3>
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
