import React, { useState } from 'react';
import { Lock, Search, Download } from 'lucide-react';

interface Props { auditLogs: any[]; }

export function AuditLogs({ auditLogs }: Props) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const cell = { padding: '14px 18px' };

  const actions = [...new Set(auditLogs.map(l => l.action))].filter(Boolean);

  const filtered = auditLogs.filter(l => {
    const matchSearch =
      l.admin_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.target_type?.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  const actionColors: Record<string, [string, string]> = {
    approve: ['#34d399', '#052e16'],
    reject: ['#f87171', '#450a0a'],
    delete: ['#f87171', '#450a0a'],
    update: ['#60a5fa', '#1e3a5f'],
    create: ['#a855f7', '#2e1065'],
    impersonate: ['#fbbf24', '#78350f'],
    disburse: ['#34d399', '#052e16'],
    default: ['#94a3b8', '#1e293b'],
  };

  const getColor = (action: string) => actionColors[action?.toLowerCase()] ?? actionColors.default;

  const handleExport = () => {
    const rows = [['Date', 'Admin', 'Action', 'Target', 'Description', 'IP']];
    filtered.forEach(l => rows.push([
      l.created_at ?? '', l.admin_name ?? '', l.action ?? '',
      `${l.target_type ?? ''} #${l.target_id ?? ''}`, l.description ?? '', l.ip_address ?? ''
    ]));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    a.download = `audit_logs_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock size={22} color="#c084fc" /> Audit Logs
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px 10px 32px', color: '#fff', fontSize: '13px', width: '220px' }} />
          </div>
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}>
            <option value="all">All Actions</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button onClick={handleExport} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
              {['Timestamp', 'Admin', 'Action', 'Target', 'Description', 'IP'].map(h => (
                <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '40px' }}>No audit logs found.</td></tr>
            )}
            {filtered.map((log, i) => {
              const [c, bg] = getColor(log.action);
              return (
                <tr key={log.id ?? i} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ ...cell, color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</td>
                  <td style={{ ...cell, fontWeight: 700, color: '#fff' }}>{log.admin_name || log.admin?.name || 'System'}</td>
                  <td style={cell}>
                    <span style={{ background: bg, color: c, padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 900 }}>
                      {(log.action || 'ACTION').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...cell, color: '#94a3b8', fontSize: '12px' }}>
                    {log.target_type && <span>{log.target_type} </span>}
                    {log.target_id && <span style={{ fontFamily: 'monospace', color: '#64748b' }}>#{log.target_id}</span>}
                  </td>
                  <td style={{ ...cell, color: '#cbd5e1' }}>{log.description || log.notes || '—'}</td>
                  <td style={{ ...cell, color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>{log.ip_address || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
