import * as React from 'react';

/**
 * Flat content container — white surface, 1px hairline border, 8px radius.
 * Optional Sky-Tint header strip separates metadata from body. Set
 * `interactive` for a subtle hover lift + navy border.
 */
export interface CardProps {
  /** Enables hover lift + navy border (for clickable cards) */
  interactive?: boolean;
  /** Header content rendered in a Sky-Tint strip */
  header?: React.ReactNode;
  /** Footer content rendered above a top divider */
  footer?: React.ReactNode;
  /** Pad the body (24px). Set false for edge-to-edge content like tables. @default true */
  padded?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
