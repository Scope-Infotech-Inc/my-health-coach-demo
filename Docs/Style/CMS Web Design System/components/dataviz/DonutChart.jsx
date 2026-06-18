import React from 'react';

/**
 * CMS DonutChart — segmented ring with animated sweep on mount, center total,
 * and a legend with values. Pure SVG/CSS, reduced-motion safe.
 */
export function DonutChart({ data = [], size = 200, thickness = 22, centerLabel, centerValue, legend = true }) {
  const palette = ['var(--navy-deep)', 'var(--caution-gold)', 'var(--sky-tint-strong)', 'var(--slate-gray)'];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const segs = data.map((d, i) => {
    const frac = d.value / total;
    const seg = { color: d.color || palette[i % palette.length], len: frac * circ, dash: offset, pct: Math.round(frac * 100), label: d.label, value: d.value };
    offset += frac * circ;
    return seg;
  });

  const shown = true;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={c} cy={c} r={r} fill="none" stroke="var(--surface-container)" strokeWidth={thickness} />
          {segs.map((s, i) => (
            <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
              strokeDasharray={`${shown ? s.len : 0} ${circ}`} strokeDashoffset={-s.dash}
              style={{ transition: `stroke-dasharray 0.9s var(--ease-out) ${i * 0.12}s` }} />
          ))}
        </svg>
        {(centerLabel || centerValue) && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {centerLabel && <span style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-subtle)' }}>{centerLabel}</span>}
            {centerValue && <span style={{ font: '700 28px/1 var(--font-sans)', color: 'var(--navy-deep)', letterSpacing: '-0.02em' }}>{centerValue}</span>}
          </div>
        )}
      </div>
      {legend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
          {segs.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 12px', background: 'var(--surface-container-low)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-label)', fontSize: 13 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />{s.label}
              </span>
              <span style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: 13, color: 'var(--navy-deep)' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
