import React, { useState, useEffect } from 'react';
import { Ticket, Heart, MessageSquare, Bell, User, Sparkles, ExternalLink, QrCode, Share2, Download, CheckCircle2, Trash2, Send, Paperclip, Search, Shield, Globe, Lock, ArrowRight, Eye, Calendar, MapPin, Clock, Camera, Key, ToggleLeft, ToggleRight, AlertTriangle, ShieldCheck } from 'lucide-react';

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

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+234 812 345 6789');
  const [profileBio, setProfileBio] = useState(user?.bio || 'Music lover & live event enthusiast.');
  const [profileCountry, setProfileCountry] = useState(user?.country || 'Nigeria');
  const [profileLanguage, setProfileLanguage] = useState(user?.language || 'English');
  const [profileTimezone, setProfileTimezone] = useState(user?.timezone || 'Africa/Lagos');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileFeedback, setProfileFeedback] = useState<{ msg: string; isError?: boolean } | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{ msg: string; isError?: boolean } | null>(null);

  // Notification Toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  // Privacy Toggles
  const [privacyPublic, setPrivacyPublic] = useState(true);
  const [privacyWishlist, setPrivacyWishlist] = useState(false);
  const [privacyDirectMsgs, setPrivacyDirectMsgs] = useState(true);

  // Danger Zone Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getToken = () =>
    localStorage.getItem('getvnt_auth_token') ||
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('getvnt_auth_token') ||
    sessionStorage.getItem('auth_token') ||
    localStorage.getItem('token');

  // Sync user prop changes into state
  useEffect(() => {
    if (user) {
      if (user.name) setProfileName(user.name);
      if (user.email) setProfileEmail(user.email);
      if (user.phone) setProfilePhone(user.phone);
      if (user.bio) setProfileBio(user.bio);
      if (user.country) setProfileCountry(user.country);
      if (user.language) setProfileLanguage(user.language);
      if (user.timezone) setProfileTimezone(user.timezone);
      if (user.avatar_url) setAvatarUrl(user.avatar_url);
    }
  }, [user]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFeedback(null);
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
          avatar_url: avatarUrl,
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfileFeedback({ msg: 'Profile updated successfully!' });
      } else {
        setProfileFeedback({ msg: data.message || 'Update failed.', isError: true });
      }
    } catch (e) {
      setProfileFeedback({ msg: 'An error occurred while saving profile.', isError: true });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ msg: 'New passwords do not match.', isError: true });
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
        setPasswordFeedback({ msg: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordFeedback({ msg: data.message || 'Failed to change password.', isError: true });
      }
    } catch (e) {
      setPasswordFeedback({ msg: 'Error updating password.', isError: true });
    }
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
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAvatarUrl(data.url);
      }
    } catch (err) {
      console.error(err);
    }
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
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
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

      {/* ────────────────── 7. MODULE: EXPANDED PROFILE & SETTINGS ────────────────── */}
      {activeView === 'profile' && (
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Card 1: Profile Details & Avatar Photo */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 4px', color: '#fff' }}>Attendee Account Settings</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 28px' }}>Manage your personal details, avatar photo, language, and country preferences.</p>
            
            {profileFeedback && (
              <div style={{ background: profileFeedback.isError ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.15)', border: `1px solid ${profileFeedback.isError ? '#f87171' : '#34d399'}`, color: profileFeedback.isError ? '#f87171' : '#34d399', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>
                {profileFeedback.msg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Photo Avatar Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#1e293b', border: '2px solid #6366f1', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={36} color="#60a5fa" />
                  )}
                </div>
                <div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    <Camera size={16} /> Upload Photo
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                  </label>
                  <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>JPG, PNG or WEBP. Max 5MB.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Full Name</label>
                  <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} required style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input type="email" value={profileEmail} readOnly style={{ width: '100%', background: '#162032', border: '1px solid #334155', borderRadius: '12px', padding: '12px 40px 12px 16px', color: '#94a3b8', fontSize: '14px' }} />
                    <ShieldCheck size={18} color="#34d399" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Phone Number</label>
                  <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Country / Region</label>
                  <select value={profileCountry} onChange={(e) => setProfileCountry(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>
                    <option value="Nigeria">Nigeria</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Ghana">Ghana</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Canada">Canada</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Short Bio</label>
                <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={3} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', resize: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Preferred Language</label>
                  <select value={profileLanguage} onChange={(e) => setProfileLanguage(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                    <option value="Portuguese">Portuguese</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Timezone</label>
                  <select value={profileTimezone} onChange={(e) => setProfileTimezone(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>
                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                    <option value="America/New_York">US Eastern (EST)</option>
                    <option value="Europe/London">London (BST)</option>
                    <option value="Asia/Dubai">Dubai (GST)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px' }}>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Security & Password Change */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Key size={22} color="#60a5fa" />
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#fff' }}>Security &amp; Password</h3>
            </div>
            
            {passwordFeedback && (
              <div style={{ background: passwordFeedback.isError ? 'rgba(248,113,113,0.15)' : 'rgba(52,211,153,0.15)', border: `1px solid ${passwordFeedback.isError ? '#f87171' : '#34d399'}`, color: passwordFeedback.isError ? '#f87171' : '#34d399', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, marginBottom: '20px' }}>
                {passwordFeedback.msg}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters" style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700 }}>Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} placeholder="Re-enter new password" style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '12px 16px', color: '#fff' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
                <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 24px', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer' }}>
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Card 3: Notification & Privacy Settings */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Bell size={22} color="#c084fc" />
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#fff' }}>Notification &amp; Privacy Preferences</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '16px 20px', borderRadius: '14px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#fff' }}>Email Order Receipts &amp; Pass Confirmations</div>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>Receive ticket passes and official payment receipts via email.</span>
                </div>
                <button onClick={() => setNotifEmail(!notifEmail)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: notifEmail ? '#34d399' : '#64748b' }}>
                  {notifEmail ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '16px 20px', borderRadius: '14px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#fff' }}>SMS Event Gate Code Alerts</div>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>Get instant SMS alerts with door entry codes before event start time.</span>
                </div>
                <button onClick={() => setNotifSms(!notifSms)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: notifSms ? '#34d399' : '#64748b' }}>
                  {notifSms ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '16px 20px', borderRadius: '14px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#fff' }}>Public Community Profile Visibility</div>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>Allow other attendees to view your community posts and comments.</span>
                </div>
                <button onClick={() => setPrivacyPublic(!privacyPublic)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: privacyPublic ? '#34d399' : '#64748b' }}>
                  {privacyPublic ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Connected Accounts */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '24px', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 16px', color: '#fff' }}>Connected Identity Accounts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>Google Account</div>
                  <span style={{ fontSize: '12px', color: '#34d399' }}>Connected ({profileEmail})</span>
                </div>
                <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 800 }}>ACTIVE ✓</span>
              </div>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>Apple ID</div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Not Connected</span>
                </div>
                <button style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Connect</button>
              </div>
            </div>
          </div>

          {/* Card 5: Danger Zone & Data Export */}
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <AlertTriangle size={22} color="#f87171" />
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#f87171' }}>Data Export &amp; Danger Zone</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '0 0 20px', lineHeight: '1.5' }}>
              Download your personal data archive (purchased passes, order history, wishlist, and profile details) or delete your GETVNT account permanently.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={handleExportData} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} /> Download Personal Data (JSON Export)
              </button>
              <button onClick={() => setIsDeleteModalOpen(true)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,7,14,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #f87171', borderRadius: '24px', maxWidth: '480px', width: '100%', padding: '32px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={28} color="#ef4444" />
              <h3 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#f87171' }}>Delete GETVNT Account?</h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5', margin: '0 0 24px' }}>
              Are you sure you want to delete your account? This action will permanently invalidate your tickets, delete your saved wishlist, and wipe your profile history. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleDeleteAccount} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 800, cursor: 'pointer' }}>
                Yes, Delete My Account
              </button>
              <button onClick={() => setIsDeleteModalOpen(false)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
