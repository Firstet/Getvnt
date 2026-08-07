import React, { useState, useEffect } from 'react';
import {
  Users, Lock, Unlock, LogOut, ShieldAlert, CheckCircle2,
  Search, Filter, Download, RefreshCw, ChevronRight, X,
  Building2, Sparkles, Shield, Cpu, Zap, CreditCard,
  Globe, Laptop, Clock, AlertTriangle, Key, Activity, Check, ShieldCheck,
  Ticket, UserCheck, Crown, Megaphone, QrCode, Heart, User, Briefcase, ExternalLink
} from 'lucide-react';

interface OrganizationData {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  status?: string;
}

interface UserItem {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  role: string;
  context: 'platform' | 'organization' | 'attendee';
  context_role: string;
  context_role_key: string;
  locked_until: string | null;
  organization?: OrganizationData | null;
  tenant?: OrganizationData | null;
  ai_prompts_used?: number;
  ai_prompt_limit?: number;
  subscription_plan?: string;
  revenue_ltv?: number;
  active_sessions?: number;
  last_login_human?: string;
  device_info?: string;
  mfa_enabled?: boolean;
  security_risk_score?: string;
}

interface UserApiResponse {
  platform_users: UserItem[];
  organization_members: UserItem[];
  attendees: UserItem[];
  totals: {
    platform: number;
    organizations: number;
    attendees: number;
    all: number;
  };
}

