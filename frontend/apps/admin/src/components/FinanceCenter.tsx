import React from 'react';
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';

interface Props { financeData: any; payouts: any[]; token: string; onRefresh: () => void; }

const StatCard = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <div style={{ fontSize: '30px', fontWeight: 900, margin: '8px 0 0', color: color || '#fff' }}>{value}</div>
  </div>
);

export function FinanceCenter({ financeData, payouts, token, onRefresh }: Props) {
  const handleDisbursePayout = async (id: string) => {
    if (!confirm('Approve and disburse this payout to the organizer?')) return;
    const res = await fetch(`/api/v1/admin/payouts/${id}/disburse`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) { alert('Payout disbursed successfully!'); onRefresh(); }
    else alert(data.message || 'Disbursement failed.');
  };

  const f = financeData || {};
  const cell = { padding: '14px 18px' };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 24px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <DollarSign size={22} color="#c084fc" /> Finance Center
      </h2>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Platform Revenue Today" value={`$${parseFloat(f.revenue_today ?? 0).toLocaleString()}`} color="#fbbf24" />
        <StatCard label="Platform Revenue (Month)" value={`$${parseFloat(f.revenue_month ?? 0).toLocaleString()}`} color="#34d399" />
        <StatCard label="Total Transactions" value={f.total_transactions ?? 0} />
        <StatCard label="Pending Payouts" value={`$${parseFloat(f.pending_payouts ?? 0).toLocaleString()}`} color="#f87171" />
      </div>

      {/* Payout Requests */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>Pending Payout Requests</h3>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden', marginBottom: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
              {['Organizer', 'Amount', 'Bank Account', 'Requested', 'Status', 'Action'].map(h => (
                <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payouts.length === 0 && (
              <tr><td colSpan={6} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '36px' }}>No payout requests yet.</td></tr>
            )}
            {payouts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={cell}>
                  <div style={{ fontWeight: 800, color: '#fff' }}>{p.organizer_name || p.organizer?.name || 'Unknown'}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{p.organizer_email || ''}</div>
                </td>
                <td style={{ ...cell, color: '#34d399', fontWeight: 900 }}>${parseFloat(p.amount ?? 0).toLocaleString()}</td>
                <td style={{ ...cell, color: '#cbd5e1', fontSize: '12px' }}>
                  {p.bank_name} — {p.account_number}
                </td>
                <td style={{ ...cell, color: '#94a3b8', fontSize: '12px' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                <td style={cell}>
                  <span style={{ background: p.status === 'pending' ? '#78350f' : '#052e16', color: p.status === 'pending' ? '#fbbf24' : '#34d399', padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
                    {(p.status ?? 'pending').toUpperCase()}
                  </span>
                </td>
                <td style={cell}>
                  {p.status === 'pending' && (
                    <button onClick={() => handleDisbursePayout(p.id)} style={{ background: '#059669', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}>
                      Disburse
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
