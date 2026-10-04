import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroItem {
  tag: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  gradient: string;
}

export interface HeroCarouselProps {
  items: HeroItem[];
  onCta: (item: HeroItem, index: number) => void;
  intervalMs?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  onCta,
  intervalMs = 6000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Clamp activeIndex if items change or index is out of bounds
  useEffect(() => {
    if (items.length > 0 && activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [items.length, activeIndex]);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Autoplay timer effect
  useEffect(() => {
    if (items.length <= 1 || isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      handleNext();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [items.length, isPaused, prefersReducedMotion, intervalMs, handleNext]);

  // Keyboard accessibility: Left / Right arrows
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (items.length <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Image preloader / error detection
  const handleImageError = (imageSrc: string) => {
    setFailedImages((prev) => ({ ...prev, [imageSrc]: true }));
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentHero = items[activeIndex] || items[0];
  const hasImageFailed = failedImages[currentHero.image];
  const backgroundStyle = hasImageFailed
    ? currentHero.gradient
    : `${currentHero.gradient}, url(${currentHero.image})`;

  return (
    <section
      ref={containerRef}
      className="sponsored-hero"
      aria-roledescription="carousel"
      aria-label="Featured events"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      style={{
        minHeight: 'clamp(380px, 56vh, 560px)',
        background: backgroundStyle,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Off-screen image to test load failure */}
      {currentHero.image && !hasImageFailed && (
        <img
          src={currentHero.image}
          alt=""
          style={{ display: 'none' }}
          aria-hidden="true"
          onError={() => handleImageError(currentHero.image)}
        />
      )}

      <div className="hero-content-wrap">
        <span className="sponsored-tag">{currentHero.tag}</span>
        <h1 className="hero-title-main">{currentHero.title}</h1>
        <p className="hero-desc-main">{currentHero.description}</p>
        <button
          type="button"
          className="btn-cta"
          onClick={() => onCta(currentHero, activeIndex)}
        >
          {currentHero.cta}
        </button>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            className="hero-nav-arrow hero-nav-prev"
            aria-label="Previous slide"
            onClick={handlePrev}
          >
            <ChevronLeft size={20} color="#FFF" />
          </button>
          <button
            type="button"
            className="hero-nav-arrow hero-nav-next"
            aria-label="Next slide"
            onClick={handleNext}
          >
            <ChevronRight size={20} color="#FFF" />
          </button>

          <div className="hero-switcher-dots" role="tablist" aria-label="Slide selectors">
            {items.map((it, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                className={`hero-dot ${idx === activeIndex ? 'active' : ''}`}
                aria-selected={idx === activeIndex}
                aria-label={`Go to slide ${idx + 1}: ${it.title}`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
