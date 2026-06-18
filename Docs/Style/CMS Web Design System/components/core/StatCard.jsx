import React from 'react';

/**
 * CMS StatCard / KPI tile — tinted icon chip + big display number, used in
 * bento dashboard grids. Optional trend badge and footer meta.
 */
export function StatCard({
  icon,
  tone = 'info',
  label,
  value,
  trend,
  footer,
  style = {},
  ...rest
}) {
  const tones = {
    info: { chipBg: 'var(--sky-tint)', chipFg: 'var(--navy-deep)' },
    gold: { chipBg: 'rgba(253,184,30,0.15)', chipFg: 'var(--caution-gold)' },
    error: { chipBg: 'var(--error-container)', chipFg: 'var(--error)' },
    neutral: { chipBg: 'var(--surface-container)', chipFg: 'var(--slate-gray)' },
  };
  const t = tones[tone] || tones.info;

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--card-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius)',
            background: t.chipBg,
            color: t.chipFg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="material-symbols-outlined is-filled" style={{ fontSize: 24 }}>{icon}</span>
        </div>
        {trend}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-label)',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--text-muted)',
          marginTop: 16,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--display-lg-size)',
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text-heading)',
          marginTop: 4,
        }}
      >
        {value}
      </div>
      {footer && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid var(--border-hairline)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-label)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-subtle)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
