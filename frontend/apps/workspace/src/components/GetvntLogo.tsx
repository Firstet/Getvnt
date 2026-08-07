import React from 'react';
import { useBrand } from '../../../../shared/src';

export interface LogoProps {
  variant?: 'gradient' | 'white' | 'black' | 'auto';
  mode?: 'full' | 'icon';
  theme?: 'dark' | 'light';
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export const GetvntLogo: React.FC<LogoProps> = ({
  variant = 'auto',
  mode = 'full',
  theme = 'dark',
  height,
  className = '',
  style = {},
  alt,
}) => {
  const { brand } = useBrand();

  let logoSrc = brand.logo_light_url || '/assets/logo-gradient.png';

  if (mode === 'icon') {
    logoSrc = brand.logo_icon_url || '/assets/logo-gradient.png';
  } else if (variant === 'white' || (variant === 'auto' && theme === 'dark')) {
    logoSrc = brand.logo_dark_url || '/assets/logo-white.png';
  } else if (variant === 'black' || (variant === 'auto' && theme === 'light')) {
    logoSrc = '/assets/logo-black.png';
  } else if (variant === 'gradient') {
    logoSrc = brand.logo_light_url || '/assets/logo-gradient.png';
  }

  const computedHeight = height || (mode === 'icon' ? '32px' : '40px');

  return (
    <img
      src={logoSrc}
      alt={alt || brand.platform_name || 'GETVNT Enterprise Event Operations Platform'}
      className={`getvnt-logo getvnt-logo-${mode} ${className}`}
      style={{
        height: typeof computedHeight === 'number' ? `${computedHeight}px` : computedHeight,
        width: 'auto',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        ...style,
      }}
    />
  );
};

export default GetvntLogo;
