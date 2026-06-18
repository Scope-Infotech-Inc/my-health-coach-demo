import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/programs — per #spec-api:
 * programs[]{name,detail,statusChip,progressCurrent?,progressTotal?,
 * milestonePct?,milestoneGoalPct?,nextSession?}.
 */

interface ProgramRow {
  name: string;
  detail: string;
  status_chip: string;
  progress_current: number | null;
  progress_total: number | null;
  milestone_pct: number | null;
  milestone_goal_pct: number | null;
  next_session: string | null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const rows = getDb()
    .prepare(
      `SELECT name, detail, status_chip, progress_current, progress_total,
              milestone_pct, milestone_goal_pct, next_session
       FROM programs WHERE patient_id = ? ORDER BY sort, id`
    )
    .all(id) as ProgramRow[];

  const programs = rows.map((r) => ({
    name: r.name,
    detail: r.detail,
    statusChip: r.status_chip,
    ...(r.progress_current != null ? { progressCurrent: r.progress_current } : {}),
    ...(r.progress_total != null ? { progressTotal: r.progress_total } : {}),
    ...(r.milestone_pct != null ? { milestonePct: r.milestone_pct } : {}),
    ...(r.milestone_goal_pct != null ? { milestoneGoalPct: r.milestone_goal_pct } : {}),
    ...(r.next_session != null ? { nextSession: r.next_session } : {}),
  }));

  return NextResponse.json({ programs });
}
