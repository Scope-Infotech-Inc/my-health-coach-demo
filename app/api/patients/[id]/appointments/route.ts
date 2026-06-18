import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, unknownPatient } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * /api/patients/{id}/appointments — appointment-request flow (FR-24, §6.3).
 * GET  → { slots: [{id, careTeam{name,role}|null, slotDatetime, taken}] }
 * POST → body {slotId}; marks the seeded slot taken and returns
 *        { confirmed: true, slot: {...} } for the confirmation card.
 * slotDatetime stays ISO ('2026-06-18T10:30') — the UI formats it.
 */

interface SlotRow {
  id: number;
  slot_datetime: string;
  taken: number;
  name: string | null;
  role: string | null;
}

function shapeSlot(s: SlotRow) {
  return {
    id: s.id,
    careTeam: s.name != null ? { name: s.name, role: s.role as string } : null,
    slotDatetime: s.slot_datetime,
    taken: s.taken === 1,
  };
}

const SLOT_SELECT = `SELECT s.id, s.slot_datetime, s.taken, c.name, c.role
   FROM appointment_slots s
   LEFT JOIN care_team c ON c.id = s.care_team_id
   WHERE s.patient_id = ?`;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  const db = getDb();
  const rows = db.prepare(`${SLOT_SELECT} ORDER BY s.slot_datetime, s.id`).all(id) as SlotRow[];

  return NextResponse.json({ slots: rows.map(shapeSlot) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!findPatient(id)) return unknownPatient(id);

  let payload: { slotId?: number };
  try {
    payload = await req.json();
  } catch {
    return jsonError('Invalid JSON body');
  }
  const slotId = Number(payload.slotId);
  if (!Number.isInteger(slotId)) return jsonError('slotId is required');

  const db = getDb();
  const row = db.prepare(`${SLOT_SELECT} AND s.id = ?`).get(id, slotId) as SlotRow | undefined;
  if (!row) return jsonError(`Unknown slot: ${slotId}`, 404);

  db.prepare('UPDATE appointment_slots SET taken = 1 WHERE id = ?').run(slotId);
  row.taken = 1;

  return NextResponse.json({ confirmed: true, slot: shapeSlot(row) });
}
