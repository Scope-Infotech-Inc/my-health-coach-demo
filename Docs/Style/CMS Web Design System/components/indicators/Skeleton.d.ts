import * as React from 'react';

/**
 * Shimmer loading placeholder — text lines, blocks, or circles. Reduced-motion safe.
 */
export interface SkeletonProps {
  /** @default "text" */
  variant?: 'text' | 'block' | 'circle';
  width?: number | string;
  height?: number | string;
  /** Number of lines for the text variant. @default 1 */
  lines?: number;
  radius?: number | string;
}

export function Skeleton(props: SkeletonProps): JSX.Element;
