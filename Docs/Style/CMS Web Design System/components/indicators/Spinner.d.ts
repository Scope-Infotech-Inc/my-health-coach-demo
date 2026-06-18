import * as React from 'react';

/**
 * Ring spinner — navy track + gold sweep, CSS-animated. Reduced-motion safe.
 */
export interface SpinnerProps {
  /** Diameter in px. @default 28 */
  size?: number;
  /** Ring thickness in px. @default 3 */
  thickness?: number;
  /** Inline label shown beside the ring */
  label?: string;
  color?: string;
  track?: string;
}

export function Spinner(props: SpinnerProps): JSX.Element;
