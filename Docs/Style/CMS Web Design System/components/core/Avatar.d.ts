import * as React from 'react';

/**
 * User avatar — image, or auto-initials on a brand-tinted disc.
 * Used in tables, activity feeds, and the top-nav account slot.
 */
export interface AvatarProps {
  /** Full name — used for initials and alt text */
  name?: string;
  /** Image URL; falls back to initials when omitted */
  src?: string;
  /** Pixel diameter. @default 32 */
  size?: number;
  /** Initials disc color. @default "navy" */
  tone?: 'navy' | 'gold' | 'sky' | 'slate';
  /** Gold ring border */
  ring?: boolean;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
