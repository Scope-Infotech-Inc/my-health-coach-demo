import Link from 'next/link';
import styles from './AppFooter.module.css';

const SIMULATED_SEAMS = [
  'Aligned Network query',
  'EHR & labs',
  'Claims',
  'Devices',
  'Identity (IAL2/AAL2)',
  'Consent',
  'Documents',
  'Terminology',
  'AI interpretation',
];

/** App footer (DESIGN-BRIEF §4): restated disclaimer + the list of
 *  interfaces this demo simulates behind clean seams. */
export function AppFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={`${styles.footer} ${compact ? styles.compact : ''}`}>
      <div className={styles.inner}>
        <div className={styles.lead}>
          <p className={styles.brand}>My Health Coach — Concept Demo</p>
          <p className={styles.disclaimer}>
            Fictional data for demonstration. Not an official CMS product and not for clinical use.{' '}
            <Link href="/how-it-works" className={styles.link}>
              How it works
            </Link>
            .
          </p>
        </div>
        <div className={styles.seams}>
          <p className={styles.seamsLabel}>Simulated in this demo</p>
          <ul className={styles.seamList}>
            {SIMULATED_SEAMS.map((s) => (
              <li key={s} className={styles.seam}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.colophon}>
        {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> per app convention (see ds/Avatar) */}
        <img
          className={styles.scopeLogo}
          src="/scope-logo.png"
          alt="Scope Infotech, Inc."
          width={150}
          height={44}
        />
        <p className={styles.copyright}>Built by Scope Infotech, Inc. · © 2026</p>
      </div>
    </footer>
  );
}
