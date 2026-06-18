'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { useApi, postApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { PageHeader, PlainWords, AICard, DemoNote, EmptyState } from '@/components/ui';
import { Button, Card, MetaChip } from '@/components/ds';
import { formatMediumDate, seededJitterMs } from '@/lib/demo-clock';
import { MockQrCode } from './_components/MockQrCode';
import styles from './share.module.css';

/* ---- API shapes (from app/api/.../share route headers) ---- */

interface ShareData {
  shareToken: string;
  bundle: string[];
  sessions: Array<{
    id: number;
    sharedWith: string | null;
    sharedOn: string | null;
    returned: boolean;
  }>;
}

interface ConsentData {
  revoked: boolean;
}

interface CheckinResult {
  shareId: number;
  sharedWith: string;
  bundle: string[];
  sharedOn: string;
}

interface ClinicalDocument {
  id: number;
  kind: string;
  title: string;
  docDate: string;
  sourceOrg: string;
  mime: string;
  fhirType: string;
  bodyText: string;
  aiRead: string | null;
}

interface ReturnResult {
  document: ClinicalDocument;
}

/* The org the simulated check-in POSTs to. This is request input only — it
 * is the `org` the checkin route requires in its body. It is never rendered:
 * the clinic name shown on screen always comes from the API response
 * (confirmed.sharedWith) or the prior session (priorSession.sharedWith). The
 * checkin route is idempotent per org, and for sarah this value matches the
 * seeded share row, so repeat clicks reuse one session. */
const CHECKIN_ORG = 'Lakeside Cardiology';

/* Scripted, deterministic check-in steps. Each duration is seeded off the
 * step key so it is identical every run (no Date.now / Math.random). */
const CHECKIN_STEPS = [
  { key: 'present', label: 'Showing your check-in code at the front desk' },
  { key: 'verify', label: 'The clinic is verifying your shared history bundle' },
  { key: 'load', label: 'Loading your records into their system' },
] as const;

type StepState = 'pending' | 'running' | 'complete';

