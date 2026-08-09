import React, { useState } from 'react';
import {
  Layout, Globe, Sparkles, Download, Eye, ExternalLink, Palette, Smartphone, Monitor, CheckCircle2, Lock, Shield, Settings, FileText, Image, MessageSquare, Award, ArrowRight, Check, Plus, RefreshCw, Key
} from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
  userPlan?: 'FREE' | 'PRO' | 'ENTERPRISE';
}

export const EventWebsiteBuilderView: React.FC<Props> = ({ onToast, userPlan = 'PRO' }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('music_festival');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [eventTitle, setEventTitle] = useState('AFROBEAT FESTIVAL & TECH SUMMIT 2026');
  const [tagline, setTagline] = useState('Africa\'s Premier Global Event Operating System');
  const [eventDate, setEventDate] = useState('August 15, 2026 • 04:00 PM');
  const [venue, setVenue] = useState('Eko Hotel Convention Center, Lagos, Nigeria');
  const [ctaText, setCtaText] = useState('BUY TICKETS NOW');
  
  // Domain Setup Options: free_subdomain | custom_domain | buy_domain
  const [domainOption, setDomainOption] = useState<'free_subdomain' | 'custom_domain' | 'buy_domain'>('free_subdomain');
  const [subdomainName, setSubdomainName] = useState('afrobeatfest');
  const [customDomainInput, setCustomDomainInput] = useState('www.afrobobeatfest.com');
  const [dnsStatus, setDnsStatus] = useState<'pending' | 'verified'>('verified');

  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [accentColor, setAccentColor] = useState('#7C3AED');
  const [activeCmsTab, setActiveCmsTab] = useState<'templates' | 'content' | 'domains' | 'seo' | 'sections'>('templates');

  // 12 Professional Event Category Templates
  const templates = [
    { id: 'music_festival', category: 'Music Festival', name: '1. Music Festival (Neon Dark Glass)', heroBg: 'linear-gradient(135deg, #1E1B4B 0%, #0D1222 100%)', badge: '🔥 NEON MUSIC FESTIVAL', primary: '#EC4899', accent: '#7C3AED' },
    { id: 'church', category: 'Church & Ministry', name: '2. Church & Ministry Summit (Grace Royal)', heroBg: 'linear-gradient(135deg, #1E1035 0%, #080312 100%)', badge: '⛪ CHURCH & MINISTRY', primary: '#8B5CF6', accent: '#60A5FA' },
    { id: 'conference', category: 'Conference', name: '3. Global Tech Conference (Navy Cyber)', heroBg: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', badge: '💼 TECH CONFERENCE', primary: '#2563EB', accent: '#38BDF8' },
    { id: 'summit', category: 'Summit', name: '4. Executive Leadership Summit (Onyx Gold)', heroBg: 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)', badge: '👑 LEADERSHIP SUMMIT', primary: '#D97706', accent: '#FBBF24' },
    { id: 'workshop', category: 'Workshop', name: '5. Creative Masterclass Workshop', heroBg: 'linear-gradient(135deg, #3B0764 0%, #170326 100%)', badge: '🎨 MASTERCLASS WORKSHOP', primary: '#A855F7', accent: '#EC4899' },
    { id: 'expo', category: 'Expo & Trade', name: '6. International Trade Expo (Industrial)', heroBg: 'linear-gradient(135deg, #18181B 0%, #09090B 100%)', badge: '🏛️ TRADE FAIR EXPO', primary: '#F97316', accent: '#E11D48' },
    { id: 'comedy', category: 'Comedy', name: '7. Comedy Night Showcase (Vibrant Amber)', heroBg: 'linear-gradient(135deg, #451A03 0%, #1A0601 100%)', badge: '🎭 COMEDY NIGHT SHOW', primary: '#F59E0B', accent: '#10B981' },
    { id: 'wedding', category: 'Wedding', name: '8. Luxury Wedding Gala (Blush Rose)', heroBg: 'linear-gradient(135deg, #2D0B1E 0%, #0F050B 100%)', badge: '💍 LUXURY WEDDING', primary: '#F43F5E', accent: '#F59E0B' },
    { id: 'university', category: 'University', name: '9. University Academic Campus Expo', heroBg: 'linear-gradient(135deg, #0A192F 0%, #020C1B 100%)', badge: '🎓 UNIVERSITY EXPO', primary: '#0284C7', accent: '#34D399' },
    { id: 'sports', category: 'Sports', name: '10. Sports Championship Arena', heroBg: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)', badge: '⚽ SPORTS CHAMPIONSHIP', primary: '#10B981', accent: '#F59E0B' },
    { id: 'corporate', category: 'Corporate', name: '11. Corporate Annual General Assembly', heroBg: 'linear-gradient(135deg, #0F172A 0%, #0284C7 100%)', badge: '🏢 CORPORATE ASSEMBLY', primary: '#0284C7', accent: '#38BDF8' },
    { id: 'fashion_week', category: 'Fashion Week', name: '12. High Fashion Runway Week', heroBg: 'linear-gradient(135deg, #881337 0%, #4C0519 100%)', badge: '👠 FASHION RUNWAY WEEK', primary: '#F43F5E', accent: '#FB7185' },
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
            <h1 style={{ fontSize: '26px', fontWeight: 900 }}>Event Website Builder OS</h1>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
            Build Framer-grade event websites with 12 category templates, custom domain connection, and instant ticket checkout.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-cta"
            style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#FFF' }}
            onClick={() => onToast(`🚀 Event Website Published Live to ${domainOption === 'free_subdomain' ? `${subdomainName}.getvnt.com` : customDomainInput}!`)}
          >
            <Sparkles size={15} /> Publish Event Website
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
        
        {/* Controls Sidebar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CMS Navigation Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'templates', label: 'Templates' },
              { id: 'content', label: 'Content' },
              { id: 'domains', label: 'Domains' },
              { id: 'sections', label: 'Sections' },
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

          {/* TAB 1: 12 TEMPLATES */}
          {activeCmsTab === 'templates' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px' }}>12 Event Category Templates</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                {templates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleTemplateChange(t.id)}
                    style={{
                      background: selectedTemplate === t.id ? 'rgba(37,99,235,0.18)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedTemplate === t.id ? '#2563EB' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '12px', padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>{t.name}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{t.category}</div>
                    </div>
                    {selectedTemplate === t.id && <CheckCircle2 size={16} color="#34D399" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & BRANDING */}
          {activeCmsTab === 'content' && (
            <>
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

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Venue Address</label>
                <input type="text" className="search-field" value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>CTA Button Label</label>
                <input type="text" className="search-field" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Primary Color</label>
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Accent Color</label>
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                </div>
              </div>
            </>
          )}

          {/* TAB 3: DOMAINS SETUP (3 OPTIONS) */}
          {activeCmsTab === 'domains' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px' }}>Domain Connection Options</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {/* Option 1: Free Subdomain */}
                <div
                  onClick={() => setDomainOption('free_subdomain')}
                  style={{
                    background: domainOption === 'free_subdomain' ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${domainOption === 'free_subdomain' ? '#2563EB' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', padding: '14px', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#FFF' }}>1. Free Subdomain</div>
                  <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '2px' }}>myevent.getvnt.com</div>
                </div>

                {/* Option 2: Custom Domain */}
                <div
                  onClick={() => setDomainOption('custom_domain')}
                  style={{
                    background: domainOption === 'custom_domain' ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${domainOption === 'custom_domain' ? '#2563EB' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', padding: '14px', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#FFF' }}>2. Bring Your Own Domain</div>
                  <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '2px' }}>www.africatechsummit.com</div>
                </div>

                {/* Option 3: Buy Domain */}
                <div
                  onClick={() => setDomainOption('buy_domain')}
                  style={{
                    background: domainOption === 'buy_domain' ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${domainOption === 'buy_domain' ? '#2563EB' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', padding: '14px', cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#FFF' }}>3. Buy Domain via GetVNT</div>
                  <div style={{ fontSize: '11.5px', color: '#34D399', marginTop: '2px' }}>Instant registration &amp; auto DNS setup</div>
                </div>
              </div>

              {/* Dynamic Inputs based on Option */}
              {domainOption === 'free_subdomain' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Choose Subdomain</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" className="search-field" style={{ borderRadius: '10px 0 0 10px' }} value={subdomainName} onChange={(e) => setSubdomainName(e.target.value)} />
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0 12px', height: '44px', display: 'flex', alignItems: 'center', fontSize: '12px', color: '#9CA3AF', borderRadius: '0 10px 10px 0', border: '1px solid rgba(255,255,255,0.1)' }}>.getvnt.com</span>
                  </div>
                </div>
              )}

              {domainOption === 'custom_domain' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Enter Custom Domain</label>
                  <input type="text" className="search-field" value={customDomainInput} onChange={(e) => setCustomDomainInput(e.target.value)} />
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px', marginTop: '10px', fontSize: '11px', color: '#9CA3AF' }}>
                    CNAME Record Target: <code style={{ color: '#60A5FA' }}>cname.getvnt.com</code><br />
                    Status: <span style={{ color: '#34D399', fontWeight: 800 }}>SSL Provisioned ✓</span>
                  </div>
                </div>
              )}

              {domainOption === 'buy_domain' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Search &amp; Buy New Domain</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="search-field" placeholder="e.g. myfestival2026.com" defaultValue="myfestival2026.com" />
                    <button className="tixup-btn-primary" style={{ padding: '0 16px', fontSize: '12px' }} onClick={() => onToast('Domain registered & DNS auto-configured!')}>
                      Buy ($12/yr)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SECTIONS & DRAG DROP */}
          {activeCmsTab === 'sections' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '10px' }}>Enabled Page Sections</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Hero Header Banner', 'Event Schedule & Agenda', 'Keynote Speakers Grid', 'Ticket Pricing Tiers', 'Sponsor Logos Grid', 'Venue Location Map', 'FAQ & Accordion'].map((sec, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#FFF' }}>
                    <span>{sec}</span>
                    <span style={{ color: '#34D399', fontWeight: 800, fontSize: '11px' }}>ENABLED ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Live Website Canvas Preview */}
        <div className="card" style={{ background: '#05070E', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Device Switcher Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={15} color="#34D399" /> Framer-Grade Website Canvas
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
                OFFICIAL WEBSITE
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
