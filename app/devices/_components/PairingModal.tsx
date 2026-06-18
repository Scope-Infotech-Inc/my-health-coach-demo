'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Modal, DemoNote } from '@/components/ui';
import { Button, StatusIcon } from '@/components/ds';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { categoryIcon } from '../device-format';
import styles from '../page.module.css';

/**
 * Scripted device-pairing dialog (FR-23, DESIGN-BRIEF §7). Walks a simulated
 * Bluetooth-style sequence — Searching → Found → Confirm — on deterministic
 * timers (~1.6s of "searching" before the device is found; no wall-clock
 * randomness). The searching spinner animates only when motion is allowed;
 * under prefers-reduced-motion it renders a static "searching" status so the
 * sequence still advances without spin. Confirming invokes onConfirm (the
 * page POSTs /api/devices/connect); the dialog shows a brief connecting state
 * until the page closes it after the request resolves.
 */

export interface PairingDevice {
  id: string;
  brand: string;
  model: string;
  category: string;
  metrics: string[];
}

type Phase = 'searching' | 'found' | 'connecting';

// Deterministic step timing — fixed, not Date.now()/random based.
const SEARCH_MS = 1600;

export function PairingModal({
  device,
  open,
  busy,
  onConfirm,
  onClose,
}: {
  device: PairingDevice | null;
  open: boolean;
  busy: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('searching');
  const timer = useRef<number | undefined>(undefined);

  // Reset and run the scripted search whenever the dialog opens for a device.
  useEffect(() => {
    if (!open || !device) return;
    setPhase('searching');
    timer.current = window.setTimeout(() => setPhase('found'), SEARCH_MS);
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current);
    };
  }, [open, device]);

  // Mirror the parent's request state into a "connecting" phase. If the
  // request resolves with a failure (busy clears while still mounted on this
  // device) the parent leaves the dialog open and toasts the error, so fall
  // back to "found" — the Connect action stays available for a retry. On
  // success the parent closes the dialog, so this branch never shows.
  useEffect(() => {
    if (busy) {
      setPhase('connecting');
    } else {
      setPhase((p) => (p === 'connecting' ? 'found' : p));
    }
  }, [busy]);

  if (!device) return null;

  const label = `${device.brand} ${device.model}`;
  const metricsText = device.metrics.map((m) => m.replace(/_/g, ' ')).join(', ');

  const actions =
    phase === 'found' ? (
      <>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" icon="link" onClick={onConfirm} disabled={busy}>
          Connect device
        </Button>
      </>
    ) : (
      <Button variant="ghost" onClick={onClose} disabled={busy}>
        Cancel
      </Button>
    );

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title="Pair a device" actions={actions}>
      {/* Single persistent live region so each scripted phase change is
          announced to screen readers, not just shown visually. */}
      <div aria-live="polite" aria-atomic="true">
        {phase === 'searching' && (
          <div className={styles.pairStep}>
            {reduced ? (
              <span className={styles.pairStatus} aria-hidden="true">
                <span className={`material-symbols-outlined ${styles.glyph}`}>
                  bluetooth_searching
                </span>
              </span>
            ) : (
              <span className={styles.spinner} aria-hidden="true" />
            )}
            <p className={styles.pairHeadline}>Searching for nearby devices</p>
            <p className={styles.pairBody}>
              Looking for {label} over a simulated Bluetooth connection.
            </p>
            <DemoNote>Demo — pairing is simulated. No real device or radio is used.</DemoNote>
          </div>
        )}

        {phase === 'found' && (
          <div className={styles.pairStep}>
            <span className={`${styles.pairStatus} ${styles.found}`} aria-hidden="true">
              <span className={`material-symbols-outlined ${styles.glyph}`}>check</span>
            </span>
            <p className={styles.pairHeadline}>Found {label}</p>
            <div className={styles.pairDevice}>
              <span className={styles.brandBlockSm} aria-hidden="true">
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  {categoryIcon(device.category)}
                </span>
              </span>
              <span className={styles.pairDeviceMeta}>
                <span className={styles.deviceModel}>{device.model}</span>
                <span className={styles.deviceBrand}>{device.brand}</span>
                {metricsText && <span className={styles.syncLine}>Shares {metricsText}</span>}
              </span>
            </div>
            <p className={styles.pairBody}>
              Connecting adds {label} as a data source you can sync and revoke at any time.
            </p>
          </div>
        )}

        {phase === 'connecting' && (
          <div className={styles.pairStep}>
            <span className={styles.pairStatus} aria-hidden="true">
              <StatusIcon status="syncing" size={32} />
            </span>
            <p className={styles.pairHeadline}>Connecting {label}</p>
            <p className={styles.pairBody}>Adding the device and stamping its first sync.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
