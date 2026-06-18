import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient, jsonError, parseJsonArray } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * POST /api/devices/disconnect — FR-23 (PRD §6.2).
 * Body {patientId, deviceId}. Behavior per #spec-api:
 *  - patient_devices → connected=0 (last_sync_at cleared back to the seed's
 *    NULL so disconnect restores seed-identical state);
 *  - remove ONLY the device-derived data_sources row this flow (or the
 *    seeder) adds — matched by name = "{Brand} {Model}" AND
 *    standards = ["Device data"]. EHR/claims/lab sources and the shared
 *    "My fitness band & smart scale" source never match and are never
 *    removed.
 *
 * Device-only UI cards hide as a consequence: the UI gates the
 * time-in-range card (priya's Dexcom G7 CGM) and the BP-trend card
 * (linda's Omron cuff) on the device appearing in GET
 * /api/patients/{id}/devices `connected`. The underlying presentation data
 * (timeInRange / bpTrend in app_meta persona_raw:{id}) is intentionally
 * NOT touched — re-connecting the device makes the card reappear with the
 * same seeded values.
 */

interface CatalogRow {
  id: string;
  brand: string;
  model: string;
  category: string;
  metrics: string;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body');
  }
  const { patientId, deviceId } = (body ?? {}) as {
    patientId?: unknown;
    deviceId?: unknown;
  };
  if (typeof patientId !== 'string' || typeof deviceId !== 'string') {
    return jsonError('patientId and deviceId are required');
  }

  const patient = findPatient(patientId);
  if (!patient) return unknownPatient(patientId);

  const db = getDb();
  const device = db
    .prepare('SELECT id, brand, model, category, metrics FROM device_catalog WHERE id = ?')
    .get(deviceId) as CatalogRow | undefined;
  if (!device) return jsonError(`Unknown device: ${deviceId}`, 404);

  const sourceName = `${device.brand} ${device.model}`;

  db.transaction(() => {
    db.prepare(
      `UPDATE patient_devices SET connected = 0, last_sync_at = NULL
       WHERE patient_id = ? AND device_id = ?`
    ).run(patientId, deviceId);

    // Only the device-derived source; the standards guard keeps every
    // EHR/claims/lab row safe even if a name ever collided.
    db.prepare(
      `DELETE FROM data_sources
       WHERE patient_id = ? AND name = ? AND standards = ?`
    ).run(patientId, sourceName, JSON.stringify(['Device data']));
  })();

  return NextResponse.json({
    connected: false,
    device: {
      id: device.id,
      brand: device.brand,
      model: device.model,
      category: device.category,
      metrics: parseJsonArray<string>(device.metrics),
    },
  });
}
