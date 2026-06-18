import * as React from 'react';

/**
 * Inline alert / callout banner — tinted background, left accent rule, status
 * icon. For system messages, notices, and validation summaries.
 */
export interface AlertProps {
  /** @default "info" */
  kind?: 'info' | 'success' | 'warning' | 'error';
  /** Bold title line */
  title?: React.ReactNode;
  /** Override the default status icon (Material Symbols name) */
  icon?: string;
  /** Show a dismiss button and handle the click */
  onClose?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Alert(props: AlertProps): JSX.Element;
