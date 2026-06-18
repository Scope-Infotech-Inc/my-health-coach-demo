'use client';

import React, { useMemo, useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { useApi, postApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { syncRelativeLabel } from '@/lib/demo-clock';
import { PageHeader, PlainWords, EmptyState, DemoNote } from '@/components/ui';
import { Card, Button, StatusIcon } from '@/components/ds';
import { PairingModal, type PairingDevice } from './_components/PairingModal';
import { categoryIcon, categoryLabel, metricLabel } from './device-format';
import styles from './page.module.css';

/**
 * /devices — FR-23 (DESIGN-BRIEF §7). Connected devices (card each: brand
 * initials, model, metric chips, last-sync label, Sync / Disconnect) plus an
 * "available to connect" grid grouped by category. Pairing runs through the
 * scripted PairingModal (Searching → Found → Confirm) and POSTs
 * /api/devices/connect; disconnect POSTs /api/devices/disconnect. All values
 * come from /api/patients/{id}/devices; nothing is hardcoded. After any
 * mutation we refreshData() so every view (Data & Consent sources, Trends
 * device-gated cards) revalidates, and toast the result.
 */

interface ConnectedDevice {
  id: string;
  brand: string;
  model: string;
  category: string;
  metrics: string[];
  lastSyncAt: string | null;
}

interface AvailableDevice {
  id: string;
  brand: string;
  model: string;
  category: string;
  metrics: string[];
}

interface DevicesResponse {
  connected: ConnectedDevice[];
  available: AvailableDevice[];
}

interface ConnectResult {
  connected: boolean;
  device: { brand: string; model: string };
  badgeAwarded?: { name: string };
}

export default function DevicesPage() {
  const { personaId, refreshData } = usePersona();
  const { pushToast } = useToast();
  const { data, loading, error } = useApi<DevicesResponse>(`/api/patients/${personaId}/devices`);

  // Per-device pending flags so only the acted-on card's buttons disable.
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pairing, setPairing] = useState<PairingDevice | null>(null);
  const [pairBusy, setPairBusy] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, AvailableDevice[]>();
    for (const d of data?.available ?? []) {
      const list = map.get(d.category) ?? [];
      list.push(d);
      map.set(d.category, list);
    }
    return [...map.entries()];
  }, [data]);

  async function handleSync(device: ConnectedDevice) {
    setPendingId(device.id);
    try {
      // Re-running connect is idempotent and re-stamps this device's last
      // sync to the demo "now" — a per-device refresh without touching others.
      await postApi('/api/devices/connect', { patientId: personaId, deviceId: device.id });
      refreshData();
      pushToast({
        tone: 'success',
        icon: 'sync',
        message: `${device.brand} ${device.model} synced.`,
      });
    } catch {
      pushToast({ icon: 'error', message: 'Sync could not complete. Try again.' });
    } finally {
      setPendingId(null);
    }
  }

  async function handleDisconnect(device: ConnectedDevice) {
    setPendingId(device.id);
    try {
      await postApi('/api/devices/disconnect', { patientId: personaId, deviceId: device.id });
      refreshData();
      pushToast({
        icon: 'link_off',
        message: `${device.brand} ${device.model} disconnected.`,
      });
    } catch {
      pushToast({ icon: 'error', message: 'Could not disconnect. Try again.' });
    } finally {
      setPendingId(null);
    }
  }

  function openPairing(device: AvailableDevice) {
    setPairBusy(false);
    setPairing(device);
  }

  async function confirmPairing() {
    if (!pairing) return;
    setPairBusy(true);
    try {
      const res = await postApi<ConnectResult>('/api/devices/connect', {
        patientId: personaId,
        deviceId: pairing.id,
      });
      refreshData();
      pushToast({
        tone: 'success',
        icon: 'check_circle',
        message: `${res.device.brand} ${res.device.model} connected.`,
      });
      if (res.badgeAwarded) {
        pushToast({
          tone: 'attention',
          icon: 'workspace_premium',
          message: `Badge earned: ${res.badgeAwarded.name}.`,
        });
      }
      setPairing(null);
    } catch {
      pushToast({ icon: 'error', message: 'Pairing could not complete. Try again.' });
    } finally {
      setPairBusy(false);
    }
  }

  const connected = data?.connected ?? [];
  const hasAvailable = grouped.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="My account"
        title="Devices"
        lede="Connect the trackers, scales, and monitors you already use. Their readings flow into your trends, and you can sync or disconnect any device at any time."
      />

      {error && (
        <EmptyState
          icon="error"
          message="Your devices could not be loaded. Reconnect to see them."
          actionLabel="Try again"
          onAction={refreshData}
        />
      )}

      {!error && loading && !data && (
        <div className={styles.skeletonStack} aria-busy="true" aria-label="Loading devices">
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      )}

      {!error && data && (
        <div className={styles.page}>
          {/* ---- Connected ---- */}
          <section className={styles.section} aria-labelledby="connected-heading">
            <h2 id="connected-heading" className={styles.sectionTitle}>
              Connected devices
            </h2>
            <PlainWords>
              {connected.length > 0 ? (
                <>
                  You have{' '}
                  <strong>
                    {connected.length} device{connected.length === 1 ? '' : 's'}
                  </strong>{' '}
                  sharing readings with your record.
                </>
              ) : (
                <>
                  You have <strong>no devices connected</strong> yet. Pair one below to add its
                  readings.
                </>
              )}
            </PlainWords>

            {connected.length === 0 ? (
              <EmptyState
                icon="devices"
                message="No devices are connected yet. Pairing one adds its readings to your trends."
              />
            ) : (
              <div className={styles.connectedList}>
                {connected.map((device) => {
                  const busy = pendingId === device.id;
                  const continuous = device.lastSyncAt === null;
                  return (
                    <Card key={device.id}>
                      <div className={styles.deviceRow}>
                        <span className={styles.brandBlock} aria-hidden="true">
                          <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                            {categoryIcon(device.category)}
                          </span>
                        </span>
                        <div className={styles.deviceMeta}>
                          <span className={styles.deviceModel}>{device.model}</span>
                          <span className={styles.deviceBrand}>
                            {device.brand} · {categoryLabel(device.category)}
                          </span>
                          {device.metrics.length > 0 && (
                            <div className={styles.chips}>
                              {device.metrics.map((m) => (
                                <span key={m} className={styles.metricChip}>
                                  {metricLabel(m)}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className={styles.syncLine}>
                            {continuous ? (
                              <>
                                <StatusIcon status="connected" size={14} />
                                Continuous — streaming readings
                              </>
                            ) : (
                              <>
                                <span
                                  className={`material-symbols-outlined ${styles.syncIcon}`}
                                  aria-hidden="true"
                                >
                                  sync
                                </span>
                                Last sync {syncRelativeLabel(device.lastSyncAt)}
                              </>
                            )}
                          </span>
                        </div>
                        <div className={styles.deviceActions}>
                          {/* Continuous sources stream their readings, so there
                              is no manual sync to run; only timestamped devices
                              offer "Sync now". Disconnect is always available. */}
                          {!continuous && (
                            <Button
                              variant="secondary"
                              size="sm"
                              icon="sync"
                              onClick={() => handleSync(device)}
                              disabled={busy}
                            >
                              Sync now
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            icon="link_off"
                            onClick={() => handleDisconnect(device)}
                            disabled={busy}
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* ---- Available to connect ---- */}
          <section className={styles.section} aria-labelledby="available-heading">
            <h2 id="available-heading" className={styles.sectionTitle}>
              Available to connect
            </h2>
            <PlainWords tone="muted">
              {hasAvailable ? (
                <>Pick a device to start a simulated pairing. Nothing leaves this demo.</>
              ) : (
                <>Every device in the catalog is already connected to your record.</>
              )}
            </PlainWords>

            {!hasAvailable ? (
              <EmptyState
                icon="check_circle"
                message="Every device in the catalog is already connected."
              />
            ) : (
              grouped.map(([category, devices]) => (
                <div key={category} className={styles.categoryGroup}>
                  <h3 className={styles.categoryLabel}>{categoryLabel(category)}</h3>
                  <div className={styles.availableGrid}>
                    {devices.map((device) => (
                      <Card key={device.id}>
                        <div className={styles.availableCard}>
                          <span className={styles.brandBlockSm} aria-hidden="true">
                            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                              {categoryIcon(device.category)}
                            </span>
                          </span>
                          <div className={styles.availableBody}>
                            <span className={styles.deviceModel}>{device.model}</span>
                            <span className={styles.deviceBrand}>{device.brand}</span>
                            {device.metrics.length > 0 && (
                              <div className={styles.chips}>
                                {device.metrics.map((m) => (
                                  <span key={m} className={styles.metricChip}>
                                    {metricLabel(m)}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className={styles.pairAction}>
                              <Button
                                variant="primary"
                                size="sm"
                                icon="add_link"
                                onClick={() => openPairing(device)}
                              >
                                Pair device
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}

            <DemoNote>
              Demo — devices, pairing, and sync are simulated. No real Bluetooth, account, or health
              data is involved.
            </DemoNote>
          </section>
        </div>
      )}

      <PairingModal
        device={pairing}
        open={pairing !== null}
        busy={pairBusy}
        onConfirm={confirmPairing}
        onClose={() => {
          if (!pairBusy) setPairing(null);
        }}
      />
    </>
  );
}
