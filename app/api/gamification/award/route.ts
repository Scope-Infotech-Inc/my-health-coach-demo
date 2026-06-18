import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';
import { DEMO_TODAY } from '@/lib/demo-clock';

export const runtime = 'nodejs';

/**
 * POST /api/gamification/award — demo achievement event (FR-22, PRD §6.1).
 * Body: { patientId, badgeId? }. Marks the named badge earned — or, when
 * badgeId is omitted, the FIRST locked badge in catalog sort order — setting
 * earned = 1 and earned_on = DEMO_TODAY (deterministic; no wall clock).
 * Returns { badge: { id, name, description, criterion, icon, earned: true,
 * earnedOn } } for the celebration toast/pop-in.
 *
 * Idempotent: awarding a badge the patient already earned changes nothing
 * and returns the badge unchanged with alreadyEarned: true (earnedOn omitted
 * if the seed never set earned_on for it).
 *
 * Patients with no patient_badges rows at all (maria and robert — the seed
 * defines gamification for 11 personas only): the row is inserted on demand,
 * then marked earned. No real event pipeline — this only drives the
 * deterministic earning animation.
 *
 * Errors: 400 invalid body / unknown badgeId; 404 unknown patient;
 * 409 when badgeId is omitted and every badge is already earned.
 */

interface BadgeRow {
  id: string;
  name: string;
  description: string;
  criterion: string;
  icon: string;
}

interface PatientBadgeRow {
  earned: number;
  earned_on: string | null;
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid JSON body');
  }

  const { patientId, badgeId } = (body ?? {}) as {
    patientId?: unknown;
    badgeId?: unknown;
  };

  if (typeof patientId !== 'string' || patientId.length === 0) {
    return jsonError('Missing required field: patientId');
  }
  if (!findPatient(patientId)) {
    return unknownPatient(patientId);
  }
  if (badgeId !== undefined && (typeof badgeId !== 'string' || badgeId.length === 0)) {
    return jsonError('Invalid badgeId: expected a non-empty string');
  }

  const db = getDb();

  let badge: BadgeRow | undefined;
  if (badgeId !== undefined) {
    badge = db
      .prepare('SELECT id, name, description, criterion, icon FROM badges WHERE id = ?')
      .get(badgeId) as BadgeRow | undefined;
    if (!badge) return jsonError(`Unknown badge: ${badgeId}`);
  } else {
    // First locked badge by catalog sort: no patient_badges row OR earned = 0.
    badge = db
      .prepare(
        `SELECT b.id, b.name, b.description, b.criterion, b.icon
           FROM badges b
           LEFT JOIN patient_badges pb
             ON pb.badge_id = b.id AND pb.patient_id = ?
          WHERE pb.earned IS NULL OR pb.earned = 0
          ORDER BY b.sort
          LIMIT 1`
      )
      .get(patientId) as BadgeRow | undefined;
    if (!badge) {
      return jsonError('All badges already earned', 409);
    }
  }

  const existing = db
    .prepare('SELECT earned, earned_on FROM patient_badges WHERE patient_id = ? AND badge_id = ?')
    .get(patientId, badge.id) as PatientBadgeRow | undefined;

  if (existing && existing.earned === 1) {
    // Idempotent path: already earned — return unchanged.
    return NextResponse.json({
      badge: {
        ...badge,
        earned: true,
        ...(existing.earned_on ? { earnedOn: existing.earned_on } : {}),
      },
      alreadyEarned: true,
    });
  }

  // Inserts the row when missing (maria/robert have none), else flips it.
  db.prepare(
    `INSERT INTO patient_badges (patient_id, badge_id, earned, earned_on)
     VALUES (?, ?, 1, ?)
     ON CONFLICT (patient_id, badge_id)
     DO UPDATE SET earned = 1, earned_on = excluded.earned_on`
  ).run(patientId, badge.id, DEMO_TODAY);

  return NextResponse.json({
    badge: { ...badge, earned: true, earnedOn: DEMO_TODAY },
  });
}
