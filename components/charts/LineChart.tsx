'use client';

import { useInView } from '@/lib/use-in-view';
import { DataTable } from './DataTable';
import {
  AXIS_TEXT,
  EASE_DRAW,
  GRID_STROKE,
  LINE_VB,
  SERIES_STROKE,
  flagColor,
  isOutOfRange,
} from './chart-style';

/**
 * Line chart (DESIGN-BRIEF §6): sky target band, gold dashed goal line,
 * navy series with draw-in animation, out-of-range points red + warning
 * glyph, and the gold "today" meridian at the last x. Animates on
 * scroll-into-view once per session; reduced motion renders final state.
 */

export interface LinePoint {
  /** x-axis label, e.g. 'Jun 5' or 'Q1' */
  label: string;
  value: number;
  flag?: string; // 'in_range' | 'elevated' | 'above_target' | 'prediabetes'
}

export interface LineChartProps {
  id: string;
  ariaLabel: string;
  points: LinePoint[];
  yMin: number;
  yMax: number;
  yTicks?: number[];
  unit?: string;
  /** Shaded target zone, e.g. {from:80,to:130,label:'Target 80–130'} */
  band?: { from: number; to: number; label: string };
  /** Dashed gold goal line, e.g. {value:178,label:'Goal 178 lb'} */
  goal?: { value: number; label: string };
  /** Gold meridian marking "today" at the last point. */
  todayMeridian?: boolean;
  /** Render every Nth x label (default 1 = all). */
  xLabelEvery?: number;
  tableColumns?: [string, string];
}

export function LineChart({
  id,
  ariaLabel,
  points,
  yMin,
  yMax,
  yTicks,
  unit,
  band,
  goal,
  todayMeridian = false,
  xLabelEvery = 1,
  tableColumns = ['Date', 'Value'],
}: LineChartProps) {
  const { ref, animate, instant } = useInView<SVGSVGElement>(id);
  const { w, h, padL, padR, padT, padB } = LINE_VB;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const n = points.length;

  const xAt = (i: number) => padL + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v: number) => padT + innerH - ((v - yMin) / Math.max(yMax - yMin, 1e-9)) * innerH;

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(p.value).toFixed(1)}`)
    .join(' ');

  const ticks = yTicks ?? [yMin, yMin + (yMax - yMin) / 2, yMax];
  const t = (dur: string, delay = '0s') => (instant ? 'none' : `${dur} ${EASE_DRAW} ${delay}`);
  const lastX = xAt(n - 1);

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
        {/* gridlines + y labels */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={padL}
              x2={w - padR}
              y1={yAt(tick)}
              y2={yAt(tick)}
              stroke={GRID_STROKE}
              strokeWidth={1}
            />
            <text x={padL - 8} y={yAt(tick) + 4} textAnchor="end" {...AXIS_TEXT}>
              {tick}
              {unit ?? ''}
            </text>
          </g>
        ))}

        {/* target band — fades in before the series (300ms) */}
        {band && (
          <g
            style={{
              opacity: animate ? 1 : 0,
              transition: instant ? 'none' : `opacity 300ms ${EASE_DRAW}`,
            }}
          >
            <rect
              x={padL}
              y={yAt(band.to)}
              width={innerW}
              height={Math.abs(yAt(band.from) - yAt(band.to))}
              fill="var(--sky-tint)"
              opacity={0.6}
            />
            <text
              x={w - padR - 6}
              y={yAt(band.to) + 14}
              textAnchor="end"
              {...AXIS_TEXT}
              fill="var(--navy-700)"
            >
              {band.label}
            </text>
          </g>
        )}

        {/* goal line — gold dashed */}
        {goal && (
          <g
            style={{
              opacity: animate ? 1 : 0,
              transition: instant ? 'none' : `opacity 300ms ${EASE_DRAW} 700ms`,
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

        {/* today meridian — the gold thread of "now" */}
        {todayMeridian && n > 0 && (
          <g
            style={{
              opacity: animate ? 1 : 0,
              transition: instant ? 'none' : `opacity 300ms ${EASE_DRAW} 900ms`,
            }}
          >
            <line
              x1={lastX}
              x2={lastX}
              y1={padT - 6}
              y2={padT + innerH}
              stroke="var(--caution-gold)"
              strokeWidth={2}
            />
            <path
              d={`M${lastX - 5},${padT - 6} L${lastX + 5},${padT - 6} L${lastX},${padT + 1} Z`}
              fill="var(--caution-gold)"
            />
          </g>
        )}

        {/* series stroke — draw left→right (800ms) */}
        <path
          d={path}
          fill="none"
          stroke={SERIES_STROKE}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={animate ? 0 : 1}
          style={{ transition: t('stroke-dashoffset 800ms', '300ms') }}
        />

        {/* points — fade/scale in after the stroke passes (60ms stagger) */}
        {points.map((p, i) => {
          const isLast = i === n - 1;
          const out = isOutOfRange(p.flag);
          const color = flagColor(p.flag);
          const delay = `${300 + 200 + (i / Math.max(n - 1, 1)) * 800}ms`;
          return (
            <g
              key={i}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? 'scale(1)' : 'scale(0.6)',
                transformOrigin: `${xAt(i)}px ${yAt(p.value)}px`,
                transition: instant
                  ? 'none'
                  : `opacity 200ms ${EASE_DRAW} ${delay}, transform 200ms ${EASE_DRAW} ${delay}`,
              }}
            >
              <circle
                cx={xAt(i)}
                cy={yAt(p.value)}
                r={isLast ? 5.5 : 4}
                fill={isLast ? color : 'var(--white)'}
                stroke={color}
                strokeWidth={2}
              />
              {out && (
                <text
                  x={xAt(i)}
                  y={yAt(p.value) - 10}
                  textAnchor="middle"
                  fontFamily="var(--font-material-symbols)"
                  fontSize={13}
                  fill={color}
                  aria-hidden="true"
                >
                  warning
                </text>
              )}
            </g>
          );
        })}

        {/* x labels */}
        {points.map((p, i) =>
          i % xLabelEvery === 0 || i === n - 1 ? (
            <text
              key={i}
              x={xAt(i)}
              y={h - 8}
              textAnchor="middle"
              {...AXIS_TEXT}
              fontWeight={todayMeridian && i === n - 1 ? 600 : undefined}
              fill={todayMeridian && i === n - 1 ? 'var(--gold-ink)' : AXIS_TEXT.fill}
            >
              {p.label}
            </text>
          ) : null
        )}
      </svg>
      <DataTable
        caption={ariaLabel}
        columns={tableColumns}
        rows={points.map((p) => [p.label, `${p.value}${unit ?? ''}`])}
      />
    </div>
  );
}
