'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import styles from './JourneyStepper.module.css';

interface JourneyStep {
  stepNo: number;
  title: string;
  route: string;
  narration: string;
}

/** Event any launcher card dispatches to begin the guided walkthrough. */
export const JOURNEY_START_EVENT = 'hteap:journey-start';

/**
 * Bottom-docked guided walkthrough (DESIGN-BRIEF §7, FR-35). Seeded for
 * sarah only; for every other persona the journey is empty and this renders
 * nothing. Opened by a launcher card via a window event; each step deep-links
 * to its route. Gold progress dots track position.
 */
export function JourneyStepper() {
  const { personaId } = usePersona();
  const router = useRouter();
  const { data } = useApi<{ steps: JourneyStep[] }>(`/api/patients/${personaId}/journey`);
  const steps = data?.steps ?? [];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onStart = () => {
      setIndex(0);
      setOpen(true);
    };
    window.addEventListener(JOURNEY_START_EVENT, onStart);
    return () => window.removeEventListener(JOURNEY_START_EVENT, onStart);
  }, []);

  // Persona swap ends any in-progress journey.
  useEffect(() => setOpen(false), [personaId]);

  const go = useCallback(
    (i: number) => {
      const step = steps[i];
      if (step) router.push(step.route);
      setIndex(i);
    },
    [steps, router]
  );

  if (!open || steps.length === 0) return null;
  const step = steps[index];
  const isLast = index === steps.length - 1;

  return (
    <aside className={styles.dock} role="region" aria-label="Guided walkthrough">
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.stepNo}>
            Step {index + 1} of {steps.length}
          </span>
          <button
            type="button"
            className={styles.skip}
            onClick={() => setOpen(false)}
            aria-label="Exit walkthrough"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>
        <h2 className={styles.title}>{step.title}</h2>
        <p className={styles.narration}>{step.narration}</p>
        <div className={styles.dots} aria-hidden="true">
          {steps.map((s, i) => (
            <span
              key={s.stepNo}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.ghost} onClick={() => setOpen(false)}>
            Skip tour
          </button>
          {isLast ? (
            <button type="button" className={styles.primary} onClick={() => setOpen(false)}>
              Finish
            </button>
          ) : (
            <button type="button" className={styles.primary} onClick={() => go(index + 1)}>
              Next step
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
