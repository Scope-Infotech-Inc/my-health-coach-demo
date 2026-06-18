'use client';

import { useInView } from '@/lib/use-in-view';

/**
 * Rewards level ring (FR-22): surface-low track, gold arc sweeping to the
 * points-to-next-level fraction; level name + points centered.
 */
export function LevelRing({
  id,
  ariaLabel,
  levelName,
  points,
  levelMin,
  levelMax,
}: {
  id: string;
  ariaLabel: string;
  levelName: string;
  points: number;
  levelMin: number;
  levelMax: number;
}) {
  const { ref, animate, instant } = useInView<SVGSVGElement>(id);
  const r = 70;
  const c = 2 * Math.PI * r;
  const fraction = Math.min(Math.max((points - levelMin) / Math.max(levelMax - levelMin, 1), 0), 1);
  const dash = fraction * c;

  return (
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
        strokeWidth={16}
      />
      <circle
        cx={100}
        cy={100}
        r={r}
        fill="none"
        stroke="var(--caution-gold)"
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={`${animate ? dash : 0} ${c}`}
        transform="rotate(-90 100 100)"
        style={{ transition: instant ? 'none' : 'stroke-dasharray 800ms ease-out' }}
      />
      <text
        x={100}
        y={92}
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize={26}
        fontWeight={700}
        fill="var(--navy-deep)"
      >
        {levelName}
      </text>
      <text
        x={100}
        y={116}
        textAnchor="middle"
        fontFamily="var(--font-label)"
        fontSize={13}
        fill="var(--slate-gray)"
      >
        {points.toLocaleString('en-US')} pts
      </text>
    </svg>
  );
}
