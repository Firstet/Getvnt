import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X, Send, Copy, Check, RefreshCw, User } from 'lucide-react';
import { apiClient } from '../api/apiClient';

export type DashboardModuleContext =
  | 'dashboard'
  | 'events'
  | 'ai_assistant'
  | 'orders'
  | 'billing'
  | 'crm'
  | 'marketing'
  | 'ad_studio'
  | 'finance'
  | 'website_builder'
  | 'automation'
  | 'qr_studio'
  | 'ticket_designer'
  | 'platform_dashboard'
  | 'platform_operations'
  | 'platform_providers'
  | 'platform_vault'
  | 'general';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (msg: string) => void;
  moduleContext?: DashboardModuleContext;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AssistantConfig {
  title: string;
  subtitle: string;
  welcome: string;
  quickPrompts: { id: string; label: string; topic: string }[];
}

const MODULE_ASSISTANTS: Record<string, AssistantConfig> = {
  dashboard: {
    title: 'Business Insights AI',
    subtitle: 'Executive growth analytics, ticket velocity & revenue forecasting',
    welcome: 'How can I analyze your executive revenue, ticket sales velocity, or growth metrics today?',
    quickPrompts: [
      { id: 'revenue_forecast', label: 'Revenue Forecast Model', topic: 'Afrobeats & Tech Summit Lagos 2026' },
      { id: 'sales_insights', label: 'Ticket Sales Insights', topic: 'VIP vs General Admission Velocity' },
      { id: 'analytics_explanation', label: 'Plain-English Data Explainer', topic: 'Weekly Sales Velocity Spike' },
    ],
  },
  events: {
    title: 'Event Planning Assistant',
    subtitle: 'Master execution plans, venue logistics, schedules & speaker bios',
    welcome: 'How can I assist with your event execution master plan, venue logistics, or speaker schedules today?',
    quickPrompts: [
      { id: 'event_planning', label: 'Master Event Plan', topic: 'Afrobeats Concert at Eko Hotel' },
      { id: 'event_checklist', label: 'Event Day Checklist', topic: 'Door Staff & Audio Checklist' },
      { id: 'venue_recommendation', label: 'African Venue Recommendations', topic: '5,000 Capacity Concert Venue' },
    ],
  },
  ai_assistant: {
    title: 'Event Planning Assistant',
    subtitle: 'Master execution plans, venue logistics, schedules & speaker bios',
    welcome: 'How can I assist with your event execution master plan, venue logistics, or speaker schedules today?',
    quickPrompts: [
      { id: 'event_planning', label: 'Master Event Plan', topic: 'Afrobeats Concert at Eko Hotel' },
      { id: 'event_checklist', label: 'Event Day Checklist', topic: 'Door Staff & Audio Checklist' },
      { id: 'speaker_bio', label: 'Speaker Profile', topic: 'Keynote Speaker Biography' },
    ],
  },
  orders: {
    title: 'Sales & Commerce Assistant',
    subtitle: 'Dynamic ticket tiering, pricing optimization & payout settings',
    welcome: 'How can I optimize your ticket pricing tiers, discount strategies, or checkout conversion today?',
    quickPrompts: [
      { id: 'ticket_pricing', label: 'Dynamic Ticket Pricing', topic: 'VIP vs General Admission Tiering' },
      { id: 'marketing_copy', label: 'Discount Promo Strategy', topic: 'Early Bird Ticket Launch' },
      { id: 'revenue_forecast', label: 'Revenue Projection', topic: 'Capacity & Pricing Model' },
    ],
  },
  billing: {
    title: 'Sales & Commerce Assistant',
    subtitle: 'Dynamic ticket tiering, pricing optimization & payout settings',
    welcome: 'How can I optimize your ticket pricing tiers, discount strategies, or checkout conversion today?',
    quickPrompts: [
      { id: 'ticket_pricing', label: 'Dynamic Ticket Pricing', topic: 'VIP vs General Admission Tiering' },
      { id: 'budget_planning', label: 'Subscription Plan ROI', topic: 'Professional vs Enterprise Plan' },
    ],
  },
  crm: {
    title: 'Customer Success Assistant',
    subtitle: 'Attendee engagement, VIP loyalty rewards & support inquiries',
    welcome: 'How can I assist with attendee retention, VIP customer replies, or loyalty rewards today?',
    quickPrompts: [
      { id: 'customer_reply', label: 'Support & Inquiry Reply', topic: 'QR Ticket Entry Assistance' },
      { id: 'faqs', label: 'Attendee FAQ Generator', topic: 'Refund & Gate Policy' },
    ],
  },
  marketing: {
    title: 'Campaign & Growth Assistant',
    subtitle: 'High-converting ad copy, email blasts, SMS campaigns & social media',
    welcome: 'What marketing campaign, ad copy, or email blast would you like to draft today?',
    quickPrompts: [
      { id: 'marketing_copy', label: 'Social Media Ad Copy', topic: 'Early Bird Ticket Drop Launch' },
      { id: 'email_campaign', label: 'Email Campaign Sequence', topic: 'VIP Ticket Announcement' },
      { id: 'sms_campaign', label: 'SMS Blast Copy', topic: 'Last Chance Ticket Alert' },
    ],
  },
  ad_studio: {
    title: 'Campaign & Growth Assistant',
    subtitle: 'High-converting ad copy, email blasts, SMS campaigns & social media',
    welcome: 'What marketing campaign, ad copy, or email blast would you like to draft today?',
    quickPrompts: [
      { id: 'marketing_copy', label: 'Social Media Ad Copy', topic: 'Early Bird Ticket Drop Launch' },
      { id: 'social_post', label: 'Instagram Captions', topic: 'Live Concert Announcement' },
    ],
  },
  finance: {
    title: 'Financial Analyst AI',
    subtitle: 'Event budget allocation, profit margins & payout schedules',
    welcome: 'How can I help structure your event financial budget or profit margins today?',
    quickPrompts: [
      { id: 'budget_planning', label: 'Financial Budget Plan', topic: '2,500 Capacity Concert at Eko Hotel' },
      { id: 'sponsorship_proposal', label: 'Sponsorship Pitch Deck', topic: 'Title & Gold Sponsor Tiers' },
      { id: 'revenue_forecast', label: 'Profit Margin Analysis', topic: 'Target Ticket Revenue Model' },
    ],
  },
  website_builder: {
    title: 'Content & SEO Assistant',
    subtitle: 'Landing page headlines, event descriptions & SEO metadata',
    welcome: 'What landing page content, SEO titles, or event descriptions would you like to generate today?',
    quickPrompts: [
      { id: 'landing_page', label: 'Landing Page Content', topic: 'Afrobeats & Tech Summit Lagos 2026' },
      { id: 'event_description', label: 'High-Converting Description', topic: 'Official Event Summary' },
      { id: 'press_release', label: 'Press Release Document', topic: 'Official Media Announcement' },
    ],
  },
  automation: {
    title: 'Automation Engine Assistant',
    subtitle: 'Workflow rules, automated trigger actions & notifications',
    welcome: 'How can I help configure your automated event workflow rules or door scanner alerts today?',
    quickPrompts: [
      { id: 'event_checklist', label: 'Event Day Master Checklist', topic: 'Gate Check-in & Audio Verification' },
      { id: 'risk_detection', label: 'Risk Detection & Mitigation', topic: 'Sales Velocity Drop Alert' },
    ],
  },
  qr_studio: {
    title: 'Ticket & Access Operations Assistant',
    subtitle: 'Digital ticket pass design, QR security & gate entrance workflows',
    welcome: 'How can I help customize your ticket pass layouts, QR security watermarks, or door scanner operations today?',
    quickPrompts: [
      { id: 'event_checklist', label: 'Door Scanner Security Checklist', topic: 'Fast-Track Entry Rules' },
      { id: 'faqs', label: 'Ticket Transfer Rules FAQ', topic: 'Mobile Wallet Digital QR Pass' },
    ],
  },
  ticket_designer: {
    title: 'Ticket & Access Operations Assistant',
    subtitle: 'Digital ticket pass design, QR security & gate entrance workflows',
    welcome: 'How can I help customize your ticket pass layouts, QR security watermarks, or door scanner operations today?',
    quickPrompts: [
      { id: 'ticket_pricing', label: 'Ticket Tier Structure', topic: 'VIP vs General Pass Badges' },
      { id: 'sponsorship_proposal', label: 'Sponsor QR Logo Placement', topic: 'Digital Ticket Sponsor Banner' },
    ],
  },
  platform_dashboard: {
    title: 'Platform Operations Assistant',
    subtitle: 'Multi-tenant governance, system health telemetry & fraud detection',
    welcome: 'How can I assist with platform infrastructure monitoring, tenant isolation audit, or system health today?',
    quickPrompts: [
      { id: 'analytics_explanation', label: 'System Health Telemetry', topic: 'Platform Uptime & API Latency' },
      { id: 'risk_detection', label: 'Multi-Tenant Audit Summary', topic: 'Global Database Query Isolation' },
    ],
  },
  platform_operations: {
    title: 'Platform Operations Assistant',
    subtitle: 'Multi-tenant governance, system health telemetry & fraud detection',
    welcome: 'How can I assist with platform infrastructure monitoring, tenant isolation audit, or system health today?',
    quickPrompts: [
      { id: 'risk_detection', label: 'Platform Risk Detection', topic: 'Incident Response & Gateway Status' },
      { id: 'customer_reply', label: 'Super Admin Support Dispatch', topic: 'Organizer Account Access Inquiry' },
    ],
  },
  platform_providers: {
    title: 'AI Fleet & Vault Operations Specialist',
    subtitle: 'OpenAI-compatible model routing, token cost optimization & secret vault audit',
    welcome: 'How can I assist with AI provider fleet routing, model latency, or API vault credentials today?',
    quickPrompts: [
      { id: 'analytics_explanation', label: 'AI Fleet Token Spend', topic: 'Monthly Token Usage & Budget' },
      { id: 'risk_detection', label: 'OpenAI Model Routing Check', topic: 'Fallback Provider Health' },
    ],
  },
  platform_vault: {
    title: 'AI Fleet & Vault Operations Specialist',
    subtitle: 'OpenAI-compatible model routing, token cost optimization & secret vault audit',
    welcome: 'How can I assist with AI provider fleet routing, model latency, or API vault credentials today?',
    quickPrompts: [
      { id: 'analytics_explanation', label: 'Security Vault Audit', topic: 'AES-256 Key Encryption Check' },
    ],
  },
  general: {
    title: 'GETVNT Business AI',
    subtitle: 'Events, ticketing, marketing, payments, CRM & business operations',
    welcome: 'How can I help you with your events, ticketing, marketing, or operations today?',
    quickPrompts: [
      { id: 'event_planning', label: 'Master Event Plan', topic: 'Afrobeats & Tech Summit Lagos 2026' },
      { id: 'marketing_copy', label: 'Social Media Ad Copy', topic: 'Early Bird Ticket Drop Launch' },
      { id: 'budget_planning', label: 'Financial Budget Plan', topic: '2,500 Capacity Concert at Eko Hotel' },
    ],
  },
};

