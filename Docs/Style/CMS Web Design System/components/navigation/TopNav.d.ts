import * as React from 'react';

/**
 * CMS Program Portal top navigation bar — navy band, gold bottom rule, brand
 * title, horizontal nav with gold-underline active state, search, and account.
 */
export interface TopNavProps {
  brand?: string;
  /** Nav item labels */
  items?: string[];
  /** Active item label */
  active?: string;
  onNavigate?: (label: string) => void;
  searchPlaceholder?: string;
  /** Account slot (typically an <Avatar/> + buttons) */
  user?: React.ReactNode;
  style?: React.CSSProperties;
}

export function TopNav(props: TopNavProps): JSX.Element;
