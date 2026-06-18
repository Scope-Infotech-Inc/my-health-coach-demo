import React from 'react';

/**
 * CMS BarChart — vertical bars that grow from the baseline on mount. Single or
 * grouped series, value labels, gridlines. Pure CSS animation, reduced-motion safe.
 */
export function BarChart({ data = [], series, height = 240, max, unit = '', tone }) {
  // data: [{ label, value }] OR [{ label, values:[..] }] with `series` meta
  const grouped = !!series;
  const palette = ['var(--navy-deep)', 'var(--caution-gold)', 'var(--sky-tint-strong)'];
  const allVals = grouped ? data.flatMap((d) => d.values) : data.map((d) => d.value);
  const hi = max != null ? max : Math.max(1, ...allVals) * 1.1;
  const single = tone === 'gold' ? 'var(--caution-gold)' : 'var(--navy-deep)';

  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setShown(true); return; }
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div style={{ position: 'relative', height, display: 'flex', alignItems: 'flex-end', gap: 0, justifyContent: 'space-around', borderBottom: '1px solid var(--outline)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ borderTop: '1px solid var(--outline-variant)', opacity: 0.5 }} />)}
        </div>
        {data.map((d, di) => (
          <div key={di} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: '100%', width: '100%', justifyContent: 'center' }}>
              {(grouped ? d.values : [d.value]).map((v, vi) => (
                <div key={vi} title={`${v}${unit}`}
                  style={{
                    width: grouped ? `${50 / d.values.length}%` : '46%',
                    maxWidth: 44,
                    height: `${(v / hi) * 100}%`,
                    background: grouped ? palette[vi % palette.length] : single,
                    borderRadius: 'var(--radius) var(--radius) 0 0',
                    transformOrigin: 'bottom',
                    transform: shown ? 'scaleY(1)' : 'scaleY(0)',
                    transition: `transform 0.7s var(--ease-out) ${di * 0.06 + vi * 0.05}s`,
                  }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
        {data.map((d, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-label)', fontSize: 11, color: 'var(--text-subtle)' }}>{d.label}</span>
        ))}
      </div>
      {grouped && (
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
          {series.map((s, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: palette[i % palette.length] }} />{s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
