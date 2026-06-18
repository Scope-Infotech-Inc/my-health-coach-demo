'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

const SESSION_PREFIX = 'hteap-anim:';

export interface InView<T extends Element = Element> {
  /** Attach to the element to observe (usually the chart `<svg>` or wrapper). */
  ref: RefObject<T | null>;
  /** True once the element should show its animated-in (final) state. */
  animate: boolean;
  /**
   * True when the final state must render with no transition: the chart
   * already animated this session, or the user prefers reduced motion.
   * Components render `transition: none` (or 0ms durations) when set.
   */
  instant: boolean;
}

function hasPlayed(id: string): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_PREFIX + id) === '1';
  } catch {
    return false;
  }
}

function markPlayed(id: string): void {
  try {
    window.sessionStorage.setItem(SESSION_PREFIX + id, '1');
  } catch {
    // Storage unavailable (e.g. blocked) — worst case the animation replays.
  }
}

/**
 * Scroll-into-view animation trigger (PRD §8, DESIGN-BRIEF §6).
 *
 * - IntersectionObserver, threshold 0.35.
 * - Fires once per chart per session, keyed in sessionStorage by `id`.
 * - Elements already in the viewport on mount animate after a 150ms grace;
 *   elements scrolled into view later animate immediately.
 * - Reduced motion or an already-played id resolves to the final state with
 *   no transition (`instant`).
 */
export function useInView<T extends Element = Element>(id: string): InView<T> {
  const ref = useRef<T>(null);
  const [state, setState] = useState<{ animate: boolean; instant: boolean }>({
    animate: false,
    instant: false,
  });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || hasPlayed(id)) {
      markPlayed(id);
      setState({ animate: true, instant: true });
      return;
    }

    const el = ref.current;
    if (!el) return;

    const mountedAt = performance.now();
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        // First callback within ~a frame of observe() means the element was
        // already in the viewport on mount → apply the 150ms grace delay.
        const delay = performance.now() - mountedAt < 100 ? 150 : 0;
        timer = window.setTimeout(() => {
          markPlayed(id);
          setState({ animate: true, instant: false });
        }, delay);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [id]);

  return { ref, animate: state.animate, instant: state.instant };
}
