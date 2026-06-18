/**
 * Fixed demo clock. Every date, range, relative label, and "now" in the app
 * derives from these constants — never from the wall clock and never from
 * Math.random(). The demo fiction renders 2026-06-06 as a FRIDAY (per the
 * PRD narrative "Friday, June 6, 2026"); weekday names for all other dates
 * are derived by day-offset from that anchor, NOT from the real calendar.
 */
export const DEMO_TODAY = '2026-06-06';

/** Fixed time-of-day for "now" (morning, so greetings read "Good morning"). */
export const DEMO_NOW_TIME = '09:41';
export const DEMO_NOW_ISO = `${DEMO_TODAY}T${DEMO_NOW_TIME}:00`;

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Fiction anchor: DEMO_TODAY is a Friday (index 5). */
const ANCHOR_WEEKDAY_INDEX = 5;

/** Parse 'YYYY-MM-DD' to a UTC Date (UTC avoids TZ drift in day math). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

const MS_PER_DAY = 86_400_000;

/** Whole-day difference: iso minus DEMO_TODAY (negative = past). */
export function daysFromToday(iso: string): number {
  return Math.round(
    (parseISODate(iso).getTime() - parseISODate(DEMO_TODAY).getTime()) / MS_PER_DAY
  );
}

/** ISO date at a day offset from DEMO_TODAY. */
export function isoFromToday(offsetDays: number): string {
  const d = new Date(parseISODate(DEMO_TODAY).getTime() + offsetDays * MS_PER_DAY);
  return d.toISOString().slice(0, 10);
}

/** Weekday name in the demo fiction (DEMO_TODAY = Friday). */
export function fictionWeekday(iso: string, short = false): string {
  const idx = (((ANCHOR_WEEKDAY_INDEX + daysFromToday(iso)) % 7) + 7) % 7;
  return short ? WEEKDAYS_SHORT[idx] : WEEKDAYS[idx];
}

/** "June 6, 2026" */
export function formatLongDate(iso: string): string {
  const d = parseISODate(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "Jun 6, 2026" */
export function formatMediumDate(iso: string): string {
  const d = parseISODate(iso);
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** "Jun 6" */
export function formatShortDate(iso: string): string {
  const d = parseISODate(iso);
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** "Friday, June 6, 2026" (fiction weekday). */
export function formatFullDate(iso: string = DEMO_TODAY): string {
  return `${fictionWeekday(iso)}, ${formatLongDate(iso)}`;
}

/** Greeting for the fixed demo time (09:41 → morning). */
export function demoGreetingWord(): 'Good morning' | 'Good afternoon' | 'Good evening' {
  const hour = Number(DEMO_NOW_TIME.split(':')[0]);
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Relative label against the demo clock: 'Today', 'Yesterday', 'Mon',
 * or 'Jun 1' for older dates. Used for feed timestamps and sync labels.
 */
export function relativeDayLabel(iso: string): string {
  const diff = daysFromToday(iso);
  if (diff === 0) return 'Today';
  if (diff === -1) return 'Yesterday';
  if (diff > -7 && diff < 0) return fictionWeekday(iso, true);
  return formatShortDate(iso);
}

/** Parse 'YYYY-MM-DDTHH:MM:SS' (or a bare date) to a UTC epoch (ms). */
export function parseISODateTime(iso: string): number {
  const [datePart, timePart = '00:00:00'] = iso.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh = 0, mm = 0, ss = 0] = timePart.split(':').map(Number);
  return Date.UTC(y, m - 1, d, hh, mm, ss);
}

/**
 * Sync-chip label for a timestamp, relative to the fixed demo "now"
 * (2026-06-06T09:41). Deterministic — inputs are seeded, never wall-clock.
 * 'just now' · 'N min ago' · 'N hr ago' (same day) · 'Yesterday' · 'Jun 1'.
 */
export function syncRelativeLabel(iso: string | null | undefined): string {
  if (!iso) return 'Not yet synced';
  const deltaMs = parseISODateTime(DEMO_NOW_ISO) - parseISODateTime(iso);
  const min = Math.round(deltaMs / 60_000);
  if (min <= 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  if (daysFromToday(iso.slice(0, 10)) === 0) {
    const hr = Math.round(min / 60);
    return hr <= 1 ? '1 hr ago' : `${hr} hr ago`;
  }
  return relativeDayLabel(iso.slice(0, 10));
}

/**
 * Deterministic pseudo-jitter in [min, max] derived from a string key —
 * the only permitted "randomness" (simulated latencies). Same key, same
 * delay, every run.
 */
export function seededJitterMs(key: string, min: number, max: number): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const unit = ((h >>> 0) % 1000) / 999;
  return Math.round(min + unit * (max - min));
}
