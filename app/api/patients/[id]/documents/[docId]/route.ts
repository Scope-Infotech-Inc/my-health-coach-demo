import { NextResponse } from 'next/server';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { DocumentStore } from '@/lib/seams/documents';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/documents/{docId} — single document for the viewer
 * (FR-31, §6.8) via the DocumentStore seam. Adds bodyText (accessible DOM
 * text, styled to look scanned) and the full AI plain-language read per
 * #spec-api:
 * document{id,kind,title,docDate,sourceOrg,mime,fhirType,bodyText,aiRead}.
 * 404 unknown patient; 404 if the document does not exist or belongs to a
 * different patient (DocumentStore.get scopes by patient_id).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; docId: string }> }
): Promise<NextResponse> {
  const { id, docId } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  const numericDocId = Number(docId);
  const doc = Number.isInteger(numericDocId) ? DocumentStore.get(id, numericDocId) : null;
  if (!doc) return jsonError(`Unknown document: ${docId}`, 404);

  return NextResponse.json({
    document: {
      id: doc.id,
      kind: doc.kind,
      title: doc.title,
      docDate: doc.docDate,
      sourceOrg: doc.sourceOrg,
      mime: doc.mime,
      fhirType: doc.fhirType,
      bodyText: doc.bodyText,
      aiRead: doc.aiRead,
    },
  });
}
