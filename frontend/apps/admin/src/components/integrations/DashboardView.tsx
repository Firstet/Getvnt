import React, { useState } from 'react';
import {
  Cpu, CreditCard, KeyRound, DollarSign, Activity, ShieldCheck, Zap,
  ArrowUpRight, CheckCircle2, Building2, Users, Calendar, Crown, Plus, Sparkles,
  ArrowRight, LayoutDashboard, ShieldAlert
} from 'lucide-react';

interface Props {
  data: any;
  platformStats?: any;
  onNavigate: (tab: any) => void;
  onToast: (msg: string) => void;
}

export const DashboardView: React.FC<Props> = ({ data, platformStats, onNavigate, onToast }) => {
  const [dashboardMode, setDashboardMode] = useState<'overview' | 'telemetry'>('overview');

  // 1. Skeleton Pulse Loader (If initial telemetry or stats are null)
  if (!data && !platformStats) {
    return (
      <div style={{ padding: '16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div className="skeleton-box" style={{ width: '320px', height: '40px' }} />
          <div className="skeleton-box" style={{ width: '220px', height: '40px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-box" style={{ height: '110px' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="skeleton-box" style={{ height: '240px' }} />
          <div className="skeleton-box" style={{ height: '240px' }} />
        </div>
      </div>
    );
  }

  const { metrics, system_health, recent_activity, charts } = data || {
    metrics: { connected_ai_providers: 0, connected_payment_gateways: 0, active_api_keys: 0, monthly_ai_cost: 0, monthly_payment_volume: 0, commission_earned: 0, failed_webhooks_count: 0, installed_marketplace_apps: 0 },
    system_health: [],
    recent_activity: [],
    charts: { ai_usage: { labels: [], tokens_used_k: [] }, payment_volume: { labels: [], paystack_ngn: [] } }
  };

  const isBlankState = (!platformStats || platformStats.total_tenants === 0) && metrics.connected_ai_providers === 0;

  return (
    <div>
      {/* Mode Switcher Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} color="#3B82F6" /> Operational View Mode:
          </span>
          <span className="admin-badge admin-badge-active" style={{ fontSize: '11px' }}>
            <Zap size={12} /> Live Telemetry Feed
          </span>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="admin-tab-group">
            <button
              className={`admin-tab-btn ${dashboardMode === 'overview' ? 'active-primary' : ''}`}
              onClick={() => setDashboardMode('overview')}
            >
              <LayoutDashboard size={15} /> Platform Overview
            </button>
            <button
              className={`admin-tab-btn ${dashboardMode === 'telemetry' ? 'active' : ''}`}
              onClick={() => setDashboardMode('telemetry')}
            >
              <Activity size={15} /> Fleet Telemetry
            </button>
          </div>

          <button className="admin-btn admin-btn-secondary" onClick={() => onNavigate('plans')}>
            <Crown size={15} color="#F59E0B" /> Manage Plans
          </button>
        </div>
      </div>

      {/* 2. Zero-State Blank Dashboard Setup Checklist (If system is fresh/empty) */}
      {isBlankState && (
        <div className="admin-card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(14, 19, 31, 0.95) 100%)', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Sparkles size={24} color="#EF4444" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF' }}>Super Admin Control Center — Initial Setup Checklist</h3>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px', maxWidth: '720px' }}>
            Welcome to the GETVNT Super Admin Control Plane. Complete the following key setup steps to bring your event ticketing infrastructure online.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#FFF' }}>1. Create Subscription Plans</span>
                <Crown size={18} color="#F59E0B" />
              </div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>Set up Starter, Professional, and Enterprise tier pricing & commission rates.</p>
              <button className="quick-fill-btn" onClick={() => onNavigate('plans')}>
                Configure Plans <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#FFF' }}>2. Register AI Provider Keys</span>
                <Cpu size={18} color="#3B82F6" />
              </div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>Connect OpenAI, Anthropic, Gemini or DeepSeek credentials to AI engine.</p>
              <button className="quick-fill-btn" onClick={() => onNavigate('ai_providers')}>
                Connect AI Fleet <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#FFF' }}>3. Configure Payment Gateway</span>
                <CreditCard size={18} color="#10B981" />
              </div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>Setup Paystack, Flutterwave, or Stripe settlement keys.</p>
              <button className="quick-fill-btn" onClick={() => onNavigate('payment_gateways')}>
                Add Gateway <ArrowRight size={12} />
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px', color: '#FFF' }}>4. Provision Vault Key Secrets</span>
                <KeyRound size={18} color="#8B5CF6" />
              </div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>Store encrypted master platform tokens & service secrets.</p>
              <button className="quick-fill-btn" onClick={() => onNavigate('api_vault')}>
                Open Vault <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PLATFORM EXECUTIVE OVERVIEW MODE */}
      {dashboardMode === 'overview' && (
        <div>
          {/* Executive Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
                <span>Total Organizations</span>
                <Building2 size={18} color="#3B82F6" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF' }}>
                {platformStats?.total_tenants ?? 0} Tenants
              </div>
              <div style={{ fontSize: '12px', color: '#60A5FA', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} color="#10B981" /> Verified Event Brands
              </div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
                <span>User Directory</span>
                <Users size={18} color="#8B5CF6" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF' }}>
                {platformStats?.total_users ?? 0} Accounts
              </div>
              <div style={{ fontSize: '12px', color: '#A78BFA', marginTop: '6px' }}>Organizers & Ticket Buyers</div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
                <span>Active Subscriptions</span>
                <Crown size={18} color="#F59E0B" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#F59E0B' }}>
                {platformStats?.active_subscriptions ?? 0} Active
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>Pro & Enterprise Subscriptions</div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
                <span>Platform GMV Volume</span>
                <DollarSign size={18} color="#10B981" />
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#10B981' }}>
                ₦{((platformStats?.total_gmv ?? metrics.monthly_payment_volume) || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>Processed Ticket Sales</div>
            </div>
          </div>

          {/* Quick Management Navigation Grid */}
          <div className="admin-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="#EF4444" /> Super Admin Control Shortcuts
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <button
                className="admin-btn admin-btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(37,99,235,0.4)', background: 'rgba(37,99,235,0.12)' }}
                onClick={() => onNavigate('branding')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#60A5FA' }}>
                  <Sparkles size={16} color="#60A5FA" /> Platform Branding &amp; Logos
                </span>
                <ArrowRight size={14} color="#60A5FA" />
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px' }}
                onClick={() => onNavigate('users')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} color="#3B82F6" /> User Directory</span>
                <ArrowRight size={14} />
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px' }}
                onClick={() => onNavigate('plans')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Crown size={16} color="#F59E0B" /> Subscription Builder</span>
                <ArrowRight size={14} />
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                style={{ justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px' }}
                onClick={() => onNavigate('api_vault')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><KeyRound size={16} color="#8B5CF6" /> Security Credentials</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. INTEGRATIONS & FLEET TELEMETRY MODE */}
      {(dashboardMode === 'telemetry' || !platformStats) && (
        <div>
          {/* Telemetry Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
                <span>Connected AI Providers</span>
                <Cpu size={18} color="#F59E0B" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF' }}>{metrics.connected_ai_providers} Active</div>
              <div style={{ fontSize: '12px', color: '#10B981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpRight size={14} /> OpenAI, Anthropic, Gemini, DeepSeek
              </div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
                <span>Connected Gateways</span>
                <CreditCard size={18} color="#3B82F6" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF' }}>{metrics.connected_payment_gateways} Active</div>
              <div style={{ fontSize: '12px', color: '#60A5FA', marginTop: '6px' }}>Paystack, Flutterwave, Stripe</div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
                <span>Active API Vault Keys</span>
                <KeyRound size={18} color="#8B5CF6" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF' }}>{metrics.active_api_keys} Credentials</div>
              <div style={{ fontSize: '12px', color: '#A78BFA', marginTop: '6px' }}>AES-256 Encrypted</div>
            </div>

            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
                <span>Monthly AI Fleet Cost</span>
                <DollarSign size={18} color="#10B981" />
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#10B981' }}>${metrics.monthly_ai_cost.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>Avg $0.002 / 1k Tokens</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="admin-card">
              <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '6px' }}>Monthly Payment Volume</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#60A5FA' }}>₦{metrics.monthly_payment_volume.toLocaleString()}</div>
            </div>
            <div className="admin-card">
              <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '6px' }}>Getvnt Platform Commission</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B' }}>₦{metrics.commission_earned.toLocaleString()}</div>
            </div>
            <div className="admin-card">
              <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '6px' }}>Failed Webhooks / Retries</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: metrics.failed_webhooks_count > 0 ? '#EF4444' : '#10B981' }}>
                {metrics.failed_webhooks_count} Errors
              </div>
            </div>
            <div className="admin-card">
              <div style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '6px' }}>Installed Marketplace Apps</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#EC4899' }}>{metrics.installed_marketplace_apps} Installed</div>
            </div>
          </div>

          {/* Analytics Visualizations */}
          {charts?.ai_usage?.labels?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div className="admin-card">
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#F59E0B" /> AI Token Consumption & Spend Trend
                </h3>
                <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--admin-border)' }}>
                  {charts.ai_usage.labels.map((lbl: string, idx: number) => {
                    const tokens = charts.ai_usage.tokens_used_k[idx];
                    const heightPct = (tokens / 1250) * 100;
                    return (
                      <div key={lbl} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{tokens}k</span>
                        <div
                          style={{
                            width: '100%',
                            height: `${heightPct}%`,
                            background: 'linear-gradient(180deg, #F59E0B 0%, rgba(245, 158, 11, 0.2) 100%)',
                            borderRadius: '6px 6px 0 0',
                          }}
                        />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#D1D5DB' }}>{lbl}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-card">
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#3B82F6" /> Gateway GMV Settlement Processing (NGN)
                </h3>
                <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--admin-border)' }}>
                  {charts.payment_volume.labels.map((lbl: string, idx: number) => {
                    const val = charts.payment_volume.paystack_ngn[idx];
                    const heightPct = (val / 45200000) * 100;
                    return (
                      <div key={lbl} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{(val / 1000000).toFixed(1)}M</span>
                        <div
                          style={{
                            width: '100%',
                            height: `${heightPct}%`,
                            background: 'linear-gradient(180deg, #3B82F6 0%, rgba(59, 130, 246, 0.2) 100%)',
                            borderRadius: '6px 6px 0 0',
                          }}
                        />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#D1D5DB' }}>{lbl}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* System Health & Activity Logs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* System Health List */}
        <div className="admin-card">
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#10B981" /> System Integration Drivers & Health
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {system_health.length > 0 ? (
              system_health.map((h: any) => (
                <div
                  key={h.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '10px',
                    border: '1px solid var(--admin-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{h.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="admin-badge admin-badge-active">Operational</span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{h.latency_ms}ms</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#9CA3AF', fontSize: '13px', padding: '12px 0' }}>All core driver services initialized.</div>
            )}
          </div>
        </div>

        {/* Audit Activity */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#8B5CF6" /> Recent Audit Activity
            </h3>
            <button
              style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => onNavigate('audit_logs')}
            >
              View All Logs →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recent_activity.length > 0 ? (
              recent_activity.map((log: any) => (
                <div
                  key={log.id}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '10px',
                    border: '1px solid var(--admin-border)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F3F4F6', marginBottom: '4px' }}>
                    {log.action}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF' }}>
                    <span>By: {log.user_name} ({log.user_role})</span>
                    <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#9CA3AF', fontSize: '13px', padding: '12px 0' }}>No recent audit activity.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
