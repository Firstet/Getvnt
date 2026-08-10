import React, { useState, useEffect } from 'react';
import { Bot, Save, RefreshCw, Eye, EyeOff, CheckCircle2, Zap, Send, Plus, Trash2, X, AlertTriangle, CheckCircle, DownloadCloud, Copy, Edit, FileJson, Play, Sliders, Sparkles, Database, Layers, ShieldCheck, Tag } from 'lucide-react';
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
}

interface PromptItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  prompt_text: string;
  provider_code?: string;
  preferred_model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  version?: number;
  is_published?: boolean;
  role_scope?: string;
  created_by?: string;
  updated_at?: string;
}

interface Props {
  aiFleetData: any;
  token: string;
  onRefresh: () => void;
}

export const PROMPT_CATEGORIES = [
  'General Marketing',
  'KYC Document Review',
  'Website Copy',
  'Poster Design Prompts',
  'Attendee Support Bot',
  'Event Copy Generator',
  'Social Media Assistant',
  'Email Campaign Writer',
  'SMS Campaign Writer',
  'AI Event Planner',
  'Event Website Builder',
  'AI Ticket Pricing Advisor',
  'Community Moderator',
  'Customer Support',
  'Sponsor Proposal Writer',
  'Press Release Generator',
  'SEO Optimizer',
  'CRM Assistant',
  'Sales Assistant',
  'Business Proposal Generator',
  'Analytics Interpreter',
  'Event Risk Assessment',
  'Speaker Bio Writer',
  'Vendor Contract Assistant',
  'AI Workflow Automation',
  'Internal Knowledge Base',
  'Translation Assistant',
];

