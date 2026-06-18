import React from 'react';

/**
 * CMS ProgressBar — determinate (animated fill to value) or indeterminate
 * (sliding sweep). Optional label + value readout. Reduced-motion safe.
 */
export function ProgressBar({ value = 0, max = 100, label, showValue = false, indeterminate = false, tone = 'navy', height = 8 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = { navy: 'var(--navy-deep)', gold: 'var(--caution-gold)', success: 'var(--success)' }[tone] || 'var(--navy-deep)';
  const [w, setW] = React.useState(0);
  React.useEffect(() => { const t = setTimeout(() => setW(pct), 60); return () => clearTimeout(t); }, [pct]);

  return (
    <div>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: 'var(--font-label)', fontSize: 13 }}>
          {label && <span style={{ color: 'var(--text-body)', fontWeight: 600 }}>{label}</span>}
          {showValue && !indeterminate && <span style={{ color: 'var(--text-subtle)', fontWeight: 700 }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ width: '100%', height, background: 'var(--surface-container)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', position: 'relative' }}>
        {indeterminate ? (
          <div style={{ position: 'absolute', height: '100%', width: '40%', background: fill, borderRadius: 'var(--radius-pill)', animation: 'cmsIndet 1.3s var(--ease-standard) infinite' }} />
        ) : (
          <div style={{ height: '100%', width: w + '%', background: fill, borderRadius: 'var(--radius-pill)', transition: 'width 0.7s var(--ease-out)' }} />
        )}
      </div>
      <style>{`
        @keyframes cmsIndet{0%{left:-40%}100%{left:100%}}
        @media (prefers-reduced-motion: reduce){div[style*="cmsIndet"]{animation:none;left:0;width:100%}}
      `}</style>
    </div>
  );
}
