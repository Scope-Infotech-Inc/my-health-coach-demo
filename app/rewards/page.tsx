'use client';

/**
 * /rewards — gamification (FR-22, DESIGN-BRIEF §7). Composes the existing
 * shell + primitives; reads GET /api/patients/{id}/gamification. maria and
 * robert return { enrolled: false } — a calm "not part of this plan" message,
 * never an error/disconnected empty state. Enrolled personas get a level
 * ring, points + streak tiles, a badge shelf, and challenge progress bars,
 * plus a demo "Earn a badge" button that POSTs /api/gamification/award.
 *
 * No hardcoded display data: every value (points, level, streak, badges,
 * challenges) comes from the live API. Surrounding copy is original.
 */

import { useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { useApi, postApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { PageHeader, Section, PlainWords, EmptyState } from '@/components/ui';
import { Button, StatTile } from '@/components/ds';
import { LevelRing, ProgressBar } from '@/components/charts';
import { formatMediumDate } from '@/lib/demo-clock';
import styles from './page.module.css';

interface Badge {
  id: string;
  name: string;
  description: string;
  criterion: string;
  icon: string;
  earned: boolean;
  earnedOn?: string;
}

interface Challenge {
  title: string;
  progressCurrent: number;
  progressTotal: number;
  rewardPoints: number;
  endsOn: string;
}

interface GamificationResponse {
  enrolled: boolean;
  points: number;
  level: { name: string; min: number; max: number } | null;
  streak: { current: number; best: number; habit: string } | null;
  badges: Badge[];
  challenges: Challenge[];
}

interface AwardResponse {
  badge: { id: string; name: string };
  alreadyEarned?: boolean;
}

const EYEBROW = 'My health';
const TITLE = 'Rewards';

export default function RewardsPage() {
  const { personaId, refreshData } = usePersona();
  const { pushToast } = useToast();
  const { data, error, loading, refetch } = useApi<GamificationResponse>(
    `/api/patients/${personaId}/gamification`
  );

  // Tracks the just-earned badge so it can pop in once after an award.
  const [poppedBadgeId, setPoppedBadgeId] = useState<string | null>(null);
  const [awarding, setAwarding] = useState(false);

  // Error path — a genuine fetch failure (distinct from the calm not-enrolled
  // state, which is a 200 response). Offer a retry rather than a blank.
  if (error && !data) {
    return (
      <>
        <PageHeader eyebrow={EYEBROW} title={TITLE} />
        <EmptyState
          icon="sync_problem"
          message="Your rewards could not be loaded just now."
          actionLabel="Try again"
          onAction={refetch}
        />
      </>
    );
  }

  if (!data && loading) {
    return (
      <>
        <PageHeader eyebrow={EYEBROW} title={TITLE} />
        <div className={styles.loading} aria-busy="true" aria-label="Loading rewards">
          <div className={styles.loadingBlock} />
          <div className={styles.loadingBlock} />
        </div>
      </>
    );
  }

  if (!data) return null;

  // maria / robert: rewards are not part of this person's plan. This is an
  // intentional 200 response, not an error — keep the tone plain and calm.
  if (!data.enrolled) {
    return (
      <>
        <PageHeader
          eyebrow={EYEBROW}
          title={TITLE}
          lede="Points, streaks, and badges for the daily habits that support your plan."
        />
        <div className={styles.notEnrolled}>
          <span className={styles.notEnrolledIcon} aria-hidden="true">
            <span className="material-symbols-outlined">workspace_premium</span>
          </span>
          <p className={styles.notEnrolledBody}>
            Rewards are not part of your care plan yet. Your team focuses your plan on the steps
            that matter most for you right now, and can turn rewards on later if they would help.
          </p>
        </div>
      </>
    );
  }

  const { level, streak, points, badges, challenges } = data;
  const earnedCount = badges.filter((b) => b.earned).length;

  async function handleEarnBadge() {
    if (awarding) return;
    setAwarding(true);
    try {
      const res = await postApi<AwardResponse>('/api/gamification/award', {
        patientId: personaId,
      });
      setPoppedBadgeId(res.badge.id);
      refreshData(); // revalidate every view (the hook refetches this page too)
      pushToast({
        tone: res.alreadyEarned ? 'default' : 'attention',
        icon: 'workspace_premium',
        message: res.alreadyEarned
          ? `You already earned ${res.badge.name}.`
          : `Badge earned: ${res.badge.name}.`,
      });
    } catch {
      pushToast({
        tone: 'default',
        icon: 'sync_problem',
        message: 'That badge could not be awarded just now.',
      });
    } finally {
      setAwarding(false);
    }
  }

  const pointsToNext = level ? Math.max(level.max - points, 0) : 0;

  return (
    <>
      <PageHeader
        eyebrow={EYEBROW}
        title={TITLE}
        lede="Points, streaks, and badges for the daily habits that support your plan."
        actions={
          <Button
            variant="accent"
            icon="workspace_premium"
            onClick={handleEarnBadge}
            disabled={awarding}
          >
            Earn a badge
          </Button>
        }
      />

      <div className={styles.content}>
        {/* Level + points + streaks */}
        <Section id="rewards-level" eyebrow="Progress" title="Your level">
          {level && (
            <PlainWords>
              You have <strong>{points.toLocaleString('en-US')} points</strong> at the {level.name}{' '}
              level
              {pointsToNext > 0
                ? `, ${pointsToNext.toLocaleString('en-US')} from the next level.`
                : '.'}
            </PlainWords>
          )}
          <div className={styles.summaryGrid}>
            {level && (
              <div className={styles.ringCard}>
                <LevelRing
                  id="rewards-level-ring"
                  ariaLabel={`You are at the ${level.name} level with ${points} of ${level.max} points toward the next level.`}
                  levelName={level.name}
                  points={points}
                  levelMin={level.min}
                  levelMax={level.max}
                />
                <p className={styles.ringCaption}>
                  {pointsToNext > 0
                    ? `${pointsToNext.toLocaleString('en-US')} points to the next level`
                    : 'Top level reached'}
                </p>
              </div>
            )}

            <div className={styles.tileGrid}>
              <StatTile
                id="rewards-points-tile"
                label="Total points"
                value={points.toLocaleString('en-US')}
                detail="earned across your habits"
                icon="stars"
                iconTone="gold"
              />
              {streak && <StreakTiles streak={streak} />}
            </div>
          </div>
        </Section>

        {/* Badge shelf */}
        <Section id="rewards-badges" eyebrow="Recognition" title="Badges">
          <PlainWords>
            You have earned{' '}
            <strong>
              {earnedCount} of {badges.length} badges
            </strong>
            . Locked badges show what unlocks them.
          </PlainWords>
          <ul className={styles.shelf}>
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                popped={badge.earned && badge.id === poppedBadgeId}
              />
            ))}
          </ul>
        </Section>

        {/* Challenges */}
        {challenges.length > 0 && (
          <Section id="rewards-challenges" eyebrow="Goals" title="Active challenges">
            <PlainWords>
              You have{' '}
              <strong>
                {challenges.length} active {challenges.length === 1 ? 'challenge' : 'challenges'}
              </strong>
              . Finishing one adds its points to your total.
            </PlainWords>
            <div className={styles.challengeList}>
              {challenges.map((challenge, i) => {
                const total = Math.max(challenge.progressTotal, 1);
                const current = Math.min(challenge.progressCurrent, total);
                const pct = (current / total) * 100;
                const done = current >= total;
                return (
                  <div key={`${challenge.title}-${i}`}>
                    <ProgressBar
                      id={`rewards-challenge-${i}`}
                      label={challenge.title}
                      valueText={`${current} of ${total} days`}
                      pct={pct}
                      tone={done ? 'success' : 'navy'}
                    />
                    <p className={styles.challengeReward}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        stars
                      </span>
                      {done
                        ? `Complete — ${challenge.rewardPoints.toLocaleString('en-US')} points earned`
                        : `Worth ${challenge.rewardPoints.toLocaleString('en-US')} points · ends ${formatMediumDate(challenge.endsOn)}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>
        )}
      </div>
    </>
  );
}

/** Current + best streak tiles. A broken streak (current 0) is shown in slate
 *  with a gentle "Restart streak" action — never red, never blame. */
function StreakTiles({ streak }: { streak: { current: number; best: number; habit: string } }) {
  const { personaId, refreshData } = usePersona();
  const { pushToast } = useToast();
  const broken = streak.current === 0;
  const habitLabel = describeHabit(streak.habit);

  async function handleRestart() {
    // No restart endpoint exists; surface a deterministic, honest confirmation
    // (this is a demo affordance — the brief asks for a gentle restart action).
    // Keep the copy honest: nothing has changed yet, the next logged day starts
    // the new streak. Avoid asserting a state mutation that did not happen.
    refreshData();
    pushToast({
      tone: 'default',
      icon: 'restart_alt',
      message: 'Your next logged day will start a new streak.',
    });
  }

  return (
    <>
      <div className={styles.streakTile}>
        <div className={styles.streakHead}>
          <span
            className={`${styles.streakIcon} ${broken ? styles.streakIconBroken : ''}`}
            aria-hidden="true"
          >
            <span className="material-symbols-outlined">
              {broken ? 'restart_alt' : 'local_fire_department'}
            </span>
          </span>
          <span className={styles.streakLabel}>Current streak · {habitLabel}</span>
        </div>
        <span className={`${styles.streakValue} ${broken ? styles.streakValueBroken : ''}`}>
          {streak.current} {streak.current === 1 ? 'day' : 'days'}
        </span>
        {broken ? (
          <>
            <span className={styles.streakDetail}>
              No active streak right now. Your best was {streak.best} days.
            </span>
            <span className={styles.streakAction}>
              <Button variant="ghost" size="sm" icon="restart_alt" onClick={handleRestart}>
                Restart streak
              </Button>
            </span>
          </>
        ) : (
          <span className={styles.streakDetail}>days in a row</span>
        )}
      </div>

      <div className={styles.streakTile}>
        <div className={styles.streakHead}>
          <span className={styles.streakIcon} aria-hidden="true">
            <span className="material-symbols-outlined">military_tech</span>
          </span>
          <span className={styles.streakLabel}>Best streak · {habitLabel}</span>
        </div>
        <span className={styles.streakValue}>
          {streak.best} {streak.best === 1 ? 'day' : 'days'}
        </span>
        <span className={styles.streakDetail}>your longest run so far</span>
      </div>
    </>
  );
}

/** Plain-language label for a streak habit code from the API. */
function describeHabit(habit: string): string {
  switch (habit) {
    case 'meds':
      return 'taking medications';
    case 'steps':
      return 'staying active';
    case 'logging':
      return 'logging meals';
    case 'glucose':
      return 'checking glucose';
    default:
      return habit;
  }
}

/** One badge in the shelf. Earned: gold disc + colored icon + earned date.
 *  Locked: dimmed ~40%, lock icon, and the criterion line that unlocks it. */
function BadgeCard({ badge, popped }: { badge: Badge; popped: boolean }) {
  const stateLabel = badge.earned ? 'Earned' : 'Locked';
  return (
    <li
      className={`${styles.badge} ${badge.earned ? '' : styles.badgeLocked} ${
        popped ? styles.badgePop : ''
      }`}
    >
      <span
        className={`${styles.badgeDisc} ${badge.earned ? styles.badgeDiscEarned : ''}`}
        aria-hidden="true"
      >
        <span className="material-symbols-outlined">{badge.earned ? badge.icon : 'lock'}</span>
      </span>
      <span className={styles.badgeName}>
        {badge.name}
        <span className={styles.srOnly}> — {stateLabel}</span>
      </span>
      <span className={styles.badgeDesc}>{badge.description}</span>
      {badge.earned ? (
        <span className={styles.badgeEarnedMeta}>
          <span className="material-symbols-outlined" aria-hidden="true">
            check_circle
          </span>
          {badge.earnedOn ? `Earned ${formatMediumDate(badge.earnedOn)}` : 'Earned'}
        </span>
      ) : (
        <span className={styles.badgeCriterion}>
          <span className="material-symbols-outlined" aria-hidden="true">
            lock
          </span>
          {badge.criterion}
        </span>
      )}
    </li>
  );
}
