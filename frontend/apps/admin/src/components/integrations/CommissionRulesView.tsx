import React, { useState } from 'react';
import { Percent, Plus, Trash2, Edit3, ShieldAlert, DollarSign } from 'lucide-react';
import { ConfirmModal } from '../../../../../shared/src';

interface Props {
  rules: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const CommissionRulesView: React.FC<Props> = ({ rules, onRefresh, onToast }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any | null>(null);

  // Enterprise Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const promptDeleteRule = (id: number, name?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Commission Rule',
      message: `Are you sure you want to delete ${name ? `"${name}"` : 'this commission rule'}? Ticket split calculations will revert to default rates.`,
      onConfirm: () => executeDeleteRule(id),
    });
  };

  const executeDeleteRule = async (id: number) => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    try {
      const res = await fetch(`/api/v1/admin/integrations/commission-rules/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast('Commission rule deleted.');
        onRefresh();
      }
    } catch (err) {
      onToast('Failed to delete rule.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Commission Engine &amp; Dynamic Fee Rules</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Configure platform ticket split rules, VAT rates, service charges, &amp; plan tier fee thresholds.
          </p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setSelectedRule(null);
            setDrawerOpen(true);
          }}
        >
          <Plus size={16} /> Create Commission Rule
        </button>
      </div>

      <div className="admin-card">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Type</th>
                <th>Platform Fee</th>
                <th>Processing Fee</th>
                <th>VAT (%)</th>
                <th>Service Charge</th>
                <th>Min / Max Caps</th>
                <th>Plan Scope</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td style={{ fontWeight: 700, color: '#FFF' }}>{rule.name}</td>
                  <td>
                    <span style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                      {rule.rule_type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#F59E0B' }}>{rule.platform_fee}%</td>
                  <td style={{ color: '#60A5FA' }}>{rule.processing_fee}%</td>
                  <td style={{ color: '#D1D5DB' }}>{rule.vat_percent}%</td>
                  <td style={{ color: '#10B981', fontWeight: 600 }}>₦{rule.service_charge}</td>
                  <td style={{ fontSize: '11px', color: '#9CA3AF' }}>
                    Min: ₦{rule.min_charge} | Max: ₦{rule.max_charge}
                  </td>
                  <td>
                    <span style={{ background: 'rgba(255,255,255,0.06)', color: '#E5E7EB', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                      {rule.plan_scope.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${rule.is_active ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                      {rule.is_active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => {
                          setSelectedRule(rule);
                          setDrawerOpen(true);
                        }}
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px', color: '#EF4444' }}
                        onClick={() => promptDeleteRule(rule.id, rule.name)}
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

      {/* Slide-out Form Drawer */}
      {drawerOpen && (
        <div className="modal-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              {selectedRule ? `Edit Rule: ${selectedRule.name}` : 'Create Commission Rule'}
            </h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  name: formData.get('name'),
                  rule_type: formData.get('rule_type'),
                  platform_fee: parseFloat(formData.get('platform_fee') as string || '5.0'),
                  processing_fee: parseFloat(formData.get('processing_fee') as string || '1.5'),
                  vat_percent: parseFloat(formData.get('vat_percent') as string || '7.5'),
                  service_charge: parseFloat(formData.get('service_charge') as string || '100'),
                  min_charge: parseFloat(formData.get('min_charge') as string || '50'),
                  max_charge: parseFloat(formData.get('max_charge') as string || '50000'),
                  plan_scope: formData.get('plan_scope'),
                  is_active: formData.get('is_active') === 'true',
                };

                const url = selectedRule
                  ? `/api/v1/admin/integrations/commission-rules/${selectedRule.id}`
                  : '/api/v1/admin/integrations/commission-rules';

                const method = selectedRule ? 'PUT' : 'POST';

                try {
                  const res = await fetch(url, {
                    method,
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                  });
                  const json = await res.json();
                  if (json.success) {
                    onToast('Commission rule saved successfully!');
                    setDrawerOpen(false);
                    onRefresh();
                  }
                } catch (err) {
                  onToast('Error saving commission rule.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Rule Name</label>
                <input className="admin-input" name="name" defaultValue={selectedRule?.name || ''} required placeholder="e.g. Standard 5% Ticket Split" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Rule Type</label>
                <select className="admin-input" name="rule_type" defaultValue={selectedRule?.rule_type || 'hybrid'}>
                  <option value="percentage">Percentage Only</option>
                  <option value="flat">Flat Fee Only</option>
                  <option value="hybrid">Hybrid (Percentage + Flat Fee)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Platform Fee (%)</label>
                <input className="admin-input" type="number" step="0.01" name="platform_fee" defaultValue={selectedRule?.platform_fee || '5.0'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Processing Fee (%)</label>
                <input className="admin-input" type="number" step="0.01" name="processing_fee" defaultValue={selectedRule?.processing_fee || '1.5'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>VAT (%)</label>
                <input className="admin-input" type="number" step="0.01" name="vat_percent" defaultValue={selectedRule?.vat_percent || '7.5'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Service Charge (Flat NGN)</label>
                <input className="admin-input" type="number" name="service_charge" defaultValue={selectedRule?.service_charge || '100'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Plan Scope</label>
                <select className="admin-input" name="plan_scope" defaultValue={selectedRule?.plan_scope || 'all'}>
                  <option value="all">All Plans</option>
                  <option value="starter">Starter Plan Only</option>
                  <option value="professional">Professional Plan Only</option>
                  <option value="enterprise">Enterprise Plan Only</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Status</label>
                <select className="admin-input" name="is_active" defaultValue={selectedRule?.is_active ? 'true' : 'false'}>
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>Save Rule</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDrawerOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enterprise Custom Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Delete Rule"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
