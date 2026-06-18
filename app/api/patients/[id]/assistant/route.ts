import { NextResponse } from 'next/server';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { interpret } from '@/lib/assistant/interpret';

export const runtime = 'nodejs';

/**
 * POST /api/patients/{id}/assistant — per #spec-api: body {question} →
 * {answer, sourceCitation, disclaimer, suggestedChips[]}. Deterministic
 * on-device intent engine behind the interpret() seam; NO external LLM.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Body must be JSON: {question}', 400);
  }
  const question = (body as { question?: unknown })?.question;
  if (typeof question !== 'string' || question.trim() === '') {
    return jsonError('Body must include a non-empty question string', 400);
  }

  return NextResponse.json(interpret({ patientId: id, question: question.trim() }));
}
