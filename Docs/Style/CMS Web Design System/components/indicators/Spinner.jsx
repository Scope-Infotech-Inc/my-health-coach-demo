import React from 'react';

/**
 * CMS Spinner — ring loader. Navy track with a gold sweep, CSS-animated.
 * Respects prefers-reduced-motion (falls back to a static dashed ring).
 */
export function Spinner({ size = 28, thickness = 3, label, color = 'var(--navy-deep)', track = 'var(--surface-container-highest)' }) {
  const id = React.useId ? React.useId() : 'sp';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span
        role="status"
        aria-label={label || 'Loading'}
        style={{
          width: size, height: size, display: 'inline-block', borderRadius: '50%',
          border: `${thickness}px solid ${track}`,
          borderTopColor: color, borderRightColor: color,
          animation: 'cmsSpin 0.8s linear infinite',
        }}
      />
      {label && <span style={{ fontFamily: 'var(--font-label)', fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>}
      <style>{`
        @keyframes cmsSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion: reduce){[role=status]{animation:none !important;border-style:dashed}}
      `}</style>
    </span>
  );
}
