import React, { useState, useEffect } from 'react';
import { GitMerge, Cpu, Save, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  routes: any[];
  providers: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const AiRoutingView: React.FC<Props> = ({ routes, providers, onRefresh, onToast }) => {
  const [editingRoute, setEditingRoute] = useState<any | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>AI Feature Routing & Automatic Failover Engine</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Map GETVNT platform AI capabilities to designated primary & fallback LLM providers with auto-failover.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Platform Feature</th>
                <th>Primary AI Provider</th>
                <th>Automatic Fallback Provider</th>
                <th>Preferred Model</th>
                <th>Max Tokens</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id}>
                  <td style={{ fontWeight: 700, color: '#FFF' }}>
                    <div style={{ fontSize: '14px' }}>{route.feature_name}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>{route.feature_key}</div>
                  </td>
                  <td>
                    <span style={{ background: 'rgba(245,158,11,0.15)', color: '#FBBF24', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                      {route.primary_provider?.name || 'OpenAI'}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                      {route.fallback_provider?.name || 'Google Gemini'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#E5E7EB' }}>
                      {route.preferred_model || 'gpt-4o'}
                    </span>
                  </td>
                  <td>{route.max_tokens} tokens</td>
                  <td>
                    <span className={`admin-badge ${route.is_active ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                      {route.is_active ? 'ROUTING ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => setEditingRoute(route)}
                    >
                      Configure Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Route Modal */}
      {editingRoute && (
        <div className="modal-overlay" onClick={() => setEditingRoute(null)}>
          <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              Configure Route: {editingRoute.feature_name}
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  primary_provider_id: parseInt(formData.get('primary_provider_id') as string),
                  fallback_provider_id: parseInt(formData.get('fallback_provider_id') as string),
                  preferred_model: formData.get('preferred_model'),
                  max_tokens: parseInt(formData.get('max_tokens') as string),
                  temperature: parseFloat(formData.get('temperature') as string),
                  is_active: formData.get('is_active') === 'true',
                };

                try {
                  const res = await fetch(`/api/v1/admin/integrations/ai-routing/${editingRoute.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`
                    },
                    body: JSON.stringify(payload),
                  });
                  const json = await res.json();
                  if (json.success) {
                    onToast(`AI Routing updated for ${editingRoute.feature_name}!`);
                    setEditingRoute(null);
                    onRefresh();
                  }
                } catch (err) {
                  onToast('Error updating AI route.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Primary AI Provider</label>
                <select className="admin-input" name="primary_provider_id" defaultValue={editingRoute.primary_provider_id}>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.default_model})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Fallback Failover Provider</label>
                <select className="admin-input" name="fallback_provider_id" defaultValue={editingRoute.fallback_provider_id}>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.default_model})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Preferred Model</label>
                <input className="admin-input" name="preferred_model" defaultValue={editingRoute.preferred_model || 'gpt-4o'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Max Tokens Limit</label>
                <input className="admin-input" type="number" name="max_tokens" defaultValue={editingRoute.max_tokens || 2048} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Temperature (Creativity 0.0 - 1.0)</label>
                <input className="admin-input" type="number" step="0.1" name="temperature" defaultValue={editingRoute.temperature || 0.7} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Routing Status</label>
                <select className="admin-input" name="is_active" defaultValue={editingRoute.is_active ? 'true' : 'false'}>
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>Save Route Config</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setEditingRoute(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
