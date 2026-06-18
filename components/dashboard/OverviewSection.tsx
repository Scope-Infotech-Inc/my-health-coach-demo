'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { Section, StatusBanner, AICard } from '@/components/ui';
import { StatTile } from '@/components/ds';
import { REPLAY_ALERT_EVENT } from '@/components/shell/DemoControls';
import { JOURNEY_START_EVENT } from '@/components/shell/JourneyStepper';
import styles from './dashboard.module.css';

interface Overview {
  patient: {
    firstName: string;
    category: string;
    planType: string;
    conditionDetail?: string;
    providerOrg: string;
    secondaryLanguage?: string;
    headerRole?: string;
  };
  banner?: {
    severity: string;
    title: string;
    body: string;
    ctaLabel?: string;
    careTeamNotified: boolean;
  };
  tiles: Array<{
    label: string;
    value: string;
    delta?: { text: string; tone: string };
    detail: string;
  }>;
}

interface Insight {
  id: number;
  kind: string;
  title: string;
  body: string;
  basis: string[];
  surfacedOn: string;
  severity: 'info' | 'attention';
}

function iconForTile(label: string): { icon: string; tone: 'sky' | 'gold' } {
  const l = label.toLowerCase();
  if (/(reward|point|badge|streak|level)/.test(l)) return { icon: 'military_tech', tone: 'gold' };
  if (/(a1c|glucose|blood sugar|cgm)/.test(l)) return { icon: 'water_drop', tone: 'sky' };
  if (/(weight|bmi)/.test(l)) return { icon: 'monitor_weight', tone: 'sky' };
  if (/step/.test(l)) return { icon: 'directions_walk', tone: 'sky' };
  if (/(active|minute|exercise|move)/.test(l)) return { icon: 'exercise', tone: 'sky' };
  if (/(med|dose|adherence|refill)/.test(l)) return { icon: 'medication', tone: 'sky' };
  if (/(pressure|\bbp\b)/.test(l)) return { icon: 'cardiology', tone: 'sky' };
  if (/(appointment|visit|session)/.test(l)) return { icon: 'event', tone: 'sky' };
  return { icon: 'insights', tone: 'sky' };
}

export function OverviewSection() {
  const { personaId } = usePersona();
  const router = useRouter();
  const { pushToast } = useToast();
  const { data, loading } = useApi<Overview>(`/api/patients/${personaId}/overview`);
  const { data: insightData } = useApi<{ insights: Insight[] }>(
    `/api/patients/${personaId}/insights`
  );
  const { data: journey } = useApi<{ steps: unknown[] }>(`/api/patients/${personaId}/journey`);

  // Remount the banner when the presenter replays the alert (re-announce + re-animate).
  const [bannerKey, setBannerKey] = useState(0);
  useEffect(() => {
    const onReplay = () => setBannerKey((k) => k + 1);
    window.addEventListener(REPLAY_ALERT_EVENT, onReplay);
    return () => window.removeEventListener(REPLAY_ALERT_EVENT, onReplay);
  }, []);

  const escalate = () =>
    pushToast({
      tone: 'success',
      icon: 'forum',
      message: 'Shared with your care team. They’ll follow up.',
    });

  if (loading && !data) {
    return (
      <Section id="overview" eyebrow="Your health" title="Overview">
        <div className={styles.loading} />
      </Section>
    );
  }
  if (!data) return null;

  const { patient, banner, tiles } = data;
  const overviewInsights = (insightData?.insights ?? []).filter((i) => i.surfacedOn === 'overview');
  const hasJourney = (journey?.steps?.length ?? 0) > 0;

  return (
    <Section id="overview" eyebrow="Your health" title="Overview">
      {banner && (
        <StatusBanner
          key={bannerKey}
          severity={banner.severity}
          title={banner.title}
          body={banner.body}
          careTeamNotified={banner.careTeamNotified}
          ctaLabel={banner.ctaLabel}
          onCta={banner.ctaLabel ? () => router.push('/connect') : undefined}
        />
      )}

      {tiles.length > 0 && (
        <div className={styles.tiles}>
          {tiles.map((t, i) => {
            const ic = iconForTile(t.label);
            return (
              <StatTile
                key={`${t.label}-${i}`}
                id={`tile-${personaId}-${i}`}
                label={t.label}
                value={t.value}
                detail={t.detail}
                delta={t.delta}
                icon={ic.icon}
                iconTone={ic.tone}
              />
            );
          })}
        </div>
      )}

      {overviewInsights.length > 0 && (
        <div className={styles.stack}>
          {overviewInsights.map((ins) => (
            <AICard
              key={ins.id}
              title={ins.title}
              basis={ins.basis}
              severity={ins.severity}
              onEscalate={escalate}
            >
              <p>{ins.body}</p>
            </AICard>
          ))}
        </div>
      )}

      {hasJourney && (
        <div className={styles.launcher}>
          <span className={styles.launcherIcon} aria-hidden="true">
            <span className="material-symbols-outlined">play_circle</span>
          </span>
          <div className={styles.launcherBody}>
            <p className={styles.launcherTitle}>Take the guided tour</p>
            <p className={styles.launcherDetail}>
              Walk through a day with {patient.firstName} — from morning check-in to a note from the
              care team.
            </p>
          </div>
          <button
            type="button"
            className={styles.tourButton}
            onClick={() => window.dispatchEvent(new CustomEvent(JOURNEY_START_EVENT))}
          >
            Start tour
          </button>
        </div>
      )}

      <Link
        href="/share"
        className={styles.launcher}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <span
          className={styles.launcherIcon}
          aria-hidden="true"
          style={{ background: 'var(--sky-tint)', color: 'var(--navy-deep)' }}
        >
          <span className="material-symbols-outlined">qr_code_2</span>
        </span>
        <div className={styles.launcherBody}>
          <p className={styles.launcherTitle}>Share at your next check-in</p>
          <p className={styles.launcherDetail}>
            Show a one-time code so the front desk can pull your current records.
          </p>
        </div>
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{ color: 'var(--slate-gray)' }}
        >
          chevron_right
        </span>
      </Link>
    </Section>
  );
}
