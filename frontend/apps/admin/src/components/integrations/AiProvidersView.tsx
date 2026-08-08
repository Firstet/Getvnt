import React, { useState } from 'react';
import {
  Cpu, Plus, RefreshCw, KeyRound, Trash2, Edit3, CheckCircle, Search, DollarSign,
  Activity, Eye, EyeOff, Copy, Sparkles, Send, Zap, Bot
} from 'lucide-react';
import { PasswordField } from '../../../../../shared/src';

interface Props {
  providers: any[];
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const AiProvidersView: React.FC<Props> = ({ providers, onRefresh, onToast }) => {
  const [search, setSearch] = useState('');
  const [testingId, setTestingId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<number, string>>({});

  // AI Assistance Live Testing Playground State
  const [aiFeature, setAiFeature] = useState<string>('event_description');
  const [aiPrompt, setAiPrompt] = useState<string>('Afrobeat Beach Festival 2026 Victoria Island');
  const [selectedAiProviderId, setSelectedAiProviderId] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<any | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`,
  });

  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.default_model.toLowerCase().includes(search.toLowerCase())
  );

  const handleTestConnection = async (id: number, name: string) => {
    setTestingId(id);
    try {
      const res = await fetch(`/api/v1/admin/integrations/ai-providers/${id}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`✅ ${data.message}`);
      } else {
        onToast(`❌ ${data.message || 'Connection test failed.'}`);
      }
    } catch (err) {
      onToast('❌ Failed to ping AI Provider.');
    } finally {
      setTestingId(null);
    }
  };

  const handleRevealKey = async (id: number, name: string) => {
    try {
      const res = await fetch(`/api/v1/admin/integrations/ai-providers/${id}/reveal`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setRevealedKeys((prev) => ({ ...prev, [id]: data.raw_api_key }));
        onToast(`🔓 Unmasked API key for ${name} (Audit Logged).`);
      }
    } catch (err) {
      onToast('❌ Failed to reveal API key.');
    }
  };

  const handleRotateKey = async (id: number, name: string) => {
    try {
      const res = await fetch(`/api/v1/admin/integrations/ai-providers/${id}/rotate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`🔑 API Key rotated successfully for ${name}!`);
        onRefresh();
      }
    } catch (err) {
      onToast('❌ Failed to rotate key.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/integrations/ai-providers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`🗑️ ${name} deleted successfully.`);
        onRefresh();
      }
    } catch (err) {
      onToast('❌ Failed to delete AI Provider.');
    }
  };

  const handleGenerateAiAssistance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    setAiOutput(null);

    try {
      const res = await fetch('/api/v1/admin/integrations/ai-assistance/generate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          feature: aiFeature,
          prompt: aiPrompt,
          provider_id: selectedAiProviderId ? parseInt(selectedAiProviderId) : undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAiOutput(json.data);
        onToast(`⚡ AI Assistance generated via ${json.data.provider_name}!`);
      } else {
        onToast('❌ Failed to generate AI assistance.');
      }
    } catch (err) {
      onToast('❌ Error connecting to AI Assistance Engine.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div>
      {/* Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>AI Provider Fleet & API Key Management</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            Configure LLM engines, manage secret API keys, monitor daily quotas, token pricing, & test AI assistance.
          </p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => {
            setSelectedProvider(null);
            setDrawerOpen(true);
          }}
        >
          <Plus size={16} /> Add AI Provider
        </button>
      </div>

      {/* 1. AI Assistance Live Testing Playground Console */}
      <div className="admin-card" style={{ border: '1px solid rgba(245, 158, 11, 0.3)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(14, 19, 31, 0.95) 100%)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Sparkles size={22} color="#F59E0B" />
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF' }}>AI Event Assistance Engine — Live Playground</h3>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '16px' }}>
          Test prompt completions, copy generators, pricing advice, and AI event assistant telemetry in real-time.
        </p>

        <form onSubmit={handleGenerateAiAssistance}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginBottom: '4px' }}>AI Capability Feature</label>
              <select className="admin-input" value={aiFeature} onChange={(e) => setAiFeature(e.target.value)}>
                <option value="event_description">Event Description Generator</option>
                <option value="pricing_advice">Smart Ticket Pricing Advisor</option>
                <option value="marketing_copywriter">Marketing & Email Copywriter</option>
                <option value="organizer_bot">Organizer Support AI Bot</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginBottom: '4px' }}>Engine Provider Route</label>
              <select className="admin-input" value={selectedAiProviderId} onChange={(e) => setSelectedAiProviderId(e.target.value)}>
                <option value="">Default Active Provider (Auto-Routed)</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.default_model})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginBottom: '4px' }}>Prompt Context / Subject</label>
            <div className="input-with-icon-wrapper">
              <input
                className="admin-input"
                style={{ paddingRight: '120px' }}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Enter event context or question..."
                required
              />
              <button
                type="submit"
                disabled={isGeneratingAi}
                className="admin-btn admin-btn-primary"
                style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', padding: '6px 14px', fontSize: '12px', borderRadius: '8px' }}
              >
                {isGeneratingAi ? 'Generating...' : (
                  <>
                    <Send size={13} /> Run AI Test
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* AI Response Output Box */}
        {aiOutput && (
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--admin-border)', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={16} color="#10B981" />
                <span style={{ fontWeight: 800, color: '#FFF' }}>{aiOutput.provider_name}</span>
                <span style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>({aiOutput.model_used})</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                <span style={{ color: '#F59E0B' }}>⚡ {aiOutput.latency_ms}ms</span>
                <span style={{ color: '#60A5FA' }}>📊 {aiOutput.tokens_used} Tokens</span>
                <span style={{ color: '#10B981' }}>💵 ${aiOutput.cost_usd}</span>
              </div>
            </div>
            <div style={{ fontSize: '13.5px', color: '#F3F4F6', whiteSpace: 'pre-wrap', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {aiOutput.response}
            </div>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            className="admin-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search AI providers or model names (e.g., GPT-4o, Claude, Gemini)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Providers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FBBF24',
                  }}
                >
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800 }}>{provider.name}</h3>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Default Model: {provider.default_model}</span>
                </div>
              </div>
              <span className={`admin-badge ${provider.status === 'active' ? 'admin-badge-active' : 'admin-badge-inactive'}`}>
                {provider.status.toUpperCase()}
              </span>
            </div>

            <p style={{ color: '#D1D5DB', fontSize: '13px', marginBottom: '16px', minHeight: '36px' }}>
              {provider.description}
            </p>

            {/* Secret API Key Box with Reveal & Copy */}
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <KeyRound size={13} color="#8B5CF6" /> API Secret Key:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <code style={{ fontFamily: 'monospace', color: revealedKeys[provider.id] ? '#34D399' : '#60A5FA', background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: '6px' }}>
                    {revealedKeys[provider.id] || provider.api_key_masked || 'sk-****************'}
                  </code>
                  {!revealedKeys[provider.id] ? (
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer' }}
                      title="Reveal API Key (Audited)"
                      onClick={() => handleRevealKey(provider.id, provider.name)}
                    >
                      <Eye size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#34D399', cursor: 'pointer' }}
                      title="Copy Key"
                      onClick={() => {
                        navigator.clipboard.writeText(revealedKeys[provider.id]);
                        onToast('Copied API key to clipboard!');
                      }}
                    >
                      <Copy size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#9CA3AF' }}>Cost per 1k Tokens:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>${provider.cost_per_1k_tokens}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9CA3AF' }}>Monthly Budget Quota:</span>
                <span style={{ fontWeight: 700, color: '#F59E0B' }}>${provider.monthly_budget}</span>
              </div>
            </div>

            {/* Models Pill Tags */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {provider.available_models &&
                provider.available_models.map((m: string) => (
                  <span key={m} style={{ background: 'rgba(255,255,255,0.06)', color: '#E5E7EB', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                    {m}
                  </span>
                ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--admin-border)', paddingTop: '14px' }}>
              <button
                className="admin-btn admin-btn-success"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => handleTestConnection(provider.id, provider.name)}
                disabled={testingId === provider.id}
              >
                <CheckCircle size={14} /> {testingId === provider.id ? 'Testing...' : 'Test Connection'}
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => handleRotateKey(provider.id, provider.name)}
              >
                <RefreshCw size={14} /> Rotate Key
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => {
                  setSelectedProvider(provider);
                  setDrawerOpen(true);
                }}
              >
                <Edit3 size={14} /> Edit
              </button>

              <button
                className="admin-btn admin-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', color: '#EF4444' }}
                onClick={() => handleDelete(provider.id, provider.name)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-out Edit/Add Drawer */}
      {drawerOpen && (
        <div className="modal-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              {selectedProvider ? `Edit ${selectedProvider.name}` : 'Add New AI Provider'}
            </h3>

            <form
              autoComplete="off"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  name: formData.get('name'),
                  slug: formData.get('slug') || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
                  description: formData.get('description'),
                  status: formData.get('status'),
                  default_model: formData.get('default_model'),
                  api_key: formData.get('api_key'),
                  cost_per_1k_tokens: parseFloat(formData.get('cost_per_1k_tokens') as string || '0.002'),
                  monthly_budget: parseFloat(formData.get('monthly_budget') as string || '1000'),
                };

                const url = selectedProvider
                  ? `/api/v1/admin/integrations/ai-providers/${selectedProvider.id}`
                  : '/api/v1/admin/integrations/ai-providers';

                const method = selectedProvider ? 'PUT' : 'POST';

                try {
                  const res = await fetch(url, {
                    method,
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                  });
                  const json = await res.json();
                  if (json.success) {
                    onToast(selectedProvider ? 'AI Provider updated!' : 'New AI Provider created!');
                    setDrawerOpen(false);
                    onRefresh();
                  }
                } catch (err) {
                  onToast('Error saving AI Provider.');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Fake hidden inputs to trick browser autofill */}
              <input type="text" name="prevent_autofill_username" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
              <input type="password" name="prevent_autofill_password" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" />

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Provider Name</label>
                <input className="admin-input" name="name" autoComplete="off" defaultValue={selectedProvider?.name || ''} required placeholder="e.g. Mistral AI" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Default Model Identifier</label>
                <input className="admin-input" name="default_model" autoComplete="off" defaultValue={selectedProvider?.default_model || ''} required placeholder="e.g. mistral-large-latest" />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>API Key</label>
                <PasswordField className="admin-input" name="api_key" autoComplete="new-password" defaultValue={selectedProvider?.api_key || ''} placeholder="sk-..." />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Status</label>
                <select className="admin-input" name="status" defaultValue={selectedProvider?.status || 'active'}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="testing">Testing</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Cost Per 1k Tokens ($USD)</label>
                <input className="admin-input" type="number" step="0.0001" name="cost_per_1k_tokens" defaultValue={selectedProvider?.cost_per_1k_tokens || '0.0025'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Monthly Budget Quota ($USD)</label>
                <input className="admin-input" type="number" name="monthly_budget" defaultValue={selectedProvider?.monthly_budget || '1000'} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Description / Notes</label>
                <textarea className="admin-input" name="description" rows={3} defaultValue={selectedProvider?.description || ''} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>Save Provider</button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDrawerOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
