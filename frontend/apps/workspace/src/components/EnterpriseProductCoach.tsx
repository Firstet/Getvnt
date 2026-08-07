import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, X, ChevronRight, ChevronLeft, Check, Play, RotateCcw,
  CheckCircle2, ArrowRight, Bot, Compass, ShieldCheck, ArrowUpRight,
  MousePointer, Zap, Award
} from 'lucide-react';

export interface CoachStep {
  id: string;
  targetId: string;
  tabId: string;
  title: string;
  description: string;
  whyItMatters: string;
  actionText: string;
  aiPrompt?: string;
  demoAction?: () => void;
}

const COACH_STEPS: CoachStep[] = [
  {
    id: 'dashboard',
    targetId: 'executive-summary-card',
    tabId: 'dashboard',
    title: 'Executive Intelligence Bar',
    description: 'GETVNT AI synthesizes live sales velocity, attendance rates, and payout telemetry into real-time operational advice.',
    whyItMatters: 'Predicts high-ticket demand days so you know exactly when to boost marketing campaigns.',
    actionText: 'Inspect AI Recommendation',
    aiPrompt: 'Explain how ticket revenue velocity is calculated.',
  },
  {
    id: 'event_wizard',
    targetId: 'launcher-create-event',
    tabId: 'dashboard',
    title: '7-Step Guided Event Wizard',
    description: 'Click "Create Event Wizard" to configure basic details, ticket tiers, venue capacity, website preset, and AI copy.',
    whyItMatters: 'Guarantees your event is 100% configured and published to GETVNT Global Marketplace in under 3 minutes.',
    actionText: 'Click "Create Event Wizard"',
    aiPrompt: 'Help me draft an event title and tagline for my festival.',
  },
  {
    id: 'qr_studio',
    targetId: 'nav-qr_studio',
    tabId: 'qr_studio',
    title: 'Branded QR Gate & Scanner Studio',
    description: 'Generate dynamic time-decay QR tickets and access control keys for venue scanners and VIP gate check-ins.',
    whyItMatters: 'Eliminates ticket duplication, scalping, and gate bottlenecks with encrypted offline scanning.',
    actionText: 'Open QR Studio',
    aiPrompt: 'How do offline QR scanners sync with GETVNT cloud?',
  },
  {
    id: 'ticket_designer',
    targetId: 'nav-ticket_designer',
    tabId: 'ticket_designer',
    title: 'Visual Drag & Drop Ticket Designer',
    description: 'Design print-ready PDF and digital mobile tickets with custom layers, bleed guides, and sponsor logos.',
    whyItMatters: 'Provides attendees with a collectible souvenir ticket while increasing sponsor visibility.',
    actionText: 'Explore Ticket Templates',
    aiPrompt: 'What is the optimal QR code size for print tickets?',
  },
  {
    id: 'website_builder',
    targetId: 'nav-website_builder',
    tabId: 'website_builder',
    title: 'Event Website Builder & CMS',
    description: 'Build high-converting event landing pages with custom domain routing (event.mybrand.com) and 10 preset themes.',
    whyItMatters: 'A dedicated branded event website increases checkout conversion rate by 34%.',
    actionText: 'Open Website Builder',
    aiPrompt: 'Generate a color palette for a tech conference.',
  },
  {
    id: 'crm',
    targetId: 'nav-crm',
    tabId: 'crm',
    title: 'Attendee CRM & VIP Intelligence',
    description: 'Track attendee purchasing history, check-in timestamps, loyalty points, and churn risk scores.',
    whyItMatters: 'Identifies your top 10% repeat ticket buyers for exclusive presale access.',
    actionText: 'View Attendee CRM',
    aiPrompt: 'How can I send automated loyalty rewards to VIP buyers?',
  },
  {
    id: 'marketing',
    targetId: 'nav-marketing',
    tabId: 'marketing',
    title: 'Marketing Automation & AI Copy',
    description: 'Launch email, SMS, and WhatsApp promo blasts with integrated pixel tracking and revenue attribution.',
    whyItMatters: 'Ensures marketing spend is allocated to the highest-converting traffic sources.',
    actionText: 'Launch AI Campaign',
    aiPrompt: 'Write an urgent 24-hour flash sale SMS message.',
  },
  {
    id: 'billing',
    targetId: 'nav-billing',
    tabId: 'billing',
    title: 'Billing, Invoices & Payout Settlements',
    description: 'Manage subscription tiers, zero-commission rules, tax settings, and instant bank payouts.',
    whyItMatters: 'Maintains complete financial transparency with downloadable PDF invoices.',
    actionText: 'Inspect Billing Settings',
    aiPrompt: 'How do instant bank payout settlements work?',
  },
  {
    id: 'ai_assistant',
    targetId: 'nav-ai_assistant',
    tabId: 'ai_assistant',
    title: 'Conversational Workspace AI Suite',
    description: 'Your 24/7 AI operational co-pilot for drafting sponsorship decks, resolving queries, and managing events.',
    whyItMatters: 'Get immediate operational answers without waiting on support tickets.',
    actionText: 'Open AI Assistant',
    aiPrompt: 'Create a sponsorship deck outline for a 5,000-person summit.',
  },
  {
    id: 'settings',
    targetId: 'nav-settings',
    tabId: 'settings',
    title: 'Organization Settings & Team Roles',
    description: 'Configure tenant profile, custom subdomains, security audit logs, and RBAC team permissions.',
    whyItMatters: 'Safeguards financial permissions across team members and gate staff.',
    actionText: 'Review Workspace Roles',
    aiPrompt: 'What permissions should I assign to temporary gate staff?',
  },
];

