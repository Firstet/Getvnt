import React, { useState } from 'react';
import { Share2, Sparkles, Copy, Check, Download, Image as ImageIcon, MessageSquare, Tag } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
}

export const PromotionAdStudio: React.FC<Props> = ({ onToast }) => {
  const [platform, setPlatform] = useState('instagram_post');
  const [eventName, setEventName] = useState('Afrobeat Festival Lagos 2026');
  const [copied, setCopied] = useState(false);

  const platforms = [
    { id: 'instagram_story', label: 'Instagram Story (9:16)' },
    { id: 'instagram_post', label: 'Instagram Post (1:1)' },
    { id: 'tiktok', label: 'TikTok Video Cover (9:16)' },
    { id: 'whatsapp', label: 'WhatsApp Status Banner' },
    { id: 'linkedin', label: 'LinkedIn Banner (16:9)' },
    { id: 'email_header', label: 'Email Newsletter Banner' },
  ];

  const aiCaptions: Record<string, string> = {
    instagram_story: "🔥 BIGGEST AFROBEATS FESTIVAL IS BACK! Tap link to grab early-bird passes before they sell out! 🎟️ #AfrobeatFest #Getvnt",
    instagram_post: "Lagos, get ready! 🚀 3 days of explosive live Afrobeats, VIP lounges & food culture at Eko Hotel. Tickets are officially LIVE on Getvnt!\n\n🎟️ Grab yours now: link in bio.\n\n#AfrobeatFest2026 #GetvntEvents #LagosNightlife #LiveConcert",
    tiktok: "POV: You secured early-bird tickets to Afrobeat Festival 2026 on @GetvntApp 🔥 Don't walk, RUN to the link in bio! 🏃💨",
    whatsapp: "⚡ GETVNT ALERT: Afrobeat Festival Lagos tickets are selling fast! Secure your VIP pass now: https://getvnt.com/e/afrobeat-2026",
    linkedin: "Excited to announce Getvnt as the official ticketing operating system for Afrobeat Festival 2026. Join 5,000+ industry leaders & delegates for Sub-Saharan Africa's premier cultural summit.",
    email_header: "Your VIP Pass for Afrobeat Festival Lagos 2026 is waiting! Claim early-bird tickets with exclusive 20% discount."
  };

  const currentCaption = aiCaptions[platform] || aiCaptions['instagram_post'];

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(currentCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('AI Social Caption copied!');
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>Event Promotion & Ad Studio</h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Generate social media ad flyers, AI captions, hashtags, and promotional campaign banners in seconds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Ad Controls */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} color="#06B6D4" /> Ad Campaign Channels
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Target Social Platform</label>
              <select className="search-field" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Event Name</label>
              <input type="text" className="search-field" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            </div>

            <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', padding: '14px', borderRadius: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase', marginBottom: '4px' }}>AI Hashtag Recommendation</div>
              <div style={{ fontSize: '13px', color: '#A5B4FC', fontWeight: 600 }}>#AfrobeatFest #GetvntEvents #LagosConcerts #LiveMusicAfrica</div>
            </div>

            <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', justifyContent: 'center', padding: '12px' }} onClick={() => onToast('AI Ad Campaign generated!')}>
              <Sparkles size={16} /> Generate Campaign Assets
            </button>
          </div>
        </div>

        {/* Generated Preview & AI Caption Window */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" style={{ background: '#0D1120', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px' }}>
              Visual Asset Preview ({platform.toUpperCase()})
            </div>
            <div style={{ width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src="/assets/afrobeat_festival_banner.png" alt="Flyer Preview" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div style={{ color: '#FFF', fontWeight: 800, fontSize: '16px' }}>{eventName}</div>
                <button className="btn-cta" style={{ padding: '6px 12px', fontSize: '12px', background: '#4F46E5', color: '#FFF' }} onClick={() => onToast('Downloaded Ad Flyer asset!')}>
                  <Download size={13} /> Download Flyer
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} /> AI Social Caption & Copy
              </div>
              <button className="btn-cta btn-cta-ghost" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleCopyCaption}>
                {copied ? <Check size={14} color="#34D399" /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Caption'}
              </button>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '13.5px', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {currentCaption}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
