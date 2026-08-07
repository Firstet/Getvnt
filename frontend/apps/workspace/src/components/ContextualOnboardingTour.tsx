import React, { useState, useEffect } from 'react';
import {
  Sparkles, X, ChevronRight, ChevronLeft, Check, Play, RotateCcw,
  CheckCircle2, ArrowRight, Bot, Compass, ShieldCheck
} from 'lucide-react';

export interface TourStep {
  id: string;
  targetId: string;
  tabId: string;
  title: string;
  description: string;
  whyItMatters: string;
  bestPractice: string;
  aiTip?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    targetId: 'executive-summary-card',
    tabId: 'dashboard',
    title: 'Executive AI Summary & Command Bar',
    description: 'This is your executive cockpit. GETVNT AI synthesizes real-time ticket sales, revenue velocity, and attendee check-ins into actionable recommendations.',
    whyItMatters: 'Saves organizers hours of data analysis by predicting sales trends and optimal marketing windows.',
    bestPractice: 'Review your AI recommendation daily before launching promo blasts.',
    aiTip: 'Click "Launch Campaign" to generate automated email and SMS copy.',
  },
  {
    id: 'event_wizard',
    targetId: 'launcher-create-event',
    tabId: 'dashboard',
    title: '7-Step Guided Event Creation Wizard',
    description: 'Launch new events in minutes with our 7-step wizard. Configures basic details, ticket tiers, venue specs, website template, and AI marketing copy.',
    whyItMatters: 'Guarantees no critical event configuration detail is missed before ticket sales go live.',
    bestPractice: 'Use USD or NGN multi-currency options for international ticket buyers.',
    aiTip: 'Let GETVNT AI write your event tagline and description automatically.',
  },
  {
    id: 'qr_studio',
    targetId: 'nav-qr_studio',
    tabId: 'qr_studio',
    title: 'Branded QR Gate & Scanning Studio',
    description: 'Generate high-security encrypted QR codes for physical tickets, VIP badges, and mobile check-in scanning at venue gates.',
    whyItMatters: 'Prevents ticket duplication, scalping, and fraud with dynamic time-decay security keys.',
    bestPractice: 'Download offline scanner configuration before heading to remote venues.',
    aiTip: 'Ask AI to generate custom branded QR frames with your event logo.',
  },
  {
    id: 'ticket_designer',
    targetId: 'nav-ticket_designer',
    tabId: 'ticket_designer',
    title: 'Visual Drag & Drop Ticket Designer',
    description: 'Design print-ready PDF and digital mobile tickets with custom layers, snap-to-grid alignment, bleed safety guides, and sponsor watermarks.',
    whyItMatters: 'Provides attendees with a stunning luxury souvenir ticket while showcasing key event sponsors.',
    bestPractice: 'Keep QR code placed at least 15mm away from ticket borders for fast camera scanning.',
    aiTip: 'Select from 10 editable ticket templates for corporate, concert, or festival themes.',
  },
  {
    id: 'website_builder',
    targetId: 'nav-website_builder',
    tabId: 'website_builder',
    title: 'Event Website Builder & CMS Engine',
    description: 'Build high-converting event websites with custom domain routing (event.mybrand.com), SEO metadata controls, and drag-and-drop CMS sections.',
    whyItMatters: 'A dedicated branded website increases ticket conversion rate by over 34%.',
    bestPractice: 'Enable Pro tier for custom domain mapping and multi-page CMS.',
    aiTip: 'Generate custom website color schemes based on your brand palette.',
  },
  {
    id: 'crm',
    targetId: 'nav-crm',
    tabId: 'crm',
    title: 'Attendee CRM & Loyalty Intelligence',
    description: 'Track attendee purchasing history, VIP tier statuses, check-in timestamps, and engagement scores across all past events.',
    whyItMatters: 'Identifies your top 10% repeat ticket buyers for exclusive early-bird invitations.',
    bestPractice: 'Export segmented contact lists directly into email and WhatsApp campaigns.',
    aiTip: 'AI automatically flags churn risks and recommends personalized discount rewards.',
  },
  {
    id: 'marketing',
    targetId: 'nav-marketing',
    tabId: 'marketing',
    title: 'Marketing Automation & AI Insights',
    description: 'Run automated email, SMS, and social media ad campaigns with built-in conversion pixel tracking and revenue attribution.',
    whyItMatters: 'Ensures marketing spend is allocated to high-converting channels.',
    bestPractice: 'Schedule automated SMS reminders 2 hours prior to doors opening.',
    aiTip: 'Ask AI to generate viral social media blurbs for Instagram, X, and LinkedIn.',
  },
  {
    id: 'billing',
    targetId: 'nav-billing',
    tabId: 'billing',
    title: 'Billing, Invoices & Payout Settlements',
    description: 'Manage subscription plans, commission rates, automated tax compliance, and instant bank payout settlements.',
    whyItMatters: 'Keep complete financial oversight with downloadable PDF invoices.',
    bestPractice: 'Connect Paystack or Stripe keys for direct instant ticket revenue payouts.',
    aiTip: 'Upgrade to Enterprise plan for custom zero-commission pricing.',
  },
  {
    id: 'ai_assistant',
    targetId: 'nav-ai_assistant',
    tabId: 'ai_assistant',
    title: 'Conversational Workspace AI Suite',
    description: 'Your 24/7 AI co-pilot. Ask any question about event operations, market trends, revenue velocity, or platform configurations.',
    whyItMatters: 'Provides instant operational help without waiting for support tickets.',
    bestPractice: 'Use floating, docked sidebar, or full-screen mode depending on your workflow.',
    aiTip: 'Type "Generate Sponsorship Deck" to auto-create PDF sponsor decks.',
  },
  {
    id: 'settings',
    targetId: 'nav-settings',
    tabId: 'settings',
    title: 'Organization Settings & Team Roles',
    description: 'Configure your company profile, tenant custom domain, security audit logs, and granular RBAC team permissions.',
    whyItMatters: 'Protects financial data and event permissions across team members.',
    bestPractice: 'Assign "Gate Scanner" role to temporary venue check-in staff.',
    aiTip: 'Verify API keys and webhook secrets for custom backend integrations.',
  },
];

