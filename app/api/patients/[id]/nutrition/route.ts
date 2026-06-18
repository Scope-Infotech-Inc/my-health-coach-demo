import { NextResponse } from 'next/server';
import { findPatient, readPersonaRaw, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/nutrition — per #spec-api:
 * rows[]{label,valueText,pct,fillTone}.
 *
 * Rows come verbatim from persona_raw.nutrition (presentation-shaped seed),
 * preserving order AND duplicates (miguel intentionally repeats a row).
 * The seed stores the tone under `tone`; the API key is `fillTone`.
 */

interface RawNutritionRow {
  label: string;
  valueText: string;
  pct: number;
  tone: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const raw = readPersonaRaw<{ nutrition?: RawNutritionRow[] }>(id);
  const rows = (raw?.nutrition ?? []).map((r) => ({
    label: r.label,
    valueText: r.valueText,
    pct: r.pct,
    fillTone: r.tone,
  }));

  return NextResponse.json({ rows });
}
