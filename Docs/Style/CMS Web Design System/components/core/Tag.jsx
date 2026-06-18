import React from 'react';

/**
 * CMS Tag — neutral category/filter chip. Outlined by default; selectable.
 */
export function Tag({ selected = false, icon, onRemove, children, style = {}, ...rest }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border-hairline)',
        background: selected ? 'var(--sky-tint)' : 'var(--surface-container)',
        color: selected ? 'var(--navy-deep)' : 'var(--on-surface-variant)',
        fontFamily: 'var(--font-label)',
        fontSize: 12,
        fontWeight: 600,
        cursor: rest.onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{icon}</span>}
      {children}
      {onRemove && (
        <span
          className="material-symbols-outlined"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ fontSize: 14, cursor: 'pointer', marginLeft: 2 }}
        >
          close
        </span>
      )}
    </span>
  );
}
