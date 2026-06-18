'use client';

import React from 'react';
import { useViewport } from '@/lib/use-viewport';
import { usePersona } from '@/lib/persona-context';
import { AppHeader } from './AppHeader';
import { AppBar } from './AppBar';
import { Sidebar } from './Sidebar';
import { BottomTabs } from './BottomTabs';
import { AppFooter } from './AppFooter';
import { JourneyStepper } from './JourneyStepper';
import { HashScroll } from './HashScroll';
import { ScrollToTop } from './ScrollToTop';
import styles from './AppShell.module.css';

/**
 * Composes the app chrome around the routed page (DESIGN-BRIEF §4). Live
 * 880px switch via useViewport; a neutral skeleton renders until mounted so
 * SSR and the first client paint agree (no hydration mismatch). Persona and
 * scroll position survive the swap because this tree stays mounted.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const viewport = useViewport();
  const { personaId } = usePersona();

  if (viewport === undefined) {
    return (
      <div className={styles.skeleton} aria-busy="true" aria-label="Loading">
        <div className={styles.skeletonBar} />
        <div className={styles.skeletonBody}>
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      </div>
    );
  }

  if (viewport === 'desktop') {
    return (
      <div className={styles.desktop}>
        <HashScroll />
        <ScrollToTop />
        <AppHeader patientId={personaId} />
        <div className={styles.body}>
          <Sidebar />
          <main id="main" className={styles.main}>
            <div className={styles.mainInner}>{children}</div>
            <AppFooter />
          </main>
        </div>
        <JourneyStepper />
      </div>
    );
  }

  return (
    <div className={styles.mobile}>
      <HashScroll />
      <ScrollToTop />
      <AppBar patientId={personaId} />
      <main id="main" className={styles.mainMobile}>
        {children}
        <AppFooter compact />
      </main>
      <BottomTabs />
      <JourneyStepper />
    </div>
  );
}
