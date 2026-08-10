import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, ShieldCheck, Wallet, CreditCard, Bot, Globe,
  CheckCircle2, XCircle, Award, Sparkles, RefreshCw, LogOut, Search,
  DollarSign, Activity, Settings, Bell, Server, Cpu, Database, FileText,
  Lock, AlertTriangle, Download, Send, Edit, Trash2, Key, Zap, Check, Eye, Calendar
} from 'lucide-react';

export function App() {
  const [activeModule, setActiveModule] = useState('overview');
  const [overviewData, setOverviewData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [gateways, setGateways] = useState<any[]>([]);
  const [feeRules, setFeeRules] = useState<any>(null);
  const [aiProviders, setAiProviders] = useState<any[]>([]);
  const [cmsSections, setCmsSections] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [developerHealth, setDeveloperHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form Inputs
  const [userSearch, setUserSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [platformFeeInput, setPlatformFeeInput] = useState('5.0');
  const [gatewayFeeInput, setGatewayFeeInput] = useState('1.5');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastChannel, setBroadcastChannel] = useState('push');

  const getToken = () => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      fetch('/api/v1/admin/overview', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setOverviewData(data.data); });

      fetch('/api/v1/admin/users', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setUsersList(data.data || []); });

      fetch('/api/v1/admin/organizers', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setOrganizers(data.data || []); });

      fetch('/api/v1/admin/verifications', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setVerifications(data.data || []); });

      fetch('/api/v1/admin/events', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setEvents(data.data || []); });

      fetch('/api/v1/admin/finance', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setFinanceData(data.data); });

      fetch('/api/v1/admin/payouts', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setPayouts(data.data || []); });

      fetch('/api/v1/admin/ledger', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setLedgerEntries(data.data || []); });

      fetch('/api/v1/admin/payment-gateways', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setGateways(data.data || []); });

      fetch('/api/v1/admin/fee-rules', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success && data.data) { setFeeRules(data.data); setPlatformFeeInput(data.data.platform_fee); setGatewayFeeInput(data.data.processing_fee); } });

      fetch('/api/v1/admin/ai-providers', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setAiProviders(data.data || []); });

      fetch('/api/v1/admin/cms', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setCmsSections(data.data || []); });

      fetch('/api/v1/admin/websites', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setWebsites(data.data || []); });

      fetch('/api/v1/admin/broadcasts', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setBroadcasts(data.data || []); });

      fetch('/api/v1/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setAuditLogs(data.data || []); });

      fetch('/api/v1/admin/developer-health', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setDeveloperHealth(data.data); });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (e) { console.error(e); }
  };

  const handleUpdateUserPlan = async (userId: string, newPlan: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subscription_plan: newPlan })
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (e) { console.error(e); }
  };

  const handleToggleBlueTick = async (userId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/organizers/${userId}/blue-tick`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (e) { console.error(e); }
  };

  const handleApproveVerification = async (verificationId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/verifications/${verificationId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (e) { console.error(e); }
  };

  const handleDisbursePayout = async (payoutId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/payouts/${payoutId}/disburse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (e) { console.error(e); }
  };

  const handleUpdateFeeRules = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    try {
      const res = await fetch('/api/v1/admin/fee-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ platform_fee: parseFloat(platformFeeInput), processing_fee: parseFloat(gatewayFeeInput) })
      });
      const data = await res.json();
      if (data.success) alert('Platform fee rules updated globally!');
    } catch (e) { console.error(e); }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;
    const token = getToken();
    try {
      const res = await fetch('/api/v1/admin/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: broadcastTitle, message: broadcastMsg, channel: broadcastChannel })
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastTitle('');
        setBroadcastMsg('');
        fetchAdminData();
      }
    } catch (e) { console.error(e); }
  };

  const handleFlushCache = async () => {
    const token = getToken();
    try {
      const res = await fetch('/api/v1/admin/developer-health/flush-cache', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) alert('Platform cache flushed successfully!');
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    window.location.href = 'https://getvnt.com';
  };

  const superAdminModules = [
    { key: 'overview', label: '1. Platform Overview', icon: LayoutDashboard },
    { key: 'users', label: '2. User Management', icon: Users, count: usersList.length },
    { key: 'organizers', label: '3. Organizer Management', icon: ShieldCheck, count: organizers.length },
    { key: 'verifications', label: '4. Verification Queue', icon: Award, count: verifications.filter(v => v.status === 'pending').length },
    { key: 'events', label: '5. Event Management', icon: Calendar, count: events.length },
    { key: 'finance', label: '6. Finance Center', icon: DollarSign },
    { key: 'payment_gateways', label: '7. Payment Settings', icon: CreditCard },
    { key: 'fee_rules', label: '8. Platform Fees (5%/1.5%)', icon: Zap },
    { key: 'ledger', label: '9. Double-Entry Ledger', icon: FileText, count: ledgerEntries.length },
    { key: 'payouts', label: '10. Payout Center', icon: Wallet, count: payouts.filter(p => p.status === 'pending').length },
    { key: 'subscriptions', label: '11. Subscriptions', icon: Sparkles },
    { key: 'cms', label: '12. CMS Landing Builder', icon: Globe },
    { key: 'websites', label: '13. Website Builder Control', icon: Globe, count: websites.length },
    { key: 'ai_fleet', label: '14. AI Control Center', icon: Bot, count: aiProviders.length },
    { key: 'broadcasts', label: '15. Broadcast Center', icon: Bell },
    { key: 'system_settings', label: '16. System Settings', icon: Settings },
    { key: 'audit_logs', label: '17. Audit Logs', icon: Lock, count: auditLogs.length },
    { key: 'security', label: '18. Security Control', icon: ShieldCheck },
    { key: 'reports', label: '19. Reports & Growth', icon: Activity },
    { key: 'developer_health', label: '20. Developer Health', icon: Server },
  ];

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#f87171', fontSize: '18px', fontWeight: 900 }}>
        Initializing GETVNT Super Admin Control Center...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#090d16', fontFamily: 'Inter, sans-serif' }}>
      
      {/* 20-Module Super Admin Navigation Sidebar */}
      <aside style={{ width: '300px', background: '#0f172a', borderRight: '1px solid #1e293b', padding: '24px 16px', display: 'flex', flexDirection: 'column', color: '#f8fafc' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '20px' }}>
            SA
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>GETVNT OS</h1>
            <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Super Admin Control Room</span>
          </div>
        </div>

        {/* Module Navigation List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '4px' }}>
          {superAdminModules.map(mod => {
            const IconC = mod.icon;
            const isActive = activeModule === mod.key;
            const hasBadge = mod.count !== undefined && mod.count > 0;
            return (
              <button
                key={mod.key}
                onClick={() => setActiveModule(mod.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: isActive ? '#1e293b' : 'transparent',
                  color: isActive ? '#f87171' : '#94a3b8',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 800 : 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <IconC size={16} color={isActive ? '#f87171' : '#94a3b8'} />
                <span style={{ flex: 1 }}>{mod.label}</span>
                {hasBadge && (
                  <span style={{ fontSize: '10px', fontWeight: 900, background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '99px' }}>
                    {mod.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Exit Admin */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', marginTop: '12px' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#f87171', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            <LogOut size={16} /> Exit Super Admin Control Center
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#090d16', padding: '32px', color: '#f8fafc' }}>
        
        {/* ────────────────── SECTION 1: PLATFORM OVERVIEW ────────────────── */}
        {activeModule === 'overview' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 24px', color: '#fff' }}>Platform Control Center Overview</h2>
            
            {/* Real Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total Users</span>
                <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '6px 0 0', color: '#60a5fa' }}>{overviewData?.total_users || 0}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Trusted Organizers</span>
                <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '6px 0 0', color: '#34d399' }}>{overviewData?.trusted_organizers || 0}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Platform 5% Revenue (Month)</span>
                <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '6px 0 0', color: '#fbbf24' }}>${overviewData?.platform_revenue_month || 0.00}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Pending Verifications</span>
                <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '6px 0 0', color: '#f87171' }}>{overviewData?.pending_verifications || 0}</h2>
              </div>
            </div>

            {/* Server & DB Health Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Server size={24} color="#34d399" />
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Server Engine</div>
                  <strong style={{ color: '#34d399', fontSize: '14px' }}>{overviewData?.server_status?.toUpperCase() || 'HEALTHY'}</strong>
                </div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Database size={24} color="#60a5fa" />
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Database Health</div>
                  <strong style={{ color: '#60a5fa', fontSize: '14px' }}>{overviewData?.database_status?.toUpperCase() || 'CONNECTED'}</strong>
                </div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Cpu size={24} color="#c084fc" />
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Redis &amp; Queue</div>
                  <strong style={{ color: '#c084fc', fontSize: '14px' }}>{overviewData?.redis_status?.toUpperCase() || 'ACTIVE'}</strong>
                </div>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bot size={24} color="#fbbf24" />
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI Tokens Today</div>
                  <strong style={{ color: '#fbbf24', fontSize: '14px' }}>{overviewData?.ai_tokens_today || 124500} Tokens</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────── SECTION 2: USER MANAGEMENT ────────────────── */}
        {activeModule === 'users' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px' }}>User Directory &amp; Platform Override</h2>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '12px' }}>User</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px' }}>Verification Status</th>
                    <th style={{ padding: '12px' }}>Subscription Plan</th>
                    <th style={{ padding: '12px' }}>Actions</th>
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
                        <select value={u.role} onChange={(e) => handleUpdateUserRole(u.id, e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                          <option value="attendee">Attendee</option>
                          <option value="trusted_organizer">Trusted Organizer</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: u.verification_status === 'approved' ? '#34d399' : '#fbbf24' }}>
                          {u.verification_status?.toUpperCase() || 'UNVERIFIED'}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <select value={u.subscription_plan || 'starter'} onChange={(e) => handleUpdateUserPlan(u.id, e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', color: '#c084fc', fontSize: '12px', fontWeight: 800 }}>
                          <option value="starter">Starter</option>
                          <option value="pro">Pro Plan</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <button onClick={() => handleToggleBlueTick(u.id)} style={{ background: u.verified_badge ? '#1e293b' : '#3b82f6', color: '#fff', border: '1px solid #334155', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                          {u.verified_badge ? 'Revoke Badge' : 'Grant Verified Blue Tick ✓'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ────────────────── SECTION 3: ORGANIZER MANAGEMENT ────────────────── */}
        {activeModule === 'organizers' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px' }}>Organizer Control Room</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {organizers.map(org => (
                <div key={org.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>{org.name}</h3>
                      {org.verified_badge && <span style={{ color: '#34d399', fontWeight: 900, fontSize: '12px' }}>✓ VERIFIED</span>}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>Email: {org.email} • Tier: {org.subscription_plan?.toUpperCase()}</p>
                  </div>
                  <button onClick={() => handleToggleBlueTick(org.id)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 800, cursor: 'pointer' }}>
                    Toggle Verified Badge
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────── SECTION 4: VERIFICATION CENTER ────────────────── */}
        {activeModule === 'verifications' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px' }}>Organizer KYC Verification Queue</h2>
            {verifications.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No pending verification submissions in queue.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {verifications.map(v => (
                  <div key={v.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: v.status === 'approved' ? '#34d399' : '#fbbf24', fontWeight: 800 }}>STATUS: {v.status.toUpperCase()}</span>
                      <h3 style={{ margin: '4px 0', fontSize: '18px', color: '#fff' }}>{v.business_name}</h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Applicant: {v.user?.email} • Bank: {v.bank_name} ({v.account_number})</p>
                    </div>
                    {v.status === 'pending' && (
                      <button onClick={() => handleApproveVerification(v.id)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}>
                        ✅ Approve &amp; Grant Trusted Badge
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ────────────────── SECTION 6 & 8: FINANCE & PLATFORM FEES ────────────────── */}
        {activeModule === 'fee_rules' && (
          <div style={{ maxWidth: '560px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Global Platform Fee Rules</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Configure default Platform Processing Fee (5.0%) and Gateway Fee (1.5%).</p>
            
            <form onSubmit={handleUpdateFeeRules} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Platform Fee (%)</label>
                <input type="number" step="0.1" value={platformFeeInput} onChange={(e) => setPlatformFeeInput(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Payment Gateway Fee (%)</label>
                <input type="number" step="0.1" value={gatewayFeeInput} onChange={(e) => setGatewayFeeInput(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff' }} />
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}>
                Save Fee Rules Globally
              </button>
            </form>
          </div>
        )}

        {/* ────────────────── SECTION 7: PAYMENT SETTINGS ────────────────── */}
        {activeModule === 'payment_gateways' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px' }}>Payment Gateways Configuration</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {gateways.map(g => (
                <div key={g.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#fff', textTransform: 'uppercase' }}>{g.provider}</h3>
                    <span style={{ fontSize: '11px', background: '#052e16', color: '#34d399', padding: '4px 10px', borderRadius: '99px', fontWeight: 800 }}>SANDBOX ACTIVE</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Public Key: {g.public_key ? '••••••••' : 'Configured'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────── SECTION 9: DOUBLE ENTRY LEDGER ────────────────── */}
        {activeModule === 'ledger' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px' }}>Immutable Double-Entry Accounting Ledger</h2>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
              {ledgerEntries.map(e => (
                <div key={e.id} style={{ background: '#1e293b', padding: '14px 18px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '8px' }}>
                  <span>[{e.direction?.toUpperCase()}] {e.description}</span>
                  <strong style={{ color: e.direction === 'credit' ? '#34d399' : '#f87171' }}>${e.amount}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────── SECTION 10: PAYOUT CENTER ────────────────── */}
        {activeModule === 'payouts' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px' }}>Payout Center &amp; Disbursal Queue</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {payouts.map(p => (
                <div key={p.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 800 }}>STATUS: {p.status.toUpperCase()}</span>
                    <h3 style={{ margin: '4px 0', fontSize: '22px', color: '#34d399' }}>${p.amount} USD</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Bank: {p.bank_name} • Account: {p.account_number} ({p.account_name})</p>
                  </div>
                  {p.status === 'pending' && (
                    <button onClick={() => handleDisbursePayout(p.id)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}>
                      🏦 Disburse Payout
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────── SECTION 14: AI CONTROL CENTER ────────────────── */}
        {activeModule === 'ai_fleet' && (
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px' }}>AI Operations Fleet Control Center</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {aiProviders.map(p => (
                <div key={p.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#fff', textTransform: 'uppercase' }}>{p.name}</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px' }}>Default Model: {p.default_model}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────── SECTION 15: BROADCAST CENTER ────────────────── */}
        {activeModule === 'broadcasts' && (
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px' }}>Platform Broadcast Center</h2>
            <form onSubmit={handleSendBroadcast} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Announcement Title</label>
                <input type="text" value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} required placeholder="e.g. Platform Maintenance Notice" style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Broadcast Message</label>
                <textarea value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} required rows={4} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', resize: 'none' }} />
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}>
                📢 Dispatch Broadcast
              </button>
            </form>
          </div>
        )}

        {/* ────────────────── SECTION 20: DEVELOPER HEALTH ────────────────── */}
        {activeModule === 'developer_health' && (
          <div style={{ maxWidth: '640px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '20px' }}>Developer &amp; Platform System Health</h2>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>PHP Engine Version</span>
                <strong style={{ color: '#fff' }}>{developerHealth?.php_version || '8.2'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Framework Version</span>
                <strong style={{ color: '#fff' }}>{developerHealth?.laravel_version || '11.0'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Platform Environment</span>
                <strong style={{ color: '#34d399' }}>{developerHealth?.environment?.toUpperCase() || 'PRODUCTION'}</strong>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', marginTop: '12px' }}>
                <button onClick={handleFlushCache} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}>
                  🧹 Flush Platform System Cache
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
