import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { AuditLog } from '@/lib/seams/audit';

/**
 * POST /api/consent/revoke — "Revoke all access" (FR-10/FR-14, #spec-api).
 * Body: { patientId }. Sets consents.revoked = 1, which drives the
 * disconnected empty states until /api/consent/grant restores access.
 * The change itself is auditable, so it is recorded through the AuditLog
 * seam (consent scope, individual access).
 */
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body');
  }
  const patientId = (body as { patientId?: unknown })?.patientId;
  if (typeof patientId !== 'string' || patientId.length === 0) {
    return jsonError('Missing patientId');
  }
  if (!findPatient(patientId)) return unknownPatient(patientId);

  getDb().prepare('UPDATE consents SET revoked = 1 WHERE patient_id = ?').run(patientId);
  AuditLog.record({
    patientId,
    actor: 'You (this app)',
    actorRole: 'app',
    scope: 'consent',
    purposeOfUse: 'individual_access',
  });
  return NextResponse.json({ revoked: true });
}
