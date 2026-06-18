'use client';

import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { Section, PlainWords, SectionHeader } from '@/components/ui';
import { AdherenceGrid, type AdherenceDay } from '@/components/charts';
import { StatusIcon, MetaChip } from '@/components/ds';
import styles from './dashboard.module.css';

interface Med {
  name: string;
  dose: string;
  timing: string;
  todayStatus: string;
  takenAt?: string;
  rxnorm?: string;
}
interface MedsResponse {
  medications: Med[];
  refills: Array<{ description: string; location: string }>;
  adherence: {
    days: AdherenceDay[];
    summary: { taken: number; total: number } | string;
  };
}
interface Condition {
  display: string;
  snomed?: string;
  onsetDate?: string;
  status: string;
}

function adherenceText(summary: MedsResponse['adherence']['summary']): string {
  if (typeof summary === 'string') return summary;
  return `${summary.taken} of ${summary.total} doses`;
}

export function CareSection() {
  const { personaId } = usePersona();
  const { data, loading } = useApi<MedsResponse>(`/api/patients/${personaId}/medications`);
  const { data: condData } = useApi<{ conditions: Condition[] }>(
    `/api/patients/${personaId}/conditions`
  );

  if (loading && !data) {
    return (
      <Section id="care" eyebrow="Your health" title="Care & medications">
        <div className={styles.loading} />
      </Section>
    );
  }
  if (!data) return null;

  const { medications, refills, adherence } = data;
  const conditions = condData?.conditions ?? [];
  const hasMeds = medications.length > 0;
  const summaryText = adherenceText(adherence.summary);

  return (
    <Section id="care" eyebrow="Your health" title="Care & medications">
      {conditions.length > 0 && (
        <div>
          <SectionHeader title="What we’re managing" />
          <div className={styles.rows} role="list" aria-label="Conditions">
            {conditions.map((c, i) => (
              <div className={styles.row} role="listitem" key={`${c.display}-${i}`}>
                <div className={styles.rowMain}>
                  <p className={styles.rowName}>{c.display}</p>
                  <p className={styles.rowMeta}>
                    <span style={{ textTransform: 'capitalize' }}>{c.status}</span>
                    {c.snomed && <MetaChip>SNOMED {c.snomed}</MetaChip>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasMeds ? (
        <>
          <PlainWords>
            You’ve taken <strong>{summaryText}</strong> this month. Here’s today’s plan.
          </PlainWords>

          <div className={styles.rows} role="list" aria-label="Medications">
            {medications.map((m, i) => (
              <div className={styles.row} role="listitem" key={`${m.name}-${i}`}>
                <div className={styles.rowMain}>
                  <p className={styles.rowName}>
                    {m.name} {m.dose}
                  </p>
                  <p className={styles.rowMeta}>
                    <span>{m.timing}</span>
                    {m.takenAt && <span>Taken {m.takenAt}</span>}
                    {m.rxnorm && <MetaChip>RxNorm {m.rxnorm}</MetaChip>}
                  </p>
                </div>
                <StatusIcon status={m.todayStatus} showLabel size={18} />
              </div>
            ))}
          </div>

          {refills.length > 0 && (
            <div className={styles.refill}>
              <span className="material-symbols-outlined" aria-hidden="true">
                local_pharmacy
              </span>
              <div>
                <p className={styles.rowName}>Ready to pick up</p>
                {refills.map((r, i) => (
                  <p key={i} className={styles.rowMeta}>
                    <span>{r.description}</span>
                    <span>{r.location}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {adherence.days.length > 0 && (
            <div>
              <SectionHeader title="This month’s doses" />
              <AdherenceGrid
                id={`adherence-${personaId}`}
                ariaLabel={`Daily medication adherence: ${summaryText} taken this month.`}
                days={adherence.days}
                summary={`${summaryText} taken`}
              />
            </div>
          )}
        </>
      ) : (
        <PlainWords tone="muted">
          No medications are part of your plan right now — your focus is the prevention program
          below.
        </PlainWords>
      )}
    </Section>
  );
}
