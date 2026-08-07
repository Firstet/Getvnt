import React, { useState, useEffect } from 'react';
import {
  Sparkles, Compass, Rocket, ArrowRight, CheckCircle2, X, ChevronRight,
  ChevronLeft, Play, Layout, Ticket, Globe, Users, DollarSign, BarChart2,
  ShieldCheck, HelpCircle, RotateCcw, Zap
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
  onToast: (msg: string) => void;
  isOpen: boolean;
}

export const OnboardingTourModal: React.FC<Props> = ({
  onClose,
  onNavigateToTab,
  onToast,
  isOpen,
}) => {
  const [step, setStep] = useState<'welcome' | 'tour'>('welcome');
  const [activeTourIndex, setActiveTourIndex] = useState(0);

  // 15 Interactive Guided Tours
  const tourSteps = [
    {
      id: 'dashboard',
      tab: 'dashboard',
      title: '1. Dashboard Overview',
      desc: 'Monitor real-time GMV sales velocity, total tickets issued, active revenue, and live attendee check-ins.',
      icon: Layout,
      color: '#38BDF8',
      highlight: 'Live revenue metrics, quick action widgets, and sales charts.'
    },
    {
      id: 'create_event',
      tab: 'events',
      title: '2. Creating an Event',
      desc: 'Launch new events in under 2 minutes. Configure date, venue, category, banner artwork, and visibility.',
      icon: Rocket,
      color: '#A855F7',
      highlight: 'Multi-day scheduling, venue maps, and AI event copy generation.'
    },
    {
      id: 'ticket_creation',
      tab: 'tickets',
      title: '3. Ticket Creation',
      desc: 'Set up General Admission, VIP Fast-Track passes, VVIP Tables, and early-bird promotional tiers.',
      icon: Ticket,
      color: '#34D399',
      highlight: 'Set total stock limits, purchase per order limits, and release dates.'
    },
    {
      id: 'pricing',
      tab: 'pricing',
      title: '4. Pricing & Ticket Types',
      desc: 'Configure multi-currency pricing (USD, NGN, KES, GBP), group discounts, and booking fee pass-through.',
      icon: DollarSign,
      color: '#F59E0B',
      highlight: 'Dynamic pricing rules and automated price escalation triggers.'
    },
    {
      id: 'seating',
      tab: 'seating',
      title: '5. Seating & Reserved Sections',
      desc: 'Design interactive seat maps for stadiums, arenas, theaters, and banquet halls.',
      icon: Layout,
      color: '#60A5FA',
      highlight: 'Row numbers, table assignments, and seat reservation holds.'
    },
    {
      id: 'event_website',
      tab: 'website_builder',
      title: '6. Event Website',
      desc: 'Deploy custom organizer websites with branded domains, speaker agendas, and ticket checkout widgets.',
      icon: Globe,
      color: '#EC4899',
      highlight: 'Instant live preview, custom CSS styling, and SEO optimization.'
    },
    {
      id: 'landing_builder',
      tab: 'website_builder',
      title: '7. Landing Page Builder',
      desc: 'Choose from 10 responsive website templates tailored for festivals, conferences, and corporate events.',
      icon: Sparkles,
      color: '#8B5CF6',
      highlight: 'Drag-and-drop page sections, video heroes, and sponsor grids.'
    },
    {
      id: 'qr_checkin',
      tab: 'qr_studio',
      title: '8. QR Check-in & Gate Scanning',
      desc: 'Equip door staff with mobile QR scanners that validate tickets in under 200ms with offline caching.',
      icon: ShieldCheck,
      color: '#10B981',
      highlight: 'Anti-counterfeit security tokens and real-time attendance counter.'
    },
    {
      id: 'team_members',
      tab: 'team',
      title: '9. Team Members & Permissions',
      desc: 'Invite team staff with role-based permissions (Admin, Finance, Marketing, Check-in Staff).',
      icon: Users,
      color: '#38BDF8',
      highlight: 'Granular access control and audit trail logging.'
    },
    {
      id: 'marketing',
      tab: 'marketing',
      title: '10. Marketing & Promo Campaigns',
      desc: 'Run targeted email campaigns, create tracking links, and generate AI social media graphics.',
      icon: Zap,
      color: '#FBBF24',
      highlight: 'UTM tracking links, promo code generators, and ad analytics.'
    },
    {
      id: 'crm',
      tab: 'crm',
      title: '11. CRM & Attendee Insights',
      desc: 'Access your complete attendee directory, VIP guest lists, order history, and lifetime customer value.',
      icon: Users,
      color: '#60A5FA',
      highlight: 'Segment buyers by location, ticket spend, and attendance history.'
    },
    {
      id: 'ai_features',
      tab: 'ai_assistant',
      title: '12. GETVNT AI Assistant',
      desc: 'Generate high-converting email copy, pricing recommendations, and automated customer responses.',
      icon: Sparkles,
      color: '#F59E0B',
      highlight: 'Context-aware assistant available across every workspace module.'
    },
    {
      id: 'analytics',
      tab: 'analytics',
      title: '13. Real-Time Analytics',
      desc: 'Track conversion rates, referral sources, buyer demographics, and daily checkout trends.',
      icon: BarChart2,
      color: '#A855F7',
      highlight: 'Export raw CSV/Excel reports and visual revenue breakdowns.'
    },
    {
      id: 'finance',
      tab: 'finance',
      title: '14. Finance & Payout Settlements',
      desc: 'Monitor gross ticket revenues, platform fees, pending balances, and instant bank settlements.',
      icon: DollarSign,
      color: '#34D399',
      highlight: 'Automated bank payout schedules and tax invoice downloads.'
    },
    {
      id: 'publishing',
      tab: 'publishing',
      title: '15. Event Publishing & Go-Live',
      desc: 'Publish your event to the GETVNT Global Marketplace and social channels with 1-click.',
      icon: Rocket,
      color: '#EC4899',
      highlight: 'Instant indexing across search engines and mobile buyer apps.'
    },
  ];

  if (!isOpen) return null;

  const currentTour = tourSteps[activeTourIndex];
  const IconComp = currentTour.icon;

  const handleStartTour = () => {
    setStep('tour');
    setActiveTourIndex(0);
    onNavigateToTab(tourSteps[0].tab);
  };

  const handleNextTour = () => {
    if (activeTourIndex < tourSteps.length - 1) {
      const nextIdx = activeTourIndex + 1;
      setActiveTourIndex(nextIdx);
      onNavigateToTab(tourSteps[nextIdx].tab);
    } else {
      localStorage.setItem('getvnt_organizer_onboarding_completed', 'true');
      onToast('🎉 Congratulations! You have completed the GETVNT Guided Tour.');
      onClose();
    }
  };

  const handlePrevTour = () => {
    if (activeTourIndex > 0) {
      const prevIdx = activeTourIndex - 1;
      setActiveTourIndex(prevIdx);
      onNavigateToTab(tourSteps[prevIdx].tab);
    }
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('getvnt_organizer_onboarding_completed', 'true');
    onToast('Onboarding saved. You can replay the guided tour anytime from the Help menu.');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5, 7, 14, 0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      {step === 'welcome' ? (
        <div style={{ background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '28px', maxWidth: '580px', width: '100%', padding: '40px', color: '#FFF', boxShadow: '0 25px 60px rgba(0,0,0,0.8)', position: 'relative' }}>
          
          <button onClick={handleSkipOnboarding} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
            <X size={20} />
          </button>

          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 25px rgba(37,99,235,0.4)' }}>
            <Sparkles size={28} color="#FFF" />
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', lineHeight: 1.2 }}>
            👋 Welcome to GETVNT
          </h2>
          <p style={{ color: '#D1D5DB', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
            Let's help you launch your first event, set up ticket tiers, and start selling passes worldwide.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            <button
              onClick={handleStartTour}
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', border: 'none', color: '#FFF', padding: '14px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Compass size={18} /> Take a 5-minute Guided Tour
              </span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => {
                localStorage.setItem('getvnt_organizer_onboarding_completed', 'true');
                onNavigateToTab('events');
                onClose();
              }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', padding: '14px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Rocket size={18} color="#34D399" /> Create My First Event Now
              </span>
              <ChevronRight size={18} color="#9CA3AF" />
            </button>

            <button
              onClick={() => {
                localStorage.setItem('getvnt_organizer_onboarding_completed', 'true');
                onNavigateToTab('events');
                onToast('Opened Event Importer Desk');
                onClose();
              }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', padding: '14px 20px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={18} color="#FBBF24" /> Import Existing Event (Eventbrite / CSV)
              </span>
              <ChevronRight size={18} color="#9CA3AF" />
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={handleSkipOnboarding} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
              Skip onboarding for now
            </button>
          </div>

        </div>
      ) : (
        /* Step 2: Interactive Tour Modal Overlay Bar */
        <div style={{ background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)', border: `1px solid ${currentTour.color}66`, borderRadius: '24px', maxWidth: '640px', width: '100%', padding: '32px', color: '#FFF', boxShadow: `0 20px 50px ${currentTour.color}22`, position: 'relative' }}>
          
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${currentTour.color}22`, border: `1px solid ${currentTour.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconComp size={20} color={currentTour.color} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: currentTour.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  STEP {activeTourIndex + 1} OF {tourSteps.length}
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#FFF' }}>{currentTour.title}</h3>
              </div>
            </div>

            <button onClick={handleSkipOnboarding} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Description */}
          <p style={{ color: '#D1D5DB', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '20px' }}>
            {currentTour.desc}
          </p>

          {/* Highlight Callout Box */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${currentTour.color}33`, borderRadius: '14px', padding: '14px', fontSize: '13px', color: '#E5E7EB', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={16} color={currentTour.color} style={{ flexShrink: 0 }} />
            <span><strong>Key Feature:</strong> {currentTour.highlight}</span>
          </div>

          {/* Progress Bar */}
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ height: '100%', width: `${((activeTourIndex + 1) / tourSteps.length) * 100}%`, background: `linear-gradient(90deg, #2563EB, ${currentTour.color})`, transition: 'width 0.3s ease' }} />
          </div>

          {/* Action Navigation Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrevTour}
              disabled={activeTourIndex === 0}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: activeTourIndex === 0 ? '#6B7280' : '#FFF', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: activeTourIndex === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSkipOnboarding}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', padding: '10px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Exit Tour
              </button>

              <button
                onClick={handleNextTour}
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', border: 'none', color: '#FFF', padding: '10px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
              >
                {activeTourIndex === tourSteps.length - 1 ? 'Finish Guided Tour 🎉' : 'Next Step'} <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