const DEFAULT_FALLBACK_PROVIDERS: Provider[] = [
  { id: 'prov-openai', name: 'OpenAI', provider: 'openai', slug: 'openai', api_key: '', default_model: 'gpt-4o', available_models: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini', 'gpt-4-turbo'], base_url: 'https://api.openai.com/v1', status: 'active' },
  { id: 'prov-anthropic', name: 'Anthropic Claude', provider: 'anthropic', slug: 'anthropic', api_key: '', default_model: 'claude-3-5-sonnet-20241022', available_models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'], base_url: 'https://api.anthropic.com/v1', status: 'active' },
  { id: 'prov-google', name: 'Google Gemini', provider: 'google', slug: 'google', api_key: '', default_model: 'gemini-1.5-pro', available_models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'], base_url: 'https://generativelanguage.googleapis.com/v1beta', status: 'active' },
  { id: 'prov-deepseek', name: 'DeepSeek AI', provider: 'deepseek', slug: 'deepseek', api_key: '', default_model: 'deepseek-chat', available_models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'], base_url: 'https://api.deepseek.com/v1', status: 'active' },
  { id: 'prov-groq', name: 'Groq LPU', provider: 'groq', slug: 'groq', api_key: '', default_model: 'llama-3.3-70b-versatile', available_models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'], base_url: 'https://api.groq.com/openai/v1', status: 'active' },
  { id: 'prov-openrouter', name: 'OpenRouter', provider: 'openrouter', slug: 'openrouter', api_key: '', default_model: 'auto', available_models: ['auto', 'openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'deepseek/deepseek-r1'], base_url: 'https://openrouter.ai/api/v1', status: 'active' },
  { id: 'prov-nvidia', name: 'NVIDIA NIM (AI Foundation)', provider: 'nvidia', slug: 'nvidia', api_key: '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', default_model: 'meta/llama-3.3-70b-instruct', available_models: ['meta/llama-3.3-70b-instruct', 'meta/llama-3.1-70b-instruct', 'nvidia/llama-3.1-nemotron-70b-instruct', 'nvidia/llama-3.3-nemotron-super-49b-v1', 'mistralai/mistral-large-2-instruct', 'deepseek-ai/deepseek-r1'], base_url: 'https://integrate.api.nvidia.com/v1', status: 'active' },
  { id: 'prov-local', name: 'Ollama / Local LLM', provider: 'ollama', slug: 'ollama', api_key: 'local-key', default_model: 'llama3:8b', available_models: ['llama3:8b', 'llama3.3:latest', 'mistral:latest', 'phi3:latest'], base_url: 'http://localhost:11434/v1', status: 'active' },
];

export function AiFleetControl({ aiFleetData, token, onRefresh }: Props) {
  const getEffectiveToken = () => {
    if (token && token.trim() !== '') return token;
    return (
      localStorage.getItem('getvnt_auth_token') ||
      localStorage.getItem('auth_token') ||
      sessionStorage.getItem('getvnt_auth_token') ||
      sessionStorage.getItem('auth_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      ''
    );
  };

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
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string; name: string; action: 'delete_provider' | 'delete_prompt' } | null>(null);

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

  // ----------------------------------------------------
  // PROMPT LIBRARY STATES
  // ----------------------------------------------------
  const promptsList: PromptItem[] = aiFleetData?.prompts ?? [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Prompt Form Modal State (Create / Edit)
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptForm, setPromptForm] = useState({
    title: '',
    category: 'General Marketing',
    description: '',
    prompt_text: '',
    provider_code: 'openai',
    preferred_model: 'gpt-4o',
    temperature: 0.70,
    max_tokens: 2048,
    role_scope: 'global',
    is_published: true,
  });
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [seedingPrompts, setSeedingPrompts] = useState(false);

  // Test Run Prompt Modal
  const [testingPromptModal, setTestingPromptModal] = useState<PromptItem | null>(null);
  const [testUserInput, setTestUserInput] = useState('');
  const [testResponseOutput, setTestResponseOutput] = useState('');
  const [executingTestPrompt, setExecutingTestPrompt] = useState(false);

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

  const handleAutoLoadModels = async (id: string) => {
    const payload = formData[id];
    if (!payload) return;

    setLoadingModelsId(id);
    try {
      const res = await fetch('/api/v1/admin/ai/fetch-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getEffectiveToken()}`
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
          Authorization: `Bearer ${getEffectiveToken()}`
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
          Authorization: `Bearer ${getEffectiveToken()}`
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
        if (data.data) {
          setFormData(prev => ({
            ...prev,
            [id]: { ...prev[id], ...data.data },
            [data.data.id]: { ...data.data }
          }));
        }
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

  const executeConfirmAction = async () => {
    if (!confirmModal) return;
    const { id, name, action } = confirmModal;
    setConfirmModal(null);

    if (action === 'delete_provider') {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/v1/admin/ai/providers/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getEffectiveToken()}` }
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
    } else if (action === 'delete_prompt') {
      try {
        const res = await fetch(`/api/v1/admin/ai/prompts/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getEffectiveToken()}` }
        });
        const data = await res.json();
        if (data.success) {
          showToast(`System Prompt "${name}" deleted.`, 'success');
          onRefresh();
        } else {
          showToast(data.message || 'Failed to delete prompt.', 'error');
        }
      } catch (e: any) {
        showToast('Delete prompt error: ' + e.message, 'error');
      }
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
          Authorization: `Bearer ${getEffectiveToken()}`
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
    const payload = formData[id];
    try {
      const res = await fetch('/api/v1/admin/ai/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${getEffectiveToken()}`
        },
        body: JSON.stringify({
          id,
          provider_code: providerCode,
          api_key: payload?.api_key,
          base_url: payload?.base_url
        }),
      });
      const data = await res.json();
      setTestResult(prev => ({
        ...prev,
        [id]: (res.ok && data.success) ? `✓ Connected (${data.latency_ms ?? 180}ms)` : '✕ Connection failed'
      }));
    } catch (e) {
      setTestResult(prev => ({ ...prev, [id]: '✕ Connection error' }));
    } finally {
      setTestingId(null);
    }
  };

  // ----------------------------------------------------
  // PROMPT LIBRARY ACTIONS
  // ----------------------------------------------------
  const handleOpenNewPromptModal = () => {
    setEditingPromptId(null);
    setPromptForm({
      title: '',
      category: 'General Marketing',
      description: '',
      prompt_text: '',
      provider_code: 'openai',
      preferred_model: 'gpt-4o',
      temperature: 0.70,
      max_tokens: 2048,
      role_scope: 'global',
      is_published: true,
    });
    setIsPromptModalOpen(true);
  };

  const handleOpenEditPromptModal = (item: PromptItem) => {
    setEditingPromptId(item.id);
    setPromptForm({
      title: item.title,
      category: item.category,
      description: item.description || '',
      prompt_text: item.prompt_text,
      provider_code: item.provider_code || 'openai',
      preferred_model: item.preferred_model || 'gpt-4o',
      temperature: item.temperature ?? 0.70,
      max_tokens: item.max_tokens ?? 2048,
      role_scope: item.role_scope || 'global',
      is_published: item.is_published ?? true,
    });
    setIsPromptModalOpen(true);
  };

  const handleSavePromptForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrompt(true);
    try {
      const url = editingPromptId ? `/api/v1/admin/ai/prompts/${editingPromptId}` : '/api/v1/admin/ai/prompts';
      const method = editingPromptId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getEffectiveToken()}` },
        body: JSON.stringify(promptForm),
      });
      const data = await res.json();
      if (data.success) {
        setIsPromptModalOpen(false);
        showToast(editingPromptId ? `Prompt "${promptForm.title}" updated!` : `Prompt "${promptForm.title}" added to library!`, 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to save prompt.', 'error');
      }
    } catch (e: any) {
      showToast('Save prompt error: ' + e.message, 'error');
    } finally {
      setSavingPrompt(false);
    }
  };

  const handleClonePrompt = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/admin/ai/prompts/${id}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${getEffectiveToken()}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Prompt cloned successfully as "${data.data.title}"!`, 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Failed to clone prompt.', 'error');
      }
    } catch (e: any) {
      showToast('Clone error: ' + e.message, 'error');
    }
  };

  const handleSeedDefaultPrompts = async () => {
    setSeedingPrompts(true);
    try {
      const res = await fetch('/api/v1/admin/ai/prompts/seed-default', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${getEffectiveToken()}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Seeded 27 Enterprise System Prompts!', 'success');
        onRefresh();
      } else {
        showToast(data.message || 'Seeding failed.', 'error');
      }
    } catch (e: any) {
      showToast('Seeding error: ' + e.message, 'error');
    } finally {
      setSeedingPrompts(false);
    }
  };

  const handleExportPromptsJSON = async () => {
    try {
      const res = await fetch('/api/v1/admin/ai/prompts/export', {
        headers: {
          'Accept': 'application/json',
          Authorization: `Bearer ${getEffectiveToken()}`
        }
      });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `getvnt-ai-prompt-library-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      showToast('Prompt Library exported to JSON file!', 'success');
    } catch (e: any) {
      showToast('Export failed: ' + e.message, 'error');
    }
  };

  const handleExecuteTestPrompt = async () => {
    if (!testingPromptModal) return;
    setExecutingTestPrompt(true);
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getEffectiveToken()}` },
        body: JSON.stringify({
          message: testUserInput || 'Draft a tech event announcement',
          system_prompt_override: testingPromptModal.prompt_text,
          context: testingPromptModal.role_scope || 'organizer'
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestResponseOutput(data.data.reply || JSON.stringify(data.data, null, 2));
      } else {
        setTestResponseOutput('Execution failed: ' + (data.message || 'Unknown error'));
      }
    } catch (e: any) {
      setTestResponseOutput('Execution error: ' + e.message);
    } finally {
      setExecutingTestPrompt(false);
    }
  };

  // Filtered Prompts List
  const filteredPrompts = promptsList.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.prompt_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

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
            <Bot size={22} color="#c084fc" /> AI Operations Fleet & Enterprise Prompt Library
          </h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>
            Centralized multi-provider control center & version-controlled 27-category Enterprise Prompt Library.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
          >
            <Plus size={16} /> + Add AI Provider
          </button>
          <button onClick={onRefresh} style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <RefreshCw size={14} /> Refresh Fleet
          </button>
        </div>
      </div>

      {/* SECTION 1: AI FLEET PROVIDERS */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap size={18} color="#f59e0b" /> Active AI Providers & LLM Endpoints
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '40px' }}>
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
              
              {/* Header */}
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

              {/* API Key */}
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
                    ✓ {availableModelsList.length} models loaded
                  </span>
                )}
              </div>

              {/* Base URL */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Base URL (OpenAI-compatible Endpoint)</label>
                <input
                  type="text"
                  value={item.base_url || ''}
                  onChange={e => updateField(idStr, 'base_url', e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#94a3b8', fontSize: '11px' }}
                />
              </div>

              {/* Test Result */}
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
                  style={{ background: '#1e293b', border: '1px solid #334155', color: '#c084fc', padding: '10px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Zap size={12} />
                  {isTesting ? '...' : 'Test'}
                </button>

                {!idStr.startsWith('prov-') && (
                  <button
                    type="button"
                    onClick={() => setConfirmModal({ isOpen: true, id: idStr, name: prov.name, action: 'delete_provider' })}
                    disabled={isDeleting}
                    style={{ background: '#1e293b', border: '1px solid #7f1d1d', color: '#f87171', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: ENTERPRISE AI PROMPT LIBRARY */}
      <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '24px', padding: '28px', marginBottom: '32px' }}>
        
        {/* Prompt Library Header & Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#a855f7" /> Enterprise AI Prompt Library ({promptsList.length})
            </h3>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
              Modular, version-controlled system prompts across 27 GETVNT platform categories.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSeedDefaultPrompts}
              disabled={seedingPrompts}
              style={{ background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Database size={14} />
              {seedingPrompts ? 'Seeding...' : '🌱 Seed All 27 Enterprise Prompts'}
            </button>

            <button
              type="button"
              onClick={handleOpenNewPromptModal}
              style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 900, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} /> + Create System Prompt
            </button>

            <button
              type="button"
              onClick={handleExportPromptsJSON}
              style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FileJson size={14} /> Export JSON
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Search system prompts by title, category, or keywords..."
            style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px', color: '#fff', fontSize: '14px' }}
          />

          {/* 27 Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'thin' }}>
            <button
              type="button"
              onClick={() => setSelectedCategoryFilter('All')}
              style={{ background: selectedCategoryFilter === 'All' ? '#a855f7' : '#1e293b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              All Categories ({promptsList.length})
            </button>
            {PROMPT_CATEGORIES.map(cat => {
              const count = promptsList.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  style={{ background: selectedCategoryFilter === cat ? '#a855f7' : '#1e293b', color: selectedCategoryFilter === cat ? '#fff' : '#94a3b8', border: `1px solid ${selectedCategoryFilter === cat ? '#a855f7' : '#334155'}`, padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {cat} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Cards Grid */}
        {filteredPrompts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#0f172a', borderRadius: '16px', border: '1px border #1e293b', color: '#64748b' }}>
            <Bot size={36} color="#475569" style={{ marginBottom: '12px' }} />
            <h4 style={{ color: '#94a3b8', margin: '0 0 8px' }}>No Prompts Found</h4>
            <p style={{ fontSize: '13px', margin: '0 0 16px' }}>Click "🌱 Seed All 27 Enterprise Prompts" to load standard system prompts or create a custom prompt.</p>
            <button
              type="button"
              onClick={handleSeedDefaultPrompts}
              style={{ background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', fontSize: '13px' }}
            >
              Seed All 27 Enterprise Prompts
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
            {filteredPrompts.map(prompt => (
              <div key={prompt.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '18px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.3)', padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 800 }}>
                        {prompt.category}
                      </span>
                      <span style={{ background: '#1e293b', color: '#94a3b8', padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 800 }}>
                        v{prompt.version || 1}
                      </span>
                      <span style={{ background: prompt.role_scope === 'super_admin' ? '#7f1d1d' : '#052e16', color: prompt.role_scope === 'super_admin' ? '#f87171' : '#34d399', padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase' }}>
                        {prompt.role_scope || 'global'}
                      </span>
                    </div>
                    <h4 style={{ margin: '4px 0 0', fontSize: '17px', fontWeight: 900, color: '#fff' }}>{prompt.title}</h4>
                    {prompt.description && (
                      <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94a3b8' }}>{prompt.description}</p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setTestingPromptModal(prompt)}
                      style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      title="Test / Preview Prompt"
                    >
                      <Play size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClonePrompt(prompt.id)}
                      style={{ background: '#1e293b', border: '1px solid #334155', color: '#c084fc', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      title="Clone Prompt"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditPromptModal(prompt)}
                      style={{ background: '#1e293b', border: '1px solid #334155', color: '#f59e0b', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      title="Edit Prompt"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmModal({ isOpen: true, id: prompt.id, name: prompt.title, action: 'delete_prompt' })}
                      style={{ background: '#1e293b', border: '1px solid #7f1d1d', color: '#f87171', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      title="Delete Prompt"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Prompt System Text Snippet */}
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px 14px', maxHeight: '120px', overflowY: 'auto' }}>
                  <pre style={{ margin: 0, fontSize: '11.5px', color: '#cbd5e1', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {prompt.prompt_text}
                  </pre>
                </div>

                {/* Footer Metadata */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                  <div>
                    Provider: <strong style={{ color: '#c084fc' }}>{prompt.provider_code || 'openai'}</strong> ({prompt.preferred_model || 'gpt-4o'})
                  </div>
                  <div>
                    Temp: <strong style={{ color: '#fff' }}>{prompt.temperature ?? 0.7}</strong> | Max Tokens: <strong style={{ color: '#fff' }}>{prompt.max_tokens ?? 2048}</strong>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT PROMPT MODAL */}
      {isPromptModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="#a855f7" /> {editingPromptId ? 'Edit System Prompt' : 'Create System Prompt'}
              </h3>
              <button onClick={() => setIsPromptModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePromptForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Prompt Title</label>
                  <input
                    type="text"
                    value={promptForm.title}
                    onChange={e => setPromptForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Enterprise Marketing Strategist"
                    required
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Category (27 Categories)</label>
                  <select
                    value={promptForm.category}
                    onChange={e => setPromptForm(prev => ({ ...prev, category: e.target.value }))}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  >
                    {PROMPT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Short Description</label>
                <input
                  type="text"
                  value={promptForm.description}
                  onChange={e => setPromptForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Summarize the intent of this system prompt..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>System Prompt Message</label>
                <textarea
                  value={promptForm.prompt_text}
                  onChange={e => setPromptForm(prev => ({ ...prev, prompt_text: e.target.value }))}
                  placeholder="You are GETVNT AI Assistant..."
                  required
                  rows={8}
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '12.5px', fontFamily: 'monospace', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>AI Provider</label>
                  <select
                    value={promptForm.provider_code}
                    onChange={e => setPromptForm(prev => ({ ...prev, provider_code: e.target.value }))}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic Claude</option>
                    <option value="google">Google Gemini</option>
                    <option value="deepseek">DeepSeek AI</option>
                    <option value="groq">Groq LPU</option>
                    <option value="openrouter">OpenRouter</option>
                    <option value="ollama">Ollama / Local LLM</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Preferred Model</label>
                  <input
                    type="text"
                    value={promptForm.preferred_model}
                    onChange={e => setPromptForm(prev => ({ ...prev, preferred_model: e.target.value }))}
                    placeholder="gpt-4o"
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Role Scope</label>
                  <select
                    value={promptForm.role_scope}
                    onChange={e => setPromptForm(prev => ({ ...prev, role_scope: e.target.value }))}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                  >
                    <option value="global">Global (All Users)</option>
                    <option value="super_admin">Super Admin Only</option>
                    <option value="organizer">Organizer Only</option>
                    <option value="attendee">Attendee Only</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Temperature: {promptForm.temperature}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={promptForm.temperature}
                    onChange={e => setPromptForm(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    style={{ width: '100%', accentColor: '#a855f7' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Max Tokens</label>
                  <input
                    type="number"
                    value={promptForm.max_tokens}
                    onChange={e => setPromptForm(prev => ({ ...prev, max_tokens: parseInt(e.target.value) || 2048 }))}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsPromptModalOpen(false)} style={{ flex: 1, background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={savingPrompt} style={{ flex: 1, background: 'linear-gradient(135deg,#a855f7,#ec4899)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer' }}>
                  {savingPrompt ? 'Saving...' : editingPromptId ? 'Update Prompt' : 'Create Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEST / PREVIEW RUN PROMPT MODAL */}
      {testingPromptModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={18} color="#38bdf8" /> Test System Prompt: {testingPromptModal.title}
              </h3>
              <button onClick={() => { setTestingPromptModal(null); setTestResponseOutput(''); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Sample User Input Prompt</label>
              <textarea
                value={testUserInput}
                onChange={e => setTestUserInput(e.target.value)}
                placeholder="e.g. Generate an event announcement for Lagos Tech Week 2026..."
                rows={3}
                style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
              />
            </div>

            <button
              type="button"
              onClick={handleExecuteTestPrompt}
              disabled={executingTestPrompt}
              style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
            >
              <Play size={14} /> {executingTestPrompt ? 'Executing Prompt...' : 'Run Prompt Simulation'}
            </button>

            {testResponseOutput && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>AI Model Output Response</label>
                <div style={{ background: '#090d16', border: '1px solid #334155', borderRadius: '10px', padding: '14px', maxHeight: '200px', overflowY: 'auto' }}>
                  <pre style={{ margin: 0, fontSize: '12px', color: '#34d399', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                    {testResponseOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.action === 'delete_provider' ? 'Delete AI Provider' : 'Delete System Prompt'}
          message={`Are you sure you want to permanently delete "${confirmModal.name}"? This action cannot be undone.`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={executeConfirmAction}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
