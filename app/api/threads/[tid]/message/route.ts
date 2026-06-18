import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { jsonError, sleep } from '@/lib/api-helpers';
import { DEMO_NOW_TIME, seededJitterMs } from '@/lib/demo-clock';
import { AuditLog } from '@/lib/seams/audit';

export const runtime = 'nodejs';

/**
 * POST /api/threads/{tid}/message — send / share / request guidance
 * (FR-24, PRD §6.3). Body {body?, attachmentKind?, topic?}:
 * - appends the patient message;
 * - if topic matches the seeded provider_replies bank, waits a deterministic
 *   seeded delay then appends the simulated provider reply;
 * - if attachmentKind is present (e.g. 'data_snapshot:labs'), records the
 *   shared scope in the access log (purpose 'patient_share').
 * Returns { messages: [...] } — the updated thread, in sort order.
 */

interface ThreadRow {
  id: number;
  patient_id: string;
  name: string;
  role: string;
}

interface MessageRow {
  sender: string;
  body: string;
  attachment_kind: string | null;
  sent_label: string;
}

/**
 * Deterministic demo time-of-day label: DEMO_NOW (09:41) plus N minutes,
 * where N = number of messages already in the thread — so successive sends
 * tick forward monotonically and re-seeding reproduces identical labels.
 */
function demoTimeLabel(minutesAfterNow: number): string {
  const [h, m] = DEMO_NOW_TIME.split(':').map(Number);
  const total = h * 60 + m + minutesAfterNow;
  const hh24 = Math.floor(total / 60) % 24;
  const mm = total % 60;
  const meridiem = hh24 >= 12 ? 'PM' : 'AM';
  const hh12 = hh24 % 12 === 0 ? 12 : hh24 % 12;
  return `${hh12}:${String(mm).padStart(2, '0')} ${meridiem}`;
}

export async function POST(req: Request, { params }: { params: Promise<{ tid: string }> }) {
  const { tid } = await params;
  const threadId = Number(tid);
  if (!Number.isInteger(threadId)) return jsonError(`Unknown thread: ${tid}`, 404);

  const db = getDb();
  const thread = db
    .prepare(
      `SELECT t.id, t.patient_id, c.name, c.role
       FROM provider_threads t
       JOIN care_team c ON c.id = t.care_team_id
       WHERE t.id = ?`
    )
    .get(threadId) as ThreadRow | undefined;
  if (!thread) return jsonError(`Unknown thread: ${tid}`, 404);

  let payload: { body?: string; attachmentKind?: string; topic?: string };
  try {
    payload = await req.json();
  } catch {
    return jsonError('Invalid JSON body');
  }
  const body = typeof payload.body === 'string' ? payload.body : '';
  const attachmentKind =
    typeof payload.attachmentKind === 'string' && payload.attachmentKind !== ''
      ? payload.attachmentKind
      : null;
  const topic = typeof payload.topic === 'string' ? payload.topic : null;
  if (body === '' && !attachmentKind && !topic) {
    return jsonError('Provide at least one of: body, attachmentKind, topic');
  }

  const nextSort = () =>
    (
      db
        .prepare(
          'SELECT COALESCE(MAX(sort), -1) + 1 AS s FROM provider_messages WHERE thread_id = ?'
        )
        .get(threadId) as { s: number }
    ).s;
  const messageCount = () =>
    (
      db
        .prepare('SELECT COUNT(*) AS n FROM provider_messages WHERE thread_id = ?')
        .get(threadId) as { n: number }
    ).n;

  const insert = db.prepare(
    `INSERT INTO provider_messages (thread_id, sender, body, attachment_kind, sent_label, sort)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  // 1. Append the patient message (timestamp ticks with the thread's length).
  insert.run(
    threadId,
    'patient',
    body,
    attachmentKind,
    `Today ${demoTimeLabel(messageCount())}`,
    nextSort()
  );

  // 2. Shared data snapshot → log the read in the access log (the care-team
  //    member the patient shared with is the accessor).
  if (attachmentKind) {
    const scope = attachmentKind.includes(':')
      ? attachmentKind.slice(attachmentKind.indexOf(':') + 1)
      : attachmentKind;
    AuditLog.record({
      patientId: thread.patient_id,
      actor: thread.name,
      actorRole: thread.role,
      scope,
      purposeOfUse: 'patient_share',
    });
  }

  // 3. Guidance topic → deterministic delay, then the seeded simulated reply.
  if (topic) {
    const reply = db.prepare('SELECT body FROM provider_replies WHERE topic = ?').get(topic) as
      | { body: string }
      | undefined;
    if (reply) {
      await sleep(seededJitterMs(`reply:${tid}:${topic}`, 900, 1800));
      insert.run(
        threadId,
        'provider',
        reply.body,
        null,
        `Today ${demoTimeLabel(messageCount())}`,
        nextSort()
      );
    }
  }

  const messages = (
    db
      .prepare(
        `SELECT sender, body, attachment_kind, sent_label
       FROM provider_messages WHERE thread_id = ? ORDER BY sort, id`
      )
      .all(threadId) as MessageRow[]
  ).map((m) => ({
    sender: m.sender,
    body: m.body,
    ...(m.attachment_kind != null ? { attachmentKind: m.attachment_kind } : {}),
    sentLabel: m.sent_label,
  }));

  return NextResponse.json({ messages });
}
