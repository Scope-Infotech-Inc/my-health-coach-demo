/**
 * Shared chart grammar constants (DESIGN-BRIEF §6). These geometry values
 * are the one permitted source of non-API display constants.
 */
export const LINE_VB = { w: 640, h: 240, padL: 44, padR: 16, padT: 16, padB: 28 };
export const BAR_VB = { w: 640, h: 220, padL: 44, padR: 16, padT: 24, padB: 28 };

export const AXIS_TEXT = {
  fontFamily: 'var(--font-label)',
  fontSize: 11,
  fill: 'var(--slate-gray)',
} as const;

export const GRID_STROKE = 'var(--surface-container-highest)';
export const SERIES_STROKE = 'var(--navy-deep)';
export const EASE_DRAW = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** Status→color for out-of-range points (always paired with an icon). */
export function flagColor(flag?: string): string {
  if (flag === 'above_target' || flag === 'prediabetes') return 'var(--error-red)';
  if (flag === 'elevated') return 'var(--gold-ink)';
  return SERIES_STROKE;
}

export function isOutOfRange(flag?: string): boolean {
  return flag === 'above_target' || flag === 'elevated' || flag === 'prediabetes';
}
