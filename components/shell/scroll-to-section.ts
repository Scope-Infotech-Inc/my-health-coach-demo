/**
 * Smooth, reflow-tolerant scroll to a dashboard section.
 *
 * All six "/" sections live on one scrolling page, so navigating between them
 * is a scroll, not a route change. We want that scroll to glide, and to keep
 * gliding correctly while the page is still growing — the dashboard's skeleton
 * sections fetch their data and expand after mount, which pushes a target down.
 * A fixed-duration tween bakes in a start/end at t0 and judders (or lands short)
 * when the target moves; instead the rAF loop re-reads the target's live
 * position every frame and eases toward wherever it is *now*, so the glide
 * simply re-aims as sections grow — one continuous motion, not the old staccato
 * of instant re-pins.
 *
 * The catch: the dashboard's data arrives in bursts (one fetch per section), so
 * a glide can reach its target during a lull and then more content loads above
 * it, shifting the target down. The rAF loop alone would have already settled
 * and stopped, undershooting. So we also watch the document with a
 * ResizeObserver and re-launch the glide on any growth, until the user scrolls
 * or a hard ceiling — the same lifecycle the old instant-pin used, but each
 * (re)alignment runs through the smooth loop. (Chart animations use only
 * transform/opacity/width and don't resize the document, so the observer stays
 * quiet for them.)
 *
 * It's a module-level singleton, deliberately not a hook: HashScroll is mounted
 * twice (the desktop and mobile branches of AppShell), and a live 880px resize
 * swaps them. One shared loop guarantees those can never run competing
 * animations — any new scrollToSection() supersedes the in-flight one.
 *
 * prefers-reduced-motion is honored: those users get the final position
 * immediately (still re-tracked through reflow), no animation.
 */

const SETTLE_PX = 1; // |delta| at/under this counts as "arrived"
const STABLE_FRAMES = 3; // arrived AND target unmoved this many frames → stop animating
const CEILING_MS = 10000; // absolute backstop, mirrors the old HashScroll ceiling
const APPROACH = 0.18; // fraction of the remaining gap closed per frame (~300ms feel)
const MIN_STEP_PX = 0.5; // floor so the easing tail doesn't crawl sub-pixel forever

let cleanup: (() => void) | null = null;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Live scroll target for `el`: its top, less its scroll-margin, clamped to the
 *  scrollable range. Recomputed every frame so reflow is tracked. */
function targetTop(el: HTMLElement): number {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const absTop = el.getBoundingClientRect().top + window.scrollY;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(Math.max(absTop - margin, 0), maxScroll);
}

function stop(): void {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
}

/**
 * Glide the window to the section with the given id. No-ops (until the next
 * frame) if the element isn't in the DOM yet — so a cross-route arrival can
 * call this while the dashboard is still mounting and it picks up once the
 * section renders. Re-aims as late content reflows the page, and hands control
 * back to the user on the first manual scroll.
 */
export function scrollToSection(id: string): void {
  if (typeof window === 'undefined') return;

  stop(); // supersede any in-flight glide — single active loop invariant

  const reduced = prefersReducedMotion();
  const startedAt = performance.now();
  let raf: number | null = null;
  let stopped = false;
  let settledFrames = 0;
  let lastWant = Number.NaN;

  const frame = () => {
    raf = null;
    if (stopped) return;
    if (performance.now() - startedAt > CEILING_MS) return stop();

    const el = document.getElementById(id);
    // Not mounted yet (cold load / cross-route mid-mount): keep the loop alive
    // and retry next frame.
    if (!el) {
      raf = requestAnimationFrame(frame);
      return;
    }

    const want = targetTop(el);
    const cur = window.scrollY;
    const delta = want - cur;
    const stable = Math.abs(want - lastWant) <= SETTLE_PX; // target stopped moving
    lastWant = want;

    // Arrived and the target has stopped moving: snap exact and stop animating.
    // The ResizeObserver stays armed, so late-loading content re-launches us.
    if (Math.abs(delta) <= SETTLE_PX && stable) {
      if (++settledFrames >= STABLE_FRAMES) {
        window.scrollTo(0, want);
        return;
      }
    } else {
      settledFrames = 0;
    }

    if (reduced) {
      window.scrollTo(0, want); // no animation; still re-tracks reflow until settled
    } else {
      let step = delta * APPROACH;
      if (Math.abs(step) < MIN_STEP_PX)
        step = Math.sign(delta) * Math.min(MIN_STEP_PX, Math.abs(delta));
      window.scrollTo(0, cur + step);
    }

    raf = requestAnimationFrame(frame);
  };

  const startGlide = () => {
    if (stopped || raf !== null) return; // already animating
    settledFrames = 0; // re-evaluate arrival from scratch on each (re)launch
    raf = requestAnimationFrame(frame);
  };

  // Any document growth (a section's data arriving) re-aims the glide so it
  // never undershoots a target that loaded above it after we'd settled.
  const observer = new ResizeObserver(() => startGlide());
  observer.observe(document.body);
  observer.observe(document.documentElement);

  const onUserScroll = () => stop(); // wheel/touch/key → yield to the user at once
  const userEvents = ['wheel', 'touchmove', 'keydown'] as const;
  userEvents.forEach((e) => window.addEventListener(e, onUserScroll, { passive: true }));

  const ceiling = window.setTimeout(stop, CEILING_MS);

  cleanup = () => {
    stopped = true;
    if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    observer.disconnect();
    window.clearTimeout(ceiling);
    userEvents.forEach((e) => window.removeEventListener(e, onUserScroll));
  };

  startGlide();
}
