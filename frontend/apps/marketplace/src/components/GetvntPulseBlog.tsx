import React, { useState, useEffect } from 'react';
import {
  Sparkles, Rss, Globe, Search, Filter, Flame, Clock, Heart, Share2,
  ExternalLink, ArrowLeft, MessageSquare, Tag, Eye, ChevronRight, ChevronLeft,
  CheckCircle, Ticket, Building2, TrendingUp, AlertCircle, Send,
  Music, Film, Crown, Wine, Radio, Trophy, Tv, Smile, Palette, Cpu
} from 'lucide-react';
import { LazyImage } from '../../../../shared/src';

const TopicIcon: React.FC<{ topic: string; size?: number; color?: string }> = ({ topic, size = 16, color }) => {
  switch (topic.toLowerCase()) {
    case 'music':
      return <Music size={size} color={color || '#818CF8'} />;
    case 'movies':
      return <Film size={size} color={color || '#F43F5E'} />;
    case 'celebrities':
      return <Crown size={size} color={color || '#F59E0B'} />;
    case 'events':
      return <Ticket size={size} color={color || '#3B82F6'} />;
    case 'fashion':
      return <Sparkles size={size} color={color || '#EC4899'} />;
    case 'lifestyle':
      return <Wine size={size} color={color || '#06B6D4'} />;
    case 'streaming':
      return <Radio size={size} color={color || '#A855F7'} />;
    case 'awards':
      return <Trophy size={size} color={color || '#EAB308'} />;
    case 'tv':
      return <Tv size={size} color={color || '#EF4444'} />;
    case 'comedy':
      return <Smile size={size} color={color || '#F97316'} />;
    case 'culture':
      return <Palette size={size} color={color || '#10B981'} />;
    case 'technology':
      return <Cpu size={size} color={color || '#38BDF8'} />;
    default:
      return <Globe size={size} color={color || '#EC4899'} />;
  }
};

interface ArticleItem {
  id: string | number;
  headline?: string;
  title?: string;
  subtitle?: string;
  slug: string;
  ai_summary?: string;
  summary?: string;
  content?: string;
  ai_insights?: {
    why_it_matters?: string;
    industry_impact?: string;
    event_opportunities?: string;
    social_reactions?: string;
  };
  key_takeaways?: string[];
  featured_image?: string;
  image_url?: string;
  source_name?: string;
  source?: string;
  source_url?: string;
  author?: string;
  pub_date?: string;
  category: string;
  region: string;
  tags?: string[];
  views_count?: number;
  shares_count?: number;
  likes_count?: number;
  is_featured?: boolean;
  is_breaking?: boolean;
  related_event_id?: string;
  relatedEvent?: any;
  related_event?: any;
  comments?: any[];
}

interface GetvntPulseBlogProps {
  initialSlug?: string | null;
  onBackToFeed?: () => void;
  onSelectArticleSlug?: (slug: string) => void;
  onBuyEventTickets?: (event: any) => void;
}

