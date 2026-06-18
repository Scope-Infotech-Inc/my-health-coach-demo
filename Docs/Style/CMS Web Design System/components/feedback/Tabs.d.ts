import * as React from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  /** Material Symbols glyph name */
  icon?: string;
  /** Optional count pill */
  count?: number;
}

/**
 * Underlined tab strip with a gold active rule. Controlled (`value`+`onChange`)
 * or uncontrolled (`defaultValue`). `children` may be a render-fn of the active id.
 */
export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  children?: React.ReactNode | ((activeId: string) => React.ReactNode);
}

export function Tabs(props: TabsProps): JSX.Element;
