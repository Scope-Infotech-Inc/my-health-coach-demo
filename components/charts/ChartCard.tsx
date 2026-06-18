import styles from './ChartCard.module.css';

/**
 * Standard chart container (DESIGN-BRIEF §6): flat white card, hairline
 * border, title row with optional chips/actions slot.
 */
export function ChartCard({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
      {children}
    </section>
  );
}
