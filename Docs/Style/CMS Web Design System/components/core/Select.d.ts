import * as React from 'react';

/**
 * Labeled native select styled to match Input — visible Lexend label,
 * custom chevron, slate border. Pass <option> children.
 */
export interface SelectProps {
  label?: string;
  hint?: string;
  required?: boolean;
  id?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;
