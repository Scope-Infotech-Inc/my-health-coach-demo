import { NextResponse } from 'next/server';
import { findPatient, unknownPatient } from '@/lib/api-helpers';
import { AuditLog } from '@/lib/seams/audit';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/audit — granular purpose-of-use audit trail
 * (FR-10, §11.1) via the AuditLog seam (newest first: occurred_at DESC,
 * id DESC). Shape per #spec-api:
 * entries[]{occurredAt,actor,actorRole,scope,purposeOfUse}. 404 unknown
 * patient.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  return NextResponse.json({ entries: AuditLog.list(id) });
}
