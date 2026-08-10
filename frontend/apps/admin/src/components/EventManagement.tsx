import React, { useState } from 'react';
import { Calendar, Search, Star, Trash2, Eye, Filter } from 'lucide-react';

const cell = { padding: '14px 18px' };
const badge = (color: string, bg: string, text: string) => (
  <span style={{ background: bg, color, padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>{text}</span>
);

interface Props { events: any[]; token: string; onRefresh: () => void; }

export function EventManagement({ events, token, onRefresh }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = events.filter(e => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) || e.organizer_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleFeature = async (id: string) => {
    await fetch(`/api/v1/admin/events/${id}/feature`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this event and all its tickets?')) return;
    await fetch(`/api/v1/admin/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    onRefresh();
  };

  const statusColor: Record<string, [string, string]> = {
    published: ['#34d399', '#052e16'],
    draft: ['#94a3b8', '#1e293b'],
    cancelled: ['#f87171', '#450a0a'],
    past: ['#fbbf24', '#78350f'],
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={22} color="#c084fc" /> Event Management
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events or organizer..." style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px 10px 34px', color: '#fff', fontSize: '13px', width: '240px' }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
              {['Event Title', 'Organizer', 'Date', 'Tickets Sold', 'Revenue', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '40px' }}>No events found.</td></tr>
            )}
            {filtered.map(e => {
              const [c, bg] = statusColor[e.status] ?? ['#94a3b8', '#1e293b'];
              return (
                <tr key={e.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={cell}>
                    <div style={{ fontWeight: 800, color: '#fff' }}>{e.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{e.category}</div>
                  </td>
                  <td style={{ ...cell, color: '#cbd5e1' }}>{e.organizer_name || e.organizer?.name || '—'}</td>
                  <td style={{ ...cell, color: '#94a3b8', fontSize: '12px' }}>{e.start_date ? new Date(e.start_date).toLocaleDateString() : '—'}</td>
                  <td style={{ ...cell, color: '#fff', fontWeight: 700 }}>{e.tickets_sold ?? 0}</td>
                  <td style={{ ...cell, color: '#34d399', fontWeight: 800 }}>${parseFloat(e.revenue ?? 0).toLocaleString()}</td>
                  <td style={cell}>{badge(c, bg, (e.status ?? 'draft').toUpperCase())}</td>
                  <td style={{ ...cell, display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleFeature(e.id)} title="Feature Event" style={{ background: '#78350f', color: '#fbbf24', border: 'none', padding: '6px 10px', borderRadius: '7px', cursor: 'pointer' }}>
                      <Star size={13} />
                    </button>
                    <button onClick={() => window.open(`/events/${e.slug}`, '_blank')} title="View" style={{ background: '#1e293b', color: '#60a5fa', border: 'none', padding: '6px 10px', borderRadius: '7px', cursor: 'pointer' }}>
                      <Eye size={13} />
                    </button>
                    <button onClick={() => handleDelete(e.id)} title="Delete" style={{ background: '#450a0a', color: '#f87171', border: 'none', padding: '6px 10px', borderRadius: '7px', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
