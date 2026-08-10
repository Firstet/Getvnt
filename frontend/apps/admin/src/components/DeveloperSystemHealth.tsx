import React, { useState } from 'react';
import { Cpu, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface Props { developerHealth: any; token: string; onRefresh: () => void; }

export function DeveloperSystemHealth({ developerHealth, token, onRefresh }: Props) {
  const [flushing, setFlushing] = useState(false);

  const handleFlushCache = async () => {
    if (!confirm('Flush all Redis/application caches? This may temporarily slow responses.')) return;
    setFlushing(true);
    try {
      const res = await fetch('/api/v1/admin/developer-health/flush-cache', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      alert(data.success ? data.message || 'Cache flushed successfully!' : data.message || 'Flush failed.');
      onRefresh();
    } finally { setFlushing(false); }
  };

  const h = developerHealth || {};

  const statusIcon = (ok: boolean | undefined) => {
    if (ok === true) return <CheckCircle2 size={16} color="#34d399" />;
    if (ok === false) return <XCircle size={16} color="#f87171" />;
    return <AlertTriangle size={16} color="#fbbf24" />;
  };

  const services = [
    { label: 'Database (MySQL)', key: 'database', ok: h.database_ok },
    { label: 'Redis Cache', key: 'redis', ok: h.redis_ok },
    { label: 'Queue Worker', key: 'queue', ok: h.queue_ok },
    { label: 'Mail Service', key: 'mail', ok: h.mail_ok },
    { label: 'Storage (S3/Local)', key: 'storage', ok: h.storage_ok },
    { label: 'AI Provider (Primary)', key: 'ai', ok: h.ai_ok },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={22} color="#c084fc" /> Developer System Health
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleFlushCache} disabled={flushing} style={{ background: '#78350f', color: '#fbbf24', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <RefreshCw size={14} /> {flushing ? 'Flushing...' : 'Flush All Caches'}
          </button>
          <button onClick={onRefresh} style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Service Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {services.map(svc => (
          <div key={svc.key} style={{ background: '#0f172a', border: `1px solid ${svc.ok === true ? '#065f46' : svc.ok === false ? '#450a0a' : '#334155'}`, borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            {statusIcon(svc.ok)}
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>{svc.label}</div>
              <div style={{ fontSize: '12px', color: svc.ok === true ? '#34d399' : svc.ok === false ? '#f87171' : '#fbbf24' }}>
                {svc.ok === true ? 'Operational' : svc.ok === false ? 'Error Detected' : 'Unknown'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, color: '#fff' }}>Runtime Info</h3>
          {[
            { label: 'PHP Version', value: h.php_version || '—' },
            { label: 'Laravel Version', value: h.laravel_version || '—' },
            { label: 'App Environment', value: h.app_env || '—' },
            { label: 'Debug Mode', value: h.debug_mode ? '⚠️ ON (Disable in Production)' : 'OFF' },
            { label: 'Cache Driver', value: h.cache_driver || '—' },
            { label: 'Queue Driver', value: h.queue_driver || '—' },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b', fontSize: '13px' }}>
              <span style={{ color: '#94a3b8' }}>{m.label}</span>
              <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>{m.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, color: '#fff' }}>Platform Statistics</h3>
          {[
            { label: 'Total DB Records', value: h.total_db_records ?? '—' },
            { label: 'Pending Queue Jobs', value: h.pending_queue_jobs ?? '—' },
            { label: 'Failed Queue Jobs', value: h.failed_queue_jobs ?? '—' },
            { label: 'Storage Used', value: h.storage_used ?? '—' },
            { label: 'Server Uptime', value: h.server_uptime ?? '—' },
            { label: 'Last Deploy', value: h.last_deploy ?? '—' },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1e293b', fontSize: '13px' }}>
              <span style={{ color: '#94a3b8' }}>{m.label}</span>
              <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
