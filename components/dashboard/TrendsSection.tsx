'use client';

import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { Section, PlainWords } from '@/components/ui';
import { LineChart, RiskScale, ChartCard, type LinePoint } from '@/components/charts';
import { StatusIcon } from '@/components/ds';
import { MetaChip } from '@/components/ds';
import { formatShortDate, formatMediumDate } from '@/lib/demo-clock';
import styles from './dashboard.module.css';

interface Lab {
  code: string;
  display: string;
  value: number;
  value2?: number;
  unit: string;
  rangeFlag: string;
  collectedOn: string;
  source: string;
  loinc?: string;
}
interface LabsResponse {
  labs: Lab[];
  a1cSeries: Array<{ collectedOn: string; value: number }>;
}
interface ObsResponse {
  series: Array<{ observedOn: string; value: number; unit: string }>;
  target?: { min?: number; max?: number; label: string };
}

const A1C_ZONES = [
  { label: 'Normal', to: 5.7, tone: 'sky' },
  { label: 'Pre-diabetes', to: 6.5, tone: 'gold' },
  { label: 'Diabetes', to: 9, tone: 'red-container' },
];

function pad(values: number[], extra: number): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return [Math.floor(lo - extra), Math.ceil(hi + extra)];
}

function rangePhrase(flag: string): string {
  switch (flag) {
    case 'above_target':
      return 'above your target';
    case 'elevated':
      return 'a little high';
    case 'prediabetes':
      return 'in the pre-diabetes range';
    case 'in_range':
    case 'normal':
      return 'in your target range';
    case 'low':
      return 'below your target';
    default:
      return 'recorded';
  }
}

