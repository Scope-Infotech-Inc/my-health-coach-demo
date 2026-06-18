'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/lib/use-in-view';

/**
 * Stat-tile count-up (FR-19): 700ms from 0 to the value on first view per
 * session; reduced motion (or replay) renders the final value immediately.
 * Accepts display strings like '7.9%', '1,240', '146/90' — animates the
 * FIRST numeric run and preserves surrounding text.
 */
export function CountUp({ id, value }: { id: string; value: string }) {
  const { ref, animate, instant } = useInView<HTMLSpanElement>(`tile:${id}`);
  const [display, setDisplay] = useState<string>(instant ? value : value);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!animate) return;
    const match = value.match(/-?[\d,]+(\.\d+)?/);
    if (!match || instant) {
      setDisplay(value);
      return;
    }
    const numText = match[0];
    const target = parseFloat(numText.replaceAll(',', ''));
    const decimals = numText.includes('.') ? numText.split('.')[1].length : 0;
    const grouped = numText.includes(',');
    const start = performance.now();
    const dur = 700;

    const tick = (now: number) => {
      const f = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - f, 3);
      const current = target * eased;
      let text = current.toFixed(decimals);
      if (grouped) text = Number(text).toLocaleString('en-US', { minimumFractionDigits: decimals });
      setDisplay(value.replace(numText, text));
      if (f < 1) raf.current = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [animate, instant, value]);

  return <span ref={ref}>{display}</span>;
}
