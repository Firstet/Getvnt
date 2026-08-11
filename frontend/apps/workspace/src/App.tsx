import React, { useState, useEffect } from 'react';
import { UserSidebar } from './components/UserSidebar';
import { AttendeeDashboardView } from './components/AttendeeDashboardView';
import { BecomeOrganizerWizardModal } from './components/BecomeOrganizerWizardModal';
import { Calendar, ShoppingCart, Wallet, Ticket, Plus, CheckCircle2, QrCode, ArrowUpRight, Sparkles, Globe, Bot } from 'lucide-react';
import { FloatingAiAssistant, GoogleProfileCompletionModal } from '@getvnt/shared';

export function App() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'attendee' | 'trusted_organizer' | 'organizer_pro' | 'super_admin'>('attendee');
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'approved' | 'rejected'>('unverified');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'starter' | 'pro' | 'enterprise'>('starter');
  const [verifiedBadge, setVerifiedBadge] = useState<boolean>(false);

  const [activeView, setActiveView] = useState('home');
  const [isBecomeOrganizerOpen, setIsBecomeOrganizerOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Welcome state — fired on first visit after registration
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const [showGoogleProfileCompletion, setShowGoogleProfileCompletion] = useState(false);

  const [counters, setCounters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);

  // Event Creation Form State & Multi-Tier Builder
  const [eventTitle, setEventTitle] = useState('Afrobeat Festival Lagos 2026');
  const [ticketTiers, setTicketTiers] = useState<Array<{ name: string; price: number; quantity: number }>>([
    { name: 'Early Bird Pass', price: 75, quantity: 200 },
    { name: 'General Admission', price: 120, quantity: 500 },
    { name: 'VIP Fast-Track Pass', price: 250, quantity: 100 },
  ]);
  const [ticketName, setTicketName] = useState('VIP Fast-Track Pass');
  const [ticketPrice, setTicketPrice] = useState('150');
  const [ticketQuantity, setTicketQuantity] = useState('500');

  // Payout Form State
  const [payoutAmount, setPayoutAmount] = useState('500');
  const [bankName, setBankName] = useState('Guaranty Trust Bank');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState('Kwame Osei');

  // Door QR Check-in Code Input
  const [scanQrCode, setScanQrCode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    const handlePrefill = (e: any) => {
      const draft = e.detail;
      if (draft) {
        if (draft.title) setEventTitle(draft.title);
        if (draft.ticket_types && draft.ticket_types.length > 0) {
          setTicketTiers(draft.ticket_types.map((t: any) => ({
            name: t.name,
            price: Number(t.price) || 0,
            quantity: Number(t.quantity || t.quantity_available) || 100
          })));
          setTicketName(draft.ticket_types[0].name);
          setTicketPrice(String(draft.ticket_types[0].price));
        }
        setIsCreateEventOpen(true);
      }
    };
    window.addEventListener('getvnt:prefill_event', handlePrefill);
    return () => window.removeEventListener('getvnt:prefill_event', handlePrefill);
  }, []);

  const getAuthToken = () => {
    // Check URL for oauth_token first (set by Google OAuth callback)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const oauthToken = urlParams.get('oauth_token');
      if (oauthToken && oauthToken !== 'undefined' && oauthToken !== 'null') {
        localStorage.setItem('getvnt_auth_token', oauthToken);
        localStorage.setItem('auth_token', oauthToken);
        urlParams.delete('oauth_token');
        urlParams.delete('oauth_user');
        window.history.replaceState({}, '', window.location.pathname + (urlParams.toString() ? `?${urlParams}` : ''));
        return oauthToken;
      }
    }
    return localStorage.getItem('getvnt_auth_token') ||
           localStorage.getItem('auth_token') ||
           sessionStorage.getItem('getvnt_auth_token') ||
           sessionStorage.getItem('auth_token') ||
           localStorage.getItem('token');
  };

  useEffect(() => {
    // Detect ?is_new=1 from Google OAuth first-time registration
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('is_new') === '1') {
      setShowGoogleProfileCompletion(true);
      urlParams.delete('is_new');
      window.history.replaceState({}, '', window.location.pathname + (urlParams.toString() ? `?${urlParams}` : ''));
    }

    // Detect ?welcome=1 from marketplace registration redirect
    if (urlParams.get('welcome') === '1') {
      const name = decodeURIComponent(urlParams.get('name') || '');
      setWelcomeName(name);
      setWelcomeVisible(true);
      setTimeout(() => setWelcomeVisible(false), 8000);
      urlParams.delete('welcome');
      urlParams.delete('name');
      window.history.replaceState({}, '', window.location.pathname + (urlParams.toString() ? `?${urlParams}` : ''));
    }

    // Detect ?oauth_error from Google OAuth failure
    const oauthError = urlParams.get('oauth_error');
    if (oauthError) {
      console.error('Google OAuth error:', decodeURIComponent(oauthError));
      urlParams.delete('oauth_error');
      window.history.replaceState({}, '', window.location.pathname + (urlParams.toString() ? `?${urlParams}` : ''));
    }

    // getAuthToken() already handles ?oauth_token and persists it
    fetchUserMe();
    fetchCounters();

    // Session Polling every 6 seconds to auto-detect Super Admin KYC approval & trigger instant role refresh
    const interval = setInterval(() => {
      fetchUserMe(true);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const fetchUserMe = async (isBackgroundPoll = false) => {
    const token = getAuthToken();
    if (!token) {
      if (!isBackgroundPoll) setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const u = data.data.user;
        const newRole = data.data.role || 'attendee';
        const newStatus = data.data.verification_status || 'unverified';

        // Check if role transitioned to Organizer or if verification is pending/approved
        const isOrganizerNow = data.data.is_trusted_organizer ||
                               data.data.is_super_admin ||
                               newRole === 'trusted_organizer' ||
                               newRole === 'organizer_pro' ||
                               newStatus === 'approved' ||
                               newStatus === 'pending';

        setUser(u);
        setRole(newRole);
        setVerificationStatus(newStatus);
        setSubscriptionPlan(data.data.subscription_plan || 'starter');
        setVerifiedBadge(data.data.verified_badge || false);

        if (isOrganizerNow) {
          if (activeView === 'home' || activeView === 'tickets' || activeView === 'wishlist') {
            setActiveView('dashboard');
          }
          fetchOrganizerData(token);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!isBackgroundPoll) setLoading(false);
    }
  };

  const fetchCounters = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch('/api/v1/attendee/counters', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCounters(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchOrganizerData = (token: string) => {
    fetch('/api/v1/workspace/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setStats(data.data); })
      .catch(() => {});

    fetch('/api/v1/workspace/events', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setEvents(data.data || []); })
      .catch(() => {});

    fetch('/api/v1/workspace/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setOrders(data.data || []); })
      .catch(() => {});

    fetch('/api/v1/workspace/wallet', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (data.success) { setWallet(data.data.wallet); setPayouts(data.data.payouts || []); } })
      .catch(() => {});
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    try {
      const res = await fetch('/api/v1/workspace/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          title: eventTitle,
          start_date: '2026-11-20 16:00:00',
          ticket_types: ticketTiers,
          ticket_name: ticketTiers[0]?.name || ticketName,
          ticket_price: ticketTiers[0]?.price || parseFloat(ticketPrice),
          ticket_quantity: ticketTiers[0]?.quantity || parseInt(ticketQuantity),
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsCreateEventOpen(false);
        if (token) fetchOrganizerData(token);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    try {
      const res = await fetch('/api/v1/workspace/payouts/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(payoutAmount),
          bank_name: bankName,
          account_number: accountNumber,
          account_name: accountName,
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsPayoutModalOpen(false);
        if (token) fetchOrganizerData(token);
      } else {
        alert(data.message || 'Payout request failed.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyQr = async () => {
    if (!scanQrCode) return;
    const token = getAuthToken();
    try {
      const res = await fetch('/api/v1/workspace/qr/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ ticket_code: scanQrCode })
      });
      const data = await res.json();
      setScanResult(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('getvnt_auth_token');
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('getvnt_auth_token');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    window.location.href = 'https://getvnt.com';
  };

  const isOrganizer = role === 'trusted_organizer' || role === 'super_admin' || verificationStatus === 'approved' || verificationStatus === 'pending';

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090d16', color: '#60a5fa', fontSize: '18px', fontWeight: 800 }}>
        Loading GETVNT Event OS...
      </div>
    );
  }

  const isImpersonating = typeof window !== 'undefined' && localStorage.getItem('getvnt_impersonating') === 'true';

  const handleExitImpersonation = () => {
    localStorage.removeItem('getvnt_impersonating');
    window.location.href = 'https://admin.getvnt.com';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#090d16', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div style={{ background: 'linear-gradient(90deg, #7c3aed, #db2777)', color: '#fff', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: '13.5px', zIndex: 9999 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} />
            <span>SUPER ADMIN IMPERSONATION MODE: Viewing Workspace for {user?.name || 'Organizer'}</span>
          </div>
          <button onClick={handleExitImpersonation} style={{ background: '#fff', color: '#7c3aed', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '12px' }}>
            Exit Impersonation →
          </button>
        </div>
      )}

      {/* Welcome Banner — shown after new user registration */}
      {welcomeVisible && (
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)',
          borderBottom: '1px solid rgba(99,102,241,0.4)',
          padding: '18px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          animation: 'slideDown 0.4s ease-out',
          zIndex: 999,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0,
              boxShadow: '0 0 20px rgba(99,102,241,0.5)',
            }}>
              🎉
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '16px', color: '#fff', lineHeight: 1.3 }}>
                Welcome to GETVNT{welcomeName ? `, ${welcomeName.split(' ')[0]}` : ''}!
              </div>
              <div style={{ fontSize: '13px', color: '#a5b4fc', marginTop: '3px' }}>
                Your account is ready. Explore events, buy tickets, or become an organizer to start selling.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button
              onClick={() => setIsBecomeOrganizerOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', padding: '8px 16px',
                borderRadius: '10px', fontWeight: 800, fontSize: '12px',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Become an Organizer →
            </button>
            <button
              onClick={() => setWelcomeVisible(false)}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <UserSidebar
        role={role}
        verificationStatus={verificationStatus}
        subscriptionPlan={subscriptionPlan}
        verifiedBadge={verifiedBadge}
        activeView={activeView}
        counters={counters}
        onSelectView={setActiveView}
        onOpenBecomeOrganizer={() => setIsBecomeOrganizerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Workspace Body */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#090d16' }}>
        {!isOrganizer ? (
          <AttendeeDashboardView
            user={user}
            verificationStatus={verificationStatus}
            activeView={activeView}
            onSelectView={setActiveView}
            onBecomeOrganizer={() => setIsBecomeOrganizerOpen(true)}
          />
        ) : (
          <div style={{ padding: '32px', color: '#f8fafc' }}>
            
            {/* Pending Verification Notice Banner */}
            {verificationStatus === 'pending' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15))',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#fbbf24'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Sparkles size={24} color="#fbbf24" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Organizer Verification Under Review</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#fef08a' }}>
                      Your business onboarding application has been received and is under review by GETVNT Super Admin. Your Organizer Workspace is active.
                    </p>
                  </div>
                </div>
                <span style={{ background: '#78350f', color: '#fef08a', padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
                  STATUS: PENDING REVIEW ⏳
                </span>
              </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: subscriptionPlan === 'pro' ? '#c084fc' : '#60a5fa', fontWeight: 800, textTransform: 'uppercase' }}>
                    {subscriptionPlan.toUpperCase()} ORGANIZER WORKSPACE
                  </span>
                  {verifiedBadge && <span style={{ background: '#052e16', color: '#34d399', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px', border: '1px solid #14532d' }}>VERIFIED ORGANIZER ✓</span>}
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '4px 0 0', color: '#fff' }}>
                  {user?.tenant?.name || 'Organizer Workspace'}
                </h1>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setIsCreateEventOpen(true)}
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}
                >
                  <Plus size={18} /> Create New Event
                </button>
              </div>
            </div>

            {/* View 1: Overview Dashboard */}
            {activeView === 'dashboard' && (
              <div>
                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Total Gross Revenue</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: '#34d399' }}>
                      ${stats?.total_revenue || 0.00}
                    </h2>
                  </div>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Tickets Sold</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: '#60a5fa' }}>
                      {stats?.tickets_sold || 0}
                    </h2>
                  </div>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Wallet Available Balance</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: '#fbbf24' }}>
                      ${stats?.wallet_balance || 0.00}
                    </h2>
                  </div>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>Active Events</span>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0', color: '#c084fc' }}>
                      {events.length}
                    </h2>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>Published Events Directory</h3>
                    {events.length === 0 ? (
                      <p style={{ color: '#94a3b8' }}>No events published yet. Click "Create New Event" to launch tickets.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {events.map(ev => (
                          <div key={ev.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#fff' }}>{ev.title}</h4>
                              <span style={{ fontSize: '12px', color: '#94a3b8' }}>📍 {ev.city} • 📅 {new Date(ev.start_date).toLocaleDateString()}</span>
                            </div>
                            <span style={{ background: '#052e16', color: '#34d399', fontWeight: 800, fontSize: '12px', padding: '4px 12px', borderRadius: '99px' }}>
                              PUBLISHED
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>Wallet Ledger Summary</h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Available Balance: <strong style={{ color: '#34d399' }}>${stats?.wallet_balance || 0.00}</strong></p>
                    <button
                      onClick={() => setIsPayoutModalOpen(true)}
                      style={{ width: '100%', marginTop: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      🏦 Request Payout to Bank →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Events Management */}
            {activeView === 'events' && (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Event Directory</h3>
                  <button onClick={() => setIsCreateEventOpen(true)} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 800, cursor: 'pointer' }}>+ Create Event</button>
                </div>
                {events.map(ev => (
                  <div key={ev.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '18px', color: '#fff' }}>{ev.title}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Slug: {ev.slug} • Venue: {ev.venue_name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* View 3: Wallet & Payout OS */}
            {activeView === 'wallet' && (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>Double-Entry Financial Wallet OS</h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0' }}>Reconciles gross sales, 5% platform fees, and 1.5% gateway fees.</p>
                  </div>
                  <button onClick={() => setIsPayoutModalOpen(true)} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}>
                    Request Payout
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', background: '#1e293b', padding: '24px', borderRadius: '16px' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>Available Balance</span>
                    <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#34d399', margin: 0 }}>${wallet?.balance || '0.00'}</h2>
                  </div>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>Payout Requests History</h4>
                {payouts.length === 0 ? (
                  <p style={{ color: '#94a3b8' }}>No payout requests logged yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {payouts.map((p: any) => (
                      <div key={p.id} style={{ background: '#1e293b', padding: '14px 18px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span>Payout to {p.bank_name} ({p.account_number})</span>
                        <strong style={{ color: p.status === 'completed' ? '#34d399' : '#fbbf24' }}>${p.amount} ({p.status.toUpperCase()})</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* View 4: Door QR Scanner Studio */}
            {activeView === 'tickets_inventory' && (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '32px', maxWidth: '640px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Door Entry QR Ticket Scanner</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Enter or scan attendee QR ticket code to check in for door entry.</p>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input
                    type="text"
                    value={scanQrCode}
                    onChange={(e) => setScanQrCode(e.target.value)}
                    placeholder="e.g. TKT-9921-AFRO"
                    style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px' }}
                  />
                  <button onClick={handleVerifyQr} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 800, cursor: 'pointer' }}>
                    Validate Pass
                  </button>
                </div>

                {scanResult && (
                  <div style={{ background: scanResult.success ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', border: `1px solid ${scanResult.success ? '#34d399' : '#f87171'}`, borderRadius: '12px', padding: '16px', color: scanResult.success ? '#34d399' : '#f87171', fontWeight: 700 }}>
                    {scanResult.message}
                  </div>
                )}
              </div>
            )}

            {/* View 5: Pro Website Builder */}
            {activeView === 'website_builder' && (
              <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>Organizer Pro Website Builder</h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0' }}>Build Framer-grade event websites with subdomain and custom domain connection.</p>
                  </div>
                  <span style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: '#fff', padding: '6px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 900 }}>PRO SUBSCRIBER</span>
                </div>

                <div style={{ background: '#1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Subdomain URL</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '14px' }}>https://</span>
                      <input type="text" defaultValue="afronation" style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
                      <span style={{ color: '#94a3b8', fontSize: '14px' }}>.getvnt.com</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Custom Domain</label>
                    <input type="text" defaultValue="www.afronationfest.com" style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
                  </div>

                  <button style={{ width: 'fit-content', background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 800, cursor: 'pointer' }}>
                    Save &amp; Publish Site Live
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* Become Organizer Modal */}
      <BecomeOrganizerWizardModal
        isOpen={isBecomeOrganizerOpen}
        onClose={() => setIsBecomeOrganizerOpen(false)}
        onSuccessRedirect={() => {
          setIsBecomeOrganizerOpen(false);
          fetchUserMe();
          setActiveView('dashboard');
        }}
      />

      {/* Create Event Modal */}
      {isCreateEventOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,7,14,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', maxWidth: '600px', width: '100%', padding: '32px', color: '#fff', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color="#6366f1" /> Create New Enterprise Event
            </h3>
            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Event Title</label>
                <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
              </div>

              {/* Multi-Tier Ticket Pricing Builder */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 800 }}>Ticket Pricing Tiers</label>
                  <button
                    type="button"
                    onClick={() => setTicketTiers([...ticketTiers, { name: 'VIP Lounge Pass', price: 200, quantity: 50 }])}
                    style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid #6366f1', color: '#818cf8', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    + Add Ticket Tier
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
                  {ticketTiers.map((tier, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 32px', gap: '8px', alignItems: 'center', background: '#1e293b', border: '1px solid #334155', padding: '10px 12px', borderRadius: '10px' }}>
                      <input
                        type="text"
                        placeholder="Tier Name (e.g. Early Bird)"
                        value={tier.name}
                        onChange={(e) => {
                          const updated = [...ticketTiers];
                          updated[idx].name = e.target.value;
                          setTicketTiers(updated);
                        }}
                        required
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                      />
                      <input
                        type="number"
                        placeholder="Price ($)"
                        value={tier.price}
                        onChange={(e) => {
                          const updated = [...ticketTiers];
                          updated[idx].price = parseFloat(e.target.value) || 0;
                          setTicketTiers(updated);
                        }}
                        required
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={tier.quantity}
                        onChange={(e) => {
                          const updated = [...ticketTiers];
                          updated[idx].quantity = parseInt(e.target.value) || 0;
                          setTicketTiers(updated);
                        }}
                        required
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '12px' }}
                      />
                      {ticketTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setTicketTiers(ticketTiers.filter((_, i) => i !== idx))}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', fontWeight: 900 }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Live Revenue Potential Calculation */}
                <div style={{ marginTop: '12px', background: 'rgba(52,211,153,0.1)', border: '1px solid #34d399', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 800 }}>Total Revenue Forecast:</span>
                  <strong style={{ fontSize: '15px', color: '#34d399' }}>
                    ${ticketTiers.reduce((acc, t) => acc + (t.price * t.quantity), 0).toLocaleString()} USD
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 900, cursor: 'pointer' }}>🚀 Publish Enterprise Event</button>
                <button type="button" onClick={() => setIsCreateEventOpen(false)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Request Modal */}
      {isPayoutModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,7,14,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', maxWidth: '480px', width: '100%', padding: '32px', color: '#fff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 16px' }}>Request Payout to Bank Account</h3>
            <form onSubmit={handleRequestPayout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Payout Amount ($)</label>
                <input type="number" value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Account Number</label>
                <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Account Name</label>
                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#fff' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}>Submit Payout Request</button>
                <button type="button" onClick={() => setIsPayoutModalOpen(false)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* First-Time Google Profile Completion Modal */}
      <GoogleProfileCompletionModal
        isOpen={showGoogleProfileCompletion}
        token={getAuthToken() || ''}
        initialName={user?.name || ''}
        initialEmail={user?.email || ''}
        onSuccess={(updatedUser) => {
          setUser((prev: any) => ({ ...prev, ...updatedUser }));
          setShowGoogleProfileCompletion(false);
          setWelcomeName(updatedUser?.name || user?.name || '');
          setWelcomeVisible(true);
          setTimeout(() => setWelcomeVisible(false), 8000);
        }}
        onClose={() => setShowGoogleProfileCompletion(false)}
      />

      {/* Floating AI Assistant Chatbot */}
      <FloatingAiAssistant role={role === 'attendee' ? 'attendee' : 'organizer'} />
    </div>
    </div>
  );
}

export default App;
