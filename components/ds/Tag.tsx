'use client';

import React from 'react';

/**
 * CMS Tag — neutral category/filter chip. Outlined by default; selectable.
 * Ported from Docs/Style/CMS Web Design System/components/core/Tag.jsx.
 * Adaptations for keyboard access (DESIGN-BRIEF.md §8): a clickable Tag
 * gets role="button" + tabIndex + Enter/Space handling; the remove control
 * is a real <button> with an accessible name.
 */

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  /** Highlight as selected (sky tint + navy) */
  selected?: boolean;
  /** Leading Material Symbols glyph name */
  icon?: string;
  /** Shows an × button and fires on click */
  onRemove?: () => void;
  /** Accessible name for the remove button. @default "Remove" */
  removeLabel?: string;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

export function Tag({
  selected = false,
  icon,
  onRemove,
  removeLabel,
  onClick,
  children,
  style = {},
  ...rest
}: TagProps) {
  const clickable = Boolean(onClick);
  const onKeyDown = clickable
    ? (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e);
        }
      }
    : undefined;

  return (
    <span
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
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
        cursor: clickable ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 14 }}>
          {icon}
        </span>
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={
            removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove')
          }
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: 'none',
            background: 'transparent',
            color: 'inherit',
            padding: 0,
            marginLeft: 2,
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 14 }}>
            close
          </span>
        </button>
      )}
    </span>
  );
}
