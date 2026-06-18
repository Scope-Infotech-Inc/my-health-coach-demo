'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** SSR snapshot: assume motion until mounted; the global CSS media query is the backstop. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Live `prefers-reduced-motion: reduce` flag (PRD §8: mandatory — skip all
 * animation and render final state immediately). The media query in
 * globals.css kills CSS transitions; this hook covers JS-driven animation
 * (rAF count-ups, scripted steppers) and state-driven transitions.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
