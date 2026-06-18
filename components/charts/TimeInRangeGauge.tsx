'use client';

import { useInView } from '@/lib/use-in-view';
import { DataTable } from './DataTable';

/**
 * CGM time-in-range donut (DESIGN-BRIEF §6): r70/stroke20 segments — navy
 * in-range, gold low, red high — growing in sequence; % + label centered.
 */
export function TimeInRangeGauge({
  id,
  ariaLabel,
  inRangePct,
  lowPct,
  highPct,
  target,
}: {
  id: string;
  ariaLabel: string;
  inRangePct: number;
  lowPct: number;
  highPct: number;
  target?: number;
}) {
  const { ref, animate, instant } = useInView<SVGSVGElement>(id);
  const r = 70;
  const c = 2 * Math.PI * r;
  const segments = [
    { pct: inRangePct, color: 'var(--navy-deep)', label: 'In range' },
    { pct: lowPct, color: 'var(--caution-gold)', label: 'Low' },
    { pct: highPct, color: 'var(--error-red)', label: 'High' },
  ];
  let offset = 0;

  return (
    <div>
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        width="100%"
        style={{ maxWidth: 200, display: 'block', margin: '0 auto' }}
        role="img"
        aria-label={ariaLabel}
      >
        <circle
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke="var(--surface-container-low)"
          strokeWidth={20}
        />
        {segments.map((s, i) => {
          const dash = (s.pct / 100) * c;
          const seg = (
            <circle
              key={s.label}
              cx={100}
              cy={100}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={20}
              strokeDasharray={`${animate ? dash : 0} ${c}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 100 100)"
              style={{
                transition: instant ? 'none' : `stroke-dasharray 600ms ease-out ${i * 80}ms`,
              }}
            />
          );
          offset += dash;
          return seg;
        })}
        <text
          x={100}
          y={98}
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize={32}
          fontWeight={700}
          fill="var(--navy-deep)"
        >
          {inRangePct}%
        </text>
        <text
          x={100}
          y={120}
          textAnchor="middle"
          fontFamily="var(--font-label)"
          fontSize={12}
          fill="var(--slate-gray)"
        >
          in range{target ? ` · target >${target}%` : ''}
        </text>
      </svg>
      <DataTable
        caption={ariaLabel}
        columns={['Range', 'Share of time']}
        rows={segments.map((s) => [s.label, `${s.pct}%`])}
      />
    </div>
  );
}
