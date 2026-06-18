'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToSection } from './scroll-to-section';

/**
 * Aligns a "/#section" deep link with its target. The sidebar and bottom tabs
 * link into "/" sections by hash; when that link is followed from another route
 * (or pasted as a cold-load URL), the sections above the target are still
 * skeleton-height and grow as their data arrives, which would otherwise leave
 * the viewport parked on the section above it.
 *
 * We delegate to scrollToSection, which glides to the target and re-reads its
 * position every frame — so as the dashboard reflows the scroll tracks the
 * target instead of drifting onto a neighbour (the old stutter), and the motion
 * stays smooth. It no-ops until the section element mounts, so this works even
 * while the dashboard is still rendering. The engine hands control back on the
 * first manual scroll and has its own ceiling, so there's nothing to tear down
 * here beyond dropping the hash listeners.
 *
 * Same-page section clicks are driven directly from the nav onClick (Next's
 * App Router routes a same-page "/#hash" <Link> through history.pushState,
 * firing neither hashchange nor popstate); the listeners here cover browser
 * back/forward and cold loads.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const alignToHash = () => {
      const id = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
      if (id) scrollToSection(id);
    };

    alignToHash(); // align on arrival at "/"
    window.addEventListener('hashchange', alignToHash);
    window.addEventListener('popstate', alignToHash);
    return () => {
      window.removeEventListener('hashchange', alignToHash);
      window.removeEventListener('popstate', alignToHash);
    };
  }, [pathname]);

  return null;
}
