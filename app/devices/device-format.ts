/**
 * Route-local presentation helpers for /devices. Pure string formatting over
 * the values returned by /api/patients/{id}/devices — no hardcoded device
 * data, just the category icon, the category headings, and metric chips.
 * Kept self-contained to this route.
 */

/** Material Symbols glyph representing a device category, for the card logo block. */
export function categoryIcon(category: string): string {
  switch (category) {
    case 'glucose_meter':
      return 'water_drop'; // fingerstick blood drop
    case 'cgm':
      return 'monitoring'; // continuous trend line
    case 'scale':
      return 'monitor_weight'; // body scale
    case 'watch':
      return 'watch'; // wristwatch
    case 'bp_cuff':
      return 'monitor_heart'; // heart + ECG
    default:
      return 'devices_other'; // generic fallback
  }
}

/** Humanize a category id ("blood_pressure" → "Blood pressure") for headings. */
export function categoryLabel(category: string): string {
  const spaced = category.replace(/[_-]+/g, ' ').trim();
  if (!spaced) return 'Other';
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

/** Humanize a metric id ("active_minutes" → "active minutes") for chips. */
export function metricLabel(metric: string): string {
  return metric.replace(/_/g, ' ');
}
