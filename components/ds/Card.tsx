'use client';

import React from 'react';

/**
 * CMS Card — flat surface, 1px hairline border, soft 8px radius.
 * Optional Sky-Tint header strip separates metadata from body.
 * Lifts subtly on hover when `interactive`.
 * Ported from Docs/Style/CMS Web Design System/components/core/Card.jsx.
 */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enables hover lift + navy border (for clickable cards) */
  interactive?: boolean;
  /** Header content rendered in a Sky-Tint strip */
  header?: React.ReactNode;
  /** Footer content rendered above a top divider */
  footer?: React.ReactNode;
  /** Pad the body (24px). Set false for edge-to-edge content like tables. @default true */
  padded?: boolean;
}

export function Card({
  interactive = false,
  header,
  footer,
  padded = true,
  children,
  style = {},
  ...rest
}: CardProps) {
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
        transition:
          'box-shadow var(--duration) var(--ease-standard), transform var(--duration) var(--ease-standard), border-color var(--duration) var(--ease-standard)',
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
        <div
          style={{
            borderTop: '1px solid var(--border-hairline)',
            padding: '14px 24px',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
