import React from 'react';
import styles from './EmptyState.module.css';

/**
 * Empty / disconnected state (DESIGN-BRIEF §5): icon in a sky circle, one
 * plain sentence, and a primary recovery action. Never a bare blank — used
 * after consent revoke and for any unconnected feature.
 */
export function EmptyState({
  icon = 'link_off',
  message,
  actionLabel,
  onAction,
  children,
}: {
  icon?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.empty}>
      <span className={styles.circle} aria-hidden="true">
        <span className="material-symbols-outlined">{icon}</span>
      </span>
      <p className={styles.message}>{message}</p>
      {actionLabel && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {children}
    </div>
  );
}
