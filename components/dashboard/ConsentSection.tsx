'use client';

import { useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { useApi, postApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { Section, PlainWords, SectionHeader, Modal, EmptyState } from '@/components/ui';
import { StandardsChip, MetaChip, Button } from '@/components/ds';
import { formatLongDate, syncRelativeLabel, parseISODateTime } from '@/lib/demo-clock';
import styles from './consent.module.css';

interface Source {
  name: string;
  description: string;
  standards: string[];
  lastSyncAt?: string;
  continuous: boolean;
}
interface Consent {
  grantedOn: string;
  method: string;
  identityCredential: string;
  ial: string;
  aal: string;
  accessReadsThisMonth: number;
  shareWithCareTeam: boolean;
  adsBlocked: boolean;
  revoked: boolean;
}
interface AuditEntry {
  occurredAt: string;
  actor: string;
  actorRole: string;
  scope: string;
  purposeOfUse: string;
}

const PURPOSE_ICON: Record<string, string> = {
  treatment: 'medical_services',
  individual_access: 'person',
  patient_share: 'share',
  operations: 'settings',
};

function purposeLabel(p: string): string {
  return p.replace(/_/g, ' ');
}

export function ConsentSection() {
  const { personaId, refreshData } = usePersona();
  const { pushToast } = useToast();
  const { data: srcData } = useApi<{ sources: Source[] }>(`/api/patients/${personaId}/sources`);
  const { data: consent } = useApi<Consent>(`/api/patients/${personaId}/consent`);
  const { data: auditData } = useApi<{ entries: AuditEntry[] }>(`/api/patients/${personaId}/audit`);

  const [syncing, setSyncing] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [working, setWorking] = useState(false);

  const sources = srcData?.sources ?? [];
  const entries = auditData?.entries ?? [];
  const revoked = consent?.revoked ?? false;

  const syncNow = async () => {
    setSyncing(true);
    try {
      await postApi('/api/sync', { patientId: personaId });
      refreshData();
      pushToast({
        tone: 'success',
        icon: 'cloud_done',
        message: 'Synced with the Aligned Network. Records are up to date.',
      });
    } catch (err) {
      pushToast({
        tone: 'attention',
        icon: 'error',
        message: err instanceof Error ? err.message : 'Sync failed.',
      });
    } finally {
      setSyncing(false);
    }
  };

  const doRevoke = async () => {
    setWorking(true);
    try {
      await postApi('/api/consent/revoke', { patientId: personaId });
      refreshData();
      pushToast({
        tone: 'attention',
        icon: 'link_off',
        message: 'Access revoked. Your records are now disconnected.',
      });
    } finally {
      setWorking(false);
      setConfirmRevoke(false);
    }
  };

  const reconnect = async () => {
    setWorking(true);
    try {
      await postApi('/api/consent/grant', { patientId: personaId });
      refreshData();
      pushToast({
        tone: 'success',
        icon: 'link',
        message: 'Reconnected. Your records are syncing again.',
      });
    } finally {
      setWorking(false);
    }
  };

  if (revoked) {
    return (
      <Section id="consent" eyebrow="Your account" title="Data & consent">
        <EmptyState
          icon="link_off"
          message="Your records are disconnected. Reconnect to see your data and resume syncing."
          actionLabel={working ? 'Reconnecting…' : 'Reconnect'}
          onAction={reconnect}
        />
      </Section>
    );
  }

  return (
    <Section
      id="consent"
      eyebrow="Your account"
      title="Data & consent"
      action={
        <Button
          variant="secondary"
          icon={syncing ? 'sync' : 'cloud_sync'}
          onClick={syncNow}
          disabled={syncing}
        >
          {syncing ? 'Syncing…' : 'Sync now'}
        </Button>
      }
    >
      <PlainWords>
        Your records were found at <strong>{sources.length} connected organizations</strong> through
        the CMS Aligned Network. You control who sees them.
      </PlainWords>

      {/* Sources */}
      <div className={styles.sourceList}>
        {sources.map((s, i) => (
          <div key={`${s.name}-${i}`} className={styles.source}>
            <div className={styles.sourceMain}>
              <p className={styles.sourceName}>{s.name}</p>
              <p className={styles.sourceDesc}>{s.description}</p>
              <div className={styles.chips}>
                {s.standards.map((std) => (
                  <StandardsChip key={std} label={std} />
                ))}
              </div>
            </div>
            <div className={styles.sourceSync}>
              {s.continuous ? (
                <span className={styles.live}>
                  <span className={styles.pulse} aria-hidden="true" />
                  Live
                </span>
              ) : (
                <span className={styles.syncLabel}>Synced {syncRelativeLabel(s.lastSyncAt)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Consent summary */}
      {consent && (
        <div className={styles.consentCard}>
          <SectionHeader title="Your consent" />
          <dl className={styles.consentGrid}>
            <div>
              <dt>Granted</dt>
              <dd>{formatLongDate(consent.grantedOn)}</dd>
            </div>
            <div>
              <dt>How you verified</dt>
              <dd>{consent.method}</dd>
            </div>
            <div>
              <dt>Credential</dt>
              <dd>{consent.identityCredential}</dd>
            </div>
            <div>
              <dt>Identity assurance</dt>
              <dd className={styles.assurance}>
                <MetaChip>{consent.ial}</MetaChip>
                <MetaChip>{consent.aal}</MetaChip>
              </dd>
            </div>
            <div>
              <dt>Reads this month</dt>
              <dd>{consent.accessReadsThisMonth}</dd>
            </div>
          </dl>

          <div className={styles.toggles}>
            <ConsentToggle
              label="Share my data with my care team"
              initial={consent.shareWithCareTeam}
              onToggle={(v) =>
                pushToast({
                  tone: 'success',
                  icon: 'check_circle',
                  message: v ? 'Care-team sharing on.' : 'Care-team sharing off.',
                })
              }
            />
            <ConsentToggle
              label="Block use of my data for advertising"
              initial={consent.adsBlocked}
              onToggle={(v) =>
                pushToast({
                  tone: 'success',
                  icon: 'check_circle',
                  message: v ? 'Advertising use blocked.' : 'Advertising block removed.',
                })
              }
            />
          </div>

          <Button
            variant="ghost"
            icon="link_off"
            onClick={() => setConfirmRevoke(true)}
            style={{ color: 'var(--error-red)' }}
          >
            Revoke all access
          </Button>
        </div>
      )}

      {/* Audit trail */}
      {entries.length > 0 && (
        <div>
          <SectionHeader title="Who accessed your records" />
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className="visually-hidden">Access audit trail, newest first</caption>
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Who</th>
                  <th scope="col">Scope</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={i}>
                    <td className="tabular">{formatAudit(e.occurredAt)}</td>
                    <td>
                      <span className={styles.rowName}>{e.actor}</span>
                      <span className={styles.actorRole}>{e.actorRole}</span>
                    </td>
                    <td>
                      <MetaChip>{e.scope}</MetaChip>
                    </td>
                    <td>
                      <span className={styles.purpose}>
                        <span className="material-symbols-outlined" aria-hidden="true">
                          {PURPOSE_ICON[e.purposeOfUse] ?? 'info'}
                        </span>
                        {purposeLabel(e.purposeOfUse)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={confirmRevoke}
        onClose={() => setConfirmRevoke(false)}
        title="Revoke all access?"
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirmRevoke(false)}>
              Keep access
            </Button>
            <Button variant="danger" onClick={doRevoke} disabled={working}>
              {working ? 'Revoking…' : 'Revoke all access'}
            </Button>
          </>
        }
      >
        <p>
          This disconnects every organization from this app and stops syncing. Your records stay
          with your providers — you can reconnect at any time.
        </p>
      </Modal>
    </Section>
  );
}

function formatAudit(iso: string): string {
  // 'YYYY-MM-DDTHH:MM[:SS]' → 'Jun 5, 9:41 AM' (deterministic, demo clock format)
  const ms = parseISODateTime(iso);
  const d = new Date(ms);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${h}:${m} ${ampm}`;
}

function ConsentToggle({
  label,
  initial,
  onToggle,
}: {
  label: string;
  initial: boolean;
  onToggle: (value: boolean) => void;
}) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={styles.toggle}
      onClick={() => {
        const next = !on;
        setOn(next);
        onToggle(next);
      }}
    >
      <span className={`${styles.track} ${on ? styles.trackOn : ''}`} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.toggleLabel}>{label}</span>
    </button>
  );
}
