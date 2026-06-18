'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { postApi } from '@/lib/use-api';
import { BrandMark } from './HeaderChrome';
import styles from './IdentityGate.module.css';

/** Dispatch to (re)open the sign-in gate — used by the presenter guide and
 *  sarah's guided walkthrough "identity" step. */
export const OPEN_GATE_EVENT = 'hteap:open-gate';
const SESSION_KEY = 'hteap.signedIn';

/** Sign the demo user out and show the initial sign-in screen: clear the
 *  session flag, then (re)open the gate to its first phase via OPEN_GATE_EVENT. */
export function signOutToLogin() {
  window.sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent(OPEN_GATE_EVENT));
}

type Credential = 'passkey' | 'mdl';
type Phase = 'hidden' | 'signin' | 'verifying' | 'consent';

interface AuthResult {
  session: string;
  scopes: string[];
  ial: string;
  aal: string;
}

const VERIFY_STEPS = [
  'Checking your credential',
  'Verifying your identity (IAL2)',
  'Confirming this device (AAL2)',
];

/**
 * Theatrical IAL2/AAL2 sign-in + scoped-consent gate (FR-14, DESIGN-BRIEF §7).
 * Shows once per session before the dashboard; skippable for presenters. No
 * real identity provider — the IdentityProvider seam scripts verification and
 * writes the audit entry. Re-openable via OPEN_GATE_EVENT.
 */
export function IdentityGate() {
  const { personaId, refreshData } = usePersona();
  const [phase, setPhase] = useState<Phase>('hidden');
  const [credential, setCredential] = useState<Credential | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [auth, setAuth] = useState<AuthResult | null>(null);
  const [working, setWorking] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // First-visit gate (client-only read avoids hydration mismatch).
  useEffect(() => {
    if (!window.sessionStorage.getItem(SESSION_KEY)) setPhase('signin');
    const open = () => {
      setAuth(null);
      setCredential(null);
      setStepIndex(0);
      setPhase('signin');
    };
    window.addEventListener(OPEN_GATE_EVENT, open);
    return () => window.removeEventListener(OPEN_GATE_EVENT, open);
  }, []);

  useEffect(() => {
    if (phase !== 'hidden') panelRef.current?.focus();
  }, [phase]);

  const finish = useCallback(() => {
    window.sessionStorage.setItem(SESSION_KEY, '1');
    setPhase('hidden');
  }, []);

  // Scripted verification, then real seam call. Deterministic timers.
  const beginVerify = useCallback((cred: Credential) => {
    setCredential(cred);
    setStepIndex(0);
    setPhase('verifying');
  }, []);

  useEffect(() => {
    if (phase !== 'verifying' || !credential) return;
    let cancelled = false;
    const timers: number[] = [];
    VERIFY_STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => !cancelled && setStepIndex(i), i * 500));
    });
    timers.push(
      window.setTimeout(
        async () => {
          try {
            const result = await postApi<AuthResult>('/api/identity/authenticate', {
              patientId: personaId,
              credential,
            });
            if (!cancelled) {
              setAuth(result);
              setPhase('consent');
            }
          } catch {
            if (!cancelled) setPhase('signin');
          }
        },
        VERIFY_STEPS.length * 500 + 200
      )
    );
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [phase, credential, personaId]);

  const allow = async () => {
    setWorking(true);
    try {
      await postApi('/api/consent/grant', { patientId: personaId });
      refreshData();
    } finally {
      setWorking(false);
      finish();
    }
  };

  if (phase === 'hidden') return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
      >
        <div className={styles.brand}>
          <BrandMark />
        </div>

        {phase === 'signin' && (
          <>
            <h1 id="gate-title" className={styles.title}>
              Sign in to your health record
            </h1>
            <p className={styles.lede}>
              Verify your identity once to connect your records. We use strong, passwordless sign-in
              — your providers never see a password.
            </p>
            <div className={styles.methods}>
              <button
                type="button"
                className={styles.method}
                onClick={() => beginVerify('passkey')}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  fingerprint
                </span>
                <span>
                  <span className={styles.methodTitle}>Use a passkey</span>
                  <span className={styles.methodDetail}>Face, fingerprint, or device PIN</span>
                </span>
              </button>
              <button type="button" className={styles.method} onClick={() => beginVerify('mdl')}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  badge
                </span>
                <span>
                  <span className={styles.methodTitle}>Use a mobile driver’s license</span>
                  <span className={styles.methodDetail}>Verify with your state mDL</span>
                </span>
              </button>
            </div>
            <button type="button" className={styles.skip} onClick={finish}>
              Skip sign-in for this demo
            </button>
          </>
        )}

        {phase === 'verifying' && (
          <>
            <h1 id="gate-title" className={styles.title}>
              Verifying your identity
            </h1>
            <div className={styles.spinner} aria-hidden="true" />
            <ol className={styles.steps} aria-live="polite">
              {VERIFY_STEPS.map((s, i) => (
                <li key={s} className={`${styles.step} ${i <= stepIndex ? styles.stepDone : ''}`}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {i < stepIndex ? 'check_circle' : i === stepIndex ? 'autorenew' : 'circle'}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </>
        )}

        {phase === 'consent' && auth && (
          <>
            <h1 id="gate-title" className={styles.title}>
              Allow access to your records
            </h1>
            <p className={styles.lede}>
              You verified at{' '}
              <strong>
                {auth.ial} · {auth.aal}
              </strong>
              . Choose what My Health Coach can read. You can change or revoke this anytime in Data
              &amp; consent.
            </p>
            <ul className={styles.scopes}>
              {auth.scopes.map((scope) => (
                <li key={scope} className={styles.scope}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    check_circle
                  </span>
                  {scope}
                </li>
              ))}
            </ul>
            <div className={styles.actions}>
              <button type="button" className={styles.skip} onClick={finish}>
                Not now
              </button>
              <button type="button" className={styles.allow} onClick={allow} disabled={working}>
                {working ? 'Connecting…' : 'Allow access'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
