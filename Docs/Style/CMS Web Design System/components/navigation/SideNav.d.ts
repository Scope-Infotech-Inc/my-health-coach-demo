import * as React from 'react';

export interface SideNavItem {
  label: string;
  /** Material Symbols glyph name */
  icon: string;
}

/**
 * CMS Program Portal sidebar rail (256px) — brand lockup, optional CTA,
 * nav items with gold left-rule active state, and a footer utility group.
 */
export interface SideNavProps {
  items?: SideNavItem[];
  active?: string;
  onNavigate?: (label: string) => void;
  /** Primary CTA slot (e.g. a gold <Button fullWidth>) */
  cta?: React.ReactNode;
  footerItems?: SideNavItem[];
  brand?: string;
  brandSub?: string;
  style?: React.CSSProperties;
}

export function SideNav(props: SideNavProps): JSX.Element;
