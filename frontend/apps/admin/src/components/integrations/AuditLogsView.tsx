import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Eye, FileText, Lock } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
}

export const AuditLogsView: React.FC<Props> = ({ onToast }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [search]);

  const fetchLogs = () => {
    const url = search
      ? `/api/v1/admin/integrations/audit-logs?search=${encodeURIComponent(search)}`
      : '/api/v1/admin/integrations/audit-logs';

    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setLogs(Array.isArray(json.data) ? json.data : json.data.data || []);
        }
      })
      .catch(() => setLogs([]));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Global Security Audit Trail & Access Logs</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Immutable audit record of every credential creation, API rotation, gateway connection, & setting change.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '12px' }} />
        <input
          className="admin-input"
          style={{ paddingLeft: '40px' }}
          placeholder="Search by action, user name, IP address, or resource type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Administrator</th>
                <th>Role</th>
                <th>Action Executed</th>
                <th>Resource Type</th>
                <th>IP Address</th>
                <th>State Diff</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 700, color: '#FFF' }}>{log.user_name}</td>
                  <td>
                    <span style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                      {log.user_role}
                    </span>
                  </td>
                  <td style={{ color: '#E5E7EB', fontWeight: 600 }}>{log.action}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#60A5FA' }}>{log.resource_type || 'system'}</span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace' }}>{log.ip_address}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye size={12} /> Inspect Diff
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Diff Modal */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Audit Event Details</h3>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Action:</strong> {selectedLog.action}</div>
              <div><strong>Performed By:</strong> {selectedLog.user_name} ({selectedLog.user_role})</div>
              <div><strong>IP & Browser:</strong> {selectedLog.ip_address} ({selectedLog.browser})</div>
              <div><strong>Timestamp:</strong> {new Date(selectedLog.created_at).toString()}</div>
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#9CA3AF' }}>Before State JSON</h4>
            <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', color: '#F87171', fontSize: '12px', marginBottom: '16px', overflowX: 'auto' }}>
              {JSON.stringify(selectedLog.before_state || {}, null, 2)}
            </pre>

            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#9CA3AF' }}>After State JSON</h4>
            <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', color: '#34D399', fontSize: '12px', marginBottom: '20px', overflowX: 'auto' }}>
              {JSON.stringify(selectedLog.after_state || {}, null, 2)}
            </pre>

            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedLog(null)}>Close Inspector</button>
          </div>
        </div>
      )}
    </div>
  );
};
