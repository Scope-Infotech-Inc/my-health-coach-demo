import { getDb } from '@/lib/db';
import { DEMO_NOW_ISO } from '@/lib/demo-clock';

/**
 * SEAM — AuditLog (PRD §9). Demo: writes SQLite access_log.
 * Production swap: tamper-evident audit store. Callers never touch the
 * table directly.
 */
export type PurposeOfUse = 'treatment' | 'individual_access' | 'patient_share' | 'operations';

export interface AuditEntry {
  patientId: string;
  actor: string;
  actorRole: string;
  scope: string;
  purposeOfUse: PurposeOfUse;
  /** ISO timestamp; defaults to the demo "now". */
  occurredAt?: string;
}

export const AuditLog = {
  record(entry: AuditEntry): void {
    const db = getDb();
    db.prepare(
      `INSERT INTO access_log (patient_id, occurred_at, actor, actor_role, scope, purpose_of_use)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      entry.patientId,
      entry.occurredAt ?? DEMO_NOW_ISO,
      entry.actor,
      entry.actorRole,
      entry.scope,
      entry.purposeOfUse
    );
  },

  list(patientId: string): Array<{
    occurredAt: string;
    actor: string;
    actorRole: string;
    scope: string;
    purposeOfUse: PurposeOfUse;
  }> {
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT occurred_at, actor, actor_role, scope, purpose_of_use
         FROM access_log WHERE patient_id = ?
         ORDER BY occurred_at DESC, id DESC`
      )
      .all(patientId) as Array<{
      occurred_at: string;
      actor: string;
      actor_role: string;
      scope: string;
      purpose_of_use: PurposeOfUse;
    }>;
    return rows.map((r) => ({
      occurredAt: r.occurred_at,
      actor: r.actor,
      actorRole: r.actor_role,
      scope: r.scope,
      purposeOfUse: r.purpose_of_use,
    }));
  },
};
