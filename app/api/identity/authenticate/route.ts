import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { IdentityProvider, type Credential } from '@/lib/seams/identity';

export const runtime = 'nodejs';

/**
 * POST /api/identity/authenticate — simulated IAL2/AAL2 identity (FR-14).
 * Body: { patientId, credential: 'passkey' | 'mdl' }.
 * Scripted verification via the IdentityProvider seam (which writes the
 * access_log individual_access entry); records the chosen credential on the
 * patient's consent record so Data & Consent reflects it. No real IdP.
 * Returns { session, scopes, ial, aal }. 400 invalid credential; 404 unknown
 * patient.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const { patientId, credential } = (body ?? {}) as {
    patientId?: unknown;
    credential?: unknown;
  };

  if (typeof patientId !== 'string' || patientId.length === 0) {
    return jsonError('Missing required field: patientId');
  }
  if (!findPatient(patientId)) {
    return unknownPatient(patientId);
  }
  if (credential !== 'passkey' && credential !== 'mdl') {
    return jsonError("Invalid credential: expected 'passkey' or 'mdl'");
  }

  // Seam handles scripted verification + the individual_access audit entry.
  const session = IdentityProvider.authenticate(patientId, credential as Credential);

  // Data & Consent shows the credential the patient signed in with (FR-14).
  getDb()
    .prepare('UPDATE consents SET identity_credential = ? WHERE patient_id = ?')
    .run(credential, patientId);

  return NextResponse.json(session);
}
