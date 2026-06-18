import React from 'react';
import styles from './Section.module.css';

/**
 * Dashboard section (DESIGN-BRIEF §4): an eyebrow + headline-md title, the
 * scroll-spy anchor (`data-section`), and section content on the 64/40px
 * rhythm. Used by "/" for Overview…Consent.
 */
export function Section({
  id,
  eyebrow,
  title,
  action,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} data-section={id} aria-labelledby={headingId} className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}

/** Lighter header for sub-sections within a section (no scroll-spy anchor). */
export function SectionHeader({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className={styles.subhead}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h3 className={styles.subtitle}>{title}</h3>
    </div>
  );
}
