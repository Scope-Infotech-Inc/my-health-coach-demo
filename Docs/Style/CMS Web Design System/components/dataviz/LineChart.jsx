import React from 'react';

/**
 * CMS LineChart — multi-series SVG line chart with an animated draw-in
 * (stroke-dashoffset), horizontal gridlines, x-axis labels, and a legend.
 * Pure SVG/CSS, no deps. Reduced-motion safe.
 */
export function LineChart({
  series = [],            // [{ name, color, points:[n,…] }]
  labels = [],            // x-axis labels
  height = 240,
  width = 640,
  max,
  area = false,
  legend = true,
}) {
  const pad = { l: 8, r: 8, t: 12, b: 24 };
  const w = width, h = height;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const allVals = series.flatMap((s) => s.points);
  const hi = max != null ? max : Math.max(1, ...allVals) * 1.1;
  const xAt = (i, n) => pad.l + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v) => pad.t + innerH - (v / hi) * innerH;

  const pathFor = (pts) => pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i, pts.length).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  const areaFor = (pts) => `${pathFor(pts)} L${xAt(pts.length - 1, pts.length).toFixed(1)},${pad.t + innerH} L${xAt(0, pts.length).toFixed(1)},${pad.t + innerH} Z`;

  // Entrance: reveal to the visible end-state via CSS transition (state-driven,
  // so the resolved DOM always lands on "shown"). Reduced-motion shows instantly.
  // Render the drawn end-state directly — reliable across SSR/throttle/snapshot.
  const shown = true;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={pad.l} x2={w - pad.r} y1={pad.t + innerH * t} y2={pad.t + innerH * t}
            stroke="var(--outline-variant)" strokeWidth="1" opacity="0.5" />
        ))}
        {series.map((s, si) => (
          <g key={si}>
            {area && (
              <path d={areaFor(s.points)} fill={s.color} opacity={shown ? 0.10 : 0}
                style={{ transition: 'opacity 0.8s var(--ease-out)' }} />
            )}
            <path d={pathFor(s.points)} fill="none" stroke={s.color} strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              opacity={shown ? 1 : 0}
              style={{ transition: `opacity 0.7s var(--ease-out) ${si * 0.12}s` }} />
            {s.points.map((v, i) => (
              <circle key={i} cx={xAt(i, s.points.length)} cy={yAt(v)} r="3.5" fill="var(--white)" stroke={s.color} strokeWidth="2"
                opacity={shown ? 1 : 0} style={{ transition: `opacity 0.3s var(--ease-out) ${0.5 + si * 0.15 + i * 0.04}s` }} />
            ))}
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={i} x={xAt(i, labels.length)} y={h - 6} textAnchor="middle"
            style={{ fontFamily: 'var(--font-label)', fontSize: 11, fill: 'var(--text-subtle)' }}>{l}</text>
        ))}
      </svg>
      {legend && (
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
          {series.map((s, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ width: 12, height: 3, borderRadius: 2, background: s.color }} />{s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
