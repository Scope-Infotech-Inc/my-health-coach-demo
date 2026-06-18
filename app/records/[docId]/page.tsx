'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { PageHeader, EmptyState, DemoNote, AICard } from '@/components/ui';
import { Button, StandardsChip, MetaChip } from '@/components/ds';
import { formatMediumDate } from '@/lib/demo-clock';
import styles from './page.module.css';

type DocKind = 'radiology' | 'outside_lab' | 'specialist_note' | 'visit_summary' | 'discharge';

interface DocumentDetail {
  id: number;
  kind: DocKind;
  title: string;
  docDate: string;
  sourceOrg: string;
  mime: string;
  fhirType: string;
  bodyText: string;
  /** In the detail endpoint this is the full read text, or null if none. */
  aiRead: string | null;
}

interface DocumentResponse {
  document: DocumentDetail;
}

const KIND_LABEL: Record<DocKind, string> = {
  radiology: 'Imaging report',
  outside_lab: 'Outside lab result',
  specialist_note: 'Specialist note',
  visit_summary: 'Visit summary',
  discharge: 'Discharge summary',
};

function mimeTag(mime: string): string {
  if (mime === 'application/pdf') return 'PDF';
  const sub = mime.split('/')[1] ?? mime;
  return sub.replace(/[-+].*$/, '').toUpperCase();
}

export default function RecordViewerPage({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = use(params);
  const router = useRouter();
  const { personaId } = usePersona();
  const { pushToast } = useToast();
  const [explained, setExplained] = useState(false);

  const { data, loading, error } = useApi<DocumentResponse>(
    `/api/patients/${personaId}/documents/${docId}`
  );
  const doc = data?.document;

  const escalate = () => {
    pushToast({
      tone: 'success',
      icon: 'forum',
      message: 'Your question and this document were sent to your care team. Demo — simulated.',
    });
  };

  if (error || (!loading && !doc)) {
    return (
      <div className={styles.column}>
        <PageHeader eyebrow="My account" title="Document" />
        <p className={styles.backRow}>
          <Link href="/records" className={styles.backLink}>
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_back
            </span>
            Back to my records
          </Link>
        </p>
        <EmptyState
          icon="error"
          message="This document is not in your record. It may belong to a different patient."
          actionLabel="Back to my records"
          onAction={() => router.push('/records')}
        />
      </div>
    );
  }

  const kindLabel = doc ? (KIND_LABEL[doc.kind] ?? 'Document') : 'Document';

  return (
    <div className={styles.column}>
      <p className={styles.backRow}>
        <Link href="/records" className={styles.backLink}>
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
          Back to my records
        </Link>
      </p>

      <PageHeader
        eyebrow={kindLabel}
        title={doc ? doc.title : 'Loading document'}
        lede={
          doc
            ? `Shared by ${doc.sourceOrg}. The text below is the document as your providers sent it.`
            : undefined
        }
      />

      {doc && (
        <div className={styles.metaRow}>
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
          <StandardsChip label={`FHIR ${doc.fhirType}`} />
        </div>
      )}

      <DemoNote icon="science">
        Demo — this is a fictional document rendered as selectable text, not a scan or an official
        record.
      </DemoNote>

      {doc && (
        <section aria-labelledby="record-contents-heading" className={styles.column}>
          <h2 id="record-contents-heading" className={styles.sectionHeading}>
            Document contents
          </h2>
          <div className={styles.scanBed}>
            <article className={styles.sheet}>
              <p className={styles.sheetBody}>{doc.bodyText}</p>
            </article>
          </div>
        </section>
      )}

      {doc && (
        <section aria-labelledby="record-explain-heading" className={styles.column}>
          <h2 id="record-explain-heading" className={styles.sectionHeading}>
            Plain-language explanation
          </h2>
          {doc.aiRead ? (
            !explained ? (
              <div className={styles.explainRow}>
                <Button variant="secondary" icon="auto_awesome" onClick={() => setExplained(true)}>
                  Explain this
                </Button>
              </div>
            ) : (
              <AICard
                title="What this document says, in plain language"
                severity="info"
                basis={[`${kindLabel} from ${doc.sourceOrg}`, formatMediumDate(doc.docDate)]}
                escalationLabel="Ask my care team"
                onEscalate={escalate}
              >
                <p>{doc.aiRead}</p>
              </AICard>
            )
          ) : (
            <p className={styles.metaItem}>
              <span className="material-symbols-outlined" aria-hidden="true">
                info
              </span>
              A plain-language explanation is not available for this document.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
