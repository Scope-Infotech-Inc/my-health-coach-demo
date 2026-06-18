import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient, parseJsonArray } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/devices — FR-23 (PRD §6.2).
 * Shape per #spec-api:
 *   connected[]{id,brand,model,category,metrics[],lastSyncAt}
 *   available[]{id,brand,model,category,metrics[]}
 * Joined from device_catalog × patient_devices; `metrics` is a JSON-array
 * TEXT column. Seeded connected devices carry last_sync_at = NULL (the UI
 * treats continuous sources without a timestamp as "continuous"); pairing
 * via POST /api/devices/connect stamps DEMO_NOW_ISO.
 */

interface CatalogRow {
  id: string;
  brand: string;
  model: string;
  category: string;
  metrics: string;
}

interface ConnectedRow extends CatalogRow {
  last_sync_at: string | null;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const db = getDb();

  const connectedRows = db
    .prepare(
      `SELECT dc.id, dc.brand, dc.model, dc.category, dc.metrics, pd.last_sync_at
       FROM patient_devices pd
       JOIN device_catalog dc ON dc.id = pd.device_id
       WHERE pd.patient_id = ? AND pd.connected = 1
       ORDER BY pd.id`
    )
    .all(id) as ConnectedRow[];

  const connectedIds = new Set(connectedRows.map((r) => r.id));

  // Deterministic order; the UI groups the "Available to connect" grid by category.
  const catalogRows = db
    .prepare(
      `SELECT id, brand, model, category, metrics
       FROM device_catalog
       ORDER BY category, brand, model`
    )
    .all() as CatalogRow[];

  const connected = connectedRows.map((r) => ({
    id: r.id,
    brand: r.brand,
    model: r.model,
    category: r.category,
    metrics: parseJsonArray<string>(r.metrics),
    lastSyncAt: r.last_sync_at,
  }));

  const available = catalogRows
    .filter((r) => !connectedIds.has(r.id))
    .map((r) => ({
      id: r.id,
      brand: r.brand,
      model: r.model,
      category: r.category,
      metrics: parseJsonArray<string>(r.metrics),
    }));

  return NextResponse.json({ connected, available });
}
