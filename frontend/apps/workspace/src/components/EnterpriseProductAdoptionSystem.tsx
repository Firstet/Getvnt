import React, { useState, useEffect } from 'react';
import {
  Sparkles, X, ChevronRight, ChevronLeft, Check, Play, RotateCcw,
  CheckCircle2, ArrowRight, Bot, Compass, ShieldCheck, MousePointer,
  Zap, Award, HelpCircle, Eye, Flame, Layers
} from 'lucide-react';

export interface TourModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: AdoptionStep[];
}

export interface AdoptionStep {
  id: string;
  targetId: string;
  tabId: string;
  title: string;
  description: string;
  actionRequired: string;
  whyItMatters: string;
  aiPrompt?: string;
  autoOpenWizard?: boolean;
}

export const MODULE_TOURS: TourModule[] = [
  {
    id: 'overview',
    name: '1. Workspace Overview & Dashboard',
    icon: '📊',
    description: 'Master your executive cockpit, telemetry widgets, and AI sales velocity recommendations.',
    steps: [
      {
        id: 'dash_summary',
        targetId: 'executive-summary-card',
        tabId: 'dashboard',
        title: 'Executive AI Recommendation Bar',
        description: 'GETVNT AI synthesizes live sales velocity, attendance rates, and revenue telemetry into actionable tips.',
        actionRequired: 'Inspect the AI Executive Recommendation card',
        whyItMatters: 'Predicts high-ticket demand days so you know when to blast marketing campaigns.',
        aiPrompt: 'Explain how ticket revenue velocity is calculated.',
      },
      {
        id: 'dash_launchers',
        targetId: 'launcher-create-event',
        tabId: 'dashboard',
        title: 'Enterprise Operating Launchers',
        description: 'Instant 1-click action buttons to launch the Event Wizard, Ticket Designer, Website Builder, and QR Studio.',
        actionRequired: 'Click "Create Event Wizard" to start',
        whyItMatters: 'Saves time by providing direct shortcuts to all core platform operations.',
        aiPrompt: 'Show me quick actions available for my event.',
      },
    ],
  },
  {
    id: 'event_wizard',
    name: '2. 7-Step Guided Event Creation',
    icon: '🚀',
    description: 'Configure event details, ticket tiers, venue capacity, website preset, and AI copy.',
    steps: [
      {
        id: 'wiz_launch',
        targetId: 'launcher-create-event',
        tabId: 'dashboard',
        title: 'Launch 7-Step Guided Wizard',
        description: 'Click "Create Event Wizard" to open the step-by-step event publishing console.',
        actionRequired: 'Click "Create Event Wizard"',
        whyItMatters: 'Ensures no critical event detail is missed before ticket sales go live.',
        autoOpenWizard: true,
        aiPrompt: 'Help me draft an event title and tagline for my festival.',
      },
    ],
  },
  {
    id: 'qr_studio',
    name: '3. Branded QR Gate & Check-in Studio',
    icon: '📱',
    description: 'Generate high-security encrypted QR codes and offline scanner credentials for venue gate staff.',
    steps: [
      {
        id: 'qr_scan',
        targetId: 'nav-qr_studio',
        tabId: 'qr_studio',
        title: 'QR Ticket Gate & Check-in Studio',
        description: 'Generate time-decay security QR codes for physical tickets, VIP badges, and mobile gate check-ins.',
        actionRequired: 'Open QR Check-in Studio',
        whyItMatters: 'Eliminates ticket duplication, scalping, and gate bottlenecks with encrypted offline scanning.',
        aiPrompt: 'How do offline QR scanners sync with GETVNT cloud?',
      },
    ],
  },
  {
    id: 'ticket_designer',
    name: '4. Drag & Drop Ticket Designer Desk',
    icon: '🎟️',
    description: 'Design print-ready PDF and digital mobile tickets with custom layers, bleed guides, and sponsor logos.',
    steps: [
      {
        id: 'ticket_desk',
        targetId: 'nav-ticket_designer',
        tabId: 'ticket_designer',
        title: 'Visual Drag & Drop Ticket Designer',
        description: 'Customize ticket layers for QR code, attendee name, seat info, sponsor logos, and watermarks.',
        actionRequired: 'Explore Ticket Templates',
        whyItMatters: 'Provides attendees with a collectible souvenir ticket while increasing sponsor visibility.',
        aiPrompt: 'What is the optimal QR code size for print tickets?',
      },
    ],
  },
  {
    id: 'website_builder',
    name: '5. Event Website Builder & CMS',
    icon: '🌐',
    description: 'Build high-converting event landing pages with custom domain routing (event.mybrand.com) and 10 preset themes.',
    steps: [
      {
        id: 'web_engine',
        targetId: 'nav-website_builder',
        tabId: 'website_builder',
        title: 'Event Website Builder & CMS',
        description: 'Select from 10 website templates, set custom domain routing, and configure SEO metadata.',
        actionRequired: 'Open Event Website Builder',
        whyItMatters: 'A dedicated branded event website increases checkout conversion rate by 34%.',
        aiPrompt: 'Generate a color palette for a tech conference.',
      },
    ],
  },
  {
    id: 'crm',
    name: '6. Attendee CRM & VIP Loyalty',
    icon: '👥',
    description: 'Track attendee purchasing history, check-in timestamps, loyalty points, and churn risk scores.',
    steps: [
      {
        id: 'crm_insights',
        targetId: 'nav-crm',
        tabId: 'crm',
        title: 'Attendee Directory & Loyalty Intelligence',
        description: 'Inspect ticket buyer profiles, export contact lists, and assign VIP tier benefits.',
        actionRequired: 'View Attendee Directory',
        whyItMatters: 'Identifies your top 10% repeat ticket buyers for exclusive presale access.',
        aiPrompt: 'How can I send automated loyalty rewards to VIP buyers?',
      },
    ],
  },
  {
    id: 'marketing',
    name: '7. Marketing Automation & AI Copy',
    icon: '📣',
    description: 'Run automated email, SMS, and WhatsApp promo blasts with conversion pixel tracking and revenue attribution.',
    steps: [
      {
        id: 'mkt_automation',
        targetId: 'nav-marketing',
        tabId: 'marketing',
        title: 'Marketing Automation & Ad Studio',
        description: 'Schedule automated promo campaigns, generate AI social copy, and track ROI attribution.',
        actionRequired: 'Inspect Marketing Analytics',
        whyItMatters: 'Ensures marketing spend is allocated to the highest-converting traffic sources.',
        aiPrompt: 'Write an urgent 24-hour flash sale SMS message.',
      },
    ],
  },
  {
    id: 'billing',
    name: '8. Billing, Invoices & Payout Settlements',
    icon: '💳',
    description: 'Manage subscription tiers, zero-commission rules, tax settings, and instant bank payouts.',
    steps: [
      {
        id: 'billing_payouts',
        targetId: 'nav-billing',
        tabId: 'billing',
        title: 'Billing & Payout Settlements',
        description: 'Configure bank payout accounts, review platform commission rates, and download PDF invoices.',
        actionRequired: 'Review Billing & Subscriptions',
        whyItMatters: 'Maintains complete financial transparency with downloadable PDF invoices.',
        aiPrompt: 'How do instant bank payout settlements work?',
      },
    ],
  },
  {
    id: 'ai_assistant',
    name: '9. Conversational Workspace AI Suite',
    icon: '🤖',
    description: 'Your 24/7 AI operational co-pilot for drafting sponsorship decks, resolving queries, and managing events.',
    steps: [
      {
        id: 'ai_console',
        targetId: 'nav-ai_assistant',
        tabId: 'ai_assistant',
        title: 'Conversational Workspace AI Console',
        description: 'Interact with GETVNT AI in floating popup, docked sidebar, or full-screen console mode.',
        actionRequired: 'Open AI Assistant Suite',
        whyItMatters: 'Get immediate operational answers without waiting on support tickets.',
        aiPrompt: 'Create a sponsorship deck outline for a 5,000-person summit.',
      },
    ],
  },
  {
    id: 'settings',
    name: '10. Organization Settings & RBAC Roles',
    icon: '⚙️',
    description: 'Configure tenant profile, custom subdomains, security audit logs, and RBAC team permissions.',
    steps: [
      {
        id: 'settings_rbac',
        targetId: 'nav-settings',
        tabId: 'settings',
        title: 'Organization Settings & Team Roles',
        description: 'Manage company details, audit security logs, and assign granular RBAC staff roles.',
        actionRequired: 'Review Workspace Settings',
        whyItMatters: 'Safeguards financial permissions across team members and gate staff.',
        aiPrompt: 'What permissions should I assign to temporary gate staff?',
      },
    ],
  },
];

