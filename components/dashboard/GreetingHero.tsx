'use client';

import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { PlainWords } from '@/components/ui';
import { demoGreetingWord } from '@/lib/demo-clock';
import styles from './dashboard.module.css';

interface Overview {
  patient: {
    firstName: string;
    planType: string;
    conditionDetail?: string;
    providerOrg: string;
    secondaryLanguage?: string;
  };
}

/** Localized morning greeting for personas with a second language. */
const GREETING_BY_LANG: Record<string, string> = {
  Español: 'Buenos días',
  'Tiếng Việt': 'Chào buổi sáng',
};

/**
 * The dashboard's single page <h1> (DESIGN-BRIEF §4, a11y §8). On desktop it
 * is the visible greeting hero; on mobile the navy app bar greets, so the hero
 * is visually hidden but the h1 stays in the DOM as the page title.
 */
export function GreetingHero() {
  const { personaId } = usePersona();
  const { data } = useApi<Overview>(`/api/patients/${personaId}/overview`);
  const p = data?.patient;
  const greeting = p?.secondaryLanguage
    ? (GREETING_BY_LANG[p.secondaryLanguage] ?? demoGreetingWord())
    : demoGreetingWord();
  const planEyebrow = p
    ? p.conditionDetail
      ? `${p.planType} · ${p.conditionDetail}`
      : p.planType
    : '';

  return (
    <header className={`${styles.hero} ${styles.heroMobileHidden}`}>
      {planEyebrow && <p className={styles.eyebrow}>{planEyebrow}</p>}
      <div className={styles.greetingRow}>
        <h1 className={styles.greeting}>
          {greeting}
          {p ? <>, {p.firstName}</> : ''}.
        </h1>
        {p?.secondaryLanguage && (
          <span className={styles.langChip}>
            <span className="material-symbols-outlined" aria-hidden="true">
              translate
            </span>
            {p.secondaryLanguage}
          </span>
        )}
      </div>
      {p && <PlainWords tone="muted">Your records from {p.providerOrg}, in one place.</PlainWords>}
    </header>
  );
}
