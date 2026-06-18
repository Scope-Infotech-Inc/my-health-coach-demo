import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/threads — provider messaging (FR-24, PRD §6.3).
 * threads[]{id, subject, careTeam{name,role,avatar,avatarStyle},
 *           messages[]{sender, body, attachmentKind?, sentLabel}}
 * One thread per care-team member (seed); messages in `sort` order.
 */

interface ThreadRow {
  id: number;
  subject: string;
  name: string;
  role: string;
  avatar: string;
  avatar_style: string;
}

interface MessageRow {
  thread_id: number;
  sender: string;
  body: string;
  attachment_kind: string | null;
  sent_label: string;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  const db = getDb();
  const threadRows = db
    .prepare(
      `SELECT t.id, t.subject, c.name, c.role, c.avatar, c.avatar_style
       FROM provider_threads t
       JOIN care_team c ON c.id = t.care_team_id
       WHERE t.patient_id = ?
       ORDER BY t.id`
    )
    .all(id) as ThreadRow[];

  const messageStmt = db.prepare(
    `SELECT thread_id, sender, body, attachment_kind, sent_label
     FROM provider_messages WHERE thread_id = ? ORDER BY sort, id`
  );

  const threads = threadRows.map((t) => ({
    id: t.id,
    subject: t.subject,
    careTeam: {
      name: t.name,
      role: t.role,
      avatar: t.avatar,
      avatarStyle: t.avatar_style,
    },
    messages: (messageStmt.all(t.id) as MessageRow[]).map((m) => ({
      sender: m.sender,
      body: m.body,
      ...(m.attachment_kind != null ? { attachmentKind: m.attachment_kind } : {}),
      sentLabel: m.sent_label,
    })),
  }));

  return NextResponse.json({ threads });
}
