import React, { useState, useEffect } from 'react';
import { MousePointer, Sparkles, X, Check, Award, Bot } from 'lucide-react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type RequiredAction = 'click' | 'input' | 'select' | 'none';

export interface DataTourStep {
  id: string;
  targetSelector: string; // DOM element ID or CSS selector
  route: string; // Active workspace view tab
  title: string;
  description: string;
  placement: TooltipPlacement;
  requiredAction: RequiredAction;
  autoOpenWizard?: boolean;
  whyItMatters?: string;
}

export const APPCUES_TOUR_STEPS: DataTourStep[] = [
  {
    id: 'dashboard_ai',
    targetSelector: 'executive-summary-card',
    route: 'dashboard',
    title: 'Executive Telemetry Bar',
    description: 'GETVNT AI predicts high-demand sales velocity and recommends daily marketing actions.',
    placement: 'bottom',
    requiredAction: 'click',
    whyItMatters: 'Saves organizers hours of data analysis.',
  },
  {
    id: 'create_event_btn',
    targetSelector: 'launcher-create-event',
    route: 'dashboard',
    title: 'Create Event Wizard',
    description: 'Click this launcher button to open the 7-Step Guided Event Creation Wizard.',
    placement: 'right',
    requiredAction: 'click',
    autoOpenWizard: true,
    whyItMatters: 'Configures title, tickets, venue, website, and AI marketing copy.',
  },
  {
    id: 'qr_studio_nav',
    targetSelector: 'nav-qr_studio',
    route: 'qr_studio',
    title: 'QR Check-in Studio',
    description: 'Click here to access branded dynamic QR codes and offline scanner controls.',
    placement: 'right',
    requiredAction: 'click',
    whyItMatters: 'Eliminates ticket fraud and gate bottlenecks.',
  },
  {
    id: 'ticket_designer_nav',
    targetSelector: 'nav-ticket_designer',
    route: 'ticket_designer',
    title: 'Drag & Drop Ticket Designer',
    description: 'Click here to open the visual ticket layout editor and 10 preset templates.',
    placement: 'right',
    requiredAction: 'click',
    whyItMatters: 'Creates print-ready souvenir tickets for attendees.',
  },
  {
    id: 'website_builder_nav',
    targetSelector: 'nav-website_builder',
    route: 'website_builder',
    title: 'Event Website Builder & CMS',
    description: 'Click here to pick from 10 organizer website templates and configure domain routing.',
    placement: 'right',
    requiredAction: 'click',
    whyItMatters: 'Branded websites boost ticket conversions by 34%.',
  },
  {
    id: 'crm_nav',
    targetSelector: 'nav-crm',
    route: 'crm',
    title: 'Attendee CRM & Loyalty',
    description: 'Click here to view attendee buying history, check-in logs, and VIP rewards.',
    placement: 'right',
    requiredAction: 'click',
    whyItMatters: 'Identifies repeat buyers for exclusive presale access.',
  },
  {
    id: 'marketing_nav',
    targetSelector: 'nav-marketing',
    route: 'marketing',
    title: 'Marketing & AI Insights',
    description: 'Click here to launch email, SMS, and WhatsApp ad campaigns.',
    placement: 'right',
    requiredAction: 'click',
    whyItMatters: 'Tracks revenue attribution across ad channels.',
  },
  {
    id: 'billing_nav',
    targetSelector: 'nav-billing',
    route: 'billing',
    title: 'Billing & Subscriptions',
    description: 'Click here to review bank payout settings, commission rates, and invoices.',
    placement: 'right',
    requiredAction: 'click',
    whyItMatters: 'Ensures direct instant settlements to your bank.',
  },
];

interface Props {
  isActive: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
  onToast: (msg: string) => void;
  onOpenWizard?: () => void;
}

export const AppcuesTourEngine: React.FC<Props> = ({
  isActive,
  onClose,
  onNavigateToTab,
  onToast,
  onOpenWizard,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = APPCUES_TOUR_STEPS[stepIndex] || APPCUES_TOUR_STEPS[0];

  // Auto-scroll and target detection
  useEffect(() => {
    if (!isActive) {
      setStepIndex(0);
      return;
    }
    if (!step) return;

    // Navigate to active tab
    onNavigateToTab(step.route);

    const updateRect = () => {
      const el = document.getElementById(step.targetSelector);
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
  }, [isActive, stepIndex]);

  if (!isActive) return null;

  const handleNextStep = () => {
    if (step.autoOpenWizard && onOpenWizard) {
      onOpenWizard();
    }
    if (stepIndex < APPCUES_TOUR_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onToast('🎉 Product Tour Complete! Replay anytime from top header.');
      onClose();
    }
  };

  // Compute attached tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }

    const margin = 14;
    switch (step.placement) {
      case 'bottom':
        return {
          position: 'fixed',
          top: targetRect.bottom + margin,
          left: Math.max(16, targetRect.left + targetRect.width / 2 - 140),
        };
      case 'top':
        return {
          position: 'fixed',
          top: Math.max(16, targetRect.top - 180),
          left: Math.max(16, targetRect.left + targetRect.width / 2 - 140),
        };
      case 'right':
        return {
          position: 'fixed',
          top: targetRect.top,
          left: Math.min(window.innerWidth - 320, targetRect.right + margin),
        };
      case 'left':
        return {
          position: 'fixed',
          top: targetRect.top,
          left: Math.max(16, targetRect.left - 300),
        };
      default:
        return {
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
        };
    }
  };

  return (
    <>
      {/* ── 1. SPOTLIGHT OVERLAY ON ONLY TARGET ELEMENT ── */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: '12px',
            border: '2px solid #2563EB',
            boxShadow: '0 0 0 9999px rgba(5, 8, 18, 0.55), 0 0 25px rgba(37, 99, 235, 0.6)',
            zIndex: 9980,
            pointerEvents: 'none',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Animated Pointer Indicator */}
          <div
            style={{
              position: 'absolute',
              top: '-28px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0D1222',
              color: '#38BDF8',
              border: '1px solid #2563EB',
              borderRadius: '99px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
          >
            <MousePointer size={12} color="#38BDF8" /> CLICK TARGET
          </div>
        </div>
      )}

      {/* ── 2. TINY ATTACHED FLOATING TOOLTIP BUBBLE (NO CENTER MODAL) ── */}
      <div
        style={{
          zIndex: 9990,
          width: '290px',
          background: '#0D1222',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '16px',
          padding: '16px 18px',
          color: '#FFF',
          boxShadow: '0 15px 35px rgba(0,0,0,0.85), 0 0 20px rgba(37,99,235,0.25)',
          ...getTooltipStyle(),
        }}
      >
        {/* Step Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            STEP {stepIndex + 1} OF {APPCUES_TOUR_STEPS.length}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>

        {/* Title */}
        <h4 style={{ fontSize: '14.5px', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>
          {step.title}
        </h4>

        {/* Short Description */}
        <p style={{ fontSize: '12.5px', color: '#D1D5DB', lineHeight: '1.45', marginBottom: '12px' }}>
          {step.description}
        </p>

        {/* Single Action Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
            Skip
          </button>

          <button
            onClick={handleNextStep}
            className="btn-cta"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#FFF',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 900,
            }}
          >
            {stepIndex === APPCUES_TOUR_STEPS.length - 1 ? 'Finish' : 'Got it →'}
          </button>
        </div>
      </div>
    </>
  );
};
