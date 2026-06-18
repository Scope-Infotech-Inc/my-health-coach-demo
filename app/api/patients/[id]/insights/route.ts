import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, parseJsonArray, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/** Row shape of ai_insights (#sql-ddl). */
interface InsightRow {
  id: number;
  kind: 'trend' | 'titration' | 'summary' | 'referral_suggestion';
  title: string;
  body: string;
  basis: string; // JSON array: which data points the insight drew on
  surfaced_on: 'overview' | 'trends' | 'records';
  severity: 'info' | 'attention';
  created_on: string;
}

/**
 * GET /api/patients/{id}/insights — proactive AI interpretive insight cards
 * (FR-32, §6.4), precomputed in the seed (ai_insights) so they are
 * deterministic and reviewable. Shape per #spec-api:
 * insights[]{id,kind,title,body,basis[],surfacedOn,severity,createdOn};
 * the UI badges each card "AI-generated — not clinical judgment". Newest
 * createdOn first, then id DESC. 404 unknown patient.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  const rows = getDb()
    .prepare(
      `SELECT id, kind, title, body, basis, surfaced_on, severity, created_on
       FROM ai_insights WHERE patient_id = ?
       ORDER BY created_on DESC, id DESC`
    )
    .all(id) as InsightRow[];

  const insights = rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    title: r.title,
    body: r.body,
    basis: parseJsonArray<string>(r.basis),
    surfacedOn: r.surfaced_on,
    severity: r.severity,
    createdOn: r.created_on,
  }));

  return NextResponse.json({ insights });
}
