import React from 'react';

/**
 * CMS Gauge — radial arc meter (270° sweep). Animated arc fill + value
 * count-up on mount. Navy track, configurable accent. Reduced-motion safe.
 */
export function Gauge({ value = 0, max = 100, size = 160, label, unit = '%', tone = 'navy', thickness = 12 }) {
  const accent = { navy: 'var(--navy-deep)', gold: 'var(--caution-gold)', success: 'var(--success)' }[tone] || 'var(--navy-deep)';
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const sweep = 270;             // degrees of visible arc
  const circ = 2 * Math.PI * r;
  const arcLen = (sweep / 360) * circ;
  const pct = Math.max(0, Math.min(1, value / max));

  const [disp, setDisp] = React.useState(value);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setDisp(value); return; }
    let raf, start;
    const dur = 900;
    const step = (t) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisp(value * eased);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const dispPct = Math.max(0, Math.min(1, disp / max));
  // rotate so the 270° arc is centered at the bottom gap
  const rot = 135;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: `rotate(${rot}deg)` }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--surface-container-highest)" strokeWidth={thickness}
            strokeDasharray={`${arcLen} ${circ}`} strokeLinecap="round" />
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={accent} strokeWidth={thickness}
            strokeDasharray={`${arcLen * dispPct} ${circ}`} strokeLinecap="round"
            style={{ transition: 'none' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ font: '700 ' + Math.round(size * 0.2) + 'px/1 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--navy-deep)' }}>
            {Number.isInteger(value) ? Math.round(disp) : disp.toFixed(1)}<span style={{ fontSize: '0.5em', color: 'var(--text-muted)' }}>{unit}</span>
          </span>
        </div>
      </div>
      {label && <span style={{ fontFamily: 'var(--font-label)', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>}
    </div>
  );
}
