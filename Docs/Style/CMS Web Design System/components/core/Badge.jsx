import React from 'react';

/**
 * CMS status Badge — pill with optional dot/icon. Color encodes status,
 * always paired with text (and optionally an icon) for accessibility.
 */
export function Badge({ status = 'info', icon, dot = false, children, style = {}, ...rest }) {
  const palettes = {
    info: { bg: 'var(--sky-tint)', fg: 'var(--navy-deep)', dot: 'var(--navy-deep)' },
    success: { bg: 'var(--success-container)', fg: 'var(--on-success-container)', dot: 'var(--success)' },
    active: { bg: 'var(--sky-tint)', fg: 'var(--navy-deep)', dot: 'var(--navy-deep)' },
    warning: { bg: 'rgba(253,184,30,0.2)', fg: 'var(--warning)', dot: 'var(--caution-gold)' },
    error: { bg: 'var(--error-container)', fg: 'var(--on-error-container)', dot: 'var(--error)' },
    neutral: { bg: 'var(--surface-container)', fg: 'var(--on-surface-variant)', dot: 'var(--slate-gray)' },
  };
  const p = palettes[status] || palettes.info;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        background: p.bg,
        color: p.fg,
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-label)',
        fontSize: 12,
        fontWeight: 600,
        lineHeight: '16px',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot }} />}
      {icon && <span className="material-symbols-outlined is-filled" style={{ fontSize: 14 }}>{icon}</span>}
      {children}
    </span>
  );
}
