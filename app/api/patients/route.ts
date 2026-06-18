import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { readPersonaRaw } from '@/lib/api-helpers';
import { PERSONA_GROUPS } from '@/lib/personas';

export const runtime = 'nodejs';

/**
 * GET /api/patients — roster for the persona switcher.
 * Ordered featured first (sarah), then diabetes, then obesity, using the
 * stable PERSONA_GROUPS order from lib/personas.ts.
 */

interface RosterRow {
  id: string;
  first_name: string;
  last_name_initial: string;
  featured: number;
  category: string;
  avatar_initials: string;
}

interface RosterPatient {
  id: string;
  firstName: string;
  lastNameInitial: string;
  featured: boolean;
  category: string;
  avatarInitials: string;
  headerRole?: string;
}

export async function GET(): Promise<NextResponse> {
  const db = getDb();
  const stmt = db.prepare(
    `SELECT id, first_name, last_name_initial, featured, category, avatar_initials
     FROM patients WHERE id = ?`
  );

  const orderedIds = PERSONA_GROUPS.flatMap((g) => g.ids);
  const patients: RosterPatient[] = [];
  for (const id of orderedIds) {
    const row = stmt.get(id) as RosterRow | undefined;
    if (!row) continue;
    const raw = readPersonaRaw<{ headerRole?: string }>(id);
    patients.push({
      id: row.id,
      firstName: row.first_name,
      lastNameInitial: row.last_name_initial,
      featured: row.featured === 1,
      category: row.category,
      avatarInitials: row.avatar_initials,
      ...(raw?.headerRole != null ? { headerRole: raw.headerRole } : {}),
    });
  }

  // Featured first regardless of group order (sarah is already first via
  // PERSONA_GROUPS, but keep the contract explicit and stable).
  patients.sort((a, b) => Number(b.featured) - Number(a.featured) || 0);

  return NextResponse.json({ patients });
}
