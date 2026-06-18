'use client';

import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { Section, PlainWords, SectionHeader, DemoNote } from '@/components/ui';
import { ProgressBar } from '@/components/charts';
import { Avatar, ProgramChip, Button } from '@/components/ds';
import styles from './dashboard.module.css';

interface Program {
  name: string;
  detail: string;
  statusChip: string;
  progressCurrent?: number;
  progressTotal?: number;
  milestonePct?: number;
  milestoneGoalPct?: number;
  nextSession?: string;
}
interface Message {
  senderName: string;
  senderRole: string;
  senderType: string;
  avatar: string;
  avatarStyle: string;
  body: string;
  sentLabel: string;
  actionLabel?: string;
}

const AVATAR_TONES = new Set(['navy', 'gold', 'sky', 'slate']);

function avatarTone(m: Message): 'navy' | 'gold' | 'sky' | 'slate' {
  if (AVATAR_TONES.has(m.avatarStyle)) return m.avatarStyle as 'navy' | 'gold' | 'sky' | 'slate';
  return /auto|system|bot|coach_ai/.test(m.senderType) ? 'gold' : 'navy';
}

export function CoachingSection() {
  const { personaId } = usePersona();
  const { pushToast } = useToast();
  const { data: progData, loading } = useApi<{ programs: Program[] }>(
    `/api/patients/${personaId}/programs`
  );
  const { data: msgData } = useApi<{ messages: Message[] }>(`/api/patients/${personaId}/messages`);

  if (loading && !progData) {
    return (
      <Section id="coaching" eyebrow="Your health" title="Coaching & programs">
        <div className={styles.loading} />
      </Section>
    );
  }

  const programs = progData?.programs ?? [];
  const messages = msgData?.messages ?? [];
  const active = programs.find((p) => p.statusChip === 'Active');
  const summary = active ? (
    <>
      You’re enrolled in <strong>{active.name}</strong>. Keep going — your coach is following along.
    </>
  ) : (
    <>Programs you can join, and notes from your care team.</>
  );

  return (
    <Section id="coaching" eyebrow="Your health" title="Coaching & programs">
      <PlainWords>{summary}</PlainWords>

      {programs.length > 0 && (
        <div className={styles.cards2}>
          {programs.map((p, i) => (
            <div key={`${p.name}-${i}`} className={styles.programCard}>
              <div className={styles.programHead}>
                <p className={styles.rowName}>{p.name}</p>
                <ProgramChip status={p.statusChip} />
              </div>
              <p className={styles.programDetail}>{p.detail}</p>
              {p.progressCurrent != null && p.progressTotal != null && (
                <ProgressBar
                  id={`prog-${personaId}-${i}`}
                  label="Sessions completed"
                  valueText={`${p.progressCurrent} of ${p.progressTotal} sessions`}
                  pct={Math.round((p.progressCurrent / p.progressTotal) * 100)}
                  tone="navy"
                />
              )}
              {p.milestonePct != null && p.milestoneGoalPct != null && (
                <ProgressBar
                  id={`mile-${personaId}-${i}`}
                  label="Milestone"
                  valueText={`${p.milestonePct}% of ${p.milestoneGoalPct}% goal`}
                  pct={Math.min(100, Math.round((p.milestonePct / p.milestoneGoalPct) * 100))}
                  tone="gold"
                />
              )}
              {p.nextSession && (
                <p className={styles.nextSession}>
                  <span className="material-symbols-outlined" aria-hidden="true">
                    event
                  </span>
                  Next session: {p.nextSession}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div>
          <SectionHeader title="From your care team" />
          <DemoNote icon="forum">Demo — simulated coaching responses</DemoNote>
          <div className={styles.feed}>
            {messages.map((m, i) => (
              <div key={i} className={styles.message}>
                <Avatar name={m.senderName} tone={avatarTone(m)} size={36} />
                <div className={styles.messageBody}>
                  <p className={styles.messageMeta}>
                    <span className={styles.rowName}>{m.senderName}</span>
                    <span>{m.senderRole}</span>
                    <span>·</span>
                    <span>{m.sentLabel}</span>
                  </p>
                  <p className={styles.messageText}>{m.body}</p>
                  {m.actionLabel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        pushToast({
                          tone: 'success',
                          icon: 'check_circle',
                          message: `${m.actionLabel} — done.`,
                        })
                      }
                    >
                      {m.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