interface Props {
  isActive: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
  onToast: (msg: string) => void;
  onOpenWizard?: () => void;
}

export const EnterpriseProductAdoptionSystem: React.FC<Props> = ({
  isActive,
  onClose,
  onNavigateToTab,
  onToast,
  onOpenWizard,
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showModuleSelector, setShowModuleSelector] = useState<boolean>(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const [checklist, setChecklist] = useState([
    { id: 'profile', label: 'Complete Organization Profile', done: true },
    { id: 'wizard', label: 'Launch 7-Step Guided Wizard', done: false },
    { id: 'ticket', label: 'Design Custom Ticket Badge', done: false },
    { id: 'website', label: 'Select Website Preset Template', done: false },
    { id: 'qr', label: 'Test QR Gate Check-in Scanner', done: false },
    { id: 'payout', label: 'Connect Direct Bank Payouts', done: false },
  ]);

  const currentModule = MODULE_TOURS[activeModuleIndex] || MODULE_TOURS[0];
  const step = currentModule.steps[activeStepIndex] || currentModule.steps[0];

  // Auto-scroll and target rect detection
  useEffect(() => {
    if (!isActive || !step) return;

    onNavigateToTab(step.tabId);

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
  }, [isActive, activeModuleIndex, activeStepIndex]);

  if (!isActive) return null;

  const handleNextStep = () => {
    if (activeStepIndex < currentModule.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else if (activeModuleIndex < MODULE_TOURS.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveStepIndex(0);
      onToast(`🚀 Advanced to Tour: ${MODULE_TOURS[activeModuleIndex + 1].name}`);
    } else {
      onToast('🎉 All Modular Product Tours Completed! Replay anytime.');
      onClose();
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    } else if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
      setActiveStepIndex(MODULE_TOURS[activeModuleIndex - 1].steps.length - 1);
    }
  };

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  return (
    <>
      {/* ── 1. NON-BLOCKING SPOTLIGHT RING ── */}
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
            boxShadow: '0 0 0 9999px rgba(5, 8, 18, 0.55), 0 0 30px rgba(37, 99, 235, 0.6)',
            zIndex: 9980,
            pointerEvents: 'none',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Animated Pulsing Pointer Indicator */}
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
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            }}
          >
            <MousePointer size={14} color="#38BDF8" /> CLICK TARGET
          </div>
        </div>
      )}

      {/* ── 2. CONTEXTUAL FLOATING ADOPTION TOOLTIP CARD ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9990,
          maxWidth: '560px',
          width: '92%',
          background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          padding: '24px 28px',
          color: '#FFF',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(37, 99, 235, 0.3)',
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowModuleSelector(!showModuleSelector)}
              style={{ background: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(37, 99, 235, 0.4)', color: '#38BDF8', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>{currentModule.icon} {currentModule.name}</span>
              <Layers size={13} />
            </button>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 800 }}>• Step {activeStepIndex + 1} of {currentModule.steps.length}</span>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Module Selector Dropdown Popover */}
        {showModuleSelector && (
          <div style={{ background: '#0D1120', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '16px', padding: '10px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {MODULE_TOURS.map((mod, idx) => (
              <div
                key={mod.id}
                onClick={() => { setActiveModuleIndex(idx); setActiveStepIndex(0); setShowModuleSelector(false); }}
                style={{ padding: '8px 12px', borderRadius: '10px', background: activeModuleIndex === idx ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeModuleIndex === idx ? '#2563EB' : 'rgba(255,255,255,0.06)'}`, color: '#FFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{mod.icon}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mod.name.replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#38BDF8" /> {step.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: '13.5px', color: '#D1D5DB', lineHeight: '1.55', marginBottom: '12px' }}>
          {step.description}
        </p>

        {/* Action Required Box */}
        <div style={{ background: 'rgba(37, 99, 235, 0.12)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MousePointer size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '12.5px', color: '#FFF', fontWeight: 800 }}>
            <span style={{ color: '#38BDF8' }}>Action Required:</span> {step.actionRequired}
          </div>
        </div>

        {/* Why It Matters */}
        <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px', lineHeight: '1.4' }}>
          <strong style={{ color: '#34D399' }}>Why It Matters:</strong> {step.whyItMatters}
        </div>

        {/* Footer Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <button
            onClick={handlePrevStep}
            disabled={activeModuleIndex === 0 && activeStepIndex === 0}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: (activeModuleIndex === 0 && activeStepIndex === 0) ? '#64748B' : '#FFF', padding: '8px 14px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 800, cursor: (activeModuleIndex === 0 && activeStepIndex === 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {step.autoOpenWizard && onOpenWizard && (
              <button
                onClick={() => { onOpenWizard(); handleNextStep(); }}
                className="btn-cta"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', padding: '8px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 900 }}
              >
                🚀 Open Wizard
              </button>
            )}

            <button
              onClick={handleNextStep}
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#FFF', padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Continue <ChevronRight size={15} />
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
    </>
  );
};
