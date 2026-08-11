import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Plus, Calendar, DollarSign, MapPin, Tag, ChevronRight, Zap, RefreshCw } from 'lucide-react';

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

interface EventDraft {
  title: string;
  description: string;
  banner_url?: string;
  venue_name?: string;
  address?: string;
  start_date?: string;
  start_time?: string;
  end_date?: string;
  end_time?: string;
  ticket_types?: TicketTier[];
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  eventDraft?: EventDraft | null;
}

interface Props {
  role?: 'organizer' | 'attendee' | 'super_admin';
  onPrefillEvent?: (draft: EventDraft) => void;
}

export function FloatingAiAssistant({ role = 'organizer', onPrefillEvent }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: role === 'organizer'
        ? "👋 Hello! I am your GETVNT Organizer AI Copilot. Ask me to draft a new event, write marketing copy, suggest ticket pricing, or plan event logistics!"
        : "👋 Hi there! I am GETVNT AI Assistant. Ask me anything about upcoming events, ticket purchasing, venues, or platform support!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: role === 'organizer' ? 'organizer' : 'attendee',
        }),
      });

      const data = await res.json();
      const replyText = data.data?.reply || data.message || "I am ready to help you manage your events and tickets!";
      const eventDraft = data.data?.event_draft || null;

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        eventDraft: eventDraft,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: "I experienced a temporary connection hiccup. However, you can generate events, ticket tiers, and flyers directly in your workspace!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const triggerPrefill = (draft: EventDraft) => {
    if (onPrefillEvent) {
      onPrefillEvent(draft);
    } else {
      // Dispatch custom event for Workspace app
      window.dispatchEvent(new CustomEvent('getvnt:prefill_event', { detail: draft }));
      alert(`✨ Event Draft "${draft.title}" generated with ticket pricing and flyer image! Redirecting to Event Creator...`);
    }
    setIsOpen(false);
  };

  const organizerPrompts = [
    "🚀 Draft a Tech Conference Event",
    "🎟️ Suggest Ticket Pricing Strategy",
    "📢 Generate Social Announcement",
    "📍 Recommend Lagos Event Venues"
  ];

  const attendeePrompts = [
    "🔍 Find music concerts this weekend",
    "🎟️ How do I scan my QR ticket?",
    "💡 Recommend events near me"
  ];

  const activePrompts = role === 'organizer' ? organizerPrompts : attendeePrompts;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999999, fontFamily: 'sans-serif' }}>
      
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%)',
            boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4), 0 0 20px rgba(59, 130, 246, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            transition: 'transform 0.2s ease, boxShadow 0.2s ease',
            position: 'relative'
          }}
          title="Open GETVNT AI Assistant"
        >
          <Bot size={28} color="#fff" />
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #0f172a'
            }}
          />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          style={{
            width: '390px',
            height: '580px',
            maxHeight: 'calc(100vh - 40px)',
            background: '#0f172a',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(168, 85, 247, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <Bot size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {role === 'organizer' ? 'Organizer AI Copilot' : 'GETVNT AI Assistant'}
                  <Sparkles size={14} color="#a855f7" />
                </h3>
                <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ● Active Fleet Online
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#1e293b',
                    color: '#fff',
                    fontSize: '13px',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  {msg.text.replace(/\*\*/g, '').replace(/__/g, '')}

                  {/* Render Event Draft Card if generated */}
                  {msg.eventDraft && (
                    <div style={{ marginTop: '12px', background: '#0f172a', border: '1px solid #a855f766', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={12} /> AI Event Draft Ready
                      </div>

                      {msg.eventDraft.banner_url && (
                        <img
                          src={msg.eventDraft.banner_url}
                          alt="Flyer Preview"
                          style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}

                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#fff' }}>{msg.eventDraft.title}</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>{msg.eventDraft.description}</p>

                      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                          <MapPin size={12} color="#a855f7" /> {msg.eventDraft.venue_name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                          <Calendar size={12} color="#3b82f6" /> {msg.eventDraft.start_date} @ {msg.eventDraft.start_time}
                        </div>
                      </div>

                      {/* Ticket Tiers */}
                      {msg.eventDraft.ticket_types && msg.eventDraft.ticket_types.length > 0 && (
                        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>Ticket Pricing Tiers:</span>
                          {msg.eventDraft.ticket_types.map((tier, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#e2e8f0' }}>
                              <span>{tier.name}</span>
                              <span style={{ fontWeight: 800, color: '#34d399' }}>${tier.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => triggerPrefill(msg.eventDraft!)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#fff',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '8px',
                          fontWeight: 900,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          marginTop: '4px'
                        }}
                      >
                        <Plus size={14} /> ✨ Create Event with this AI Draft
                      </button>
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px' }}>
                <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> GETVNT AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div style={{ padding: '8px 16px', background: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {activePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                style={{
                  background: '#1e293b',
                  color: '#c084fc',
                  border: '1px solid #334155',
                  padding: '6px 12px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: '12px 16px', background: '#0f172a', borderTop: '1px solid #1e293b', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={role === 'organizer' ? "Ask AI to draft an event..." : "Ask AI about events & tickets..."}
              style={{
                flex: 1,
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading || !input.trim() ? 0.5 : 1
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
