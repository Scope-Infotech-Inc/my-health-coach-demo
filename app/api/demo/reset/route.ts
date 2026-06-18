import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { jsonError } from '@/lib/api-helpers';
import { runSeed } from '@/lib/seed/seed';

export const runtime = 'nodejs';

/**
 * POST /api/demo/reset — restore the database to the seed state (FR-16).
 * Re-runs the deterministic seed against the live singleton connection;
 * runSeed drops + recreates every table inside one transaction, so open
 * prepared statements elsewhere simply re-prepare on next use. Returns
 * {ok:true} per #spec-api.
 */
export async function POST(): Promise<NextResponse> {
  try {
    runSeed(getDb());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'reset failed';
    return jsonError(`Demo reset failed: ${message}`, 500);
  }
  return NextResponse.json({ ok: true });
}
