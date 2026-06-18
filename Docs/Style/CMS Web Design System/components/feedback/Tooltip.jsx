import React from 'react';

/**
 * CMS Tooltip — navy bubble on hover/focus. Wraps any trigger element.
 */
export function Tooltip({ label, side = 'top', children }) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  }[side];

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', ...pos, zIndex: 1200, whiteSpace: 'nowrap',
            background: 'var(--navy-900)', color: '#fff',
            fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 600,
            padding: '6px 10px', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-atmospheric)', pointerEvents: 'none',
            animation: 'cmsTip 120ms var(--ease-out)',
          }}
        >
          {label}
        </span>
      )}
      <style>{'@keyframes cmsTip{from{opacity:0}to{opacity:1}}'}</style>
    </span>
  );
}
