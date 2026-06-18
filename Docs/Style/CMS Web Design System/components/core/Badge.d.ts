import * as React from 'react';

/**
 * Pill status badge. Color encodes program/report status and is always
 * accompanied by text (and optionally a leading dot or icon) for AA accessibility.
 */
export interface BadgeProps {
  /** @default "info" */
  status?: 'info' | 'success' | 'active' | 'warning' | 'error' | 'neutral';
  /** Material Symbols glyph name (filled) shown before the label */
  icon?: string;
  /** Show a small leading status dot */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
