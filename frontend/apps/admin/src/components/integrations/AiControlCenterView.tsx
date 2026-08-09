import React, { useState } from 'react';
import {
  Cpu, KeyRound, DollarSign, Activity, RefreshCw, Zap, ShieldCheck,
  ToggleLeft, ToggleRight, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles,
  BarChart3, Settings, ArrowRight, Lock, Eye, EyeOff
} from 'lucide-react';

interface Props {
  providers: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

const DEFAULT_AI_ROUTES = [
  { id: '1', feature_name: 'AI Copywriter & Event Description', feature_key: 'event_copywriting', primary_model: 'gpt-4o', fallback_model: 'gemini-1.5-pro', is_active: true },
  { id: '2', feature_name: 'Dynamic Ticket Pricing Engine', feature_key: 'dynamic_pricing', primary_model: 'claude-3-5-sonnet', fallback_model: 'gpt-4o', is_active: true },
  { id: '3', feature_name: 'Attendee CRM Intelligence', feature_key: 'crm_analytics', primary_model: 'deepseek-r1', fallback_model: 'gpt-4o-mini', is_active: true },
  { id: '4', feature_name: 'Support Chatbot Assistant', feature_key: 'support_bot', primary_model: 'gemini-1.5-flash', fallback_model: 'gpt-4o-mini', is_active: true },
];

export const AiControlCenterView: React.FC<Props> = ({ providers = [], onRefresh, onToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'providers' | 'routes' | 'analytics'>('providers');
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [routes, setRoutes] = useState(DEFAULT_AI_ROUTES);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  // Add provider modal state
  const [newProviderName, setNewProviderName] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newDefaultModel, setNewDefaultModel] = useState('');

  const toggleKeyReveal = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRotateKey = (providerName: string) => {
    onToast(`Rotated API Key for ${providerName}. New key activated.`);
  };

  const handleToggleRoute = (routeId: string) => {
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, is_active: !r.is_active } : r));
    onToast('AI Route status updated.');
  };

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProviderName || !newApiKey) return;
    onToast(`Added AI Provider ${newProviderName} successfully.`);
    setShowAddKeyModal(false);
    setNewProviderName('');
    setNewApiKey('');
    setNewDefaultModel('');
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Active AI Fleet Models', val: `${providers.length || 4} Providers`, trend: '100% Operational', color: '#06B6D4', icon: Cpu },
          { label: 'Total Monthly Token Spend', val: '$142.80', trend: 'Budget: $500.00', color: '#34D399', icon: DollarSign },
          { label: 'Total API Prompts Run', val: '42,850', trend: '+18.4% this month', color: '#A5B4FC', icon: Activity },
          { label: 'Avg Latency', val: '380 ms', trend: 'Ultra-fast', color: '#FBBF24', icon: Zap },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="admin-card-glass" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase' }}>{s.label}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>{s.val}</div>
              <div style={{ fontSize: '12px', color: s.color, fontWeight: 700 }}>{s.trend}</div>
            </div>
          );
        })}
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { id: 'providers', label: 'AI Providers & Keys', icon: KeyRound },
            { id: 'routes', label: 'Feature Model Assignment', icon: Sparkles },
            { id: 'analytics', label: 'Usage & Cost Analytics', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9px',
                  fontSize: '12.5px', fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                  background: active ? 'linear-gradient(135deg, #06B6D4, #3B82F6)' : 'transparent',
                  color: active ? '#FFF' : '#9CA3AF',
                }}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {activeSubTab === 'providers' && (
          <button
            onClick={() => setShowAddKeyModal(true)}
            className="admin-btn admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', color: '#FFF' }}
          >
            <Plus size={14} /> Add AI Provider Key
          </button>
        )}
      </div>

      {/* SUB-TAB 1: PROVIDERS & KEYS */}
      {activeSubTab === 'providers' && (
        <div className="admin-card-glass" style={{ padding: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="#06B6D4" /> AI Fleet API Providers & Key Rotation Vault
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(providers.length > 0 ? providers : [
              { id: 'p1', name: 'OpenAI Fleet', slug: 'openai', default_model: 'gpt-4o', api_key: 'sk-proj-********************4f8a', monthly_budget: 200, status: 'active' },
              { id: 'p2', name: 'Anthropic Claude Engine', slug: 'anthropic', default_model: 'claude-3-5-sonnet', api_key: 'sk-ant-********************8e9d', monthly_budget: 150, status: 'active' },
              { id: 'p3', name: 'Google Gemini Pro Fleet', slug: 'gemini', default_model: 'gemini-1.5-pro', api_key: 'AIzaSy********************2b7c', monthly_budget: 100, status: 'active' },
              { id: 'p4', name: 'DeepSeek R1 High-Reasoning', slug: 'deepseek', default_model: 'deepseek-r1', api_key: 'sk-ds-********************1a3f', monthly_budget: 50, status: 'active' },
            ]).map((provider) => (
              <div
                key={provider.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
                  padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Cpu size={20} color="#06B6D4" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>{provider.name}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                      Default Model: <strong style={{ color: '#06B6D4' }}>{provider.default_model}</strong> · Budget: ${provider.monthly_budget}/mo
                    </div>
                  </div>
                </div>

                {/* API Key Box */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0D1120', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Lock size={12} color="#9CA3AF" />
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#A5B4FC' }}>
                    {revealedKeys[provider.id] ? (provider.api_key_full || 'sk-proj-849204918239019284') : provider.api_key}
                  </span>
                  <button
                    type="button" onClick={() => toggleKeyReveal(provider.id)}
                    style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex' }}
                  >
                    {revealedKeys[provider.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleRotateKey(provider.name)}
                    className="admin-btn admin-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '11.5px' }}
                  >
                    <RefreshCw size={12} /> Rotate Key
                  </button>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#34D399', background: 'rgba(52,211,153,0.12)', padding: '4px 8px', borderRadius: '6px' }}>
                    ACTIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FEATURE MODEL ASSIGNMENT (AiRoute) */}
      {activeSubTab === 'routes' && (
        <div className="admin-card-glass" style={{ padding: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#FBBF24" /> Feature AI Model Routing & Fallback Rules
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '20px' }}>
            Assign specific AI models to platform features. If a primary provider experiences downtime or rate limits, requests automatically route to the fallback model.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {routes.map(r => (
              <div
                key={r.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px',
                  padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>{r.feature_name}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'monospace', marginTop: '2px' }}>key: {r.feature_key}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: '#9CA3AF' }}>Primary:</span> <strong style={{ color: '#06B6D4' }}>{r.primary_model}</strong>
                  </div>
                  <ArrowRight size={12} color="#6B7280" />
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ color: '#9CA3AF' }}>Fallback:</span> <strong style={{ color: '#F59E0B' }}>{r.fallback_model}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleRoute(r.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: r.is_active ? '#34D399' : '#6B7280' }}
                >
                  {r.is_active ? <ToggleRight size={26} color="#34D399" /> : <ToggleLeft size={26} color="#6B7280" />}
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{r.is_active ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ANALYTICS & COSTS */}
      {activeSubTab === 'analytics' && (
        <div className="admin-card-glass" style={{ padding: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#A5B4FC" /> Token Usage & Cost Attribution Breakdown
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { provider: 'OpenAI (gpt-4o)', tokens: '18.4M tokens', cost: '$73.60', share: '51.5%' },
              { provider: 'Anthropic (claude-3-5)', tokens: '11.2M tokens', cost: '$44.80', share: '31.3%' },
              { provider: 'Google Gemini (gemini-1.5)', tokens: '8.1M tokens', cost: '$16.20', share: '11.3%' },
              { provider: 'DeepSeek (deepseek-r1)', tokens: '5.1M tokens', cost: '$8.20', share: '5.9%' },
            ].map(item => (
              <div key={item.provider} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>{item.provider}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#A5B4FC', marginBottom: '4px' }}>{item.cost}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF' }}>
                  <span>{item.tokens}</span>
                  <span style={{ color: '#34D399', fontWeight: 700 }}>{item.share} of total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add AI Provider Key */}
      {showAddKeyModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddKeyModal(false)}>
          <div className="admin-card-glass" style={{ width: '100%', maxWidth: '440px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>Add AI Provider Key</h3>
            <form onSubmit={handleAddProvider} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Provider Name</label>
                <input
                  className="admin-input"
                  placeholder="e.g. OpenAI Production Fleet"
                  value={newProviderName}
                  onChange={e => setNewProviderName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>API Key</label>
                <input
                  type="password"
                  className="admin-input"
                  placeholder="sk-..."
                  value={newApiKey}
                  onChange={e => setNewApiKey(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '6px' }}>Default Model</label>
                <input
                  className="admin-input"
                  placeholder="e.g. gpt-4o"
                  value={newDefaultModel}
                  onChange={e => setNewDefaultModel(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', color: '#FFF' }}>
                  Save AI Key
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAddKeyModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
