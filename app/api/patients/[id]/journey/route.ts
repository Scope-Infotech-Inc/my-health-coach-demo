import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/journey — guided "Day in the Life" walkthrough
 * (FR-35, §4.4), ordered by step_no. Shape per #spec-api:
 * steps[]{stepNo,title,route,narration}. Seeded for sarah only; every
 * other persona correctly returns an empty steps array. 404 unknown
 * patient.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT step_no, title, route, narration
       FROM journey_steps WHERE patient_id = ?
       ORDER BY step_no ASC`
    )
    .all(id) as Array<{ step_no: number; title: string; route: string; narration: string }>;

  const steps = rows.map((r) => ({
    stepNo: r.step_no,
    title: r.title,
    route: r.route,
    narration: r.narration,
  }));

  return NextResponse.json({ steps });
}
