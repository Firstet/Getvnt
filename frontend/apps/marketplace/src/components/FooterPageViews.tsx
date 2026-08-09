import React, { useState } from 'react';
import {
  Building2, HelpCircle, ShieldCheck, FileText, Code, RefreshCw, Zap,
  ChevronLeft, Search, CheckCircle2, ArrowRight, Mail, Phone, Lock, Globe,
  Terminal, ExternalLink, ShieldAlert, Cpu, Heart, Layers
} from 'lucide-react';

interface FooterPageViewProps {
  pageType: 'about' | 'help' | 'privacy' | 'terms' | 'api' | 'refunds' | 'guides' | string;
  onBackToHome: () => void;
  onOpenAuth?: () => void;
}

export const FooterPageViews: React.FC<FooterPageViewProps> = ({ pageType, onBackToHome, onOpenAuth }) => {
  const [helpSearch, setHelpSearch] = useState('');
  const [ticketRecoveryEmail, setTicketRecoveryEmail] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  const handleTicketRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverySubmitted(true);
  };

  // Render Page Content based on pageType
  const renderContent = () => {
    switch (pageType) {
      // ─────────────────────────────────────────────────────────────
      // 1. ABOUT US PAGE
      // ─────────────────────────────────────────────────────────────
      case 'about':
        return (
          <div>
            {/* Hero Header */}
            <div style={{
              backgroundImage: 'linear-gradient(135deg, rgba(13,17,32,0.85), rgba(37,99,235,0.75)), url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(37,99,235,0.4)',
              borderRadius: '28px',
              padding: '52px',
              marginBottom: '40px'
            }}>
              <button onClick={onBackToHome} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#A5B4FC', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <ChevronLeft size={16} /> Back to Explore Events
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color="#FFF" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '1px' }}>ENTERPRISE PLATFORM VISION</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '16px', lineHeight: 1.2 }}>
                About Getvnt Enterprise
              </h1>
              <p style={{ color: '#D1D5DB', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6 }}>
                Getvnt is the premier AI-powered Event Business Operating System and global ticket marketplace, engineered for high-scale event organizers, festival promoters, and venue operators across Africa and worldwide.
              </p>
            </div>

            {/* Mission & Values Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={22} color="#60A5FA" /> Global Infrastructure
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>
                  Operating across Lagos, Accra, Nairobi, Cape Town, London, Johannesburg, and Dubai, Getvnt provides instant multi-currency checkouts in NGN, GHS, KES, ZAR, USD, and GBP.
                </p>
              </div>

              <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Zap size={22} color="#FBBF24" /> AI-Powered Commerce
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>
                  From automated social ad copy generation to intelligent dynamic pricing tiers, our integrated AI Assistant suite helps organizers sell out events up to 3x faster.
                </p>
              </div>
            </div>

            {/* Core Platform Capabilities */}
            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', marginBottom: '24px' }}>Platform Capabilities</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Sub-Second Scanner', desc: 'Offline-capable mobile gate scanner app for rapid entrance validation.' },
                  { title: 'Ticket Designer Desk', desc: 'Custom canvas with anti-counterfeit QR watermarking & PDF passes.' },
                  { title: 'Instant Payout Splits', desc: 'Automated multi-party revenue distribution for venues and co-organizers.' },
                  { title: 'Attendee CRM & Loyalty', desc: 'LTV tracking, automated reward points, and VIP pass flash drops.' }
                ].map((cap, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#60A5FA', marginBottom: '6px' }}>{cap.title}</h4>
                    <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.5 }}>{cap.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      // 2. HELP & KNOWLEDGE CENTER PAGE
      // ─────────────────────────────────────────────────────────────
      case 'help':
        return (
          <div>
            {/* Hero Header */}
            <div style={{
              backgroundImage: 'linear-gradient(135deg, rgba(13,17,32,0.85), rgba(16,185,129,0.75)), url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: '28px',
              padding: '52px',
              marginBottom: '40px'
            }}>
              <button onClick={onBackToHome} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#34D399', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <ChevronLeft size={16} /> Back to Explore Events
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HelpCircle size={20} color="#FFF" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#34D399', textTransform: 'uppercase', letterSpacing: '1px' }}>24/7 CUSTOMER SUPPORT & FAQ</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '16px', lineHeight: 1.2 }}>
                Help &amp; Knowledge Center
              </h1>
              
              {/* Search Bar */}
              <div style={{ position: 'relative', maxWidth: '600px', marginTop: '24px' }}>
                <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="search-field"
                  placeholder="Search articles, ticket retrieval, refunds, gate scanning..."
                  value={helpSearch}
                  onChange={(e) => setHelpSearch(e.target.value)}
                  style={{ paddingLeft: '44px', width: '100%', fontSize: '14px', height: '48px' }}
                />
              </div>
            </div>

            {/* Instant Ticket Retrieval Card */}
            <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '24px', padding: '36px', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '8px' }}>
                🎟️ Instant Ticket Recovery Tool
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                Can't find your confirmation email? Enter your purchase email below to re-send your QR tickets.
              </p>
              {recoverySubmitted ? (
                <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34D399', padding: '16px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={20} /> Success! Ticket recovery link sent to {ticketRecoveryEmail}. Please check your inbox &amp; spam folder.
                </div>
              ) : (
                <form onSubmit={handleTicketRecovery} style={{ display: 'flex', gap: '12px', maxWidth: '540px' }}>
                  <input
                    type="email"
                    required
                    className="search-field"
                    placeholder="Enter your ticket order email..."
                    value={ticketRecoveryEmail}
                    onChange={(e) => setTicketRecoveryEmail(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn-cta" style={{ background: '#4F46E5', color: '#FFF' }}>
                    Re-send Ticket <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Knowledge Base FAQs */}
            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px', alignItems: 'start' }}>
                {[
                  { q: 'What is GETVNT?', a: 'GETVNT is Africa\'s AI-powered Event Operating System. We give organizers tools to create events, sell tickets online, build branded event websites, verify attendees, scan QR passes offline, and manage bank payouts—all in one dashboard.' },
                  { q: 'Is it free to create and sell events on GETVNT?', a: 'Yes. Anyone can create an account and list unlimited free or paid events with zero monthly subscription fees.' },
                  { q: 'What fees does GETVNT charge on ticket sales?', a: 'GETVNT charges a flat 5% platform fee on every paid ticket sold. Free events are 100% free with zero platform fees.' },
                  { q: 'Are payment gateway transaction fees separate?', a: 'Yes. Payment processors (Paystack, Flutterwave, Stripe) charge approximately 1.5% per transaction separately for secure payment processing.' },
                  { q: 'How do organizers receive payouts?', a: 'Revenues are automatically settled into your connected bank account or GETVNT wallet according to automated disbursal rules.' },
                  { q: 'How long do payouts take after an event?', a: 'Standard payouts process within 24 hours of ticket sales. Verified Trusted Organizers can also activate instant wallet disbursals in their Organizer OS dashboard.' },
                  { q: 'What is a Trusted Organizer?', a: 'A Trusted Organizer is a verified event promoter who has completed government ID, selfie biometrics, and bank verification, earning a verified badge and priority search ranking.' },
                  { q: 'Why do organizers need to verify identity?', a: 'Verification protects ticket buyers from fraudulent events, ensures ticket authenticity, and enables secure bank disbursals.' },
                  { q: 'Which government IDs are accepted for verification?', a: 'We accept National Identity Number (NIN), International Passport, Driver\'s License, and Voter\'s Card.' },
                  { q: 'How long does identity verification take?', a: 'Verification is powered by AI and usually completes in under 2 minutes. If manual review is required, our compliance team approves applications within 12 hours.' },
                  { q: 'Can I build my own branded event website?', a: 'Yes. You can create a full multi-page event website using our Website Builder OS with 12 specialized category templates.' },
                  { q: 'Can I use my own custom domain?', a: 'Yes. You can host your event website on a free subdomain (organizername.getvnt.com) or connect your custom domain (www.myfestival.com) with automated SSL certificates.' },
                  { q: 'How are tickets validated at the venue?', a: 'Every ticket includes an encrypted digital QR code that gate staff scan using the GETVNT Android Scanner App in under 500ms.' },
                  { q: 'Can I scan tickets without internet connectivity?', a: 'Yes. The GETVNT Android App supports offline RSA-encrypted QR validation that syncs automatically once internet connection is restored.' },
                  { q: 'Can attendees transfer their tickets to someone else?', a: 'Yes. Attendees can securely transfer digital QR tickets to friends or colleagues directly from their GETVNT attendee portal.' },
                  { q: 'How do refunds work and who sets the refund policy?', a: 'Event organizers set their own refund policies. Organizers can process instant full or partial refunds directly from their Organizer OS dashboard.' },
                  { q: 'Can teams manage an organizer account together?', a: 'Yes. You can invite team members to your workspace with role-based access for gate scanners, accountants, and co-organizers.' },
                  { q: 'Is payment information secure on GETVNT?', a: 'Yes. All checkout transactions are PCI-DSS Level 1 compliant and encrypted with 256-bit SSL.' },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#60A5FA', marginBottom: '8px' }}>
                      {idx + 1}. {item.q}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#D1D5DB', lineHeight: 1.65, margin: 0 }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      // 3. PRIVACY POLICY PAGE
      // ─────────────────────────────────────────────────────────────
      case 'privacy':
        return (
          <div>
            <div style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(37,99,235,0.15))', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '28px', padding: '48px', marginBottom: '40px' }}>
              <button onClick={onBackToHome} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#C084FC', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <ChevronLeft size={16} /> Back to Explore Events
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="#FFF" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '1px' }}>DATA PROTECTION & COMPLIANCE</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '16px', lineHeight: 1.2 }}>
                Privacy Policy &amp; Security Standards
              </h1>
              <p style={{ color: '#D1D5DB', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6 }}>
                Getvnt is committed to protecting your personal data in accordance with GDPR, NDPR, and global ISO/IEC 27001 data privacy standards.
              </p>
            </div>

            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', lineHeight: 1.7, fontSize: '14px', color: '#D1D5DB' }}>
              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '12px' }}>1. Data We Collect</h3>
              <p style={{ marginBottom: '20px' }}>When you register or purchase event tickets on Getvnt, we collect necessary identifying information including your name, email address, phone number, and transaction logs required to issue digital QR passes.</p>

              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '12px' }}>2. Encryption &amp; Payment Security</h3>
              <p style={{ marginBottom: '20px' }}>Getvnt never stores raw payment card numbers. All financial transactions are processed directly via PCI-DSS Level 1 compliant gateways (Paystack, Flutterwave, Stripe) utilizing end-to-end TLS 1.3 encryption.</p>

              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '12px' }}>3. Data Subject Rights</h3>
              <p style={{ marginBottom: '20px' }}>You retain full rights to request a copy of your personal telemetry data or request complete account erasure by contacting our DPO at <strong>privacy@getvnt.com</strong>.</p>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      // 4. TERMS OF SERVICE PAGE
      // ─────────────────────────────────────────────────────────────
      case 'terms':
        return (
          <div>
            <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.15))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '28px', padding: '48px', marginBottom: '40px' }}>
              <button onClick={onBackToHome} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#FBBF24', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <ChevronLeft size={16} /> Back to Explore Events
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color="#FFF" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '1px' }}>PLATFORM GOVERNANCE AGREEMENT</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '16px', lineHeight: 1.2 }}>
                Terms of Service
              </h1>
              <p style={{ color: '#D1D5DB', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6 }}>
                These legal terms govern ticket sales, venue check-ins, attendee conduct, and organizer operations across Getvnt.
              </p>
            </div>

            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', lineHeight: 1.7, fontSize: '14px', color: '#D1D5DB' }}>
              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '12px' }}>1. Anti-Scalping &amp; Ticket Validity</h3>
              <p style={{ marginBottom: '20px' }}>Tickets purchased on Getvnt are unique digital passes containing dynamic encrypted QR watermarks. Reselling tickets above face value or duplicating barcodes is strictly illegal and will result in ticket revocation without refund.</p>

              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '12px' }}>2. Event Hosting &amp; Escrow Rules</h3>
              <p style={{ marginBottom: '20px' }}>Event organizers warrant that all venue licenses and safety permits are valid. Getvnt holds payout revenue in escrow until event execution verification to protect buyer funds.</p>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      // 5. DEVELOPER API & WEBHOOKS PAGE
      // ─────────────────────────────────────────────────────────────
      case 'api':
        return (
          <div>
            <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(37,99,235,0.15))', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '28px', padding: '48px', marginBottom: '40px' }}>
              <button onClick={onBackToHome} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#22D3EE', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <ChevronLeft size={16} /> Back to Explore Events
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code size={20} color="#FFF" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '1px' }}>REST API & WEBHOOK INTEGRATIONS</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '16px', lineHeight: 1.2 }}>
                Developer API &amp; Webhooks Studio
              </h1>
              <p style={{ color: '#D1D5DB', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6 }}>
                Build custom ticketing widgets, connect CRM tools, and listen for real-time webhooks on ticket orders and gate check-ins.
              </p>
            </div>

            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px' }}>
              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '16px' }}>Core REST API Endpoint</h3>
              <div style={{ background: '#07090F', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '14px', padding: '16px', fontFamily: 'monospace', color: '#22D3EE', fontSize: '14px', marginBottom: '28px' }}>
                GET https://api.getvnt.com/v1/marketplace/events
              </div>

              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '16px' }}>Webhook Events</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <code style={{ color: '#34D399', fontWeight: 800 }}>order.completed</code>
                  <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '6px' }}>Fired immediately after buyer completes payment.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <code style={{ color: '#60A5FA', fontWeight: 800 }}>ticket.scanned</code>
                  <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '6px' }}>Fired when door staff scans ticket QR code.</p>
                </div>
              </div>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      // 6. REFUND POLICY PAGE
      // ─────────────────────────────────────────────────────────────
      case 'refunds':
        return (
          <div>
            <div style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.18), rgba(245,158,11,0.15))', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '28px', padding: '48px', marginBottom: '40px' }}>
              <button onClick={onBackToHome} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#F472B6', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <ChevronLeft size={16} /> Back to Explore Events
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RefreshCw size={20} color="#FFF" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#F472B6', textTransform: 'uppercase', letterSpacing: '1px' }}>100% BUYER GUARANTEE</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '16px', lineHeight: 1.2 }}>
                Refund &amp; Cancellation Policy
              </h1>
              <p style={{ color: '#D1D5DB', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6 }}>
                Getvnt stands behind every ticket sold on our platform with automated buyer protection.
              </p>
            </div>

            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', lineHeight: 1.7, fontSize: '14px', color: '#D1D5DB' }}>
              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '12px' }}>1. Full Refund Guarantee</h3>
              <p style={{ marginBottom: '20px' }}>If an event is cancelled by the organizer, Getvnt automatically processes a 100% full refund to your original payment card within 3–5 business days without requiring support tickets.</p>

              <h3 style={{ fontSize: '20px', color: '#FFF', fontWeight: 800, marginBottom: '12px' }}>2. Free Ticket Transfer</h3>
              <p style={{ marginBottom: '20px' }}>Can't make it to an event? You can transfer your ticket pass to a friend's email address free of charge directly from your account page anytime up to 1 hour before event start.</p>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────
      // 7. ORGANIZER GUIDE PAGE
      // ─────────────────────────────────────────────────────────────
      case 'guides':
        return (
          <div>
            <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(16,185,129,0.15))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '28px', padding: '48px', marginBottom: '40px' }}>
              <button onClick={onBackToHome} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#FBBF24', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                <ChevronLeft size={16} /> Back to Explore Events
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} color="#FFF" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '1px' }}>ORGANIZER PLAYBOOK</span>
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#FFF', marginBottom: '16px', lineHeight: 1.2 }}>
                Event Organizer Growth Guide
              </h1>
              <p style={{ color: '#D1D5DB', fontSize: '16px', maxWidth: '720px', lineHeight: 1.6 }}>
                Learn how top promoters and event businesses launch, promote, and sell out events using Getvnt AI Operating System.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FBBF24', marginBottom: '8px' }}>1. Custom Branding &amp; Subdomain</h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>
                  Set up your brand colors, upload high-res banners, and configure your branded subdomain (e.g. <code>yourbrand.getvnt.com</code>).
                </p>
              </div>
              <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8', marginBottom: '8px' }}>2. AI Social Ad Generator</h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>
                  Use the integrated AI Assistant to generate high-converting Instagram, TikTok, and email campaign copy in seconds.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ fontSize: '28px', color: '#FFF', fontWeight: 900 }}>Page Not Found</h2>
            <button onClick={onBackToHome} className="btn-cta" style={{ background: '#2563EB', color: '#FFF', marginTop: '20px' }}>
              Return to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '24px 28px' }}>
      {renderContent()}
    </div>
  );
};
