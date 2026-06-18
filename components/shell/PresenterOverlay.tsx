'use client';

import { useEffect, useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { JOURNEY_START_EVENT } from './JourneyStepper';
import { useApi } from '@/lib/use-api';
import styles from './PresenterOverlay.module.css';

interface JourneyData {
  steps: Array<{ stepNo: number }>;
}

/** Demo beats — presenter notes, not patient data, so static copy is fine. */
const BEATS: { icon: string; title: string; detail: string }[] = [
  {
    icon: 'switch_account',
    title: 'Swap personas',
    detail: 'Use the “Viewing as” menu — every view refetches instantly, no reload.',
  },
  {
    icon: 'aspect_ratio',
    title: 'Resize the window',
    detail: 'Cross 880px to switch live between the desktop dashboard and the mobile app.',
  },
  {
    icon: 'sync',
    title: 'Sync the network',
    detail: 'On Data & Consent, “Sync now” simulates an Aligned Network pull.',
  },
  {
    icon: 'campaign',
    title: 'Replay the alert',
    detail: 'Demo controls → Replay alert re-announces the Overview banner.',
  },
  {
    icon: 'shield_person',
    title: 'Revoke & reconnect',
    detail: 'Revoke all access to show the disconnected empty states, then reconnect.',
  },
];

const KEYS = [
  { key: '?', label: 'Toggle this guide' },
  { key: 'Esc', label: 'Close' },
];

/**
 * Presenter overlay (DESIGN-BRIEF §7): a floating guide listing the demo
 * script and the guided walkthrough launcher. Opened by the proscenium “?”
 * button or the “?” key; Esc closes. Hidden from tab order until opened.
 */
export function PresenterOverlay() {
  const { personaId } = usePersona();
  const [open, setOpen] = useState(false);
  const { data } = useApi<JourneyData>(`/api/patients/${personaId}/journey`);
  const hasJourney = (data?.steps?.length ?? 0) > 0;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing =
        t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '?' && !typing) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Presenter guide"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {open ? 'close' : 'help'}
        </span>
      </button>

      {open && (
        <aside className={styles.panel} role="dialog" aria-label="Presenter guide">
          <p className={styles.eyebrow}>Presenter guide</p>
          <h2 className={styles.heading}>Run the demo</h2>
          <ul className={styles.beats}>
            {BEATS.map((b) => (
              <li key={b.title} className={styles.beat}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {b.icon}
                </span>
                <span>
                  <span className={styles.beatTitle}>{b.title}</span>
                  <span className={styles.beatDetail}>{b.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          {hasJourney && (
            <button
              type="button"
              className={styles.journey}
              onClick={() => {
                window.dispatchEvent(new CustomEvent(JOURNEY_START_EVENT));
                setOpen(false);
              }}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                play_circle
              </span>
              Run the guided walkthrough
            </button>
          )}

          <div className={styles.keys}>
            {KEYS.map((k) => (
              <span key={k.key} className={styles.key}>
                <kbd>{k.key}</kbd> {k.label}
              </span>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}
