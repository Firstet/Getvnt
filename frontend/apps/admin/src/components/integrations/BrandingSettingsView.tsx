import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon, Upload, Save, Sparkles, Palette,
  Globe, Mail, Phone, MapPin, Link, Eye, RefreshCw, Check
} from 'lucide-react';
import { LazyImage, useBrand } from '../../../../../shared/src';

interface Props {
  onToast: (msg: string) => void;
}

const DEFAULT_BRAND = {
  // Identity
  platform_name:     'Getvnt',
  short_name:        'Getvnt',
  tagline:           "Discover & Experience Africa's Best Events",
  description:       "Africa's leading event discovery, ticketing and entertainment intelligence platform.",
  // Logos & Media
  logo_light_url:    '/assets/logo-gradient.png',
  logo_dark_url:     '/assets/logo-white.png',
  logo_icon_url:     '/assets/icon.png',
  favicon_url:       '/assets/icon.png',
  hero_image_url:    '/assets/afrobeat_festival_banner.png',
  // Colors
  primary_color:     '#4F46E5',
  secondary_color:   '#7C3AED',
  accent_color:      '#06B6D4',
  success_color:     '#10B981',
  warning_color:     '#F59E0B',
  danger_color:      '#EF4444',
  // Typography
  typography_family: 'Inter, sans-serif',
  border_radius:     '12px',
  button_style:      'rounded',
  // Contact & Legal
  support_email:     'support@getvnt.com',
  support_phone:     '+234 800 GETVNT',
  office_address:    'Victoria Island, Lagos, Nigeria',
  copyright_text:    '© 2026 Getvnt Technologies Ltd. All rights reserved.',
  // Social
  social_links: {
    twitter:   'https://twitter.com/getvnt',
    instagram: 'https://instagram.com/getvnt',
    facebook:  'https://facebook.com/getvnt',
    linkedin:  'https://linkedin.com/company/getvnt',
    youtube:   'https://youtube.com/@getvnt',
    tiktok:    'https://tiktok.com/@getvnt',
  },
};

