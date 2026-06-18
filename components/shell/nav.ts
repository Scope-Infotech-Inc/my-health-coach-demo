/**
 * Navigation model (PRD §5, DESIGN-BRIEF §4). One source of truth for the
 * desktop sidebar, mobile bottom tabs, and the More screen.
 */

export interface NavItem {
  label: string;
  icon: string; // Material Symbols name
  /** Route href, or a "/#hash" anchor into the "/" dashboard. */
  href: string;
  /** Section id when this item scroll-spies a "/" dashboard section. */
  sectionId?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: 'My health',
    items: [
      { label: 'Overview', icon: 'home', href: '/#overview', sectionId: 'overview' },
      { label: 'Trends & Labs', icon: 'monitoring', href: '/#trends', sectionId: 'trends' },
      { label: 'My Records', icon: 'folder_shared', href: '/records' },
      { label: 'Care & Medications', icon: 'medication', href: '/#care', sectionId: 'care' },
      {
        label: 'Activity & Nutrition',
        icon: 'directions_walk',
        href: '/#activity',
        sectionId: 'activity',
      },
      { label: 'Coaching & Programs', icon: 'forum', href: '/#coaching', sectionId: 'coaching' },
      { label: 'Rewards', icon: 'military_tech', href: '/rewards' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { label: 'AI Assistant', icon: 'smart_toy', href: '/assistant' },
      { label: 'Recipes', icon: 'restaurant', href: '/recipes' },
      { label: 'Nearby Services', icon: 'location_on', href: '/nearby' },
    ],
  },
  {
    label: 'My account',
    items: [
      { label: 'Devices', icon: 'devices_other', href: '/devices' },
      { label: 'Connect with Provider', icon: 'chat', href: '/connect' },
      { label: 'Share at Check-in', icon: 'qr_code_2', href: '/share' },
      { label: 'Data & Consent', icon: 'shield_person', href: '/#consent', sectionId: 'consent' },
    ],
  },
];

/** Mobile bottom tabs: Home · Trends · Care · Coach · More (normative). */
export const BOTTOM_TABS: NavItem[] = [
  { label: 'Home', icon: 'home', href: '/#overview', sectionId: 'overview' },
  { label: 'Trends', icon: 'monitoring', href: '/#trends', sectionId: 'trends' },
  { label: 'Care', icon: 'medication', href: '/#care', sectionId: 'care' },
  { label: 'Coach', icon: 'forum', href: '/#coaching', sectionId: 'coaching' },
  { label: 'More', icon: 'menu', href: '/more' },
];

/** More screen list (normative FR list + How it works + Data & Consent). */
export const MORE_ITEMS: NavItem[] = [
  { label: 'Rewards', icon: 'military_tech', href: '/rewards' },
  { label: 'AI Assistant', icon: 'smart_toy', href: '/assistant' },
  { label: 'Recipes', icon: 'restaurant', href: '/recipes' },
  { label: 'Nearby Services', icon: 'location_on', href: '/nearby' },
  { label: 'Devices', icon: 'devices_other', href: '/devices' },
  { label: 'Connect with Provider', icon: 'chat', href: '/connect' },
  { label: 'Share at Check-in', icon: 'qr_code_2', href: '/share' },
  { label: 'How it works', icon: 'info', href: '/how-it-works' },
  { label: 'Data & Consent', icon: 'shield_person', href: '/#consent' },
];

/** Dashboard section ids in page order (used by the scroll-spy). */
export const DASHBOARD_SECTIONS = [
  'overview',
  'trends',
  'care',
  'activity',
  'coaching',
  'consent',
] as const;
