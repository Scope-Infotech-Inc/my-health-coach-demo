import React from 'react';

/**
 * CMS Avatar — initials on a brand-tinted disc, or an image. Optional ring.
 */
export function Avatar({ name = '', src, size = 32, tone = 'navy', ring = false, style = {}, ...rest }) {
  const tones = {
    navy: { bg: 'var(--navy-deep)', fg: '#fff' },
    gold: { bg: 'var(--caution-gold)', fg: 'var(--navy-deep)' },
    sky: { bg: 'var(--sky-tint-strong)', fg: 'var(--navy-deep)' },
    slate: { bg: 'var(--slate-gray)', fg: '#fff' },
  };
  const t = tones[tone] || tones.navy;
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const common = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    border: ring ? '2px solid var(--caution-gold)' : 'none',
    ...style,
  };

  if (src) {
    return <img src={src} alt={name} style={{ ...common, objectFit: 'cover' }} {...rest} />;
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
