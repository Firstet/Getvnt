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
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/v1/news');
      const json = await res.json();
      if (json.success && json.data?.articles) {
        setArticles(json.data.articles);
        setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error('Error fetching Google News for homepage:', e);
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Fetch & Auto Update every 5 minutes (300,000ms)
  useEffect(() => {
    fetchNews();
    const pollInterval = setInterval(fetchNews, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(pollInterval);
  }, []);

  // 2. Auto-Scroll Carousel every 5 seconds (5000ms) unless hovered
  useEffect(() => {
    if (isPaused || articles.length <= 4) return;

    const timer = setInterval(() => {
      setScrollIndex((prev) => {
        const maxIndex = Math.max(0, articles.length - 4);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, articles.length]);

  const maxScrollIndex = Math.max(0, articles.length - 4);

  const handlePrev = () => {
    setScrollIndex((prev) => (prev <= 0 ? maxScrollIndex : prev - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) => (prev >= maxScrollIndex ? 0 : prev + 1));
  };

  return (
    <div style={{ width: '100%', marginBottom: '40px' }}>
      
      {/* Section Header with Live Stream Badge & Prev/Next Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="section-pill" style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899', border: '1px solid rgba(236,72,153,0.3)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Rss size={13} /> GETVNT PULSE BLOG
            </span>
            <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} /> Live Intelligence Stream
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFF', margin: '6px 0 0', letterSpacing: '-0.02em' }}>
            Real-Time Entertainment & Afrobeats Intelligence
          </h2>
        </div>

        {/* Carousel Prev/Next Buttons & Full Hub Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenBlogHub}
            className="btn-cta btn-cta-ghost"
            style={{ fontSize: '12.5px', padding: '8px 14px', border: '1px solid rgba(236,72,153,0.3)', color: '#EC4899', borderRadius: '10px' }}
          >
            <BookOpen size={14} /> View All Stories →
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrev}
              style={{
                width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              title="Previous Stories"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              style={{
                width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              title="Next Stories"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column Auto-Scrolling Carousel Grid Container */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ overflow: 'hidden', width: '100%', borderRadius: '20px' }}
      >
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ height: '240px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: '20px',
              transform: `translateX(calc(-${scrollIndex} * (25% + 5px)))`,
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              width: '100%'
            }}
          >
            {articles.map((item) => {
              const headline = item.headline || item.title || 'Untitled';
              const summary = item.ai_summary || item.summary || 'Google Entertainment news breakdown.';
              const imageSrc = item.featured_image || item.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';
              const publisher = item.source_name || item.source || 'Google News';

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenArticle(item.slug)}
                  style={{
                    flex: '0 0 calc(25% - 15px)',
                    minWidth: '240px',
                    background: 'rgba(13, 17, 32, 0.85)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                  }}
                  className="news-card-item"
                >
                  {/* Card Image Banner */}
                  <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
                    <LazyImage src={imageSrc} alt={headline} objectFit="cover" style={{ width: '100%', height: '100%' }} />
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(8px)', color: '#EC4899', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(236,72,153,0.3)' }}>
                      {item.category || 'Music'}
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#60A5FA', fontWeight: 800, marginBottom: '6px' }}>
                        {publisher}
                      </div>
                      <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#FFF', lineHeight: 1.35, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {headline}
                      </h3>
                      <p style={{ color: '#9CA3AF', fontSize: '12px', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {summary}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11.5px' }}>
                      <span style={{ color: '#9CA3AF', fontSize: '11px' }}>100% Attribution</span>
                      <span style={{ color: '#EC4899', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
