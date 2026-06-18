'use client';

import React from 'react';
import { PageHeader, DemoNote } from '@/components/ui';
import { StandardsChip } from '@/components/ds';
import { DataFlowDiagram } from './_components/DataFlowDiagram';
import styles from './page.module.css';

/**
 * /how-it-works — a plain-language briefing on the concept behind the app
 * (DESIGN-BRIEF §7). Static explanatory content authored fresh from PRD §2
 * (the CMS Interoperability Framework's five categories), §11.1 (identity,
 * consent, audit), and §9 (the simulation seams). No persona data is needed,
 * so this page reads no API; the copy below is original briefing text, not
 * display data. Status is always icon + color; every simulated boundary is
 * named honestly.
 */

interface Takeaway {
  icon: string;
  text: React.ReactNode;
}

const TAKEAWAYS: Takeaway[] = [
  {
    icon: 'link',
    text: (
      <>
        Your health records are <strong>scattered across many providers</strong>. This app gathers
        them into one place you control.
      </>
    ),
  },
  {
    icon: 'verified_user',
    text: (
      <>
        Nothing moves <strong>without your consent</strong>. You decide who reads your record, and
        you can revoke that access at any time.
      </>
    ),
  },
  {
    icon: 'insights',
    text: (
      <>
        Once your record is connected, the app turns it into{' '}
        <strong>coaching, reminders, and risk alerts</strong> written in plain language.
      </>
    ),
  },
];

interface Category {
  icon: string;
  title: string;
  detail: string;
}

/** The CMS Interoperability Framework's five categories, restated plainly. */
const CATEGORIES: Category[] = [
  {
    icon: 'person',
    title: 'Patient access and empowerment',
    detail:
      'You can reach your own complete record and act on it, rather than waiting on a fax or a clipboard at the front desk.',
  },
  {
    icon: 'groups',
    title: 'Provider access and delegation',
    detail:
      'When you allow it, your care team can see the same record, so the people treating you work from one shared picture.',
  },
  {
    icon: 'rule',
    title: 'Data availability and standards',
    detail:
      'Records arrive in common health-data formats, so a lab result from one clinic reads the same as one from another.',
  },
  {
    icon: 'hub',
    title: 'Network connectivity and transparency',
    detail:
      'Connected networks can locate where your records live and return them, and they say plainly how that connection works.',
  },
  {
    icon: 'shield_lock',
    title: 'Identity, security, and trust',
    detail:
      'A verified sign-in confirms who you are before any record is shared, and every read is recorded so it can be reviewed.',
  },
];

interface SecurityPoint {
  icon: string;
  title: string;
  detail: React.ReactNode;
  chips?: string[];
}

const SECURITY: SecurityPoint[] = [
  {
    icon: 'fingerprint',
    title: 'Verified identity at sign-in',
    detail:
      'You sign in once with a passkey or a mobile driver’s license at a high assurance level before any record is reached. There is no password to steal and no shared account.',
    chips: ['IAL2 identity proofing', 'AAL2 authentication'],
  },
  {
    icon: 'verified_user',
    title: 'Consent you grant and can revoke',
    detail:
      'Access is scoped to what you approve. Revoking it returns the app to a disconnected state, and the connection is rebuilt only when you choose to reconnect.',
  },
  {
    icon: 'fact_check',
    title: 'An audit trail you can read',
    detail:
      'Every access is logged with who read your record, when, what part they read, and why — for treatment, for your own access, or for a share you directed. You can review the full list at any time.',
  },
];

interface SeamRow {
  capability: string;
  now: string;
  later: string;
}

