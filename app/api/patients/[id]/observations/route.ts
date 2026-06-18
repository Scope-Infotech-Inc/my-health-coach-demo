import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, readPersonaRaw, unknownPatient } from '@/lib/api-helpers';
import { isoFromToday } from '@/lib/demo-clock';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/observations?type=…&days=N — per #spec-api:
 * series[]{observedOn,value,unit} ascending, target?{min?,max?,label}.
 *
 * Target resolution:
 * - glucose_fasting → persona_raw.glucose14d {targetMin,targetMax} band
 * - steps → goals.steps_daily (floor → min)
 * - active_minutes → goals.active_minutes_weekly (floor → min)
 * - weight → goals.weight (loss goal → max)
 */

const OBSERVATION_TYPES = ['glucose_fasting', 'weight', 'steps', 'active_minutes'] as const;
type ObservationType = (typeof OBSERVATION_TYPES)[number];

const GOAL_METRIC_BY_TYPE: Partial<Record<ObservationType, string>> = {
  steps: 'steps_daily',
  active_minutes: 'active_minutes_weekly',
  weight: 'weight',
};

interface ObservationRow {
  observed_on: string;
  value: number;
  unit: string;
}

interface GoalRow {
  target: number;
  label: string;
}

interface Glucose14dRaw {
  unit?: string;
  targetMin?: number;
  targetMax?: number;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const url = new URL(req.url);
  const type = url.searchParams.get('type') as ObservationType | null;
  if (!type || !OBSERVATION_TYPES.includes(type)) {
    return jsonError(
      `Invalid or missing type. Expected one of: ${OBSERVATION_TYPES.join(', ')}`,
      400
    );
  }

  const daysParam = url.searchParams.get('days');
  let sinceIso: string | null = null;
  if (daysParam != null) {
    const days = Number(daysParam);
    if (!Number.isInteger(days) || days < 1) {
      return jsonError('Invalid days: expected a positive integer', 400);
    }
    // days=N means the last N fiction days inclusive of DEMO_TODAY.
    sinceIso = isoFromToday(1 - days);
  }

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT observed_on, value, unit FROM observations
       WHERE patient_id = ? AND type = ?
         AND (? IS NULL OR observed_on >= ?)
       ORDER BY observed_on`
    )
    .all(id, type, sinceIso, sinceIso) as ObservationRow[];

  const series = rows.map((r) => ({ observedOn: r.observed_on, value: r.value, unit: r.unit }));

  let target: { min?: number; max?: number; label: string } | undefined;
  if (type === 'glucose_fasting') {
    const raw = readPersonaRaw<{ glucose14d?: Glucose14dRaw }>(id);
    const g = raw?.glucose14d;
    if (g && g.targetMin != null && g.targetMax != null) {
      target = {
        min: g.targetMin,
        max: g.targetMax,
        label: `Target ${g.targetMin}–${g.targetMax} ${g.unit ?? 'mg/dL'}`,
      };
    }
  } else {
    const metric = GOAL_METRIC_BY_TYPE[type];
    const goal = db
      .prepare(`SELECT target, label FROM goals WHERE patient_id = ? AND metric = ?`)
      .get(id, metric) as GoalRow | undefined;
    if (goal) {
      target =
        type === 'weight'
          ? { max: goal.target, label: goal.label }
          : { min: goal.target, label: goal.label };
    }
  }

  return NextResponse.json({ series, ...(target ? { target } : {}) });
}
