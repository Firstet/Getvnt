import React, { useState } from 'react';
import { KeyRound, Plus, Eye, RefreshCw, Trash2, ShieldCheck, Lock, Copy } from 'lucide-react';
import { PasswordField } from '../../../../../shared/src';

interface Props {
  vaultKeys: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const ApiVaultView: React.FC<Props> = ({ vaultKeys, onRefresh, onToast }) => {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [revealedKeyMap, setRevealedKeyMap] = useState<Record<number, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = ['ALL', 'AI', 'Payment', 'Email', 'SMS', 'Maps', 'Storage', 'Analytics', 'Security', 'Custom'];

  const filteredKeys = vaultKeys.filter(
    (k) => categoryFilter === 'ALL' || k.category.toUpperCase() === categoryFilter.toUpperCase()
  );

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const handleRevealKey = async (id: number, name: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/integrations/api-vault/${id}/reveal`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setRevealedKeyMap((prev) => ({ ...prev, [id]: data.raw_value }));
        onToast(`🔓 Unmasked key for ${name} (Audit Logged).`);
      }
    } catch (err) {
      onToast('Failed to reveal key.');
    }
  };

  const handleRotateKey = async (id: number, name: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/integrations/api-vault/${id}/rotate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`🔑 Rotated secret for ${name}!`);
        onRefresh();
      }
    } catch (err) {
      onToast('Failed to rotate key.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete API Vault Key "${name}"?`)) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/integrations/api-vault/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`🗑️ ${name} deleted from vault.`);
        onRefresh();
      }
    } catch (err) {
      onToast('Failed to delete key.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>API Key Vault & Encrypted Credentials</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Centralized zero-exposure AES-256 vault for all third-party secrets, keys, and tokens with access auditing.
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => setDrawerOpen(true)}>
          <Plus size={16} /> Store New Key
        </button>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className="admin-btn"
            style={{
              background: categoryFilter === cat ? '#EF4444' : 'rgba(255,255,255,0.06)',
              color: categoryFilter === cat ? '#FFF' : '#9CA3AF',
              padding: '6px 14px',
              fontSize: '12px',
              borderRadius: '99px',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Keys Vault Table */}
      <div className="admin-card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Credential Name</th>
                <th>Category</th>
                <th>Provider</th>
                <th>Environment</th>
                <th>Encrypted Secret Value</th>
                <th>Last Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map((k) => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 700, color: '#FFF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={14} color="#8B5CF6" />
                      {k.name}
                    </div>
                  </td>
                  <td>
                    <span style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                      {k.category}
                    </span>
                  </td>
                  <td style={{ color: '#E5E7EB', fontWeight: 600 }}>{k.provider}</td>
                  <td>
                    <span style={{ color: k.environment === 'production' ? '#10B981' : '#F59E0B', fontSize: '11px', fontWeight: 700 }}>
                      {k.environment.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code style={{ background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', color: revealedKeyMap[k.id] ? '#34D399' : '#9CA3AF' }}>
                        {revealedKeyMap[k.id] || k.masked_value || 'sk-****************'}
                      </code>
                      {!revealedKeyMap[k.id] ? (
                        <button
                          style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer' }}
                          title="Reveal Secret (Audited)"
                          onClick={() => handleRevealKey(k.id, k.name)}
                        >
                          <Eye size={14} />
                        </button>
                      ) : (
                        <button
                          style={{ background: 'none', border: 'none', color: '#34D399', cursor: 'pointer' }}
                          title="Copy Key"
                          onClick={() => {
                            navigator.clipboard.writeText(revealedKeyMap[k.id]);
                            onToast('Copied credential to clipboard!');
                          }}
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: '11px', color: '#9CA3AF' }}>
                    {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td>
                    <span className={`admin-badge ${k.is_active ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                      {k.is_active ? 'ACTIVE' : 'ARCHIVED'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => handleRotateKey(k.id, k.name)}
                      >
                        <RefreshCw size={12} /> Rotate
                      </button>
                      <button
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}
                        onClick={() => handleDelete(k.id, k.name)}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Secret Modal */}
      {drawerOpen && (
        <div className="modal-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Store New Key in Vault</h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  name: formData.get('name'),
                  category: formData.get('category'),
                  provider: formData.get('provider'),
                  encrypted_value: formData.get('encrypted_value'),
                  environment: formData.get('environment'),
                  notes: formData.get('notes'),
                };

                try {
                  const res = await fetch('http://localhost:8000/api/v1/admin/integrations/api-vault', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                  });
                  const json = await res.json();
                  if (json.success) {
                    onToast('Key stored securely in vault!');
                    setDrawerOpen(false);
                    onRefresh();
                  }
                } catch (err) {
                  onToast('Error storing key in vault.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Credential Name</label>
                <input className="admin-input" name="name" required placeholder="e.g. OpenAI Master Secret Key" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Category</label>
                <select className="admin-input" name="category">
                  {categories.filter((c) => c !== 'ALL').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Provider</label>
                <input className="admin-input" name="provider" required placeholder="e.g. OpenAI / Paystack / SendGrid" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Secret Key / API Token Value</label>
                <PasswordField className="admin-input" name="encrypted_value" required placeholder="sk-..." />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Environment</label>
                <select className="admin-input" name="environment">
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Notes</label>
                <textarea className="admin-input" name="notes" rows={2} placeholder="Usage instructions or scope..." />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>Encrypt & Store Key</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDrawerOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
