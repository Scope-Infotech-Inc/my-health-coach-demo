import { getDb } from '@/lib/db';
import { DEMO_TODAY, formatMediumDate } from '@/lib/demo-clock';

/**
 * SEAM — DocumentStore (PRD §9, FR-30/31). Demo: seeded mock documents
 * (accessible body_text styled to look scanned; never an image of text).
 * Production swap: real FHIR DocumentReference/Binary attachments.
 */
export interface ClinicalDocument {
  id: number;
  kind: 'radiology' | 'outside_lab' | 'specialist_note' | 'visit_summary' | 'discharge';
  title: string;
  docDate: string;
  sourceOrg: string;
  mime: string;
  fhirType: string;
  bodyText: string;
  aiRead: string | null;
}

interface DocRow {
  id: number;
  kind: ClinicalDocument['kind'];
  title: string;
  doc_date: string;
  source_org: string;
  mime: string;
  fhir_type: string;
  body_text: string;
  ai_read: string | null;
}

function mapRow(r: DocRow): ClinicalDocument {
  return {
    id: r.id,
    kind: r.kind,
    title: r.title,
    docDate: r.doc_date,
    sourceOrg: r.source_org,
    mime: r.mime,
    fhirType: r.fhir_type,
    bodyText: r.body_text,
    aiRead: r.ai_read,
  };
}

export const DocumentStore = {
  list(patientId: string): ClinicalDocument[] {
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT * FROM clinical_documents WHERE patient_id = ?
         ORDER BY doc_date DESC, id DESC`
      )
      .all(patientId) as DocRow[];
    return rows.map(mapRow);
  },

  get(patientId: string, docId: number): ClinicalDocument | null {
    const db = getDb();
    const row = db
      .prepare(`SELECT * FROM clinical_documents WHERE patient_id = ? AND id = ?`)
      .get(patientId, docId) as DocRow | undefined;
    return row ? mapRow(row) : null;
  },

  /**
   * Inbound visit summary via mock Smart Health Link (FR-30). If the share
   * session already references a seeded return document (sarah's journey),
   * return it; otherwise create one deterministically. All clinical values
   * in authored bodies come from the patient's existing record — nothing
   * invented.
   */
  returnVisitSummary(patientId: string, shareId: number): ClinicalDocument | null {
    const db = getDb();
    const share = db
      .prepare(`SELECT * FROM share_sessions WHERE id = ? AND patient_id = ?`)
      .get(shareId, patientId) as
      | { id: number; shared_with_org: string | null; return_summary_doc_id: number | null }
      | undefined;
    if (!share) return null;

    if (share.return_summary_doc_id != null) {
      return DocumentStore.get(patientId, share.return_summary_doc_id);
    }

    const patient = db
      .prepare(`SELECT first_name, last_name_initial FROM patients WHERE id = ?`)
      .get(patientId) as { first_name: string; last_name_initial: string } | undefined;
    if (!patient) return null;
    const org = share.shared_with_org ?? 'the visited clinic';
    const title = `Visit summary — ${org}`;
    const bodyText = [
      `VISIT SUMMARY (demonstration document — fictional)`,
      `Patient: ${patient.first_name} ${patient.last_name_initial}.`,
      `Visit date: ${formatMediumDate(DEMO_TODAY)} · ${org}`,
      ``,
      `Your records were received at check-in through your shared history bundle.`,
      `No re-entered forms were needed. Follow-up instructions and any plan`,
      `changes from this visit are listed in your after-visit notes. Your care`,
      `team can see this summary in your record.`,
    ].join('\n');
    const aiRead = `This is the visit summary ${org} sent back to your record after check-in. It confirms your shared history was used — you didn't fill out paper forms — and that any follow-up instructions are saved with your record. This is a demo document with fictional data. For decisions about your care, talk with your care team.`;

    const result = db
      .prepare(
        `INSERT INTO clinical_documents
           (patient_id, kind, title, doc_date, source_org, mime, fhir_type, body_text, ai_read)
         VALUES (?, 'visit_summary', ?, ?, ?, 'application/pdf', 'DocumentReference', ?, ?)`
      )
      .run(patientId, title, DEMO_TODAY, org, bodyText, aiRead);
    const newId = Number(result.lastInsertRowid);
    db.prepare(`UPDATE share_sessions SET return_summary_doc_id = ? WHERE id = ?`).run(
      newId,
      shareId
    );
    return DocumentStore.get(patientId, newId);
  },
};