export const BrandingSettingsView: React.FC<Props> = ({ onToast }) => {
  const { refreshBrand } = useBrand();
  const [brand, setBrand] = useState<any>(DEFAULT_BRAND);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const logoLightRef = useRef<HTMLInputElement>(null);
  const logoDarkRef  = useRef<HTMLInputElement>(null);
  const logoMonoRef  = useRef<HTMLInputElement>(null);
  const loaderRef    = useRef<HTMLInputElement>(null);
  const splashRef    = useRef<HTMLInputElement>(null);
  const logoIconRef  = useRef<HTMLInputElement>(null);
  const faviconRef   = useRef<HTMLInputElement>(null);
  const heroRef      = useRef<HTMLInputElement>(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  // Load current brand from registry
  useEffect(() => {
    fetch('/api/v1/brand')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setBrand((prev: any) => ({ ...prev, ...json.data }));
        }
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fieldName);
    try {
      const res  = await fetch('/api/v1/admin/brand/upload-logo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}` },
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.url) {
        const updated = { ...brand, [fieldName]: json.url };
        setBrand(updated);
        refreshBrand();
        onToast(`✅ ${fieldName.replace(/_url$/, '').replace(/_/g, ' ')} uploaded & synchronized live globally!`);
      } else {
        onToast(json.message || 'Upload failed.');
      }
    } catch {
      onToast('Error uploading media asset.');
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res  = await fetch('/api/v1/admin/brand', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(brand),
      });
      const data = await res.json();
      if (data.success) {
        refreshBrand();
        onToast('✅ Platform Brand Registry saved successfully! All apps will reflect changes.');
      } else {
        onToast(data.message || 'Failed to save brand settings.');
      }
    } catch {
      onToast('Error saving brand settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSocial = (key: string, val: string) => {
    setBrand({ ...brand, social_links: { ...brand.social_links, [key]: val } });
  };

  const mediaFields = [
    { key: 'logo_light_url',      label: 'Gradient / Color Logo (Light BG)', ref: logoLightRef, bg: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)' },
    { key: 'logo_dark_url',       label: 'White Logo (Dark BG & Dashboards)', ref: logoDarkRef,  bg: '#07090F', border: '1px dashed rgba(255,255,255,0.15)' },
    { key: 'logo_monochrome_url', label: 'Black / Monochrome Logo (Invoices/PDFs)', ref: logoMonoRef, bg: '#F3F4F6', border: '1px solid rgba(0,0,0,0.1)' },
    { key: 'loader_logo_url',     label: 'App Loader & Lazy Loading Logo', ref: loaderRef,   bg: '#0A0A0A', border: '1px solid rgba(37,99,235,0.3)' },
    { key: 'splash_logo_url',     label: 'Splash Screen Logo (Mobile & PWA)', ref: splashRef,   bg: '#0A0A0A', border: '1px solid rgba(124,58,237,0.3)' },
    { key: 'logo_icon_url',       label: 'App Icon Mark (G + Ticket Mark)',  ref: logoIconRef,  bg: '#111827', border: '1px solid rgba(255,255,255,0.05)' },
    { key: 'favicon_url',         label: 'Browser Favicon (.ico / .png)',    ref: faviconRef,   bg: '#111827', border: '1px solid rgba(255,255,255,0.05)' },
    { key: 'hero_image_url',      label: 'Marketplace Hero Banner',          ref: heroRef,      bg: '#07090F', border: '1px solid rgba(255,255,255,0.05)' },
  ];

  const colorFields = [
    { key: 'primary_color',   label: 'Primary Brand Color' },
    { key: 'secondary_color', label: 'Secondary Color' },
    { key: 'accent_color',    label: 'Accent / Highlight Color' },
    { key: 'success_color',   label: 'Success / Positive Color' },
    { key: 'warning_color',   label: 'Warning Color' },
    { key: 'danger_color',    label: 'Error / Danger Color' },
  ];

  const socialNetworks = [
    { key: 'twitter',   label: 'Twitter / X',  placeholder: 'https://twitter.com/yourhandle' },
    { key: 'instagram', label: 'Instagram',     placeholder: 'https://instagram.com/yourhandle' },
    { key: 'facebook',  label: 'Facebook',      placeholder: 'https://facebook.com/yourpage' },
    { key: 'linkedin',  label: 'LinkedIn',      placeholder: 'https://linkedin.com/company/yourco' },
    { key: 'youtube',   label: 'YouTube',       placeholder: 'https://youtube.com/@yourchannel' },
    { key: 'tiktok',    label: 'TikTok',        placeholder: 'https://tiktok.com/@yourhandle' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Platform Brand Registry</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            The single source of truth. Every change here instantly propagates to the Marketplace, Organizer OS, and all public-facing surfaces.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => setShowPreview(!showPreview)}>
            <Eye size={15} /> {showPreview ? 'Hide' : 'Show'} Live Preview
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
            {isSaving ? 'Saving…' : 'Save Brand Registry'}
          </button>
        </div>
      </div>

      {/* Live Preview Banner */}
      {showPreview && (
        <div className="admin-card" style={{
          background: `linear-gradient(135deg, ${brand.primary_color}22 0%, ${brand.accent_color}11 100%)`,
          border: `1px solid ${brand.primary_color}44`,
          display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'
        }}>
          {brand.logo_light_url && (
            <div style={{ background: '#FFF', borderRadius: '12px', padding: '8px 16px' }}>
              <img src={brand.logo_light_url} alt="Brand Preview" style={{ height: '40px', objectFit: 'contain' }} />
            </div>
          )}
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: brand.primary_color }}>{brand.platform_name || 'Getvnt'}</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{brand.tagline || 'Platform Tagline'}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {colorFields.map(f => (
              <div key={f.key} title={f.label} style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: brand[f.key] || '#555',
                border: '2px solid rgba(255,255,255,0.2)',
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Platform Identity */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sparkles size={18} color="#A5B4FC" />
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Platform Identity</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Platform Name (Full)</label>
            <input className="admin-input" value={brand.platform_name || ''} onChange={(e) => setBrand({ ...brand, platform_name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Short Name / App Name</label>
            <input className="admin-input" value={brand.short_name || ''} onChange={(e) => setBrand({ ...brand, short_name: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Platform Tagline</label>
            <input className="admin-input" value={brand.tagline || ''} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Platform Description</label>
            <textarea className="admin-input" rows={2} style={{ resize: 'vertical' }} value={brand.description || ''} onChange={(e) => setBrand({ ...brand, description: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Media Assets Grid */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <ImageIcon size={18} color="#A5B4FC" />
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Brand Media Assets</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          {mediaFields.map((field) => (
            <div key={field.key} style={{ background: '#0D1222', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '10px' }}>{field.label}</div>
              <div style={{ height: '90px', background: field.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', marginBottom: '12px', border: field.border, overflow: 'hidden' }}>
                {brand[field.key] ? (
                  <LazyImage src={brand[field.key]} alt={field.label} objectFit="contain" style={{ maxHeight: '70px', maxWidth: '100%', height: '100%' }} />
                ) : (
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>No image uploaded</span>
                )}
              </div>
              <input ref={field.ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, field.key)} />
              <button
                className="admin-btn admin-btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
                disabled={uploadingField === field.key}
                onClick={() => field.ref.current?.click()}
              >
                <Upload size={13} />
                {uploadingField === field.key ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Colors */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Palette size={18} color="#A5B4FC" />
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Theme Color Palette</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {colorFields.map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{f.label}</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={brand[f.key] || '#4F46E5'}
                  onChange={(e) => setBrand({ ...brand, [f.key]: e.target.value })}
                  style={{ width: '44px', height: '40px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer', padding: '2px' }}
                />
                <input
                  className="admin-input"
                  value={brand[f.key] || ''}
                  onChange={(e) => setBrand({ ...brand, [f.key]: e.target.value })}
                  style={{ flex: 1 }}
                  placeholder="#4F46E5"
                />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Typography Family</label>
            <input className="admin-input" value={brand.typography_family || ''} onChange={(e) => setBrand({ ...brand, typography_family: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Border Radius</label>
            <input className="admin-input" value={brand.border_radius || ''} onChange={(e) => setBrand({ ...brand, border_radius: e.target.value })} placeholder="12px" />
          </div>
        </div>
      </div>

      {/* Contact & Legal */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Globe size={18} color="#A5B4FC" />
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Contact, Legal & Footer</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              <Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />Support Email
            </label>
            <input className="admin-input" type="email" value={brand.support_email || ''} onChange={(e) => setBrand({ ...brand, support_email: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />Support Phone
            </label>
            <input className="admin-input" type="tel" value={brand.support_phone || ''} onChange={(e) => setBrand({ ...brand, support_phone: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />Office Address
            </label>
            <input className="admin-input" value={brand.office_address || ''} onChange={(e) => setBrand({ ...brand, office_address: e.target.value })} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Copyright Footer Text</label>
            <input className="admin-input" value={brand.copyright_text || ''} onChange={(e) => setBrand({ ...brand, copyright_text: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Link size={18} color="#A5B4FC" />
          <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Social Media Links</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {socialNetworks.map((sn) => (
            <div key={sn.key}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{sn.label}</label>
              <input
                className="admin-input"
                value={brand.social_links?.[sn.key] || ''}
                placeholder={sn.placeholder}
                onChange={(e) => updateSocial(sn.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── GOOGLE OAUTH 2.0 & SOCIAL AUTH GOVERNANCE CARD ── */}
      <div className="admin-card" style={{ border: '1px solid rgba(59,130,246,0.3)', background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(13,17,32,0.95))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA', fontWeight: 900 }}>
              G
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#FFF' }}>Google OAuth 2.0 Social Authentication</h3>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Configure Google Sign-In credentials used dynamically across Marketplace and Workspace auth modals.</p>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div
              onClick={() => setBrand({ ...brand, google_login_enabled: !brand.google_login_enabled })}
              style={{
                width: '42px', height: '24px', borderRadius: '12px', cursor: 'pointer',
                background: brand.google_login_enabled !== false ? '#2563EB' : 'rgba(255,255,255,0.12)',
                position: 'relative', transition: 'background 0.2s'
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: brand.google_login_enabled !== false ? '21px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%', background: '#FFF', transition: 'left 0.2s'
              }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: brand.google_login_enabled !== false ? '#60A5FA' : '#9CA3AF' }}>
              {brand.google_login_enabled !== false ? 'Enabled ✓' : 'Disabled'}
            </span>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Google OAuth Client ID *
            </label>
            <input
              className="admin-input"
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
              placeholder="e.g. 1029384756-abc.apps.googleusercontent.com"
              value={brand.google_client_id || ''}
              onChange={(e) => setBrand({ ...brand, google_client_id: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Google OAuth Client Secret *
            </label>
            <input
              type="password"
              className="admin-input"
              style={{ fontFamily: 'monospace', fontSize: '13px' }}
              placeholder="GOCSPX-..."
              value={brand.google_client_secret || ''}
              onChange={(e) => setBrand({ ...brand, google_client_secret: e.target.value })}
            />
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#9CA3AF' }}>Authorized Redirect URI: </span>
            <code style={{ color: '#34D399', fontFamily: 'monospace', marginLeft: '6px' }}>/api/v1/auth/google/callback</code>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: '11px', padding: '4px 10px' }}
            onClick={() => {
              navigator.clipboard.writeText('/api/v1/auth/google/callback');
              onToast('Copied Callback URL to clipboard!');
            }}
          >
            Copy URI
          </button>
        </div>
      </div>

      {/* ── LANDING PAGE & CMS GOVERNANCE CARD ── */}
      <div className="admin-card" style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(13,17,32,0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Globe size={18} color="#C084FC" />
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#FFF' }}>Public Landing Page CMS & Copy Governance</h3>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Dynamically manage hero headlines, features, CTA buttons, and marketing copy without touching codebase.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Hero Badge Pill Text</label>
            <input
              className="admin-input"
              placeholder="🚀 Next-Gen Event OS v1.0"
              value={brand.landing_page_cms?.hero_badge_text || '🚀 Next-Gen Event OS v1.0'}
              onChange={(e) => setBrand({ ...brand, landing_page_cms: { ...(brand.landing_page_cms || {}), hero_badge_text: e.target.value } })}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Hero Headline Title</label>
            <input
              className="admin-input"
              placeholder="Discover & Host Unforgettable Events Across Africa"
              value={brand.landing_page_cms?.hero_title || "Discover & Host Unforgettable Events Across Africa"}
              onChange={(e) => setBrand({ ...brand, landing_page_cms: { ...(brand.landing_page_cms || {}), hero_title: e.target.value } })}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Hero Subtitle Copy</label>
            <input
              className="admin-input"
              placeholder="Sell tickets globally with zero friction, instant Paystack payouts, and AI marketing."
              value={brand.landing_page_cms?.hero_subtitle || "Sell tickets globally with zero friction, instant Paystack payouts, and AI marketing."}
              onChange={(e) => setBrand({ ...brand, landing_page_cms: { ...(brand.landing_page_cms || {}), hero_subtitle: e.target.value } })}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Hero CTA Button Label</label>
            <input
              className="admin-input"
              placeholder="Create Workspace Free"
              value={brand.landing_page_cms?.hero_cta_text || 'Create Workspace Free'}
              onChange={(e) => setBrand({ ...brand, landing_page_cms: { ...(brand.landing_page_cms || {}), hero_cta_text: e.target.value } })}
            />
          </div>
        </div>
      </div>

      {/* Save Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="admin-btn admin-btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }} onClick={handleSave} disabled={isSaving}>
          {isSaving ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
          {isSaving ? 'Saving Brand Registry…' : 'Save & Publish Brand Registry'}
        </button>
      </div>

    </div>
  );
};
