import React, { useState, useEffect } from 'react';
import { Smartphone, Download, QrCode, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useBrand } from '../../../../shared/src/context/BrandContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const AndroidAppModal: React.FC<Props> = ({ isOpen, onClose, onDownload }) => {
  const { brand } = useBrand();
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const handleDontShowAgain = () => {
    localStorage.setItem('getvnt_hide_app_modal', 'true');
    onClose();
  };

  const featureGrid = [
    'Event Management on Mobile',
    'Sub-500ms QR Ticket Scanner',
    'Conversational AI Assistant',
    'Instant Push Notifications',
    'Real-time Sales Analytics',
    'Full Offline Check-in Sync',
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0D1222 0%, #07090F 100%)',
          border: '1px solid rgba(37,99,235,0.35)',
          borderRadius: '28px',
          padding: '32px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 30px rgba(37,99,235,0.2)',
          position: 'relative',
        }}
      >
        {/* Close X Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#9CA3AF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', borderRadius: '99px', color: '#60A5FA', fontSize: '12px', fontWeight: 900, marginBottom: '16px' }}>
          📱 {brand?.platform_name || 'GETVNT'} Mobile is Here
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', marginBottom: '10px' }}>
          Manage Your Events Anywhere
        </h2>

        <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px' }}>
          Create events, monitor ticket sales, scan attendees, receive AI recommendations, and manage your business directly from your Android device.
        </p>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 14px', marginBottom: '28px', background: '#07090F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
          {featureGrid.map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontSize: '12.5px', fontWeight: 600 }}>
              <CheckCircle2 size={14} color="#34D399" style={{ flexShrink: 0 }} />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* QR Code toggle view */}
        {showQr ? (
          <div style={{ textAlign: 'center', marginBottom: '24px', background: '#FFF', padding: '16px', borderRadius: '16px', display: 'inline-block', width: '100%' }}>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=/downloads/getvnt-organizer-v1.0.apk"
              alt="Scan to download APK"
              style={{ width: '160px', height: '160px', margin: '0 auto' }}
            />
            <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: 800, marginTop: '8px' }}>Scan with your Android camera</div>
          </div>
        ) : null}

        {/* Modal Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href="/downloads/getvnt-organizer-v1.0.apk"
              download="getvnt-organizer-v1.0.apk"
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="btn-cta"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFF',
                padding: '13px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '13.5px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(37,99,235,0.4)',
              }}
            >
              <Download size={16} /> Download APK (v1.0)
            </a>

            <button
              className="btn-cta"
              onClick={() => setShowQr(!showQr)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFF',
                padding: '13px 18px',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <QrCode size={16} color="#60A5FA" /> {showQr ? 'Hide QR' : 'QR Code'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
            >
              Remind Me Later
            </button>

            <button
              onClick={handleDontShowAgain}
              style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Don't show this again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
