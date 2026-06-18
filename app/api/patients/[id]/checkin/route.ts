import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import {
  findPatient,
  jsonError,
  readAppMetaJson,
  readAppMetaText,
  unknownPatient,
} from '@/lib/api-helpers';
import { DEMO_NOW_ISO } from '@/lib/demo-clock';

export const runtime = 'nodejs';

/**
 * POST /api/patients/{id}/checkin — per #spec-api: body {text} →
 * {logged, redFlag, response}. Stores symptom_checkins; red-flag keywords
 * (seeded) return a direct-to-care safety response — never a diagnosis.
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
    return jsonError('Body must be JSON: {text}', 400);
  }
  const text = (body as { text?: unknown })?.text;
  if (typeof text !== 'string' || text.trim() === '') {
    return jsonError('Body must include a non-empty text string', 400);
  }

  const redFlags = readAppMetaJson<string[]>('red_flag_keywords') ?? [];
  const redFlag = redFlags.some((k) => text.toLowerCase().includes(k.toLowerCase()));

  getDb()
    .prepare(
      `INSERT INTO symptom_checkins (patient_id, text, red_flag, logged_on) VALUES (?,?,?,?)`
    )
    .run(id, text.trim(), redFlag ? 1 : 0, DEMO_NOW_ISO);

  const response = redFlag
    ? (readAppMetaText('red_flag_response') ??
      'This may need urgent attention — please contact your care team or 911/urgent care now.')
    : "Logged — I'll note this for your next visit. If it gets worse, contact your care team.";

  return NextResponse.json({ logged: true, redFlag, response });
}
