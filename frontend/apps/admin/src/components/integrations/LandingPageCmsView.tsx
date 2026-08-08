import React, { useState, useEffect } from 'react';
import { Globe, Eye, EyeOff, MoveUp, MoveDown, Save, FileText, Layout, Plus, Check } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
}

export const LandingPageCmsView: React.FC<Props> = ({ onToast }) => {
  const [tab, setTab] = useState<'sections' | 'pages'>('sections');
  const [sections, setSections] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [secRes, pageRes] = await Promise.all([
        fetch('/api/v1/cms/landing'),
        fetch('/api/v1/cms/pages'),
      ]);
      const secJson = await secRes.json();
      const pageJson = await pageRes.json();

      if (secJson.success) setSections(secJson.data || []);
      if (pageJson.success) {
        setPages(pageJson.data || []);
        if (pageJson.data && pageJson.data.length > 0 && !selectedPage) {
          setSelectedPage(pageJson.data[0]);
        }
      }
    } catch {
      onToast('Error loading CMS data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleSection = async (sec: any) => {
    try {
      const res = await fetch(`/api/v1/admin/cms/sections/${sec.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_visible: !sec.is_visible }),
      });
      const json = await res.json();
      if (json.success) {
        onToast(`Section ${sec.section_key} is now ${!sec.is_visible ? 'Visible' : 'Hidden'}.`);
        fetchData();
      }
    } catch {
      onToast('Error toggling visibility.');
    }
  };

  const handleSaveSection = async (sec: any, e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
    };

    try {
      const res = await fetch(`/api/v1/admin/cms/sections/${sec.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        onToast(`✅ Updated section '${sec.section_key}'!`);
        fetchData();
      }
    } catch {
      onToast('Error updating section.');
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    try {
      const res = await fetch(`/api/v1/admin/cms/pages/${selectedPage.slug}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: selectedPage.title,
          subtitle: selectedPage.subtitle,
          body_markdown: selectedPage.body_markdown,
          is_published: selectedPage.is_published,
        }),
      });
      const json = await res.json();
      if (json.success) {
        onToast(`✅ Published changes to CMS Page '${selectedPage.title}'!`);
        fetchData();
      }
    } catch {
      onToast('Error saving CMS page.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Platform Content Management System (CMS)</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            Zero hardcoded content. Manage all public landing page sections, hero copy, and static pages dynamically.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.06)', padding: '4px', borderRadius: '12px' }}>
          <button
            className="admin-btn"
            style={{ background: tab === 'sections' ? '#2563EB' : 'none', color: '#FFF', fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setTab('sections')}
          >
            <Layout size={14} /> Landing Page Sections
          </button>
          <button
            className="admin-btn"
            style={{ background: tab === 'pages' ? '#2563EB' : 'none', color: '#FFF', fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setTab('pages')}
          >
            <FileText size={14} /> Static Pages (About, Terms, Privacy)
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Loading CMS Engine...</div>
      ) : tab === 'sections' ? (
        /* LANDING PAGE SECTIONS TAB */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="admin-card"
              style={{
                opacity: sec.is_visible ? 1 : 0.6,
                border: sec.is_visible ? '1px solid var(--admin-border)' : '1px dashed rgba(255,255,255,0.15)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: '#2563EB', color: '#FFF', fontSize: '11px', fontWeight: 900, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sec.order_index || idx + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'capitalize' }}>
                      {sec.section_key} Section
                    </h3>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Slug: {sec.page_slug} / {sec.section_key}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                    onClick={() => handleToggleSection(sec)}
                  >
                    {sec.is_visible ? <Eye size={13} color="#34D399" /> : <EyeOff size={13} color="#EF4444" />}
                    {sec.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => handleSaveSection(sec, e)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Section Title
                  </label>
                  <input className="admin-input" name="title" defaultValue={sec.title || ''} />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Subtitle Copy
                  </label>
                  <input className="admin-input" name="subtitle" defaultValue={sec.subtitle || ''} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button type="submit" className="admin-btn admin-btn-primary" style={{ fontSize: '12px' }}>
                    <Save size={13} /> Save Section
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      ) : (
        /* STATIC PAGES TAB */
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
          {/* Pages Sidebar List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {pages.map((p) => (
              <button
                key={p.slug}
                onClick={() => setSelectedPage(p)}
                className="admin-btn"
                style={{
                  justifyContent: 'flex-start',
                  background: selectedPage?.slug === p.slug ? '#2563EB' : 'rgba(255,255,255,0.04)',
                  color: '#FFF',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  textAlign: 'left',
                }}
              >
                <FileText size={15} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>/{p.slug}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Page Editor */}
          {selectedPage && (
            <div className="admin-card">
              <form onSubmit={handleSavePage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Editing: {selectedPage.title}</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedPage.is_published}
                      onChange={(e) => setSelectedPage({ ...selectedPage, is_published: e.target.checked })}
                      style={{ accentColor: '#2563EB' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: selectedPage.is_published ? '#34D399' : '#EF4444' }}>
                      {selectedPage.is_published ? 'Published ✓' : 'Draft'}
                    </span>
                  </label>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Page Title</label>
                  <input
                    className="admin-input"
                    value={selectedPage.title}
                    onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Subtitle</label>
                  <input
                    className="admin-input"
                    value={selectedPage.subtitle || ''}
                    onChange={(e) => setSelectedPage({ ...selectedPage, subtitle: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Page Markdown Body</label>
                  <textarea
                    className="admin-input"
                    rows={12}
                    style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
                    value={selectedPage.body_markdown || ''}
                    onChange={(e) => setSelectedPage({ ...selectedPage, body_markdown: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    <Save size={15} /> Save & Publish Page
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
