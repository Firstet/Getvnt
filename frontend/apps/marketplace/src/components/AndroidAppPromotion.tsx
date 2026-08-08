import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, QrCode, Shield, Sparkles, Zap, Star } from 'lucide-react';
import { useBrand } from '../../../../shared/src/context/BrandContext';

export const AndroidAppPromotion: React.FC = () => {
  const { brand } = useBrand();
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'desktop'>('desktop');
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/i.test(ua)) {
      setDeviceType('android');
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  const featureBullets = [
    'Manage events anywhere on mobile',
    'Scan tickets instantly (<500ms validation)',
    'Real-time attendee check-in analytics',
    'GETVNT AI Assistant companion',
    'Instant push notifications & alerts',
    'Full offline QR verification mode',
  ];

  return (
    <section
      className="android-app-promotion-section"
      style={{
        margin: '64px 0 48px 0',
        background: 'linear-gradient(135deg, rgba(13,18,34,0.95) 0%, rgba(7,9,15,0.98) 100%)',
        border: '1px solid rgba(37,99,235,0.3)',
        borderRadius: '32px',
        padding: '48px 36px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      }}
    >
      {/* Background Soft Glow Radial Effect */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(124,58,237,0.1) 70%, transparent 100%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div className="android-promo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        {/* LEFT COLUMN: APPS SHOWCASE INFORMATION */}
        <div>
          {/* Category Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(37,99,235,0.18)',
              border: '1px solid rgba(37,99,235,0.4)',
              borderRadius: '99px',
              color: '#60A5FA',
              fontSize: '11px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '16px',
            }}
          >
            <Smartphone size={14} /> Official {brand?.platform_name || 'GETVNT'} Android OS v1.0
          </div>

          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>
            Take {brand?.platform_name || 'GETVNT'} Everywhere
          </h2>

          <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px', maxWidth: '520px' }}>
            Empower your event staff and managers with our native high-speed Android application. Execute instant ticket check-ins, view live revenue, and access AI event insights on the move.
          </p>

          {/* Feature Bullets Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px 18px', marginBottom: '32px' }}>
            {featureBullets.map((bullet, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E2E8F0', fontSize: '13.5px', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="android-btn-group" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {deviceType === 'ios' ? (
              <div
                style={{
                  padding: '14px 24px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#94A3B8',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span>🍎</span> Coming Soon for iOS (App Store)
              </div>
            ) : (
              <a
                href="/downloads/getvnt-organizer-v1.0.apk"
                download="getvnt-organizer-v1.0.apk"
                className="btn-cta"
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  color: '#FFFFFF',
                  padding: '14px 28px',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Download size={18} /> Download Android APK (v1.0)
              </a>
            )}

            {deviceType === 'desktop' && (
              <button
                className="btn-cta"
                onClick={() => setShowQrModal(true)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  padding: '14px 22px',
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <QrCode size={18} color="#60A5FA" /> Scan QR Code
              </button>
            )}

            <div
              style={{
                padding: '14px 20px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748B',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Star size={14} color="#F59E0B" /> Google Play Verification Pending
            </div>
          </div>

          {/* App Metadata Micro Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
            <span>Version: <strong style={{ color: '#94A3B8' }}>v1.0 Build 104</strong></span>
            <span>•</span>
            <span>Size: <strong style={{ color: '#94A3B8' }}>28.4 MB</strong></span>
            <span>•</span>
            <span>Min OS: <strong style={{ color: '#94A3B8' }}>Android 8.0+</strong></span>
            <span>•</span>
            <span>Updated: <strong style={{ color: '#94A3B8' }}>August 2026</strong></span>
          </div>
        </div>

        {/* RIGHT COLUMN: FLOATING MOCKUP SHOWCASE */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div
            className="floating-phone-wrapper"
            style={{
              position: 'relative',
              width: '270px',
              height: '520px',
              background: '#07090F',
              borderRadius: '44px',
              border: '6px solid #1E293B',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(37,99,235,0.25)',
              padding: '12px',
              animation: 'floatPhone 4s ease-in-out infinite',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Phone Top Notch */}
            <div
              style={{
                width: '90px',
                height: '16px',
                background: '#1E293B',
                borderRadius: '0 0 12px 12px',
                margin: '0 auto 8px auto',
              }}
            />

            {/* Screen UI Mockup */}
            <div
              style={{
                flex: 1,
                borderRadius: '30px',
                background: 'linear-gradient(180deg, #0D1222 0%, #07090F 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                overflow: 'hidden',
              }}
            >
              {/* Header inside phone screen */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 900, fontSize: '11px' }}>G</div>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#FFF' }}>{brand?.platform_name || 'GETVNT'} Mobile</span>
                </div>
                <span style={{ fontSize: '9px', background: 'rgba(34,197,94,0.15)', color: '#4ADE80', padding: '2px 6px', borderRadius: '99px', fontWeight: 800 }}>LIVE</span>
              </div>

              {/* Stat Cards inside screen */}
              <div style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: '14px', padding: '12px' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Today's Revenue</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', margin: '2px 0' }}>₦14,850,000</div>
                <div style={{ fontSize: '9.5px', color: '#34D399', fontWeight: 700 }}>↑ +24% vs yesterday</div>
              </div>

              {/* QR Scanner Screen Preview Box */}
              <div style={{ flex: 1, background: '#000', borderRadius: '16px', border: '1px dashed rgba(37,99,235,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px', textAlign: 'center', position: 'relative' }}>
                <div style={{ width: '80px', height: '80px', border: '2px solid #60A5FA', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <QrCode size={40} color="#60A5FA" />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8' }}>Ready to Scan Ticket</span>
                <span style={{ fontSize: '8.5px', color: '#64748B', marginTop: '2px' }}>Offline Queue Active</span>
              </div>

              {/* Quick Action Button inside phone screen */}
              <div style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: '12px', padding: '10px', color: '#FFF', fontSize: '11px', fontWeight: 800, textAlign: 'center' }}>
                Scan Attendee Pass
              </div>
            </div>

            {/* Bottom Indicator Bar */}
            <div style={{ width: '80px', height: '4px', background: '#334155', borderRadius: '99px', margin: '8px auto 0 auto' }} />
          </div>
        </div>
      </div>

      {/* QR Code Modal for Desktop Users */}
      {showQrModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setShowQrModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0D1222',
              border: '1px solid rgba(37,99,235,0.3)',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '8px' }}>
              Scan to Download Android APK
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '20px' }}>
              Point your Android phone camera at the QR code below to download the official {brand?.platform_name || 'GETVNT'} Mobile App.
            </p>

            <div style={{ background: '#FFF', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '20px' }}>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=/downloads/getvnt-organizer-v1.0.apk"
                alt="Scan to Download GETVNT Android APK"
                style={{ width: '180px', height: '180px' }}
              />
            </div>

            <button
              className="btn-cta"
              onClick={() => setShowQrModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                background: '#1E293B',
                color: '#FFF',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatPhone {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @media (max-width: 768px) {
          .android-app-promotion-section {
            padding: 28px 20px !important;
            margin: 40px 0 32px 0 !important;
            border-radius: 24px !important;
          }

          .floating-phone-wrapper {
            width: 230px !important;
            height: 440px !important;
            border-width: 4px !important;
            border-radius: 36px !important;
          }

          .android-promo-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }

          .android-btn-group {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .android-btn-group > * {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
};
