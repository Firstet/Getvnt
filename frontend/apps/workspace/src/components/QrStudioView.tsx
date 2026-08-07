import React, { useState } from 'react';
import { QrCode, Download, Eye, Sparkles, RefreshCw, BarChart2, Check, ShieldCheck } from 'lucide-react';

interface Props {
  token: string | null;
  onToast: (msg: string) => void;
}

export const QrStudioView: React.FC<Props> = ({ token, onToast }) => {
  const [qrType, setQrType] = useState('ticket');
  const [payload, setPayload] = useState('TICKET-94810-AFROBEAT');
  const [fgColor, setFgColor] = useState('#4F46E5');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [format, setFormat] = useState('png');
  const [qrData, setQrData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/workspace/qr/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qr_type: qrType,
          data_payload: payload,
          fg_color: fgColor,
          bg_color: bgColor,
          format: format
        })
      });
      const json = await res.json();
      if (json.success) {
        setQrData(json.data);
        onToast('Branded QR Code generated!');
      }
    } catch {
      onToast('Error generating QR Code.');
    } finally {
      setIsGenerating(false);
    }
  };

  const typesList = [
    { id: 'ticket', label: 'Attendee QR Ticket' },
    { id: 'event', label: 'Event Landing QR' },
    { id: 'checkin', label: 'Door Check-In Scanner' },
    { id: 'invoice', label: 'Invoice & Receipt QR' },
    { id: 'sponsor', label: 'Sponsor Booth QR' },
    { id: 'card', label: 'Business Card QR' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>Branded QR Code Studio</h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Generate custom vector QR codes for tickets, check-in, invoices, and sponsor booths with brand logos & analytics.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Controls Card */}
        <form onSubmit={handleGenerate} className="card">
          <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={18} color="#A5B4FC" /> QR Generator Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>QR Code Purpose</label>
              <select className="search-field" value={qrType} onChange={(e) => setQrType(e.target.value)}>
                {typesList.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Target Data Payload / Code</label>
              <input type="text" className="search-field" value={payload} onChange={(e) => setPayload(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Foreground Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: '40px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                  <input type="text" className="search-field" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Background Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '40px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                  <input type="text" className="search-field" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Export Format</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['png', 'svg', 'pdf', 'print_ready'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    className="btn-cta"
                    style={{
                      flex: 1, padding: '8px', fontSize: '12px', justifyContent: 'center', textTransform: 'uppercase',
                      background: format === f ? 'rgba(79,70,229,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${format === f ? 'rgba(79,70,229,0.4)' : 'rgba(255,255,255,0.08)'}`
                    }}
                    onClick={() => setFormat(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isGenerating} className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', justifyContent: 'center', padding: '12px', marginTop: '8px' }}>
              {isGenerating ? 'Generating...' : 'Generate Branded QR'}
            </button>
          </div>
        </form>

        {/* Live Canvas Preview Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0D1120', textAlign: 'center' }}>
          <div style={{
            width: '240px', height: '240px', background: bgColor, borderRadius: '24px', padding: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', marginBottom: '20px'
          }}>
            <img
              src={qrData?.qr_image_url || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&data=${encodeURIComponent(payload || 'GETVNT-TICKET-94810')}`}
              alt="Generated Branded QR Code"
              style={{ width: '190px', height: '190px', borderRadius: '12px', objectFit: 'contain' }}
            />
          </div>

          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800 }}>
            Type: <span style={{ color: '#A5B4FC' }}>{qrType.toUpperCase()}</span> • Format: <span style={{ color: '#06B6D4' }}>{format.toUpperCase()}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
            <a
              href={qrData?.qr_image_url || `https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&data=${encodeURIComponent(payload || 'GETVNT-TICKET-94810')}`}
              target="_blank"
              rel="noreferrer"
              download={`GETVNT-${qrType}-${payload}.${format}`}
              className="btn-cta"
              style={{ flex: 1, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', justifyContent: 'center', fontSize: '13px', textDecoration: 'none' }}
              onClick={() => onToast(`Downloaded branded QR asset in ${format.toUpperCase()} format!`)}
            >
              <Download size={14} /> Download {format.toUpperCase()} Asset
            </a>
          </div>
        </div>

      </div>

      {/* Analytics Telemetry */}
      {qrData && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} color="#34D399" />
            Live Scan Telemetry & Tracking
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px' }}>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>Total Door Scans</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', marginTop: '4px' }}>{qrData.analytics?.scans_count}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px' }}>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>Unique Gate Passers</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#34D399', marginTop: '4px' }}>{qrData.analytics?.unique_scanners}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px' }}>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>Last Gate Scan</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#A5B4FC', marginTop: '8px' }}>{new Date(qrData.analytics?.last_scanned_at).toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
