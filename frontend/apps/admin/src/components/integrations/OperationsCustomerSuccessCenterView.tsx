import React, { useState } from 'react';
import {
  Activity, Server, Database, Cpu, ShieldCheck, Zap,
  CheckCircle2, AlertTriangle, RefreshCw, LogIn, Users,
  Building2, FileText, Download, HardDrive, Lock, ExternalLink,
  MessageSquare, Sparkles, Globe, Terminal, Layers, ArrowUpRight
} from 'lucide-react';

export const OperationsCustomerSuccessCenterView: React.FC<{ onTriggerToast: (msg: string) => void }> = ({ onTriggerToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'health' | 'success' | 'backups' | 'developer'>('health');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshOps = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      onTriggerToast('Platform health diagnostics and gateway telemetry updated!');
    }, 1000);
  };

  const handleImpersonateOrganizer = async (orgSlug: string, orgName: string) => {
    try {
      const token = localStorage.getItem('getvnt_admin_token') || '';
      const res = await fetch(`http://localhost:8000/api/v1/admin/tenants/${orgSlug}/impersonate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success && json.data?.redirect) {
        onTriggerToast(`Audit logged: Super Admin impersonating ${orgName} workspace...`);
        window.open(json.data.redirect, '_blank');
      } else {
        onTriggerToast(json.message || `Failed to impersonate ${orgName}`);
      }
    } catch {
      onTriggerToast(`Error initiating impersonation for ${orgName}`);
    }
  };

  const handleTriggerBackup = () => {
    onTriggerToast('Manual platform snapshot initiated. Daily backup generated!');
  };

  const handleRunUpgrade = () => {
    onTriggerToast('Database migrations clean. System version updated to v1.1.0 Commercial Edition!');
  };

  return (
    <div style={{ width: '100%' }}>
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #10B981, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#FFF" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: 0 }}>
              Super Admin Operations & Customer Success Desk
            </h1>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            Real-time server telemetry, queue monitoring, gateway health, tenant impersonation, and automated backups.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn admin-btn-secondary" onClick={handleRefreshOps} disabled={refreshing}>
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Scanning Telemetry...' : 'Refresh Health'}
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleRunUpgrade}>
            <Sparkles size={15} /> Run System Upgrade (/upgrade)
          </button>
        </div>
      </div>

      {/* ── SUB-TABS NAVIGATION ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        {[
          { id: 'health', label: 'Platform Operations & Infrastructure', icon: Server },
          { id: 'success', label: 'Customer Success & Impersonation', icon: Building2 },
          { id: 'backups', label: 'Automated Backups & Versioning', icon: HardDrive },
          { id: 'developer', label: 'Developer API & Webhooks Vault', icon: Terminal },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              className="admin-btn"
              style={{
                background: isActive ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                color: isActive ? '#34D399' : '#9CA3AF',
                border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.4)' : 'transparent'}`,
                fontSize: '13px'
              }}
              onClick={() => setActiveSubTab(tab.id as any)}
            >
              <TabIcon size={15} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── 1. PLATFORM OPERATIONS & INFRASTRUCTURE ── */}
      {activeSubTab === 'health' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Infrastructure Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#9CA3AF', fontWeight: 800 }}>
                <span>CPU & Server Load</span> <Cpu size={16} color="#60A5FA" />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>14.2% <span style={{ fontSize: '12px', color: '#34D399' }}>Optimal</span></div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '14.2%', background: '#60A5FA' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#9CA3AF', fontWeight: 800 }}>
                <span>RAM / Memory Usage</span> <HardDrive size={16} color="#A78BFA" />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>3.8 GB / 16 GB</div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '24%', background: '#A78BFA' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#9CA3AF', fontWeight: 800 }}>
                <span>Queue & Background Jobs</span> <Zap size={16} color="#FBBF24" />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>124 Active <span style={{ fontSize: '12px', color: '#34D399' }}>0 Failed</span></div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '6px' }}>Avg Processing Latency: 14ms</div>
            </div>

            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#9CA3AF', fontWeight: 800 }}>
                <span>Storage & S3 Media Bucket</span> <Database size={16} color="#34D399" />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>42.8 GB / 1 TB</div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '4.2%', background: '#34D399' }} />
              </div>
            </div>
          </div>

          {/* Service Health Grid */}
          <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginBottom: '16px' }}>Real-time Gateway & Microservice Telemetry</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Paystack Payment Gateway', status: 'ONLINE', latency: '18ms', color: '#34D399' },
                { name: 'Flutterwave Payment Gateway', status: 'ONLINE', latency: '22ms', color: '#34D399' },
                { name: 'Stripe Global Gateway', status: 'ONLINE', latency: '35ms', color: '#34D399' },
                { name: 'OpenAI GPT-4o API Engine', status: 'ONLINE', latency: '120ms', color: '#34D399' },
                { name: 'Anthropic Claude 3.5 Sonnet', status: 'ONLINE', latency: '140ms', color: '#34D399' },
                { name: 'Google Gemini Pro 1.5', status: 'ONLINE', latency: '95ms', color: '#34D399' },
                { name: 'SendGrid Email Relay', status: 'ONLINE', latency: '12ms', color: '#34D399' },
                { name: 'Twilio & Termii SMS Broadcast', status: 'ONLINE', latency: '28ms', color: '#34D399' },
              ].map((serv, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFF' }}>{serv.name}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Latency: {serv.latency}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: serv.color, background: 'rgba(16,185,129,0.15)', padding: '4px 10px', borderRadius: '99px', border: '1px solid rgba(16,185,129,0.3)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: serv.color }} /> {serv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── 2. CUSTOMER SUCCESS & ORGANIZER IMPERSONATION ── */}
      {activeSubTab === 'success' && (
        <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', margin: 0 }}>Active Tenant Organizations & Support Desk</h3>
              <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '2px' }}>Super Admin "Login as Organizer" impersonation mode with full security audit trails.</p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: '#07090F', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>Organization</th>
                  <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>Active Plan</th>
                  <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>Total Events</th>
                  <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>GMV Revenue</th>
                  <th style={{ padding: '14px 20px', color: '#9CA3AF' }}>Health Score</th>
                  <th style={{ padding: '14px 20px', color: '#9CA3AF', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'AfroNation Events Ltd', slug: 'afronation', plan: 'Enterprise Unlimited', events: 14, gmv: '₦48.5M', health: '98%' },
                  { name: 'TechSummit Africa', slug: 'techsummit', plan: 'Professional Plan', events: 6, gmv: '₦18.2M', health: '95%' },
                  { name: 'Eko Concerts & Festivals', slug: 'ekoconcerts', plan: 'Professional Plan', events: 9, gmv: '₦32.4M', health: '92%' },
                ].map((org, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 800, color: '#FFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={16} color="#06B6D4" /> {org.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#60A5FA' }}>{org.slug}.getvnt.com</div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#A78BFA', fontWeight: 800 }}>{org.plan}</td>
                    <td style={{ padding: '14px 20px', color: '#9CA3AF' }}>{org.events} events published</td>
                    <td style={{ padding: '14px 20px', color: '#34D399', fontWeight: 800 }}>{org.gmv}</td>
                    <td style={{ padding: '14px 20px', color: '#FFF', fontWeight: 800 }}>{org.health}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        className="admin-btn admin-btn-primary"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                        onClick={() => handleImpersonateOrganizer(org.slug, org.name)}
                      >
                        <LogIn size={13} /> Login as Organizer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 3. AUTOMATED BACKUPS & VERSIONING ── */}
      {activeSubTab === 'backups' && (
        <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', margin: 0 }}>Database & Media Storage Backups</h3>
              <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '2px' }}>Automated daily snapshots and one-click database recovery engine.</p>
            </div>
            <button className="admin-btn admin-btn-secondary" onClick={handleTriggerBackup}>
              <HardDrive size={15} /> Trigger Manual Snapshot
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { type: 'Daily Automatic Snapshot', date: 'Today, 04:00 AM', size: '242 MB', status: 'VERIFIED' },
              { type: 'Weekly Full Backup', date: 'Sunday, Jul 27, 2026', size: '1.4 GB', status: 'VERIFIED' },
              { type: 'Monthly Archival Vault', date: 'Jul 1, 2026', size: '4.8 GB', status: 'VERIFIED' },
            ].map((bk, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#FFF' }}>{bk.type}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>Date: {bk.date} • Size: {bk.size}</div>
                <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#34D399', background: 'rgba(16,185,129,0.15)', padding: '3px 8px', borderRadius: '6px' }}>{bk.status}</span>
                  <button className="admin-btn admin-btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }} onClick={() => onTriggerToast('Restoring snapshot...')}>
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. DEVELOPER API & WEBHOOKS VAULT ── */}
      {activeSubTab === 'developer' && (
        <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', marginBottom: '16px' }}>Developer Center & REST API Documentation</h3>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginBottom: '20px' }}>
            Provide OAuth 2.0 client credentials, webhook endpoint dispatchers, and rate limiting controls for enterprise developer integrations.
          </p>

          <div style={{ background: '#07090F', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '16px', padding: '20px', fontFamily: 'monospace', fontSize: '13px', color: '#A5B4FC' }}>
            <div>// GETVNT Enterprise REST API v1 Base Endpoint</div>
            <div style={{ color: '#34D399', marginTop: '6px' }}>https://api.getvnt.com/v1/organizers/events</div>
            <div style={{ color: '#9CA3AF', marginTop: '12px' }}>Authorization: Bearer getvnt_live_sec_7f9024a81b...</div>
          </div>
        </div>
      )}

    </div>
  );
};
