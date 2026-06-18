import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient } from '@/lib/api-helpers';
import { AlignedNetworkClient } from '@/lib/seams/network';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/share — supporting data for the /share page
 * (PRD §6.7 "Kill the Clipboard").
 *
 * NOTE: this read endpoint is an ADDITION beyond #spec-api (which lists only
 * POST /api/share/checkin and POST /api/share/return-summary). The /share
 * page needs it to render the QR card (token + plain-language bundle list)
 * and the share/return log without hardcoding display data, per the
 * "components render only data fetched from /api/*" rule. PRD §6.7 prose
 * also routes this page through patients/[id]/share/route.ts (§9 file map).
 *
 * Returns:
 * {
 *   shareToken: string   — latest existing share session's token, or the
 *                          deterministic token POST /api/share/checkin WOULD
 *                          create (FNV-1a of the patient id), so the QR is
 *                          stable before any check-in happens;
 *   bundle: string[]     — FHIR resource-type manifest (AlignedNetworkClient);
 *   sessions: [{ id, sharedWith, sharedOn, returned }] — newest first;
 *             returned=true once a visit summary document is linked.
 * }
 */

/** FNV-1a over the patient id — must match POST /api/share/checkin. */
function mockShareToken(patientId: string): string {
  let h = 2166136261;
  for (let i = 0; i < patientId.length; i++) {
    h ^= patientId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `MOCK-${(h >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT id, share_token, shared_with_org, shared_on, return_summary_doc_id
       FROM share_sessions WHERE patient_id = ? ORDER BY id DESC`
    )
    .all(id) as Array<{
    id: number;
    share_token: string;
    shared_with_org: string | null;
    shared_on: string | null;
    return_summary_doc_id: number | null;
  }>;

  return NextResponse.json({
    shareToken: rows.length > 0 ? rows[0].share_token : mockShareToken(id),
    bundle: AlignedNetworkClient.fhirBundleManifest(id),
    sessions: rows.map((r) => ({
      id: r.id,
      sharedWith: r.shared_with_org,
      sharedOn: r.shared_on,
      returned: r.return_summary_doc_id != null,
    })),
  });
}
