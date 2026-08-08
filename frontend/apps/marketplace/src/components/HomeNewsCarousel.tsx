import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Clock, ArrowRight, Rss, ArrowUpRight } from 'lucide-react';
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

  // Fallback high-impact blog posts if API is offline
  const defaultBlogPosts = [
    {
      id: 'post-1',
      slug: 'afrobeats-global-dominance-2026',
      headline: 'Afrobeats Global Economic Surge & Stadium Tour Expansion',
      subtitle: 'How African festival promoters are scaling international ticket commerce across Europe and North America with seamless digital gate control.',
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

  const featuredArticle = articles[0] || defaultBlogPosts[0];
  const sideArticles = articles.slice(1, 4).length > 0 ? articles.slice(1, 4) : defaultBlogPosts.slice(1, 4);

  return (
    <section style={{ width: '100%' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="sponsored-tag" style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899', border: '1px solid rgba(236,72,153,0.3)', padding: '4px 12px', borderRadius: '99px', fontSize: '11.5px', fontWeight: 900 }}>
              <Rss size={13} style={{ marginRight: '4px', display: 'inline' }} /> GETVNT PULSE MAGAZINE
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#FFF', margin: 0, letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
            Latest Intelligence &amp; Editorial
          </h2>
        </div>

        <button
          onClick={onOpenBlogHub}
          className="tixup-btn-primary"
          style={{ fontSize: '14px', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)', color: '#EC4899', boxShadow: 'none' }}
        >
          <BookOpen size={16} /> Explore All Articles <ArrowRight size={15} />
        </button>
      </div>

      {/* Apple News-Style Split Grid (Featured Hero Left + 3 Stacked Side Articles Right) */}
      <div className="apple-news-grid">
        
        {/* Large Featured Hero Article (Left) */}
        <div
          onClick={() => onOpenArticle(featuredArticle.slug)}
          style={{
            background: 'rgba(13, 17, 32, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            minHeight: '440px'
          }}
          className="tixup-event-card"
        >
          <div style={{ width: '100%', height: '240px', position: 'relative', overflow: 'hidden' }}>
            <LazyImage src={featuredArticle.featured_image || featuredArticle.image_url} alt={featuredArticle.headline} objectFit="cover" style={{ width: '100%', height: '100%' }} />
            <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(7, 9, 15, 0.85)', backdropFilter: 'blur(10px)', color: '#EC4899', fontSize: '11.5px', fontWeight: 900, padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(236,72,153,0.3)' }}>
              FEATURED STORY • {featuredArticle.category || 'Intelligence'}
            </span>
          </div>

          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 900, color: '#FFF', lineHeight: 1.3, marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
                {featuredArticle.headline}
              </h3>
              <p style={{ color: '#9CA3AF', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                {featuredArticle.subtitle}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' }}>
              <span style={{ color: '#60A5FA', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> {featuredArticle.read_time || '4 min read'}
              </span>
              <span style={{ color: '#EC4899', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Read Full Story <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </div>

        {/* 3 Stacked Side Articles (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          {sideArticles.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onOpenArticle(item.slug)}
              style={{
                background: 'rgba(13, 17, 32, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                flex: 1
              }}
              className="tixup-event-card"
            >
              <div style={{ width: '84px', height: '84px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
                <LazyImage src={item.featured_image || item.image_url || '/concert_crowd_bg.png'} alt={item.headline} objectFit="cover" style={{ width: '100%', height: '100%' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '11px', color: '#EC4899', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {item.category || 'Insights'}
                </span>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFF', margin: '4px 0 6px 0', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'var(--font-heading)' }}>
                  {item.headline}
                </h4>
                <span style={{ fontSize: '12px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {item.read_time || '3 min read'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
