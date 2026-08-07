import React, { useState } from 'react';
import { Store, Download, Check, Star, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  marketplace: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const MarketplaceView: React.FC<Props> = ({ marketplace, onRefresh, onToast }) => {
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'AI', 'Payments', 'Communication', 'Storage', 'Marketing', 'CRM', 'Accounting', 'Productivity'];

  const filteredApps = marketplace.filter(
    (app) => categoryFilter === 'ALL' || app.category.toUpperCase() === categoryFilter.toUpperCase()
  );

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const handleToggleInstall = async (id: number, name: string, isInstalled: boolean) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/integrations/marketplace/${id}/toggle`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(!isInstalled ? `🚀 ${name} installed successfully!` : `Uninstalled ${name}.`);
        onRefresh();
      }
    } catch (err) {
      onToast('Error toggling application installation.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Integration Marketplace & App Store</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Discover and install pre-built integrations for Mailchimp, Zapier, Hubspot, Xero, Salesforce, & Segment.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
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

      {/* Cards Catalog */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {filteredApps.map((app) => (
          <div key={app.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F87171' }}>
                    <Store size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800 }}>{app.name}</h3>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>By {app.developer}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '12px', fontWeight: 700 }}>
                  <Star size={14} fill="#F59E0B" /> {app.rating}
                </div>
              </div>

              <p style={{ color: '#D1D5DB', fontSize: '13px', marginBottom: '16px', minHeight: '40px', lineHeight: '1.4' }}>
                {app.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF', marginBottom: '16px' }}>
                <span>Category: <strong style={{ color: '#FFF' }}>{app.category}</strong></span>
                <span>Version: <strong style={{ color: '#FFF' }}>v{app.version}</strong></span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '14px', display: 'flex', gap: '8px' }}>
              <button
                className={`admin-btn ${app.is_installed ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
                style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '8px' }}
                onClick={() => handleToggleInstall(app.id, app.name, app.is_installed)}
              >
                {app.is_installed ? (
                  <>
                    <Check size={14} color="#10B981" /> Installed (Click to Uninstall)
                  </>
                ) : (
                  <>
                    <Download size={14} /> Install Integration
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
