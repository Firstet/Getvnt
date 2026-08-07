import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  fallbackText?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  style = {},
  wrapperStyle = {},
  aspectRatio,
  objectFit = 'cover',
  fallbackText,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div
      className="lazy-image-wrapper"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: style.borderRadius || 'inherit',
        aspectRatio: aspectRatio || 'auto',
        width: style.width || '100%',
        height: style.height || '100%',
        ...wrapperStyle,
      }}
    >
      {/* Animated Skeleton Shimmer Placeholder while loading */}
      {!isLoaded && !isError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
            backgroundSize: '200% 100%',
            animation: 'lazyShimmer 1.5s infinite linear',
            zIndex: 1,
          }}
        />
      )}

      {/* Fallback Badge if Image fails to load */}
      {isError ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(239,68,68,0.1))',
            border: '1px dashed rgba(255,255,255,0.15)',
            color: '#9CA3AF',
            fontSize: '12px',
            padding: '12px',
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          <ImageIcon size={20} color="#60A5FA" style={{ marginBottom: '4px' }} />
          <span>{fallbackText || alt || 'Media Image'}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          className={className}
          style={{
            width: '100%',
            height: '100%',
            objectFit,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease',
            ...style,
          }}
        />
      )}
    </div>
  );
};

// ─── ROBUST LAZY LOGO COMPONENT FOR BRAND & TENANT LOGOS ─────────────────────
export interface LazyLogoProps {
  src?: string;
  alt?: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  fallbackIcon?: React.ReactNode;
  fallbackText?: string;
}

export const LazyLogo: React.FC<LazyLogoProps> = ({
  src,
  alt = 'GETVNT',
  size = 32,
  className = '',
  style = {},
  fallbackIcon = <span style={{ fontSize: '18px' }}>⚡</span>,
  fallbackText,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const dim = typeof size === 'number' ? `${size}px` : size;

  if (!src || isError) {
    return (
      <div
        className={`lazy-logo-fallback ${className}`}
        style={{
          width: dim,
          height: dim,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(6,182,212,0.2))',
          border: '1px solid rgba(37,99,235,0.35)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          fontSize: '12px',
          fontWeight: 800,
          flexShrink: 0,
          ...style,
        }}
      >
        {fallbackText ? fallbackText.charAt(0).toUpperCase() : fallbackIcon}
      </div>
    );
  }

  return (
    <div
      className={`lazy-logo-wrapper ${className}`}
      style={{
        width: dim,
        height: dim,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="eager"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          opacity: isLoaded ? 1 : 0.8,
          transition: 'opacity 0.2s ease-in-out',
        }}
      />
    </div>
  );
};
