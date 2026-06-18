import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/messages — per #spec-api:
 * messages[]{senderName,senderRole,senderType,avatar,avatarStyle,body,
 * sentLabel,actionLabel?} from coach_messages ORDER BY sort.
 */

interface MessageRow {
  sender_name: string;
  sender_role: string;
  sender_type: string;
  avatar: string;
  avatar_style: string;
  body: string;
  sent_label: string;
  action_label: string | null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT sender_name, sender_role, sender_type, avatar, avatar_style,
              body, sent_label, action_label
       FROM coach_messages WHERE patient_id = ? ORDER BY sort, id`
    )
    .all(id) as MessageRow[];

  const messages = rows.map((r) => ({
    senderName: r.sender_name,
    senderRole: r.sender_role,
    senderType: r.sender_type,
    avatar: r.avatar,
    avatarStyle: r.avatar_style,
    body: r.body,
    sentLabel: r.sent_label,
    ...(r.action_label != null ? { actionLabel: r.action_label } : {}),
  }));

  return NextResponse.json({ messages });
}
