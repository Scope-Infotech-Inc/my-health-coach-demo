'use client';

import { BrandMark, DateChip, SyncChip, IdentityChip } from './HeaderChrome';
import { useHeaderData } from './use-header-data';
import styles from './AppHeader.module.css';

/** Desktop app header (DESIGN-BRIEF §4): navy 64px bar, brand left, the
 *  date / sync / identity chrome right. The greeting hero lives in the
 *  Overview section of main, not here. */
export function AppHeader({ patientId }: { patientId: string }) {
  const h = useHeaderData(patientId);
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <BrandMark />
        <div className={styles.chips}>
          <DateChip label={h.dateLabel} />
          <SyncChip label={h.syncLabel} />
          <IdentityChip ial={h.ial} aal={h.aal} name={h.fullName} revoked={h.revoked} />
        </div>
      </div>
    </header>
  );
}
