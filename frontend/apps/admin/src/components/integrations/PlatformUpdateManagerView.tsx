import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Terminal, Shield, RefreshCw, Archive, Play } from 'lucide-react';

interface Props {
  onToast: (msg: string) => void;
}

export const PlatformUpdateManagerView: React.FC<Props> = ({ onToast }) => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeLog, setActiveLog] = useState<string | null>(null);

  const getAuthHeaders = () => ({
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/platform/updates', { headers: getAuthHeaders() });
      const json = await res.json();
      if (json.success) {
        setUpdates(json.data || []);
      }
    } catch {
      onToast('Error loading platform update history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleUploadZip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      onToast('❌ Only .zip update packages are allowed (e.g. eventos-update-v2.5.zip).');
      return;
    }

    setIsUploading(true);
    setActiveLog("🚀 Initializing Platform Package Deployment Engine...\nUploading update package: " + file.name + "\n");

    const formData = new FormData();
    formData.append('update_package', file);
    formData.append('version', file.name.replace('.zip', ''));

    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/platform/updates/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      const json = await res.json();

      if (json.success && json.data) {
        setActiveLog(json.data.log_output);
        onToast(`🎉 ${json.message}`);
        fetchUpdates();
      } else {
        setActiveLog(json.data?.log_output || '❌ Update failed and was rolled back automatically.');
        onToast(`❌ ${json.message || 'Update failed.'}`);
      }
    } catch (err) {
      onToast('Error deploying platform update package.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 800 }}>GETVNT Platform Update & Deployment Manager</h2>
        <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
          Deploy production ZIP update packages with automated pre-update database backups, database migration execution, frontend rebuilding, & automatic rollback.
        </p>
      </div>

      {/* Upload Box */}
      <div
        className="admin-card"
        style={{
          border: '2px dashed rgba(37,99,235,0.4)',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(13,17,32,0.95))',
          padding: '36px',
          textAlign: 'center',
          borderRadius: '20px',
        }}
      >
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(37,99,235,0.2)', color: '#60A5FA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <UploadCloud size={28} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>Upload Platform Update Package (.zip)</h3>
        <p style={{ color: '#9CA3AF', fontSize: '13px', maxWidth: '540px', margin: '6px auto 20px' }}>
          Select an <code>eventos-update-vX.Y.zip</code> package. The update engine will automatically validate, backup SQLite/MySQL DB, extract files, run migrations, & clear caches.
        </p>

        <label className="admin-btn admin-btn-primary" style={{ display: 'inline-flex', cursor: 'pointer', padding: '12px 28px', fontSize: '14px' }}>
          <Play size={16} /> Select & Deploy Update ZIP
          <input type="file" accept=".zip" style={{ display: 'none' }} onChange={handleUploadZip} disabled={isUploading} />
        </label>

        {isUploading && (
          <div style={{ marginTop: '16px', color: '#60A5FA', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing update pipeline... Do not refresh.
          </div>
        )}
      </div>

      {/* Terminal Output Console */}
      {activeLog && (
        <div className="admin-card" style={{ background: '#090D16', border: '1px solid #1E293B', borderRadius: '16px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
            <Terminal size={16} color="#34D399" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', fontFamily: 'monospace' }}>Deployment Stream Terminal Console</span>
          </div>
          <pre style={{ fontFamily: 'monospace', fontSize: '12.5px', color: '#38BDF8', whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0, maxHeight: '280px', overflowY: 'auto' }}>
            {activeLog}
          </pre>
        </div>
      )}

      {/* Update History Table */}
      <div className="admin-card">
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Deployment History & Snapshot Backups</h3>

        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>Loading update records...</div>
        ) : updates.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>No update packages uploaded yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--admin-border)', color: '#9CA3AF', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Version</th>
                  <th style={{ padding: '10px' }}>Package File</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Deployed At</th>
                  <th style={{ padding: '10px' }}>Log Summary</th>
                </tr>
              </thead>
              <tbody>
                {updates.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 800, color: '#FFF' }}>{u.version}</td>
                    <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#60A5FA' }}>{u.filename}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={`admin-badge ${u.status === 'completed' ? 'admin-badge-active' : u.status === 'rolled_back' ? 'admin-badge-warning' : 'admin-badge-inactive'}`}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#9CA3AF' }}>
                      {u.installed_at ? new Date(u.installed_at).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <button
                        className="admin-btn admin-btn-secondary"
                        style={{ fontSize: '11px', padding: '4px 10px' }}
                        onClick={() => setActiveLog(u.log_output)}
                      >
                        View Logs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