export const GeneralAiAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onToast,
  moduleContext = 'general',
}) => {
  const config = MODULE_ASSISTANTS[moduleContext] || MODULE_ASSISTANTS.general;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState(config.quickPrompts[0]?.id || 'event_planning');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'ai',
          text: config.welcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setSelectedTool(config.quickPrompts[0]?.id || 'event_planning');
    }
  }, [isOpen, moduleContext]);

  const handleSend = async (queryText?: string, promptTypeOverride?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isGenerating) return;

    const userMsgId = 'msg-' + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    try {
      const type = promptTypeOverride || selectedTool;
      const res = await apiClient.post('/workspace/ai/generate', {
        prompt_type: type,
        topic: query,
        context: { module: moduleContext },
      });

      if (res.success && res.data?.output) {
        const aiMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: res.data.output,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const fallbackMsg: ChatMessage = {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: 'Unable to complete request right now. Please check your connection and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      if (onToast) onToast('AI assistant connection failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onToast) onToast('Copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(6, 9, 19, 0.75)',
        backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #0D1222 0%, #060913 100%)',
          border: '1px solid rgba(37, 99, 235, 0.4)', borderRadius: '28px',
          width: '100%', maxWidth: '720px', height: '620px', display: 'flex',
          flexDirection: 'column', boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
          overflow: 'hidden', position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px', background: 'rgba(13, 18, 34, 0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
            }}>
              <Bot size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {config.title} <Sparkles size={15} color="#60A5FA" />
              </div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700 }}>
                {config.subtitle}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#9CA3AF', borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Tools Scroll Bar */}
        <div style={{
          padding: '10px 20px', background: 'rgba(7, 10, 20, 0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex',
          gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch',
        }}>
          {config.quickPrompts.map((qp) => (
            <button
              key={qp.id}
              onClick={() => {
                setSelectedTool(qp.id);
                handleSend(qp.topic, qp.id);
              }}
              style={{
                padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 800,
                background: selectedTool === qp.id ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'rgba(255,255,255,0.04)',
                border: selectedTool === qp.id ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.08)',
                color: selectedTool === qp.id ? '#FFF' : '#D1D5DB', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Stream */}
        <div style={{
          flex: 1, padding: '20px', overflowY: 'auto', display: 'flex',
          flexDirection: 'column', gap: '16px', background: '#060913',
        }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex', gap: '12px',
                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: m.sender === 'user' ? 'rgba(37,99,235,0.2)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
                border: m.sender === 'user' ? '1px solid #2563EB' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
              }}>
                {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div style={{
                maxWidth: '82%', background: m.sender === 'user' ? 'rgba(37,99,235,0.25)' : 'rgba(13, 18, 34, 0.95)',
                border: m.sender === 'user' ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '14px 18px', color: '#F9FAFB', fontSize: '13.5px',
                lineHeight: '1.6', position: 'relative', boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '10px', color: '#9CA3AF',
                }}>
                  <span>{m.timestamp}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(m.text, m.id)}
                      style={{
                        background: 'none', border: 'none', color: '#60A5FA',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700,
                      }}
                    >
                      {copiedId === m.id ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
                      {copiedId === m.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
              }}>
                <Bot size={16} />
              </div>
              <div style={{
                background: 'rgba(13, 18, 34, 0.95)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '12px 18px', color: '#9CA3AF', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <RefreshCw size={15} className="spin-slow" /> Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Controls Footer */}
        <div style={{
          padding: '16px 20px', background: 'rgba(13, 18, 34, 0.95)',
          borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px', alignItems: 'center',
        }}>
          <input
            type="text"
            className="search-field"
            placeholder={`Ask ${config.title} anything...`}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            style={{ flex: 1, paddingLeft: '18px', background: 'rgba(6, 9, 19, 0.8)', border: '1px solid rgba(255,255,255,0.12)' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={isGenerating || !inputQuery.trim()}
            className="btn-cta"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#FFF',
              padding: '12px 20px', fontSize: '13px', border: 'none', borderRadius: '99px',
            }}
          >
            Send <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
