'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 880px)';

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): 'desktop' | 'mobile' {
  return window.matchMedia(QUERY).matches ? 'desktop' : 'mobile';
}

/** SSR snapshot: undefined → render the neutral skeleton until mounted. */
function getServerSnapshot(): undefined {
  return undefined;
}

/**
 * Live 880px view switch (PRD §5). Resolves only on the client; callers
 * render a neutral skeleton while `undefined` to avoid hydration mismatch.
 * Swapping preserves React state above the switch (persona, scroll).
 */
export function useViewport(): 'desktop' | 'mobile' | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
