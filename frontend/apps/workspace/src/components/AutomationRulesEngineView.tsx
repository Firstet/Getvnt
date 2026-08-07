import React, { useState } from 'react';
import {
  Zap, Plus, Trash2, Play, ToggleLeft, ToggleRight, Sparkles,
  Bell, Mail, MessageSquare, Ticket, Award, Users, AlertTriangle,
  ArrowRight, ShieldCheck, CheckCircle2, Clock
} from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  active: boolean;
  times_executed: number;
  last_run: string;
}

export const AutomationRulesEngineView: React.FC<{ onTriggerToast: (msg: string) => void }> = ({ onTriggerToast }) => {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 'rule-1',
      name: 'Smart Sales Drop Discount Campaign',
      trigger: 'When ticket sales drop below 10/day',
      condition: 'Event days remaining > 7',
      action: 'Send 15% discount campaign via Email & SMS',
      active: true,
      times_executed: 14,
      last_run: '2 hours ago'
    },
    {
      id: 'rule-2',
      name: 'VIP Guest Instant Alert',
      trigger: 'When VIP / Executive ticket is purchased',
      condition: 'Ticket category === VIP / Platinum',
      action: 'Push instant SMS notification to organizer mobile',
      active: true,
      times_executed: 38,
      last_run: '18 minutes ago'
    },
    {
      id: 'rule-3',
      name: 'Auto Sell-out Waiting List Generator',
      trigger: 'When event capacity reaches 100%',
      condition: 'Tickets remaining === 0',
      action: 'Generate waiting list form & capture email interest',
      active: true,
      times_executed: 5,
      last_run: '1 day ago'
    },
    {
      id: 'rule-4',
      name: 'Abandoned Checkout Recovery',
      trigger: 'When user leaves checkout without paying',
      condition: 'Time elapsed > 30 minutes',
      action: 'Send automated WhatsApp voucher (10% Off)',
      active: true,
      times_executed: 89,
      last_run: '5 mins ago'
    }
  ]);

  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleTrigger, setRuleTrigger] = useState('When ticket sales drop');
  const [ruleAction, setRuleAction] = useState('Send 10% discount campaign');

  const handleToggle = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
    onTriggerToast('Automation rule status updated.');
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    onTriggerToast('Automation rule deleted.');
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName) return;
    const newR: Rule = {
      id: `rule-${Date.now()}`,
      name: ruleName,
      trigger: ruleTrigger,
      condition: 'Active Event',
      action: ruleAction,
      active: true,
      times_executed: 0,
      last_run: 'Just created'
    };
    setRules([newR, ...rules]);
    setShowNewRuleModal(false);
    setRuleName('');
    onTriggerToast('New AI Automation Rule created!');
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7C3AED, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="#FFF" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: 0 }}>
              AI Automation & Workflow Rules Engine
            </h1>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            Set up automated workflows: auto-send discounts, notify organizers on VIP registration, and trigger waitlists.
          </p>
        </div>

        <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF' }} onClick={() => setShowNewRuleModal(true)}>
          <Plus size={16} /> Create Automation Rule
        </button>
      </div>

      {/* Rules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {rules.map((r) => (
          <div
            key={r.id}
            style={{
              background: 'rgba(13, 17, 32, 0.85)', border: `1px solid ${r.active ? 'rgba(79,70,229,0.3)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '20px', padding: '24px', position: 'relative', backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ fontWeight: 900, fontSize: '16px', color: '#FFF' }}>{r.name}</div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: r.active ? '#34D399' : '#6B7280' }}
                onClick={() => handleToggle(r.id)}
              >
                {r.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#D1D5DB', marginBottom: '18px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#06B6D4', fontWeight: 800 }}>TRIGGER:</span> {r.trigger}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#A78BFA', fontWeight: 800 }}>ACTION:</span> {r.action}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', fontSize: '11.5px', color: '#9CA3AF' }}>
              <div>⚡ Executed <strong style={{ color: '#FFF' }}>{r.times_executed} times</strong> ({r.last_run})</div>
              <button style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }} onClick={() => handleDelete(r.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Rule Modal */}
      {showNewRuleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0D1120', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '16px' }}>Create AI Automation Rule</h2>
            <form onSubmit={handleCreateRule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#9CA3AF', marginBottom: '6px' }}>Rule Name</label>
                <input
                  type="text"
                  required
                  className="search-field"
                  style={{ width: '100%' }}
                  placeholder="e.g. VIP Registration Alert"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#9CA3AF', marginBottom: '6px' }}>Event Trigger</label>
                <select className="search-field" style={{ width: '100%' }} value={ruleTrigger} onChange={(e) => setRuleTrigger(e.target.value)}>
                  <option value="When ticket sales drop">When ticket sales drop below 10/day</option>
                  <option value="When VIP registers">When VIP / Executive registers</option>
                  <option value="When event sells out">When event reaches 100% capacity</option>
                  <option value="When checkout abandoned">When checkout is abandoned</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#9CA3AF', marginBottom: '6px' }}>Action To Execute</label>
                <select className="search-field" style={{ width: '100%' }} value={ruleAction} onChange={(e) => setRuleAction(e.target.value)}>
                  <option value="Send 10% discount campaign">Send automated discount campaign via Email & SMS</option>
                  <option value="Notify organizer via SMS">Notify organizer instantly via mobile SMS</option>
                  <option value="Generate waiting list">Generate waiting list and open queue</option>
                  <option value="Send WhatsApp voucher">Send WhatsApp 10% off voucher code</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-cta" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', color: '#FFF' }} onClick={() => setShowNewRuleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-cta" style={{ flex: 1, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF' }}>
                  Save & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
