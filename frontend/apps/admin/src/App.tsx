import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, ShieldCheck, CheckCircle2, Calendar,
  DollarSign, CreditCard, Sliders, FileText, Wallet, Award,
  Globe, Bot, Send, Settings, Lock, Key, Activity, Cpu, LogOut,
  Search, Trash2, UserPlus, Info, Save, Star, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

import { PaymentGatewayControl } from './components/PaymentGatewayControl';
import { AiFleetControl } from './components/AiFleetControl';
import { EventManagement } from './components/EventManagement';
import { FinanceCenter } from './components/FinanceCenter';
import { PlatformFees } from './components/PlatformFees';
import { DoubleEntryLedger } from './components/DoubleEntryLedger';
import { Subscriptions } from './components/Subscriptions';
import { CmsLandingBuilder } from './components/CmsLandingBuilder';
import { WebsiteBuilderControl } from './components/WebsiteBuilderControl';
import { BroadcastCenter } from './components/BroadcastCenter';
import { SystemSettings } from './components/SystemSettings';
import { AuditLogs } from './components/AuditLogs';
import { SecurityControl } from './components/SecurityControl';
import { ReportsGrowth } from './components/ReportsGrowth';
import { DeveloperSystemHealth } from './components/DeveloperSystemHealth';
import { FloatingAiAssistant } from '@getvnt/shared';