export default function SharePage() {
  const { personaId, refreshData } = usePersona();
  const { pushToast } = useToast();

  const share = useApi<ShareData>(`/api/patients/${personaId}/share`);
  const consent = useApi<ConsentData>(`/api/patients/${personaId}/consent`);

  // Check-in flow state.
  const [running, setRunning] = useState(false);
  const [stepStates, setStepStates] = useState<StepState[]>(CHECKIN_STEPS.map(() => 'pending'));
  const [confirmed, setConfirmed] = useState<CheckinResult | null>(null);

  // Returned-visit-summary flow state.
  const [returning, setReturning] = useState(false);
  const [titration, setTitration] = useState<ClinicalDocument | null>(null);

  // Track timers so a persona swap mid-flow doesn't fire stale callbacks.
  const timers = useRef<number[]>([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  // Reset all transient flow state whenever the persona changes.
  useEffect(() => {
    clearTimers();
    setRunning(false);
    setStepStates(CHECKIN_STEPS.map(() => 'pending'));
    setConfirmed(null);
    setReturning(false);
    setTitration(null);
    return clearTimers;
  }, [personaId, clearTimers]);

  const runCheckin = useCallback(() => {
    if (running) return;
    clearTimers();
    setConfirmed(null);
    setTitration(null);
    setRunning(true);
    setStepStates(CHECKIN_STEPS.map((_, i) => (i === 0 ? 'running' : 'pending')));

    let elapsed = 0;
    CHECKIN_STEPS.forEach((step, i) => {
      const dur = seededJitterMs(`checkin:${personaId}:${step.key}`, 500, 900);
      elapsed += dur;
      const at = elapsed;
      timers.current.push(
        window.setTimeout(() => {
          setStepStates((prev) => {
            const next = [...prev];
            next[i] = 'complete';
            if (i + 1 < CHECKIN_STEPS.length) next[i + 1] = 'running';
            return next;
          });
        }, at)
      );
    });

    // After the last step completes, record the share and show confirmation.
    timers.current.push(
      window.setTimeout(() => {
        postApi<CheckinResult>('/api/share/checkin', {
          patientId: personaId,
          org: CHECKIN_ORG,
        })
          .then((res) => {
            setConfirmed(res);
            setRunning(false);
            refreshData();
            pushToast({
              tone: 'success',
              icon: 'how_to_reg',
              message: `Checked in at ${res.sharedWith}. No forms to fill out.`,
            });
          })
          .catch((err: unknown) => {
            setRunning(false);
            setStepStates(CHECKIN_STEPS.map(() => 'pending'));
            pushToast({
              tone: 'attention',
              icon: 'error',
              message: err instanceof Error ? err.message : 'Check-in could not be completed.',
            });
          });
      }, elapsed + 250)
    );
  }, [running, personaId, clearTimers, refreshData, pushToast]);

  const runReturnSummary = useCallback(() => {
    if (!confirmed || returning) return;
    setReturning(true);
    postApi<ReturnResult>('/api/share/return-summary', {
      patientId: personaId,
      shareId: confirmed.shareId,
    })
      .then((res) => {
        setTitration(res.document);
        setReturning(false);
        refreshData();
        pushToast({
          tone: 'success',
          icon: 'description',
          message: `${res.document.title} was added to your records.`,
        });
      })
      .catch((err: unknown) => {
        setReturning(false);
        pushToast({
          tone: 'attention',
          icon: 'error',
          message: err instanceof Error ? err.message : 'The visit summary could not be loaded.',
        });
      });
  }, [confirmed, returning, personaId, refreshData, pushToast]);

  /* ---- Render gates ---- */

  if (consent.data?.revoked) {
    return (
      <>
        <PageHeader
          eyebrow="My account"
          title="Share at check-in"
          lede="Show a code at the front desk to send your records, so you skip the clipboard."
        />
        <EmptyState
          icon="link_off"
          message="Your records are disconnected, so there is nothing to share yet. Reconnect to use share at check-in."
          actionLabel="Reconnect"
          onAction={() => {
            window.location.href = '/connect';
          }}
        />
      </>
    );
  }

  if (share.loading && !share.data) {
    return (
      <>
        <PageHeader
          eyebrow="My account"
          title="Share at check-in"
          lede="Show a code at the front desk to send your records, so you skip the clipboard."
        />
        <div className={styles.skelStack} aria-hidden="true">
          <div className={styles.skel} />
          <div className={styles.skel} />
        </div>
      </>
    );
  }

  if (share.error || !share.data) {
    return (
      <>
        <PageHeader
          eyebrow="My account"
          title="Share at check-in"
          lede="Show a code at the front desk to send your records, so you skip the clipboard."
        />
        <EmptyState
          icon="error"
          message="We could not load your share details. Try again in a moment."
          actionLabel="Try again"
          onAction={share.refetch}
        />
      </>
    );
  }

  const { shareToken, bundle, sessions } = share.data;
  const priorSession = sessions.find((s) => s.sharedOn && s.sharedWith);
  const allDone = stepStates.every((s) => s === 'complete');

  return (
    <>
      <PageHeader
        eyebrow="My account"
        title="Share at check-in"
        lede="Show one code at the front desk and your records go straight to the clinic — no clipboard, no re-typing."
      />

      <div className={styles.stack}>
        {/* QR card */}
        <Card>
          <h2 className={styles.cardTitle}>Your check-in code</h2>
          <div className={styles.qrLayout}>
            <MockQrCode token={shareToken} />
            <div className={styles.qrMeta}>
              <p className={styles.tokenLabel}>Mock token</p>
              <p className={styles.tokenValue}>{shareToken}</p>
              <p className={styles.caption}>Demo QR — encodes a mock token, no real health data.</p>
            </div>
          </div>
          <DemoNote icon="qr_code_2">
            Demo — this code is a simulated stand-in. It carries a mock token only, never your
            health information.
          </DemoNote>
        </Card>

        {/* What you'd share */}
        <Card>
          <h2 className={styles.cardTitle}>What you would share</h2>
          <PlainWords>
            The clinic would receive a read-only copy of{' '}
            <strong>{bundle.length} parts of your record</strong>, scoped to what you have consented
            to share.
          </PlainWords>
          <ul className={styles.shareList}>
            {bundle.map((item) => (
              <li key={item} className={styles.shareItem}>
                <span className={`material-symbols-outlined ${styles.tick}`} aria-hidden="true">
                  check_circle
                </span>
                <span className={styles.text}>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Simulate check-in */}
        <Card>
          <h2 className={styles.cardTitle}>Try it</h2>
          {!confirmed && (
            <>
              <PlainWords>
                Walk through a check-in to see how your records arrive at the front desk{' '}
                <strong>before you do</strong> — no clipboard to fill out.
              </PlainWords>
              <ol className={styles.steps} aria-live="polite">
                {CHECKIN_STEPS.map((step, i) => {
                  const state = stepStates[i];
                  const icon =
                    state === 'complete'
                      ? 'check_circle'
                      : state === 'running'
                        ? 'progress_activity'
                        : 'radio_button_unchecked';
                  const iconTone =
                    state === 'complete'
                      ? styles.complete
                      : state === 'running'
                        ? styles.running
                        : styles.pending;
                  return (
                    <li
                      key={step.key}
                      className={`${styles.step} ${
                        state === 'complete'
                          ? styles.done
                          : state === 'running'
                            ? styles.active
                            : ''
                      }`}
                    >
                      <span
                        className={
                          state === 'running'
                            ? `material-symbols-outlined ${styles.stepIcon} ${iconTone} ${styles.spin}`
                            : `material-symbols-outlined ${styles.stepIcon} ${iconTone}`
                        }
                        aria-hidden="true"
                      >
                        {icon}
                      </span>
                      {step.label}
                    </li>
                  );
                })}
              </ol>
              <Button
                variant="accent"
                icon="qr_code_scanner"
                onClick={runCheckin}
                disabled={running}
              >
                {running ? 'Checking in…' : 'Simulate check-in'}
              </Button>
              {priorSession?.sharedOn && !running && !allDone && (
                <p className={styles.sessionNote}>
                  <span
                    className={`material-symbols-outlined ${styles.sessionIcon}`}
                    aria-hidden="true"
                  >
                    history
                  </span>
                  Last shared with {priorSession.sharedWith} on{' '}
                  {formatMediumDate(priorSession.sharedOn.slice(0, 10))}.
                </p>
              )}
            </>
          )}

          {confirmed && (
            <>
              <div className={styles.confirmHead}>
                <span
                  className={`material-symbols-outlined ${styles.confirmIcon}`}
                  aria-hidden="true"
                >
                  check_circle
                </span>
                <p className={styles.confirmOrg}>Checked in at {confirmed.sharedWith}</p>
              </div>
              <PlainWords>
                Your history bundle reached the clinic. You shared{' '}
                <strong>{confirmed.bundle.length} parts of your record</strong> and filled out no
                paper forms.
              </PlainWords>
              <p className={styles.manifestLabel}>Shared with {confirmed.sharedWith}</p>
              <div className={styles.chipRow}>
                {confirmed.bundle.map((item) => (
                  <MetaChip key={item}>{item}</MetaChip>
                ))}
              </div>
              <p className={styles.auditNote}>
                <span
                  className={`material-symbols-outlined ${styles.auditIcon}`}
                  aria-hidden="true"
                >
                  receipt_long
                </span>
                <span>
                  Logged to your audit trail on {formatMediumDate(confirmed.sharedOn.slice(0, 10))}:{' '}
                  {confirmed.sharedWith} read your shared history for treatment. You can review and
                  revoke this on Data &amp; Consent.
                </span>
              </p>
            </>
          )}
          <DemoNote icon="badge">
            Demo — the clinic, the check-in, and this exchange are simulated. No real health data
            leaves your device.
          </DemoNote>
        </Card>

        {/* Returned visit summary */}
        {confirmed && (
          <Card>
            <h2 className={styles.cardTitle}>After your visit</h2>
            {!titration ? (
              <>
                <p className={styles.returnHint}>
                  When the clinic finishes, they send a visit summary back to your record —
                  automatically, so you keep one copy of everything.
                </p>
                <div className={styles.returnRow}>
                  <Button
                    variant="secondary"
                    icon="download"
                    onClick={runReturnSummary}
                    disabled={returning}
                  >
                    {returning ? 'Receiving summary…' : 'Receive visit summary'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <PlainWords>
                  <strong>{titration.title}</strong> arrived from {titration.sourceOrg} and was
                  saved to your records, dated {formatMediumDate(titration.docDate)}.
                </PlainWords>
                {titration.aiRead && (
                  <AICard
                    title="What this summary means"
                    basis={[
                      `${titration.title}`,
                      `Received ${formatMediumDate(titration.docDate)} from ${titration.sourceOrg}`,
                    ]}
                    escalationLabel="Ask my care team"
                    onEscalate={() =>
                      pushToast({
                        icon: 'forum',
                        message: 'Your question was sent to your care team. Demo — simulated.',
                      })
                    }
                  >
                    <p>{titration.aiRead}</p>
                  </AICard>
                )}
                <DemoNote icon="science">
                  Demo — this visit summary and its plain-language read are simulated, not medical
                  advice.
                </DemoNote>
              </>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