/** Demo-vs-production seam table, drawn from PRD §9 and §11.1. */
const SEAMS: SeamRow[] = [
  {
    capability: 'Network sync and record locate',
    now: 'Reads a built-in sample record with a scripted locate step and a short, fixed delay.',
    later:
      'Queries a real CMS Aligned Network, with a record-locator service and a full record export.',
  },
  {
    capability: 'Identity and sign-in',
    now: 'A scripted passkey and mobile-license screen that always succeeds.',
    later: 'A real CMS digital-identity service with scoped, standards-based authorization.',
  },
  {
    capability: 'Documents in your chart',
    now: 'Sample documents rendered as readable on-screen text.',
    later: 'Real document attachments with an extraction step that pulls out the data.',
  },
  {
    capability: 'Medical codes and terms',
    now: 'A fixed code-to-name list shown for illustration only.',
    later: 'A live terminology service bound to the current official code releases.',
  },
  {
    capability: 'AI reading and insights',
    now: 'A fixed, on-device explainer with no learning model and no clinical judgment.',
    later: 'A governed model behind the same safeguards, escalation paths, and AI labeling.',
  },
  {
    capability: 'Audit logging',
    now: 'Access entries written to a local file for this demo.',
    later: 'A tamper-evident audit store with access reports.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="How it works"
        title="What this app does, and what is real"
        lede="This is a demonstration of the CMS Health Tech Ecosystem concept for diabetes and obesity care. Here is the idea behind it, how your records would flow, and which parts are simulated for the demo."
      />

      {/* Takeaway strip */}
      <section className={styles.block} aria-labelledby="takeaways-heading">
        <div className={styles.blockHead}>
          <p className={styles.eyebrow}>The short version</p>
          <h2 id="takeaways-heading" className={styles.blockTitle}>
            Three things to know
          </h2>
        </div>
        <div className={styles.takeaways}>
          {TAKEAWAYS.map((t, i) => (
            <div key={i} className={styles.takeaway}>
              <span className={styles.takeawayIcon}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {t.icon}
                </span>
              </span>
              <p className={styles.takeawayText}>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data-flow diagram */}
      <section className={styles.block} aria-labelledby="dataflow-heading">
        <div className={styles.blockHead}>
          <p className={styles.eyebrow}>How your records reach you</p>
          <h2 id="dataflow-heading" className={styles.blockTitle}>
            From your providers to this app
          </h2>
          <p className={styles.blockLede}>
            Your record travels across two boundaries. A connected network finds and returns it, and
            a verified sign-in plus your consent decide what this app is allowed to read.
          </p>
        </div>
        <DataFlowDiagram />
      </section>

      {/* Five framework-category cards */}
      <section className={styles.block} aria-labelledby="framework-heading">
        <div className={styles.blockHead}>
          <p className={styles.eyebrow}>The framework</p>
          <h2 id="framework-heading" className={styles.blockTitle}>
            Five things a connected network is built to do
          </h2>
          <p className={styles.blockLede}>
            The CMS Interoperability Framework groups its goals into five categories. This app is
            designed to show each one from the patient side.
          </p>
        </div>
        <div className={styles.categories}>
          {CATEGORIES.map((c) => (
            <div key={c.title} className={styles.category}>
              <span className={styles.categoryIcon}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {c.icon}
                </span>
              </span>
              <div className={styles.categoryBody}>
                <h3 className={styles.categoryTitle}>{c.title}</h3>
                <p className={styles.categoryDetail}>{c.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security note */}
      <section className={styles.block} aria-labelledby="security-heading">
        <div className={styles.blockHead}>
          <p className={styles.eyebrow}>Identity, consent, and audit</p>
          <h2 id="security-heading" className={styles.blockTitle}>
            How your record stays yours
          </h2>
          <p className={styles.blockLede}>
            Three safeguards sit between your record and anyone who reads it. Each is stated in
            standards terms so a reviewer can map it to the production target.
          </p>
        </div>
        <div className={styles.security}>
          {SECURITY.map((s) => (
            <div key={s.title} className={styles.securityItem}>
              <span className={styles.securityIcon}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {s.icon}
                </span>
              </span>
              <div className={styles.securityBody}>
                <h3 className={styles.securityTitle}>{s.title}</h3>
                <p className={styles.securityDetail}>{s.detail}</p>
                {s.chips && (
                  <div className={styles.chipRow}>
                    {s.chips.map((label) => (
                      <StandardsChip key={label} label={label} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo-vs-production seam table */}
      <section className={styles.block} aria-labelledby="seams-heading">
        <div className={styles.blockHead}>
          <p className={styles.eyebrow}>Demo and production</p>
          <h2 id="seams-heading" className={styles.blockTitle}>
            What is simulated now, and what swaps in later
          </h2>
          <p className={styles.blockLede}>
            Every outside connection is faked behind a fixed boundary, so this demo makes no outside
            calls. Each boundary is built to be replaced by the real service later without changing
            the screens you see.
          </p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>How each capability behaves in this demo versus a production build</caption>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col">In this demo</th>
                <th scope="col">In production</th>
              </tr>
            </thead>
            <tbody>
              {SEAMS.map((row) => (
                <tr key={row.capability}>
                  <th scope="row">{row.capability}</th>
                  <td>
                    <span className={styles.cellNow}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        science
                      </span>
                      <span>{row.now}</span>
                    </span>
                  </td>
                  <td>
                    <span className={styles.cellLater}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        swap_horiz
                      </span>
                      <span>{row.later}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DemoNote>
          Demo — every connection on this page is simulated against built-in sample data. The app
          makes no outside network calls, and no real health data is involved.
        </DemoNote>
      </section>
    </div>
  );
}
