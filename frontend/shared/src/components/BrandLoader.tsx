import React from 'react';
import { useBrand } from '../context/BrandContext';
import BrandConfig from '../config/brand';

export interface BrandLoaderProps {
  message?: string;
  theme?: 'dark' | 'light' | 'auto';
  mode?: 'full' | 'icon';
  fullScreen?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({
  message = 'Loading GETVNT...',
  theme = 'dark',
  mode = 'full',
  fullScreen = true,
  className = '',
  style = {},
}) => {
  const { brand } = useBrand();

  const isDark = theme === 'dark' || (theme === 'auto' && (brand?.theme === 'dark' || true));
  const logoSrc = mode === 'icon'
    ? (brand?.logo_icon_url || BrandConfig.icon)
    : isDark
      ? (brand?.logo_dark_url || BrandConfig.whiteLogo)
      : (brand?.logo_light_url || BrandConfig.primaryLogo);

  const bgColor = isDark ? '#07090F' : '#FFFFFF';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div
      className={`getvnt-brand-loader ${className}`}
      style={{
        position: fullScreen ? 'fixed' : 'relative',
        inset: 0,
        width: '100%',
        height: fullScreen ? '100vh' : '100%',
        minHeight: fullScreen ? '100vh' : '280px',
        background: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '24px',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease',
        ...style,
      }}
    >
      {/* Centered Brand Logo */}
      <div style={{ marginBottom: '20px', animation: 'brandPulse 2s infinite ease-in-out' }}>
        <img
          src={logoSrc}
          alt={brand?.platform_name || BrandConfig.appName}
          onError={(e) => {
            (e.target as HTMLImageElement).src = isDark ? '/assets/logo-white.png' : '/assets/logo-gradient.png';
          }}
          style={{ height: mode === 'icon' ? '42px' : '52px', width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* Signature Animated Three-Dot Loader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: brand?.primary_color || BrandConfig.primaryColor, animation: 'dotBounce 1.4s infinite ease-in-out 0s' }} />
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: brand?.secondary_color || BrandConfig.secondaryColor, animation: 'dotBounce 1.4s infinite ease-in-out 0.2s' }} />
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: brand?.accent_color || BrandConfig.accentColor, animation: 'dotBounce 1.4s infinite ease-in-out 0.4s' }} />
      </div>

      {/* Subtitle Message */}
      <div style={{ fontSize: '12.5px', fontWeight: 800, color: textColor, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
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

export default BrandLoader;
