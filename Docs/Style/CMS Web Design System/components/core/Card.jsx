import React from 'react';

/**
 * CMS Card — flat surface, 1px hairline border, soft 8px radius.
 * Optional Sky-Tint header strip. Lifts subtly on hover when interactive.
 */
export function Card({ interactive = false, header, footer, padded = true, children, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'box-shadow var(--duration) var(--ease-standard), transform var(--duration) var(--ease-standard), border-color var(--duration) var(--ease-standard)',
        boxShadow: hover ? 'var(--shadow-raised)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        borderColor: hover ? 'var(--navy-deep)' : 'var(--border-hairline)',
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      {...rest}
    >
      {header && (
        <div
          style={{
            background: 'var(--surface-info)',
            borderBottom: '1px solid var(--border-hairline)',
            padding: '14px 24px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--headline-md-size)',
            fontWeight: 600,
            color: 'var(--text-heading)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {header}
        </div>
      )}
      <div style={{ padding: padded ? 'var(--card-padding)' : 0 }}>{children}</div>
      {footer && (
        <div style={{ borderTop: '1px solid var(--border-hairline)', padding: '14px 24px' }}>{footer}</div>
      )}
    </div>
  );
}
