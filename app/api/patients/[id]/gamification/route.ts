import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/gamification — rewards engine (FR-22, PRD §6.1).
 * Returns points, level (name + ring bounds), current/best streak, the FULL
 * badge catalog (earned/locked via patient_badges join), and active
 * challenges. 404 unknown patient.
 *
 * NOTE — maria and robert: the seed JSON defines gamification for 11 of the
 * 13 personas only; maria and robert have NO gamification or patient_badges
 * rows by design. For them this endpoint still returns 200 with an explicit
 * graceful shape — { enrolled: false, points: 0, level: null, streak: null,
 * badges: [full catalog, all earned:false], challenges: [] } — so the UI can
 * render an intentional join/empty state instead of erroring. (If a badge is
 * later awarded via POST /api/gamification/award, the join reflects it even
 * while enrolled stays false.) All other personas get { enrolled: true, ... }.
 */

interface GamificationRow {
  patient_id: string;
  points: number;
  level_name: string;
  level_min: number;
  level_max: number;
  current_streak_days: number;
  best_streak_days: number;
  streak_habit: string;
}

interface BadgeJoinRow {
  id: string;
  name: string;
  description: string;
  criterion: string;
  icon: string;
  earned: number | null; // null when the patient has no patient_badges row
  earned_on: string | null;
}

interface ChallengeRow {
  title: string;
  progress_current: number;
  progress_total: number;
  reward_points: number;
  ends_on: string;
}

interface BadgeOut {
  id: string;
  name: string;
  description: string;
  criterion: string;
  icon: string;
  earned: boolean;
  earnedOn?: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  const db = getDb();

  // Full catalog in catalog sort order; locked rows surface as earned:false.
  const badgeRows = db
    .prepare(
      `SELECT b.id, b.name, b.description, b.criterion, b.icon,
              pb.earned AS earned, pb.earned_on AS earned_on
         FROM badges b
         LEFT JOIN patient_badges pb
           ON pb.badge_id = b.id AND pb.patient_id = ?
        ORDER BY b.sort`
    )
    .all(id) as BadgeJoinRow[];

  const badges: BadgeOut[] = badgeRows.map((r) => {
    const out: BadgeOut = {
      id: r.id,
      name: r.name,
      description: r.description,
      criterion: r.criterion,
      icon: r.icon,
      earned: r.earned === 1,
    };
    if (r.earned === 1 && r.earned_on) out.earnedOn = r.earned_on; // earnedOn? — only when known
    return out;
  });

  const game = db.prepare('SELECT * FROM gamification WHERE patient_id = ?').get(id) as
    | GamificationRow
    | undefined;

  if (!game) {
    // maria / robert: intentional not-enrolled state (see header comment).
    return NextResponse.json({
      enrolled: false,
      points: 0,
      level: null,
      streak: null,
      badges,
      challenges: [],
    });
  }

  const challengeRows = db
    .prepare(
      `SELECT title, progress_current, progress_total, reward_points, ends_on
         FROM challenges WHERE patient_id = ? ORDER BY sort`
    )
    .all(id) as ChallengeRow[];

  return NextResponse.json({
    enrolled: true,
    points: game.points,
    level: { name: game.level_name, min: game.level_min, max: game.level_max },
    streak: {
      current: game.current_streak_days,
      best: game.best_streak_days,
      habit: game.streak_habit,
    },
    badges,
    challenges: challengeRows.map((c) => ({
      title: c.title,
      progressCurrent: c.progress_current,
      progressTotal: c.progress_total,
      rewardPoints: c.reward_points,
      endsOn: c.ends_on,
    })),
  });
}
