import React from 'react';
import styles from './DemoNote.module.css';

/**
 * Quiet inline honesty label (DESIGN-BRIEF §7): e.g. "Demo — simulated
 * provider responses", "Demo assistant — not medical advice". Sky-tinted,
 * low-emphasis, always visible where AI or simulated parties speak.
 */
export function DemoNote({
  children,
  icon = 'science',
}: {
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <p className={styles.note}>
      <span className="material-symbols-outlined" aria-hidden="true">
        {icon}
      </span>
      {children}
    </p>
  );
}