export const GetvntPulseBlog: React.FC<GetvntPulseBlogProps> = ({
  initialSlug,
  onBackToFeed,
  onSelectArticleSlug,
  onBuyEventTickets,
}) => {
  const [featuredStory, setFeaturedStory] = useState<ArticleItem | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<ArticleItem[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(initialSlug || null);
  const [currentArticle, setCurrentArticle] = useState<ArticleItem | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Engagement State
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const regionsList = ['all', 'Nigeria', 'West Africa', 'East Africa', 'Southern Africa', 'North Africa', 'Africa', 'Europe', 'Asia', 'Global'];
  const categoriesList = ['all', 'Music', 'Movies', 'Celebrities', 'Events', 'Fashion', 'Lifestyle', 'Streaming', 'Awards', 'TV', 'Comedy', 'Culture', 'Technology'];

  // Pagination Limit
  const [displayLimit, setDisplayLimit] = useState(24);

  // Sync initialSlug when prop updates
  useEffect(() => {
    if (initialSlug) {
      setActiveSlug(initialSlug);
    }
  }, [initialSlug]);

  // Fetch Feed Articles & Featured Story
  useEffect(() => {
    fetchNewsData();
  }, [selectedRegion, selectedCategory, searchQuery]);

  // Fetch Full Article Detail when activeSlug changes
  useEffect(() => {
    if (activeSlug) {
      fetchArticleDetail(activeSlug);
    } else {
      setCurrentArticle(null);
    }
  }, [activeSlug]);

  const fetchNewsData = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/news?limit=100&region=${encodeURIComponent(selectedRegion)}&category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setFeaturedStory(json.data.featured || null);
        setArticles(json.data.articles || []);
        // Top 4 trending stories for sidebar
        setTrendingArticles((json.data.articles || []).slice(0, 4));
      }
    } catch (e) {
      console.error('Error fetching news:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleDetail = async (slug: string) => {
    setArticleLoading(true);
    setLiked(false);
    try {
      const res = await fetch(`/api/v1/news/article/${encodeURIComponent(slug)}`);
      const json = await res.json();
      if (json.success && json.data?.article) {
        const art = json.data.article;
        setCurrentArticle(art);
        setLikeCount(art.likes_count || 0);
        setShareCount(art.shares_count || 0);
        setComments(art.comments || []);
      }
    } catch (e) {
      console.error('Error fetching article detail:', e);
    } finally {
      setArticleLoading(false);
    }
  };

  const handleOpenArticle = (slug: string) => {
    setActiveSlug(slug);
    if (onSelectArticleSlug) onSelectArticleSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveSlug(null);
    setCurrentArticle(null);
    if (onBackToFeed) onBackToFeed();
  };

  const handleLike = async () => {
    if (!currentArticle || liked) return;
    setLiked(true);
    setLikeCount((prev) => prev + 1);
    try {
      await fetch(`/api/v1/news/article/${currentArticle.id}/like`, { method: 'POST' });
      showToast('Article liked!');
    } catch {}
  };

  const handleShare = async () => {
    if (!currentArticle) return;
    setShareCount((prev) => prev + 1);
    navigator.clipboard?.writeText(window.location.href);
    showToast('Article link copied to clipboard!');
    try {
      await fetch(`/api/v1/news/article/${currentArticle.id}/share`, { method: 'POST' });
    } catch {}
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArticle || !commentName.trim() || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/v1/news/article/${currentArticle.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: commentName, comment: commentText }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setComments([json.data, ...comments]);
        setCommentText('');
        showToast('Comment published!');
      }
    } catch {
      showToast('Error posting comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // 1. STANDALONE ARTICLE READER VIEW
  // ─────────────────────────────────────────────────────────
  if (activeSlug || currentArticle) {
    if (articleLoading && !currentArticle) {
      return (
        <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px', color: '#FFF', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Sparkles className="animate-spin" color="#EC4899" /> Loading Intelligence Article...
          </div>
        </div>
      );
    }

    if (!currentArticle) {
      return (
        <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 20px', color: '#FFF', textAlign: 'center' }}>
          <h2>Article Not Found</h2>
          <button className="btn-cta" onClick={handleBack} style={{ marginTop: '20px' }}>
            <ArrowLeft size={16} /> Return to GETVNT Pulse Feed
          </button>
        </div>
      );
    }

    const title = currentArticle.headline || currentArticle.title || 'Untitled Article';
    const subtitle = currentArticle.subtitle || currentArticle.ai_summary;
    const imageSrc = currentArticle.featured_image || currentArticle.image_url || '/assets/afrobeat_festival_banner.png';
    const publisherName = currentArticle.source_name || currentArticle.source || 'GETVNT Intelligence';
    const publisherUrl = currentArticle.source_url || '#';
    const pubDateFormatted = currentArticle.pub_date ? new Date(currentArticle.pub_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent';

    return (
      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 20px 80px', color: '#FFF', fontFamily: "'Inter', sans-serif" }}>

        {/* Toast Alert Banner */}
        {toastMsg && (
          <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000, background: '#0D1222', border: '1px solid #EC4899', color: '#FFF', padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            <CheckCircle size={18} color="#EC4899" /> <span>{toastMsg}</span>
          </div>
        )}

        {/* Back Navigation Bar */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleBack}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', transition: 'all 0.2s ease' }}
          >
            <ArrowLeft size={16} /> Back to GETVNT Pulse Stream
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#EC4899', background: 'rgba(236,72,153,0.15)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(236,72,153,0.3)' }}>
              {currentArticle.region} • {currentArticle.category}
            </span>
          </div>
        </div>

        {/* Article Headline & Subtitle Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#60A5FA', fontWeight: 700, marginBottom: '10px' }}>
            <span>Publisher: {publisherName}</span>
            <span>•</span>
            <span>Published: {pubDateFormatted}</span>
            <span>•</span>
            <span>Author: {currentArticle.author || 'GETVNT Editorial AI'}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: '#FFF', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '14px' }}>
            {title}
          </h1>

          {subtitle && (
            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#9CA3AF', lineHeight: 1.5, fontWeight: 500 }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Hero Featured Image with Shimmer LazyLoad */}
        <div style={{ width: '100%', height: 'clamp(260px, 40vh, 460px)', borderRadius: '24px', overflow: 'hidden', marginBottom: '36px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
          <LazyImage src={imageSrc} alt={title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Publisher Attribution & Action Bar */}
        <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '18px 24px', marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#FFF' }}>
              <Rss size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFF' }}>Original Publisher Attribution</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Content aggregated legally from {publisherName} with full credit.</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href={publisherUrl}
              target="_blank"
              rel="noreferrer"
              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)', color: '#FFF', textDecoration: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(236,72,153,0.4)' }}
            >
              Read Original on {publisherName} <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Main Grid: Article Content + AI Insights Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '36px' }}>

          {/* Left Column: Article Body & Key Takeaways */}
          <div>

            {/* AI Summary Banner */}
            {currentArticle.ai_summary && (
              <div style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.1) 0%, rgba(124,58,237,0.1) 100%)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EC4899', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  <Sparkles size={16} /> GETVNT Executive Summary
                </div>
                <p style={{ color: '#E5E7EB', fontSize: '15px', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {currentArticle.ai_summary}
                </p>
              </div>
            )}

            {/* Key Takeaways Bullet List */}
            {currentArticle.key_takeaways && currentArticle.key_takeaways.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} color="#34D399" /> Key Article Takeaways
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#D1D5DB', fontSize: '14px', lineHeight: 1.5 }}>
                  {currentArticle.key_takeaways.map((point: string, idx: number) => (
                    <li key={idx} style={{ paddingLeft: '4px' }}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Article Body Content */}
            <div style={{ fontSize: '16px', color: '#D1D5DB', lineHeight: 1.8, marginBottom: '40px' }}>
              {(currentArticle.content || currentArticle.summary || '')
                .split('\n\n')
                .map((paragraph: string, idx: number) => (
                  <p key={idx} style={{ marginBottom: '20px' }}>{paragraph}</p>
                ))}
            </div>

            {/* Related GETVNT Events Ticket Recommendation Widget */}
            {(() => {
              const relatedEvt = currentArticle.related_event || currentArticle.relatedEvent || {
                title: 'Nairobi Tech & Creative Summit 2026',
                venue_name: 'Nairobi Convention Centre',
                city: 'Nairobi',
                price: 50
              };
              return (
                <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(37,99,235,0.4)', borderRadius: '24px', padding: '24px', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    <Ticket size={16} /> Related GETVNT Concert & Event Tickets
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>
                        {relatedEvt.title}
                      </h4>
                      <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                        📍 {relatedEvt.venue_name || 'Mainstage Arena'}, {relatedEvt.city || 'Nairobi'}
                      </div>
                    </div>
                    <button
                      className="btn-cta"
                      style={{ background: '#2563EB', color: '#FFF', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 800 }}
                      onClick={() => onBuyEventTickets && onBuyEventTickets(relatedEvt)}
                    >
                      Buy Official Passes <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Engagement Action Bar: Likes, Shares, Bookmarks */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '40px' }}>
              <button
                onClick={handleLike}
                style={{ background: liked ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${liked ? '#EC4899' : 'rgba(255,255,255,0.12)'}`, color: liked ? '#EC4899' : '#FFF', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}
              >
                <Heart size={18} fill={liked ? '#EC4899' : 'none'} color={liked ? '#EC4899' : '#FFF'} /> {likeCount} Likes
              </button>

              <button
                onClick={handleShare}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px' }}
              >
                <Share2 size={18} color="#60A5FA" /> {shareCount} Shares
              </button>
            </div>

            {/* Reader Comments Section */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={20} color="#EC4899" /> Community Comments ({comments.length})
              </h3>

              {/* Comment Post Form */}
              <form onSubmit={handlePostComment} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px', marginBottom: '28px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Your Name / Handle"
                    className="search-field"
                    style={{ paddingLeft: '14px', fontSize: '13px' }}
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <textarea
                    required
                    rows={3}
                    placeholder="Join the discussion on this story..."
                    className="search-field"
                    style={{ paddingLeft: '14px', fontSize: '13px', paddingTop: '10px', height: 'auto', resize: 'vertical' }}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={submittingComment} className="btn-cta" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  <Send size={14} /> {submittingComment ? 'Publishing...' : 'Post Comment'}
                </button>
              </form>

              {/* Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {comments.length === 0 ? (
                  <div style={{ color: '#9CA3AF', fontSize: '13.5px' }}>Be the first to comment on this story!</div>
                ) : (
                  comments.map((c: any, i: number) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '14px 18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, color: '#FFF', fontSize: '13.5px' }}>{c.user_name}</span>
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Recent</span>
                      </div>
                      <p style={{ color: '#D1D5DB', fontSize: '13.5px', margin: 0, lineHeight: 1.5 }}>{c.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: AI Analysis & Insights Panel */}
          <div>
            <div style={{ background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '24px', padding: '24px', position: 'sticky', top: '100px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <Sparkles size={20} color="#EC4899" />
                <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#FFF', margin: 0 }}>
                  AI Intelligence Insights
                </h3>
              </div>

              {currentArticle.ai_insights ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {currentArticle.ai_insights.why_it_matters && (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        ⚡ Why This Matters
                      </div>
                      <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5, margin: 0 }}>
                        {currentArticle.ai_insights.why_it_matters}
                      </p>
                    </div>
                  )}

                  {currentArticle.ai_insights.industry_impact && (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        📊 Industry & Artist Impact
                      </div>
                      <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5, margin: 0 }}>
                        {currentArticle.ai_insights.industry_impact}
                      </p>
                    </div>
                  )}

                  {currentArticle.ai_insights.event_opportunities && (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        🎯 GETVNT Event Opportunities
                      </div>
                      <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5, margin: 0 }}>
                        {currentArticle.ai_insights.event_opportunities}
                      </p>
                    </div>
                  )}

                  {currentArticle.ai_insights.social_reactions && (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                        💬 Social Media Trend Signals
                      </div>
                      <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.5, margin: 0 }}>
                        {currentArticle.ai_insights.social_reactions}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: '#9CA3AF' }}>AI editorial breakdown generated dynamically from publisher feeds.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // 2. GETVNT PULSE BLOG HUB LANDING PAGE
  // ─────────────────────────────────────────────────────────
  const featuredTitle = featuredStory?.headline || featuredStory?.title || 'Global Afrobeats Stadium Tour Announced for 2026';
  const featuredSummary = featuredStory?.ai_summary || featuredStory?.summary || 'Top African Afrobeats artists reveal joint stadium concert dates across Lagos, Accra, London, and New York.';
  const featuredImage = featuredStory?.featured_image || featuredStory?.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80';
  const featuredPublisher = featuredStory?.source_name || featuredStory?.source || 'Pulse Nigeria';

  return (
    <div style={{ width: '100%', color: '#FFF', fontFamily: "'Inter', sans-serif" }}>

      {/* Hero Header Section */}
      <div style={{
        backgroundImage: 'linear-gradient(180deg, rgba(13,17,32,0.82) 0%, rgba(6,9,19,0.95) 100%), url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '52px 0 36px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', color: '#EC4899', padding: '5px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 900, marginBottom: '10px' }}>
              <Rss size={14} /> GETVNT Plus Blog & Intelligence Hub
            </div>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFF' }}>
              Real-Time AI Entertainment Intelligence
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '14.5px', marginTop: '6px', maxWidth: '640px' }}>
              Automated news aggregation, publisher attribution, and AI analysis connecting fans directly to live event experiences.
            </p>
          </div>

          {/* Search Box */}
          <div style={{ width: '100%', maxWidth: '320px', position: 'relative' }}>
            <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="search-field"
              placeholder="Search news, artists, topics..."
              style={{ width: '100%', paddingLeft: '42px', fontSize: '13px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Single Featured Article Hero (EXCLUDED from grid list below!) */}
      {featuredStory && (
        <div style={{ maxWidth: '1280px', margin: '32px auto 40px', padding: '0 20px' }}>
          <div
            onClick={() => handleOpenArticle(featuredStory.slug)}
            style={{
              background: 'rgba(13, 17, 32, 0.95)', border: '1px solid rgba(236,72,153,0.35)', borderRadius: '28px',
              overflow: 'hidden', cursor: 'pointer', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              boxShadow: '0 25px 50px -12px rgba(236,72,153,0.2)', transition: 'transform 0.25s ease'
            }}
          >
            {/* Image Banner */}
            <div style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
              <LazyImage src={featuredImage} alt={featuredTitle} objectFit="cover" style={{ width: '100%', height: '100%' }} />
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'linear-gradient(135deg, #EF4444, #EC4899)', color: '#FFF', fontSize: '11px', fontWeight: 900, padding: '5px 12px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
                🔥 FEATURED STORY
              </span>
            </div>

            {/* Story Details */}
            <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#60A5FA', fontWeight: 800, marginBottom: '10px' }}>
                <span>Publisher: {featuredPublisher}</span>
                <span>•</span>
                <span>{featuredStory.region}</span>
              </div>

              <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 900, color: '#FFF', lineHeight: 1.3, marginBottom: '14px' }}>
                {featuredTitle}
              </h2>

              <p style={{ color: '#D1D5DB', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
                {featuredSummary}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ background: 'linear-gradient(135deg, #EC4899, #7C3AED)', color: '#FFF', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Read AI Insights <Sparkles size={15} />
                </span>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>100% Attribution to {featuredPublisher}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Region & Category Pills Filter Bar */}
      <div style={{ maxWidth: '1280px', margin: '0 auto 32px', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: '99px', fontSize: '13px', fontWeight: 800, border: isSelected ? '1px solid rgba(236,72,153,0.5)' : '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: isSelected ? 'linear-gradient(135deg, #EC4899, #7C3AED)' : 'rgba(13, 17, 32, 0.85)',
                  color: isSelected ? '#FFF' : '#9CA3AF', transition: 'all 0.2s ease',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  boxShadow: isSelected ? '0 4px 16px rgba(236,72,153,0.35)' : 'none'
                }}
              >
                <TopicIcon topic={cat} size={15} color={isSelected ? '#FFF' : undefined} />
                <span>{cat === 'all' ? 'All Topics' : cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Column News Grid & Sidebar Layout */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {articles.slice(0, displayLimit).map((item) => {
            const title = item.headline || item.title || 'Untitled';
            const img = item.featured_image || item.image_url || '/assets/afrobeat_festival_banner.png';
            const pub = item.source_name || item.source || 'Publisher';

            return (
              <div
                key={item.id}
                onClick={() => handleOpenArticle(item.slug)}
                style={{
                  background: 'rgba(13, 17, 32, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
                  overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ height: '180px', position: 'relative' }}>
                  <LazyImage src={img} alt={title} objectFit="cover" style={{ width: '100%', height: '100%' }} />
                  <span style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(7, 9, 15, 0.85)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.15)', color: '#FFF',
                    fontSize: '11px', fontWeight: 900, padding: '4px 10px',
                    borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                  }}>
                    <TopicIcon topic={item.category} size={13} />
                    <span>{item.category}</span>
                  </span>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 800, marginBottom: '6px' }}>
                      {pub} • {item.region}
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFF', lineHeight: 1.4, marginBottom: '10px' }}>
                      {title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '12px', fontSize: '12px', color: '#9CA3AF' }}>
                    <span>Original Source Attribution</span>
                    <span style={{ color: '#EC4899', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Read <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Historical News Button */}
        {articles.length > displayLimit && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => setDisplayLimit((prev) => prev + 24)}
              style={{
                background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(124,58,237,0.15))',
                border: '1px solid rgba(236,72,153,0.4)', color: '#FFF', padding: '14px 32px',
                borderRadius: '16px', fontWeight: 800, fontSize: '14px', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(236,72,153,0.2)'
              }}
            >
              <Rss size={18} color="#EC4899" /> Load More Historical Stories ({articles.length - displayLimit} remaining)
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
