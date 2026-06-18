'use client';

import React from 'react';

/**
 * CMS Alert / callout — color + icon banner for system messages.
 * Left accent rule + tinted background; dark text for AA contrast.
 * Ported from Docs/Style/CMS Web Design System/components/core/Alert.jsx.
 * Adaptation: warning title uses --gold-ink (AA on the gold tint), not
 * --warning, per DESIGN-BRIEF.md §3/§5.
 */

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** @default "info" */
  kind?: 'info' | 'success' | 'warning' | 'error';
  /** Bold title line */
  title?: React.ReactNode;
  /** Override the default status icon (Material Symbols name) */
  icon?: string;
  /** Show a dismiss button and handle the click */
  onClose?: () => void;
}

const KINDS: Record<
  NonNullable<AlertProps['kind']>,
  { bg: string; rule: string; fg: string; icon: string }
> = {
  info: {
    bg: 'var(--sky-tint)',
    rule: 'var(--navy-deep)',
    fg: 'var(--navy-deep)',
    icon: 'info',
  },
  success: {
    bg: 'var(--success-container)',
    rule: 'var(--success)',
    fg: 'var(--on-success-container)',
    icon: 'check_circle',
  },
  warning: {
    bg: 'rgba(253,184,30,0.18)',
    rule: 'var(--caution-gold)',
    fg: 'var(--gold-ink)',
    icon: 'warning',
  },
  error: {
    bg: 'var(--error-container)',
    rule: 'var(--error-red)',
    fg: 'var(--on-error-container)',
    icon: 'report',
  },
};

export function Alert({
  kind = 'info',
  title,
  icon,
  onClose,
  children,
  style = {},
  ...rest
}: AlertProps) {
  const k = KINDS[kind] ?? KINDS.info;
  const glyph = icon || k.icon;

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
      <span
        className="material-symbols-outlined is-filled"
        aria-hidden="true"
        style={{ fontSize: 22, color: k.rule, flexShrink: 0 }}
      >
        {glyph}
      </span>
      <div style={{ flex: 1 }}>
        {title && (
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              fontWeight: 700,
              color: k.fg,
              marginBottom: children ? 4 : 0,
            }}
          >
            {title}
          </div>
        )}
        {children && (
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              lineHeight: '20px',
              color: 'var(--on-surface-variant)',
            }}
          >
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: k.fg,
            padding: 0,
            height: 22,
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 20 }}>
            close
          </span>
        </button>
      )}
    </div>
  );
}
