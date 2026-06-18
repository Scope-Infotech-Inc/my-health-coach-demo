import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { findPatient, jsonError, parseJsonArray } from '@/lib/api-helpers';
import { DEMO_NOW_TIME, DEMO_TODAY, fictionWeekday } from '@/lib/demo-clock';

export const runtime = 'nodejs';

/**
 * GET /api/services?category=&patientId= — per #spec-api:
 * services[]{id,category,name,distanceMi,address,hours,openNow,tags[],map{x,y}}.
 *
 * openNow derives from the seeded hours string and the demo clock (Friday
 * 09:41 in the fiction) — the seeded "open now"/"closed now" tags pass
 * through verbatim, but the computed flag is authoritative for the UI.
 *
 * Persona-aware ordering (PRD §6.5 + §4.5) with optional ?patientId=:
 *  - base order by condition: diabetes → pharmacy, healthy_shopping,
 *    urgent_care, fitness, trail_park; obesity → fitness, trail_park,
 *    healthy_shopping, pharmacy, urgent_care; comorbid (sarah) → pharmacy,
 *    healthy_shopping, fitness, trail_park, urgent_care.
 *  - social drivers (social_drivers rows whose surfaces include 'nearby'):
 *    food_insecurity promotes healthy_shopping to the front;
 *    transportation promotes nearer places (stronger distance weighting)
 *    and accessibility-tagged entries; social_isolation promotes
 *    fitness/community entries.
 *  - within a category: distance ascending. Without patientId: distance
 *    ascending overall.
 */

const CATEGORIES = [
  'urgent_care',
  'pharmacy',
  'healthy_shopping',
  'fitness',
  'trail_park',
] as const;
type Category = (typeof CATEGORIES)[number];

interface ServiceRow {
  id: number;
  category: Category;
  name: string;
  distance_mi: number;
  address: string;
  hours: string;
  tags: string;
  map_x: number;
  map_y: number;
}

/** Parse '8am–8pm' style ranges against the demo clock. */
function isOpenNow(hours: string): boolean {
  const h = hours.toLowerCase().trim();
  if (h.includes('24 hours')) return true;
  if (h.includes('dawn') && h.includes('dusk')) {
    const now = toMinutes(DEMO_NOW_TIME);
    return now >= toMinutes('06:00') && now <= toMinutes('20:00');
  }
  // Day-restricted hours, e.g. 'Sat 8am–1pm' — the demo "today" is Friday.
  const dayMatch = h.match(/^(mon|tue|wed|thu|fri|sat|sun)/);
  if (dayMatch) {
    const today = fictionWeekday(DEMO_TODAY, true).toLowerCase();
    if (!h.startsWith(today)) return false;
  }
  const range = h.match(
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/
  );
  if (!range) return false;
  const start = clock12(Number(range[1]), Number(range[2] ?? 0), range[3] as 'am' | 'pm');
  const end = clock12(Number(range[4]), Number(range[5] ?? 0), range[6] as 'am' | 'pm');
  const now = toMinutes(DEMO_NOW_TIME);
  return now >= start && now <= end;
}

function clock12(hour: number, minute: number, meridiem: 'am' | 'pm'): number {
  const h24 = (hour % 12) + (meridiem === 'pm' ? 12 : 0);
  return h24 * 60 + minute;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

const BASE_ORDER: Record<string, Category[]> = {
  diabetes: ['pharmacy', 'healthy_shopping', 'urgent_care', 'fitness', 'trail_park'],
  obesity: ['fitness', 'trail_park', 'healthy_shopping', 'pharmacy', 'urgent_care'],
  comorbid: ['pharmacy', 'healthy_shopping', 'fitness', 'trail_park', 'urgent_care'],
};

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const patientId = url.searchParams.get('patientId');

  if (category && !(CATEGORIES as readonly string[]).includes(category)) {
    return jsonError(`Unknown category: ${category}`, 400);
  }

  const db = getDb();
  const rows = (
    category
      ? db
          .prepare('SELECT * FROM local_services WHERE category = ? ORDER BY distance_mi, id')
          .all(category)
      : db.prepare('SELECT * FROM local_services ORDER BY distance_mi, id').all()
  ) as ServiceRow[];

  let categoryRank: (c: Category) => number = () => 0;
  let tagBoost: (tags: string[]) => number = () => 0;
  let distanceWeight = 0; // 0 = order within category purely by distance

  if (patientId) {
    const patient = findPatient(patientId);
    if (!patient) return jsonError(`Unknown patient: ${patientId}`, 404);
    const order = [...(BASE_ORDER[patient.category] ?? BASE_ORDER.diabetes)];

    const drivers = db
      .prepare(
        `SELECT domain FROM social_drivers
         WHERE patient_id = ? AND status = 'at_risk' AND surfaces LIKE '%nearby%'`
      )
      .all(patientId) as Array<{ domain: string }>;
    const domains = new Set(drivers.map((d) => d.domain));

    if (domains.has('food_insecurity')) {
      order.splice(order.indexOf('healthy_shopping'), 1);
      order.unshift('healthy_shopping');
    }
    if (domains.has('social_isolation')) {
      order.splice(order.indexOf('fitness'), 1);
      const at = order[0] === 'healthy_shopping' ? 1 : 0;
      order.splice(at, 0, 'fitness');
    }
    if (domains.has('transportation')) {
      distanceWeight = 1; // nearer places matter more than category order
      tagBoost = (tags) => (tags.some((t) => /accessible|low-impact|flat/.test(t)) ? -0.5 : 0);
    }
    // carol's osteoarthritis: emphasize low-impact/accessible (PRD §6.5)
    if (patient.condition_detail?.toLowerCase().includes('osteoarthritis')) {
      tagBoost = (tags) =>
        tags.some((t) => /accessible|low-impact|joint-friendly|flat/.test(t)) ? -0.5 : 0;
    }
    categoryRank = (c) => order.indexOf(c);
  }

  const services = rows
    .map((r) => ({
      id: r.id,
      category: r.category,
      name: r.name,
      distanceMi: r.distance_mi,
      address: r.address,
      hours: r.hours,
      openNow: isOpenNow(r.hours),
      tags: parseJsonArray<string>(r.tags),
      map: { x: r.map_x, y: r.map_y },
    }))
    .sort((a, b) => {
      const rank =
        distanceWeight > 0
          ? a.distanceMi - b.distanceMi + (tagBoost(a.tags) - tagBoost(b.tags))
          : categoryRank(a.category) - categoryRank(b.category) ||
            tagBoost(a.tags) - tagBoost(b.tags) ||
            a.distanceMi - b.distanceMi;
      return rank || a.id - b.id;
    });

  return NextResponse.json({ services });
}
