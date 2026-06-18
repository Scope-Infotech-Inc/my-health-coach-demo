import * as React from 'react';

export interface DonutDatum {
  label: string;
  value: number;
  /** Optional explicit color; otherwise from the brand palette */
  color?: string;
}

/**
 * Segmented donut chart with an animated sweep on mount, center total, and a
 * legend with percentages. Reduced-motion safe.
 */
export interface DonutChartProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: React.ReactNode;
  centerValue?: React.ReactNode;
  legend?: boolean;
}

export function DonutChart(props: DonutChartProps): JSX.Element;
