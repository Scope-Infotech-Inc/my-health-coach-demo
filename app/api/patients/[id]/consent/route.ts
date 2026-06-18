import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/consent — per #spec-api:
 * grantedOn,method,identityCredential,ial,aal,accessReadsThisMonth,
 * shareWithCareTeam,adsBlocked,revoked.
 */

interface ConsentRow {
  granted_on: string;
  method: string;
  identity_credential: string;
  ial: string;
  aal: string;
  access_reads_this_month: number;
  share_with_care_team: number;
  ads_blocked: number;
  revoked: number;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const row = getDb().prepare(`SELECT * FROM consents WHERE patient_id = ?`).get(id) as
    | ConsentRow
    | undefined;
  if (!row) return jsonError(`No consent record for patient: ${id}`, 404);

  return NextResponse.json({
    grantedOn: row.granted_on,
    method: row.method,
    identityCredential: row.identity_credential,
    ial: row.ial,
    aal: row.aal,
    accessReadsThisMonth: row.access_reads_this_month,
    shareWithCareTeam: row.share_with_care_team === 1,
    adsBlocked: row.ads_blocked === 1,
    revoked: row.revoked === 1,
  });
}
