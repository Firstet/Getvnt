import React from 'react';
import { X, ShieldCheck, FileText, HelpCircle, Building2, Code, Zap, RefreshCw, CheckCircle } from 'lucide-react';

interface FooterModalProps {
  type: string | null;
  onClose: () => void;
}

export const FooterModal: React.FC<FooterModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'About Getvnt Enterprise',
          subtitle: 'The Premier AI-Powered Event Business Operating System & Global Marketplace',
          icon: <Building2 size={24} color="#60A5FA" />,
          body: (
            <div>
              <p>Getvnt is an enterprise-grade event business operating system and global ticketing marketplace built for event organizers, festival promoters, and entertainment companies worldwide.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Our Mission</h4>
              <p>To empower event businesses with Stripe-grade payment reliability, Shopify-level commerce tools, and AI-driven promotion automation across Lagos, Accra, Nairobi, London, Johannesburg, and Dubai.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Core Capabilities</h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Multi-currency ticket checkout in NGN, GHS, KES, ZAR, USD, and GBP</li>
                <li>Sub-second QR code entrance scanner with offline verification</li>
                <li>AI assistant marketing campaign generator & audience segmentation</li>
                <li>Instant automated payout splits for organizers and venues</li>
              </ul>
            </div>
          )
        };

      case 'help':
        return {
          title: 'Help & Knowledge Center',
          subtitle: '24/7 Buyer Support, Ticket Recovery & Event Organizers FAQ',
          icon: <HelpCircle size={24} color="#34D399" />,
          body: (
            <div>
              <h4 style={{ color: '#FFF', marginBottom: '8px' }}>How do I retrieve my purchased ticket?</h4>
              <p>Tickets are automatically delivered to your registered email address immediately after checkout. You can also view and download your QR pass anytime under "My Tickets".</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>What if an event is postponed or cancelled?</h4>
              <p>If an event is rescheduled by the organizer, your ticket remains valid for the new date. If cancelled, Getvnt issues an automatic 100% refund to your original payment method within 3–5 business days.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Contact Support Team</h4>
              <p>Email: <strong>support@getvnt.com</strong> | WhatsApp Priority Hotline: <strong>+234 800 438 868</strong></p>
            </div>
          )
        };

      case 'privacy':
        return {
          title: 'Privacy Policy & Data Protection',
          subtitle: 'GDPR, NDPR & International Data Privacy Standards',
          icon: <ShieldCheck size={24} color="#A78BFA" />,
          body: (
            <div>
              <p>Getvnt is committed to protecting the privacy of ticket buyers and event organizers. All personal data is encrypted in transit and at rest using AES-256 standards.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Data We Collect</h4>
              <p>We collect essential account information (name, email, phone number) required to deliver digital tickets, process payments securely via Paystack/Flutterwave, and prevent fraudulent check-ins.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Your Rights</h4>
              <p>You have the full right to access, update, or request deletion of your personal data at any time by contacting our Data Protection Officer at <strong>privacy@getvnt.com</strong>.</p>
            </div>
          )
        };

      case 'terms':
        return {
          title: 'Terms of Service & Platform Governance',
          subtitle: 'Legal Terms Governing Ticket Purchases and Event Hosting',
          icon: <FileText size={24} color="#FBBF24" />,
          body: (
            <div>
              <p>By accessing Getvnt or purchasing tickets, you agree to comply with our global terms of service and acceptable use policies.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Ticket Purchase Terms</h4>
              <p>All tickets are unique digital passes containing anti-counterfeit QR security codes. Duplication, unauthorized scalping, or reselling above face value is strictly prohibited.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Organizer Responsibilities</h4>
              <p>Event organizers warrant that all event details, venues, and permits are accurate. Getvnt holds payout funds in escrow until event execution verification.</p>
            </div>
          )
        };

      case 'api':
        return {
          title: 'Developer API & Webhook Docs',
          subtitle: 'REST API, Webhook Events & SDK Integration Guides',
          icon: <Code size={24} color="#06B6D4" />,
          body: (
            <div>
              <p>Build custom checkout integrations, connect CRM tools, and receive real-time webhooks on ticket orders and check-ins.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Core API Base</h4>
              <code style={{ background: '#0D1120', color: '#06B6D4', padding: '8px 12px', borderRadius: '8px', display: 'block', marginBottom: '12px' }}>
                https://api.getvnt.com/v1/marketplace/events
              </code>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Available Webhook Triggers</h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><code>order.completed</code> — Fired when buyer completes ticket payment</li>
                <li><code>ticket.scanned</code> — Fired when scanner staff checks in attendee</li>
                <li><code>payout.processed</code> — Fired on successful payout disbursement</li>
              </ul>
            </div>
          )
        };

      case 'refunds':
        return {
          title: 'Refund & Cancellation Policy',
          subtitle: 'Guaranteed Buyer Protection & Event Cancellation Guarantee',
          icon: <RefreshCw size={24} color="#EC4899" />,
          body: (
            <div>
              <p>Getvnt stands behind every ticket sold on our platform with 100% Buyer Protection.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Full Refund Conditions</h4>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Event is officially cancelled by organizer</li>
                <li>Event is postponed and buyer cannot attend on new date</li>
                <li>Duplicate payment error during checkout processing</li>
              </ul>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>Ticket Transfer Feature</h4>
              <p>If you can no longer attend an event, you can instantly transfer your ticket pass to a friend's email free of charge directly from your account.</p>
            </div>
          )
        };

      case 'guides':
        return {
          title: 'Event Organizer Growth Guide',
          subtitle: 'How to Host & Sell Out Events in Under 10 Minutes',
          icon: <Zap size={24} color="#F59E0B" />,
          body: (
            <div>
              <h4 style={{ color: '#FFF', marginBottom: '8px' }}>1. Create Workspace &amp; Set Up Brand</h4>
              <p>Sign up on Getvnt Organizer OS, upload your logo, accent color, and custom subdomain (e.g. <code>yourbrand.getvnt.com</code>).</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>2. Build Multi-Tiered Tickets</h4>
              <p>Configure Early Bird, VIP, and General Admission ticket tiers with automatic flash drop countdown timers.</p>
              <h4 style={{ color: '#FFF', marginTop: '16px', marginBottom: '8px' }}>3. Activate AI Promotion &amp; QR Check-in</h4>
              <p>Generate high-converting social ad copy using built-in AI tools, and equip gate staff with instant QR scanning apps.</p>
            </div>
          )
        };

      default:
        return {
          title: 'Getvnt Platform Documentation',
          subtitle: 'Enterprise Event Business Operating System',
          icon: <CheckCircle size={24} color="#60A5FA" />,
          body: <p>Information for {type}. Getvnt is operating normally across all regional nodes.</p>
        };
    }
  };

  const content = getContent();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
      <div
        style={{
          background: '#0B0F19', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px',
          width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)', position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }} onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {content.icon}
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', margin: 0 }}>{content.title}</h3>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{content.subtitle}</p>
          </div>
        </div>

        <div style={{ fontSize: '13.5px', color: '#D1D5DB', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
          {content.body}
        </div>
      </div>
    </div>
  );
};
