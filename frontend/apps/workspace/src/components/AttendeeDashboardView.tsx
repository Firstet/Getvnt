import React, { useState, useEffect } from 'react';
import { Ticket, Heart, MessageSquare, Bell, User, Sparkles, ExternalLink, QrCode, Share2, Download, CheckCircle2, Trash2, Send, Paperclip, Search, Shield, Globe, Lock, ArrowRight, Eye, Calendar, MapPin, Clock, Camera, ShieldCheck, Key, Settings, AlertTriangle } from 'lucide-react';

interface AttendeeDashboardViewProps {
  user: any;
  verificationStatus: string;
  activeView: string;
  onSelectView: (view: string) => void;
  onBecomeOrganizer: () => void;
}

export const AttendeeDashboardView: React.FC<AttendeeDashboardViewProps> = ({
  user,
  verificationStatus,
  activeView,
  onSelectView,
  onBecomeOrganizer,
}) => {
  const [homeData, setHomeData] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // Interactive Form Inputs
  const [newPostContent, setNewPostContent] = useState('');
  const [newMessageText, setNewMessageText] = useState('');

  // Modals & Active Selections
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [notifFilter, setNotifFilter] = useState('all');

  // Full Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+234 812 345 6789');
  const [profileBio, setProfileBio] = useState(user?.bio || 'Music lover, tech enthusiast & live concert lover.');
  const [profileCountry, setProfileCountry] = useState(user?.country || 'Nigeria');
  const [profileLanguage, setProfileLanguage] = useState(user?.language || 'English');
  const [profileTimezone, setProfileTimezone] = useState(user?.timezone || 'Africa/Lagos');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Password & Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Notification Toggles State
  const [notifEmailReceipts, setNotifEmailReceipts] = useState(true);
  const [notifEventReminders, setNotifEventReminders] = useState(true);
  const [notifPriceAlerts, setNotifPriceAlerts] = useState(true);
  const [notifCommunityAlerts, setNotifCommunityAlerts] = useState(true);

  // Privacy Settings
  const [privacyPublicProfile, setPrivacyPublicProfile] = useState(true);
  const [privacyAllowMessages, setPrivacyAllowMessages] = useState(true);

  // Account Feedback & Delete Confirmation Modal
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getToken = () => localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');

  useEffect(() => {
    fetchHomeData();
    fetchTickets();
    fetchWishlist();
    fetchNotifications();
    fetchCommunityFeed();
    fetchConversations();
  }, []);

  const fetchHomeData = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/v1/attendee/home', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setHomeData(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchTickets = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/v1/attendee/tickets', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setTickets(data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchWishlist = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/v1/attendee/wishlist', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setWishlist(data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/attendee/notifications?type=${notifFilter}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setNotifications(data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchCommunityFeed = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/v1/attendee/community/feed', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setPosts(data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchConversations = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/v1/attendee/messages/conversations', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setConversations(data.data || []);
        if (data.data.length > 0 && !activeConversation) {
          selectConversation(data.data[0]);
        }
      }
    } catch (e) { console.error(e); }
  };

  const selectConversation = async (conv: any) => {
    setActiveConversation(conv);
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/attendee/messages/conversations/${conv.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setMessages(data.data || []);
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText || !activeConversation) return;
    const token = getToken();
    const recipientId = activeConversation.user_one_id === user.id ? activeConversation.user_two_id : activeConversation.user_one_id;

    try {
      const res = await fetch('/api/v1/attendee/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipient_id: recipientId, message: newMessageText })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setNewMessageText('');
      }
    } catch (e) { console.error(e); }
  };

  const handleToggleWishlist = async (eventId: string) => {
    const token = getToken();
    try {
      const res = await fetch('/api/v1/attendee/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ event_id: eventId })
      });
      const data = await res.json();
      if (data.success) {
        fetchWishlist();
      }
    } catch (e) { console.error(e); }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent) return;
    const token = getToken();
    try {
      const res = await fetch('/api/v1/attendee/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newPostContent })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => [data.data, ...prev]);
        setNewPostContent('');
      }
    } catch (e) { console.error(e); }
  };

  const handleLikePost = async (postId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/attendee/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes_count: data.likes_count, user_has_liked: data.liked } : p));
      }
    } catch (e) { console.error(e); }
  };

  const handleFetchReceipt = async (ticketId: string) => {
    const token = getToken();
    try {
      const res = await fetch(`/api/v1/attendee/tickets/${ticketId}/receipt`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setReceiptData(data.data);
    } catch (e) { console.error(e); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setAvatarUrl(data.url);
      }
    } catch (e) { console.error(e); }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: profileName,
          phone: profilePhone,
          bio: profileBio,
          country: profileCountry,
          language: profileLanguage,
          timezone: profileTimezone,
          avatar: avatarUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfileFeedback('✅ Profile details updated successfully!');
        setTimeout(() => setProfileFeedback(null), 4000);
      }
    } catch (e) { console.error(e); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const token = getToken();
    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordFeedback({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordFeedback({ type: 'error', text: data.message || 'Password update failed.' });
      }
    } catch (e) { console.error(e); }
  };

  const handleExportData = async () => {
    const token = getToken();
    try {
      const res = await fetch('/api/v1/attendee/export-data', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `getvnt_personal_data_${user?.id}.json`;
      a.click();
    } catch (e) { console.error(e); }
  };

  const handleDeleteAccount = async () => {
    const token = getToken();
    try {
      const res = await fetch('/api/v1/auth/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'https://getvnt.com';
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#f8fafc' }}>
      
      {/* Become Organizer Hero CTA Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        borderRadius: '20px',
        padding: '28px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 30px -5px rgba(124, 58, 237, 0.4)',
        marginBottom: '32px'
      }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: '#c4b5fd', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> GETVNT EVENT OS • ATTENDEE DASHBOARD
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '6px 0', color: '#ffffff' }}>
            Host Your Own Events &amp; Sell Tickets Global
          </h2>
          <p style={{ margin: 0, color: '#e0e7ff', fontSize: '13.5px', maxWidth: '640px', lineHeight: '1.5' }}>
            Complete your 2-minute business onboarding verification to unlock your Organizer Workspace, double-entry wallet, ticket management, and AI event assistant.
          </p>
        </div>

        <button
          onClick={onBecomeOrganizer}
          disabled={verificationStatus === 'pending'}
          style={{
            background: '#ffffff',
            color: '#4f46e5',
            fontWeight: 900,
            fontSize: '14px',
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            cursor: verificationStatus === 'pending' ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap'
          }}
        >
          {verificationStatus === 'pending' ? '⏳ Onboarding Under Review...' : '🚀 Become Organizer Now'}
        </button>
      </div>

      {/* ────────────────── 1. MODULE: HOME OVERVIEW ────────────────── */}
      {activeView === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Quick Actions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <button onClick={() => onSelectView('tickets')} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer', color: '#fff' }}>
              <Ticket size={24} color="#60a5fa" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: 800, fontSize: '15px' }}>My Ticket Passes</div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{tickets.length} Passes Ready</span>
            </button>

            <button onClick={() => onSelectView('wishlist')} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer', color: '#fff' }}>
              <Heart size={24} color="#f472b6" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Saved Wishlist</div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{wishlist.length} Saved Events</span>
            </button>

            <button onClick={() => onSelectView('community')} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer', color: '#fff' }}>
              <MessageSquare size={24} color="#c084fc" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Community Feed</div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Join Discussions</span>
            </button>

            <button onClick={onBecomeOrganizer} style={{ background: '#0f172a', border: '1px solid #6366f1', borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer', color: '#fff' }}>
              <Sparkles size={24} color="#6366f1" style={{ marginBottom: '10px' }} />
              <div style={{ fontWeight: 800, fontSize: '15px' }}>Become Organizer</div>
              <span style={{ fontSize: '12px', color: '#818cf8' }}>Verify Business</span>
            </button>
          </div>

          {/* Recommended Events Carousel */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Recommended Events For You</h3>
            {homeData?.recommended_events?.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No recommended events at the moment.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {homeData?.recommended_events?.map((ev: any) => (
                  <div key={ev.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{ev.category}</div>
                    <h4 style={{ margin: '0 0 8px', fontSize: '17px', color: '#fff' }}>{ev.title}</h4>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px' }}>📍 {ev.city}, {ev.country} • 📅 {new Date(ev.start_date).toLocaleDateString()}</p>
                    <button onClick={() => handleToggleWishlist(ev.id)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '10px', padding: '8px', fontWeight: 700, cursor: 'pointer' }}>
                      ❤️ Save to Wishlist
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────── 2. MODULE: MY TICKETS ────────────────── */}
      {activeView === 'tickets' && (
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '20px' }}>Purchased Passes &amp; QR Digital Tickets</h3>
          {tickets.length === 0 ? (
            <div style={{ background: '#0f172a', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid #1e293b' }}>
              <Ticket size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px' }}>No Purchased Tickets Yet</h4>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px' }}>Browse upcoming live events on GETVNT Marketplace and reserve your passes.</p>
              <a href="https://getvnt.com" target="_blank" rel="noreferrer" style={{ background: '#4f46e5', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Browse Live Events <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {tickets.map(t => (
                <div key={t.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
                  {t.qr_code_url && (
                    <img src={t.qr_code_url} alt="QR Pass" style={{ width: '160px', height: '160px', borderRadius: '12px', background: '#fff', padding: '8px', margin: '0 auto 16px' }} />
                  )}
                  <h4 style={{ margin: '0 0 4px', fontSize: '18px', color: '#fff' }}>{t.event?.title || 'GETVNT Pass'}</h4>
                  <div style={{ color: '#34d399', fontWeight: 800, fontSize: '13.5px', marginBottom: '8px' }}>CODE: {t.ticket_code}</div>
                  <div style={{ fontSize: '12.5px', color: '#94a3b8', marginBottom: '16px' }}>
                    Pass: {t.ticket_type?.name} • Paid: ${t.ticket_type?.price}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setSelectedTicket(t)} style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      QR Pass
                    </button>
                    <button onClick={() => handleFetchReceipt(t.id)} style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#60a5fa', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── 3. MODULE: SAVED WISHLIST ────────────────── */}
      {activeView === 'wishlist' && (
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '20px' }}>Saved Event Wishlist</h3>
          {wishlist.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>Your saved wishlist is empty.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {wishlist.map(w => (
                <div key={w.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: '#fff' }}>{w.event?.title || 'Saved Event'}</h4>
                  <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px' }}>📍 {w.event?.city || 'Lagos'} • 📅 {w.event?.start_date ? new Date(w.event.start_date).toLocaleDateString() : 'Upcoming'}</p>
                  <button onClick={() => handleToggleWishlist(w.event_id)} style={{ width: '100%', background: '#f87171', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', fontWeight: 700, cursor: 'pointer' }}>
                    Remove from Wishlist
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── 4. MODULE: COMMUNITY HUB ────────────────── */}
      {activeView === 'community' && (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '20px' }}>Attendee Community Feed</h3>
          
          {/* Post Composer */}
          <form onSubmit={handleCreatePost} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's happening? Share thoughts on upcoming concert events..."
              style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', resize: 'none', height: '80px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: 800, cursor: 'pointer' }}>
                Post Discussion
              </button>
            </div>
          </form>

          {/* Feed Posts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {posts.map(p => (
              <div key={p.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>
                    {p.user?.name ? p.user.name[0] : 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>{p.user?.name || 'Attendee'}</div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5' }}>{p.content}</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button onClick={() => handleLikePost(p.id)} style={{ background: 'none', border: 'none', color: p.user_has_liked ? '#f472b6' : '#94a3b8', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ❤️ {p.likes_count || 0} Likes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────── 5. MODULE: DIRECT MESSAGES ────────────────── */}
      {activeView === 'messages' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', height: '600px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', overflow: 'hidden' }}>
          
          {/* Conversation List */}
          <div style={{ borderRight: '1px solid #1e293b', padding: '16px', overflowY: 'auto' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800 }}>Messages</h4>
            {conversations.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>No conversations yet.</p>
            ) : (
              conversations.map(c => (
                <div
                  key={c.id}
                  onClick={() => selectConversation(c)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: activeConversation?.id === c.id ? '#1e293b' : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '6px'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>
                    {c.user_one_id === user.id ? c.user_two?.name : c.user_one?.name}
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>{c.last_message || 'Start chat'}</span>
                </div>
              ))
            )}
          </div>

          {/* Active Chat Thread */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(m => (
                <div key={m.id} style={{ alignSelf: m.sender_id === user.id ? 'flex-end' : 'flex-start', background: m.sender_id === user.id ? '#4f46e5' : '#1e293b', padding: '10px 16px', borderRadius: '12px', maxWidth: '75%', color: '#fff', fontSize: '13.5px' }}>
                  {m.message}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid #1e293b', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '10px 14px', color: '#fff' }}
              />
              <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: 800, cursor: 'pointer' }}>
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ────────────────── 6. MODULE: NOTIFICATIONS ────────────────── */}
      {activeView === 'notifications' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '20px' }}>Notifications Center</h3>
          {notifications.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No notifications found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#fff' }}>{n.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>{n.message}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 700 }}>{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── 7. MODULE: FULL PROFILE & SETTINGS ────────────────── */}
      {activeView === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Header & Identity Card */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '32px', overflow: 'hidden', border: '3px solid #334155' }}>
                  {avatarUrl ? <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profileName ? profileName[0] : 'U')}
                </div>
                <label style={{ position: 'absolute', bottom: 0, right: 0, background: '#3b82f6', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #0f172a' }}>
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                </label>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#fff' }}>{profileName || user?.name || 'Attendee User'}</h3>
                  <ShieldCheck size={18} color="#34d399" />
                </div>
                <p style={{ margin: '4px 0 8px', color: '#94a3b8', fontSize: '13.5px' }}>{user?.email || 'user@getvnt.com'}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', padding: '3px 10px', borderRadius: '99px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                    ATTENDEE ACCOUNT
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '3px 10px', borderRadius: '99px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                    EMAIL VERIFIED ✓
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Personal Information */}
          <form onSubmit={handleSaveProfile} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#60a5fa" /> Personal Details &amp; Bio
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px' }}>Update your personal identity details visible on your event passes and community activity.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Full Name</label>
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Email Address (Verified)</label>
                <input type="text" value={user?.email || ''} readOnly style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#94a3b8', fontSize: '14px', cursor: 'not-allowed' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Phone Number</label>
                <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Country</label>
                <select value={profileCountry} onChange={(e) => setProfileCountry(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>
                  <option value="Nigeria">Nigeria 🇳🇬</option>
                  <option value="Ghana">Ghana 🇬🇭</option>
                  <option value="Kenya">Kenya 🇰🇪</option>
                  <option value="South Africa">South Africa 🇿🇦</option>
                  <option value="United Kingdom">United Kingdom 🇬🇧</option>
                  <option value="United States">United States 🇺🇸</option>
                  <option value="Canada">Canada 🇨🇦</option>
                  <option value="United Arab Emirates">United Arab Emirates 🇦🇪</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Preferred Language</label>
                <select value={profileLanguage} onChange={(e) => setProfileLanguage(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Swahili">Swahili</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Timezone</label>
                <select value={profileTimezone} onChange={(e) => setProfileTimezone(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>
                  <option value="Africa/Lagos">Africa/Lagos (WAT, GMT+1)</option>
                  <option value="Africa/Accra">Africa/Accra (GMT)</option>
                  <option value="Africa/Nairobi">Africa/Nairobi (EAT, GMT+3)</option>
                  <option value="Europe/London">Europe/London (BST, GMT+1)</option>
                  <option value="America/New_York">America/New_York (EST, GMT-5)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>About Bio</label>
              <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={3} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', resize: 'none' }} />
            </div>

            {profileFeedback && (
              <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid #34d399', borderRadius: '10px', padding: '12px 16px', color: '#34d399', fontSize: '13.5px', fontWeight: 700, marginBottom: '16px' }}>
                {profileFeedback}
              </div>
            )}

            <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
              💾 Save Profile Details
            </button>
          </form>

          {/* Section 2: Security & Change Password */}
          <form onSubmit={handleChangePassword} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="#fbbf24" /> Password &amp; Authentication Security
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px' }}>Ensure your account is using a strong password.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="At least 8 characters" style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm new password" style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
                </div>
              </div>
            </div>

            {passwordFeedback && (
              <div style={{ background: passwordFeedback.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)', border: `1px solid ${passwordFeedback.type === 'success' ? '#34d399' : '#f87171'}`, borderRadius: '10px', padding: '12px 16px', color: passwordFeedback.type === 'success' ? '#34d399' : '#f87171', fontSize: '13.5px', fontWeight: 700, marginBottom: '16px' }}>
                {passwordFeedback.text}
              </div>
            )}

            <button type="submit" style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
              🔒 Update Password
            </button>
          </form>

          {/* Section 3: Notification & Privacy Preferences */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#c084fc" /> Notifications &amp; Privacy Control
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px' }}>Choose which notifications you receive and manage public visibility.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '14px 18px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Email Ticket Receipts &amp; Passes</div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Receive PDF ticket downloads and payment confirmation receipts.</span>
                </div>
                <input type="checkbox" checked={notifEmailReceipts} onChange={(e) => setNotifEmailReceipts(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '14px 18px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Upcoming Event Reminders (24h Before)</div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Get automated email &amp; push alerts before your events start.</span>
                </div>
                <input type="checkbox" checked={notifEventReminders} onChange={(e) => setNotifEventReminders(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '14px 18px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Saved Wishlist Price Drops</div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Get notified when ticket prices change for saved events.</span>
                </div>
                <input type="checkbox" checked={notifPriceAlerts} onChange={(e) => setNotifPriceAlerts(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '14px 18px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Allow Direct Messaging from Event Organizers</div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Permit verified organizers to send direct message updates.</span>
                </div>
                <input type="checkbox" checked={privacyAllowMessages} onChange={(e) => setPrivacyAllowMessages(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              </div>
            </div>
          </div>

          {/* Section 4: Data Export & Account Deletion */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 4px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} color="#60a5fa" /> Data Rights &amp; Danger Zone
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px' }}>Export your personal ticket data or request account deletion.</p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={handleExportData} style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#60a5fa', borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Download size={16} /> Download Personal Data (JSON Export)
              </button>

              <button onClick={() => setIsDeleteModalOpen(true)} style={{ background: 'rgba(248, 113, 113, 0.15)', border: '1px solid #f87171', color: '#f87171', borderRadius: '12px', padding: '14px 20px', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Digital Receipt Modal */}
      {receiptData && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,7,14,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '32px', color: '#fff' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 16px' }}>Digital Official Receipt</h3>
            <p style={{ color: '#34d399', fontWeight: 800, fontSize: '14px', margin: '0 0 12px' }}>Receipt #: {receiptData.receipt_number}</p>
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', fontSize: '13.5px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div>Buyer: <strong>{receiptData.buyer_name}</strong></div>
              <div>Event: <strong>{receiptData.event?.title}</strong></div>
              <div>Total Paid: <strong style={{ color: '#34d399' }}>${receiptData.total_paid}</strong></div>
            </div>
            <button onClick={() => setReceiptData(null)} style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 800, cursor: 'pointer' }}>Close Receipt</button>
          </div>
        </div>
      )}

      {/* Confirm Account Deletion Modal */}
      {isDeleteModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,7,14,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #f87171', borderRadius: '24px', maxWidth: '440px', width: '100%', padding: '32px', color: '#fff', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#f87171" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 8px' }}>Permanently Delete Account?</h3>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.5', margin: '0 0 24px' }}>
              This action is permanent. All your purchased ticket passes, saved wishlists, community messages, and preferences will be permanently wiped.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleDeleteAccount} style={{ flex: 1, background: '#f87171', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: 900, cursor: 'pointer' }}>
                Yes, Delete My Account
              </button>
              <button onClick={() => setIsDeleteModalOpen(false)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
