import * as React from 'react';

/**
 * Labeled text field. Labels are always visible (Lexend, no floating labels).
 * 1px slate border → 2px navy on focus. Error state uses CMS red border + helper.
 */
export interface InputProps {
  /** Always-visible field label */
  label?: string;
  /** Helper text below the field */
  hint?: string;
  /** Error message — turns border + helper red */
  error?: string;
  /** Leading Material Symbols glyph name */
  icon?: string;
  required?: boolean;
  id?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
