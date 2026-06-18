import React from 'react';

/**
 * Status indicator (DESIGN-BRIEF §5 / PRD §7): ALWAYS icon + color, never
 * color alone. Maps domain statuses to Material Symbols + token colors.
 */

export type Status =
  | 'in_range'
  | 'success'
  | 'elevated'
  | 'attention'
  | 'above_target'
  | 'prediabetes'
  | 'error'
  | 'missed'
  | 'pending'
  | 'due'
  | 'taken'
  | 'syncing'
  | 'connected';

const MAP: Record<Status, { icon: string; color: string; label: string }> = {
  in_range: { icon: 'check_circle', color: 'var(--success)', label: 'In range' },
  success: { icon: 'check_circle', color: 'var(--success)', label: 'Done' },
  taken: { icon: 'check_circle', color: 'var(--success)', label: 'Taken' },
  connected: { icon: 'check_circle', color: 'var(--success)', label: 'Connected' },
  elevated: { icon: 'warning', color: 'var(--gold-ink)', label: 'Elevated' },
  attention: { icon: 'warning', color: 'var(--gold-ink)', label: 'Needs attention' },
  due: { icon: 'schedule', color: 'var(--gold-ink)', label: 'Due' },
  above_target: { icon: 'error', color: 'var(--error-red)', label: 'Above target' },
  prediabetes: { icon: 'warning', color: 'var(--error-red)', label: 'Pre-diabetes range' },
  error: { icon: 'error', color: 'var(--error-red)', label: 'Problem' },
  missed: { icon: 'cancel', color: 'var(--error-red)', label: 'Missed' },
  pending: { icon: 'schedule', color: 'var(--slate-gray)', label: 'Pending' },
  syncing: { icon: 'sync', color: 'var(--navy-700)', label: 'Syncing' },
};

export function StatusIcon({
  status,
  showLabel = false,
  size = 18,
}: {
  status: Status | string;
  showLabel?: boolean;
  size?: number;
}) {
  const meta = MAP[status as Status] ?? MAP.pending;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: meta.color,
        fontFamily: 'var(--font-label)',
        fontSize: 'var(--label-sm-size)',
        fontWeight: 'var(--label-sm-weight)' as React.CSSProperties['fontWeight'],
      }}
    >
      <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: size }}>
        {meta.icon}
      </span>
      {showLabel ? meta.label : <span className="visually-hidden">{meta.label}</span>}
    </span>
  );
}
