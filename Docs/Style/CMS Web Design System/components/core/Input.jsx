import React from 'react';

/**
 * CMS text Input — always-visible Lexend label (no floating labels), 1px
 * slate border thickening to 2px navy on focus, error state in CMS red.
 */
export function Input({
  label,
  hint,
  error,
  icon,
  required = false,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `inp-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const borderColor = error ? 'var(--error-red)' : focus ? 'var(--navy-deep)' : 'var(--border-input)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--on-surface)',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--error-red)', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--white)',
          border: `${focus || error ? 2 : 1}px solid ${borderColor}`,
          borderRadius: 'var(--radius)',
          padding: focus || error ? '9px 11px' : '10px 12px',
          transition: 'border-color var(--duration-fast) var(--ease-standard)',
        }}
      >
        {icon && <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--text-subtle)' }}>{icon}</span>}
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--on-surface)',
            minWidth: 0,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: 12,
            fontWeight: 500,
            color: error ? 'var(--error-red)' : 'var(--text-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {error && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span>}
          {error || hint}
        </span>
      )}
    </div>
  );
}
