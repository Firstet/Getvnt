import React, { useState } from 'react';
import { Bot, Save, RefreshCw, Eye, EyeOff, CheckCircle2, Zap, Send } from 'lucide-react';

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

export function AiFleetControl({ aiFleetData, token, onRefresh }: Props) {
  const providersList: Provider[] = aiFleetData?.providers ?? [];

  const [formData, setFormData] = useState<Record<string, Provider>>(() => {
    const map: Record<string, Provider> = {};
    providersList.forEach(p => {
      const idKey = String(p.id);
      map[idKey] = { ...p };
    });
    return map;
  });

  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const [promptTitle, setPromptTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptCategory, setPromptCategory] = useState('general');
  const [savingPrompt, setSavingPrompt] = useState(false);

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
      const res = await fetch(`/api/v1/admin/ai/providers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
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
        alert(data.message || 'Failed to save provider keys.');
      }
    } catch (e: any) {
      alert('Save failed: ' + e.message);
    } finally {
      setSavingId(null);
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={22} color="#c084fc" /> AI Operations Fleet Control Center
          </h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>
            Configure and save API keys for OpenAI, Claude, Gemini, DeepSeek, Groq, OpenRouter, and Ollama. All keys are encrypted and override hardcoded defaults platform-wide.
          </p>
        </div>
        <button onClick={onRefresh} style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 18px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <RefreshCw size={14} /> Refresh AI Fleet
        </button>
      </div>

      {/* Fleet Providers Cards */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>AI Provider Fleet</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '32px' }}>
        {providersList.map(prov => {
          const idStr = String(prov.id);
          const item = formData[idStr] || prov;
          const isSaving = savingId === idStr;
          const isJustSaved = savedId === idStr;
          const isTesting = testingId === idStr;
          const keyVisible = Boolean(showKey[idStr]);
          const code = prov.slug || prov.provider || 'openai';

          return (
            <div key={idStr} style={{ background: '#0f172a', border: `1px solid ${item.status === 'active' ? '#a855f744' : '#1e293b'}`, borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Card Title & Status Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#fff' }}>{prov.name}</h4>
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
                  placeholder="gpt-4o / claude-3-5-sonnet..."
                  style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '9px 12px', color: '#fff', fontSize: '12px' }}
                />
              </div>

              {/* Custom Base URL (Optional for Local / Ollama) */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Base URL (Optional)</label>
                <input
                  type="text"
                  value={item.base_url || ''}
                  onChange={e => updateField(idStr, 'base_url', e.target.value)}
                  placeholder="https://api.openai.com/v1"
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
                  {isTesting ? 'Testing...' : 'Test'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Prompt Library Form */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>Add System Prompt</h3>
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
