import React from 'react';
import styles from './AICard.module.css';

/**
 * AI surface (DESIGN-BRIEF §5): every AI-generated element carries the AI
 * badge ("AI-generated — not clinical judgment"), the basis it drew on, and
 * an escalation action. A 4px gold left rule marks attention severity.
 */
export function AICard({
  title,
  children,
  basis,
  severity = 'info',
  escalationLabel = 'Ask my care team',
  onEscalate,
  footer,
}: {
  title?: string;
  children?: React.ReactNode;
  basis?: string[];
  severity?: 'info' | 'attention';
  escalationLabel?: string;
  onEscalate?: () => void;
  footer?: React.ReactNode;
}) {
  return (
    <article className={`${styles.card} ${severity === 'attention' ? styles.attention : ''}`}>
      <AIBadge />
      {title && <h3 className={styles.title}>{title}</h3>}
      {children && <div className={styles.body}>{children}</div>}
      {basis && basis.length > 0 && (
        <p className={styles.basis}>
          <span className="material-symbols-outlined" aria-hidden="true">
            database
          </span>
          Based on: {basis.join(' · ')}
        </p>
      )}
      <div className={styles.actions}>
        <button type="button" className={styles.escalate} onClick={onEscalate}>
          <span className="material-symbols-outlined" aria-hidden="true">
            forum
          </span>
          {escalationLabel}
        </button>
        {footer}
      </div>
    </article>
  );
}

/** The standalone AI provenance pill, for inline use (assistant answers,
 *  document reads). */
export function AIBadge() {
  return (
    <span className={styles.badge}>
      <span className="material-symbols-outlined" aria-hidden="true">
        smart_toy
      </span>
      AI-generated — not clinical judgment
    </span>
  );
}
