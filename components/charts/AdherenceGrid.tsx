'use client';

import { useInView } from '@/lib/use-in-view';
import { DataTable } from './DataTable';
import styles from './AdherenceGrid.module.css';

/**
 * 4-week medication adherence grid (FR-6): CSS grid, 7 columns. Status is
 * always color + icon; today renders as a gold-ringed pending cell. Cells
 * pop in with a 20ms stagger; reduced motion renders final state.
 */

export interface AdherenceDay {
  date: string; // ISO
  status: 'taken' | 'partial' | 'missed' | 'pending';
}

const STATUS_META: Record<AdherenceDay['status'], { icon: string; label: string }> = {
  taken: { icon: 'check', label: 'Taken' },
  partial: { icon: 'remove', label: 'Partially taken' },
  missed: { icon: 'close', label: 'Missed' },
  pending: { icon: 'schedule', label: 'Pending (today)' },
};

export function AdherenceGrid({
  id,
  ariaLabel,
  days,
  summary,
}: {
  id: string;
  ariaLabel: string;
  days: AdherenceDay[];
  summary?: string; // e.g. '26 of 28 doses taken'
}) {
  const { ref, animate, instant } = useInView<HTMLDivElement>(id);

  return (
    <div ref={ref}>
      <div role="img" aria-label={ariaLabel}>
        <div className={styles.grid}>
          {days.map((d, i) => (
            <span
              key={d.date}
              className={`${styles.cell} ${styles[d.status]}`}
              title={`${d.date}: ${STATUS_META[d.status].label}`}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? 'scale(1)' : 'scale(0.8)',
                transition: instant
                  ? 'none'
                  : `opacity 200ms ease-out ${i * 20}ms, transform 200ms ease-out ${i * 20}ms`,
              }}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {STATUS_META[d.status].icon}
              </span>
            </span>
          ))}
        </div>
      </div>
      {summary && <p className={styles.summary}>{summary}</p>}
      <ul className={styles.legend}>
        {(Object.keys(STATUS_META) as AdherenceDay['status'][]).map((s) => (
          <li key={s} className={styles.legendItem}>
            <span className={`${styles.cell} ${styles[s]} ${styles.legendCell}`} aria-hidden="true">
              <span className="material-symbols-outlined">{STATUS_META[s].icon}</span>
            </span>
            {STATUS_META[s].label}
          </li>
        ))}
      </ul>
      <DataTable
        caption={ariaLabel}
        columns={['Date', 'Status']}
        rows={days.map((d) => [d.date, STATUS_META[d.status].label])}
      />
    </div>
  );
}
