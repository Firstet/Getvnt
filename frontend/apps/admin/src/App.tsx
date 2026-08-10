import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, ShieldCheck, Wallet, CreditCard, Bot, Globe,
  CheckCircle2, XCircle, Award, Sparkles, RefreshCw, LogOut, Search,
  DollarSign, Activity, Settings, Bell, Server, Cpu, Database, FileText,
  Lock, AlertTriangle, Download, Send, Edit, Trash2, Key, Zap, Check, Eye, Calendar,
  Sliders, ArrowUpRight, Plus, Terminal, Filter, Layers, Copy, Info, UserPlus
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
  const [gatewayMetrics, setGatewayMetrics] = useState<any>(null);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [feeRules, setFeeRules] = useState<any>(null);

  // AI Fleet State
  const [aiFleetData, setAiFleetData] = useState<any>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<any>(null);
  const [walletAction, setWalletAction] = useState<'credit' | 'debit' | 'freeze'>('credit');
  const [walletAmount, setWalletAmount] = useState('100');
  const [walletReason, setWalletReason] = useState('Promotional bonus');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Provision Organizer State
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provBusiness, setProvBusiness] = useState('');
  const [provPlan, setProvPlan] = useState('pro');

  const [cmsSections, setCmsSections] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [developerHealth, setDeveloperHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter Inputs
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [platformFeeInput, setPlatformFeeInput] = useState('5.0');
  const [gatewayFeeInput, setGatewayFeeInput] = useState('1.5');
  const [newPromptCategory, setNewPromptCategory] = useState('global');
  const [newPromptTitle, setNewPromptTitle] = useState('Event Description Builder Prompt');
  const [newPromptText, setNewPromptText] = useState('Generate an exciting event title and 200-word marketing description.');

  const getToken = () =>
    localStorage.getItem('getvnt_auth_token') ||
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('getvnt_auth_token') ||
    sessionStorage.getItem('auth_token') ||
    localStorage.getItem('token');

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
        .then(data => { if (data.success) { setGateways(data.data || []); setGatewayMetrics(data.metrics); } });

      fetch('/api/v1/admin/webhooks', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setWebhooks(data.data || []); });

      fetch('/api/v1/admin/refunds', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setRefunds(data.data || []); });

      fetch('/api/v1/admin/fee-rules', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success && data.data) { setFeeRules(data.data); setPlatformFeeInput(data.data.platform_fee); setGatewayFeeInput(data.data.processing_fee); } });

      fetch('/api/v1/admin/ai/fleet', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setAiFleetData(data); });

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

  const handleProvisionOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    try {
      const res = await fetch('/api/v1/admin/organizers/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: provName, email: provEmail, business_name: provBusiness, subscription_plan: provPlan })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsProvisionModalOpen(false);
        setProvName('');
        setProvEmail('');
        setProvBusiness('');
        fetchAdminData();
      } else {
        alert(data.message || 'Failed to provision organizer.');
      }
    } catch (e) { console.error(e); }
  };

  const handleImpersonateUser = async (userId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/impersonate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.impersonate_token) {
        localStorage.setItem('getvnt_auth_token', data.impersonate_token);
        localStorage.setItem('auth_token', data.impersonate_token);
        localStorage.setItem('getvnt_impersonating', 'true');
        alert(`Now impersonating ${data.target_user.name}. Opening Workspace...`);
        window.location.href = data.redirect_url;
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to permanently delete this user account?')) return;
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (e) { console.error(e); }
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

  const handleWalletAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrganizer) return;
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/organizers/${selectedOrganizer.id}/wallet-adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: walletAction, amount: parseFloat(walletAmount), reason: walletReason })
      });
      const data = await res.json();
      if (data.success) {
        setIsWalletModalOpen(false);
        fetchAdminData();
      }
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

  const handleRejectVerification = async (verificationId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/verifications/${verificationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: 'Documents failed compliance check.' })
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (e) { console.error(e); }
  };

  const handleUpdatePaymentConfig = async (configId: string, payload: any) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/payment-gateways/${configId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) alert(data.message);
    } catch (e) { console.error(e); }
  };

  const handleReplayWebhook = async (webhookId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/admin/webhooks/${webhookId}/replay`, {
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

  const handleTestAiConnection = async (providerCode: string) => {
    const token = getToken();
    try {
      const res = await fetch('/api/v1/admin/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ provider_code: providerCode })
      });
      const data = await res.json();
      if (data.success) alert(data.message);
    } catch (e) { console.error(e); }
  };

  const handleCreateAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    try {
      const res = await fetch('/api/v1/admin/ai/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category: newPromptCategory, title: newPromptTitle, prompt_text: newPromptText })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        setNewPromptTitle('');
        setNewPromptText('');
      }
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('getvnt_auth_token');
    localStorage.removeItem('auth_token');
    window.location.href = 'https://getvnt.com';
  };

  const modules = [
    { key: 'overview', label: '1. Platform Overview', icon: LayoutDashboard },
    { key: 'users', label: '2. User Management', icon: Users },
    { key: 'organizers', label: '3. Organizer Control Room', icon: ShieldCheck },
    { key: 'verifications', label: '4. Verification Queue', icon: CheckCircle2 },
    { key: 'events', label: '5. Event Management', icon: Calendar },
    { key: 'finance', label: '6. Finance Center', icon: DollarSign },
    { key: 'gateways', label: '7. Payment Settings', icon: CreditCard },
    { key: 'fee_rules', label: '8. Platform Fees', icon: Sliders },
    { key: 'ledger', label: '9. Double Entry Ledger', icon: FileText },
    { key: 'payouts', label: '10. Payout Center', icon: Wallet },
    { key: 'subscriptions', label: '11. Subscriptions', icon: Award },
    { key: 'cms', label: '12. CMS Landing Builder', icon: FileText },
    { key: 'websites', label: '13. Website Builder Control', icon: Globe },
    { key: 'ai_fleet', label: '14. AI Control Center', icon: Bot },
    { key: 'broadcasts', label: '15. Broadcast Center', icon: Send },
    { key: 'system_settings', label: '16. System Settings', icon: Settings },
    { key: 'audit_logs', label: '17. Audit Logs', icon: Lock },
    { key: 'security', label: '18. Security Control', icon: Key },
    { key: 'reports', label: '19. Reports & Growth', icon: Activity },
    { key: 'developer', label: '20. Developer System Health', icon: Cpu },
  ];

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#c084fc', fontSize: '18px', fontWeight: 800 }}>
        Loading GETVNT SaaS Control Center...
      </div>
    );
  }

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#090d16', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#0f172a', borderRight: '1px solid #1e293b', padding: '24px 16px', display: 'flex', flexDirection: 'column', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '20px' }}>
            S
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 900, margin: 0, color: '#fff' }}>SUPER ADMIN OS</h2>
            <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 800 }}>SAAS PLATFORM CONTROL</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {modules.map(mod => {
            const IconC = mod.icon;
            const isActive = activeModule === mod.key;
            return (
              <button
                key={mod.key}
                onClick={() => setActiveModule(mod.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px',
                  background: isActive ? '#1e293b' : 'transparent', color: isActive ? '#c084fc' : '#94a3b8', border: 'none',
                  fontSize: '13px', fontWeight: isActive ? 800 : 500, cursor: 'pointer', textAlign: 'left'
                }}
              >
                <IconC size={16} color={isActive ? '#c084fc' : '#94a3b8'} />
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', marginTop: '16px' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', color: '#f87171', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            <LogOut size={16} /> Exit Control Center
          </button>
        </div>
      </aside>

      {/* Main Control Panel Body */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px', color: '#f8fafc' }}>
        
        {/* Module 1: Overview */}
        {activeModule === 'overview' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 24px', color: '#fff' }}>Platform Overview Command Center</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Total Users</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: '#fff' }}>{overviewData?.total_users || 0}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Trusted Organizers</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: '#34d399' }}>{overviewData?.trusted_organizers || 0}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Platform Revenue (Month)</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: '#fbbf24' }}>${overviewData?.platform_revenue_month || 0.00}</h2>
              </div>
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Pending Verifications</span>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: '#c084fc' }}>{overviewData?.pending_verifications || 0}</h2>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: User Directory & Management */}
        {activeModule === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff' }}>User Directory &amp; Global Permissions</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 16px', color: '#fff', fontSize: '13.5px', width: '260px' }}
                />
                <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13.5px' }}>
                  <option value="all">All Roles</option>
                  <option value="attendee">Attendee</option>
                  <option value="trusted_organizer">Trusted Organizer</option>
                  <option value="organizer_pro">Organizer Pro</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#cbd5e1' }}>
                    <th style={{ padding: '16px 20px' }}>User</th>
                    <th style={{ padding: '16px 20px' }}>Role</th>
                    <th style={{ padding: '16px 20px' }}>Plan</th>
                    <th style={{ padding: '16px 20px' }}>KYC Status</th>
                    <th style={{ padding: '16px 20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{u.name}</div>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{u.email}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select value={u.role} onChange={(e) => handleUpdateUserRole(u.id, e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '6px 10px' }}>
                          <option value="attendee">Attendee</option>
                          <option value="trusted_organizer">Trusted Organizer</option>
                          <option value="organizer_pro">Organizer Pro</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select value={u.subscription_plan || 'starter'} onChange={(e) => handleUpdateUserPlan(u.id, e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '6px 10px' }}>
                          <option value="starter">Starter</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ background: u.verification_status === 'approved' ? '#052e16' : '#78350f', color: u.verification_status === 'approved' ? '#34d399' : '#fbbf24', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
                          {u.verification_status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleImpersonateUser(u.id)} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                          Login As User
                        </button>
                        <button onClick={() => handleDeleteUser(u.id)} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Module 3: Organizer Control Room */}
        {activeModule === 'organizers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff' }}>Organizer Control Room &amp; Workspace Management</h2>
              <button onClick={() => setIsProvisionModalOpen(true)} style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={16} /> + Provision New Organizer
              </button>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#cbd5e1' }}>
                    <th style={{ padding: '16px 20px' }}>Business / Organizer</th>
                    <th style={{ padding: '16px 20px' }}>Owner</th>
                    <th style={{ padding: '16px 20px' }}>Verified Badge</th>
                    <th style={{ padding: '16px 20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizers.map(org => (
                    <tr key={org.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{org.tenant?.name || org.name}</div>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{org.email}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>{org.name}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <button onClick={() => handleToggleBlueTick(org.id)} style={{ background: org.verified_badge ? '#052e16' : '#1e293b', border: `1px solid ${org.verified_badge ? '#34d399' : '#334155'}`, color: org.verified_badge ? '#34d399' : '#94a3b8', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                          {org.verified_badge ? '✓ Verified Badge' : '+ Grant Badge'}
                        </button>
                      </td>
                      <td style={{ padding: '16px 20px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setSelectedOrganizer(org); setIsWalletModalOpen(true); }} style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                          Adjust Wallet
                        </button>
                        <button onClick={() => handleImpersonateUser(org.id)} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                          Login As Organizer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Module 4: Verification Queue */}
        {activeModule === 'verifications' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 24px', color: '#fff' }}>Verification Queue &amp; Hybrid AI Auto-Check</h2>
            
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c084fc', fontSize: '14px', fontWeight: 700 }}>
                <Bot size={18} />
                <span>AI Automated Verification Engine is Active</span>
              </div>
              <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '13px' }}>
                Submissions with high AI confidence score (&ge; 90%) are auto-approved. Complex or unverified documents are queued below for manual review.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {verifications.map(v => (
                <div key={v.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#fff' }}>{v.business_name}</h3>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>Submitted by: {v.user?.name} ({v.user?.email}) • Phone: {v.phone}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: v.ai_auto_verified ? '#052e16' : '#78350f', color: v.ai_auto_verified ? '#34d399' : '#fbbf24', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 900 }}>
                        AI Score: {v.ai_confidence_score ? `${Math.round(v.ai_confidence_score * 100)}%` : '75%'} ({v.ai_recommendation || 'requires_manual_review'})
                      </span>
                      <span style={{ background: v.status === 'approved' ? '#052e16' : '#1e293b', color: v.status === 'approved' ? '#34d399' : '#cbd5e1', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 800 }}>
                        STATUS: {v.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ background: '#1e293b', borderRadius: '12px', padding: '14px', marginBottom: '16px', fontSize: '13px', color: '#cbd5e1' }}>
                    <strong>Bank Account:</strong> {v.bank_name} - {v.account_number} ({v.account_name})<br/>
                    <strong>AI Notes:</strong> {v.ai_notes || 'Uploaded documents match identity records.'}
                  </div>

                  {v.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleApproveVerification(v.id)} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}>
                        ✓ Approve &amp; Issue Blue Tick
                      </button>
                      <button onClick={() => handleRejectVerification(v.id)} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}>
                        ✕ Reject Submission
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 7: Payment Settings */}
        {activeModule === 'gateways' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 24px', color: '#fff' }}>Payment Gateways Configuration</h2>
            
            {/* Setup Guidance Box */}
            <div style={{ background: '#0f172a', border: '1px solid #3b82f6', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa', fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>
                <Info size={18} />
                <span>How to Configure Payment Gateway Keys</span>
              </div>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: 1.5 }}>
                Enter your live/sandbox credentials below for <strong>Paystack</strong>, <strong>Flutterwave</strong>, <strong>Stripe</strong>, <strong>Monnify</strong>, <strong>Remita</strong>, and <strong>Square</strong>. These values persist directly in the database. Updating keys here instantly updates all checkout flows platform-wide without restarting servers.
              </p>
            </div>

            {/* Provider List & API Key Editor */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {gateways.map(gw => (
                <div key={gw.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, textTransform: 'capitalize', color: '#fff' }}>{gw.provider} Gateway</h3>
                    <span style={{ background: gw.is_enabled ? '#052e16' : '#78350f', color: gw.is_enabled ? '#34d399' : '#fbbf24', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
                      {gw.environment.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Public Key</label>
                      <input type="text" defaultValue={gw.public_key || ''} onChange={(e) => gw.public_key = e.target.value} placeholder="pk_live_..." style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Secret Key</label>
                      <input type="password" defaultValue={gw.secret_key || ''} onChange={(e) => gw.secret_key = e.target.value} placeholder="sk_live_..." style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      <button onClick={() => handleUpdatePaymentConfig(gw.id, gw)} style={{ flex: 1, background: '#4f46e5', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                        Save Credentials to Database
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 14: AI Operations Fleet Control Center */}
        {activeModule === 'ai_fleet' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 24px', color: '#fff' }}>AI Operations Fleet Control Center</h2>

            {/* Setup Guidance Box */}
            <div style={{ background: '#0f172a', border: '1px solid #a855f7', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c084fc', fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>
                <Bot size={18} />
                <span>AI Fleet Credentials &amp; Feature Model Selector</span>
              </div>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: 1.5 }}>
                Configure API keys for <strong>OpenAI</strong>, <strong>Claude</strong>, <strong>Gemini</strong>, <strong>DeepSeek</strong>, <strong>Groq</strong>, <strong>OpenRouter</strong>, and <strong>Ollama</strong> below. Every feature (Event Builder, Poster Generator, CRM, KYC Check) can be assigned a custom model. Zero code changes required.
              </p>
            </div>

            {/* Provider Manager List */}
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>AI Model Fleet Providers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              {aiFleetData?.providers?.map((prov: any) => (
                <div key={prov.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff' }}>{prov.name}</h4>
                    <span style={{ background: '#052e16', color: '#34d399', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '99px' }}>ACTIVE</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>Model: <strong style={{ color: '#fff' }}>{prov.default_model}</strong> • Latency: {prov.avg_latency_ms}ms</div>
                  <input type="password" defaultValue={prov.api_key || ''} onChange={(e) => prov.api_key = e.target.value} placeholder="sk-proj-..." style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12px', marginBottom: '10px' }} />
                  <button onClick={() => handleTestAiConnection(prov.provider)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: '#c084fc', padding: '8px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}>
                    Test API Connection →
                  </button>
                </div>
              ))}
            </div>

            {/* Feature Model Assignments */}
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Feature AI Assignment</h3>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {aiFleetData?.feature_models?.map((fm: any) => (
                  <div key={fm.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>{fm.feature_name}</div>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Provider: {fm.provider_code.toUpperCase()}</span>
                    </div>
                    <span style={{ background: '#3b82f6', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                      {fm.model_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Prompt Creator */}
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Add System Prompt to Library</h3>
            <form onSubmit={handleCreateAiPrompt} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Prompt Title</label>
                <input type="text" value={newPromptTitle} onChange={(e) => setNewPromptTitle(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Prompt Content</label>
                <textarea value={newPromptText} onChange={(e) => setNewPromptText(e.target.value)} required rows={4} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <button type="submit" style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', width: 'fit-content' }}>
                Save System Prompt
              </button>
            </form>

          </div>
        )}

      </main>

      {/* Manual Wallet Credit/Debit Modal */}
      {isWalletModalOpen && selectedOrganizer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,7,14,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '32px', color: '#fff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 16px' }}>Adjust Wallet: {selectedOrganizer.name}</h3>
            <form onSubmit={handleWalletAdjust} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Action</label>
                <select value={walletAction} onChange={(e: any) => setWalletAction(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}>
                  <option value="credit">Credit Balance</option>
                  <option value="debit">Debit Balance</option>
                  <option value="freeze">Freeze Wallet</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Amount ($)</label>
                <input type="number" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Reason</label>
                <input type="text" value={walletReason} onChange={(e) => setWalletReason(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}>Submit Wallet Change</button>
                <button type="button" onClick={() => setIsWalletModalOpen(false)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provision Organizer Modal */}
      {isProvisionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,7,14,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', maxWidth: '460px', width: '100%', padding: '32px', color: '#fff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 16px' }}>Provision New Organizer &amp; Workspace</h3>
            <form onSubmit={handleProvisionOrganizer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Owner Full Name</label>
                <input type="text" value={provName} onChange={(e) => setProvName(e.target.value)} placeholder="e.g. Sarah Connor" required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                <input type="email" value={provEmail} onChange={(e) => setProvEmail(e.target.value)} placeholder="sarah@eventorg.com" required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Business / Organization Name</label>
                <input type="text" value={provBusiness} onChange={(e) => setProvBusiness(e.target.value)} placeholder="Apex Concerts Ltd" required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Subscription Plan</label>
                <select value={provPlan} onChange={(e) => setProvPlan(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}>
                  <option value="starter">Starter Plan</option>
                  <option value="pro">Organizer Pro Plan</option>
                  <option value="enterprise">Enterprise Tier</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 900, cursor: 'pointer' }}>Provision Workspace</button>
                <button type="button" onClick={() => setIsProvisionModalOpen(false)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
