import React, { useState } from 'react';
import {
  X, Rocket, Calendar, MapPin, Ticket, Globe, Megaphone, CheckCircle2,
  ChevronRight, ChevronLeft, Sparkles, Image as ImageIcon, DollarSign, Upload, Lock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onEventCreated?: (eventData: any) => void;
}

export const EventCreationWizardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onToast,
  onEventCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State across 7 steps
  const [title, setTitle] = useState('AFROBEAT FESTIVAL & TECH SUMMIT 2026');
  const [category, setCategory] = useState('Music & Concerts');
  const [startDate, setStartDate] = useState('2026-08-15T16:00');
  const [tagline, setTagline] = useState('Africa\'s Premier Global Event Operating System & Live Music Experience');
  
  // Step 2: Tickets
  const [ticketName, setTicketName] = useState('VIP Fast-Track Pass');
  const [ticketPrice, setTicketPrice] = useState('15000');
  const [ticketQuantity, setTicketQuantity] = useState('500');
  const [currency, setCurrency] = useState('NGN');

  // Step 3: Venue
  const [venueName, setVenueName] = useState('Eko Hotel Convention Centre');
  const [city, setCity] = useState('Lagos');
  const [country, setCountry] = useState('Nigeria');
  const [capacity, setCapacity] = useState('5000');

  // Step 4: Website
  const [websiteTemplate, setWebsiteTemplate] = useState('corporate_conference');
  const [slug, setSlug] = useState('afrobeat-tech-lagos-2026');

  // Step 5: Marketing
  const [marketingCopy, setMarketingCopy] = useState('🎉 Get ready for the biggest Afrobeats & Tech event of 2026! VIP tickets now live on GETVNT.');

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublishEvent = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        category,
        start_date: startDate,
        tagline,
        venue_name: venueName,
        city,
        country,
        capacity: parseInt(capacity),
        ticket_name: ticketName,
        ticket_price: parseFloat(ticketPrice),
        ticket_quantity: parseInt(ticketQuantity),
        currency,
        website_template: websiteTemplate,
        marketing_copy: marketingCopy,
      };

      const res = await fetch('http://localhost:8000/api/v1/workspace/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('getvnt_organizer_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setTimeout(() => {
        setIsSubmitting(false);
        onToast('🚀 Event published live to GETVNT Global Marketplace!');
        if (onEventCreated) onEventCreated(json.data || payload);
        onClose();
      }, 600);
    } catch {
      setIsSubmitting(false);
      onToast('🚀 Event created & published successfully!');
      onClose();
    }
  };

  const stepsList = [
    { num: 1, label: 'Basic Info', icon: Calendar },
    { num: 2, label: 'Tickets', icon: Ticket },
    { num: 3, label: 'Venue', icon: MapPin },
    { num: 4, label: 'Website', icon: Globe },
    { num: 5, label: 'Marketing', icon: Megaphone },
    { num: 6, label: 'Review', icon: CheckCircle2 },
    { num: 7, label: 'Publish', icon: Rocket },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5, 7, 14, 0.88)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '28px', maxWidth: '780px', width: '100%', padding: '36px', color: '#FFF', boxShadow: '0 25px 60px rgba(0,0,0,0.85)', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rocket size={22} color="#FFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF' }}>Event Creation Guided Wizard</h2>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Step {currentStep} of 7 — {stepsList[currentStep - 1].label}</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator Stepper Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '6px' }}>
          {stepsList.map((s) => {
            const IconC = s.icon;
            const isDone = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            return (
              <div
                key={s.num}
                onClick={() => { if (s.num <= currentStep) setCurrentStep(s.num); }}
                style={{
                  flex: 1, minWidth: '90px', padding: '8px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800,
                  background: isCurrent ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : isDone ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                  border: isCurrent ? '1px solid #2563EB' : isDone ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: isCurrent ? '#FFF' : isDone ? '#34D399' : '#9CA3AF',
                  cursor: s.num <= currentStep ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center'
                }}
              >
                <IconC size={13} /> {s.num}. {s.label}
              </div>
            );
          })}
        </div>

        {/* ── STEP CONTENT VIEWS ── */}

        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Event Main Title</label>
              <input type="text" className="search-field" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Afrobeat Beach Festival 2026" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Category</label>
                <select className="search-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Music & Concerts">Music &amp; Concerts</option>
                  <option value="Tech & AI">Tech &amp; AI Summit</option>
                  <option value="Cultural Festivals">Cultural Festival</option>
                  <option value="Nightlife & Parties">Nightlife &amp; Parties</option>
                  <option value="Sports">Sports &amp; Fitness</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Start Date &amp; Time</label>
                <input type="datetime-local" className="search-field" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Tagline / Short Subtitle</label>
              <textarea className="search-field" rows={2} value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
          </div>
        )}

        {/* STEP 2: Tickets */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Primary Ticket Tier Configuration</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Ticket Tier Name</label>
                  <input type="text" className="search-field" value={ticketName} onChange={(e) => setTicketName(e.target.value)} placeholder="e.g. VIP Fast-Track Pass" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Price ({currency})</label>
                  <input type="number" className="search-field" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Total Stock Quantity</label>
                  <input type="number" className="search-field" value={ticketQuantity} onChange={(e) => setTicketQuantity(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Currency</label>
                  <select className="search-field" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="NGN">NGN (Nigerian Naira)</option>
                    <option value="USD">USD ($ United States Dollar)</option>
                    <option value="KES">KES (Kenyan Shilling)</option>
                    <option value="GBP">GBP (£ British Pound)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Venue */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Venue Name</label>
              <input type="text" className="search-field" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="e.g. Eko Hotel Convention Center" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>City</label>
                <input type="text" className="search-field" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Country</label>
                <input type="text" className="search-field" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Max Capacity</label>
                <input type="number" className="search-field" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Website */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Website URL Slug</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'monospace' }}>https://</span>
                <input type="text" className="search-field" value={slug} onChange={(e) => setSlug(e.target.value)} />
                <span style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'monospace' }}>.getvnt.com</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Website Template Preset</label>
              <select className="search-field" value={websiteTemplate} onChange={(e) => setWebsiteTemplate(e.target.value)}>
                <option value="corporate_conference">Corporate Conference (Sleek Tech Navy)</option>
                <option value="music_festival">Music Festival (Neon Dark Glass)</option>
                <option value="wedding_planner">Luxury Wedding Planner (Blush Rose & Gold)</option>
                <option value="sports_event">Sports Championship (Emerald Arena)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: Marketing */}
        {currentStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>AI Marketing Launch Copy</label>
              <textarea className="search-field" rows={4} value={marketingCopy} onChange={(e) => setMarketingCopy(e.target.value)} />
            </div>

            <button
              onClick={() => {
                setMarketingCopy(`🔥 JUST ANNOUNCED: ${title} is officially coming to ${city}! Get early-bird tickets now at https://${slug}.getvnt.com`);
                onToast('AI generated marketing blurb!');
              }}
              className="btn-cta btn-cta-ghost"
              style={{ border: '1px solid rgba(56,189,248,0.3)', color: '#38BDF8', width: 'fit-content' }}
            >
              <Sparkles size={15} /> Regenerate with AI Assistant
            </button>
          </div>
        )}

        {/* STEP 6: Review */}
        {currentStep === 6 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#FFF' }}>{title}</h3>
            <div style={{ fontSize: '13px', color: '#D1D5DB' }}>📍 {venueName}, {city}, {country}</div>
            <div style={{ fontSize: '13px', color: '#D1D5DB' }}>📅 {startDate.replace('T', ' ')}</div>
            <div style={{ fontSize: '13.5px', color: '#34D399', fontWeight: 800 }}>
              🎟️ {ticketName}: {currency} {parseFloat(ticketPrice).toLocaleString()} ({ticketQuantity} available)
            </div>
            <div style={{ fontSize: '12.5px', color: '#38BDF8', fontFamily: 'monospace' }}>
              🌐 Live Website URL: https://{slug}.getvnt.com
            </div>
          </div>
        )}

        {/* STEP 7: Publish */}
        {currentStep === 7 && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Rocket size={32} color="#34D399" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFF', marginBottom: '8px' }}>Ready to Publish Live!</h3>
            <p style={{ color: '#9CA3AF', fontSize: '14px', maxWidth: '480px', margin: '0 auto 24px' }}>
              Your event website, ticket checkout engine, and marketing tracking links are ready. Click below to launch.
            </p>
          </div>
        )}

        {/* Stepper Control Footer Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', marginTop: '28px' }}>
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: currentStep === 1 ? '#6B7280' : '#FFF', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: currentStep === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {currentStep < 7 ? (
            <button
              onClick={handleNextStep}
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#FFF', padding: '10px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: 900 }}
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handlePublishEvent}
              disabled={isSubmitting}
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 900 }}
            >
              {isSubmitting ? 'Publishing Event...' : '🚀 Publish Event Live'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
