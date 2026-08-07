import React, { useState } from 'react';
import {
  Globe, Rss, Filter, Sparkles, ExternalLink, CheckCircle, Clock,
  Shield, ToggleLeft, ToggleRight, Tag, Radio, RefreshCw, Eye,
  Building2, Layers, Search, AlertCircle, Play, Pause
} from 'lucide-react';

export const NewsEntertainmentCenterView: React.FC<{ onToast: (msg: string) => void }> = ({ onToast }) => {
  const [selectedRegion, setSelectedRegion] = useState('Nigeria');
  const [selectedCategory, setSelectedCategory] = useState('Entertainment');
  const [autoPublish, setAutoPublish] = useState(true);
  const [aiSummarization, setAiSummarization] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const regions = ['Nigeria', 'West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'Global'];
  const categories = ['Entertainment', 'Music', 'Movies', 'Celebrity', 'Events', 'Lifestyle', 'Technology', 'Business'];

  const [articles, setArticles] = useState([
    {
      id: 1,
      headline: 'Afrobeats Stars Announce 2026 World Tour Schedule Across Lagos & London',
      summary: 'Top African Afrobeats artists reveal joint concert dates, festival headliners, and exclusive ticket pre-sale windows for 2026.',
      region: 'Nigeria',
      category: 'Music',
      source: 'Pulse Africa RSS',
      sourceUrl: 'https://pulse.ng/entertainment/afrobeats-2026-tour',
      pubDate: '2 hours ago',
      isFeatured: true,
      status: 'Published'
    },
    {
      id: 2,
      headline: 'Nairobi Tech Summit Unveils AI & Venture Capital Stage Lineup',
      summary: 'East Africa’s largest developer and investor summit expands to 3 days with keynotes from global founders.',
      region: 'East Africa',
      category: 'Technology',
      source: 'TechCabal RSS Feed',
      sourceUrl: 'https://techcabal.com/nairobi-tech-summit-2026',
      pubDate: '4 hours ago',
      isFeatured: false,
      status: 'Published'
    },
    {
      id: 3,
      headline: 'Cape Town Film & Creative Arts Festival Sets Ticket Sales Record',
      summary: 'International indie directors and African storytellers gather at V&A Waterfront for premiere screenings.',
      region: 'Southern Africa',
      category: 'Movies',
      source: 'ScreenAfrica Feed',
      sourceUrl: 'https://screenafrica.com/capetown-film-fest',
      pubDate: '6 hours ago',
      isFeatured: false,
      status: 'Pending Approval'
    }
  ]);

  const handleSyncFeeds = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      onToast('RSS feeds synchronized! 4 new legal aggregated articles imported with original publisher attribution.');
    }, 1000);
  };

  const handleToggleArticleStatus = (id: number) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'Published' ? 'Draft' : 'Published' }
          : a
      )
    );
    onToast('Article status updated!');
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
              AI News & Entertainment Aggregation Hub
            </h1>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '13.5px', marginTop: '4px' }}>
            Aggregates legal permitted RSS feeds, credits original publishers, and powers the marketplace entertainment stream.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="admin-btn admin-btn-secondary" onClick={handleSyncFeeds} disabled={refreshing}>
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Fetching RSS...' : 'Sync Feeds Now'}
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => onToast('RSS Feed Sources Configured!')}>
            <Globe size={15} /> Add Permitted Feed Source
          </button>
        </div>
      </div>

      {/* Super Admin Controls & Rules */}
      <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginBottom: '16px' }}>Global Feed Governance & Controls</h3>
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
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>AI Article Summarization</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Generate 2-sentence AI summaries for clean card previews</div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: aiSummarization ? '#60A5FA' : '#9CA3AF' }}
                onClick={() => { setAiSummarization(!aiSummarization); onToast(`AI Summarization ${!aiSummarization ? 'enabled' : 'disabled'}`); }}
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
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Feed Table */}
      <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', marginBottom: '16px' }}>Aggregated Articles Feed</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {articles.map((art) => (
            <div key={art.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#EC4899', background: 'rgba(236,72,153,0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                    {art.region} • {art.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{art.pubDate}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>{art.headline}</h4>
                <p style={{ color: '#D1D5DB', fontSize: '13px', lineHeight: 1.5, marginBottom: '12px' }}>{art.summary}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                  <span style={{ color: '#60A5FA', fontWeight: 700 }}>Source: {art.source}</span>
                  <a href={art.sourceUrl} target="_blank" rel="noreferrer" style={{ color: '#A5B4FC', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    Read Original Article <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: art.status === 'Published' ? '#34D399' : '#FBBF24', background: art.status === 'Published' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', padding: '4px 10px', borderRadius: '99px' }}>
                  {art.status}
                </span>
                <button
                  className="admin-btn admin-btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => handleToggleArticleStatus(art.id)}
                >
                  {art.status === 'Published' ? 'Unpublish' : 'Approve & Publish'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
