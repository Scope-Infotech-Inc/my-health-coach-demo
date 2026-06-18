'use client';

import { useEffect, useRef, useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { DEFAULT_PERSONA } from '@/lib/personas';
import { postApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { signOutToLogin } from './IdentityGate';
import styles from './DemoControls.module.css';

/** Dispatched when the presenter replays the active alert; the Overview
 *  remounts its banner so screen readers re-announce and it re-animates. */
export const REPLAY_ALERT_EVENT = 'hteap:replay-alert';

interface AwardResult {
  badge: { name: string };
  alreadyEarned?: boolean;
}

/**
 * Presenter demo controls (DESIGN-BRIEF §1, §4): replay the alert, earn a
 * badge, reset the demo. A small popover in the proscenium. Each action
 * drives a deterministic seam and a confirming toast; mutations bump
 * dataVersion so every view refetches without a reload. Reset also signs the
 * user out and returns to the initial login screen.
 */
export function DemoControls() {
  const { personaId, refreshData, setPersonaId } = usePersona();
  const { pushToast } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const replayAlert = () => {
    window.dispatchEvent(new CustomEvent(REPLAY_ALERT_EVENT));
    pushToast({
      tone: 'attention',
      icon: 'campaign',
      message: 'Alert replayed — see the banner on Overview.',
    });
    setOpen(false);
  };

  const earnBadge = async () => {
    setBusy(true);
    try {
      const res = await postApi<AwardResult>('/api/gamification/award', { patientId: personaId });
      refreshData();
      pushToast({
        tone: 'success',
        icon: 'military_tech',
        message: res.alreadyEarned
          ? `Already earned: ${res.badge.name}.`
          : `Badge earned: ${res.badge.name}.`,
      });
    } catch (err) {
      pushToast({
        tone: 'attention',
        icon: 'error',
        message: err instanceof Error ? err.message : 'Could not award a badge.',
      });
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  const resetDemo = async () => {
    setBusy(true);
    try {
      await postApi('/api/demo/reset');
      setPersonaId(DEFAULT_PERSONA); // back to the featured persona (also writes localStorage)
      refreshData(); // revalidate every view against the fresh seed
      signOutToLogin(); // clear sign-in + show the initial login screen
    } catch (err) {
      pushToast({
        tone: 'attention',
        icon: 'error',
        message: err instanceof Error ? err.message : 'Reset failed.',
      });
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          tune
        </span>
        Demo controls
        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 16 }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={replayAlert}
            disabled={busy}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              campaign
            </span>
            Replay alert
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={earnBadge}
            disabled={busy}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              military_tech
            </span>
            Earn a badge
          </button>
          <div className={styles.divider} />
          <button
            type="button"
            role="menuitem"
            className={`${styles.item} ${styles.danger}`}
            onClick={resetDemo}
            disabled={busy}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              restart_alt
            </span>
            Reset demo
          </button>
        </div>
      )}
    </div>
  );
}
