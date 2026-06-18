'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { PageHeader, PlainWords, EmptyState, DemoNote } from '@/components/ui';
import { Card, StandardsChip, MetaChip } from '@/components/ds';
import { formatMediumDate } from '@/lib/demo-clock';
import styles from './page.module.css';

/** Document kinds the DocumentStore seam emits (see lib/seams/documents.ts). */
type DocKind = 'radiology' | 'outside_lab' | 'specialist_note' | 'visit_summary' | 'discharge';

interface DocumentListItem {
  id: number;
  kind: DocKind;
  title: string;
  docDate: string;
  sourceOrg: string;
  mime: string;
  fhirType: string;
  /** In the list endpoint this is a boolean — a read exists or it does not. */
  aiRead: boolean;
}

interface DocumentsResponse {
  documents: DocumentListItem[];
}

/** Kind → Material Symbol + plain-language label (authored, not paraphrased). */
const KIND_META: Record<DocKind, { icon: string; label: string }> = {
  radiology: { icon: 'radiology', label: 'Imaging report' },
  outside_lab: { icon: 'labs', label: 'Outside lab result' },
  specialist_note: { icon: 'clinical_notes', label: 'Specialist note' },
  visit_summary: { icon: 'description', label: 'Visit summary' },
  discharge: { icon: 'home_health', label: 'Discharge summary' },
};

function kindMeta(kind: DocKind) {
  return KIND_META[kind] ?? { icon: 'description', label: 'Document' };
}

/** Short, friendly tag for a MIME type (e.g. application/pdf → PDF). */
function mimeTag(mime: string): string {
  if (mime === 'application/pdf') return 'PDF';
  const sub = mime.split('/')[1] ?? mime;
  return sub.replace(/[-+].*$/, '').toUpperCase();
}

function DocumentCard({ doc }: { doc: DocumentListItem }) {
  const [showCodes, setShowCodes] = useState(false);
  const meta = kindMeta(doc.kind);
  const codesId = `record-codes-${doc.id}`;

  return (
    <li className={styles.entry}>
      <Link href={`/records/${doc.id}`} className={styles.viewerLink}>
        <Card interactive padded>
          <div className={styles.cardRow}>
            <span className={styles.kindChip} aria-hidden="true">
              <span className="material-symbols-outlined">{meta.icon}</span>
            </span>
            <div className={styles.cardMain}>
              <p className={styles.kindLabel}>{meta.label}</p>
              <h3 className={styles.docTitle}>{doc.title}</h3>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    event
                  </span>
                  {formatMediumDate(doc.docDate)}
                </span>
                <span className={styles.metaItem}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    apartment
                  </span>
                  {doc.sourceOrg}
                </span>
                <MetaChip>{mimeTag(doc.mime)}</MetaChip>
                {doc.aiRead && (
                  <span className={styles.aiDot}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      smart_toy
                    </span>
                    AI read available
                  </span>
                )}
              </div>
            </div>
            <span className={styles.cardArrow} aria-hidden="true">
              <span className="material-symbols-outlined">chevron_right</span>
            </span>
          </div>
        </Card>
      </Link>

      <div className={styles.expandRow}>
        <button
          type="button"
          className={styles.expandBtn}
          aria-expanded={showCodes}
          aria-controls={codesId}
          onClick={() => setShowCodes((v) => !v)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {showCodes ? 'expand_less' : 'expand_more'}
          </span>
          {showCodes ? 'Hide standard codes' : 'Show standard codes'}
        </button>
      </div>
      {showCodes && (
        <div id={codesId} className={styles.codeChips}>
          <StandardsChip label={`FHIR ${doc.fhirType}`} />
          <StandardsChip label={`Kind ${doc.kind}`} />
          <StandardsChip label={doc.mime} />
        </div>
      )}
    </li>
  );
}

export default function RecordsPage() {
  const { personaId } = usePersona();
  const { data, loading, error } = useApi<DocumentsResponse>(
    `/api/patients/${personaId}/documents`
  );

  const documents = data?.documents ?? [];

  return (
    <div className={styles.column}>
      <PageHeader
        eyebrow="My account"
        title="My records"
        lede="Reports and summaries your providers shared into your record, newest first. Open any document to read it in plain text and ask for a plain-language explanation."
      />

      <div className={styles.standards}>
        <StandardsChip label="USCDI v3" />
        <StandardsChip label="US Core IG" />
        <MetaChip>Illustrative codes</MetaChip>
      </div>

      <DemoNote icon="science">
        Demo — these documents hold fictional data and illustrative standard codes, not a real
        health record.
      </DemoNote>

      {error ? (
        <EmptyState
          icon="error"
          message="Your records could not be loaded. Try again in a moment."
        />
      ) : !loading && documents.length === 0 ? (
        <EmptyState
          icon="folder_open"
          message="No documents are in your record yet. Connected reports and visit summaries will appear here."
        />
      ) : (
        <section aria-labelledby="records-timeline-heading" className={styles.column}>
          <PlainWords>
            You have{' '}
            <strong>
              {documents.length} document{documents.length === 1 ? '' : 's'}
            </strong>{' '}
            in your record. Each came from a provider or network you connected.
          </PlainWords>
          <h2 id="records-timeline-heading" className={styles.timelineHeading}>
            Document timeline
          </h2>
          <ul className={styles.timeline}>
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
