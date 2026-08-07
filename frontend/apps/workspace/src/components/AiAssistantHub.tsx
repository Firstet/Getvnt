import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Bot, Send, X, Maximize2, Minimize2, Sidebar, Smartphone,
  RefreshCw, MessageSquare, ChevronDown, Rocket, Ticket, Globe, Megaphone,
  DollarSign, FileText, CheckCircle2, Copy, Check, User
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

interface Props {
  currentModule?: string;
  onNavigateToTab?: (tab: string) => void;
  onToast?: (msg: string) => void;
}

export const AiAssistantHub: React.FC<Props> = ({
  currentModule = 'dashboard',
  onNavigateToTab,
  onToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'expandable' | 'sidebar' | 'fullscreen' | 'mobile_sheet'>('expandable');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Context-Aware Messages & History Persistence
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('getvnt_organizer_ai_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: `Hello! I am your GETVNT AI Workspace Assistant. I am here to help you launch events, set up tickets, and scale sales.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: [
          { label: '🚀 Create Event', action: 'create_event' },
          { label: '🎟️ Create Ticket Tier', action: 'create_ticket' },
          { label: '🌐 Build Website', action: 'build_website' },
          { label: '📣 Marketing Copy', action: 'generate_marketing' },
        ]
      }
    ];
  });

  // Save history on change
  useEffect(() => {
    localStorage.setItem('getvnt_organizer_ai_chat_history', JSON.stringify(messages.slice(-30)));
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Knowledge Base Responses per Module / Prompt Context
  const generateAiReply = (userText: string): { responseText: string; actions?: { label: string; action: string }[] } => {
    const q = userText.toLowerCase();

    if (q.includes('ticket') || q.includes('pass') || q.includes('price')) {
      return {
        responseText: `To configure ticket tiers on GETVNT:\n\n1. Go to the **Tickets** module.\n2. Click **Create Ticket Tier**.\n3. Choose ticket type (General Admission, VIP Pass, Early-Bird, or VVIP Table).\n4. Set stock limits and currency (NGN, USD, KES, GBP).\n5. QR anti-counterfeit codes generate automatically upon checkout!`,
        actions: [
          { label: '🎟️ Go to Ticket Desk', action: 'tickets' },
          { label: '🎨 Open Ticket Designer', action: 'ticket_designer' },
        ]
      };
    }

    if (q.includes('website') || q.includes('template') || q.includes('landing')) {
      return {
        responseText: `GETVNT offers 10 professionally designed Event Website templates (Festivals, Conferences, VIP Galas, Sports, Weddings). You can customize heroes, colors, speaker agendas, and publish custom domains seamlessly.`,
        actions: [
          { label: '🌐 Open Website Builder', action: 'website_builder' },
          { label: '🚀 Publish Website', action: 'publish_site' },
        ]
      };
    }

    if (q.includes('checkin') || q.includes('check-in') || q.includes('qr') || q.includes('door')) {
      return {
        responseText: `QR Gate Check-in allows door staff to scan tickets in under 200ms using any smartphone browser or the GETVNT Scanner App. Scanning works both online and offline with encrypted payload hashing.`,
        actions: [
          { label: '🛡️ Open QR Gate Studio', action: 'qr_studio' },
        ]
      };
    }

    if (q.includes('marketing') || q.includes('promo') || q.includes('ad') || q.includes('email')) {
      return {
        responseText: `Boost event velocity with GETVNT Marketing Engine:\n• Generate social media promo copy\n• Launch UTM referral tracking links\n• Send email newsletters to past attendees\n• Issue 10% discount promo codes`,
        actions: [
          { label: '📣 Open Marketing Center', action: 'marketing' },
          { label: '🎟️ Create Promo Code', action: 'create_promo' },
        ]
      };
    }

    if (q.includes('report') || q.includes('finance') || q.includes('payout') || q.includes('settle')) {
      return {
        responseText: `GETVNT automatically calculates your gross ticket sales, platform booking fees, and pending balances. Bank settlements transfer automatically to your registered bank account according to your payout schedule.`,
        actions: [
          { label: '💵 Open Finance & Payouts', action: 'finance' },
          { label: '📊 View Sales Analytics', action: 'analytics' },
        ]
      };
    }

    // Default module-aware response
    return {
      responseText: `Based on your request regarding **${currentModule.toUpperCase()}**, GETVNT provides automated tools to assist you. Would you like me to generate copy, configure settings, or navigate to a specific workspace module?`,
      actions: [
        { label: '🚀 Create Event', action: 'create_event' },
        { label: '🎟️ Create Ticket Tier', action: 'create_ticket' },
        { label: '🌐 Website Builder', action: 'website_builder' },
        { label: '📊 View Reports', action: 'analytics' },
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt) return;

    const userMsg: Message = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      const replyData = generateAiReply(prompt);
      const assistantMsg: Message = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'assistant',
        text: replyData.responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: replyData.actions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickAction = (actionKey: string) => {
    const tabMap: Record<string, string> = {
      create_event: 'events',
      create_ticket: 'tickets',
      tickets: 'tickets',
      ticket_designer: 'ticket_designer',
      build_website: 'website_builder',
      website_builder: 'website_builder',
      generate_marketing: 'marketing',
      marketing: 'marketing',
      qr_studio: 'qr_studio',
      finance: 'finance',
      analytics: 'analytics',
    };

    const targetTab = tabMap[actionKey];
    if (targetTab && onNavigateToTab) {
      onNavigateToTab(targetTab);
      if (onToast) onToast(`Navigated to ${targetTab.toUpperCase()} module`);
    } else if (onToast) {
      onToast(`Action "${actionKey}" executed!`);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onToast) onToast('Copied AI response to clipboard!');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('getvnt_organizer_ai_chat_history');
    setMessages([
      {
        id: 'msg_welcome_' + Date.now(),
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist your event operations today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    if (onToast) onToast('AI Chat History reset.');
  };

  return (
    <>
      {/* ── 1. FLOATING AI ASSISTANT BUTTON ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 900,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#FFF', padding: '14px 22px', borderRadius: '99px',
            boxShadow: '0 12px 30px rgba(37,99,235,0.5)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease'
          }}
        >
          <Sparkles size={20} className="animate-pulse" />
          <span style={{ fontSize: '13.5px', fontWeight: 900, letterSpacing: '0.3px' }}>GETVNT AI Assistant</span>
        </button>
      )}

      {/* ── 2. AI ASSISTANT CHAT CONTAINER ── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed', zIndex: 999,
            ...(viewMode === 'fullscreen'
              ? { inset: '20px', borderRadius: '24px' }
              : viewMode === 'sidebar'
              ? { top: 0, right: 0, bottom: 0, width: '420px', borderRadius: '0' }
              : viewMode === 'mobile_sheet'
              ? { bottom: 0, left: 0, right: 0, height: '75vh', borderRadius: '24px 24px 0 0' }
              : { bottom: '24px', right: '24px', width: '440px', height: '620px', borderRadius: '24px' }),
            background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)',
            border: '1px solid rgba(56,189,248,0.3)', boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', color: '#FFF',
            transition: 'all 0.3s ease'
          }}
        >

          {/* Header Bar */}
          <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#FFF" />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#FFF' }}>GETVNT AI Assistant</h3>
                <div style={{ fontSize: '11px', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                  Module Context: {currentModule.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Layout Controls Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button title="Dock Sidebar" onClick={() => setViewMode(viewMode === 'sidebar' ? 'expandable' : 'sidebar')} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}>
                <Sidebar size={16} />
              </button>
              <button title="Toggle Fullscreen" onClick={() => setViewMode(viewMode === 'fullscreen' ? 'expandable' : 'fullscreen')} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}>
                {viewMode === 'fullscreen' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button title="Clear History" onClick={handleClearHistory} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}>
                <RefreshCw size={15} />
              </button>
              <button title="Close Chat" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Pills Bar */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {[
              { label: '🚀 Create Event', key: 'create_event' },
              { label: '🎟️ Create Ticket', key: 'create_ticket' },
              { label: '🌐 Website Builder', key: 'website_builder' },
              { label: '📣 Marketing Copy', key: 'marketing' },
              { label: '📊 View Reports', key: 'analytics' },
            ].map((b) => (
              <button
                key={b.key}
                onClick={() => handleQuickAction(b.key)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#D1D5DB', padding: '4px 12px', borderRadius: '99px', fontSize: '11.5px',
                  fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '11px', color: '#9CA3AF' }}>
                  {m.sender === 'user' ? (
                    <><span>You</span> <User size={12} /></>
                  ) : (
                    <><Bot size={12} color="#38BDF8" /> <span>GETVNT AI</span></>
                  )}
                  <span>• {m.timestamp}</span>
                </div>

                <div
                  style={{
                    maxWidth: '85%', padding: '14px 16px', borderRadius: '16px',
                    fontSize: '13.5px', lineHeight: '1.6', whiteSpace: 'pre-wrap',
                    background: m.sender === 'user' ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'rgba(255,255,255,0.04)',
                    border: m.sender === 'user' ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.08)',
                    color: '#FFF', position: 'relative'
                  }}
                >
                  {m.text}

                  {m.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopyText(m.id, m.text)}
                      style={{ position: 'absolute', right: '8px', top: '8px', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                      title="Copy response"
                    >
                      {copiedId === m.id ? <Check size={13} color="#34D399" /> : <Copy size={13} />}
                    </button>
                  )}
                </div>

                {/* Embedded Action Buttons */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {m.quickActions.map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(qa.action)}
                        style={{
                          background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))',
                          border: '1px solid rgba(37,99,235,0.4)', color: '#60A5FA',
                          padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 800,
                          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '12px' }}>
                <Bot size={14} color="#38BDF8" className="animate-spin" />
                <span>AI is thinking &amp; drafting response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              className="search-field"
              placeholder={`Ask AI about ${currentModule.toUpperCase()} or event operations...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              style={{ flex: 1, fontSize: '13.5px' }}
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim()}
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#FFF', padding: '10px 18px', borderRadius: '12px' }}
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
