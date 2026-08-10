import React, { useState, useEffect } from 'react';
import { Bot, Save, RefreshCw, Eye, EyeOff, CheckCircle2, Zap, Send, Plus, Trash2, X, Terminal, Cpu } from 'lucide-react';

interface Provider {
  id: string | number;
  name: string;
  provider?: string;
  slug?: string;
  api_key?: string;
  default_model?: string;
  base_url?: string;
  status?: string;
  cost_per_1k_tokens?: number;
  avg_latency_ms?: number;
}

interface Props {
  aiFleetData: any;
  token: string;
  onRefresh: () => void;
}

const DEFAULT_FALLBACK_PROVIDERS: Provider[] = [
  { id: 'prov-openai', name: 'OpenAI', provider: 'openai', slug: 'openai', api_key: '', default_model: 'gpt-4o', base_url: 'https://api.openai.com/v1', status: 'active' },
  { id: 'prov-anthropic', name: 'Anthropic Claude', provider: 'anthropic', slug: 'anthropic', api_key: '', default_model: 'claude-3-5-sonnet', base_url: 'https://api.anthropic.com/v1', status: 'active' },
  { id: 'prov-google', name: 'Google Gemini', provider: 'google', slug: 'google', api_key: '', default_model: 'gemini-1.5-pro', base_url: 'https://generativelanguage.googleapis.com/v1beta', status: 'active' },
  { id: 'prov-deepseek', name: 'DeepSeek AI', provider: 'deepseek', slug: 'deepseek', api_key: '', default_model: 'deepseek-chat', base_url: 'https://api.deepseek.com/v1', status: 'active' },
  { id: 'prov-groq', name: 'Groq LPU', provider: 'groq', slug: 'groq', api_key: '', default_model: 'llama-3.3-70b-versatile', base_url: 'https://api.groq.com/openai/v1', status: 'active' },
  { id: 'prov-openrouter', name: 'OpenRouter', provider: 'openrouter', slug: 'openrouter', api_key: '', default_model: 'auto', base_url: 'https://openrouter.ai/api/v1', status: 'active' },
  { id: 'prov-local', name: 'Ollama / Local LLM', provider: 'ollama', slug: 'ollama', api_key: 'local-key', default_model: 'llama3:8b', base_url: 'http://localhost:11434/v1', status: 'active' },
];

