import React, { useState } from 'react';
import { Layout, Globe, Sparkles, Download, Eye, ExternalLink, Palette, Smartphone, Monitor, CheckCircle2, Lock, Shield, Settings, FileText, Image, MessageSquare, Award } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
  userPlan?: 'FREE' | 'PRO' | 'ENTERPRISE';
}

export const EventWebsiteBuilderView: React.FC<Props> = ({ onToast, userPlan = 'PRO' }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('corporate_conference');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [eventTitle, setEventTitle] = useState('AFROBEAT FESTIVAL & TECH SUMMIT 2026');
  const [tagline, setTagline] = useState('Africa\'s Premier Global Event Operating System');
  const [eventDate, setEventDate] = useState('August 15, 2026 • 04:00 PM');
  const [venue, setVenue] = useState('Eko Hotel Convention Center, Lagos, Nigeria');
  const [ctaText, setCtaText] = useState('CLAIM VIP PASSES NOW');
  const [customDomain, setCustomDomain] = useState('event.getvnt.com');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [accentColor, setAccentColor] = useState('#7C3AED');
  const [activeCmsTab, setActiveCmsTab] = useState<'general' | 'seo' | 'pages' | 'sponsors'>('general');

  // 10 Professional Organizer Website Templates
  const templates = [
    { id: 'corporate_conference', name: '1. Corporate Conference (Sleek Tech Navy)', heroBg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', badge: '💼 CORPORATE CONVENTION', primary: '#2563EB', accent: '#38BDF8' },
    { id: 'music_festival', name: '2. Music Festival (Neon Dark Glass)', heroBg: 'linear-gradient(135deg, #1E1B4B 0%, #0D1222 100%)', badge: '🔥 NEON MUSIC FESTIVAL', primary: '#EC4899', accent: '#7C3AED' },
    { id: 'wedding_planner', name: '3. Wedding Planner (Blush Rose & Gold)', heroBg: 'linear-gradient(135deg, #2D0B1E 0%, #0F050B 100%)', badge: '💍 LUXURY WEDDING', primary: '#F43F5E', accent: '#F59E0B' },
    { id: 'church_event', name: '4. Church & Ministry Summit (Grace Royal)', heroBg: 'linear-gradient(135deg, #1E1035 0%, #080312 100%)', badge: '⛪ CHURCH & MINISTRY', primary: '#8B5CF6', accent: '#60A5FA' },
    { id: 'university', name: '5. University & Academic Expo (Oxford Blue)', heroBg: 'linear-gradient(135deg, #0A192F 0%, #020C1B 100%)', badge: '🎓 UNIVERSITY EXPO', primary: '#0284C7', accent: '#34D399' },
    { id: 'sports_event', name: '6. Sports Championship (Emerald Arena)', heroBg: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', badge: '⚽ SPORTS CHAMPIONSHIP', primary: '#10B981', accent: '#F59E0B' },
    { id: 'exhibition', name: '7. Exhibition & Trade Fair (Industrial Onyx)', heroBg: 'linear-gradient(135deg, #18181B 0%, #09090B 100%)', badge: '🏛️ TRADE FAIR EXPO', primary: '#F97316', accent: '#E11D48' },
    { id: 'community', name: '8. Community Gathering (Warm Amber)', heroBg: 'linear-gradient(135deg, #451A03 0%, #1A0601 100%)', badge: '🤝 COMMUNITY SUMMIT', primary: '#F59E0B', accent: '#10B981' },
    { id: 'luxury_gala', name: '9. Luxury Gala & Fashion (Onyx & Gold)', heroBg: 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)', badge: '👑 VIP LUXURY GALA', primary: '#D97706', accent: '#FBBF24' },
    { id: 'creative_agency', name: '10. Creative Agency Showcase (Cyber Purple)', heroBg: 'linear-gradient(135deg, #3B0764 0%, #170326 100%)', badge: '🎨 CREATIVE AGENCY', primary: '#A855F7', accent: '#EC4899' },
  ];

  const currentPreset = templates.find((t) => t.id === selectedTemplate) || templates[0];
  const isFreePlan = userPlan === 'FREE';

  const handleTemplateChange = (id: string) => {
    setSelectedTemplate(id);
    const preset = templates.find((t) => t.id === id);
    if (preset) {
      setPrimaryColor(preset.primary);
      setAccentColor(preset.accent);
    }
  };

  return (
    <div>
      {/* Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#2563EB,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={20} color="#FFF" />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 900 }}>Event Website Builder &amp; CMS</h1>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
            Build responsive multi-page event websites with custom domains, speaker agendas, sponsor logos, and instant checkout.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-cta"
            style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#FFF' }}
            onClick={() => onToast(`Published Website live to https://${customDomain} !`)}
          >
            <Sparkles size={15} /> Publish Live Website
          </button>
        </div>
      </div>

      {/* Plan Restrictions Banner */}
      {isFreePlan && (
        <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '18px', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lock size={22} color="#F59E0B" />
            <div>
              <div style={{ fontWeight: 800, color: '#FFF', fontSize: '14.5px' }}>Free Plan — Basic Single Event Page Only</div>
              <div style={{ color: '#D1D5DB', fontSize: '13px' }}>Upgrade to PRO to unlock full Organizer Website Builder, custom domains, CMS blog, &amp; 10 premium templates.</div>
            </div>
          </div>
          <button className="btn-cta" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000', fontWeight: 900, padding: '8px 18px', fontSize: '12.5px' }}>
            Upgrade to PRO ($29/mo)
          </button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
        
        {/* Controls Sidebar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CMS Sub-Navigation Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'general', label: 'General' },
              { id: 'seo', label: 'SEO' },
              { id: 'pages', label: 'Pages' },
              { id: 'sponsors', label: 'Sponsors' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveCmsTab(t.id as any)}
                style={{
                  flex: 1, padding: '6px 0', fontSize: '11.5px', fontWeight: 800, borderRadius: '6px', border: 'none',
                  background: activeCmsTab === t.id ? '#2563EB' : 'transparent', color: activeCmsTab === t.id ? '#FFF' : '#9CA3AF', cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeCmsTab === 'general' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>10 Organizer Website Templates</label>
                <select className="search-field" value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)}>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Event / Org Title</label>
                <input type="text" className="search-field" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Sub-Tagline</label>
                <input type="text" className="search-field" value={tagline} onChange={(e) => setTagline(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Date &amp; Venue String</label>
                <input type="text" className="search-field" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Primary</label>
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Accent</label>
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>
            </>
          )}

          {activeCmsTab === 'seo' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Custom Domain</label>
                <input type="text" className="search-field" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="e.g. festival.mybrand.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Meta SEO Title</label>
                <input type="text" className="search-field" defaultValue={`${eventTitle} | Official Tickets`} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Meta Description</label>
                <textarea className="search-field" rows={3} defaultValue={tagline} />
              </div>
            </>
          )}

          {activeCmsTab === 'pages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Home', 'About Event', 'Speakers & Schedule', 'Sponsors', 'Blog & News', 'Contact & FAQ'].map((p, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span>{p}</span>
                  <span style={{ color: '#34D399', fontSize: '11px', fontWeight: 800 }}>ACTIVE</span>
                </div>
              ))}
            </div>
          )}

          {activeCmsTab === 'sponsors' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Headline Sponsor Logos</label>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>Supported sponsors: Paystack, MTN, Pepsi, RedBull, Spotify.</div>
              <button className="btn-cta" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', color: '#FFF', justifyContent: 'center' }} onClick={() => onToast('Sponsor logo added!')}>
                + Add Sponsor Logo
              </button>
            </div>
          )}

        </div>

        {/* Live Website Canvas Preview */}
        <div className="card" style={{ background: '#05070E', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Device Switcher Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={15} color="#34D399" /> Live Website Canvas Preview
            </div>

            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '10px' }}>
              <button className="btn-cta" style={{ padding: '6px 12px', fontSize: '12px', background: deviceMode === 'desktop' ? '#2563EB' : 'transparent', color: '#FFF' }} onClick={() => setDeviceMode('desktop')}>
                <Monitor size={14} /> Desktop
              </button>
              <button className="btn-cta" style={{ padding: '6px 12px', fontSize: '12px', background: deviceMode === 'mobile' ? '#2563EB' : 'transparent', color: '#FFF' }} onClick={() => setDeviceMode('mobile')}>
                <Smartphone size={14} /> Mobile
              </button>
            </div>
          </div>

          {/* Rendered Website Canvas */}
          <div style={{
            width: deviceMode === 'mobile' ? '360px' : '100%', margin: '0 auto',
            borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)', background: currentPreset.heroBg, color: '#FFF',
            transition: 'all 0.3s ease'
          }}>
            {/* Header bar */}
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <img src="/assets/getvnt-logo-white.png" alt="Getvnt" loading="lazy" style={{ height: '24px', objectFit: 'contain' }} />
              <div style={{ fontSize: '11px', fontWeight: 900, background: primaryColor, color: '#FFF', padding: '4px 12px', borderRadius: '99px' }}>
                TICKETS LIVE
              </div>
            </div>

            {/* Hero Section */}
            <div style={{ padding: deviceMode === 'mobile' ? '32px 20px' : '56px 40px', textAlign: 'center' }}>
              <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '99px', background: `${primaryColor}22`, color: primaryColor, fontSize: '11px', fontWeight: 900, marginBottom: '16px', border: `1px solid ${primaryColor}44` }}>
                {currentPreset.badge}
              </span>

              <h1 style={{ fontSize: deviceMode === 'mobile' ? '22px' : '36px', fontWeight: 900, lineHeight: '1.2', marginBottom: '14px' }}>
                {eventTitle}
              </h1>

              <p style={{ fontSize: '14.5px', color: '#D1D5DB', maxWidth: '640px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                {tagline}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '13px', color: '#9CA3AF', marginBottom: '28px', flexWrap: 'wrap' }}>
                <div>📅 <strong>{eventDate}</strong></div>
                <div>📍 <strong>{venue}</strong></div>
              </div>

              <button
                className="btn-cta"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, color: '#FFF', padding: '14px 36px', fontSize: '14px', fontWeight: 900, border: 'none', borderRadius: '99px', boxShadow: `0 10px 30px ${primaryColor}66` }}
                onClick={() => onToast('Opened Live Ticket Checkout Modal!')}
              >
                {ctaText}
              </button>
            </div>

            {/* Features Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px', background: 'rgba(0,0,0,0.3)', textAlign: 'center', fontSize: '11px', color: '#9CA3AF' }}>
              <div>⚡ Fast-Track Door Entry</div>
              <div>🎟️ Instant QR Digital Pass</div>
              <div>🛡️ 100% Verified GETVNT Pass</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
