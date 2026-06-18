import React from 'react';

/**
 * CMS Skeleton — shimmer loading placeholder. Use `text`, `block`, or `circle`
 * variants while content loads. Reduced-motion safe (static fill).
 */
export function Skeleton({ variant = 'text', width, height, lines = 1, radius }) {
  const base = {
    background: 'linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 37%, var(--surface-container) 63%)',
    backgroundSize: '400% 100%',
    animation: 'cmsShimmer 1.4s ease infinite',
    borderRadius: radius != null ? radius : 'var(--radius)',
  };
  const css = (
    <style>{`
      @keyframes cmsShimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
      @media (prefers-reduced-motion: reduce){.cms-skel{animation:none !important}}
    `}</style>
  );

  if (variant === 'circle') {
    const d = width || height || 40;
    return <span className="cms-skel" style={{ ...base, display: 'inline-block', width: d, height: d, borderRadius: '50%' }}>{css}</span>;
  }
  if (variant === 'block') {
    return <span className="cms-skel" style={{ ...base, display: 'block', width: width || '100%', height: height || 120, borderRadius: radius != null ? radius : 'var(--radius-lg)' }}>{css}</span>;
  }
  // text — N lines
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} className="cms-skel" style={{ ...base, display: 'block', height: height || 12, width: i === lines - 1 && lines > 1 ? '70%' : (width || '100%') }} />
      ))}
      {css}
    </span>
  );
}
