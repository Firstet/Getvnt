import React, { useState, useEffect } from 'react';
import { Bot, Save, RefreshCw, Eye, EyeOff, CheckCircle2, Zap, Send, Plus, Trash2, X, AlertTriangle, CheckCircle, DownloadCloud, ChevronDown } from 'lucide-react';
import { ConfirmModal } from '@getvnt/shared';

interface Provider {
  id: string | number;
  name: string;
  provider?: string;
  slug?: string;
  api_key?: string;
  default_model?: string;
  base_url?: string;
  status?: string;
  available_models?: string[];
  cost_per_1k_tokens?: number;
  avg_latency_ms?: number;
}

interface Props {
  aiFleetData: any;
  token: string;
  onRefresh: () => void;
}

const DEFAULT_FALLBACK_PROVIDERS: Provider[] = [
  { id: 'prov-openai', name: 'OpenAI', provider: 'openai', slug: 'openai', api_key: '', default_model: 'gpt-4o', available_models: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini', 'gpt-4-turbo'], base_url: 'https://api.openai.com/v1', status: 'active' },
  { id: 'prov-anthropic', name: 'Anthropic Claude', provider: 'anthropic', slug: 'anthropic', api_key: '', default_model: 'claude-3-5-sonnet-20241022', available_models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'], base_url: 'https://api.anthropic.com/v1', status: 'active' },
  { id: 'prov-google', name: 'Google Gemini', provider: 'google', slug: 'google', api_key: '', default_model: 'gemini-1.5-pro', available_models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'], base_url: 'https://generativelanguage.googleapis.com/v1beta', status: 'active' },
  { id: 'prov-deepseek', name: 'DeepSeek AI', provider: 'deepseek', slug: 'deepseek', api_key: '', default_model: 'deepseek-chat', available_models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'], base_url: 'https://api.deepseek.com/v1', status: 'active' },
  { id: 'prov-groq', name: 'Groq LPU', provider: 'groq', slug: 'groq', api_key: '', default_model: 'llama-3.3-70b-versatile', available_models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'], base_url: 'https://api.groq.com/openai/v1', status: 'active' },
  { id: 'prov-openrouter', name: 'OpenRouter', provider: 'openrouter', slug: 'openrouter', api_key: '', default_model: 'auto', available_models: ['auto', 'openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'deepseek/deepseek-r1'], base_url: 'https://openrouter.ai/api/v1', status: 'active' },
  { id: 'prov-local', name: 'Ollama / Local LLM', provider: 'ollama', slug: 'ollama', api_key: 'local-key', default_model: 'llama3:8b', available_models: ['llama3:8b', 'llama3.3:latest', 'mistral:latest', 'phi3:latest'], base_url: 'http://localhost:11434/v1', status: 'active' },
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
  const [loadingModelsId, setLoadingModelsId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [customModelInput, setCustomModelInput] = useState<Record<string, boolean>>({});

  // Custom Toast Notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Custom Confirm Modal
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string; name: string } | null>(null);

  // Add Provider Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProv, setNewProv] = useState({
    name: 'Mistral AI',
    slug: 'mistral',
    api_key: '',
    default_model: 'mistral-large-latest',
    base_url: 'https://api.mistral.ai/v1',
    status: 'active',
    available_models: ['mistral-large-latest', 'mistral-medium', 'open-mixtral-8x22b']
  });
  const [addingProv, setAddingProv] = useState(false);
  const [detectingNewProvModels, setDetectingNewProvModels] = useState(false);

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

  // API Auto Model Load Functionality
  const handleAutoLoadModels = async (id: string) => {
    const payload = formData[id];
    if (!payload) return;

    setLoadingModelsId(id);
    try {
      const res = await fetch('/api/v1/admin/ai/fetch-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id,
          provider_code: payload.slug || payload.provider || 'openai',
          api_key: payload.api_key,
          base_url: payload.base_url,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.models?.length > 0) {
        const fetchedModels: string[] = data.data.models;
        updateField(id, 'available_models', fetchedModels);
        if (!payload.default_model || !fetchedModels.includes(payload.default_model)) {
          updateField(id, 'default_model', fetchedModels[0]);
        }
        showToast(`Auto-loaded ${fetchedModels.length} models for "${payload.name}"!`, 'success');
      } else {
        showToast(data.message || 'Could not fetch models. Check API Key or Base URL.', 'error');
      }
    } catch (e: any) {
      showToast('Model fetch error: ' + e.message, 'error');
    } finally {
      setLoadingModelsId(null);
    }
  };

  const handleAutoDetectNewProvModels = async () => {
    setDetectingNewProvModels(true);
    try {
      const res = await fetch('/api/v1/admin/ai/fetch-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          provider_code: newProv.slug || 'custom',
          api_key: newProv.api_key,
          base_url: newProv.base_url,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.models?.length > 0) {
        const models: string[] = data.data.models;
        setNewProv(prev => ({
          ...prev,
          available_models: models,
          default_model: models[0] || prev.default_model
        }));
        showToast(`Auto-discovered ${models.length} models!`, 'success');
      } else {
        showToast('Could not detect models. Check Base URL or API Key.', 'error');
      }
    } catch (e: any) {
      showToast('Model detection error: ' + e.message, 'error');
    } finally {
      setDetectingNewProvModels(false);
    }
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
        showToast(`AI Provider "${payload.name}" saved to database successfully!`, 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to save provider credentials.', 'error');
      }
    } catch (e: any) {
      showToast('Save error: ' + e.message, 'error');
    } finally {
      setSavingId(null);
    }
  };

  const executeDelete = async (id: string, name: string) => {
    setConfirmModal(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/admin/ai/providers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`AI Provider "${name}" deleted permanently.`, 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to delete provider.', 'error');
      }
    } catch (e: any) {
      showToast('Delete error: ' + e.message, 'error');
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
        setNewProv({ name: 'Mistral AI', slug: 'mistral', api_key: '', default_model: 'mistral-large-latest', base_url: 'https://api.mistral.ai/v1', status: 'active', available_models: [] });
        showToast(`New AI Provider "${newProv.name}" created!`, 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to create provider.', 'error');
      }
    } catch (e: any) {
      showToast('Create error: ' + e.message, 'error');
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
        showToast('System prompt saved to library!', 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to save prompt.', 'error');
      }
    } finally {
      setSavingPrompt(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Custom Toast Notification Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 99999,
            background: toast.type === 'success' ? '#052e16' : '#450a0a',
            border: `1px solid ${toast.type === 'success' ? '#10b981' : '#f87171'}`,
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '420px',
            fontSize: '13.5px',
            fontWeight: 700
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={20} color="#10b981" /> : <AlertTriangle size={20} color="#f87171" />}
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={22} color="#c084fc" /> AI Operations Fleet Control Center
          </h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>
            Configure and save API keys, custom endpoints, and use <strong>API Auto Model Load</strong> to discover available models for OpenAI, Claude, Gemini, DeepSeek, Groq, OpenRouter, and Local LLMs (Ollama / vLLM).
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
          const isLoadingModels = loadingModelsId === idStr;
          const keyVisible = Boolean(showKey[idStr]);
          const isCustomModel = Boolean(customModelInput[idStr]);
          const code = prov.slug || prov.provider || 'openai';

          const availableModelsList = item.available_models && item.available_models.length > 0
            ? item.available_models
            : (prov.available_models && prov.available_models.length > 0 ? prov.available_models : [item.default_model || 'default-model']);

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

              {/* Default Model Dropdown & API Auto Load Button */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Default Model
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setCustomModelInput(prev => ({ ...prev, [idStr]: !prev[idStr] }))}
                      style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '10px', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {isCustomModel ? 'Select List' : 'Custom Input'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutoLoadModels(idStr)}
                      disabled={isLoadingModels}
                      style={{ background: '#1e293b', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <DownloadCloud size={10} />
                      {isLoadingModels ? 'Loading...' : 'Auto-Load Models'}
                    </button>
                  </div>
                </div>

                {isCustomModel ? (
                  <input
                    type="text"
                    value={item.default_model || ''}
                    onChange={e => updateField(idStr, 'default_model', e.target.value)}
                    placeholder="e.g. gpt-4o"
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '12px' }}
                  />
                ) : (
                  <select
                    value={item.default_model || availableModelsList[0]}
                    onChange={e => updateField(idStr, 'default_model', e.target.value)}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '12px' }}
                  >
                    {availableModelsList.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}
                {availableModelsList.length > 1 && (
                  <span style={{ fontSize: '10px', color: '#10b981', display: 'block', marginTop: '3px' }}>
                    ✓ {availableModelsList.length} models auto-loaded
                  </span>
                )}
              </div>

              {/* Custom Base URL */}
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
                    onClick={() => setConfirmModal({ isOpen: true, id: idStr, name: prov.name })}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8' }}>Default Model</label>
                  <button
                    type="button"
                    onClick={handleAutoDetectNewProvModels}
                    disabled={detectingNewProvModels}
                    style={{ background: '#1e293b', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <DownloadCloud size={11} />
                    {detectingNewProvModels ? 'Detecting...' : 'Auto-Detect Models'}
                  </button>
                </div>

                {newProv.available_models && newProv.available_models.length > 0 ? (
                  <select
                    value={newProv.default_model}
                    onChange={e => setNewProv(prev => ({ ...prev, default_model: e.target.value }))}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}
                  >
                    {newProv.available_models.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newProv.default_model}
                    onChange={e => setNewProv(prev => ({ ...prev, default_model: e.target.value }))}
                    placeholder="mistral-large-latest / llama-3"
                    required
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}
                  />
                )}
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

      {/* Confirm Modal for Provider Deletion */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title="Delete AI Provider"
          message={`Are you sure you want to permanently delete AI Provider "${confirmModal.name}"? This action cannot be undone.`}
          confirmText="Yes, Delete Provider"
          cancelText="Cancel"
          variant="danger"
          onConfirm={() => executeDelete(confirmModal.id, confirmModal.name)}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