export const UsersManagerView: React.FC<{ onTriggerToast: (msg: string) => void }> = ({ onTriggerToast }) => {
  const [activeTab, setActiveTab] = useState<'platform' | 'organization' | 'attendees'>('platform');

  const [userData, setUserData] = useState<UserApiResponse>({
    platform_users: [],
    organization_members: [],
    attendees: [],
    totals: { platform: 0, organizations: 0, attendees: 0, all: 0 },
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Multi-Selection State for Bulk Actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Sliding User Detail Drawer State
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/users', {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.platform_users) {
          setUserData(json.data);
        } else if (Array.isArray(json.data)) {
          // Fallback parsing if old structure
          const list: UserItem[] = json.data;
          const platform = list.filter(u => ['super_admin', 'platform_admin', 'platform_staff'].includes(u.role));
          const org = list.filter(u => !['super_admin', 'platform_admin', 'platform_staff'].includes(u.role) && (u.organization || u.tenant));
          const att = list.filter(u => !['super_admin', 'platform_admin', 'platform_staff'].includes(u.role) && !(u.organization || u.tenant));
          setUserData({
            platform_users: platform,
            organization_members: org,
            attendees: att,
            totals: { platform: platform.length, organizations: org.length, attendees: att.length, all: list.length }
          });
        }
      }
    } catch (err) {
      console.error('Failed fetching users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleLock = async (id: string, currentLock: any) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${id}/toggle-lock`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        onTriggerToast(json.message);
        fetchUsers();
        if (selectedUser?.id === id) {
          setSelectedUser((prev) => prev ? { ...prev, locked_until: currentLock ? null : new Date(Date.now() + 864000000).toISOString() } : null);
        }
      }
    } catch (err) {}
  };

  const handleForceLogout = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/admin/users/${id}/force-logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        onTriggerToast(json.message);
      }
    } catch (err) {}
  };

  const handleImpersonate = async (targetId: string, isUser = false) => {
    try {
      const endpoint = isUser
        ? `http://localhost:8000/api/v1/admin/users/${targetId}/impersonate`
        : `http://localhost:8000/api/v1/admin/tenants/${targetId}/impersonate`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success && json.data?.redirect) {
        onTriggerToast(json.message || `Initiating impersonation session...`);
        window.open(json.data.redirect, '_blank');
      } else {
        onTriggerToast(json.message || 'Failed to initiate impersonation.');
      }
    } catch {
      onTriggerToast('Error initiating impersonation.');
    }
  };

  // Get current active tab user list
  const getCurrentTabUsers = (): UserItem[] => {
    switch (activeTab) {
      case 'platform':
        return userData.platform_users;
      case 'organization':
        return userData.organization_members;
      case 'attendees':
        return userData.attendees;
      default:
        return [];
    }
  };

  const currentTabList = getCurrentTabUsers();

  // Filtered Users List
  const filteredUsers = currentTabList.filter((u) => {
    const orgName = u.organization?.name || u.tenant?.name || '';
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      orgName.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.context_role.toLowerCase().includes(search.toLowerCase());

    const isLocked = u.locked_until && new Date(u.locked_until) > new Date();

    const matchesRole = roleFilter === 'all' || u.context_role_key === roleFilter || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'locked' ? isLocked : !isLocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((item) => item !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const handleBulkLock = async () => {
    for (const id of selectedUserIds) {
      await handleToggleLock(id, null);
    }
    onTriggerToast(`Bulk lock applied to ${selectedUserIds.length} accounts.`);
    setSelectedUserIds([]);
  };

  const handleBulkLogout = async () => {
    for (const id of selectedUserIds) {
      await handleForceLogout(id);
    }
    onTriggerToast(`Force revoked sessions for ${selectedUserIds.length} users.`);
    setSelectedUserIds([]);
  };

  // Export Users CSV / JSON
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Context', 'Role Badge', 'Organization', 'Status', 'LTV_NGN', 'Plan'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.context || 'N/A',
      `"${u.context_role || u.role}"`,
      `"${u.organization?.name || u.tenant?.name || 'N/A'}"`,
      u.locked_until && new Date(u.locked_until) > new Date() ? 'Locked' : 'Active',
      u.revenue_ltv || 0,
      u.subscription_plan || 'N/A',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `getvnt_${activeTab}_users_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onTriggerToast(`Exported ${activeTab} user directory to CSV!`);
  };

  // Role Badge Formatter per Context
  const getRoleBadge = (u: UserItem) => {
    const roleKey = (u.context_role_key || u.role || '').toLowerCase();
    const roleText = u.context_role || u.role;

    // 1. Platform Roles
    if (u.context === 'platform' || roleKey.includes('admin') || roleKey.includes('staff')) {
      switch (roleKey) {
        case 'super_admin':
          return { label: 'Super Admin', bg: 'rgba(124, 58, 237, 0.22)', color: '#C084FC', border: '1px solid rgba(124, 58, 237, 0.45)', icon: Shield };
        case 'platform_admin':
          return { label: 'Platform Admin', bg: 'rgba(79, 70, 229, 0.22)', color: '#818CF8', border: '1px solid rgba(79, 70, 229, 0.45)', icon: ShieldAlert };
        case 'support':
        case 'technical_support':
          return { label: roleText || 'Support', bg: 'rgba(6, 182, 212, 0.22)', color: '#22D3EE', border: '1px solid rgba(6, 182, 212, 0.45)', icon: Cpu };
        case 'finance':
        case 'finance_officer':
          return { label: roleText || 'Finance', bg: 'rgba(16, 185, 129, 0.22)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.45)', icon: CreditCard };
        case 'developer':
          return { label: 'Developer', bg: 'rgba(245, 158, 11, 0.22)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.45)', icon: Zap };
        default:
          return { label: roleText, bg: 'rgba(99, 102, 241, 0.22)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.45)', icon: Shield };
      }
    }

    // 2. Organization / Tenant Roles
    if (u.context === 'organization' || u.organization || u.tenant) {
      switch (roleKey) {
        case 'organizer_owner':
          return { label: 'Organization Owner', bg: 'rgba(37, 99, 235, 0.22)', color: '#60A5FA', border: '1px solid rgba(37, 99, 235, 0.45)', icon: Crown };
        case 'organizer_admin':
          return { label: 'Organization Admin', bg: 'rgba(56, 189, 248, 0.22)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.45)', icon: Building2 };
        case 'event_manager':
          return { label: 'Event Manager', bg: 'rgba(236, 72, 153, 0.22)', color: '#F472B6', border: '1px solid rgba(236, 72, 153, 0.45)', icon: Zap };
        case 'marketing_manager':
          return { label: 'Marketing Manager', bg: 'rgba(168, 85, 247, 0.22)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.45)', icon: Megaphone };
        case 'finance_manager':
          return { label: 'Finance Manager', bg: 'rgba(16, 185, 129, 0.22)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.45)', icon: CreditCard };
        case 'ticketing_manager':
          return { label: 'Ticket Manager', bg: 'rgba(249, 115, 22, 0.22)', color: '#FB923C', border: '1px solid rgba(249, 115, 22, 0.45)', icon: Ticket };
        case 'check_in_staff':
          return { label: 'Scanner / Check-in', bg: 'rgba(20, 184, 166, 0.22)', color: '#2DD4BF', border: '1px solid rgba(20, 184, 166, 0.45)', icon: QrCode };
        case 'volunteer':
          return { label: 'Volunteer', bg: 'rgba(245, 158, 11, 0.22)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.45)', icon: Heart };
        default:
          return { label: roleText || 'Organization Staff', bg: 'rgba(59, 130, 246, 0.22)', color: '#93C5FD', border: '1px solid rgba(59, 130, 246, 0.45)', icon: Briefcase };
      }
    }

    // 3. Attendee Roles (Users without organization membership)
    return { label: 'Attendee', bg: 'rgba(16, 185, 129, 0.18)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)', icon: UserCheck };
  };

  if (loading) return <div style={{ padding: '32px', color: '#FFF', fontWeight: 800 }}>Loading Enterprise User Directory...</div>;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      
      {/* ── 1. PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#FFF" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: 0 }}>
              User Directory &amp; Role Console
            </h1>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            Enterprise Role Architecture — Isolated management views for Platform Administrators, Tenant Organizations, and Marketplace Attendees.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn admin-btn-secondary" onClick={fetchUsers} disabled={refreshing}>
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Syncing...' : 'Sync Directory'}
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleExportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── 2. DASHBOARD KPI METRICS CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* KPI 1 */}
        <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total System Users</span>
            <Users size={18} color="#60A5FA" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#FFF' }}>{userData.totals.all.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '4px', fontWeight: 700 }}>
            <span>Clean Role Segregation</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform Admins</span>
            <Shield size={18} color="#C084FC" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#C084FC' }}>
            {userData.totals.platform.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#A5B4FC', marginTop: '4px', fontWeight: 700 }}>
            <span>Super &amp; Staff Roles</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Org Members</span>
            <Building2 size={18} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#38BDF8' }}>
            {userData.totals.organizations.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#38BDF8', marginTop: '4px', fontWeight: 700 }}>
            <span>Tenant Workspace Roles</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '18px', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marketplace Attendees</span>
            <UserCheck size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#34D399' }}>
            {userData.totals.attendees.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', marginTop: '4px', fontWeight: 700 }}>
            <span>Public Ticket Buyers</span>
          </div>
        </div>

      </div>

      {/* ── 3. THREE SEPARATE MANAGEMENT VIEWS / TABS ── */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px', paddingBottom: '2px' }}>
        <button
          onClick={() => { setActiveTab('platform'); setSelectedUserIds([]); setRoleFilter('all'); }}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 800,
            color: activeTab === 'platform' ? '#C084FC' : '#9CA3AF',
            background: activeTab === 'platform' ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'platform' ? '3px solid #7C3AED' : '3px solid transparent',
            borderRadius: '10px 10px 0 0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <Shield size={16} />
          Platform Users
          <span style={{ fontSize: '11px', background: activeTab === 'platform' ? '#7C3AED' : 'rgba(255,255,255,0.1)', color: '#FFF', padding: '2px 8px', borderRadius: '12px' }}>
            {userData.totals.platform}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('organization'); setSelectedUserIds([]); setRoleFilter('all'); }}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 800,
            color: activeTab === 'organization' ? '#38BDF8' : '#9CA3AF',
            background: activeTab === 'organization' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'organization' ? '3px solid #38BDF8' : '3px solid transparent',
            borderRadius: '10px 10px 0 0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <Building2 size={16} />
          Organizations &amp; Members
          <span style={{ fontSize: '11px', background: activeTab === 'organization' ? '#0284C7' : 'rgba(255,255,255,0.1)', color: '#FFF', padding: '2px 8px', borderRadius: '12px' }}>
            {userData.totals.organizations}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('attendees'); setSelectedUserIds([]); setRoleFilter('all'); }}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 800,
            color: activeTab === 'attendees' ? '#34D399' : '#9CA3AF',
            background: activeTab === 'attendees' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'attendees' ? '3px solid #10B981' : '3px solid transparent',
            borderRadius: '10px 10px 0 0',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <UserCheck size={16} />
          Attendees
          <span style={{ fontSize: '11px', background: activeTab === 'attendees' ? '#10B981' : 'rgba(255,255,255,0.1)', color: '#FFF', padding: '2px 8px', borderRadius: '12px' }}>
            {userData.totals.attendees}
          </span>
        </button>
      </div>

      {/* ── 4. SEARCH & FILTERS TOOLBAR ── */}
      <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '14px 18px', marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Global Search Input */}
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="admin-input"
            placeholder={`Search ${activeTab === 'platform' ? 'platform users' : activeTab === 'organization' ? 'organization members or org names' : 'attendees'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px', width: '100%', fontSize: '13px' }}
          />
        </div>

        {/* Dynamic Role Filter Options Based on Active View */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} color="#9CA3AF" />
          <select className="admin-input" style={{ width: '170px', fontSize: '13px' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles in View</option>
            {activeTab === 'platform' && (
              <>
                <option value="super_admin">Super Admin</option>
                <option value="platform_admin">Platform Admin</option>
                <option value="platform_staff">Platform Staff</option>
                <option value="support">Support</option>
                <option value="finance_officer">Finance Officer</option>
                <option value="developer">Developer</option>
              </>
            )}
            {activeTab === 'organization' && (
              <>
                <option value="organizer_owner">Organization Owner</option>
                <option value="organizer_admin">Organization Admin</option>
                <option value="event_manager">Event Manager</option>
                <option value="marketing_manager">Marketing Manager</option>
                <option value="finance_manager">Finance Manager</option>
                <option value="ticketing_manager">Ticket Manager</option>
                <option value="check_in_staff">Scanner / Check-in</option>
                <option value="volunteer">Volunteer</option>
              </>
            )}
            {activeTab === 'attendees' && (
              <option value="attendee">Attendee</option>
            )}
          </select>
        </div>

        {/* Status Filter */}
        <select className="admin-input" style={{ width: '140px', fontSize: '13px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="locked">Locked</option>
        </select>
      </div>

      {/* ── 5. BULK ACTIONS BAR ── */}
      {selectedUserIds.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(37, 99, 235, 0.2))', border: '1px solid rgba(124, 58, 237, 0.4)', borderRadius: '14px', padding: '12px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>
            ⚡ {selectedUserIds.length} User Account(s) Selected
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="admin-btn admin-btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={handleBulkLock}>
              <Lock size={13} /> Bulk Lock
            </button>
            <button className="admin-btn admin-btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={handleBulkLogout}>
              <LogOut size={13} /> Bulk Force Logout
            </button>
            <button className="admin-btn admin-btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setSelectedUserIds([])}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── 6. RICH ENTERPRISE USER DATA TABLE ── */}
      <div style={{ background: 'rgba(13, 17, 32, 0.85)', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
        <div style={{ overflowX: 'auto', maxHeight: '620px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#07090F', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
                <th style={{ padding: '14px 20px', width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    style={{ accentColor: '#4F46E5', cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '14px 20px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>User &amp; Identity</th>
                {activeTab === 'organization' && (
                  <th style={{ padding: '14px 20px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Organization</th>
                )}
                <th style={{ padding: '14px 20px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Role Badge</th>
                <th style={{ padding: '14px 20px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>AI Usage</th>
                <th style={{ padding: '14px 20px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '14px 20px', color: '#9CA3AF', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === 'organization' ? 7 : 6} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                    No matching accounts found in {activeTab === 'platform' ? 'Platform Users' : activeTab === 'organization' ? 'Organization Members' : 'Attendees'} view.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isLocked = u.locked_until && new Date(u.locked_until) > new Date();
                  const isSelected = selectedUserIds.includes(u.id);
                  const roleObj = getRoleBadge(u);
                  const RoleIcon = roleObj.icon;
                  const org = u.organization || u.tenant;

                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        background: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                        transition: 'background 0.15s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedUser(u)}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '14px 20px' }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(u.id)}
                          style={{ accentColor: '#4F46E5', cursor: 'pointer' }}
                        />
                      </td>

                      {/* User Identity */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: activeTab === 'platform' ? 'linear-gradient(135deg,#7C3AED,#2563EB)' : activeTab === 'organization' ? 'linear-gradient(135deg,#0284C7,#06B6D4)' : 'linear-gradient(135deg,#059669,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#FFF', fontSize: '15px' }}>
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: isLocked ? '#EF4444' : '#10B981', border: '2px solid #0D1120' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#FFF', fontSize: '14px' }}>{u.name}</div>
                            <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Organization (Only shown in Organizations view) */}
                      {activeTab === 'organization' && (
                        <td style={{ padding: '14px 20px' }}>
                          {org ? (
                            <div>
                              <div style={{ fontWeight: 700, color: '#FFF', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Building2 size={13} color="#38BDF8" /> {org.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#60A5FA' }}>{org.slug}.getvnt.com</div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#6B7280' }}>Unassigned</span>
                          )}
                        </td>
                      )}

                      {/* Role Badge (Contextual) */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: roleObj.bg, color: roleObj.color, border: roleObj.border,
                            padding: '4px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800
                          }}
                        >
                          <RoleIcon size={13} /> {roleObj.label}
                        </span>
                      </td>

                      {/* AI Usage */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ minWidth: '100px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', marginBottom: '4px', fontWeight: 700 }}>
                            <span>{(u.ai_prompts_used || 120).toLocaleString()} prompts</span>
                          </div>
                          <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, ((u.ai_prompts_used || 120) / (u.ai_prompt_limit || 2000)) * 100)}%`, background: 'linear-gradient(90deg, #7C3AED, #38BDF8)' }} />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 20px' }}>
                        {isLocked ? (
                          <span style={{ background: 'rgba(239, 68, 68, 0.18)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444' }} /> Locked
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> Active
                          </span>
                        )}
                      </td>

                      {/* Compact Action Buttons */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            title={isLocked ? 'Unlock Account' : 'Lock Account'}
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '6px', borderRadius: '8px', color: isLocked ? '#34D399' : '#F87171' }}
                            onClick={() => handleToggleLock(u.id, u.locked_until)}
                          >
                            {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                          </button>

                          {org && (
                            <button
                              title={`Impersonate ${org.name}`}
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '6px', borderRadius: '8px', color: '#60A5FA' }}
                              onClick={() => handleImpersonate(org.id)}
                            >
                              <ExternalLink size={14} />
                            </button>
                          )}

                          <button
                            title="Force Logout Active Sessions"
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '6px', borderRadius: '8px' }}
                            onClick={() => handleForceLogout(u.id)}
                          >
                            <LogOut size={14} />
                          </button>

                          <button
                            title="View Inspection Drawer"
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '6px', borderRadius: '8px' }}
                            onClick={() => setSelectedUser(u)}
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 7. SLIDING USER DETAIL PANEL (SLIDE-OUT DRAWER) ── */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setSelectedUser(null)}>
          <div
            style={{
              width: '100%', maxWidth: '480px', height: '100vh', background: '#0B0F19', borderLeft: '1px solid rgba(124,58,237,0.3)',
              padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '-20px 0 60px rgba(0,0,0,0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF' }}>User &amp; Role Context Inspection</div>
              <button style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }} onClick={() => setSelectedUser(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Profile Hero Box */}
            <div style={{ background: 'rgba(13, 17, 32, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#FFF', fontSize: '22px' }}>
                {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFF' }}>{selectedUser.name}</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>{selectedUser.email}</div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', background: getRoleBadge(selectedUser).bg, color: getRoleBadge(selectedUser).color, border: getRoleBadge(selectedUser).border }}>
                    {getRoleBadge(selectedUser).label}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', background: selectedUser.locked_until ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: selectedUser.locked_until ? '#F87171' : '#34D399' }}>
                    {selectedUser.locked_until ? 'Locked' : 'Active Account'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                className="admin-btn admin-btn-secondary"
                style={{ justifyContent: 'center', fontSize: '12px' }}
                onClick={() => handleToggleLock(selectedUser.id, selectedUser.locked_until)}
              >
                {selectedUser.locked_until ? <Unlock size={14} /> : <Lock size={14} />}
                {selectedUser.locked_until ? 'Unlock User' : 'Lock User'}
              </button>
              <button
                className="admin-btn admin-btn-secondary"
                style={{ justifyContent: 'center', fontSize: '12px' }}
                onClick={() => handleForceLogout(selectedUser.id)}
              >
                <LogOut size={14} /> Revoke Sessions
              </button>
            </div>

            {/* Organization Context Info */}
            {(selectedUser.organization || selectedUser.tenant) && (
              <div style={{ background: 'rgba(13, 17, 32, 0.9)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '18px', padding: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} /> Organization Context
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#D1D5DB', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9CA3AF' }}>Organization Name:</span>
                    <span style={{ fontWeight: 800, color: '#FFF' }}>{(selectedUser.organization || selectedUser.tenant)?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9CA3AF' }}>Workspace Subdomain:</span>
                    <span style={{ fontWeight: 800, color: '#38BDF8' }}>{(selectedUser.organization || selectedUser.tenant)?.slug}.getvnt.com</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#9CA3AF' }}>Workspace Role:</span>
                    <span style={{ fontWeight: 800, color: getRoleBadge(selectedUser).color }}>{selectedUser.context_role || selectedUser.role}</span>
                  </div>
                </div>

                <button
                  className="admin-btn admin-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg,#7C3AED,#2563EB)', color: '#FFF', fontSize: '13px', padding: '10px' }}
                  onClick={() => handleImpersonate((selectedUser.organization || selectedUser.tenant)!.id)}
                >
                  <ExternalLink size={15} /> Impersonate Workspace as Super Admin
                </button>
              </div>
            )}

            {/* Tenant Identity & Document Verification Card */}
            <div style={{ background: 'rgba(13, 17, 32, 0.9)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '18px', padding: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} /> Identity & Document Verification Audit
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#D1D5DB', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Document Type:</span>
                  <span style={{ fontWeight: 800, color: '#FFF' }}>National ID / Passport</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Bank Settlement Account:</span>
                  <span style={{ fontWeight: 800, color: '#34D399' }}>Paystack Verified (0123456789)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Verification Status:</span>
                  <span style={{ fontWeight: 900, color: '#34D399', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    🟢 VERIFIED
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="admin-btn admin-btn-success" style={{ flex: 1, fontSize: '11px', padding: '6px' }} onClick={() => onTriggerToast(`Verified identity for ${selectedUser.name}`)}>
                  Approve Document
                </button>
                <button className="admin-btn admin-btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '6px', color: '#EF4444' }} onClick={() => onTriggerToast(`Flagged document for re-upload`)}>
                  Flag / Reject
                </button>
              </div>
            </div>

            {/* AI Telemetry & Usage */}
            <div style={{ background: 'rgba(13, 17, 32, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> AI Assistant Usage Telemetry
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#FFF', fontWeight: 800, marginBottom: '6px' }}>
                <span>Monthly AI Prompts</span>
                <span>{(selectedUser.ai_prompts_used || 450).toLocaleString()} / {(selectedUser.ai_prompt_limit || 2000).toLocaleString()}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, ((selectedUser.ai_prompts_used || 450) / (selectedUser.ai_prompt_limit || 2000)) * 100)}%`, background: 'linear-gradient(90deg, #7C3AED, #38BDF8)' }} />
              </div>
            </div>

            {/* Active Sessions & Security Telemetry */}
            <div style={{ background: 'rgba(13, 17, 32, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} /> Security Telemetry &amp; Sessions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#D1D5DB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Two-Factor Authentication (MFA)</span>
                  <span style={{ fontWeight: 800, color: selectedUser.mfa_enabled ? '#34D399' : '#F87171' }}>
                    {selectedUser.mfa_enabled ? 'Enabled ✓' : 'Disabled'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Active Token Sessions</span>
                  <span style={{ fontWeight: 800, color: '#FFF' }}>{selectedUser.active_sessions || 2} Sessions</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Last Active Login</span>
                  <span style={{ fontWeight: 800, color: '#60A5FA' }}>{selectedUser.last_login_human || '12 mins ago'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
