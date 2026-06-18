import * as React from 'react';

/**
 * Navy tooltip bubble shown on hover/focus of its child trigger.
 */
export interface TooltipProps {
  label: React.ReactNode;
  /** @default "top" */
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export function Tooltip(props: TooltipProps): JSX.Element;
