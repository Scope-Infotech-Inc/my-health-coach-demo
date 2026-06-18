import React from 'react';

/**
 * CMS Alert / callout — color + icon banner for system messages.
 * Left accent rule + tinted background; navy text for AA contrast.
 */
export function Alert({ kind = 'info', title, icon, onClose, children, style = {}, ...rest }) {
  const kinds = {
    info: { bg: 'var(--sky-tint)', rule: 'var(--navy-deep)', fg: 'var(--navy-deep)', icon: icon || 'info' },
    success: { bg: 'var(--success-container)', rule: 'var(--success)', fg: 'var(--on-success-container)', icon: icon || 'check_circle' },
    warning: { bg: 'rgba(253,184,30,0.18)', rule: 'var(--caution-gold)', fg: 'var(--warning)', icon: icon || 'warning' },
    error: { bg: 'var(--error-container)', rule: 'var(--error-red)', fg: 'var(--on-error-container)', icon: icon || 'report' },
  };
  const k = kinds[kind] || kinds.info;

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        gap: 12,
        background: k.bg,
        borderLeft: `4px solid ${k.rule}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        ...style,
      }}
      {...rest}
    >
      <span className="material-symbols-outlined is-filled" style={{ fontSize: 22, color: k.rule, flexShrink: 0 }}>{k.icon}</span>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: k.fg, marginBottom: children ? 4 : 0 }}>
            {title}
          </div>
        )}
        {children && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: '20px', color: 'var(--on-surface-variant)' }}>
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: k.fg, padding: 0, height: 22 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        </button>
      )}
    </div>
  );
}
