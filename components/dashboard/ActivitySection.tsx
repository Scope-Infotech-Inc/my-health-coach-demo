'use client';

import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { Section, PlainWords, SectionHeader } from '@/components/ui';
import { BarChart, ProgressBar, ChartCard, type BarPoint } from '@/components/charts';
import { fictionWeekday } from '@/lib/demo-clock';
import styles from './dashboard.module.css';

interface ObsResponse {
  series: Array<{ observedOn: string; value: number; unit: string }>;
  target?: { min?: number; max?: number; label: string };
}
interface NutritionResponse {
  rows: Array<{ label: string; valueText: string; pct: number; fillTone: string }>;
}

const TONES = new Set(['navy', 'gold', 'sky', 'red', 'success']);

export function ActivitySection() {
  const { personaId } = usePersona();
  const { data: steps, loading } = useApi<ObsResponse>(
    `/api/patients/${personaId}/observations?type=steps&days=7`
  );
  const { data: nutrition } = useApi<NutritionResponse>(`/api/patients/${personaId}/nutrition`);

  if (loading && !steps && !nutrition) {
    return (
      <Section id="activity" eyebrow="Your health" title="Activity & nutrition">
        <div className={styles.loading} />
      </Section>
    );
  }

  const stepSeries = steps?.series ?? [];
  const rows = nutrition?.rows ?? [];

  const avg = stepSeries.length
    ? Math.round(stepSeries.reduce((s, p) => s + p.value, 0) / stepSeries.length)
    : 0;
  const goal = steps?.target?.min;
  const points: BarPoint[] = stepSeries.map((p) => ({
    label: fictionWeekday(p.observedOn, true),
    value: p.value,
  }));
  const yMax = stepSeries.length
    ? Math.ceil((Math.max(...stepSeries.map((p) => p.value), goal ?? 0) * 1.1) / 1000) * 1000
    : 0;

  return (
    <Section id="activity" eyebrow="Your health" title="Activity & nutrition">
      {stepSeries.length > 0 && (
        <>
          <PlainWords>
            You’re averaging <strong>{avg.toLocaleString()} steps a day</strong> this week
            {goal ? <> — your goal is {goal.toLocaleString()}.</> : '.'}
          </PlainWords>
          <ChartCard title="Steps · this week">
            <BarChart
              id={`steps-${personaId}`}
              ariaLabel={`Daily steps this week, averaging ${avg.toLocaleString()} per day${goal ? `, against a ${goal.toLocaleString()} goal` : ''}.`}
              points={points}
              yMax={yMax}
              unit="steps"
              todayIndex={points.length - 1}
              {...(goal != null
                ? { goal: { value: goal, label: `Goal ${goal.toLocaleString()}` } }
                : {})}
              tableColumns={['Day', 'Steps']}
            />
          </ChartCard>
        </>
      )}

      {rows.length > 0 && (
        <div>
          <SectionHeader title="Nutrition this week" />
          <div className={styles.stack}>
            {rows.map((r, i) => (
              <ProgressBar
                key={`${r.label}-${i}`}
                id={`nutri-${personaId}-${i}`}
                label={r.label}
                valueText={r.valueText}
                pct={r.pct}
                tone={
                  (TONES.has(r.fillTone) ? r.fillTone : 'navy') as
                    | 'navy'
                    | 'gold'
                    | 'sky'
                    | 'red'
                    | 'success'
                }
              />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
