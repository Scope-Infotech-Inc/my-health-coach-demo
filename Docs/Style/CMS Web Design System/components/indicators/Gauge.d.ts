import * as React from 'react';

/**
 * Radial arc gauge (270° sweep) with animated arc fill + value count-up on
 * mount. For compliance/health/utilization scores. Reduced-motion safe.
 *
 * @startingPoint section="Data Viz" subtitle="Animated radial gauge meter" viewport="700x260"
 */
export interface GaugeProps {
  value: number;
  /** @default 100 */
  max?: number;
  /** Diameter in px. @default 160 */
  size?: number;
  label?: React.ReactNode;
  /** Value suffix. @default "%" */
  unit?: string;
  /** @default "navy" */
  tone?: 'navy' | 'gold' | 'success';
  /** Arc thickness in px. @default 12 */
  thickness?: number;
}

export function Gauge(props: GaugeProps): JSX.Element;
