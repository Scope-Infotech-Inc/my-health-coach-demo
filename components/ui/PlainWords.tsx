import React from 'react';
import styles from './PlainWords.module.css';

/**
 * The "words first" status line (DESIGN-BRIEF §1, §5): one plain-language
 * body-lg sentence that summarizes a section's data before any chart. Wrap
 * the key fact in <strong> for the bold clause. Derived from API data —
 * never hardcoded copy.
 */
export function PlainWords({
  children,
  tone = 'default',
}: {
  children: React.ReactNode;
  tone?: 'default' | 'muted';
}) {
  return <p className={`${styles.line} ${tone === 'muted' ? styles.muted : ''}`}>{children}</p>;
}
