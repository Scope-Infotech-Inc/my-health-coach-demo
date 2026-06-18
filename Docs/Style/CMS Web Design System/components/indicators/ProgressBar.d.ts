import * as React from 'react';

/**
 * Linear progress bar — determinate (animated fill) or indeterminate (sweep).
 * Optional label + percentage readout.
 */
export interface ProgressBarProps {
  /** Current value (0–max). Ignored when indeterminate. */
  value?: number;
  /** @default 100 */
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  indeterminate?: boolean;
  /** @default "navy" */
  tone?: 'navy' | 'gold' | 'success';
  /** Track height in px. @default 8 */
  height?: number;
}

export function ProgressBar(props: ProgressBarProps): JSX.Element;
