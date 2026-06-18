'use client';

import { DateChip, SyncChip, IdentityChip } from './HeaderChrome';
import { useHeaderData } from './use-header-data';
import styles from './AppBar.module.css';

/** Mobile app bar (DESIGN-BRIEF §4): navy surface carrying the greeting
 *  hero, the date / sync chrome, and the identity chip. */
export function AppBar({ patientId }: { patientId: string }) {
  const h = useHeaderData(patientId);
  return (
    <header className={styles.bar}>
      <p className={styles.greeting}>
        {h.greeting}
        {h.firstName && <>, {h.firstName}</>}.
      </p>
      <div className={styles.chips}>
        <DateChip label={h.dateLabel} />
        <SyncChip label={h.syncLabel} />
      </div>
      <div className={styles.idRow}>
        <IdentityChip ial={h.ial} aal={h.aal} name={h.fullName} revoked={h.revoked} />
      </div>
    </header>
  );
}
