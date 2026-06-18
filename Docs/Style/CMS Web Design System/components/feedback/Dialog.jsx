import React from 'react';

/**
 * CMS Dialog / Modal — centered panel over a navy-tinted scrim. Soft 8px
 * radius, overlay shadow, optional title + footer actions. Esc / scrim closes.
 */
export function Dialog({ open, onClose, title, icon, footer, width = 520, children }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(17,46,81,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, animation: 'cmsFade var(--duration) var(--ease-out)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: width,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-overlay)',
          overflow: 'hidden',
          animation: 'cmsPop var(--duration) var(--ease-out)',
        }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid var(--border-hairline)' }}>
            {icon && (
              <span style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--sky-tint)', color: 'var(--navy-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined is-filled" style={{ fontSize: 20 }}>{icon}</span>
              </span>
            )}
            <h2 style={{ flex: 1, margin: 0, font: '600 20px/26px var(--font-sans)', color: 'var(--navy-deep)' }}>{title}</h2>
            <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div style={{ padding: 24, fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: '24px', color: 'var(--text-body)' }}>{children}</div>
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-container-low)' }}>{footer}</div>
        )}
      </div>
      <style>{'@keyframes cmsFade{from{opacity:0}to{opacity:1}}@keyframes cmsPop{from{opacity:0;transform:translateY(8px) scale(0.98)}to{opacity:1;transform:none}}'}</style>
    </div>
  );
}
