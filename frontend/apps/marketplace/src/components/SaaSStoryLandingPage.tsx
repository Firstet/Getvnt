import React, { useState } from 'react';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Shield, Smartphone, Download, QrCode,
  TrendingUp, Users, DollarSign, Calendar, MapPin, Star, Play, ChevronRight,
  Compass, Crown, Clock, HelpCircle, BarChart3, Layers, Bot, Globe, Check, ArrowUpRight, Ticket, Rss
} from 'lucide-react';
import { LazyImage } from '../../../../shared/src';
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
  const [activeTab, setActiveTab] = useState<'revenue' | 'gate' | 'ai'>('revenue');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedCity, setSelectedCity] = useState('All');

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

  const filteredEvents = events.filter((ev) => {
    return selectedCity === 'All' || selectedCity === 'All Africa' || ev.city?.toLowerCase() === selectedCity.toLowerCase();
  });

  const faqs = [
    { question: 'How quickly can I set up an event on GETVNT?', answer: 'Launch a full event page with custom ticket tiers, seat maps, and AI marketing copy in under 3 minutes using Getvnt Organizer OS.' },
    { question: 'How do payout settlements work for ticket sales?', answer: 'Ticket sales are settled directly into your connected Paystack, Flutterwave, or Stripe bank account in real-time or within 24 hours.' },
    { question: 'Is offline gate check-in supported if internet drops at the venue?', answer: 'Yes! The GETVNT Android App features offline RSA encrypted QR code scanning that syncs seamlessly once connectivity is restored.' },
    { question: 'What platform fees does GETVNT charge?', answer: 'Free events are 100% free. Paid events start at 2.5% + ₦100 per ticket, or 0% platform fee on custom Enterprise plans.' },
  ];

  return (
    <div className="tixup-experience-page" style={{ color: '#F9FAFB', overflowX: 'hidden' }}>
      
      {/* ── EXPERIENCE BLOCK 1: ULTRA-CLEAN HERO (TixUp / Linear Style) ── */}
      <section style={{ position: 'relative', paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
        
        {/* Subtle Ambient Top Glow */}
        <div style={{ position: 'absolute', top: '-140px', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '450px', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          
          {/* Release Badge Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '99px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', color: '#60A5FA', fontSize: '12.5px', fontWeight: 800, marginBottom: '28px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#60A5FA' }} />
            <span>GETVNT OS v2.0 • The Event Infrastructure Platform</span>
          </div>

          {/* Massively Bold Hero Title */}
          <h1 style={{ fontSize: 'clamp(42px, 6.8vw, 76px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
            The Modern Standard for <br />
            <span style={{ color: '#60A5FA' }}>Event &amp; Ticket Commerce.</span>
          </h1>

          {/* Clean Subheading */}
          <p style={{ fontSize: 'clamp(17px, 2.2vw, 21px)', color: '#9CA3AF', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 40px auto', fontWeight: 500 }}>
            Create high-converting event experiences, execute sub-500ms gate check-ins, and automate multi-currency payouts across Africa and worldwide.
          </p>

          {/* Single Primary Action Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}>
            <a
              href="/organizer"
              onClick={(e) => { e.preventDefault(); onNavigateToWorkspace(); }}
              className="btn-cta"
              style={{ padding: '16px 36px', borderRadius: '14px', background: '#2563EB', color: '#FFF', fontSize: '15px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 24px rgba(37,99,235,0.4)', transition: 'all 0.2s ease' }}
            >
              Start Organizing Free <ArrowRight size={18} />
            </a>

            <button
              onClick={() => onNavigateToTab('manage_ticket')}
              style={{ padding: '16px 28px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
            >
              <Ticket size={18} color="#34D399" /> Manage My Tickets
            </button>
          </div>

          {/* Edge-to-Edge Showcase Interface Banner */}
          <div style={{ borderRadius: '28px', border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.8)', background: '#0D1120', textAlign: 'left' }}>
            <div style={{ background: '#07090F', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 700, marginLeft: '12px' }}>getvnt.com/events/afrobeats-2026</span>
              </div>
              <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 800, background: 'rgba(16,185,129,0.12)', padding: '3px 10px', borderRadius: '99px' }}>
                ● LIVE EVENT STREAM
              </span>
            </div>

            <div style={{ padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#F59E0B', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>LAGOS FLAGSHIP SHOWCASE</span>
                <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#FFF', margin: '8px 0 12px 0' }}>Afrobeats Worldwide Festival 2026</h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Eko Atlantic City • 3 Days of Live Performance • 15,000 Verified Delegates
                </p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700 }}>VIP PASS</span>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#F59E0B' }}>₦35,000</div>
                  </div>
                  <button onClick={() => onSelectEvent(featuredEvent)} className="btn-cta" style={{ background: '#2563EB', color: '#FFF', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '13.5px', border: 'none', cursor: 'pointer' }}>
                    Claim VIP Pass
                  </button>
                </div>
              </div>

              <div style={{ height: '220px', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                <LazyImage src={featuredEvent.banner_url} alt="Afrobeats Festival" objectFit="cover" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── EXPERIENCE BLOCK 2: ASYMMETRICAL SPLIT-SCREEN INFRASTRUCTURE SHOWCASE ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 140px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '64px', alignItems: 'center' }}>
          
          {/* Left Text Column */}
          <div>
            <span style={{ color: '#2563EB', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              HIGH-PERFORMANCE INFRASTRUCTURE
            </span>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 900, color: '#FFF', lineHeight: 1.12, marginTop: '12px', marginBottom: '24px', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
              Built for 100,000+ Attendee Gates.
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '16px', lineHeight: 1.6, marginBottom: '36px' }}>
              Say goodbye to gate congestion and fake tickets. GETVNT pairs RSA-encrypted QR pass verification with direct payout routing to Paystack, Flutterwave, and Stripe.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { title: 'Sub-500ms QR Gate Verification', desc: 'Scan passes instantly on iOS or Android with full offline validation support if Wi-Fi drops.' },
                { title: 'Direct Bank Settlement', desc: 'Ticket revenues are routed directly into your bank account with zero holdback delays.' },
                { title: 'AI Assistant Co-Pilot', desc: 'Automate sponsorship deck creation, pricing strategy, and WhatsApp attendee broadcasts.' },
              ].map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', fontWeight: 900, fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>{feature.title}</h4>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Product Interface Visual */}
          <div>
            <div style={{ background: '#0D1120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '28px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700 }}>LIVE SYSTEM RADAR</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFF' }}>Lagos Gate Scanner Lane 01</div>
                </div>
                <span style={{ fontSize: '11px', color: '#34D399', background: 'rgba(16,185,129,0.15)', padding: '4px 10px', borderRadius: '99px', fontWeight: 800 }}>
                  ● 380ms Latency
                </span>
              </div>

              {/* Simulated Scanner Interface */}
              <div style={{ background: '#000', borderRadius: '20px', border: '1px dashed rgba(37,99,235,0.4)', padding: '36px', textAlign: 'center', marginBottom: '24px' }}>
                <QrCode size={72} color="#60A5FA" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>Encrypted RSA Ticket Pass</div>
                <div style={{ fontSize: '11px', color: '#34D399', marginTop: '2px' }}>✓ Gate Check-in Verified</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '10.5px', color: '#9CA3AF', fontWeight: 700 }}>VERIFIED CHECK-INS</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>14,280 Pass</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '10.5px', color: '#9CA3AF', fontWeight: 700 }}>SETTLED GMV</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#34D399', marginTop: '2px' }}>₦48.6 Million</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── EXPERIENCE BLOCK 3: FULL-WIDTH TELEMETRY NUMBERS ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 140px auto', padding: '0 24px' }}>
        <div style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '48px 36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {[
            { label: 'Volume Processed', value: '₦12.5B+', sub: 'Direct bank settlement' },
            { label: 'Verified Tickets', value: '850,000+', sub: 'Zero fake passes' },
            { label: 'Scan Latency', value: '<500ms', sub: 'Camera & QR engine' },
            { label: 'African Markets', value: '12+', sub: 'NG, KE, ZA, GH, UK' },
          ].map((stat, idx) => (
            <div key={idx}>
              <div style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 900, color: '#FFF', letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#2563EB', marginTop: '6px' }}>{stat.label}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE BLOCK 4: NATIVE ANDROID MOBILE SHOWCASE ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 140px auto', padding: '0 24px' }}>
        <AndroidAppPromotion />
      </section>

      {/* ── EXPERIENCE BLOCK 5: IMAGE-FIRST EVENT GRID SHOWCASE ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 140px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ color: '#2563EB', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>CURATED EXPERIENCES</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: '#FFF', margin: '6px 0 0 0', fontFamily: 'var(--font-heading)' }}>
              Upcoming Events &amp; Festivals
            </h2>
          </div>

          {/* City Selector Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
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

        {/* High-Impact Image-First Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
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
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
              }}
              className="carousel-card"
            >
              <div className="carousel-banner-wrap" style={{ height: '210px' }}>
                <LazyImage src={ev.banner_url} alt={ev.title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
                <span className="badge-date">
                  {new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(7,9,15,0.85)', backdropFilter: 'blur(8px)', color: '#60A5FA', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.3)' }}>
                  {ev.category || 'General'}
                </span>
              </div>

              <div className="carousel-body">
                <div>
                  <h3 className="carousel-title" style={{ fontSize: '18px' }}>{ev.title}</h3>
                  <div className="carousel-venue" style={{ fontSize: '13px' }}>
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

      {/* ── EXPERIENCE BLOCK 6: TRANSPARENT PRICING & FAQ (Merged Clean Split Layout) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 140px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'flex-start' }}>
          
          {/* Left Column: Simple Pricing */}
          <div>
            <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
              TRANSPARENT FEES
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, color: '#FFF', marginTop: '8px', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
              Simple, Fair Platform Pricing
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { name: 'Free Events', price: '₦0', fee: '100% Free Forever', desc: 'No transaction fees or credit card requirements for free community events.' },
                { name: 'Standard Ticket OS', price: '2.5% + ₦100', fee: 'Per Paid Ticket', desc: 'Full access to mobile scanner, WhatsApp receipts, and instant bank payout.' },
                { name: 'Enterprise Custom', price: 'Custom', fee: '0% Platform Fee Available', desc: 'Designed for stadium festivals, multi-venue tours, and government expos.' },
              ].map((p, idx) => (
                <div key={idx} style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>{p.name}</h3>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#60A5FA' }}>{p.price}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 700, marginBottom: '8px' }}>{p.fee}</div>
                  <p style={{ color: '#9CA3AF', fontSize: '13.5px', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div>
            <span style={{ color: '#60A5FA', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
              FREQUENTLY ASKED
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, color: '#FFF', marginTop: '8px', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
              Everything You Need to Know
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ background: 'rgba(13,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px 24px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', margin: 0 }}>{faq.question}</h4>
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
          </div>

        </div>
      </section>

    </div>
  );
};
