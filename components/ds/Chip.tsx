'use client';

import React from 'react';

/**
 * Pill chip (DESIGN-BRIEF §5). Variants:
 * - program status: Active / Eligible / Suggested / Available / Near you
 * - standards (FHIR R4, US Core, USCDI v3): verified icon, quiet
 * - removable filter chip (recipes active-filter bar)
 */

type ProgramStatus = 'Active' | 'Eligible' | 'Suggested' | 'Available' | 'Near you';

const PROGRAM_STYLES: Record<ProgramStatus, React.CSSProperties> = {
  Active: { background: 'var(--navy-deep)', color: 'var(--white)' },
  Eligible: { background: 'var(--sky-tint)', color: 'var(--navy-deep)' },
  Suggested: {
    background: 'var(--white)',
    color: 'var(--navy-deep)',
    border: '1px solid var(--border-hairline)',
  },
  Available: { background: 'var(--surface-container-low)', color: 'var(--slate-gray)' },
  'Near you': { background: 'var(--gold-soft)', color: 'var(--gold-ink)' },
};

const BASE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 10px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-label)',
  fontSize: 'var(--label-sm-size)',
  lineHeight: 'var(--label-sm-line)',
  fontWeight: 'var(--label-sm-weight)' as React.CSSProperties['fontWeight'],
  whiteSpace: 'nowrap',
};

export function ProgramChip({ status }: { status: string }) {
  const style = PROGRAM_STYLES[status as ProgramStatus] ?? PROGRAM_STYLES.Available;
  return <span style={{ ...BASE, ...style }}>{status}</span>;
}

export function StandardsChip({ label }: { label: string }) {
  return (
    <span
      style={{
        ...BASE,
        background: 'var(--surface-container-low)',
        color: 'var(--slate-gray)',
      }}
    >
      <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 13 }}>
        verified
      </span>
      {label}
    </span>
  );
}

export function FilterChip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span
      style={{
        ...BASE,
        background: 'var(--white)',
        color: 'var(--navy-deep)',
        border: '1px solid var(--outline-variant)',
        paddingRight: onRemove ? 4 : 10,
      }}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label} filter`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            background: 'transparent',
            color: 'var(--slate-gray)',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 14 }}>
            close
          </span>
        </button>
      )}
    </span>
  );
}

/** Generic quiet chip for metadata (codes, mime types, counts). */
export function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        ...BASE,
        background: 'var(--surface-container-low)',
        color: 'var(--on-surface-variant)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {children}
    </span>
  );
}
