import * as React from 'react';

/**
 * Primary action control for CMS web apps. Navy primary, outlined secondary,
 * gold "accent" for high-priority CTAs, ghost for low-emphasis, danger for destructive.
 *
 * @startingPoint section="Core" subtitle="Navy / outline / gold / ghost button" viewport="700x180"
 */
export interface ButtonProps {
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Material Symbols glyph name shown before the label */
  icon?: string;
  /** Material Symbols glyph name shown after the label */
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Button(props: ButtonProps): JSX.Element;
