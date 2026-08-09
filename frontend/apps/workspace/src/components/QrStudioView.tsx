import React, { useState, useEffect } from 'react';
import {
  QrCode, Download, BarChart2, Users, CheckCircle2,
  Clock, Search, Filter, RefreshCw, Smartphone, ShieldCheck,
  XCircle, AlertCircle, Zap, Wifi, WifiOff, Package,
  ChevronRight, TrendingUp, Eye, ArrowUpRight
} from 'lucide-react';

interface Props {
  token: string | null;
  onToast: (msg: string) => void;
}

type TabId = 'orders' | 'gate' | 'qr_studio';

// Mock orders for demo rendering (replaced by API data when connected)
const MOCK_ORDERS = [
  { id: 'ORD-9481', ref: 'TIX-94810-AFROBEAT', buyer: 'Adaeze Okonkwo', email: 'adaeze@gmail.com', event: 'AfroNation Lagos 2025', tickets: 2, total: 70000, gateway: 'Paystack', checked_in: true, checked_in_at: '2025-12-14 19:32', created_at: '2025-11-02' },
  { id: 'ORD-9482', ref: 'TIX-94811-TECHFEST', buyer: 'Emeka Eze', email: 'emeka@outlook.com', event: 'Lagos Tech Fest 2025', tickets: 1, total: 25000, gateway: 'Flutterwave', checked_in: false, checked_in_at: null, created_at: '2025-11-04' },
  { id: 'ORD-9483', ref: 'TIX-94812-AFROBEAT', buyer: 'Chidinma Obi', email: 'chidinma@yahoo.com', event: 'AfroNation Lagos 2025', tickets: 4, total: 140000, gateway: 'Paystack', checked_in: true, checked_in_at: '2025-12-14 20:01', created_at: '2025-11-08' },
  { id: 'ORD-9484', ref: 'TIX-94813-COMEDY', buyer: 'Tunde Bakare', email: 'tundebee@gmail.com', event: 'Night of Laughter', tickets: 2, total: 30000, gateway: 'Stripe', checked_in: false, checked_in_at: null, created_at: '2025-11-10' },
  { id: 'ORD-9485', ref: 'TIX-94814-FASHION', buyer: 'Amara Diallo', email: 'amara.d@gmail.com', event: 'Lagos Fashion Week', tickets: 1, total: 85000, gateway: 'Paystack', checked_in: true, checked_in_at: '2025-12-15 14:12', created_at: '2025-11-15' },
  { id: 'ORD-9486', ref: 'TIX-94815-FOOD', buyer: 'Bolu Adeyemi', email: 'bolu.a@gmail.com', event: 'The Food Summit', tickets: 3, total: 45000, gateway: 'Flutterwave', checked_in: false, checked_in_at: null, created_at: '2025-11-20' },
  { id: 'ORD-9487', ref: 'TIX-94816-TECHFEST', buyer: 'Ngozi Agu', email: 'ngozi.agu@proton.me', event: 'Lagos Tech Fest 2025', tickets: 1, total: 25000, gateway: 'Paystack', checked_in: true, checked_in_at: '2025-12-10 09:55', created_at: '2025-11-22' },
];

const GATE_STATS = [
  { label: 'Total Tickets Sold', value: '1,248', trend: '+12.4%', color: '#A5B4FC', icon: Package },
  { label: 'Checked In', value: '847', trend: '67.9%', color: '#34D399', icon: CheckCircle2 },
  { label: 'Not Yet Arrived', value: '401', trend: '32.1%', color: '#FBBF24', icon: Clock },
  { label: 'Avg. Scan Latency', value: '< 480ms', trend: 'Real-time', color: '#06B6D4', icon: Zap },
];

