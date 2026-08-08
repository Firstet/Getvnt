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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Fallback high-impact blog posts if API is offline
  const defaultBlogPosts = [
    {
      id: 'post-1',
      slug: 'afrobeats-global-dominance-2026',
      headline: 'Afrobeats Global Economic Surge & Stadium Tour Expansion',
      subtitle: 'How African festival promoters are scaling international ticket commerce across Europe and North America.',
      featured_image: '/afrobeat_festival_banner.png',
      category: 'Festival Intelligence',
      source_name: 'GETVNT Pulse',
      read_time: '4 min'
    },
    {
      id: 'post-2',
      slug: 'sub-500ms-qr-gate-technology',
      headline: 'Eliminating Ticket Counterfeiting with Encrypted RSA QR Passes',
      subtitle: 'Inside Getvnt high-speed mobile scanning engine built for 100k+ attendee venue entry points.',
      featured_image: '/concert_crowd_bg.png',
      category: 'Gate Security',
      source_name: 'Tech & Infrastructure',
      read_time: '3 min'
    },
    {
      id: 'post-3',
      slug: 'ai-ticket-pricing-strategies',
      headline: 'How AI Co-Pilots Optimize Event Ticket Revenue in Real-Time',
      subtitle: 'Dynamic pricing models and ticket drop velocity predictions for modern promoters.',
      featured_image: '/tech_summit_banner.png',
      category: 'Revenue Operations',
      source_name: 'SaaS Insights',
      read_time: '5 min'
    },
    {
      id: 'post-4',
      slug: 'instant-payout-settlement-networks',
      headline: 'Real-Time Revenue Settlement: Paystack, Flutterwave & Stripe',
      subtitle: 'Why instant cash flow settlement is empowering independent event creators.',
      featured_image: '/luxury_vip_lounge.png',
      category: 'Fintech',
      source_name: 'Finance Hub',
      read_time: '3 min'
    },
    {
      id: 'post-5',
      slug: 'cultural-festivals-lagos-nairobi-2026',
      headline: 'Top 10 Cultural Summits to Attend Across Africa in 2026',
      subtitle: 'A curated breakdown of flagship art, music, and technology gatherings.',
      featured_image: '/afrobeat_festival_banner.png',
      category: 'Culture',
      source_name: 'Editorial Spotlight',
      read_time: '6 min'
    }
  ];

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/v1/news');
      const json = await res.json();
      if (json.success && json.data?.articles && json.data.articles.length > 0) {
        setArticles(json.data.articles);
      } else {
        setArticles(defaultBlogPosts);
      }
    } catch (e) {
      console.error('Error fetching news for homepage:', e);
      setArticles(defaultBlogPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Smooth Auto-scroll Interval (1 row, 4 column display)
  useEffect(() => {
    if (isPaused || !scrollRef.current) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ width: '100%', marginBottom: '80px' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="sponsored-tag" style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899', border: '1px solid rgba(236,72,153,0.3)', padding: '4px 12px', borderRadius: '99px', fontSize: '11.5px', fontWeight: 900 }}>
              <Rss size={13} style={{ marginRight: '4px', display: 'inline' }} /> GETVNT PULSE MAGAZINE
            </span>
            <span style={{ color: '#34D399', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} /> Live Auto-Scroll
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, color: '#FFF', margin: 0, letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            Latest News &amp; Event Intelligence
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleScrollLeft}
            title="Scroll Left"
            style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleScrollRight}
            title="Scroll Right"
            style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <ChevronRight size={18} />
          </button>

          <button
            onClick={onOpenBlogHub}
            className="btn-cta btn-cta-ghost"
            style={{ fontSize: '13px', padding: '10px 18px', border: '1px solid rgba(236,72,153,0.35)', color: '#EC4899', borderRadius: '12px', background: 'rgba(236,72,153,0.08)', cursor: 'pointer' }}
          >
            <BookOpen size={15} /> All Stories <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 1 Row, 4 Column Auto-Scrolling Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-pulse" style={{ height: '300px', borderRadius: '24px' }} />
          ))}
        </div>
      ) : (
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="responsive-news-auto-grid"
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gap: '20px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            paddingBottom: '12px'
          }}
        >
          {articles.map((item) => {
            const headline = item.headline || item.title || 'Untitled Story';
            const summary = item.subtitle || item.ai_summary || item.summary || 'Entertainment intelligence & news breakdown.';
            const imageSrc = item.featured_image || item.image_url || '/afrobeat_festival_banner.png';
            const publisher = item.source_name || item.source || 'GETVNT Pulse';

            return (
              <div
                key={item.id || item.slug}
                onClick={() => onOpenArticle(item.slug)}
                style={{
                  scrollSnapAlign: 'start',
                  background: 'rgba(13, 17, 32, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '320px',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
                className="magazine-card-item"
              >
                {/* Thumbnail Header */}
                <div style={{ height: '150px', position: 'relative', overflow: 'hidden' }}>
                  <LazyImage src={imageSrc} alt={headline} objectFit="cover" style={{ width: '100%', height: '100%', transition: 'transform 0.4s ease' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(7, 9, 15, 0.85)', backdropFilter: 'blur(10px)', color: '#EC4899', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(236,72,153,0.3)' }}>
                    {item.category || 'Music'}
                  </span>
                  <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(7, 9, 15, 0.85)', backdropFilter: 'blur(10px)', color: '#9CA3AF', fontSize: '10.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {item.read_time || '3 min'}
                  </span>
                </div>

                {/* Body Content */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#60A5FA', fontWeight: 800, marginBottom: '4px' }}>
                      {publisher}
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#FFF', lineHeight: 1.3, marginBottom: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {headline}
                    </h3>
                    <p style={{ color: '#9CA3AF', fontSize: '12.5px', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12px' }}>
                    <span style={{ color: '#6B7280', fontSize: '11px', fontWeight: 600 }}>Getvnt Intelligence</span>
                    <span style={{ color: '#EC4899', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Read <ArrowRight size={13} />
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
