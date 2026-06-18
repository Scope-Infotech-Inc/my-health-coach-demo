'use client';

import React from 'react';
import styles from './StatusBanner.module.css';

/**
 * Overview status banner (DESIGN-BRIEF §5): full-width card with a 4px left
 * rule in the severity color, an icon chip, a title and plain-language body,
 * and an optional CTA. Severities come from the seed (red · gold · attention
 * · sky · info). It is an aria-live region so a replayed alert announces.
 */

export type BannerSeverity = 'red' | 'gold' | 'attention' | 'sky' | 'info';

interface SeverityMeta {
  cls: string;
  icon: string;
  accentCta: boolean;
}

const SEVERITY: Record<BannerSeverity, SeverityMeta> = {
  red: { cls: 'red', icon: 'error', accentCta: false },
  gold: { cls: 'gold', icon: 'warning', accentCta: true },
  attention: { cls: 'gold', icon: 'warning', accentCta: true },
  sky: { cls: 'sky', icon: 'lightbulb', accentCta: false },
  info: { cls: 'sky', icon: 'info', accentCta: false },
};

export function StatusBanner({
  severity,
  title,
  body,
  ctaLabel,
  onCta,
  careTeamNotified = false,
}: {
  severity: string;
  title: string;
  body: string;
  ctaLabel?: string;
  onCta?: () => void;
  careTeamNotified?: boolean;
}) {
  const meta = SEVERITY[severity as BannerSeverity] ?? SEVERITY.info;
  return (
    <div className={`${styles.banner} ${styles[meta.cls]}`} role="status" aria-live="polite">
      <span className={styles.iconChip} aria-hidden="true">
        <span className="material-symbols-outlined">{meta.icon}</span>
      </span>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.body}>{body}</p>
        {careTeamNotified && (
          <p className={styles.notified}>
            <span className="material-symbols-outlined" aria-hidden="true">
              verified
            </span>
            Your care team has been notified.
          </p>
        )}
        {ctaLabel && (
          <button
            type="button"
            className={`${styles.cta} ${meta.accentCta ? styles.ctaAccent : styles.ctaPrimary}`}
            onClick={onCta}
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
