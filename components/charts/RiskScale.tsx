'use client';

import { useInView } from '@/lib/use-in-view';
import { DataTable } from './DataTable';
import { AXIS_TEXT, EASE_DRAW } from './chart-style';

/**
 * A1c risk scale (DESIGN-BRIEF §6 / FR-5 maria): one horizontal track with
 * three zones (normal / pre-diabetes / diabetes), labeled bounds, and a
 * navy diamond marker that slides to the patient's value with a flag above.
 */

export interface RiskZone {
  label: string;
  to: number; // upper bound of the zone on the scale
  tone: string; // 'sky' | 'gold' | 'red-container' (seeded values)
}

export interface RiskScaleProps {
  id: string;
  ariaLabel: string;
  min: number;
  max: number;
  zones: RiskZone[];
  marker: number;
  markerLabel: string; // e.g. 'You: 6.1%'
}

const ZONE_FILL: Record<string, string> = {
  sky: 'var(--success-container)',
  gold: 'var(--gold-soft)',
  'red-container': 'var(--error-container)',
};

const ZONE_TEXT: Record<string, string> = {
  sky: 'var(--on-success-container)',
  gold: 'var(--gold-ink)',
  'red-container': 'var(--on-error-container)',
};

export function RiskScale({ id, ariaLabel, min, max, zones, marker, markerLabel }: RiskScaleProps) {
  const { ref, animate, instant } = useInView<SVGSVGElement>(id);
  const w = 640;
  const h = 120;
  const padL = 16;
  const padR = 16;
  const trackY = 56;
  const trackH = 16;
  const innerW = w - padL - padR;

  const xAt = (v: number) => padL + ((v - min) / Math.max(max - min, 1e-9)) * innerW;
  const markerX = xAt(marker);

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
        {/* zones fade in first */}
        {zones.map((z, i) => {
          const from = i === 0 ? min : zones[i - 1].to;
          return (
            <g
              key={z.label}
              style={{
                opacity: animate ? 1 : 0,
                transition: instant ? 'none' : `opacity 300ms ${EASE_DRAW} ${i * 80}ms`,
              }}
            >
              <rect
                x={xAt(from)}
                y={trackY}
                width={xAt(z.to) - xAt(from)}
                height={trackH}
                fill={ZONE_FILL[z.tone] ?? 'var(--surface-raised)'}
                rx={i === 0 || i === zones.length - 1 ? 4 : 0}
              />
              <text
                x={(xAt(from) + xAt(z.to)) / 2}
                y={trackY + trackH + 22}
                textAnchor="middle"
                {...AXIS_TEXT}
                fill={ZONE_TEXT[z.tone] ?? AXIS_TEXT.fill}
                fontWeight={600}
              >
                {z.label}
              </text>
            </g>
          );
        })}

        {/* marker slides from scale start to its value (700ms ease-out) */}
        <g
          style={{
            transform: animate ? `translateX(${markerX}px)` : `translateX(${padL}px)`,
            transition: instant ? 'none' : 'transform 700ms ease-out 350ms',
          }}
        >
          <path
            d={`M0,${trackY - 8} L7,${trackY + trackH / 2} L0,${trackY + trackH + 8} L-7,${trackY + trackH / 2} Z`}
            fill="var(--navy-deep)"
          />
          <g>
            <rect x={-34} y={trackY - 40} width={68} height={24} rx={4} fill="var(--navy-deep)" />
            <text
              x={0}
              y={trackY - 24}
              textAnchor="middle"
              fontFamily="var(--font-label)"
              fontSize={12}
              fontWeight={600}
              fill="var(--white)"
            >
              {markerLabel}
            </text>
          </g>
        </g>
      </svg>
      <DataTable
        caption={ariaLabel}
        columns={['Zone', 'Range']}
        rows={[
          ...zones.map((z, i) => [z.label, `${i === 0 ? min : zones[i - 1].to} – ${z.to}`]),
          ['Your value', String(marker)],
        ]}
      />
    </div>
  );
}
