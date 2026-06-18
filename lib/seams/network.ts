import { getDb } from '@/lib/db';
import { DEMO_NOW_ISO, seededJitterMs } from '@/lib/demo-clock';
import { parseJsonArray, readAppMetaJson } from '@/lib/api-helpers';
import { sleep } from '@/lib/api-helpers';

/**
 * SEAM — AlignedNetworkClient (PRD §9). Demo: reads SQLite, seeded Record
 * Locator, deterministic latency. Production swap: real CMS Aligned Network
 * query/respond, FHIR $everything, SMART Health Links — same contract.
 */
export interface LocatorResult {
  orgName: string;
  recordCount: number;
  lastUpdated: string | null;
}

export interface SourceRow {
  name: string;
  description: string;
  standards: string[];
  lastSyncAt: string | null;
  continuous: boolean;
}

export const AlignedNetworkClient = {
  /** Record Locator: which organizations hold records for this patient. */
  recordLocator(patientId: string): LocatorResult[] {
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT org_name, record_count, last_updated FROM record_locator_results
         WHERE patient_id = ? ORDER BY id`
      )
      .all(patientId) as Array<{
      org_name: string;
      record_count: number;
      last_updated: string | null;
    }>;
    if (rows.length > 0) {
      return rows.map((r) => ({
        orgName: r.org_name,
        recordCount: r.record_count,
        lastUpdated: r.last_updated,
      }));
    }
    return readAppMetaJson<LocatorResult[]>('record_locator_default') ?? [];
  },

  listSources(patientId: string): SourceRow[] {
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT name, description, standards, last_sync_at, continuous
         FROM data_sources WHERE patient_id = ? ORDER BY sort, id`
      )
      .all(patientId) as Array<{
      name: string;
      description: string;
      standards: string;
      last_sync_at: string | null;
      continuous: number;
    }>;
    return rows.map((r) => ({
      name: r.name,
      description: r.description,
      standards: parseJsonArray<string>(r.standards),
      lastSyncAt: r.last_sync_at,
      continuous: r.continuous === 1,
    }));
  },

  /**
   * Simulated sync (FR-13): seeded 400–1200ms latency, then bump
   * last_sync_at to demo-now for non-continuous sources. Returns the
   * updated sources + locator results. Fully deterministic.
   */
  async sync(patientId: string): Promise<{ sources: SourceRow[]; recordLocator: LocatorResult[] }> {
    const locator = AlignedNetworkClient.recordLocator(patientId);
    await sleep(seededJitterMs(`sync:${patientId}`, 400, 1200));
    const db = getDb();
    db.prepare(
      `UPDATE data_sources SET last_sync_at = ? WHERE patient_id = ? AND continuous = 0`
    ).run(DEMO_NOW_ISO, patientId);
    return { sources: AlignedNetworkClient.listSources(patientId), recordLocator: locator };
  },

  /**
   * Manifest of FHIR resource types a check-in share would include
   * (scoped by consent). Structural resource-type names, not PHI.
   */
  fhirBundleManifest(patientId: string): string[] {
    const db = getDb();
    const row = db
      .prepare(
        `SELECT bundle_contents FROM share_sessions WHERE patient_id = ? ORDER BY id DESC LIMIT 1`
      )
      .get(patientId) as { bundle_contents: string } | undefined;
    const fromSeed = row ? parseJsonArray<string>(row.bundle_contents) : [];
    if (fromSeed.length > 0) return fromSeed;
    return ['Conditions', 'Medications', 'Allergies', 'Recent labs', 'Vitals'];
  },
};
