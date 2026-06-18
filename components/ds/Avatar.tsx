import React from 'react';

/**
 * CMS Avatar — initials on a brand-tinted disc, or an image. Optional ring.
 * Ported from Docs/Style/CMS Web Design System/components/core/Avatar.jsx.
 */

export interface AvatarProps extends React.HTMLAttributes<HTMLElement> {
  /** Full name — used for initials and alt text */
  name?: string;
  /** Image URL; falls back to initials when omitted */
  src?: string;
  /** Pixel diameter. @default 32 */
  size?: number;
  /** Initials disc color. @default "navy" */
  tone?: 'navy' | 'gold' | 'sky' | 'slate';
  /** Gold ring border */
  ring?: boolean;
}

const TONES: Record<NonNullable<AvatarProps['tone']>, { bg: string; fg: string }> = {
  navy: { bg: 'var(--navy-deep)', fg: '#fff' },
  gold: { bg: 'var(--caution-gold)', fg: 'var(--navy-deep)' },
  sky: { bg: 'var(--sky-tint-strong)', fg: 'var(--navy-deep)' },
  slate: { bg: 'var(--slate-gray)', fg: '#fff' },
};

export function Avatar({
  name = '',
  src,
  size = 32,
  tone = 'navy',
  ring = false,
  style = {},
  ...rest
}: AvatarProps) {
  const t = TONES[tone] ?? TONES.navy;
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const common: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    border: ring ? '2px solid var(--caution-gold)' : 'none',
    ...style,
  };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} style={{ ...common, objectFit: 'cover' }} {...rest} />
    );
  }
  return (
    <div
      style={{
        ...common,
        background: t.bg,
        color: t.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-label)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.4),
      }}
      {...rest}
    >
      {initials}
    </div>
  );
}
