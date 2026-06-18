'use client';

import React from 'react';

/**
 * CMS Button — navy primary, outline secondary, gold "accent" for
 * high-priority CTAs, ghost for low-emphasis, danger for destructive.
 * No shadow; soft 4px radius; press shrink; gold focus ring via globals.
 * Ported from Docs/Style/CMS Web Design System/components/core/Button.jsx.
 */

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Material Symbols glyph name shown before the label */
  icon?: string;
  /** Material Symbols glyph name shown after the label */
  iconRight?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const SIZES = {
  sm: { padding: '6px 12px', fontSize: 13, height: 32, gap: 6, icon: 16 },
  md: { padding: '10px 18px', fontSize: 14, height: 42, gap: 8, icon: 18 },
  lg: { padding: '14px 24px', fontSize: 16, height: 52, gap: 8, icon: 20 },
} as const;

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: { background: 'var(--action-primary)', color: 'var(--on-primary)' },
  secondary: {
    background: 'transparent',
    color: 'var(--navy-deep)',
    border: '2px solid var(--navy-deep)',
  },
  accent: { background: 'var(--caution-gold)', color: 'var(--navy-deep)' },
  ghost: { background: 'transparent', color: 'var(--navy-deep)' },
  danger: { background: 'var(--error-red)', color: '#fff' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  children,
  style = {},
  ...rest
}: ButtonProps) {
  const s = SIZES[size] ?? SIZES.md;
  const v = VARIANTS[variant] ?? VARIANTS.primary;

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-label)',
    fontSize: s.fontSize,
    fontWeight: 700,
    letterSpacing: '0.01em',
    borderRadius: 'var(--radius)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition:
      'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard), filter var(--duration-fast) var(--ease-standard)',
    whiteSpace: 'nowrap',
  };

  const onDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) e.currentTarget.style.transform = 'scale(0.96)';
  };
  const onUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
  };
  const onEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (variant === 'primary') e.currentTarget.style.background = 'var(--action-primary-hover)';
    else if (variant === 'accent') e.currentTarget.style.filter = 'brightness(0.95)';
    else if (variant === 'secondary' || variant === 'ghost')
      e.currentTarget.style.background = 'var(--sky-tint)';
    else if (variant === 'danger') e.currentTarget.style.filter = 'brightness(0.92)';
  };
  const onLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.filter = 'none';
    e.currentTarget.style.background = String(v.background ?? '');
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={{ ...base, ...v, ...style }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      {...rest}
    >
      {icon && (
        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: s.icon }}>
          {icon}
        </span>
      )}
      {children}
      {iconRight && (
        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: s.icon }}>
          {iconRight}
        </span>
      )}
    </button>
  );
}
