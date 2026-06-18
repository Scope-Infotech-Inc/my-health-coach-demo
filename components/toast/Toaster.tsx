'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import styles from './Toaster.module.css';

/**
 * Floating toasts (DESIGN-BRIEF §5): navy surface, icon + sentence, close
 * button, 5s auto-dismiss, aria-live="polite". Bottom-right on desktop,
 * above the tab bar on mobile (CSS).
 */

export interface Toast {
  id: number;
  icon?: string;
  message: string;
  tone?: 'default' | 'success' | 'attention';
}

interface ToastContextValue {
  pushToast: (t: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = nextId.current++;
      setToasts((ts) => [...ts.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} className={styles.toast}>
            <span
              className={`material-symbols-outlined ${styles.icon} ${t.tone === 'attention' ? styles.gold : ''}`}
              aria-hidden="true"
            >
              {t.icon ?? (t.tone === 'success' ? 'check_circle' : 'info')}
            </span>
            <p className={styles.message}>{t.message}</p>
            <button
              type="button"
              className={styles.close}
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
