'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_GROUPS, type NavItem } from './nav';
import { useScrollSpy } from './use-scroll-spy';
import { scrollToSection } from './scroll-to-section';
import styles from './Sidebar.module.css';

function isActive(item: NavItem, pathname: string, activeSection: string | null): boolean {
  if (item.sectionId) return pathname === '/' && activeSection === item.sectionId;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Desktop sidebar (DESIGN-BRIEF §4): grouped nav, sticky, scroll-spy on "/".
 *  Active item gets a 4px gold left rule, a filled icon, and aria-current. */
export function Sidebar() {
  const pathname = usePathname();
  const { active: activeSection, assertSection } = useScrollSpy();

  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      {SIDEBAR_GROUPS.map((group) => (
        <div key={group.label} className={styles.group}>
          <p className={styles.groupLabel}>{group.label}</p>
          <ul className={styles.list}>
            {group.items.map((item) => {
              const active = isActive(item, pathname, activeSection);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    scroll={item.sectionId ? false : undefined}
                    className={`${styles.item} ${active ? styles.active : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={
                      item.sectionId
                        ? () => {
                            assertSection(item.sectionId!);
                            if (pathname === '/') scrollToSection(item.sectionId!);
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`material-symbols-outlined ${styles.icon} ${active ? 'is-filled' : ''}`}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className={styles.label}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
