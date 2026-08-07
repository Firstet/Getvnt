import React from 'react';
import BrandConfig from '../config/brand';

export interface AppLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  message = 'Loading GETVNT...',
  fullScreen = true,
}) => {
  return (
    <div
      style={{
        position: fullScreen ? 'fixed' : 'relative',
        inset: 0,
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        minHeight: fullScreen ? '100vh' : '300px',
        background: '#07090F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '24px',
      }}
    >
      {/* Centered Brand Logo */}
      <div style={{ marginBottom: '24px', animation: 'brandPulse 2s infinite ease-in-out' }}>
        <img
          src={BrandConfig.whiteLogo}
          alt={BrandConfig.appName}
          style={{ height: '54px', width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Bouncing Dots Loading Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563EB', animation: 'dotBounce 1.4s infinite ease-in-out 0s' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7C3AED', animation: 'dotBounce 1.4s infinite ease-in-out 0.2s' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06B6D4', animation: 'dotBounce 1.4s infinite ease-in-out 0.4s' }} />
      </div>

      {/* Loading Subtitle */}
      <div style={{ fontSize: '13px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
        {message}
      </div>

      <style>{`
        @keyframes brandPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(0.98); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
