import { NextResponse } from 'next/server';
import { findPatient, unknownPatient } from '@/lib/api-helpers';
import { AlignedNetworkClient } from '@/lib/seams/network';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/sources — per #spec-api:
 * sources[]{name,description,standards[],lastSyncAt?,continuous}.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const sources = AlignedNetworkClient.listSources(id).map((s) => ({
    name: s.name,
    description: s.description,
    standards: s.standards,
    ...(s.lastSyncAt != null ? { lastSyncAt: s.lastSyncAt } : {}),
    continuous: s.continuous,
  }));

  return NextResponse.json({ sources });
}
