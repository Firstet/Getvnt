import React, { useState, useEffect } from 'react';
import { Users, Award, Gift, Star, DollarSign, Activity, Check, Plus } from 'lucide-react';

interface Props {
  token: string | null;
  onToast: (msg: string) => void;
}

export const CrmLoyaltyView: React.FC<Props> = ({ token, onToast }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardName, setRewardName] = useState('15% VIP Alumni Discount');
  const [pointsCost, setPointsCost] = useState(500);
  const [discountPercent, setDiscountPercent] = useState(15);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/workspace/crm/profiles', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setProfiles(json.data.profiles || []);
          setSummary(json.data.summary || null);
        }
      })
      .catch(() => {});
  }, [token]);

  const handleCreateReward = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/v1/workspace/crm/rewards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reward_name: rewardName,
          points_cost: pointsCost,
          discount_percent: discountPercent
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowRewardModal(false);
        onToast('Loyalty Reward rule created successfully!');
      }
    } catch {
      onToast('Error creating reward.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>Attendee CRM & Loyalty Rewards Engine</h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Build 360° attendee profiles, track customer lifetime value (LTV), and reward repeat ticket buyers.
          </p>
        </div>
        <button className="btn-cta" style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF' }} onClick={() => setShowRewardModal(true)}>
          <Plus size={16} /> Create Loyalty Reward Rule
        </button>
      </div>

      {/* Telemetry Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>Total CRM Attendees</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#FFF', marginTop: '6px' }}>{summary.total_crm_contacts?.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>Average Lifetime Value (LTV)</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#34D399', marginTop: '6px' }}>₦{summary.average_ltv_ngn?.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>Active Loyalty Members</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#A5B4FC', marginTop: '6px' }}>{summary.active_loyalty_members?.toLocaleString()}</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>Points Issued</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#FCD34D', marginTop: '6px' }}>{summary.total_points_issued?.toLocaleString()} pts</div>
          </div>
        </div>
      )}

      {/* CRM Profiles Table */}
      <div className="card">
        <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="#A5B4FC" /> Attendee 360 Profiles & Purchase History
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#6B7280', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Attendee</th>
                <th style={{ padding: '12px 14px' }}>LTV Tier</th>
                <th style={{ padding: '12px 14px' }}>Events Attended</th>
                <th style={{ padding: '12px 14px' }}>Total Spent</th>
                <th style={{ padding: '12px 14px' }}>Loyalty Points</th>
                <th style={{ padding: '12px 14px' }}>Engagement Rate</th>
                <th style={{ padding: '12px 14px' }}>Interests</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 800, color: '#FFF' }}>{p.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#6B7280' }}>{p.email} • {p.location}</div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ background: p.ltv_tier.includes('VIP') ? 'rgba(245,158,11,0.15)' : 'rgba(79,70,229,0.15)', color: p.ltv_tier.includes('VIP') ? '#FCD34D' : '#A5B4FC', padding: '4px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800 }}>
                      {p.ltv_tier}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 700 }}>{p.events_attended} events</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#34D399' }}>₦{p.total_spent_ngn?.toLocaleString()}</td>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#FCD34D' }}>{p.loyalty_points} pts</td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#06B6D4' }}>{p.engagement_rate}</td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {p.interests?.map((i: string) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', color: '#9CA3AF' }}>
                          {i}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reward Creator Modal */}
      {showRewardModal && (
        <div className="modal-overlay" onClick={() => setShowRewardModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>Create Loyalty Reward Rule</h3>
            <p style={{ color: '#6B7280', fontSize: '13.5px', marginBottom: '20px' }}>
              Set points requirements for automated attendee discount unlocks.
            </p>
            <form onSubmit={handleCreateReward} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Reward Title</label>
                <input type="text" required className="search-field" value={rewardName} onChange={(e) => setRewardName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Points Required to Unlock</label>
                <input type="number" required className="search-field" value={pointsCost} onChange={(e) => setPointsCost(Number(e.target.value))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Discount Percentage (%)</label>
                <input type="number" required className="search-field" value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-cta" style={{ flex: 1, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', justifyContent: 'center' }}>
                  Create Reward Rule
                </button>
                <button type="button" className="btn-cta btn-cta-ghost" onClick={() => setShowRewardModal(false)}>
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
