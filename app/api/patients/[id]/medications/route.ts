import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, readPersonaRaw, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/medications — per #spec-api:
 * medications[]{name,dose,timing,todayStatus,takenAt?},
 * refills[]{description,location},
 * adherence{days[]{date,status} ascending, summary{taken,total}}.
 *
 * summary prefers the persona_raw.adherence.summary string ("26 of 28 days")
 * when present; otherwise it is computed from medication_days.
 */

interface MedRow {
  name: string;
  rxnorm: string | null;
  dose: string;
  timing: string;
  event_status: string | null;
  at_time: string | null;
}

interface RefillRow {
  description: string;
  location: string | null;
}

interface DayRow {
  date: string;
  status: string;
}

interface PersonaRawAdherence {
  adherence?: { summary?: string };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const db = getDb();

  const medRows = db
    .prepare(
      `SELECT m.name, m.rxnorm, m.dose, m.timing, e.status AS event_status, e.at_time
       FROM medications m
       LEFT JOIN med_events_today e ON e.medication_id = m.id
       WHERE m.patient_id = ? ORDER BY m.sort, m.id`
    )
    .all(id) as MedRow[];

  const medications = medRows.map((m) => ({
    name: m.name,
    dose: m.dose,
    timing: m.timing,
    todayStatus: m.event_status ?? 'due',
    ...(m.at_time != null ? { takenAt: m.at_time } : {}),
    ...(m.rxnorm != null ? { rxnorm: m.rxnorm } : {}),
  }));

  const refillRows = db
    .prepare(
      `SELECT description, location FROM claims_events
       WHERE patient_id = ? AND kind = 'refill_ready' ORDER BY event_date, id`
    )
    .all(id) as RefillRow[];

  const refills = refillRows.map((r) => ({
    description: r.description,
    ...(r.location != null ? { location: r.location } : {}),
  }));

  const days = (
    db
      .prepare(`SELECT date, status FROM medication_days WHERE patient_id = ? ORDER BY date`)
      .all(id) as DayRow[]
  ).map((d) => ({ date: d.date, status: d.status }));

  // Prefer the seeded presentation summary ("26 of 28 days") when present.
  let summary = {
    taken: days.filter((d) => d.status === 'taken').length,
    total: days.length,
  };
  const raw = readPersonaRaw<PersonaRawAdherence>(id);
  const summaryText = raw?.adherence?.summary;
  if (summaryText) {
    const m = /(\d+)\s+of\s+(\d+)/.exec(summaryText);
    if (m) summary = { taken: Number(m[1]), total: Number(m[2]) };
  }

  return NextResponse.json({ medications, refills, adherence: { days, summary } });
}