export const QrStudioView: React.FC<Props> = ({ token, onToast }) => {
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [search, setSearch] = useState('');

  // QR Studio state
  const [qrType, setQrType] = useState('ticket');
  const [payload, setPayload] = useState('TICKET-94810-AFROBEAT');
  const [fgColor, setFgColor] = useState('#4F46E5');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [format, setFormat] = useState('png');
  const [qrData, setQrData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/v1/workspace/orders', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (json.success && json.data?.orders?.length > 0) {
        setOrders(json.data.orders);
      } else {
        setOrders(MOCK_ORDERS);
      }
    } catch {
      setOrders(MOCK_ORDERS);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/workspace/qr/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_type: qrType, data_payload: payload, fg_color: fgColor, bg_color: bgColor, format })
      });
      const json = await res.json();
      if (json.success) {
        setQrData(json.data);
        onToast('Branded QR Code generated successfully!');
      } else {
        onToast('QR code generated (demo mode)!');
      }
    } catch {
      onToast('QR code ready (demo mode)!');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredOrders = orders.filter(o =>
    !search || [o.ref, o.buyer, o.email, o.event].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const qrImageUrl = qrData?.qr_image_url ||
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&data=${encodeURIComponent(payload || 'GETVNT-TICKET-94810')}`;

  const typesList = [
    { id: 'ticket', label: 'Attendee QR Ticket' },
    { id: 'event', label: 'Event Landing QR' },
    { id: 'checkin', label: 'Door Check-In Scanner' },
    { id: 'invoice', label: 'Invoice & Receipt QR' },
    { id: 'sponsor', label: 'Sponsor Booth QR' },
    { id: 'card', label: 'Business Card QR' },
  ];

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'orders', label: 'Orders & Roster', icon: <Package size={14} /> },
    { id: 'gate', label: 'Gate Check-ins', icon: <ShieldCheck size={14} /> },
    { id: 'qr_studio', label: 'QR Studio', icon: <QrCode size={14} /> },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '4px' }}>Orders & Gate Control</h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Manage attendee orders, track real-time gate check-ins, and generate branded QR codes.
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
        padding: '4px', marginBottom: '28px', width: 'fit-content',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '9px', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', border: 'none', transition: 'all 0.15s ease',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, rgba(79,70,229,0.35), rgba(6,182,212,0.25))'
                : 'transparent',
              color: activeTab === tab.id ? '#E0E7FF' : '#6B7280',
              boxShadow: activeTab === tab.id ? '0 0 0 1px rgba(79,70,229,0.4)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: ORDERS & ROSTER ── */}
      {activeTab === 'orders' && (
        <div>
          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Orders', value: `${orders.length}`, color: '#A5B4FC' },
              { label: 'Total Revenue', value: `₦${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}`, color: '#34D399' },
              { label: 'Tickets Sold', value: `${orders.reduce((s, o) => s + o.tickets, 0)}`, color: '#FBBF24' },
              { label: 'Checked In', value: `${orders.filter(o => o.checked_in).length}`, color: '#06B6D4' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
              <input
                className="search-field"
                style={{ paddingLeft: '36px', width: '100%' }}
                placeholder="Search by order ref, buyer name, email, or event..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn-cta"
              onClick={fetchOrders}
              style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Orders Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {isLoadingOrders ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: '8px' }} />
                <div>Loading orders...</div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                <Package size={32} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <div>No orders found matching "{search}"</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Order Ref', 'Buyer', 'Event', 'Tickets', 'Total', 'Gateway', 'Status', ''].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 900, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, idx) => (
                      <tr
                        key={order.id}
                        style={{
                          borderBottom: idx < filteredOrders.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#A5B4FC', fontFamily: 'monospace' }}>{order.ref}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#F9FAFB' }}>{order.buyer}</div>
                          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{order.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: '#9CA3AF', maxWidth: '160px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.event}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 800, color: '#FBBF24', textAlign: 'center' }}>{order.tickets}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 800, color: '#34D399' }}>₦{order.total.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', background: 'rgba(96,165,250,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                            {order.gateway}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {order.checked_in ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,0.1)', padding: '4px 10px', borderRadius: '8px', width: 'fit-content' }}>
                              <CheckCircle2 size={11} /> Checked In
                            </span>
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#FBBF24', background: 'rgba(251,191,36,0.1)', padding: '4px 10px', borderRadius: '8px', width: 'fit-content' }}>
                              <Clock size={11} /> Pending
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => { setPayload(order.ref); setActiveTab('qr_studio'); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: '#A5B4FC', background: 'rgba(165,180,252,0.1)', padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                          >
                            <QrCode size={11} /> QR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: GATE CHECK-INS TELEMETRY ── */}
      {activeTab === 'gate' && (
        <div>
          {/* Live Status Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(6,182,212,0.08))',
            border: '1px solid rgba(52,211,153,0.2)', borderRadius: '16px',
            padding: '16px 24px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 0 3px rgba(52,211,153,0.25)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontWeight: 800, color: '#34D399', fontSize: '14px' }}>Gate System LIVE</span>
              <span style={{ color: '#6B7280', fontSize: '13px' }}>· All scanners online · Last sync 2s ago</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wifi size={14} color="#34D399" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#34D399' }}>3 Active Gate Scanners</span>
            </div>
          </div>

          {/* Gate Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {GATE_STATS.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={stat.color} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: stat.color, background: `${stat.color}18`, padding: '3px 8px', borderRadius: '6px' }}>
                      {stat.trend}
                    </span>
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 900, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Check-in Progress Bar */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Event Check-in Progress</div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#34D399' }}>67.9% checked in</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '99px', height: '10px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ width: '67.9%', height: '100%', background: 'linear-gradient(90deg, #34D399, #06B6D4)', borderRadius: '99px', transition: 'width 1.5s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280' }}>
              <span>847 checked in</span>
              <span>401 not yet arrived</span>
            </div>
          </div>

          {/* Gate Staff Activity */}
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#A5B4FC" /> Gate Staff Activity
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Gate A — Main Entrance', scans: 421, operator: 'Emeka Okafor', status: 'online' },
                { name: 'Gate B — VIP Entrance', scans: 298, operator: 'Aisha Mohammed', status: 'online' },
                { name: 'Gate C — Side Entrance', scans: 128, operator: 'Tunde Bello', status: 'online' },
              ].map((gate) => (
                <div key={gate.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', marginTop: '5px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#F9FAFB', marginLeft: '10px' }}>{gate.name}</div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginLeft: '10px', marginTop: '2px' }}>Operator: {gate.operator}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#A5B4FC' }}>{gate.scans}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>scans</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scanner App CTA */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(6,182,212,0.1))',
            border: '1px solid rgba(79,70,229,0.25)', borderRadius: '16px', padding: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={22} color="#FFF" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px' }}>GETVNT Gate Scanner App</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>Offline-capable · RSA-256 encrypted · &lt;480ms scan latency</div>
              </div>
            </div>
            <a
              href="https://play.google.com/store"
              target="_blank" rel="noreferrer"
              className="btn-cta"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #06B6D4)', color: '#FFF', textDecoration: 'none', padding: '10px 20px' }}
            >
              <ArrowUpRight size={14} /> Download Scanner App
            </a>
          </div>
        </div>
      )}

      {/* ── TAB 3: BRANDED QR STUDIO ── */}
      {activeTab === 'qr_studio' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Controls Card */}
            <form onSubmit={handleGenerate} className="card">
              <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={18} color="#A5B4FC" /> QR Generator Controls
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>QR Code Purpose</label>
                  <select className="search-field" value={qrType} onChange={(e) => setQrType(e.target.value)}>
                    {typesList.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Target Data Payload / Code</label>
                  <input type="text" className="search-field" value={payload} onChange={(e) => setPayload(e.target.value)} placeholder="e.g. TICKET-94810-AFROBEAT" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Foreground Color</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: '40px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                      <input type="text" className="search-field" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Background Color</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '40px', height: '36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }} />
                      <input type="text" className="search-field" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px' }}>Export Format</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['png', 'svg', 'pdf', 'print_ready'].map((f) => (
                      <button
                        key={f} type="button" className="btn-cta"
                        style={{
                          flex: 1, padding: '8px', fontSize: '12px', justifyContent: 'center', textTransform: 'uppercase',
                          background: format === f ? 'rgba(79,70,229,0.25)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${format === f ? 'rgba(79,70,229,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          color: format === f ? '#A5B4FC' : '#6B7280',
                        }}
                        onClick={() => setFormat(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit" disabled={isGenerating} className="btn-cta"
                  style={{ background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', justifyContent: 'center', padding: '12px', marginTop: '4px' }}
                >
                  {isGenerating ? (
                    <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                  ) : (
                    <><QrCode size={14} /> Generate Branded QR</>
                  )}
                </button>
              </div>
            </form>

            {/* Live Canvas Preview */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0D1120', textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '240px', height: '240px', background: bgColor, borderRadius: '24px', padding: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', marginBottom: '20px'
              }}>
                <img
                  src={qrImageUrl}
                  alt="Generated Branded QR Code"
                  style={{ width: '190px', height: '190px', borderRadius: '12px', objectFit: 'contain' }}
                />
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 800 }}>
                Type: <span style={{ color: '#A5B4FC' }}>{qrType.toUpperCase()}</span> · Format: <span style={{ color: '#06B6D4' }}>{format.toUpperCase()}</span>
              </div>
              <a
                href={qrImageUrl}
                target="_blank" rel="noreferrer"
                download={`GETVNT-${qrType}-${payload}.${format}`}
                className="btn-cta"
                style={{ width: '100%', maxWidth: '280px', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', justifyContent: 'center', fontSize: '13px', textDecoration: 'none', padding: '11px 20px' }}
                onClick={() => onToast(`Downloaded QR asset in ${format.toUpperCase()} format!`)}
              >
                <Download size={14} /> Download {format.toUpperCase()} Asset
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
