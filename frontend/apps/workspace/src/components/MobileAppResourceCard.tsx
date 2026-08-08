import React, { useState } from 'react';
import { Smartphone, Download, QrCode, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useBrand } from '../../../../shared/src/context/BrandContext';

interface Props {
  onOpenModal: () => void;
}

export const MobileAppResourceCard: React.FC<Props> = ({ onOpenModal }) => {
  const { brand } = useBrand();
  const [showQr, setShowQr] = useState(false);

  return (
    <div
      className="mobile-app-resource-card"
      style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.12) 100%)',
        border: '1px solid rgba(37,99,235,0.3)',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        marginTop: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
              flexShrink: 0,
            }}
          >
            <Smartphone size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {brand?.platform_name || 'GETVNT'} Mobile
              </h3>
              <span style={{ fontSize: '10px', fontWeight: 900, background: 'rgba(34,197,94,0.15)', color: '#4ADE80', padding: '2px 8px', borderRadius: '99px', border: '1px solid rgba(34,197,94,0.3)' }}>
                v1.0 Available
              </span>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '4px 0 0 0' }}>
              Native Android client for event staff, high-speed QR check-in &amp; live sales monitoring.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href="/downloads/getvnt-organizer-v1.0.apk"
            download="getvnt-organizer-v1.0.apk"
            className="btn-cta"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#FFF',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
            }}
          >
            <Download size={15} /> Download APK
          </a>

          <button
            className="btn-cta"
            onClick={() => setShowQr(!showQr)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFF',
              padding: '10px 14px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <QrCode size={15} color="#60A5FA" /> {showQr ? 'Hide QR' : 'Scan QR'}
          </button>

          <button
            onClick={onOpenModal}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
            }}
          >
            Details <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {showQr && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <div style={{ background: '#FFF', padding: '12px', borderRadius: '14px', display: 'inline-block' }}>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=/downloads/getvnt-organizer-v1.0.apk"
              alt="Scan QR code to download GETVNT Mobile APK"
              style={{ width: '140px', height: '140px' }}
            />
          </div>
          <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '6px' }}>Scan with camera to install directly</div>
        </div>
      )}
    </div>
  );
};
