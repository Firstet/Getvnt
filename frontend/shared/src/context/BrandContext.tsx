import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ─── Brand Interface ───────────────────────────────────────────────────────────
export interface Brand {
  id?: number;
  // Identity
  platform_name: string;
  short_name: string;
  tagline: string;
  description?: string;
  // Logos & Media
  logo_light_url: string;
  logo_dark_url: string;
  logo_monochrome_url?: string;
  loader_logo_url?: string;
  splash_logo_url?: string;
  logo_icon_url: string;
  favicon_url: string;
  apple_touch_url?: string;
  hero_image_url: string;
  og_image_url?: string;
  // Theme Colors
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  success_color: string;
  warning_color: string;
  danger_color: string;
  // Typography & Style
  typography_family: string;
  border_radius: string;
  button_style: string;
  theme: 'dark' | 'light';
  // Contact & Legal
  support_email: string;
  support_phone?: string;
  office_address?: string;
  copyright_text: string;
  // JSON fields
  social_links?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    [key: string]: string | undefined;
  };
  footer_links?: Array<{ label: string; url: string; group: string }>;
  seo_default?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  // Google OAuth Credentials & Social Auth
  google_client_id?: string;
  google_client_secret?: string;
  google_login_enabled?: boolean;
  // Landing Page CMS JSON
  landing_page_cms?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_cta_text?: string;
    hero_cta_url?: string;
    hero_badge_text?: string;
    features?: Array<{ title: string; description: string; icon?: string }>;
    metrics?: Array<{ value: string; label: string }>;
    testimonials?: Array<{ quote: string; author: string; role: string; avatar_url?: string }>;
    faqs?: Array<{ question: string; answer: string }>;
  };
}

// ─── Default brand fallback (shown before API responds) ────────────────────────
const DEFAULT_BRAND: Brand = {
  platform_name:     'Getvnt',
  short_name:        'Getvnt',
  tagline:           "Discover & Experience Africa's Best Events",
  logo_light_url:      '/assets/logo-gradient.png',
  logo_dark_url:       '/assets/logo-white.png',
  logo_monochrome_url: '/assets/logo-black.png',
  loader_logo_url:     '/assets/logo-white.png',
  splash_logo_url:     '/assets/logo-gradient.png',
  logo_icon_url:       '/assets/logo-gradient.png',
  favicon_url:       '/assets/logo-gradient.png',
  hero_image_url:    '/assets/afrobeat_festival_banner.png',
  primary_color:     '#2563EB',
  secondary_color:   '#7C3AED',
  accent_color:      '#06B6D4',
  success_color:     '#10B981',
  warning_color:     '#F59E0B',
  danger_color:      '#EF4444',
  typography_family: 'Inter, sans-serif',
  border_radius:     '12px',
  button_style:      'rounded',
  theme:             'dark',
  support_email:     'support@getvnt.com',
  copyright_text:    '© 2026 Getvnt Technologies Ltd. All rights reserved.',
  social_links: {
    twitter:   'https://twitter.com/getvnt',
    instagram: 'https://instagram.com/getvnt',
    facebook:  'https://facebook.com/getvnt',
    linkedin:  'https://linkedin.com/company/getvnt',
    youtube:   'https://youtube.com/@getvnt',
    tiktok:    'https://tiktok.com/@getvnt',
  },
};

// ─── Context Shape ─────────────────────────────────────────────────────────────
interface BrandContextValue {
  brand: Brand;
  isLoading: boolean;
  refreshBrand: () => void;
}

const BrandContext = createContext<BrandContextValue>({
  brand:        DEFAULT_BRAND,
  isLoading:    true,
  refreshBrand: () => {},
});

// ─── CSS Custom Properties Injector ────────────────────────────────────────────
function applyBrandToCss(brand: Brand) {
  const root = document.documentElement;
  root.style.setProperty('--brand-primary',    brand.primary_color);
  root.style.setProperty('--brand-secondary',  brand.secondary_color);
  root.style.setProperty('--brand-accent',     brand.accent_color);
  root.style.setProperty('--brand-success',    brand.success_color);
  root.style.setProperty('--brand-warning',    brand.warning_color);
  root.style.setProperty('--brand-danger',     brand.danger_color);
  root.style.setProperty('--brand-radius',     brand.border_radius);
  root.style.setProperty('--brand-font',       brand.typography_family);

  // Update browser title + favicon dynamically
  if (brand.platform_name && document.title !== brand.platform_name) {
    // Don't overwrite page-specific titles set by individual pages
  }

  const favUrl = brand.favicon_url || '/assets/logo-gradient.png';
  ['icon', 'apple-touch-icon'].forEach((rel) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (existing) {
      existing.href = favUrl;
    } else {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = favUrl;
      document.head.appendChild(link);
    }
  });
}

// ─── BrandProvider ─────────────────────────────────────────────────────────────
export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brand, setBrand] = useState<Brand>(DEFAULT_BRAND);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBrand = useCallback(async () => {
    try {
      const res  = await fetch('http://localhost:8000/api/v1/brand');
      const json = await res.json();
      if (json.success && json.data) {
        const fetched: Brand = { ...DEFAULT_BRAND, ...json.data };
        setBrand(fetched);
        applyBrandToCss(fetched);
      }
    } catch {
      // API unavailable — fall back to defaults silently
      applyBrandToCss(DEFAULT_BRAND);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrand();

    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('getvnt_brand_sync');
      channel.onmessage = (event) => {
        if (event.data === 'brand_updated') {
          fetchBrand();
        }
      };
    }

    const handleCustomSync = () => fetchBrand();
    window.addEventListener('getvnt_brand_updated', handleCustomSync);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('getvnt_brand_updated', handleCustomSync);
    };
  }, [fetchBrand]);

  const refreshBrand = useCallback(() => {
    setIsLoading(true);
    fetchBrand().then(() => {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('getvnt_brand_sync');
        channel.postMessage('brand_updated');
        channel.close();
      }
      window.dispatchEvent(new CustomEvent('getvnt_brand_updated'));
    });
  }, [fetchBrand]);

  return (
    <BrandContext.Provider value={{ brand, isLoading, refreshBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

// ─── useBrand hook ─────────────────────────────────────────────────────────────
export const useBrand = (): BrandContextValue => {
  return useContext(BrandContext);
};
