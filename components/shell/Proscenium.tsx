'use client';

import { usePersona } from '@/lib/persona-context';
import { PERSONA_GROUPS, isPersonaId } from '@/lib/personas';
import { useApi } from '@/lib/use-api';
import { DemoControls } from './DemoControls';
import { PresenterOverlay } from './PresenterOverlay';
import styles from './Proscenium.module.css';

interface RosterEntry {
  id: string;
  firstName: string;
  lastNameInitial: string;
}

/**
 * The demo proscenium (DESIGN-BRIEF §1): a navy-ink frame above the app
 * holding everything theatrical — the permanent fictional-data disclaimer
 * (every route), the persona switcher, the demo controls, and the presenter
 * guide. The app inside the frame stays clean and production-plausible.
 */
export function Proscenium() {
  const { personaId, setPersonaId } = usePersona();
  const { data } = useApi<{ patients: RosterEntry[] }>('/api/patients');

  const nameOf = (id: string): string => {
    const p = data?.patients.find((r) => r.id === id);
    return p ? `${p.firstName} ${p.lastNameInitial}.` : id.charAt(0).toUpperCase() + id.slice(1);
  };

  return (
    <div className={styles.bar} role="region" aria-label="Demonstration controls">
      <p className={styles.disclaimer}>
        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 16 }}>
          science
        </span>
        <span>
          <strong>Demonstration</strong> — fictional data. Not an official CMS product.
        </span>
      </p>
      <div className={styles.controls}>
        <label className={styles.personaLabel}>
          <span>Viewing as</span>
          <select
            className={styles.personaSelect}
            value={personaId}
            onChange={(e) => {
              if (isPersonaId(e.target.value)) setPersonaId(e.target.value);
            }}
          >
            {PERSONA_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.ids.map((id) => (
                  <option key={id} value={id}>
                    {nameOf(id)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <DemoControls />
        <PresenterOverlay />
      </div>
    </div>
  );
}
