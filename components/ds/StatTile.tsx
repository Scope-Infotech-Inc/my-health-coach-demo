import React from 'react';
import { CountUp } from '@/components/charts/CountUp';

/**
 * Overview stat tile (DESIGN-BRIEF §5): 12px radius, icon chip, Lexend
 * label, tabular display value with count-up, delta pill below.
 * Delta tones: up-bad → red, down-good/up-good → green, steady → slate.
 */

export interface StatTileProps {
  id: string;
  label: string;
  value: string;
  detail?: string;
  delta?: { text: string; tone: string };
  icon?: string;
  /** gold icon chip for the Rewards tile; sky default */
  iconTone?: 'sky' | 'gold';
}

const DELTA_STYLE: Record<string, { bg: string; fg: string; icon: string }> = {
  'up-bad': { bg: 'var(--error-container)', fg: 'var(--on-error-container)', icon: 'arrow_upward' },
  'down-bad': {
    bg: 'var(--error-container)',
    fg: 'var(--on-error-container)',
    icon: 'arrow_downward',
  },
  'up-good': {
    bg: 'var(--success-container)',
    fg: 'var(--on-success-container)',
    icon: 'arrow_upward',
  },
  'down-good': {
    bg: 'var(--success-container)',
    fg: 'var(--on-success-container)',
    icon: 'arrow_downward',
  },
  steady: { bg: 'var(--surface-container-low)', fg: 'var(--slate-gray)', icon: 'remove' },
};

export function StatTile({
  id,
  label,
  value,
  detail,
  delta,
  icon,
  iconTone = 'sky',
}: StatTileProps) {
  const deltaMeta = delta ? (DELTA_STYLE[delta.tone] ?? DELTA_STYLE.steady) : null;
  // Seed delta text may carry ▲/▼ markers; the icon carries that meaning
  // accessibly, so strip the raw glyphs from the visible text.
  const deltaText = delta?.text.replace(/[▲▼]\s*/g, '') ?? '';

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4) var(--space-5)',
        display: 'grid',
        gap: 'var(--space-2)',
        alignContent: 'start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {icon && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 'var(--radius)',
              background: iconTone === 'gold' ? 'var(--gold-soft)' : 'var(--sky-tint)',
              color: iconTone === 'gold' ? 'var(--gold-ink)' : 'var(--navy-deep)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
              {icon}
            </span>
          </span>
        )}
        <span
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: 'var(--label-sm-size)',
            lineHeight: 'var(--label-sm-line)',
            fontWeight: 'var(--label-sm-weight)' as React.CSSProperties['fontWeight'],
            color: 'var(--text-subtle)',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 34,
          lineHeight: '40px',
          fontWeight: 700,
          color: 'var(--navy-deep)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <CountUp id={id} value={value} />
      </div>
      {(delta || detail) && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}
        >
          {delta && deltaMeta && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                padding: '1px 8px',
                borderRadius: 'var(--radius-pill)',
                background: deltaMeta.bg,
                color: deltaMeta.fg,
                fontFamily: 'var(--font-label)',
                fontSize: 'var(--label-sm-size)',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{ fontSize: 13 }}
              >
                {deltaMeta.icon}
              </span>
              {deltaText}
            </span>
          )}
          {detail && (
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: 'var(--label-sm-size)',
                color: 'var(--text-subtle)',
              }}
            >
              {detail}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
