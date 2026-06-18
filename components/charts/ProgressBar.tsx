'use client';

import { useInView } from '@/lib/use-in-view';
import styles from './ProgressBar.module.css';

/**
 * Labeled progress bar (programs, nutrition, challenges): hairline track,
 * animated fill, tone-mapped color, optional milestone tick.
 */
export function ProgressBar({
  id,
  label,
  valueText,
  pct,
  tone = 'navy',
  milestonePct,
}: {
  id: string;
  label: string;
  valueText: string;
  /** 0–100 */
  pct: number;
  tone?: 'navy' | 'gold' | 'sky' | 'red' | 'success';
  /** Optional goal marker position 0–100. */
  milestonePct?: number;
}) {
  const { ref, animate, instant } = useInView<HTMLDivElement>(id);
  const clamped = Math.min(Math.max(pct, 0), 100);

  return (
    <div ref={ref} className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{valueText}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${valueText}`}
      >
        <div
          className={`${styles.fill} ${styles[tone]}`}
          style={{
            width: animate ? `${clamped}%` : '0%',
            transition: instant ? 'none' : 'width 600ms ease-out',
          }}
        />
        {milestonePct != null && (
          <span className={styles.milestone} style={{ left: `${Math.min(milestonePct, 100)}%` }} />
        )}
      </div>
    </div>
  );
}
