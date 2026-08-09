import React, { useState } from 'react';
import {
  Globe, Rss, Filter, Sparkles, ExternalLink, CheckCircle, Clock,
  Shield, ToggleLeft, ToggleRight, Tag, Radio, RefreshCw, Eye,
  Building2, Layers, Search, AlertCircle, Play, Pause
} from 'lucide-react';

export const NewsEntertainmentCenterView: React.FC<{ onToast: (msg: string) => void }> = ({ onToast }) => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [autoPublish, setAutoPublish] = useState(true);
  const [aiSummarization, setAiSummarization] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);

  const regions = ['all', 'Nigeria', 'West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'Global'];
  const categories = ['all', 'Entertainment', 'Music', 'Movies', 'Celebrities', 'Events', 'Lifestyle', 'Technology'];

  const fetchLiveNews = async () => {
    try {
      const res = await fetch(`/api/v1/news?region=${selectedRegion}&category=${selectedCategory}&limit=30`);
      const json = await res.json();
      if (json.success && json.data) {
        const list = json.data.articles || [];
        if (json.data.featured) {
          setArticles([json.data.featured, ...list]);
        } else {
          setArticles(list);
        }
      }
    } catch (err) {
      console.error('Failed fetching live news:', err);
    }
  };

  React.useEffect(() => {
    fetchLiveNews();
  }, [selectedRegion, selectedCategory]);

  const handleSyncFeeds = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/v1/admin/news/fetch-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`
        }
      });
      const json = await res.json();
      if (json.success) {
        onToast(json.message || 'RSS feeds synchronized successfully!');
        fetchLiveNews();
      } else {
        onToast('Sync error: ' + (json.message || 'Failed'));
      }
    } catch {
      onToast('Error syncing RSS feeds.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean, durationDays = 3) => {
    try {
      const res = await fetch(`/api/v1/admin/news/articles/${id}/toggle-featured`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('getvnt_admin_token') || ''}`
        },
        body: JSON.stringify({ duration_days: durationDays })
      });
      const json = await res.json();
      if (json.success) {
        onToast(json.message);
        fetchLiveNews();
      }
    } catch {
      onToast('Failed updating featured status.');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rss size={20} color="#FFF" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: 0 }}>
              AI News &amp; Entertainment Aggregation Hub
            </h1>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            Aggregates permitted RSS feeds from Pulse, TechCabal, Rolling Stone, BBC, credits publishers, and powers featured marketplace news.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn admin-btn-secondary" onClick={handleSyncFeeds} disabled={refreshing}>
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Fetching RSS...' : 'Sync Feeds Now'}
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleSyncFeeds}>
            <Globe size={15} /> Trigger AI Aggregation
          </button>
        </div>
      </div>

      {/* Super Admin Controls & Rules */}
      <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginBottom: '16px' }}>Global Feed Governance &amp; Featured Pinning Rules</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>Auto-Publish Aggregated Feeds</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Instantly publish items from whitelisted publishers</div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: autoPublish ? '#34D399' : '#9CA3AF' }}
                onClick={() => { setAutoPublish(!autoPublish); onToast(`Auto-publish ${!autoPublish ? 'enabled' : 'disabled'}`); }}
              >
                {autoPublish ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>Automatic Featured Pinning</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Featured story defaults to latest post when no active sponsored pin exists</div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: aiSummarization ? '#60A5FA' : '#9CA3AF' }}
                onClick={() => { setAiSummarization(!aiSummarization); onToast(`Smart Pinning active`); }}
              >
                {aiSummarization ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Region & Category Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', overflowX: 'auto' }}>
          {regions.map((reg) => (
            <button
              key={reg}
              className="admin-btn"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                background: selectedRegion === reg ? 'linear-gradient(135deg, #EC4899, #8B5CF6)' : 'transparent',
                color: selectedRegion === reg ? '#FFF' : '#9CA3AF',
                border: 'none'
              }}
              onClick={() => setSelectedRegion(reg)}
            >
              {reg === 'all' ? 'All Regions' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Feed Table */}
      <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', margin: 0 }}>
            Live Aggregated Articles ({articles.length})
          </h3>
          <span style={{ fontSize: '12px', color: '#34D399', fontWeight: 700 }}>
            ✓ Auto-updating via RSS &amp; AI Summarizer
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {articles.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>
              No articles found. Click "Sync Feeds Now" above to pull live RSS items.
            </div>
          ) : (
            articles.map((art) => (
              <div key={art.id} style={{ background: 'rgba(255,255,255,0.03)', border: art.is_featured ? '1px solid rgba(236,72,153,0.5)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#EC4899', background: 'rgba(236,72,153,0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                      {art.region || 'Global'} • {art.category || 'Entertainment'}
                    </span>
                    {art.is_featured && (
                      <span style={{ fontSize: '11px', fontWeight: 900, color: '#FCD34D', background: 'rgba(245,158,11,0.2)', padding: '3px 8px', borderRadius: '6px' }}>
                        ⭐ FEATURED STORY {art.featured_until ? `(until ${new Date(art.featured_until).toLocaleDateString()})` : ''}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{new Date(art.pub_date || art.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>{art.headline}</h4>
                  <p style={{ color: '#D1D5DB', fontSize: '13px', lineHeight: 1.5, marginBottom: '12px' }}>{art.subtitle || art.ai_summary}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#60A5FA', fontWeight: 700 }}>Source: {art.source_name || 'RSS Feed'}</span>
                    {art.source_url && (
                      <a href={art.source_url} target="_blank" rel="noreferrer" style={{ color: '#A5B4FC', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                        Read Original Article <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '11.5px', padding: '6px 12px', color: art.is_featured ? '#FCD34D' : '#D4D4D4' }}
                    onClick={() => handleToggleFeatured(art.id, art.is_featured, 3)}
                  >
                    {art.is_featured ? '⭐ Unpin Featured' : 'Pin Featured (3 Days)'}
                  </button>
                  <button
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '11.5px', padding: '6px 12px', color: '#60A5FA' }}
                    onClick={() => handleToggleFeatured(art.id, art.is_featured, 7)}
                  >
                    Pin 7 Days
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
