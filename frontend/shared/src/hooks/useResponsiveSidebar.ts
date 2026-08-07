import { useState, useEffect, useCallback } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'laptop' | 'desktop';
export type SidebarMode = 'expanded' | 'collapsed' | 'drawer';

const STORAGE_KEY = 'getvnt_sidebar_collapsed';

export function useResponsiveSidebar() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1400);
  const [userCollapsed, setUserCollapsed] = useState<boolean>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    return false;
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      // Auto-close drawer if resized to desktop
      if (window.innerWidth >= 1024) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Escape key to close mobile/tablet drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Determine active breakpoint
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isLaptop = width >= 1024 && width < 1280;
  const isDesktop = width >= 1280;

  const breakpoint: Breakpoint = isMobile
    ? 'mobile'
    : isTablet
    ? 'tablet'
    : isLaptop
    ? 'laptop'
    : 'desktop';

  // Effective collapsed state based on screen size and user preference
  const isCollapsed = isLaptop ? true : (isDesktop ? userCollapsed : false);

  const toggleSidebar = useCallback(() => {
    if (isMobile || isTablet) {
      setIsDrawerOpen((prev) => !prev);
    } else {
      setUserCollapsed((prev) => {
        const next = !prev;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, String(next));
        }
        return next;
      });
    }
  }, [isMobile, isTablet]);

  const toggleMobileDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const closeMobileDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return {
    width,
    breakpoint,
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isCollapsed,
    isDrawerOpen,
    toggleSidebar,
    toggleMobileDrawer,
    closeMobileDrawer,
  };
}
