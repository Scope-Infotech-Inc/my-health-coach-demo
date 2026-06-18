'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BOTTOM_TABS, type NavItem } from './nav';
import { useScrollSpy } from './use-scroll-spy';
import { scrollToSection } from './scroll-to-section';
import styles from './BottomTabs.module.css';

function isActive(item: NavItem, pathname: string, activeSection: string | null): boolean {
  if (item.href === '/more') return pathname === '/more';
  if (item.sectionId) return pathname === '/' && activeSection === item.sectionId;
  return pathname === item.href;
}

/** Mobile bottom tab bar (DESIGN-BRIEF §4): Home · Trends · Care · Coach ·
 *  More. Active tab gets a 3px gold top rule, a filled icon, and a 600 label. */
export function BottomTabs() {
  const pathname = usePathname();
  const { active: activeSection, assertSection } = useScrollSpy();

  return (
    <nav className={styles.bar} aria-label="Primary">
      {BOTTOM_TABS.map((tab) => {
        const active = isActive(tab, pathname, activeSection);
        return (
          <Link
            key={tab.label}
            href={tab.href}
            scroll={tab.sectionId ? false : undefined}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={
              tab.sectionId
                ? () => {
                    assertSection(tab.sectionId!);
                    if (pathname === '/') scrollToSection(tab.sectionId!);
                  }
                : undefined
            }
          >
            <span
              className={`material-symbols-outlined ${styles.icon} ${active ? 'is-filled' : ''}`}
              aria-hidden="true"
            >
              {tab.icon}
            </span>
            <span className={styles.label}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
