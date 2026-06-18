'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DASHBOARD_SECTIONS } from './nav';

// Seed the highlight before paint so a cross-route hash click never paints a
// stale "overview" frame. The sidebar/tabs only ever render client-side (the
// shell shows a skeleton until the viewport resolves), so the layout effect is
// safe; fall back to useEffect on the server to silence the SSR warning.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Dashboard scroll-spy: tracks which [data-section] is most visible on "/"
 * so the sidebar/tabs mark the active section (aria-current). Returns null
 * off the dashboard.
 *
 * Navigation intent wins over the observer during a transition. When a
 * "/#section" link is followed (or the page cold-loads on one), we highlight
 * that section immediately and ignore the observer until the user actually
 * scrolls. Otherwise the dashboard's skeleton sections grow as their data
 * arrives, and the reflow momentarily reports the section *above* the target
 * as most-visible — so the highlight flashed through it (e.g. Trends before
 * Care) before settling. The first manual scroll hands control back to the
 * observer so scroll-spy works normally thereafter.
 *
 * Intent is asserted two ways: `assertSection` (returned for nav items to call
 * on click) and the `hashchange`/`popstate` listeners. The click path is the
 * one that matters for same-page section clicks — Next's App Router routes a
 * "/#section" <Link> through history.pushState, which fires neither event, so
 * the listeners alone never see it; the listeners still cover browser
 * back/forward. Both seed the same lock + active state.
 */
function hashSection(): string | null {
  if (typeof window === 'undefined' || !window.location.hash) return null;
  const id = decodeURIComponent(window.location.hash.slice(1));
  return (DASHBOARD_SECTIONS as readonly string[]).includes(id) ? id : null;
}

export interface ScrollSpy {
  /** Active dashboard section on "/", or null off the dashboard. */
  active: string | null;
  /** Assert a section as active (call on a section nav-item click). Holds the
   *  highlight until the first manual scroll, like a hash navigation would. */
  assertSection: (id: string) => void;
}

export function useScrollSpy(): ScrollSpy {
  const pathname = usePathname();
  // Seed from the hash so the first paint already matches the navigated
  // section (no "overview" flash on a cold load of "/#care").
  const [active, setActive] = useState<string | null>(() => hashSection());
  // Intent lock: while engaged, the observer cannot repaint the highlight. A
  // ref so the click-driven assertSection and the effect's observer/listeners
  // all share one source of truth across renders.
  const lockedToHash = useRef(false);

  const assertSection = useCallback((id: string) => {
    lockedToHash.current = true;
    setActive(id);
  }, []);

  useIsoLayoutEffect(() => {
    if (pathname !== '/') {
      lockedToHash.current = false;
      setActive(null);
      return;
    }

    // Re-baseline on each arrival at "/"; lockToHash re-engages it if we
    // landed on a "/#section" hash.
    lockedToHash.current = false;
    const lockToHash = () => {
      const id = hashSection();
      if (id) {
        lockedToHash.current = true;
        setActive(id);
      }
    };
    const releaseLock = () => {
      lockedToHash.current = false;
    };
    const userEvents = ['wheel', 'touchmove', 'keydown'] as const;

    lockToHash(); // assert intent from the hash this navigation arrived on

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.section!;
          visibility.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        if (lockedToHash.current) return; // intent holds until the user takes over
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: '-96px 0px -40% 0px', threshold: [0.1, 0.3, 0.6] }
    );
    sections.forEach((s) => observer.observe(s));

    // Browser back/forward to a "/#section" re-asserts intent (same-page link
    // clicks come through assertSection instead, since Next fires no hash
    // event); the first manual scroll releases the lock and the observer resumes.
    window.addEventListener('hashchange', lockToHash);
    window.addEventListener('popstate', lockToHash);
    userEvents.forEach((e) => window.addEventListener(e, releaseLock, { passive: true }));

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', lockToHash);
      window.removeEventListener('popstate', lockToHash);
      userEvents.forEach((e) => window.removeEventListener(e, releaseLock));
    };
  }, [pathname]);

  // "overview" is the genuine top-of-page default only when there's no hash
  // intent and the observer hasn't reported yet.
  return { active: pathname === '/' ? (active ?? 'overview') : null, assertSection };
}
