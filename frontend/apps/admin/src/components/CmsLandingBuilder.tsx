import React, { useState } from 'react';
import { FileText, Edit2, Save, X } from 'lucide-react';

interface Props { cmsSections: any[]; token: string; onRefresh: () => void; }

export function CmsLandingBuilder({ cmsSections, token, onRefresh }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (section: any) => {
    setEditingId(section.id);
    setEditTitle(section.title || section.heading || '');
    setEditContent(section.content || section.body || '');
  };

  const handleSave = async (sectionId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/cms/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const data = await res.json();
      if (data.success) { setEditingId(null); onRefresh(); }
      else alert(data.message || 'Failed to save section.');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={22} color="#c084fc" /> CMS Landing Page Builder
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px' }}>
        Edit every section of the GETVNT public landing page. Changes go live instantly.
      </p>

      {cmsSections.length === 0 && (
        <div style={{ background: '#0f172a', border: '1px dashed #334155', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#64748b' }}>
          <FileText size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p style={{ margin: 0 }}>No CMS sections found in the database yet.<br/>They will appear here once seeded via <code>php artisan db:seed</code>.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {cmsSections.map(section => (
          <div key={section.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editingId === section.id ? '16px' : 0 }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{section.section_key || section.key}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '4px 0 0', color: '#fff' }}>{section.title || section.heading}</h3>
              </div>
              {editingId !== section.id ? (
                <button onClick={() => startEdit(section)} style={{ background: '#1e293b', color: '#c084fc', border: '1px solid #334155', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <Edit2 size={13} /> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleSave(section.id)} disabled={saving} style={{ background: '#059669', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingId(null)} style={{ background: '#334155', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {editingId === section.id && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Section Title / Heading</label>
                  <input
                    type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Content / Body</label>
                  <textarea
                    value={editContent} onChange={e => setEditContent(e.target.value)} rows={5}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {editingId !== section.id && (section.content || section.body) && (
              <p style={{ margin: '10px 0 0', color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>
                {(section.content || section.body)?.substring(0, 200)}{(section.content || section.body)?.length > 200 ? '...' : ''}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
