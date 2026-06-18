'use client';

import React from 'react';
import styles from './ServiceMap.module.css';

/**
 * Route-local schematic map (DESIGN-BRIEF §6, "Schematic map" row). Purely
 * decorative — aria-hidden — so the numbered result list below is the
 * accessible content. Draws an abstract street grid on a surface-low panel,
 * one sky "river" band, and navy numbered pins at the seeded map.{x,y}
 * coordinates (0–100, scaled into the 640×480 viewBox). The selected pin
 * scales 1.2 and gains a gold ring. No tiles, no images, no external data:
 * geometry constants only, pin positions from the API.
 */

const VIEW_W = 640;
const VIEW_H = 480;
const PAD = 32;

/** Map a seeded 0–100 coordinate into the padded viewBox. */
function scaleX(x: number): number {
  return PAD + (x / 100) * (VIEW_W - PAD * 2);
}
function scaleY(y: number): number {
  return PAD + (y / 100) * (VIEW_H - PAD * 2);
}

// Loose street grid (fixed geometry, not data). Verticals/horizontals as a
// fraction of the inner field, plus two diagonals for a non-gridiron feel.
const V_STREETS = [0.18, 0.4, 0.62, 0.84];
const H_STREETS = [0.22, 0.46, 0.72];

export interface MapPin {
  /** Result number shown in the pin and on the list card. */
  index: number;
  /** Seeded 0–100 coordinate. */
  x: number;
  y: number;
  /** Accessible label is on the list, but keep a name for data-attr/debug. */
  name: string;
}

export function ServiceMap({
  pins,
  selectedIndex,
}: {
  pins: MapPin[];
  selectedIndex: number | null;
}) {
  const innerW = VIEW_W - PAD * 2;
  const innerH = VIEW_H - PAD * 2;

  return (
    <div className={styles.frame} aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={styles.svg}
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        {/* Map field */}
        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} className={styles.field} />

        {/* River band (single sky diagonal ribbon) */}
        <path
          d={`M ${PAD - 20} ${PAD + innerH * 0.58}
              C ${PAD + innerW * 0.3} ${PAD + innerH * 0.4},
                ${PAD + innerW * 0.62} ${PAD + innerH * 0.78},
                ${VIEW_W + 20} ${PAD + innerH * 0.6}`}
          className={styles.river}
        />

        {/* Street strokes — wider arterials, then thinner cross-streets */}
        {V_STREETS.map((f, i) => {
          const x = PAD + f * innerW;
          return (
            <line
              key={`v${i}`}
              x1={x}
              y1={PAD - 12}
              x2={x}
              y2={VIEW_H - PAD + 12}
              className={i % 2 === 0 ? styles.streetMajor : styles.streetMinor}
            />
          );
        })}
        {H_STREETS.map((f, i) => {
          const y = PAD + f * innerH;
          return (
            <line
              key={`h${i}`}
              x1={PAD - 12}
              y1={y}
              x2={VIEW_W - PAD + 12}
              y2={y}
              className={i === 1 ? styles.streetMajor : styles.streetMinor}
            />
          );
        })}

        {/* Numbered pins (drawn selected-last so the gold ring sits on top) */}
        {[...pins]
          .sort((a, b) => (a.index === selectedIndex ? 1 : b.index === selectedIndex ? -1 : 0))
          .map((pin) => {
            const cx = scaleX(pin.x);
            const cy = scaleY(pin.y);
            const selected = pin.index === selectedIndex;
            const r = 18;
            return (
              <g
                key={pin.index}
                transform={`translate(${cx} ${cy}) scale(${selected ? 1.2 : 1})`}
                className={styles.pinGroup}
              >
                {selected && <circle r={r + 6} className={styles.pinRing} />}
                <circle r={r} className={styles.pin} />
                <text className={styles.pinNumber} textAnchor="middle" dy="0.36em">
                  {pin.index}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
}
