import * as React from 'react';

export interface BarDatum {
  label: string;
  /** Single-series value */
  value?: number;
  /** Grouped-series values (pair with `series`) */
  values?: number[];
}

/**
 * Vertical bar chart — bars grow from baseline on mount. Single or grouped
 * series, gridlines, x-labels. Reduced-motion safe.
 */
export interface BarChartProps {
  data: BarDatum[];
  /** Series names — pass to enable grouped bars (uses datum.values) */
  series?: string[];
  height?: number;
  max?: number;
  unit?: string;
  /** Single-series color. @default "navy" */
  tone?: 'navy' | 'gold';
}

export function BarChart(props: BarChartProps): JSX.Element;
