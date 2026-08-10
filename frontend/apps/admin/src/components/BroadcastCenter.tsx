import React, { useState } from 'react';
import { Send, Bell, Users, Globe } from 'lucide-react';

interface Props { broadcasts: any[]; token: string; onRefresh: () => void; }

export function BroadcastCenter({ broadcasts, token, onRefresh }: Props) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [channel, setChannel] = useState('push');
  const [sending, setSending] = useState(false);
  const cell = { padding: '14px 18px' };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Send "${title}" to all ${audience} users?`)) return;
    setSending(true);
    try {
      const res = await fetch('/api/v1/admin/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, message, audience, channel }),
      });
      const data = await res.json();
      if (data.success) { alert(`Broadcast sent to ${data.recipients ?? 'all'} users!`); setTitle(''); setMessage(''); onRefresh(); }
      else alert(data.message || 'Failed to send broadcast.');
    } finally { setSending(false); }
  };

  const audienceColors: Record<string, string> = { all: '#a855f7', organizers: '#3b82f6', attendees: '#10b981', pro_subscribers: '#f59e0b' };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Send size={22} color="#c084fc" /> Broadcast Center
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px' }}>
        Send platform-wide notifications to any segment of users in real-time.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px', marginBottom: '32px' }}>
        {/* Compose Form */}
        <form onSubmit={handleSend} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 800, color: '#fff' }}>Compose Broadcast</h3>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Important platform update..." required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Your broadcast message here..." required rows={4} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Audience</label>
              <select value={audience} onChange={e => setAudience(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}>
                <option value="all">All Users</option>
                <option value="organizers">All Organizers</option>
                <option value="attendees">All Attendees</option>
                <option value="pro_subscribers">Pro Subscribers</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Channel</label>
              <select value={channel} onChange={e => setChannel(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}>
                <option value="push">Push Notification</option>
                <option value="email">Email</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={sending} style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Send size={15} /> {sending ? 'Sending...' : 'Send Broadcast'}
          </button>
        </form>

        {/* Audience Preview */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: 800, color: '#fff' }}>Audience Segments</h3>
          {['all', 'organizers', 'attendees', 'pro_subscribers'].map(seg => (
            <div key={seg} onClick={() => setAudience(seg)} style={{ background: audience === seg ? '#1e293b' : 'transparent', border: `1px solid ${audience === seg ? audienceColors[seg] : '#334155'}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: audienceColors[seg] }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px', textTransform: 'capitalize' }}>{seg.replace('_', ' ')}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Live count from database</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast History */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>Broadcast History</h3>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
              {['Title', 'Audience', 'Channel', 'Recipients', 'Sent At'].map(h => (
                <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {broadcasts.length === 0 && (
              <tr><td colSpan={5} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '36px' }}>No broadcasts sent yet.</td></tr>
            )}
            {broadcasts.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={cell}>
                  <div style={{ fontWeight: 800, color: '#fff' }}>{b.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{b.message?.substring(0, 60)}{b.message?.length > 60 ? '...' : ''}</div>
                </td>
                <td style={cell}>
                  <span style={{ background: audienceColors[b.audience] + '22', color: audienceColors[b.audience], padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
                    {(b.audience || 'all').toUpperCase()}
                  </span>
                </td>
                <td style={{ ...cell, color: '#94a3b8', textTransform: 'capitalize' }}>{b.channel}</td>
                <td style={{ ...cell, color: '#fff', fontWeight: 700 }}>{b.recipients_count ?? '—'}</td>
                <td style={{ ...cell, color: '#94a3b8', fontSize: '12px' }}>{b.created_at ? new Date(b.created_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
