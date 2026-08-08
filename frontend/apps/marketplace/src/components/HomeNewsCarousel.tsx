import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, BookOpen, Clock, ArrowRight, Rss } from 'lucide-react';
import { LazyImage } from '../../../../shared/src';

interface HomeNewsCarouselProps {
  onOpenArticle: (slug: string) => void;
  onOpenBlogHub: () => void;
}

export const HomeNewsCarousel: React.FC<HomeNewsCarouselProps> = ({
  onOpenArticle,
  onOpenBlogHub,
}) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/v1/news');
      const json = await res.json();
      if (json.success && json.data?.articles) {
        setArticles(json.data.articles.slice(0, 8)); // Top 8 magazine articles
      }
    } catch (e) {
      console.error('Error fetching news for homepage:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const pollInterval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(pollInterval);
  }, []);

  return (
    <section style={{ width: '100%', marginBottom: '56px' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="sponsored-tag" style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899', border: '1px solid rgba(236,72,153,0.3)' }}>
              <Rss size={13} style={{ marginRight: '4px' }} /> GETVNT PULSE MAGAZINE
            </span>
            <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} /> Live Intelligence Stream
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#FFF', margin: 0, letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            Real-Time Afrobeats &amp; Entertainment Intelligence
          </h2>
        </div>

        <button
          onClick={onOpenBlogHub}
          className="btn-cta btn-cta-ghost"
          style={{ fontSize: '13px', padding: '10px 18px', border: '1px solid rgba(236,72,153,0.35)', color: '#EC4899', borderRadius: '12px', background: 'rgba(236,72,153,0.08)' }}
        >
          <BookOpen size={15} /> Explore All Magazine Stories <ArrowRight size={14} />
        </button>
      </div>

      {/* Magazine-Style Cards Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-pulse" style={{ height: '300px', borderRadius: '20px' }} />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            width: '100%'
          }}
        >
          {articles.map((item) => {
            const headline = item.headline || item.title || 'Untitled Story';
            const summary = item.ai_summary || item.subtitle || item.summary || 'Entertainment intelligence & news breakdown.';
            const imageSrc = item.featured_image || item.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';
            const publisher = item.source_name || item.source || 'Google News';

            return (
              <div
                key={item.id}
                onClick={() => onOpenArticle(item.slug)}
                style={{
                  background: 'rgba(13, 17, 32, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
                className="magazine-card-item"
              >
                {/* Thumbnail Header */}
                <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                  <LazyImage src={imageSrc} alt={headline} objectFit="cover" style={{ width: '100%', height: '100%', transition: 'transform 0.4s ease' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(7, 9, 15, 0.85)', backdropFilter: 'blur(10px)', color: '#EC4899', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(236,72,153,0.3)' }}>
                    {item.category || 'Music'}
                  </span>
                  <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(7, 9, 15, 0.85)', backdropFilter: 'blur(10px)', color: '#9CA3AF', fontSize: '10.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> 3 min read
                  </span>
                </div>

                {/* Body Content */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 800, marginBottom: '6px' }}>
                      Source: {publisher}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', lineHeight: 1.35, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {headline}
                    </h3>
                    <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12px' }}>
                    <span style={{ color: '#6B7280', fontSize: '11.5px', fontWeight: 600 }}>Publisher Attribution</span>
                    <span style={{ color: '#EC4899', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Read Article <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
