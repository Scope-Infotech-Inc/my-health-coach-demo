import React from 'react';
import styles from './MockQrCode.module.css';

/**
 * Route-local deterministic mock-QR SVG (DESIGN-BRIEF §7 /share). The grid is
 * derived purely from the share-token string — no Math.random, no wall clock —
 * so the same token always renders the same pattern. This encodes nothing
 * real; it is a visual stand-in for a code that would carry a mock share token.
 *
 * The module count and per-cell on/off bits come from an FNV-1a-style rolling
 * hash seeded by the token characters, mixed with each cell's (row, col)
 * position. Finder squares (the three corner eyes a real QR has) are drawn
 * structurally so the shape reads as a QR at a glance while staying obviously
 * schematic. Marked aria-hidden — the caption and the surrounding list carry
 * the accessible meaning.
 */

const MODULES = 25; // grid is MODULES x MODULES light/dark cells
const QUIET = 2; // quiet-zone border, in module units
const CELL = 8; // px per module in the viewBox
const FINDER = 7; // finder pattern is 7x7 modules

/** FNV-1a 32-bit hash of a string → unsigned int. */
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Whether a cell falls inside one of the three finder-pattern eyes. */
function isFinderZone(row: number, col: number): boolean {
  const inBlock = (r0: number, c0: number) =>
    row >= r0 && row < r0 + FINDER && col >= c0 && col < c0 + FINDER;
  return (
    inBlock(0, 0) || // top-left
    inBlock(0, MODULES - FINDER) || // top-right
    inBlock(MODULES - FINDER, 0) // bottom-left
  );
}

/**
 * A finder eye is dark on its outer ring and inner 3x3 core, light between —
 * the same structure every real QR uses. Coordinates are relative to the eye's
 * own 7x7 block.
 */
function isFinderDark(localRow: number, localCol: number): boolean {
  const onOuter =
    localRow === 0 || localRow === FINDER - 1 || localCol === 0 || localCol === FINDER - 1;
  const inCore = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;
  return onOuter || inCore;
}

function finderLocal(row: number, col: number): { r: number; c: number } | null {
  if (row < FINDER && col < FINDER) return { r: row, c: col };
  if (row < FINDER && col >= MODULES - FINDER) return { r: row, c: col - (MODULES - FINDER) };
  if (row >= MODULES - FINDER && col < FINDER) return { r: row - (MODULES - FINDER), c: col };
  return null;
}

export function MockQrCode({ token, size = 184 }: { token: string; size?: number }) {
  const seed = hashString(token);
  const span = MODULES + QUIET * 2;
  const dim = span * CELL;

  const cells: React.ReactElement[] = [];
  for (let row = 0; row < MODULES; row++) {
    for (let col = 0; col < MODULES; col++) {
      let dark: boolean;
      if (isFinderZone(row, col)) {
        const local = finderLocal(row, col);
        dark = local ? isFinderDark(local.r, local.c) : false;
      } else {
        // Mix the seed with this cell's position; take one bit of the hash.
        const mixed = hashString(`${seed}:${row}:${col}`);
        dark = (mixed & 1) === 1;
      }
      if (!dark) continue;
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={(QUIET + col) * CELL}
          y={(QUIET + row) * CELL}
          width={CELL}
          height={CELL}
        />
      );
    }
  }

  return (
    <svg
      className={styles.qr}
      viewBox={`0 0 ${dim} ${dim}`}
      width={size}
      height={size}
      role="img"
      aria-label="Schematic stand-in for a check-in code. It encodes a mock token only and carries no real health data."
    >
      <rect className={styles.quiet} x={0} y={0} width={dim} height={dim} />
      <g className={styles.modules}>{cells}</g>
    </svg>
  );
}
