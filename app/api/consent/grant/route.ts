import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { AuditLog } from '@/lib/seams/audit';

/**
 * POST /api/consent/grant — reconnect path after revoke (FR-14, #spec-api).
 * Body: { patientId }. Clears consents.revoked, restoring access for the
 * persona. Recorded through the AuditLog seam (consent scope, individual
 * access) — consent changes are auditable per FR-10.
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

  getDb().prepare('UPDATE consents SET revoked = 0 WHERE patient_id = ?').run(patientId);
  AuditLog.record({
    patientId,
    actor: 'You (this app)',
    actorRole: 'app',
    scope: 'consent',
    purposeOfUse: 'individual_access',
  });
  return NextResponse.json({ revoked: false });
}