interface Props {
  isActive: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
  onToast: (msg: string) => void;
}

export const ContextualOnboardingTour: React.FC<Props> = ({
  isActive,
  onClose,
  onNavigateToTab,
  onToast,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    const saved = localStorage.getItem('getvnt_contextual_tour_step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(true);
  const [checklist, setChecklist] = useState([
    { id: 'profile', label: 'Complete Organization Profile', done: true },
    { id: 'wizard', label: 'Launch Guided Event Wizard', done: false },
    { id: 'ticket', label: 'Design Custom Ticket Badge', done: false },
    { id: 'website', label: 'Select Website Preset Template', done: false },
    { id: 'qr', label: 'Scan Test Ticket QR Code', done: false },
    { id: 'payout', label: 'Connect Bank Payment Gateway', done: false },
  ]);

  const step = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  useEffect(() => {
    if (isActive && step) {
      // Auto navigate tab
      onNavigateToTab(step.tabId);
      localStorage.setItem('getvnt_contextual_tour_step', currentStepIndex.toString());
    }
  }, [isActive, currentStepIndex]);

  if (!isActive) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      localStorage.setItem('getvnt_contextual_tour_completed', 'true');
      onToast('🎉 Contextual Product Tour Completed! Replay anytime from top header.');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  return (
    <>
      {/* ── 1. SPOTLIGHT NON-BLOCKING OVERLAY ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9980,
          background: 'rgba(5, 8, 18, 0.45)',
          backdropFilter: 'blur(3px)',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      />

      {/* ── 2. FLOATING CONTEXTUAL TOOLTIP CARD ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9990,
          maxWidth: '560px',
          width: '92%',
          background: 'linear-gradient(135deg, #0D1222 0%, #070A14 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          padding: '24px 28px',
          color: '#FFF',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(37, 99, 235, 0.25)',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Step Indicator & Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '4px 10px', background: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(37, 99, 235, 0.4)', borderRadius: '99px', fontSize: '11px', fontWeight: 900, color: '#38BDF8' }}>
              STEP {currentStepIndex + 1} OF {TOUR_STEPS.length}
            </div>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>• {step.tabId.toUpperCase()}</span>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }} title="Close Tour">
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={20} color="#38BDF8" /> {step.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '13.5px', color: '#D1D5DB', lineHeight: '1.55', marginBottom: '14px' }}>
          {step.description}
        </p>

        {/* Best Practice Tip Chip */}
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '10px 14px', marginBottom: '18px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <ShieldCheck size={16} color="#34D399" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.4' }}>
            <strong style={{ color: '#34D399' }}>Best Practice:</strong> {step.bestPractice}
          </div>
        </div>

        {/* AI Tip Action */}
        {step.aiTip && (
          <div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bot size={15} color="#38BDF8" /> {step.aiTip}
          </div>
        )}

        {/* Navigation Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: currentStepIndex === 0 ? '#64748B' : '#FFF', padding: '8px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 800, cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', padding: '8px 12px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFF', padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour 🎉' : 'Next Step'} <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. PERSISTENT ONBOARDING CHECKLIST WIDGET ── */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9990,
          background: 'rgba(13, 18, 34, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '16px 20px',
          width: '280px',
          color: '#FFF',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#34D399" /> Setup Checklist
          </div>
          <button onClick={() => setIsChecklistOpen(!isChecklistOpen)} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
            {isChecklistOpen ? 'Hide' : 'Show'}
          </button>
        </div>

        {isChecklistOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: item.done ? '#94A3B8' : '#FFF',
                  textDecoration: item.done ? 'line-through' : 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: `1px solid ${item.done ? '#10B981' : 'rgba(255,255,255,0.3)'}`, background: item.done ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.done && <Check size={12} color="#FFF" />}
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
