import React from 'react';
import styles from './PageHeader.module.css';

/**
 * Sub-route page header (DESIGN-BRIEF §4): eyebrow + the page's single h1 +
 * an optional plain-language lede and right-aligned actions. Sub-routes keep
 * the shell and use this to title their single-column content.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
