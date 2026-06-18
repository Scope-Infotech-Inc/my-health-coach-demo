'use client';

import React from 'react';
import styles from './HeaderChrome.module.css';

/**
 * Presentational chrome shared by the desktop header and the mobile app bar
 * (DESIGN-BRIEF §4). All pieces sit on a navy surface. Pure — the parent
 * fetches persona data and passes plain values in.
 */

/** Navy-on-navy reads poorly, so on the navy bar the mark inverts: white
 *  square, navy glyph (DESIGN-BRIEF §2). */
export function BrandMark() {
  return (
    <span className={styles.brand}>
      <span className={styles.brandMark} aria-hidden="true">
        <span className="material-symbols-outlined is-filled">account_balance</span>
      </span>
      <span className={styles.brandText}>
        <span className={styles.brandEyebrow}>Concept Demo</span>
        <span className={styles.brandName}>My Health Coach</span>
      </span>
    </span>
  );
}

/** Gold-tick date chip — the header instance of the "now" thread. */
export function DateChip({ label }: { label: string }) {
  return (
    <span className={styles.chip}>
      <span className={styles.goldTick} aria-hidden="true" />
      <span className="tabular">{label}</span>
    </span>
  );
}

export function SyncChip({ label, syncing }: { label: string; syncing?: boolean }) {
  return (
    <span className={styles.chip}>
      <span
        className={`material-symbols-outlined ${styles.chipIcon} ${syncing ? styles.spin : ''}`}
        aria-hidden="true"
      >
        {syncing ? 'sync' : 'cloud_done'}
      </span>
      <span>{label}</span>
    </span>
  );
}

export function IdentityChip({
  ial,
  aal,
  name,
  revoked,
}: {
  ial?: string;
  aal?: string;
  name?: string;
  revoked?: boolean;
}) {
  if (revoked) {
    return (
      <span className={`${styles.chip} ${styles.chipMuted}`}>
        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 16 }}>
          link_off
        </span>
        <span>Disconnected</span>
      </span>
    );
  }
  return (
    <span className={styles.chip}>
      <span
        className="material-symbols-outlined"
        aria-hidden="true"
        style={{ fontSize: 16, color: 'var(--sky-tint)' }}
      >
        verified_user
      </span>
      {ial && aal && (
        <span className={styles.chipStrong}>
          {ial} · {aal}
        </span>
      )}
      {name && <span>{name}</span>}
    </span>
  );
}
