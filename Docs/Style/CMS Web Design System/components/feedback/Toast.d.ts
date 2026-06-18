import * as React from 'react';

/**
 * Transient notification card — status accent rule + icon, title, body, close.
 * Stack several inside <ToastViewport>.
 */
export interface ToastProps {
  /** @default "info" */
  kind?: 'info' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  /** Override the default status icon */
  icon?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function Toast(props: ToastProps): JSX.Element;

export interface ToastViewportProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right';
  children?: React.ReactNode;
}
export function ToastViewport(props: ToastViewportProps): JSX.Element;
