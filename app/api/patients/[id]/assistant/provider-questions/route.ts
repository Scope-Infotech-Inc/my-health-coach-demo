import { NextResponse } from 'next/server';
import { findPatient, unknownPatient } from '@/lib/api-helpers';
import { buildProviderQuestions } from '@/lib/assistant/provider-questions';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/assistant/provider-questions — per #spec-api:
 * questions[] (3–5, tailored from the patient's data).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  return NextResponse.json({ questions: buildProviderQuestions(id) });
}
