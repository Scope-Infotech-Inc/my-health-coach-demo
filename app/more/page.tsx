'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader, DemoNote } from '@/components/ui';
import { MORE_ITEMS } from '@/components/shell/nav';
import { REPLAY_ALERT_EVENT } from '@/components/shell/DemoControls';
import { signOutToLogin } from '@/components/shell/IdentityGate';
import { usePersona } from '@/lib/persona-context';
import { DEFAULT_PERSONA } from '@/lib/personas';
import { postApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import styles from './more.module.css';

interface AwardResult {
  badge: { name: string };
  alreadyEarned?: boolean;
}

/**
 * Mobile "More" screen (DESIGN-BRIEF §4, §7). A plain grouped list: every
 * MORE_ITEM links to its route as a row (sky-tint icon chip · label · chevron),
 * followed by a "Demo controls" group whose three rows reuse the exact seams
 * the proscenium DemoControls drive — replay the alert, earn a badge, reset
 * the demo. Each control bumps dataVersion (via refreshData) and confirms with
 * a toast so every view revalidates without a reload; Reset also signs you out
 * to the initial login screen. Also usable on desktop.
 */
export default function MorePage() {
  const { personaId, refreshData, setPersonaId } = usePersona();
  const { pushToast } = useToast();
  const [busy, setBusy] = useState(false);

  const replayAlert = () => {
    window.dispatchEvent(new CustomEvent(REPLAY_ALERT_EVENT));
    pushToast({
      tone: 'attention',
      icon: 'campaign',
      message: 'Alert replayed — see the banner on Overview.',
    });
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
    }
  };

  const demoControls = [
    {
      key: 'replay',
      icon: 'campaign',
      label: 'Replay alert',
      sub: 'Re-announce the current alert on Overview',
      onClick: replayAlert,
      danger: false,
    },
    {
      key: 'earn',
      icon: 'military_tech',
      label: 'Earn a badge',
      sub: 'Mark the next reward as earned',
      onClick: earnBadge,
      danger: false,
    },
    {
      key: 'reset',
      icon: 'restart_alt',
      label: 'Reset demo',
      sub: 'Restore the starting state and return to sign-in',
      onClick: resetDemo,
      danger: true,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="My Health Coach"
        title="More"
        lede="Everything else in the app, plus the controls a presenter uses to run the demo."
      />

      <nav className={styles.group} aria-label="More menu">
        <h2 className={styles.groupHeading}>Menu</h2>
        <ul className={styles.list}>
          {MORE_ITEMS.map((mi) => (
            <li key={mi.href} className={styles.item}>
              <Link className={styles.row} href={mi.href}>
                <span className={styles.chip}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {mi.icon}
                  </span>
                </span>
                <span className={styles.label}>{mi.label}</span>
                <span className={styles.chevron}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    chevron_right
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className={styles.group} aria-labelledby="more-demo-controls-heading">
        <h2 id="more-demo-controls-heading" className={styles.groupHeading}>
          Demo controls
        </h2>
        <ul className={styles.list}>
          {demoControls.map((dc) => (
            <li key={dc.key} className={styles.item}>
              <button type="button" className={styles.row} onClick={dc.onClick} disabled={busy}>
                <span className={`${styles.chip} ${dc.danger ? styles.chipDanger : ''}`}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {dc.icon}
                  </span>
                </span>
                <span className={styles.label}>
                  {dc.label}
                  <span className={styles.sub}>{dc.sub}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.note}>
          <DemoNote>Demo — these controls drive simulated events; no real records change.</DemoNote>
        </div>
      </section>
    </>
  );
}
