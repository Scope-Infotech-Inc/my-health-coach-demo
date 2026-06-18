import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient, jsonError, parseJsonArray, sleep } from '@/lib/api-helpers';
import { DEMO_NOW_ISO, DEMO_TODAY, seededJitterMs } from '@/lib/demo-clock';

export const runtime = 'nodejs';

/**
 * POST /api/devices/connect — simulated pairing (FR-23, PRD §6.2).
 * Body {patientId, deviceId}. Behavior per #spec-api:
 *  - seeded deterministic 1–2s "pairing" delay (no wall-clock randomness);
 *  - upsert patient_devices → connected=1, last_sync_at = demo "now";
 *  - surface the device as a Data & Consent source: add a data_sources row
 *    if absent, byte-identical to the seeder's device-source shape
 *    (lib/seed/seed.ts) — name "{Brand} {Model}", description = metrics
 *    humanized ("steps, active minutes, heart rate"), standards
 *    ["Device data"], continuous=1, next sort, last_sync_at NULL
 *    (continuous sources show no discrete sync time);
 *  - FIRST device connect awards the Device Connector badge when the
 *    patient has an unearned patient_badges row for it (maria/robert have
 *    no row, so nothing is awarded for them).
 * Returns {connected:true, device:{…}, badgeAwarded?:{…}} — badgeAwarded
 * uses the gamification badge shape {id,name,description,criterion,icon,
 * earned,earnedOn}.
 */

interface CatalogRow {
  id: string;
  brand: string;
  model: string;
  category: string;
  metrics: string;
}

interface BadgeRow {
  id: string;
  name: string;
  description: string;
  criterion: string;
  icon: string;
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

  // Simulated pairing latency — deterministic, same key → same delay.
  await sleep(seededJitterMs(`pair:${patientId}:${deviceId}`, 1000, 2000));

  const sourceName = `${device.brand} ${device.model}`;
  const sourceDescription = parseJsonArray<string>(device.metrics)
    .map((m) => m.replace(/_/g, ' '))
    .join(', ');

  let badgeAwarded: (BadgeRow & { earned: true; earnedOn: string }) | undefined;

  db.transaction(() => {
    // Upsert patient_devices (no UNIQUE(patient_id, device_id) — update-or-insert).
    const existing = db
      .prepare('SELECT id FROM patient_devices WHERE patient_id = ? AND device_id = ?')
      .get(patientId, deviceId) as { id: number } | undefined;
    if (existing) {
      db.prepare('UPDATE patient_devices SET connected = 1, last_sync_at = ? WHERE id = ?').run(
        DEMO_NOW_ISO,
        existing.id
      );
    } else {
      db.prepare(
        `INSERT INTO patient_devices (patient_id, device_id, connected, last_sync_at)
         VALUES (?, ?, 1, ?)`
      ).run(patientId, deviceId, DEMO_NOW_ISO);
    }

    // Add the matching Data & Consent source if absent (idempotent re-connect).
    const hasSource = db
      .prepare('SELECT id FROM data_sources WHERE patient_id = ? AND name = ?')
      .get(patientId, sourceName) as { id: number } | undefined;
    if (!hasSource) {
      const next = db
        .prepare('SELECT COALESCE(MAX(sort) + 1, 0) AS next FROM data_sources WHERE patient_id = ?')
        .get(patientId) as { next: number };
      db.prepare(
        `INSERT INTO data_sources (patient_id, name, description, standards, last_sync_at, continuous, sort)
         VALUES (?, ?, ?, ?, NULL, 1, ?)`
      ).run(patientId, sourceName, sourceDescription, JSON.stringify(['Device data']), next.next);
    }

    // First connect → award Device Connector. The unearned-row check encodes
    // "first": once awarded, later connects find earned=1 and skip.
    const unearned = db
      .prepare(
        `SELECT b.id, b.name, b.description, b.criterion, b.icon
         FROM patient_badges pb JOIN badges b ON b.id = pb.badge_id
         WHERE pb.patient_id = ? AND pb.badge_id = 'device_connector' AND pb.earned = 0`
      )
      .get(patientId) as BadgeRow | undefined;
    if (unearned) {
      db.prepare(
        `UPDATE patient_badges SET earned = 1, earned_on = ?
         WHERE patient_id = ? AND badge_id = 'device_connector'`
      ).run(DEMO_TODAY, patientId);
      badgeAwarded = { ...unearned, earned: true, earnedOn: DEMO_TODAY };
    }
  })();

  return NextResponse.json({
    connected: true,
    device: {
      id: device.id,
      brand: device.brand,
      model: device.model,
      category: device.category,
      metrics: parseJsonArray<string>(device.metrics),
      lastSyncAt: DEMO_NOW_ISO,
    },
    ...(badgeAwarded ? { badgeAwarded } : {}),
  });
}