export function AiFleetControl({ aiFleetData, token, onRefresh }: Props) {
  const rawList: Provider[] = aiFleetData?.providers ?? [];
  const providersList = rawList.length > 0 ? rawList : DEFAULT_FALLBACK_PROVIDERS;

  const [formData, setFormData] = useState<Record<string, Provider>>(() => {
    const map: Record<string, Provider> = {};
    providersList.forEach((p: Provider) => {
      map[String(p.id)] = { ...p };
    });
    return map;
  });

  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  // Add Provider Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProv, setNewProv] = useState({
    name: 'Mistral AI',
    slug: 'mistral',
    api_key: '',
    default_model: 'mistral-large-latest',
    base_url: 'https://api.mistral.ai/v1',
    status: 'active'
  });
  const [addingProv, setAddingProv] = useState(false);

  // System Prompt Library Form State
  const [promptTitle, setPromptTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptCategory, setPromptCategory] = useState('general');
  const [savingPrompt, setSavingPrompt] = useState(false);

  // Sync formData whenever aiFleetData changes
  useEffect(() => {
    const list = aiFleetData?.providers && aiFleetData.providers.length > 0 ? aiFleetData.providers : DEFAULT_FALLBACK_PROVIDERS;
    const map: Record<string, Provider> = {};
    list.forEach((p: Provider) => {
      map[String(p.id)] = { ...p };
    });
    setFormData(map);
  }, [aiFleetData]);

  const updateField = (id: string, field: keyof Provider, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const toggleShowKey = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveProvider = async (id: string) => {
    const payload = formData[id];
    if (!payload) return;

    setSavingId(id);
    try {
      const isFallback = String(id).startsWith('prov-');
      const url = isFallback ? '/api/v1/admin/ai/providers' : `/api/v1/admin/ai/providers/${id}`;
      const method = isFallback ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: payload.name,
          slug: payload.slug || payload.provider || 'openai',
          provider: payload.provider || payload.slug || 'openai',
          api_key: payload.api_key,
          default_model: payload.default_model,
          base_url: payload.base_url,
          status: payload.status || 'active',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedId(id);
        setTimeout(() => setSavedId(null), 3000);
        onRefresh();
      } else {
        alert(data.message || 'Failed to save provider credentials.');
      }
    } catch (e: any) {
      alert('Save failed: ' + e.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteProvider = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete AI provider "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/admin/ai/providers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.message || 'Failed to delete provider.');
      }
    } catch (e: any) {
      alert('Delete failed: ' + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateNewProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProv(true);
    try {
      const res = await fetch('/api/v1/admin/ai/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProv),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewProv({ name: 'Mistral AI', slug: 'mistral', api_key: '', default_model: 'mistral-large-latest', base_url: 'https://api.mistral.ai/v1', status: 'active' });
        onRefresh();
      } else {
        alert(data.message || 'Failed to create provider.');
      }
    } catch (e: any) {
      alert('Create error: ' + e.message);
    } finally {
      setAddingProv(false);
    }
  };

  const handleTestConnection = async (id: string, providerCode: string) => {
    setTestingId(id);
    try {
      const res = await fetch('/api/v1/admin/ai/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ provider_code: providerCode }),
      });
      const data = await res.json();
      setTestResult(prev => ({
        ...prev,
        [id]: data.success ? `✓ Connected (${data.latency_ms ?? 180}ms)` : '✕ Connection failed'
      }));
    } catch (e) {
      setTestResult(prev => ({ ...prev, [id]: '✕ Connection error' }));
    } finally {
      setTestingId(null);
    }
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrompt(true);
    try {
      const res = await fetch('/api/v1/admin/ai/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category: promptCategory, title: promptTitle, prompt_text: promptText }),
      });
      const data = await res.json();
      if (data.success) {
        setPromptTitle('');
        setPromptText('');
        alert('System prompt saved to library!');
        onRefresh();
      } else {
        alert(data.message || 'Failed to save prompt.');
      }
    } finally {
      setSavingPrompt(false);
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={22} color="#c084fc" /> AI Operations Fleet Control Center
          </h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>
            Configure and save API keys & custom base URLs for OpenAI, Claude, Gemini, DeepSeek, Groq, OpenRouter, and Local LLMs (Ollama / vLLM).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
          >
            <Plus size={16} /> + Add AI Provider / Endpoint
          </button>
          <button onClick={onRefresh} style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <RefreshCw size={14} /> Refresh AI Fleet
          </button>
        </div>
      </div>

      {/* Fleet Providers Cards */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>Active AI Providers & Endpoints</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '32px' }}>
        {providersList.map(prov => {
          const idStr = String(prov.id);
          const item = formData[idStr] || prov;
          const isSaving = savingId === idStr;
          const isJustSaved = savedId === idStr;
          const isDeleting = deletingId === idStr;
          const isTesting = testingId === idStr;
          const keyVisible = Boolean(showKey[idStr]);
          const code = prov.slug || prov.provider || 'openai';

          return (
            <div key={idStr} style={{ background: '#0f172a', border: `1px solid ${item.status === 'active' ? '#a855f744' : '#1e293b'}`, borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Card Header & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#fff' }}>{prov.name}</h4>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Code: {code}</span>
                </div>
                <button
                  type="button"
                  onClick={() => updateField(idStr, 'status', item.status === 'active' ? 'disabled' : 'active')}
                  style={{ background: item.status === 'active' ? '#052e16' : '#1e293b', color: item.status === 'active' ? '#34d399' : '#64748b', border: `1px solid ${item.status === 'active' ? '#34d399' : '#334155'}`, padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, cursor: 'pointer' }}
                >
                  {item.status === 'active' ? '✓ ACTIVE' : 'DISABLED'}
                </button>
              </div>

              {/* API Key Field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>API Key</label>
                  <button type="button" onClick={() => toggleShowKey(idStr)} style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {keyVisible ? <EyeOff size={11} /> : <Eye size={11} />}
                    {keyVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={keyVisible ? 'text' : 'password'}
                  value={item.api_key || ''}
                  onChange={e => updateField(idStr, 'api_key', e.target.value)}
                  placeholder="sk-..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                />
              </div>

              {/* Default Model */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Default Model</label>
                <input
                  type="text"
                  value={item.default_model || ''}
                  onChange={e => updateField(idStr, 'default_model', e.target.value)}
                  placeholder="gpt-4o / claude-3-5-sonnet / llama3..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '12px' }}
                />
              </div>

              {/* Custom Base URL (For OpenAI-compatible / Local LLMs / Ollama) */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Base URL (OpenAI-compatible Endpoint)</label>
                <input
                  type="text"
                  value={item.base_url || ''}
                  onChange={e => updateField(idStr, 'base_url', e.target.value)}
                  placeholder="https://api.openai.com/v1 or http://localhost:11434/v1"
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#94a3b8', fontSize: '11px' }}
                />
              </div>

              {/* Test Result Message */}
              {testResult[idStr] && (
                <div style={{ fontSize: '12px', color: testResult[idStr].includes('✓') ? '#34d399' : '#f87171', background: '#1e293b', padding: '6px 10px', borderRadius: '6px', textAlign: 'center', fontWeight: 700 }}>
                  {testResult[idStr]}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => handleSaveProvider(idStr)}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    background: isJustSaved ? '#059669' : 'linear-gradient(135deg,#a855f7,#ec4899)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Save size={13} />
                  {isSaving ? 'Saving...' : isJustSaved ? 'Saved!' : 'Save Key'}
                </button>

                <button
                  type="button"
                  onClick={() => handleTestConnection(idStr, code)}
                  disabled={isTesting}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#c084fc',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Zap size={12} />
                  {isTesting ? '...' : 'Test'}
                </button>

                {!idStr.startsWith('prov-') && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProvider(idStr, prov.name)}
                    disabled={isDeleting}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #7f1d1d',
                      color: '#f87171',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Provider Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={20} color="#a855f7" /> Add New AI Provider / Endpoint
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNewProvider} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Provider Name</label>
                <input
                  type="text"
                  value={newProv.name}
                  onChange={e => setNewProv(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                  placeholder="e.g. Mistral AI / Local vLLM"
                  required
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>API Key (or 'local-key' for localhost)</label>
                <input
                  type="password"
                  value={newProv.api_key}
                  onChange={e => setNewProv(prev => ({ ...prev, api_key: e.target.value }))}
                  placeholder="sk-..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Default Model</label>
                <input
                  type="text"
                  value={newProv.default_model}
                  onChange={e => setNewProv(prev => ({ ...prev, default_model: e.target.value }))}
                  placeholder="mistral-large-latest / llama-3"
                  required
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Base URL Endpoint (OpenAI Compatible)</label>
                <input
                  type="text"
                  value={newProv.base_url}
                  onChange={e => setNewProv(prev => ({ ...prev, base_url: e.target.value }))}
                  placeholder="https://api.mistral.ai/v1 or http://localhost:8000/v1"
                  required
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={addingProv} style={{ flex: 1, background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}>
                  {addingProv ? 'Saving...' : 'Create Provider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Prompt Library Form */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>Add System Prompt to Library</h3>
      <form onSubmit={handleSavePrompt} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Prompt Title</label>
            <input type="text" value={promptTitle} onChange={e => setPromptTitle(e.target.value)} placeholder="Event Copy Generator Prompt..." required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Category</label>
            <select value={promptCategory} onChange={e => setPromptCategory(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}>
              <option value="general">General Marketing</option>
              <option value="kyc">KYC Document Review</option>
              <option value="website">Website Copy</option>
              <option value="poster">Poster Design Prompts</option>
              <option value="support">Attendee Support Bot</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Prompt System Message</label>
          <textarea value={promptText} onChange={e => setPromptText(e.target.value)} placeholder="You are GETVNT AI Assistant..." required rows={4} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px', resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={savingPrompt} style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: 'fit-content' }}>
          <Send size={14} /> {savingPrompt ? 'Saving Prompt...' : 'Save Prompt to Library'}
        </button>
      </form>
    </div>
  );
}
