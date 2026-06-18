import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DEMO_NOW_ISO } from '@/lib/demo-clock';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { AlignedNetworkClient } from '@/lib/seams/network';
import { AuditLog } from '@/lib/seams/audit';

export const runtime = 'nodejs';

/**
 * POST /api/share/checkin — "Kill the Clipboard" outbound (FR-30, PRD §6.7).
 *
 * Body: { patientId, org }. Records a share_sessions row (mock token, FHIR
 * bundle manifest scoped by consent) and writes a purpose-of-use=treatment
 * audit entry via the AuditLog seam. Returns the shared manifest so the UI
 * can show the confirmation card.
 *
 * Determinism: the share token is 'MOCK-' + uppercase hex of an FNV-1a hash
 * of the patient id (same pattern as seededJitterMs) — same patient, same
 * token, every run. Re-checking in with an org the patient already shared
 * with refreshes that existing row (shared_on bumped) instead of inserting a
 * duplicate; this keeps repeat demo clicks idempotent and, for sarah +
 * "Lakeside Cardiology", reuses the SEEDED row (token MOCK-7F3A-QR, return
 * doc already linked) so the guided journey plays the seeded share/return
 * pair end-to-end.
 */

/** FNV-1a over the patient id → stable 8-hex-digit mock share token. */
function mockShareToken(patientId: string): string {
  let h = 2166136261;
  for (let i = 0; i < patientId.length; i++) {
    h ^= patientId.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `MOCK-${(h >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: { patientId?: unknown; org?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body');
  }
  const patientId = typeof body.patientId === 'string' ? body.patientId : '';
  const org = typeof body.org === 'string' ? body.org.trim() : '';
  if (!patientId) return jsonError('Missing patientId');
  if (!org) return jsonError('Missing org');

  const patient = findPatient(patientId);
  if (!patient) return unknownPatient(patientId);

  const bundle = AlignedNetworkClient.fhirBundleManifest(patientId);
  const db = getDb();

  // Reuse an existing share with this org (sarah's seeded Lakeside
  // Cardiology row included) rather than inserting a duplicate.
  const existing = db
    .prepare(
      `SELECT id FROM share_sessions
       WHERE patient_id = ? AND shared_with_org = ?
       ORDER BY id DESC LIMIT 1`
    )
    .get(patientId, org) as { id: number } | undefined;

  let shareId: number;
  if (existing) {
    db.prepare(`UPDATE share_sessions SET shared_on = ? WHERE id = ?`).run(
      DEMO_NOW_ISO,
      existing.id
    );
    shareId = existing.id;
  } else {
    const result = db
      .prepare(
        `INSERT INTO share_sessions
           (patient_id, share_token, shared_with_org, bundle_contents, purpose_of_use, shared_on)
         VALUES (?, ?, ?, ?, 'treatment', ?)`
      )
      .run(patientId, mockShareToken(patientId), org, JSON.stringify(bundle), DEMO_NOW_ISO);
    shareId = Number(result.lastInsertRowid);
  }

  AuditLog.record({
    patientId,
    actor: org,
    actorRole: 'clinic',
    scope: 'fhir_history_bundle',
    purposeOfUse: 'treatment',
  });

  return NextResponse.json({
    shareId,
    sharedWith: org,
    bundle,
    sharedOn: DEMO_NOW_ISO,
  });
}
