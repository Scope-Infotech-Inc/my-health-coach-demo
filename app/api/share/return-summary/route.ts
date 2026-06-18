import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { DocumentStore } from '@/lib/seams/documents';
import { AuditLog } from '@/lib/seams/audit';

export const runtime = 'nodejs';

/**
 * POST /api/share/return-summary — mock Smart Health Link inbound
 * (FR-30, PRD §6.7).
 *
 * Body: { patientId, shareId }. The DocumentStore seam resolves the visit
 * summary: if the share session already references a seeded return document
 * (sarah's journey pair), that document is returned; otherwise one is
 * created deterministically and linked to the share. A treatment audit
 * entry (scope visit_summary) is written with the visited org as actor.
 *
 * Returns { document: {id,kind,title,docDate,sourceOrg,mime,fhirType,bodyText,aiRead} }.
 * 404 with { error } for an unknown patient or unknown share.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: { patientId?: unknown; shareId?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body');
  }
  const patientId = typeof body.patientId === 'string' ? body.patientId : '';
  const shareId = typeof body.shareId === 'number' ? body.shareId : Number(body.shareId);
  if (!patientId) return jsonError('Missing patientId');
  if (!Number.isInteger(shareId)) return jsonError('Missing or invalid shareId');

  const patient = findPatient(patientId);
  if (!patient) return unknownPatient(patientId);

  const db = getDb();
  const share = db
    .prepare(`SELECT shared_with_org FROM share_sessions WHERE id = ? AND patient_id = ?`)
    .get(shareId, patientId) as { shared_with_org: string | null } | undefined;
  if (!share) return jsonError(`Unknown share: ${shareId}`, 404);

  const document = DocumentStore.returnVisitSummary(patientId, shareId);
  if (!document) return jsonError(`Unknown share: ${shareId}`, 404);

  AuditLog.record({
    patientId,
    actor: share.shared_with_org ?? 'Visited clinic',
    actorRole: 'clinic',
    scope: 'visit_summary',
    purposeOfUse: 'treatment',
  });

  return NextResponse.json({ document });
}
