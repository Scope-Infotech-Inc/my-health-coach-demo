'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Resets scroll to the top of the page on forward route navigation.
 *
 * Next's App Router is meant to scroll to the top on navigation, but in this
 * app it does not fire — the window scroll position persists across route
 * changes, so a link followed from a scrolled-down page (e.g. clicking "My
 * Records" after scrolling through the dashboard sections) lands mid-page and
 * looks like it "went to the wrong place".
 *
 * We scroll to the top on each pathname change, with two carve-outs:
 *   • hash deep links into "/" (e.g. "/#care") are left to HashScroll, which
 *     aligns to the section instead of the top;
 *   • back/forward navigations are left alone so the browser can restore the
 *     prior scroll position.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const cameFromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      cameFromHistory.current = true;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (cameFromHistory.current) {
      cameFromHistory.current = false;
      return;
    } // back/forward: keep restored position
    if (location.hash) return; // hash deep link → HashScroll handles alignment
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
