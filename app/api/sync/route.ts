import { NextResponse } from 'next/server';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { AlignedNetworkClient } from '@/lib/seams/network';

/**
 * POST /api/sync — simulated Aligned Network sync (FR-13, #spec-api).
 * Body: { patientId }. Delegates entirely to the AlignedNetworkClient seam:
 * Record Locator → seeded 400–1200ms latency → bump last_sync_at to demo-now
 * for non-continuous sources. Returns { sources, recordLocator } where
 * recordLocator[] = { orgName, recordCount, lastUpdated }. Deterministic.
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

  const result = await AlignedNetworkClient.sync(patientId);
  return NextResponse.json(result);
}