export function TrendsSection() {
  const { personaId } = usePersona();
  const { data: labs, loading } = useApi<LabsResponse>(`/api/patients/${personaId}/labs`);
  const { data: glucose } = useApi<ObsResponse>(
    `/api/patients/${personaId}/observations?type=glucose_fasting&days=14`
  );
  const { data: weight } = useApi<ObsResponse>(
    `/api/patients/${personaId}/observations?type=weight`
  );

  if (loading && !labs) {
    return (
      <Section id="trends" eyebrow="Your health" title="Trends & labs">
        <div className={styles.loading} />
      </Section>
    );
  }
  if (!labs) return null;

  const a1cLab = labs.labs.find((l) => l.code === 'a1c');
  const a1cSeries = labs.a1cSeries ?? [];
  const showA1cLine = a1cSeries.length >= 3;
  const showRisk = !showA1cLine && a1cLab != null;

  const glucoseSeries = glucose?.series ?? [];
  const weightSeries = weight?.series ?? [];

  // ----- A1c line -----
  let a1cChart: React.ReactNode = null;
  if (showA1cLine) {
    const vals = a1cSeries.map((p) => p.value);
    const [yMin, yMax] = pad(vals, 0.6);
    const points: LinePoint[] = a1cSeries.map((p, i) => ({
      label: formatShortDate(p.collectedOn),
      value: p.value,
      ...(i === a1cSeries.length - 1 && a1cLab && /above_target|elevated/.test(a1cLab.rangeFlag)
        ? { flag: a1cLab.rangeFlag }
        : {}),
    }));
    a1cChart = (
      <ChartCard key="a1c" title="A1c over time">
        <LineChart
          id={`a1c-${personaId}`}
          ariaLabel={`Quarterly A1c readings for the past ${a1cSeries.length} results, most recent ${a1cSeries.at(-1)?.value}%.`}
          points={points}
          yMin={yMin}
          yMax={yMax}
          unit="%"
          todayMeridian
          tableColumns={['Date', 'A1c (%)']}
        />
      </ChartCard>
    );
  } else if (showRisk && a1cLab) {
    a1cChart = (
      <ChartCard key="a1c" title="Where your A1c sits">
        <RiskScale
          id={`a1c-risk-${personaId}`}
          ariaLabel={`Your A1c of ${a1cLab.value}% falls ${rangePhrase(a1cLab.rangeFlag)} on the diabetes risk scale.`}
          min={4.5}
          max={9}
          zones={A1C_ZONES}
          marker={a1cLab.value}
          markerLabel={`You: ${a1cLab.value}%`}
        />
      </ChartCard>
    );
  }

  // ----- glucose 14-day line -----
  let glucoseChart: React.ReactNode = null;
  if (glucoseSeries.length > 0) {
    const t = glucose?.target;
    const vals = glucoseSeries.map((p) => p.value);
    const bounds = [
      ...vals,
      ...(t?.min != null ? [t.min] : []),
      ...(t?.max != null ? [t.max] : []),
    ];
    const [yMin, yMax] = pad(bounds, 10);
    const points: LinePoint[] = glucoseSeries.map((p) => ({
      label: formatShortDate(p.observedOn),
      value: p.value,
      ...(t?.max != null && p.value > t.max ? { flag: 'above_target' } : {}),
    }));
    glucoseChart = (
      <ChartCard key="glucose" title="Fasting glucose · last 14 days">
        <LineChart
          id={`glucose-${personaId}`}
          ariaLabel={`Fasting glucose for the last 14 days in ${glucoseSeries[0].unit}. ${t?.label ?? ''}`.trim()}
          points={points}
          yMin={yMin}
          yMax={yMax}
          unit={glucoseSeries[0].unit}
          xLabelEvery={2}
          todayMeridian
          {...(t?.min != null && t?.max != null
            ? { band: { from: t.min, to: t.max, label: t.label } }
            : {})}
          tableColumns={['Date', `Glucose (${glucoseSeries[0].unit})`]}
        />
      </ChartCard>
    );
  }

  // ----- weight line -----
  let weightChart: React.ReactNode = null;
  if (weightSeries.length > 0) {
    const t = weight?.target;
    const vals = weightSeries.map((p) => p.value);
    const bounds = [...vals, ...(t?.max != null ? [t.max] : [])];
    const [yMin, yMax] = pad(bounds, 4);
    const every = Math.max(1, Math.ceil(weightSeries.length / 6));
    weightChart = (
      <ChartCard key="weight" title="Weight trend">
        <LineChart
          id={`weight-${personaId}`}
          ariaLabel={`Weight trend over time in ${weightSeries[0].unit}, most recent ${weightSeries.at(-1)?.value} ${weightSeries[0].unit}.`}
          points={weightSeries.map((p) => ({
            label: formatShortDate(p.observedOn),
            value: p.value,
          }))}
          yMin={yMin}
          yMax={yMax}
          unit={weightSeries[0].unit}
          xLabelEvery={every}
          todayMeridian
          {...(t?.max != null ? { goal: { value: t.max, label: t.label } } : {})}
          tableColumns={['Date', `Weight (${weightSeries[0].unit})`]}
        />
      </ChartCard>
    );
  }

  const charts = [a1cChart, glucoseChart, weightChart].filter(Boolean);

  // Words-first summary from the latest A1c (or first lab).
  const summary = a1cLab ? (
    <>
      Your most recent A1c is{' '}
      <strong>
        {a1cLab.value}% — {rangePhrase(a1cLab.rangeFlag)}
      </strong>
      .
    </>
  ) : (
    <>Here are your latest results, pulled from your connected records.</>
  );

  return (
    <Section id="trends" eyebrow="Your health" title="Trends & labs">
      <PlainWords>{summary}</PlainWords>

      {charts.length > 0 && (
        <div className={charts.length > 1 ? styles.twoUp : styles.stack}>{charts}</div>
      )}

      {labs.labs.length > 0 && (
        <div className={styles.rows} role="list" aria-label="Recent lab results">
          {labs.labs.map((l, i) => (
            <div className={styles.row} role="listitem" key={`${l.code}-${i}`}>
              <div className={styles.rowMain}>
                <p className={styles.rowName}>{l.display}</p>
                <p className={styles.rowMeta}>
                  <span>{formatMediumDate(l.collectedOn)}</span>
                  <span>{l.source}</span>
                  {l.loinc && <MetaChip>LOINC {l.loinc}</MetaChip>}
                </p>
              </div>
              <StatusIcon status={l.rangeFlag} size={18} />
              <span className={styles.rowValue}>
                {l.value}
                {l.value2 != null ? `/${l.value2}` : ''} {l.unit}
              </span>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
