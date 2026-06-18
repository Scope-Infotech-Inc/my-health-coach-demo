import React from 'react';

/**
 * CMS Button — navy primary, outline secondary, gold "actionable", ghost.
 * No shadow; soft 4px radius; press shrink; gold focus ring via DS base.
 */
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
}) {
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13, height: 32, gap: 6, icon: 16 },
    md: { padding: '10px 18px', fontSize: 14, height: 42, gap: 8, icon: 18 },
    lg: { padding: '14px 24px', fontSize: 16, height: 52, gap: 8, icon: 20 },
  };
  const s = sizes[size] || sizes.md;

  const base = {
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
    transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard), filter var(--duration-fast) var(--ease-standard)',
    whiteSpace: 'nowrap',
  };

  const variants = {
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

  const v = variants[variant] || variants.primary;

  const onDown = (e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; };
  const onUp = (e) => { e.currentTarget.style.transform = 'scale(1)'; };
  const onEnter = (e) => {
    if (disabled) return;
    if (variant === 'primary') e.currentTarget.style.background = 'var(--action-primary-hover)';
    else if (variant === 'accent') e.currentTarget.style.filter = 'brightness(0.95)';
    else if (variant === 'secondary' || variant === 'ghost') e.currentTarget.style.background = 'var(--sky-tint)';
    else if (variant === 'danger') e.currentTarget.style.filter = 'brightness(0.92)';
  };
  const onLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.filter = 'none';
    e.currentTarget.style.background = v.background;
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
      {icon && <span className="material-symbols-outlined" style={{ fontSize: s.icon }}>{icon}</span>}
      {children}
      {iconRight && <span className="material-symbols-outlined" style={{ fontSize: s.icon }}>{iconRight}</span>}
    </button>
  );
}
