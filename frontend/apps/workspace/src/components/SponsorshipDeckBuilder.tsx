import React, { useState } from 'react';
import { Briefcase, Download, Sparkles, FileText, CheckCircle2, DollarSign, Eye } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
}

export const SponsorshipDeckBuilder: React.FC<Props> = ({ onToast }) => {
  const [eventName, setEventName] = useState('Afrobeat Festival Lagos 2026');
  const [targetSponsors, setTargetSponsors] = useState('Fintech & Beverage Brands');
  const [proposalOutput, setProposalOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDeck = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setProposalOutput(
        `## 🤝 SPONSORSHIP PITCH DECK & PROPOSAL\n` +
        `**Event**: ${eventName}\n` +
        `**Target Industry**: ${targetSponsors}\n\n` +
        `### Tier 1: Title Platinum Sponsor (₦10,000,000 / $12,500)\n` +
        `- Full Naming Rights: "${eventName} Powered by [Sponsor Brand]"\n` +
        `- Sponsor Logo Embedded in Center of 5,000+ Digital Ticket QR Codes\n` +
        `- Dedicated Main Stage Backdrop & VIP Lounge Naming Rights\n` +
        `- 15 VIP All-Access Gate Passes\n\n` +
        `### Tier 2: Gold Sponsor (₦5,000,000 / $6,250)\n` +
        `- Prominent Logo Placement on Marketplace & Email Banners\n` +
        `- Dedicated Sponsor Activation Booth (20m x 20m)\n` +
        `- 8 VIP All-Access Passes\n\n` +
        `### Expected Brand Exposure Telemetry\n` +
        `• 125,000+ Impression Views Across Social Ads & Email Sequences\n` +
        `• 5,000+ Direct In-Person Scans at Gate Check-In`
      );
      setIsGenerating(false);
      onToast('Sponsorship Pitch Deck generated!');
    }, 800);
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>AI Sponsorship Deck & Proposal Builder</h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Generate professional pitch decks, sponsorship tier proposals, contracts, and post-event brand visibility reports.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Pitch Deck Generator Controls */}
        <div className="card">
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="#06B6D4" /> Sponsor Deck Parameters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Event Name</label>
              <input type="text" className="search-field" value={eventName} onChange={(e) => setEventName(e.target.value)} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Target Sponsor Categories</label>
              <input type="text" className="search-field" value={targetSponsors} onChange={(e) => setTargetSponsors(e.target.value)} />
            </div>

            <button
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', justifyContent: 'center', padding: '12px' }}
              onClick={handleGenerateDeck}
              disabled={isGenerating}
            >
              <Sparkles size={16} /> {isGenerating ? 'Building Proposal...' : 'Build AI Sponsorship Deck'}
            </button>
          </div>
        </div>

        {/* Generated Deck Window */}
        <div className="card" style={{ background: '#0D1120', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', color: '#A5B4FC' }}>Proposal Output Preview</div>
            {proposalOutput && (
              <button className="btn-cta" style={{ padding: '6px 12px', fontSize: '12px', background: '#4F46E5', color: '#FFF' }} onClick={() => onToast('Downloaded Sponsorship Pitch Deck PDF!')}>
                <Download size={14} /> Download Pitch Deck PDF
              </button>
            )}
          </div>

          {proposalOutput ? (
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.7', color: '#F3F4F6', background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {proposalOutput}
            </div>
          ) : (
            <div className="loading-pulse" style={{ minHeight: '220px', flexDirection: 'column' }}>
              <Briefcase size={36} color="#4B5563" />
              <span style={{ color: '#4B5563', marginTop: '8px' }}>Click "Build AI Sponsorship Deck" to generate proposal</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
