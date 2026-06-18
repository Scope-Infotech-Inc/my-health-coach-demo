import * as React from 'react';

/**
 * KPI / statistic tile for bento dashboard grids — tinted icon chip, label,
 * large display number, optional trend badge (top-right) and footer meta.
 *
 * @startingPoint section="Core" subtitle="Dashboard KPI / stat tile" viewport="700x220"
 */
export interface StatCardProps {
  /** Material Symbols glyph name for the icon chip */
  icon: string;
  /** Icon-chip color tone. @default "info" */
  tone?: 'info' | 'gold' | 'error' | 'neutral';
  /** Metric label (e.g. "Active Programs") */
  label: React.ReactNode;
  /** Large value (e.g. "1,284" or "98.2%") */
  value: React.ReactNode;
  /** Top-right slot — typically a <Badge> trend chip */
  trend?: React.ReactNode;
  /** Footer meta below a divider (e.g. "Updated 12 mins ago") */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

export function StatCard(props: StatCardProps): JSX.Element;
