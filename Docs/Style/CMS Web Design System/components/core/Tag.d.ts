import * as React from 'react';

/**
 * Category / filter chip — neutral outlined pill, optionally selectable or
 * removable. Use for popular-search chips, filters, and tags.
 */
export interface TagProps {
  /** Highlight as selected (sky tint + navy) */
  selected?: boolean;
  /** Leading Material Symbols glyph name */
  icon?: string;
  /** Shows an × and fires on click */
  onRemove?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Tag(props: TagProps): JSX.Element;
