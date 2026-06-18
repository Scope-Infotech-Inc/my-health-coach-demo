import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/labs — per #spec-api:
 * labs[]{code,display,value,value2?,unit,rangeFlag,collectedOn,source,loinc?},
 * a1cSeries[]{collectedOn,value} (code='a1c' ordered by collected_on).
 */

interface LabRow {
  code: string;
  loinc: string | null;
  display: string;
  value: number;
  value2: number | null;
  unit: string;
  range_flag: string;
  collected_on: string;
  source: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT code, loinc, display, value, value2, unit, range_flag, collected_on, source
       FROM lab_results WHERE patient_id = ? ORDER BY id`
    )
    .all(id) as LabRow[];

  const labs = rows.map((r) => ({
    code: r.code,
    display: r.display,
    value: r.value,
    ...(r.value2 != null ? { value2: r.value2 } : {}),
    unit: r.unit,
    rangeFlag: r.range_flag,
    collectedOn: r.collected_on,
    source: r.source,
    ...(r.loinc != null ? { loinc: r.loinc } : {}),
  }));

  const a1cSeries = (
    db
      .prepare(
        `SELECT collected_on, value FROM lab_results
         WHERE patient_id = ? AND code = 'a1c' ORDER BY collected_on`
      )
      .all(id) as Array<{ collected_on: string; value: number }>
  ).map((r) => ({ collectedOn: r.collected_on, value: r.value }));

  return NextResponse.json({ labs, a1cSeries });
}
