import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/conditions — the problem list (FR-31, FR-33).
 * conditions[]{display, snomed?, onsetDate?, status}. SNOMED codes are
 * illustrative per §11.1. Active conditions first, then by onset (newest).
 */

interface ConditionRow {
  display: string;
  snomed: string | null;
  onset_date: string | null;
  status: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  const rows = getDb()
    .prepare(
      `SELECT display, snomed, onset_date, status FROM conditions
       WHERE patient_id = ?
       ORDER BY (status = 'active') DESC, onset_date DESC, id`
    )
    .all(id) as ConditionRow[];

  const conditions = rows.map((c) => ({
    display: c.display,
    ...(c.snomed != null ? { snomed: c.snomed } : {}),
    ...(c.onset_date != null ? { onsetDate: c.onset_date } : {}),
    status: c.status,
  }));

  return NextResponse.json({ conditions });
}
