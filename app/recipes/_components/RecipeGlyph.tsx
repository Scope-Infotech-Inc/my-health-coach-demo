'use client';

import React from 'react';

/**
 * Route-local illustration block for a recipe card (DESIGN-BRIEF §7 /recipes).
 * Two quiet "plate" rings on one of three tonal grounds, with a Material
 * Symbols food icon centered over them. The icon is chosen by dish type so a
 * grid reads as a varied set without any external image; the tonal ground
 * still rotates by the card's index. Decorative — the title beside it is the
 * accessible label, so the tile is aria-hidden.
 *
 * Tones use only existing tokens: navy ground / sky ground / gold-soft
 * ground, each paired with a legible foreground from the verified palette.
 */

const TONES = [
  { ground: 'var(--navy-deep)', ink: 'var(--white)', rule: 'var(--navy-700)' },
  { ground: 'var(--sky-tint)', ink: 'var(--navy-deep)', rule: 'var(--sky-tint-strong)' },
  { ground: 'var(--gold-soft)', ink: 'var(--gold-ink)', rule: 'var(--caution-gold)' },
] as const;

/**
 * Map a recipe to a Material Symbols food icon by dish type, matched on the
 * title. Seafood is checked first so "Baked Cod with Roasted Asparagus" reads
 * as fish, not grill. Composed plates (tacos, stuffed peppers) and anything
 * unmatched fall back to a neutral fork-and-knife. All names are standard
 * Material Symbols icons, so every card renders a real glyph.
 */
function iconFor(title: string): string {
  const t = title.toLowerCase();
  if (/salmon|cod|tuna|fish|shrimp|prawn|shellfish/.test(t)) return 'set_meal';
  if (/soup/.test(t)) return 'soup_kitchen';
  if (/parfait|yogurt/.test(t)) return 'icecream';
  if (/oats|overnight/.test(t)) return 'breakfast_dining';
  if (/chicken|roast/.test(t)) return 'outdoor_grill';
  if (/taco|stuffed|pepper/.test(t)) return 'restaurant';
  if (/bowl|rice|stir.?fry|quinoa|curry|edamame|buddha/.test(t)) return 'rice_bowl';
  return 'restaurant';
}

export function RecipeGlyph({ title, index }: { title: string; index: number }) {
  const tone = TONES[index % TONES.length];
  const icon = iconFor(title);
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <svg
        viewBox="0 0 320 132"
        focusable="false"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <rect x="0" y="0" width="320" height="132" fill={tone.ground} />
        {/* two quiet plate rules, purely structural texture */}
        <circle cx="160" cy="66" r="50" fill="none" stroke={tone.rule} strokeWidth="2" />
        <circle cx="160" cy="66" r="38" fill="none" stroke={tone.rule} strokeWidth="1" />
      </svg>
      <span
        className="material-symbols-outlined"
        style={{ position: 'relative', color: tone.ink, fontSize: 46, lineHeight: 1 }}
      >
        {icon}
      </span>
    </div>
  );
}
