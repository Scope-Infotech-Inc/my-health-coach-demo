'use client';

import { useInView } from '@/lib/use-in-view';
import { DataTable } from './DataTable';
import { AXIS_TEXT, BAR_VB, EASE_DRAW, GRID_STROKE } from './chart-style';

/**
 * Weekly bar chart (DESIGN-BRIEF §6): navy bars growing from the baseline,
 * "today" bar gold with a gold-ink value label, goal line fading in after
 * the bars. Once per session; reduced motion renders final state.
 */

export interface BarPoint {
  label: string; // e.g. 'Sat'
  value: number;
}

export interface BarChartProps {
  id: string;
  ariaLabel: string;
  points: BarPoint[];
  yMax: number;
  unit?: string;
  /** Index of "today" — rendered gold with its value labeled above. */
  todayIndex?: number;
  goal?: { value: number; label: string };
  tableColumns?: [string, string];
}

export function BarChart({
  id,
  ariaLabel,
  points,
  yMax,
  unit,
  todayIndex,
  goal,
  tableColumns = ['Day', 'Value'],
}: BarChartProps) {
  const { ref, animate, instant } = useInView<SVGSVGElement>(id);
  const { w, h, padL, padR, padT, padB } = BAR_VB;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const n = points.length;
  const slot = innerW / Math.max(n, 1);
  const barW = Math.min(28, slot * 0.5);

  const yAt = (v: number) => padT + innerH - (v / Math.max(yMax, 1e-9)) * innerH;

  return (
    <div>
      <svg
        ref={ref}
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label={ariaLabel}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={padL}
              x2={w - padR}
              y1={yAt(yMax * f)}
              y2={yAt(yMax * f)}
              stroke={GRID_STROKE}
              strokeWidth={1}
            />
            <text x={padL - 8} y={yAt(yMax * f) + 4} textAnchor="end" {...AXIS_TEXT}>
              {Math.round(yMax * f).toLocaleString('en-US')}
            </text>
          </g>
        ))}
        {/* baseline */}
        <line
          x1={padL}
          x2={w - padR}
          y1={padT + innerH}
          y2={padT + innerH}
          stroke="var(--outline-variant)"
          strokeWidth={1}
        />

        {points.map((p, i) => {
          const x = padL + slot * i + (slot - barW) / 2;
          const isToday = i === todayIndex;
          const barH = Math.max(innerH - (yAt(p.value) - padT), 0);
          return (
            <g key={i}>
              <rect
                x={x}
                y={padT + innerH - barH}
                width={barW}
                height={barH}
                rx={3}
                fill={isToday ? 'var(--caution-gold)' : 'var(--navy-deep)'}
                style={{
                  transform: animate ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: `${x + barW / 2}px ${padT + innerH}px`,
                  transition: instant ? 'none' : `transform 600ms ease-out ${i * 60}ms`,
                }}
              />
              {isToday && (
                <text
                  x={x + barW / 2}
                  y={yAt(p.value) - 8}
                  textAnchor="middle"
                  {...AXIS_TEXT}
                  fontWeight={600}
                  fill="var(--gold-ink)"
                  style={{
                    opacity: animate ? 1 : 0,
                    transition: instant ? 'none' : `opacity 300ms ${EASE_DRAW} ${n * 60 + 200}ms`,
                  }}
                >
                  {p.value.toLocaleString('en-US')}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={h - 8}
                textAnchor="middle"
                {...AXIS_TEXT}
                fontWeight={isToday ? 600 : undefined}
                fill={isToday ? 'var(--gold-ink)' : AXIS_TEXT.fill}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* goal line — fades in after bars */}
        {goal && (
          <g
            style={{
              opacity: animate ? 1 : 0,
              transition: instant ? 'none' : `opacity 300ms ${EASE_DRAW} ${n * 60 + 300}ms`,
            }}
          >
            <line
              x1={padL}
              x2={w - padR}
              y1={yAt(goal.value)}
              y2={yAt(goal.value)}
              stroke="var(--caution-gold)"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
            <text
              x={w - padR - 6}
              y={yAt(goal.value) - 6}
              textAnchor="end"
              {...AXIS_TEXT}
              fill="var(--gold-ink)"
            >
              {goal.label}
            </text>
          </g>
        )}
      </svg>
      <DataTable
        caption={ariaLabel}
        columns={tableColumns}
        rows={points.map((p) => [
          p.label,
          `${p.value.toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`,
        ])}
      />
    </div>
  );
}
