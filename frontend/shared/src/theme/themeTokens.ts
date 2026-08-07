// ─── GETVNT ENTERPRISE DESIGN SYSTEM TOKENS ──────────────────────────────────
export const themeTokens = {
  colors: {
    // Primary Brand Palette
    primary: '#2563EB',       // Royal Blue (Primary actions, active navigation)
    primaryHover: '#1D4ED8',  // Deep Blue
    secondary: '#7C3AED',     // Purple (Reserved ONLY for AI Features & Intelligence)
    secondaryHover: '#6D28D9',
    accent: '#06B6D4',        // Electric Cyan (Telemetry & Accents)
    accentHover: '#0891B2',

    // Neutrals (Dark Canvas & Surfaces)
    bgCanvas: '#07090F',      // Application Main Background
    bgSurface: '#0D1222',     // Card & Modal Surface
    bgSurfaceHover: '#131A30',
    border: 'rgba(255, 255, 255, 0.08)',
    borderActive: 'rgba(37, 99, 235, 0.4)',

    // Typography Colors
    textPrimary: '#F8FAFC',   // Headings & High Contrast Text
    textSecondary: '#D1D5DB', // Body Copy
    textMuted: '#94A3B8',     // Subtitles & Micro Labels
    textDisabled: '#64748B',

    // Strict Status Colors
    success: '#10B981',       // Emerald Green (Active & Published Statuses)
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',       // Amber (Pending & Draft Statuses)
    warningBg: 'rgba(245, 158, 11, 0.15)',
    danger: '#EF4444',        // Rose Red (Errors & Destructive Actions)
    dangerBg: 'rgba(239, 68, 68, 0.15)',
    info: '#38BDF8',          // Sky Blue (Informational Badges)
    infoBg: 'rgba(56, 189, 248, 0.15)',
  },

  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    sizes: {
      display: { fontSize: '28px', fontWeight: 900, lineHeight: 1.2 },
      heading1: { fontSize: '22px', fontWeight: 900, lineHeight: 1.25 },
      heading2: { fontSize: '18px', fontWeight: 800, lineHeight: 1.3 },
      title: { fontSize: '15px', fontWeight: 800, lineHeight: 1.4 },
      body: { fontSize: '13.5px', fontWeight: 600, lineHeight: 1.5 },
      small: { fontSize: '12px', fontWeight: 600, lineHeight: 1.4 },
      caption: { fontSize: '11px', fontWeight: 800, letterSpacing: '0.6px', textTransform: 'uppercase' as const },
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    grid: '40px',
  },

  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    pill: '99px',
  },

  shadows: {
    card: '0 4px 20px rgba(0, 0, 0, 0.4)',
    hover: '0 10px 30px rgba(37, 99, 235, 0.25)',
    modal: '0 25px 60px rgba(0, 0, 0, 0.85)',
  },

  transitions: {
    fast: 'all 150ms ease',
    normal: 'all 200ms ease',
    slow: 'all 250ms ease-in-out',
  },
};
