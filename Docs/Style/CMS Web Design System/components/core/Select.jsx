import React from 'react';

/**
 * CMS Select — labeled native select styled to match Input.
 */
export function Select({ label, hint, required = false, id, children, style = {}, ...rest }) {
  const selId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label
          htmlFor={selId}
          style={{ fontFamily: 'var(--font-label)', fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--error-red)', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={selId}
          style={{
            appearance: 'none',
            width: '100%',
            background: 'var(--white)',
            border: '1px solid var(--border-input)',
            borderRadius: 'var(--radius)',
            padding: '10px 40px 10px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--on-surface)',
            cursor: 'pointer',
          }}
          {...rest}
        >
          {children}
        </select>
        <span
          className="material-symbols-outlined"
          style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: 'var(--text-subtle)', fontSize: 22 }}
        >
          expand_more
        </span>
      </div>
      {hint && (
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 500, color: 'var(--text-subtle)' }}>{hint}</span>
      )}
    </div>
  );
}
