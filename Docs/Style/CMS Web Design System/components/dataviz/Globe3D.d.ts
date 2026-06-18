import * as React from 'react';

/**
 * WebGL (three.js) rotating wireframe globe with glowing data points — a
 * "national reach" hero/dashboard accent. Loads three.js from CDN on demand;
 * falls back to a text notice if WebGL is unavailable. Reduced-motion safe.
 *
 * @startingPoint section="Data Viz" subtitle="three.js rotating data globe" viewport="700x340"
 */
export interface Globe3DProps {
  height?: number;
  /** Number of glowing surface data points. @default 28 */
  points?: number;
  spin?: boolean;
  /** Data-point color. @default gold */
  accent?: string;
  /** Wireframe color. */
  globeColor?: string;
}

export function Globe3D(props: Globe3DProps): JSX.Element;
