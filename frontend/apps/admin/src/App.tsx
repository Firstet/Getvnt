import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ShieldCheck, Wallet, CreditCard, Bot, Globe, CheckCircle2, XCircle, Award, Sparkles, RefreshCw, LogOut } from 'lucide-react';

export function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [gateways, setGateways] = useState<any[]>([]);
  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      fetch('/api/v1/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setStats(data.data); })
        .catch(() => {});

      fetch('/api/v1/admin/users', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setUsersList(data.data || []); })
        .catch(() => {});

      fetch('/api/v1/admin/verifications', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setVerifications(data.data || []); })
        .catch(() => {});

      fetch('/api/v1/admin/payouts', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setPayouts(data.data || []); })
        .catch(() => {});

      fetch('/api/v1/admin/ledger', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setLedgerEntries(data.data || []); })
        .catch(() => {});

      fetch('/api/v1/admin/gateways', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success && data.data) setGateways(data.data.gateways || []); })
        .catch(() => {});

      fetch('/api/v1/admin/ai-providers', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setAiProviders(data.data || []); })
        .catch(() => {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateUserPlan = async (userId: string, newPlan: string) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subscription_plan: newPlan })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, subscription_plan: newPlan } : u));
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdateUserVerification = async (userId: string, newStatus: string) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ verification_status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => u.id === userId ? {
          ...u,
          verification_status: newStatus,
          verified_badge: newStatus === 'approved',
          role: newStatus === 'approved' ? 'trusted_organizer' : u.role
        } : u));
      }
    } catch (e) { console.error(e); }
  };

  const handleApproveVerification = async (verificationId: string) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    try {
      const res = await fetch(`/api/v1/admin/verifications/${verificationId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setVerifications(prev => prev.map(v => v.id === verificationId ? { ...v, status: 'approved' } : v));
        fetchAdminData();
      }
    } catch (e) { console.error(e); }
  };

  const handleDisbursePayout = async (payoutId: string) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    try {
      const res = await fetch(`/api/v1/admin/payouts/${payoutId}/disburse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPayouts(prev => prev.map(p => p.id === payoutId ? { ...p, status: 'completed' } : p));
      }
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    window.location.href = 'https://getvnt.com';
  };

  const navItems = [
    { key: 'dashboard', label: '📊 SaaS Overview & Analytics' },
    { key: 'users', label: `👥 Users Directory (${usersList.length})` },
    { key: 'verifications', label: `🛡️ Verification Queue (${verifications.filter(v => v.status === 'pending').length})` },
    { key: 'payouts', label: `🏦 Payout Center (${payouts.filter(p => p.status === 'pending').length})` },
    { key: 'ledger', label: `💳 Double-Entry Wallet Ledger (${ledgerEntries.length})` },
    { key: 'gateways', label: '💳 Payment Gateways & Fees (5%/1.5%)' },
    { key: 'ai_fleet', label: '🤖 AI Fleet Management' },
    { key: 'cms', label: '🌐 CMS & Landing Page Builder' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#090d16', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Super Admin Sidebar */}
      <aside style={{ width: '280px', background: '#0f172a', borderRight: '1px solid #1e293b', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingLeft: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>
            SA
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff' }}>GETVNT OS</h1>
            <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 800, textTransform: 'uppercase' }}>Super Admin Portal</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveModule(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: activeModule === item.key ? '#1e293b' : 'transparent',
                color: activeModule === item.key ? '#f87171' : '#94a3b8',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: activeModule === item.key ? 800 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#f87171', fontWeight: 700, cursor: 'pointer' }}>
            <LogOut size={16} /> Exit Admin Portal
          </button>
        </div>
      </aside>

      {/* Main Admin View */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#090d16', padding: '32px', color: '#f8fafc' }}>
        
        {/* Module 1: Dashboard Overview */}
        {activeModule === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 24px' }}>SaaS Platform Control Center Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Total Users</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '6px 0 0', color: '#60a5fa' }}>{stats?.total_users || 0}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Verified Organizers</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '6px 0 0', color: '#34d399' }}>{stats?.total_organizers || 0}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Platform 5% Revenue</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '6px 0 0', color: '#fbbf24' }}>${stats?.platform_revenue || 0.00}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Pending Verification Queue</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '6px 0 0', color: '#f87171' }}>{stats?.pending_verifications || 0}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: Users Directory & Role/Plan/Verification Override */}
        {activeModule === 'users' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px' }}>Users Directory &amp; Manual Override Center</h2>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '12px' }}>User</th>
                    <th style={{ padding: '12px' }}>Identity Role</th>
                    <th style={{ padding: '12px' }}>Verification Badge</th>
                    <th style={{ padding: '12px' }}>Subscription Plan</th>
                    <th style={{ padding: '12px' }}>Actions / Override</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{u.name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                          style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '12px', fontWeight: 700 }}
                        >
                          <option value="attendee">Attendee</option>
                          <option value="trusted_organizer">Trusted Organizer</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <select
                          value={u.verification_status || 'unverified'}
                          onChange={(e) => handleUpdateUserVerification(u.id, e.target.value)}
                          style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', color: u.verification_status === 'approved' ? '#34d399' : '#fbbf24', fontSize: '12px', fontWeight: 800 }}
                        >
                          <option value="unverified">Unverified</option>
                          <option value="pending">Pending Review</option>
                          <option value="approved">Approved ✓</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <select
                          value={u.subscription_plan || 'starter'}
                          onChange={(e) => handleUpdateUserPlan(u.id, e.target.value)}
                          style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', color: u.subscription_plan === 'pro' ? '#c084fc' : '#fff', fontSize: '12px', fontWeight: 800 }}
                        >
                          <option value="starter">Starter (Free)</option>
                          <option value="pro">Pro Plan</option>
                          <option value="enterprise">Enterprise Plan</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px' }}>
                        {u.verification_status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateUserVerification(u.id, 'approved')}
                            style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                          >
                            ⚡ Instant Auto-Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Module 3: Verification Queue Review */}
        {activeModule === 'verifications' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px' }}>Organizer KYC Verification Queue</h2>
            {verifications.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No pending verification submissions in queue.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {verifications.map(v => (
                  <div key={v.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: v.status === 'approved' ? '#34d399' : '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>STATUS: {v.status}</span>
                      <h3 style={{ margin: '4px 0', fontSize: '20px', color: '#fff' }}>{v.business_name}</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                        Applicant: {v.user?.email} • Bank: {v.bank_name} ({v.account_number})
                      </p>
                    </div>
                    {v.status === 'pending' && (
                      <button
                        onClick={() => handleApproveVerification(v.id)}
                        style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        ✅ Approve &amp; Grant Badge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Module 4: Payout Center */}
        {activeModule === 'payouts' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px' }}>Payout Center &amp; Disbursal Queue</h2>
            {payouts.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No payout requests submitted.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {payouts.map(p => (
                  <div key={p.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 800 }}>STATUS: {p.status.toUpperCase()}</span>
                      <h3 style={{ margin: '4px 0', fontSize: '22px', color: '#34d399' }}>${p.amount} USD</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                        Bank: {p.bank_name} • Account: {p.account_number} ({p.account_name})
                      </p>
                    </div>
                    {p.status === 'pending' && (
                      <button
                        onClick={() => handleDisbursePayout(p.id)}
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        🏦 Disburse Payout
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Module 5: Double-Entry Wallet Ledger Audit */}
        {activeModule === 'ledger' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px' }}>Global Double-Entry Accounting Ledger Audit</h2>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
              {ledgerEntries.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No double-entry ledger entries recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ledgerEntries.map(e => (
                    <div key={e.id} style={{ background: '#1e293b', padding: '14px 18px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                      <span>[{e.direction.toUpperCase()}] {e.description}</span>
                      <strong style={{ color: e.direction === 'credit' ? '#34d399' : '#f87171' }}>
                        {e.direction === 'credit' ? '+' : '-'}${e.amount}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Module 6: Payment Gateways & Editable Fees (5% / 1.5%) */}
        {activeModule === 'gateways' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>Payment Gateways &amp; Platform Fee Calculator</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Configure default Platform Processing Fee (5.0%) and Gateway Fee (1.5%).</p>
            
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', maxWidth: '560px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Active Fee Structure</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#1e293b', padding: '14px 18px', borderRadius: '12px' }}>
                  <span>Platform Processing Fee</span>
                  <strong style={{ color: '#60a5fa' }}>5.0%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#1e293b', padding: '14px 18px', borderRadius: '12px' }}>
                  <span>Payment Gateway Processing Fee</span>
                  <strong style={{ color: '#c084fc' }}>1.5%</strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
