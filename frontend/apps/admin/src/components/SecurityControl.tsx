import React, { useState, useEffect } from 'react';
import { Key, Shield, AlertTriangle, RefreshCw } from 'lucide-react';

interface Props { token: string; }

export function SecurityControl({ token }: Props) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [suspiciousLogins, setSuspiciousLogins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurity = async () => {
      try {
        const [sessRes, susRes] = await Promise.all([
          fetch('/api/v1/admin/security/sessions', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/v1/admin/security/suspicious-logins', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const sessData = await sessRes.json().catch(() => ({}));
        const susData = await susRes.json().catch(() => ({}));
        if (sessData.success) setSessions(sessData.data ?? []);
        if (susData.success) setSuspiciousLogins(susData.data ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchSecurity();
  }, [token]);

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Revoke this session? The user will be logged out immediately.')) return;
    await fetch(`/api/v1/admin/security/sessions/${sessionId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const cell = { padding: '14px 18px' };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Key size={22} color="#c084fc" /> Security Control Center
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px' }}>
        Monitor active sessions, revoke access, and track suspicious login attempts across the platform.
      </p>

      {/* Security Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Active Sessions', value: sessions.length, color: '#34d399', icon: Shield },
          { label: 'Suspicious Logins (24h)', value: suspiciousLogins.length, color: '#f87171', icon: AlertTriangle },
          { label: 'Failed Auth Attempts', value: '—', color: '#fbbf24', icon: Key },
        ].map(card => (
          <div key={card.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{card.label}</span>
            <div style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Suspicious Logins */}
      {suspiciousLogins.length > 0 && (
        <>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#f87171" /> Suspicious Login Attempts
          </h3>
          <div style={{ background: '#0f172a', border: '1px solid #450a0a', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
                  {['User', 'IP Address', 'Country', 'Reason', 'Time'].map(h => (
                    <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suspiciousLogins.map((l, i) => (
                  <tr key={l.id ?? i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ ...cell, color: '#fff', fontWeight: 700 }}>{l.email || l.user?.email}</td>
                    <td style={{ ...cell, color: '#f87171', fontFamily: 'monospace' }}>{l.ip_address}</td>
                    <td style={{ ...cell, color: '#94a3b8' }}>{l.country || '—'}</td>
                    <td style={{ ...cell, color: '#fbbf24', fontSize: '12px' }}>{l.reason || 'Multiple failed attempts'}</td>
                    <td style={{ ...cell, color: '#64748b', fontSize: '12px' }}>{l.created_at ? new Date(l.created_at).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Active Sessions */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>Active User Sessions</h3>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
              {['User', 'IP Address', 'Device', 'Last Active', 'Action'].map(h => (
                <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '40px' }}>Loading sessions...</td></tr>
            )}
            {!loading && sessions.length === 0 && (
              <tr><td colSpan={5} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '40px' }}>
                No active sessions data. Implement <code>/api/v1/admin/security/sessions</code> to show live sessions.
              </td></tr>
            )}
            {sessions.map((s, i) => (
              <tr key={s.id ?? i} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ ...cell, fontWeight: 700, color: '#fff' }}>
                  {s.user?.name || s.user_name}
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{s.user?.email || s.email}</div>
                </td>
                <td style={{ ...cell, color: '#60a5fa', fontFamily: 'monospace' }}>{s.ip_address || '—'}</td>
                <td style={{ ...cell, color: '#94a3b8', fontSize: '12px' }}>{s.device || s.user_agent?.substring(0, 30) || '—'}</td>
                <td style={{ ...cell, color: '#64748b', fontSize: '12px' }}>{s.last_active ? new Date(s.last_active).toLocaleString() : '—'}</td>
                <td style={cell}>
                  <button onClick={() => handleRevokeSession(s.id)} style={{ background: '#450a0a', color: '#f87171', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>
                    Revoke
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
