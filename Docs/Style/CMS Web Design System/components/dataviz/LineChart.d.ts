import * as React from 'react';

export interface LineSeries {
  name: string;
  /** CSS color (use a token, e.g. var(--navy-deep)) */
  color: string;
  points: number[];
}

/**
 * Multi-series line chart, pure SVG with an animated stroke draw-in, gridlines,
 * x-labels, and legend. Reduced-motion safe.
 *
 * @startingPoint section="Data Viz" subtitle="Animated multi-series line chart" viewport="700x300"
 */
export interface LineChartProps {
  series: LineSeries[];
  labels?: string[];
  height?: number;
  width?: number;
  /** Y scale max; auto from data when omitted */
  max?: number;
  /** Fill area under each line */
  area?: boolean;
  legend?: boolean;
}

export function LineChart(props: LineChartProps): JSX.Element;
