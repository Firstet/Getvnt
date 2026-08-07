import React, { useState } from 'react';
import {
  Palette, Sparkles, Download, Layout, ShieldCheck, Ticket as TicketIcon, Move, Grid, RotateCcw,
  RotateCw, Copy, Trash2, Eye, Printer, FileText, Image, Check, Layers, Sliders, Smartphone, Monitor
} from 'lucide-react';

interface TicketElement {
  id: string;
  name: string;
  type: 'qr' | 'logo' | 'attendee' | 'seat' | 'barcode' | 'sponsor' | 'details' | 'watermark';
  x: number;
  y: number;
  visible: boolean;
}

interface Props {
  onToast: (msg: string) => void;
}

export const TicketDesignerDesk: React.FC<Props> = ({ onToast }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('classic_portrait');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'square' | 'custom'>('portrait');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'print' | 'pdf'>('desktop');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showBleedGuides, setShowBleedGuides] = useState(true);

  // Form Fields
  const [ticketTitle, setTicketTitle] = useState('AFROBEAT FESTIVAL LAGOS 2026');
  const [ticketSub, setTicketSub] = useState('VIP FAST-TRACK ACCESS + LOUNGE PASS');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [accentColor, setAccentColor] = useState('#7C3AED');
  const [seatNumber, setSeatNumber] = useState('VIP-SECTION-A12');
  const [watermarkText, setWatermarkText] = useState('GETVNT OFFICIAL VIP');

  // Draggable Canvas Elements State
  const [elements, setElements] = useState<TicketElement[]>([
    { id: 'el_logo', name: 'GETVNT Logo', type: 'logo', x: 24, y: 20, visible: true },
    { id: 'el_details', name: 'Event Details', type: 'details', x: 24, y: 80, visible: true },
    { id: 'el_attendee', name: 'Attendee Name', type: 'attendee', x: 24, y: 160, visible: true },
    { id: 'el_seat', name: 'Seat & Access Zone', type: 'seat', x: 240, y: 160, visible: true },
    { id: 'el_qr', name: 'Encrypted QR Code', type: 'qr', x: 320, y: 20, visible: true },
    { id: 'el_barcode', name: 'High-Res Barcode', type: 'barcode', x: 24, y: 240, visible: true },
    { id: 'el_sponsor', name: 'Sponsor Logos', type: 'sponsor', x: 24, y: 290, visible: true },
    { id: 'el_watermark', name: 'Anti-Forgery Watermark', type: 'watermark', x: 10, y: 120, visible: true },
  ]);

  const [activeElementId, setActiveElementId] = useState<string | null>('el_qr');

  // 10 Professional Ticket Templates
  const templates = [
    { id: 'classic_portrait', name: '1. Classic Portrait Pass', primary: '#2563EB', accent: '#38BDF8', defaultOrientation: 'portrait' },
    { id: 'classic_landscape', name: '2. Classic Landscape Stub', primary: '#4F46E5', accent: '#06B6D4', defaultOrientation: 'landscape' },
    { id: 'modern_minimal', name: '3. Modern Minimal Monochrome', primary: '#18181B', accent: '#71717A', defaultOrientation: 'portrait' },
    { id: 'luxury_gold', name: '4. Luxury Gold & Onyx VIP', primary: '#D97706', accent: '#FBBF24', defaultOrientation: 'portrait' },
    { id: 'corporate', name: '5. Corporate Conference Badge', primary: '#0284C7', accent: '#38BDF8', defaultOrientation: 'portrait' },
    { id: 'festival', name: '6. Festival Wristband Ticket', primary: '#EC4899', accent: '#8B5CF6', defaultOrientation: 'landscape' },
    { id: 'vip_lounge', name: '7. VIP Lounge & Backstage Pass', primary: '#7C3AED', accent: '#EC4899', defaultOrientation: 'portrait' },
    { id: 'live_concert', name: '8. Live Concert Hologram Pass', primary: '#DC2626', accent: '#F59E0B', defaultOrientation: 'landscape' },
    { id: 'wedding', name: '9. Luxury Wedding Guest Pass', primary: '#F43F5E', accent: '#F59E0B', defaultOrientation: 'portrait' },
    { id: 'creative', name: '10. Creative Agency Ticket', primary: '#10B981', accent: '#06B6D4', defaultOrientation: 'portrait' },
  ];

  const handleTemplateChange = (id: string) => {
    setSelectedTemplate(id);
    const preset = templates.find((t) => t.id === id);
    if (preset) {
      setPrimaryColor(preset.primary);
      setAccentColor(preset.accent);
      setOrientation(preset.defaultOrientation as any);
    }
  };

  const handleToggleElementVisibility = (id: string) => {
    setElements((prev) => prev.map((el) => el.id === id ? { ...el, visible: !el.visible } : el));
  };

  const handleDragElement = (id: string, deltaX: number, deltaY: number) => {
    setElements((prev) => prev.map((el) => {
      if (el.id === id) {
        let newX = el.x + deltaX;
        let newY = el.y + deltaY;
        if (snapToGrid) {
          newX = Math.round(newX / 10) * 10;
          newY = Math.round(newY / 10) * 10;
        }
        return { ...el, x: Math.max(0, newX), y: Math.max(0, newY) };
      }
      return el;
    }));
  };

  const handleExport = (format: string) => {
    onToast(`Exporting Ticket Design as ${format.toUpperCase()} (Print-Ready 300DPI)...`);
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>Visual Drag &amp; Drop Ticket Designer</h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Customize digital passes, printable PDF stubs, security watermarks, and QR barcode positioning.
          </p>
        </div>

        {/* Export Toolbar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-cta" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }} onClick={() => handleExport('PNG')}>
            <Download size={15} /> Export PNG
          </button>
          <button className="btn-cta" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }} onClick={() => handleExport('SVG')}>
            <Download size={15} /> Export SVG
          </button>
          <button className="btn-cta" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#FFF' }} onClick={() => handleExport('Print Ready PDF')}>
            <Printer size={15} /> Export PDF Pass
          </button>
        </div>
      </div>

      {/* Main Designer Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
        
        {/* Controls Sidebar */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>10 Ticket Templates</label>
            <select className="search-field" value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)}>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Ticket Orientation</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {(['portrait', 'landscape', 'square', 'custom'] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => setOrientation(o)}
                  style={{
                    padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, textTransform: 'capitalize',
                    background: orientation === o ? '#2563EB' : 'rgba(255,255,255,0.04)',
                    border: orientation === o ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.08)',
                    color: orientation === o ? '#FFF' : '#9CA3AF', cursor: 'pointer'
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Event Main Title</label>
            <input type="text" className="search-field" value={ticketTitle} onChange={(e) => setTicketTitle(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Ticket Subtitle / Tier</label>
            <input type="text" className="search-field" value={ticketSub} onChange={(e) => setTicketSub(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Seat Number / Zone</label>
            <input type="text" className="search-field" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Anti-Forgery Watermark Text</label>
            <input type="text" className="search-field" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Theme</label>
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Accent</label>
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
            </div>
          </div>

          {/* Draggable Layer Toggles */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Draggable Elements &amp; Layers</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {elements.map((el) => (
                <div key={el.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: el.visible ? '#FFF' : '#6B7280', fontWeight: 700 }}>{el.name}</span>
                  <button onClick={() => handleToggleElementVisibility(el.id)} style={{ background: 'none', border: 'none', color: el.visible ? '#34D399' : '#9CA3AF', cursor: 'pointer', fontSize: '11px', fontWeight: 800 }}>
                    {el.visible ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Live Drag & Drop Canvas Studio */}
        <div className="card" style={{ background: '#05070E', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Canvas Toolbar */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
            <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={15} color="#34D399" /> Live Visual Ticket Canvas Studio
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSnapToGrid(!snapToGrid)} style={{ background: snapToGrid ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)', border: snapToGrid ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.08)', color: snapToGrid ? '#60A5FA' : '#9CA3AF', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Grid size={13} /> Snap to Grid
              </button>

              <button onClick={() => setShowBleedGuides(!showBleedGuides)} style={{ background: showBleedGuides ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)', border: showBleedGuides ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.08)', color: showBleedGuides ? '#C084FC' : '#9CA3AF', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={13} /> Bleed Guides
              </button>
            </div>
          </div>

          {/* Rendered Ticket Canvas */}
          <div
            style={{
              width: orientation === 'landscape' ? '540px' : orientation === 'square' ? '420px' : '420px',
              height: orientation === 'landscape' ? '320px' : orientation === 'square' ? '420px' : '520px',
              borderRadius: '24px', overflow: 'hidden', position: 'relative',
              background: `linear-gradient(135deg, ${primaryColor}E6 0%, #0B0F19 100%)`,
              border: `1px solid ${accentColor}66`, boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
              padding: '24px', color: '#FFF', transition: 'all 0.3s ease', margin: '20px 0'
            }}
          >
            {/* Bleed Safety Guides */}
            {showBleedGuides && (
              <div style={{ position: 'absolute', inset: '10px', border: '1px dashed rgba(239, 68, 68, 0.4)', borderRadius: '18px', pointerEvents: 'none' }}>
                <span style={{ position: 'absolute', top: '4px', left: '8px', fontSize: '9px', color: '#F87171', fontWeight: 800 }}>PRINT BLEED GUIDE</span>
              </div>
            )}

            {/* Watermark Element */}
            {elements.find((el) => el.id === 'el_watermark')?.visible && (
              <div style={{ position: 'absolute', top: '40%', left: '-10%', transform: 'rotate(-25deg)', fontSize: '26px', fontWeight: 900, color: 'rgba(255,255,255,0.06)', pointerEvents: 'none', letterSpacing: '4px', width: '120%' }}>
                {watermarkText.toUpperCase()}
              </div>
            )}

            {/* Header / Logo */}
            {elements.find((el) => el.id === 'el_logo')?.visible && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <img src="/assets/getvnt-logo-white.png" alt="Getvnt" loading="lazy" style={{ height: '26px', objectFit: 'contain', marginBottom: '6px' }} />
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: accentColor }}>OFFICIAL TICKET PASS</div>
                </div>
                <span style={{ background: accentColor, color: '#000', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                  {selectedTemplate.replace('_', ' ')}
                </span>
              </div>
            )}

            {/* Details */}
            {elements.find((el) => el.id === 'el_details')?.visible && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1.2 }}>{ticketTitle}</div>
                <div style={{ fontSize: '12.5px', color: '#D1D5DB', marginTop: '4px' }}>{ticketSub}</div>
              </div>
            )}

            {/* Attendee & Seat Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px dashed rgba(255,255,255,0.15)', borderBottom: '1px dashed rgba(255,255,255,0.15)', padding: '16px 0', marginBottom: '20px' }}>
              {elements.find((el) => el.id === 'el_attendee')?.visible && (
                <div>
                  <div style={{ fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', color: '#9CA3AF' }}>Attendee Name</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFF' }}>Dr. Kelvin Firste</div>
                </div>
              )}

              {elements.find((el) => el.id === 'el_seat')?.visible && (
                <div>
                  <div style={{ fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', color: '#9CA3AF' }}>Seat / Access Zone</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: accentColor }}>{seatNumber}</div>
                </div>
              )}
            </div>

            {/* QR Code & Barcode Stub */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '9.5px', color: '#9CA3AF', fontWeight: 700 }}>VERIFIED BY GETVNT PLATFORM</div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFF', fontFamily: 'monospace' }}>TKT-9048-AFRO-2026</div>
              </div>

              {elements.find((el) => el.id === 'el_qr')?.visible && (
                <div style={{ width: '56px', height: '56px', background: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GETVNT-TKT-9048-AFRO-2026" alt="QR Code" loading="lazy" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
