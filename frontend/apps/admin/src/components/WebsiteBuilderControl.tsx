import React, { useState } from 'react';
import { Globe, ExternalLink, Eye } from 'lucide-react';

interface Props { websites: any[]; }

export function WebsiteBuilderControl({ websites }: Props) {
  const [search, setSearch] = useState('');
  const filtered = websites.filter(w => w.organizer_name?.toLowerCase().includes(search.toLowerCase()) || w.subdomain?.toLowerCase().includes(search.toLowerCase()));
  const cell = { padding: '14px 18px' };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Globe size={22} color="#c084fc" /> Website Builder Control
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px' }}>
        All organizer micro-websites built with the GETVNT Website Builder. Pro & Enterprise only.
      </p>

      <div style={{ marginBottom: '16px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by organizer or subdomain..." style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 16px', color: '#fff', fontSize: '13px', width: '300px' }} />
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
              {['Organizer', 'Subdomain', 'Template', 'Status', 'Published', 'Action'].map(h => (
                <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '40px' }}>
                No organizer websites yet. Organizer Pro users will appear here once they publish.
              </td></tr>
            )}
            {filtered.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={cell}>
                  <div style={{ fontWeight: 800, color: '#fff' }}>{w.organizer_name || w.organizer?.name}</div>
                </td>
                <td style={{ ...cell, color: '#c084fc', fontFamily: 'monospace', fontSize: '12px' }}>
                  {w.subdomain}.getvnt.com
                </td>
                <td style={{ ...cell, color: '#94a3b8' }}>{w.template || 'Default'}</td>
                <td style={cell}>
                  <span style={{ background: w.is_published ? '#052e16' : '#1e293b', color: w.is_published ? '#34d399' : '#94a3b8', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
                    {w.is_published ? 'LIVE' : 'DRAFT'}
                  </span>
                </td>
                <td style={{ ...cell, color: '#94a3b8', fontSize: '12px' }}>{w.published_at ? new Date(w.published_at).toLocaleDateString() : '—'}</td>
                <td style={cell}>
                  <button onClick={() => window.open(`https://${w.subdomain}.getvnt.com`, '_blank')} style={{ background: '#1e293b', color: '#60a5fa', border: '1px solid #334155', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}>
                    <ExternalLink size={12} /> Visit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