interface Props {
  isActive: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
  onToast: (msg: string) => void;
  onOpenWizard?: () => void;
}

export const EnterpriseProductCoach: React.FC<Props> = ({
  isActive,
  onClose,
  onNavigateToTab,
  onToast,
  onOpenWizard,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    const saved = localStorage.getItem('getvnt_coach_step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [checklist, setChecklist] = useState([
    { id: 'profile', label: 'Complete Organization Profile', done: true },
    { id: 'wizard', label: 'Launch 7-Step Event Wizard', done: false },
    { id: 'ticket', label: 'Design Custom Ticket Badge', done: false },
    { id: 'website', label: 'Select Website Preset Template', done: false },
    { id: 'qr', label: 'Test QR Gate Check-in Scanner', done: false },
    { id: 'payout', label: 'Connect Direct Bank Payouts', done: false },
  ]);

  const step = COACH_STEPS[currentStepIndex] || COACH_STEPS[0];

  // Auto-scroll and target rect update
  useEffect(() => {
    if (!isActive) return;

    // Navigate to tab automatically
    onNavigateToTab(step.tabId);
    localStorage.setItem('getvnt_coach_step', currentStepIndex.toString());

    // Update target rect with retry
    const updateRect = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    const timer = setTimeout(updateRect, 300);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [isActive, currentStepIndex]);

  if (!isActive) return null;

  const handleNext = () => {
    if (currentStepIndex < COACH_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      localStorage.setItem('getvnt_coach_completed', 'true');
      setIsFinished(true);
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
      {/* ── 1. SPOTLIGHT RING OVERLAY ── */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: '16px',
            border: '2px solid #2563EB',
            boxShadow: '0 0 0 9999px rgba(5, 8, 18, 0.55), 0 0 25px rgba(37, 99, 235, 0.6)',
            zIndex: 9980,
            pointerEvents: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Animated Pulsing Pointer Arrow */}
          <div
            style={{
              position: 'absolute',
              top: '-32px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 900,
              fontSize: '11px',
              background: '#0D1222',
              padding: '4px 10px',
              borderRadius: '99px',
              border: '1px solid #2563EB',
              animation: 'bounce 1s infinite alternate',
            }}
          >
            <MousePointer size={14} color="#38BDF8" /> CLICK HERE
          </div>
        </div>
      )}

      {/* ── 2. CONTEXTUAL FLOATING TOOLTIP CARD ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9990,
          maxWidth: '540px',
          width: '92%',
          background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          padding: '24px 28px',
          color: '#FFF',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(37, 99, 235, 0.3)',
        }}
      >
        {/* Header & Step Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '4px 10px', background: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(37, 99, 235, 0.4)', borderRadius: '99px', fontSize: '11px', fontWeight: 900, color: '#38BDF8' }}>
              LESSON {currentStepIndex + 1} OF {COACH_STEPS.length}
            </div>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 800 }}>• {step.tabId.toUpperCase()}</span>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#38BDF8" /> {step.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '13.5px', color: '#D1D5DB', lineHeight: '1.55', marginBottom: '14px' }}>
          {step.description}
        </p>

        {/* Why It Matters */}
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <ShieldCheck size={16} color="#34D399" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: '1.4' }}>
            <strong style={{ color: '#34D399' }}>Why It Matters:</strong> {step.whyItMatters}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: currentStepIndex === 0 ? '#64748B' : '#FFF', padding: '8px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 800, cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {step.id === 'event_wizard' && onOpenWizard && (
              <button
                onClick={() => { onOpenWizard(); handleNext(); }}
                className="btn-cta"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', padding: '8px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 900 }}
              >
                🚀 Open Wizard Now
              </button>
            )}

            <button
              onClick={handleNext}
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFF', padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {currentStepIndex === COACH_STEPS.length - 1 ? 'Finish Tour 🎉' : 'Next Lesson'} <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. PERSISTENT SETUP CHECKLIST WIDGET ── */}
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
            <Award size={16} color="#FBBF24" /> Setup Checklist
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

      {/* ── 4. CELEBRATION FINISH MODAL ── */}
      {isFinished && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5, 8, 18, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '28px', maxWidth: '520px', width: '100%', padding: '40px 32px', textAlign: 'center', color: '#FFF', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Sparkles size={36} color="#34D399" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', marginBottom: '8px' }}>🎉 Congratulations!</h2>
            <p style={{ color: '#D1D5DB', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '28px' }}>
              Your GETVNT Organizer Workspace is now fully configured. You are ready to launch your first event and start selling tickets globally!
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setIsFinished(false); onClose(); if (onOpenWizard) onOpenWizard(); }}
                className="btn-cta"
                style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFF', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 900 }}
              >
                🚀 Create First Event
              </button>

              <button
                onClick={() => { setIsFinished(false); onClose(); onNavigateToTab('dashboard'); }}
                className="btn-cta btn-cta-ghost"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', padding: '12px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 800 }}
              >
                Enter Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
