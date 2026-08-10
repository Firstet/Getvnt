import React from 'react';
import { FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props { ledgerEntries: any[]; }

export function DoubleEntryLedger({ ledgerEntries }: Props) {
  const cell = { padding: '14px 18px' };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={22} color="#c084fc" /> Double Entry Ledger
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px' }}>
        Every financial transaction recorded as debit and credit pairs. Immutable audit trail.
      </p>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
              {['Date', 'Reference', 'Account', 'Debit', 'Credit', 'Balance', 'Type'].map(h => (
                <th key={h} style={{ ...cell, fontWeight: 700, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.length === 0 && (
              <tr><td colSpan={7} style={{ ...cell, textAlign: 'center', color: '#64748b', padding: '40px' }}>
                No ledger entries yet. Entries appear as ticket sales and payouts are processed.
              </td></tr>
            )}
            {ledgerEntries.map((entry, i) => (
              <tr key={entry.id ?? i} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ ...cell, color: '#94a3b8', fontSize: '12px' }}>{entry.created_at ? new Date(entry.created_at).toLocaleDateString() : '—'}</td>
                <td style={{ ...cell, color: '#c084fc', fontSize: '12px', fontFamily: 'monospace' }}>{entry.reference || entry.transaction_ref || '—'}</td>
                <td style={{ ...cell, color: '#fff', fontWeight: 700 }}>{entry.account_name || entry.description || '—'}</td>
                <td style={{ ...cell, color: '#f87171', fontWeight: 800 }}>
                  {parseFloat(entry.debit ?? 0) > 0 ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowDownRight size={13} /> ${parseFloat(entry.debit).toLocaleString()}
                    </span>
                  ) : '—'}
                </td>
                <td style={{ ...cell, color: '#34d399', fontWeight: 800 }}>
                  {parseFloat(entry.credit ?? 0) > 0 ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ArrowUpRight size={13} /> ${parseFloat(entry.credit).toLocaleString()}
                    </span>
                  ) : '—'}
                </td>
                <td style={{ ...cell, color: '#fbbf24', fontWeight: 900 }}>${parseFloat(entry.balance ?? 0).toLocaleString()}</td>
                <td style={cell}>
                  <span style={{ background: '#1e293b', color: '#cbd5e1', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                    {(entry.type || entry.entry_type || 'transaction').toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
