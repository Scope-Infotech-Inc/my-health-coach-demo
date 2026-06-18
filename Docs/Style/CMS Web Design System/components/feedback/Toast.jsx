import React from 'react';

/**
 * CMS Toast — transient notification card. Status accent rule + icon, title,
 * optional body, auto-dismiss. Pair with <ToastViewport> for stacking.
 */
export function Toast({ kind = 'info', title, icon, onClose, children }) {
  const k = {
    info: { rule: 'var(--navy-deep)', icon: icon || 'info' },
    success: { rule: 'var(--success)', icon: icon || 'check_circle' },
    warning: { rule: 'var(--caution-gold)', icon: icon || 'warning' },
    error: { rule: 'var(--error-red)', icon: icon || 'report' },
  }[kind];

  return (
    <div
      role="status"
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        width: 360, maxWidth: '90vw',
        background: 'var(--surface-card)',
        borderLeft: `4px solid ${k.rule}`,
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-overlay)',
        padding: '14px 16px',
        animation: 'cmsToastIn var(--duration) var(--ease-out)',
      }}
    >
      <span className="material-symbols-outlined is-filled" style={{ color: k.rule, fontSize: 22, flexShrink: 0 }}>{k.icon}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ font: '700 15px/20px var(--font-sans)', color: 'var(--navy-deep)', marginBottom: children ? 2 : 0 }}>{title}</div>}
        {children && <div style={{ fontSize: 14, lineHeight: '20px', color: 'var(--text-muted)' }}>{children}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', padding: 2 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>
      )}
      <style>{'@keyframes cmsToastIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}'}</style>
    </div>
  );
}

/** Fixed bottom-right stack container for Toasts. */
export function ToastViewport({ position = 'bottom-right', children }) {
  const pos = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
    'top-right': { top: 24, right: 24 },
  }[position];
  return (
    <div style={{ position: 'fixed', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: 12, ...pos }}>
      {children}
    </div>
  );
}
