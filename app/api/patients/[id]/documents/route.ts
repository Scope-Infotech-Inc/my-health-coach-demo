import { NextResponse } from 'next/server';
import { findPatient, unknownPatient } from '@/lib/api-helpers';
import { DocumentStore } from '@/lib/seams/documents';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/documents — unstructured clinical documents
 * (FR-31, §6.8) via the DocumentStore seam, newest first (doc_date DESC,
 * id DESC). List shape per #spec-api:
 * documents[]{id,kind,title,docDate,sourceOrg,mime,fhirType,aiRead} —
 * here aiRead is a BOOLEAN ("an AI plain-language read exists"); the full
 * read text and bodyText are served by /documents/{docId}. 404 unknown
 * patient.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  const documents = DocumentStore.list(id).map((d) => ({
    id: d.id,
    kind: d.kind,
    title: d.title,
    docDate: d.docDate,
    sourceOrg: d.sourceOrg,
    mime: d.mime,
    fhirType: d.fhirType,
    aiRead: d.aiRead != null,
  }));

  return NextResponse.json({ documents });
}
