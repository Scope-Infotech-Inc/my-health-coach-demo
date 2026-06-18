'use client';

import React from 'react';
import styles from './DataFlowDiagram.module.css';

/**
 * Route-local data-flow diagram for /how-it-works (DESIGN-BRIEF §7).
 * Three columns — your providers & networks → CMS Aligned Network → this app —
 * joined by two arrows that carry the simulation-seam name for each hop.
 * The SVG is decorative (aria-hidden); the accessible content is the
 * visually-hidden text equivalent plus the on-screen column captions, so a
 * screen reader hears the same story the picture tells. Original geometry on
 * the design-system tokens; no chart library, no external assets.
 */

interface Stage {
  /** Material Symbol glyph name for the stage icon. */
  icon: string;
  /** Short heading shown under the icon. */
  title: string;
  /** One-line plain description of what lives at this stage. */
  detail: string;
}

interface Hop {
  /** The seam (TypeScript interface) that names this boundary. */
  seam: string;
  /** What crosses the boundary, in plain words. */
  carries: string;
}

const STAGES: Stage[] = [
  {
    icon: 'local_hospital',
    title: 'Your providers and networks',
    detail:
      'Clinics, hospitals, labs, pharmacies, and health plans that already hold your records.',
  },
  {
    icon: 'hub',
    title: 'CMS Aligned Network',
    detail:
      'A network that locates your records across organizations and returns them in a common format.',
  },
  {
    icon: 'phone_iphone',
    title: 'This app',
    detail:
      'With your consent, turns the returned record into coaching, reminders, and risk alerts you can read.',
  },
];

const HOPS: Hop[] = [
  {
    seam: 'AlignedNetworkClient',
    carries: 'Record locate and fetch',
  },
  {
    seam: 'IdentityProvider plus consent',
    carries: 'Verified identity, then a consented read',
  },
];

export function DataFlowDiagram() {
  return (
    <figure className={styles.figure}>
      <div className={styles.diagram} role="group" aria-labelledby="dataflow-caption">
        <p id="dataflow-caption" className={styles.srOnly}>
          Data flows from your providers and networks, through a CMS Aligned Network that locates
          and returns your records, into this app. The first hop is the simulated
          AlignedNetworkClient seam that locates and fetches records. The second hop is the
          simulated identity and consent seam, which verifies who you are and then reads only what
          you have consented to share.
        </p>

        {STAGES.map((stage, i) => (
          <React.Fragment key={stage.title}>
            <div className={styles.stage}>
              <span className={styles.stageIcon}>
                <span className="material-symbols-outlined" aria-hidden="true">
                  {stage.icon}
                </span>
              </span>
              <h3 className={styles.stageTitle}>{stage.title}</h3>
              <p className={styles.stageDetail}>{stage.detail}</p>
            </div>

            {i < HOPS.length && (
              <div className={styles.hop} aria-hidden="true">
                <span className={styles.hopSeam}>{HOPS[i].seam}</span>
                <svg
                  className={styles.arrow}
                  viewBox="0 0 96 24"
                  preserveAspectRatio="none"
                  focusable="false"
                >
                  <line x1="2" y1="12" x2="84" y2="12" className={styles.arrowLine} />
                  <path d="M82 6 L94 12 L82 18 Z" className={styles.arrowHead} />
                </svg>
                <span className={styles.hopCarries}>{HOPS[i].carries}</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </figure>
  );
}
