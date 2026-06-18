import * as React from 'react';

/**
 * Modal dialog — centered panel over a navy scrim, overlay shadow, optional
 * titled header (with icon) and footer action row. Closes on Esc or scrim click.
 */
export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  /** Material Symbols glyph for the header icon chip */
  icon?: string;
  /** Footer slot — typically right-aligned <Button>s */
  footer?: React.ReactNode;
  /** Max panel width in px. @default 520 */
  width?: number;
  children?: React.ReactNode;
}

export function Dialog(props: DialogProps): JSX.Element | null;