/* ─── helpers ─── */
const cell: React.CSSProperties = { padding: '14px 18px' };
const badge = (color: string, bg: string, text: string) => (
  <span style={{ background: bg, color, padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>{text}</span>
);

export function App() {
  const [activeModule, setActiveModule] = useState('overview');

  /* ─── state ─── */
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
  const [aiFleetData, setAiFleetData] = useState<any>(null);
  const [cmsSections, setCmsSections] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [developerHealth, setDeveloperHealth] = useState<any>(null);
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ─── form state ─── */
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [selectedOrganizer, setSelectedOrganizer] = useState<any>(null);
  const [walletAction, setWalletAction] = useState<'credit' | 'debit' | 'freeze'>('credit');
  const [walletAmount, setWalletAmount] = useState('100');
  const [walletReason, setWalletReason] = useState('Promotional bonus');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provBusiness, setProvBusiness] = useState('');
  const [provPlan, setProvPlan] = useState('pro');
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptCategory, setNewPromptCategory] = useState('global');

  /* ─── auth ─── */
  const getToken = () =>
    localStorage.getItem('getvnt_auth_token') ||
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('getvnt_auth_token') ||
    sessionStorage.getItem('auth_token') ||
    localStorage.getItem('token') || '';

  /* ─── fetch ─── */
  const fetchAdminData = async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    const api = (path: string) =>
      fetch(`/api/v1/admin${path}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .catch(() => ({}));

    const [
      ovr, usr, org, ver, evt, fin, pay, led, gw, fee,
      ai, cms, web, brd, aud, dev, sys
    ] = await Promise.allSettled([
      api('/overview'), api('/users'), api('/organizers'), api('/verifications'),
      api('/events'), api('/finance'), api('/payouts'), api('/ledger'),
      api('/payment-gateways'), api('/fee-rules'), api('/ai/fleet'),
      api('/cms'), api('/websites'), api('/broadcasts'), api('/audit-logs'),
      api('/developer-health'), api('/system-settings'),
    ]);

    const get = (res: PromiseSettledResult<any>) => res.status === 'fulfilled' ? res.value : {};

    const setIfOk = (res: PromiseSettledResult<any>, setter: (d: any) => void, key = 'data') => {
      const d = get(res);
      if (d.success) setter(key === 'root' ? d : (d[key] ?? []));
    };

    setIfOk(ovr, setOverviewData, 'data');
    setIfOk(usr, setUsersList, 'data');
    setIfOk(org, setOrganizers, 'data');
    setIfOk(ver, setVerifications, 'data');
    setIfOk(evt, setEvents, 'data');
    setIfOk(fin, setFinanceData, 'data');
    setIfOk(pay, setPayouts, 'data');
    setIfOk(led, setLedgerEntries, 'data');
    setIfOk(gw, setGateways, 'data');
    setIfOk(fee, setFeeRules, 'data');
    setIfOk(ai, setAiFleetData, 'root');
    setIfOk(cms, setCmsSections, 'data');
    setIfOk(web, setWebsites, 'data');
    setIfOk(brd, setBroadcasts, 'data');
    setIfOk(aud, setAuditLogs, 'data');
    setIfOk(dev, setDeveloperHealth, 'data');
    const sysD = get(sys);
    if (sysD.success) setSystemSettings(sysD.data ?? sysD.settings ?? {});

    setLoading(false);
  };

  useEffect(() => { fetchAdminData(); }, []);

  /* ─── action handlers ─── */
  const token = getToken();

  const handleImpersonateUser = async (userId: string) => {
    const res = await fetch(`/api/v1/admin/users/${userId}/impersonate`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success && data.impersonate_token) {
      sessionStorage.setItem('getvnt_auth_token', data.impersonate_token);
      sessionStorage.setItem('getvnt_impersonating', 'true');
      alert(`Now impersonating ${data.target_user?.name}. Redirecting to workspace...`);
      window.location.href = data.redirect_url || '/workspace';
    } else { alert(data.message || 'Impersonation failed.'); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Permanently delete this user and all their data?')) return;
    const res = await fetch(`/api/v1/admin/users/${userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) fetchAdminData();
    else alert(data.message || 'Delete failed.');
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    const res = await fetch(`/api/v1/admin/users/${userId}/role`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ role }) });
    const data = await res.json();
    if (data.success) fetchAdminData();
  };

  const handleUpdateUserPlan = async (userId: string, plan: string) => {
    const res = await fetch(`/api/v1/admin/users/${userId}/plan`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ subscription_plan: plan }) });
    const data = await res.json();
    if (data.success) fetchAdminData();
  };

  const handleToggleBlueTick = async (userId: string) => {
    const res = await fetch(`/api/v1/admin/organizers/${userId}/blue-tick`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) fetchAdminData();
  };

  const handleWalletAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrganizer) return;
    const res = await fetch(`/api/v1/admin/organizers/${selectedOrganizer.id}/wallet-adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: walletAction, amount: parseFloat(walletAmount), reason: walletReason }),
    });
    const data = await res.json();
    if (data.success) { setIsWalletModalOpen(false); fetchAdminData(); }
    else alert(data.message || 'Wallet adjustment failed.');
  };

  const handleApproveVerification = async (id: string) => {
    const res = await fetch(`/api/v1/admin/verifications/${id}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) fetchAdminData();
    else alert(data.message || 'Approval failed.');
  };

  const handleRejectVerification = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    const res = await fetch(`/api/v1/admin/verifications/${id}/reject`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ reason }) });
    const data = await res.json();
    if (data.success) fetchAdminData();
    else alert(data.message || 'Rejection failed.');
  };

  const handleUpdatePaymentConfig = async (configId: string, payload: any) => {
    const res = await fetch(`/api/v1/admin/payment-gateways/${configId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success) alert('Gateway credentials saved to database!');
    else alert(data.message || 'Save failed.');
  };

  const handleTestAiConnection = async (providerCode: string) => {
    const res = await fetch('/api/v1/admin/ai/test-connection', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ provider_code: providerCode }) });
    const data = await res.json();
    alert(data.message || (data.success ? 'Connection successful!' : 'Connection failed.'));
  };

  const handleCreateAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/v1/admin/ai/prompts', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ category: newPromptCategory, title: newPromptTitle, prompt_text: newPromptText }) });
    const data = await res.json();
    if (data.success) { setNewPromptTitle(''); setNewPromptText(''); fetchAdminData(); alert('Prompt saved!'); }
    else alert(data.message || 'Failed to save prompt.');
  };

  const handleProvisionOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/v1/admin/organizers/provision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: provName, email: provEmail, business_name: provBusiness, subscription_plan: provPlan }),
    });
    const data = await res.json();
    if (data.success) { alert(data.message || 'Organizer provisioned!'); setIsProvisionModalOpen(false); setProvName(''); setProvEmail(''); setProvBusiness(''); fetchAdminData(); }
    else alert(data.message || 'Provisioning failed.');
  };

  const handleLogout = () => {
    ['getvnt_auth_token', 'auth_token', 'getvnt_impersonating'].forEach(k => {
      localStorage.removeItem(k); sessionStorage.removeItem(k);
    });
    window.location.href = '/';
  };

  /* ─── sidebar config ─── */
  const modules = [
    { key: 'overview',      label: '1. Platform Overview',       icon: LayoutDashboard },
    { key: 'users',         label: '2. User Management',         icon: Users },
    { key: 'organizers',    label: '3. Organizer Control Room',  icon: ShieldCheck },
    { key: 'verifications', label: '4. Verification Queue',      icon: CheckCircle2 },
    { key: 'events',        label: '5. Event Management',        icon: Calendar },
    { key: 'finance',       label: '6. Finance Center',          icon: DollarSign },
    { key: 'gateways',      label: '7. Payment Settings',        icon: CreditCard },
    { key: 'fee_rules',     label: '8. Platform Fees',           icon: Sliders },
    { key: 'ledger',        label: '9. Double Entry Ledger',     icon: FileText },
    { key: 'payouts',       label: '10. Payout Center',          icon: Wallet },
    { key: 'subscriptions', label: '11. Subscriptions',          icon: Award },
    { key: 'cms',           label: '12. CMS Landing Builder',    icon: FileText },
    { key: 'websites',      label: '13. Website Builder Control',icon: Globe },
    { key: 'ai_fleet',      label: '14. AI Control Center',      icon: Bot },
    { key: 'broadcasts',    label: '15. Broadcast Center',       icon: Send },
    { key: 'system_settings',label:'16. System Settings',        icon: Settings },
    { key: 'audit_logs',    label: '17. Audit Logs',             icon: Lock },
    { key: 'security',      label: '18. Security Control',       icon: Key },
    { key: 'reports',       label: '19. Reports & Growth',       icon: Activity },
    { key: 'developer',     label: '20. Developer System Health',icon: Cpu },
  ];

  /* ─── derived ─── */
  const filteredUsers = usersList.filter(u => {
    const q = userSearch.toLowerCase();
    return (
      (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) &&
      (userRoleFilter === 'all' || u.role === userRoleFilter)
    );
  });

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#c084fc', gap: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800 }}>Loading GETVNT Super Admin OS...</div>
        <div style={{ width: '200px', height: '4px', background: '#1e293b', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg,#a855f7,#ec4899)', borderRadius: '99px', animation: 'pulse 1.5s ease infinite' }} />
        </div>
      </div>
    );
  }

  /* ─── styles ─── */
  const sidebar: React.CSSProperties = { width: '280px', background: '#0f172a', borderRight: '1px solid #1e293b', padding: '24px 16px', display: 'flex', flexDirection: 'column', color: '#fff', flexShrink: 0 };
  const main: React.CSSProperties = { flex: 1, overflowY: 'auto', padding: '32px', color: '#f8fafc' };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#090d16', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#a855f7,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '20px' }}>S</div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 900, margin: 0 }}>SUPER ADMIN OS</h2>
            <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 800 }}>SAAS PLATFORM CONTROL</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {modules.map(mod => {
            const Icon = mod.icon;
            const active = activeModule === mod.key;
            return (
              <button key={mod.key} onClick={() => setActiveModule(mod.key)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', borderRadius: '10px', background: active ? '#1e293b' : 'transparent', color: active ? '#c084fc' : '#94a3b8', border: 'none', fontSize: '12.5px', fontWeight: active ? 800 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s' }}>
                <Icon size={15} color={active ? '#c084fc' : '#94a3b8'} />
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', marginTop: '16px' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', color: '#f87171', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
            <LogOut size={15} /> Exit Control Center
          </button>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <main style={main}>

        {/* MODULE 1: Platform Overview */}
        {activeModule === 'overview' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 24px', color: '#fff' }}>Platform Overview — Live Command Center</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Users', val: overviewData?.total_users ?? 0, color: '#60a5fa' },
                { label: 'Total Attendees', val: overviewData?.total_attendees ?? 0, color: '#34d399' },
                { label: 'Organizers', val: overviewData?.total_organizers ?? 0, color: '#a855f7' },
                { label: 'Trusted Organizers', val: overviewData?.trusted_organizers ?? 0, color: '#fbbf24' },
                { label: 'Pro Subscribers', val: overviewData?.pro_subscribers ?? 0, color: '#ec4899' },
                { label: 'Enterprise Clients', val: overviewData?.enterprise_clients ?? 0, color: '#f59e0b' },
                { label: 'Total Events', val: overviewData?.total_events ?? 0, color: '#38bdf8' },
                { label: 'Published Events', val: overviewData?.published_events ?? 0, color: '#34d399' },
                { label: 'Draft Events', val: overviewData?.draft_events ?? 0, color: '#94a3b8' },
                { label: 'Cancelled Events', val: overviewData?.cancelled_events ?? 0, color: '#f87171' },
                { label: 'Tickets Sold Today', val: overviewData?.tickets_sold_today ?? 0, color: '#a855f7' },
                { label: 'Tickets This Month', val: overviewData?.tickets_sold_month ?? 0, color: '#c084fc' },
                { label: 'Revenue Today', val: `$${parseFloat(overviewData?.platform_revenue_today ?? 0).toLocaleString()}`, color: '#fbbf24' },
                { label: 'Revenue This Month', val: `$${parseFloat(overviewData?.platform_revenue_month ?? 0).toLocaleString()}`, color: '#34d399' },
                { label: 'Pending Payouts', val: `$${parseFloat(overviewData?.pending_payouts ?? 0).toLocaleString()}`, color: '#f87171' },
                { label: 'Pending Verifications', val: overviewData?.pending_verifications ?? 0, color: '#fbbf24' },
              ].map(s => (
                <div key={s.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                  <div style={{ fontSize: '26px', fontWeight: 900, margin: '6px 0 0', color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 2: User Management */}
        {activeModule === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff' }}>User Directory & Global Permissions</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search name or email..." style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 16px', color: '#fff', fontSize: '13px', width: '240px' }} />
                <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}>
                  <option value="all">All Roles</option>
                  <option value="attendee">Attendee</option>
                  <option value="organizer">Organizer</option>
                  <option value="trusted_organizer">Trusted Organizer</option>
                  <option value="organizer_pro">Organizer Pro</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
                    {['User', 'Role', 'Plan', 'KYC', 'Joined', 'Actions'].map(h => <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '40px' }}>No users found.</td></tr>
                  )}
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={cell}>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{u.email}</div>
                      </td>
                      <td style={cell}>
                        <select value={u.role} onChange={e => handleUpdateUserRole(u.id, e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '6px 10px', fontSize: '12px' }}>
                          <option value="attendee">Attendee</option>
                          <option value="organizer">Organizer</option>
                          <option value="trusted_organizer">Trusted Organizer</option>
                          <option value="organizer_pro">Organizer Pro</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td style={cell}>
                        <select value={u.subscription_plan || 'starter'} onChange={e => handleUpdateUserPlan(u.id, e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '6px 10px', fontSize: '12px' }}>
                          <option value="starter">Starter</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td style={cell}>
                        {badge(
                          u.verification_status === 'approved' ? '#34d399' : '#fbbf24',
                          u.verification_status === 'approved' ? '#052e16' : '#78350f',
                          (u.verification_status || 'unverified').toUpperCase()
                        )}
                      </td>
                      <td style={{ ...cell, color: '#64748b', fontSize: '12px' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                      <td style={{ ...cell, display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleImpersonateUser(u.id)} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Login As</button>
                        <button onClick={() => handleDeleteUser(u.id)} style={{ background: '#450a0a', color: '#f87171', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 3: Organizer Control Room */}
        {activeModule === 'organizers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff' }}>Organizer Control Room</h2>
              <button onClick={() => setIsProvisionModalOpen(true)} style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={15} /> + Provision Organizer
              </button>
            </div>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
                    {['Business', 'Owner', 'Plan', 'Badge', 'Wallet', 'Actions'].map(h => <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {organizers.length === 0 && (
                    <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '40px' }}>No organizers yet.</td></tr>
                  )}
                  {organizers.map(org => (
                    <tr key={org.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={cell}>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{org.business_name || org.tenant?.name || org.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{org.email}</div>
                      </td>
                      <td style={{ ...cell, color: '#cbd5e1' }}>{org.name}</td>
                      <td style={cell}>{badge('#a855f7', '#2e1065', (org.subscription_plan || 'starter').toUpperCase())}</td>
                      <td style={cell}>
                        <button onClick={() => handleToggleBlueTick(org.id)} style={{ background: org.verified_badge ? '#052e16' : '#1e293b', border: `1px solid ${org.verified_badge ? '#34d399' : '#334155'}`, color: org.verified_badge ? '#34d399' : '#94a3b8', padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
                          {org.verified_badge ? '✓ Verified' : '+ Grant Badge'}
                        </button>
                      </td>
                      <td style={{ ...cell, color: '#fbbf24', fontWeight: 800 }}>${parseFloat(org.wallet_balance ?? 0).toLocaleString()}</td>
                      <td style={{ ...cell, display: 'flex', gap: '6px' }}>
                        <button onClick={() => { setSelectedOrganizer(org); setIsWalletModalOpen(true); }} style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 11px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Wallet</button>
                        <button onClick={() => handleImpersonateUser(org.id)} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '6px 11px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Login As</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 4: Verification Queue */}
        {activeModule === 'verifications' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 16px', color: '#fff' }}>KYC Verification Queue — Hybrid AI Review</h2>
            <div style={{ background: '#0f172a', border: '1px solid #7c3aed', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={18} color="#c084fc" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#c084fc' }}>AI Auto-Verification Engine Active</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Submissions with ≥80% AI confidence are auto-approved. Others appear below for manual review.</div>
              </div>
            </div>
            {verifications.length === 0 && (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#64748b' }}>No pending verifications.</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {verifications.map(v => (
                <div key={v.id} style={{ background: '#0f172a', border: `1px solid ${v.status === 'pending' ? '#78350f' : '#1e293b'}`, borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>{v.business_name}</h3>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{v.user?.name} • {v.user?.email} • {v.phone}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {v.ai_confidence_score && (
                        <span style={{ background: v.ai_confidence_score >= 0.8 ? '#052e16' : '#78350f', color: v.ai_confidence_score >= 0.8 ? '#34d399' : '#fbbf24', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
                          AI: {Math.round(v.ai_confidence_score * 100)}% — {v.ai_verdict || 'pending'}
                        </span>
                      )}
                      {badge(
                        v.status === 'approved' ? '#34d399' : v.status === 'rejected' ? '#f87171' : '#fbbf24',
                        v.status === 'approved' ? '#052e16' : v.status === 'rejected' ? '#450a0a' : '#78350f',
                        (v.status || 'pending').toUpperCase()
                      )}
                    </div>
                  </div>
                  <div style={{ background: '#1e293b', borderRadius: '10px', padding: '12px 16px', fontSize: '12px', color: '#cbd5e1', marginBottom: '14px', lineHeight: 1.6 }}>
                    <strong>Bank:</strong> {v.bank_name} — {v.account_number} ({v.account_name})<br />
                    {v.ai_rejection_reason && <><strong>AI Notes:</strong> {v.ai_rejection_reason}</>}
                  </div>
                  {v.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleApproveVerification(v.id)} style={{ background: '#059669', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}>✓ Approve & Issue Badge</button>
                      <button onClick={() => handleRejectVerification(v.id)} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}>✕ Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 5: Event Management */}
        {activeModule === 'events' && <EventManagement events={events} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 6: Finance Center */}
        {activeModule === 'finance' && <FinanceCenter financeData={financeData} payouts={payouts} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 7: Payment Settings */}
        {activeModule === 'gateways' && <PaymentGatewayControl gateways={gateways} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 8: Platform Fees */}
        {activeModule === 'fee_rules' && <PlatformFees feeRules={feeRules} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 9: Double Entry Ledger */}
        {activeModule === 'ledger' && <DoubleEntryLedger ledgerEntries={ledgerEntries} />}

        {/* MODULE 10: Payout Center — shared with Finance */}
        {activeModule === 'payouts' && <FinanceCenter financeData={financeData} payouts={payouts} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 11: Subscriptions */}
        {activeModule === 'subscriptions' && <Subscriptions token={token} />}

        {/* MODULE 12: CMS Landing Builder */}
        {activeModule === 'cms' && <CmsLandingBuilder cmsSections={cmsSections} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 13: Website Builder Control */}
        {activeModule === 'websites' && <WebsiteBuilderControl websites={websites} />}

        {/* MODULE 14: AI Control Center */}
        {activeModule === 'ai_fleet' && <AiFleetControl aiFleetData={aiFleetData} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 15: Broadcast Center */}
        {activeModule === 'broadcasts' && <BroadcastCenter broadcasts={broadcasts} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 16: System Settings */}
        {activeModule === 'system_settings' && <SystemSettings settings={systemSettings} token={token} onRefresh={fetchAdminData} />}

        {/* MODULE 17: Audit Logs */}
        {activeModule === 'audit_logs' && <AuditLogs auditLogs={auditLogs} />}

        {/* MODULE 18: Security Control */}
        {activeModule === 'security' && <SecurityControl token={token} />}

        {/* MODULE 19: Reports & Growth */}
        {activeModule === 'reports' && <ReportsGrowth token={token} overviewData={overviewData} />}

        {/* MODULE 20: Developer System Health */}
        {activeModule === 'developer' && <DeveloperSystemHealth developerHealth={developerHealth} token={token} onRefresh={fetchAdminData} />}

      </main>

      {/* ── Wallet Adjust Modal ── */}
      {isWalletModalOpen && selectedOrganizer && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', maxWidth: '420px', width: '100%', padding: '32px', margin: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 20px', color: '#fff' }}>Adjust Wallet: {selectedOrganizer.name}</h3>
            <form onSubmit={handleWalletAdjust} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Action</label>
                <select value={walletAction} onChange={e => setWalletAction(e.target.value as any)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}>
                  <option value="credit">Credit Balance</option>
                  <option value="debit">Debit Balance</option>
                  <option value="freeze">Freeze Wallet</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Amount ($)</label>
                <input type="number" value={walletAmount} onChange={e => setWalletAmount(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Reason</label>
                <input type="text" value={walletReason} onChange={e => setWalletReason(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="submit" style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}>Submit</button>
                <button type="button" onClick={() => setIsWalletModalOpen(false)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Provision Organizer Modal ── */}
      {isProvisionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', maxWidth: '460px', width: '100%', padding: '32px', margin: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 20px', color: '#fff' }}>Provision New Organizer Workspace</h3>
            <form onSubmit={handleProvisionOrganizer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Full Name', val: provName, set: setProvName, type: 'text', placeholder: 'Sarah Connor' },
                { label: 'Email', val: provEmail, set: setProvEmail, type: 'email', placeholder: 'sarah@eventorg.com' },
                { label: 'Business Name', val: provBusiness, set: setProvBusiness, type: 'text', placeholder: 'Apex Events Ltd' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{f.label}</label>
                  <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Subscription Plan</label>
                <select value={provPlan} onChange={e => setProvPlan(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}>
                  <option value="starter">Starter</option>
                  <option value="pro">Organizer Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 900, cursor: 'pointer' }}>Provision Workspace</button>
                <button type="button" onClick={() => setIsProvisionModalOpen(false)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Floating AI Assistant */}
      <FloatingAiAssistant role="super_admin" />
    </div>
  );
}

export default App;
