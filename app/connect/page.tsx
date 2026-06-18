'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHeader, DemoNote, EmptyState, PlainWords } from '@/components/ui';
import { Button, Card, Avatar, StatusIcon } from '@/components/ds';
import { usePersona } from '@/lib/persona-context';
import { useApi, postApi } from '@/lib/use-api';
import { useViewport } from '@/lib/use-viewport';
import { useToast } from '@/components/toast/Toaster';
import { formatMediumDate, fictionWeekday } from '@/lib/demo-clock';
import styles from './connect.module.css';

/* ---- Response shapes (from app/api route headers) -------------------------
   GET /api/patients/{id}/threads
     { threads[]{ id, subject, careTeam{name,role,avatar,avatarStyle},
                  messages[]{ sender, body, attachmentKind?, sentLabel } } }
   POST /api/threads/{tid}/message  body { body?, attachmentKind?, topic? }
     -> { messages: [...] }   (provider reply appended only when topic is in
                               the seeded reply bank: a1c|medication|bp|plan|general)
   GET /api/patients/{id}/appointments
     { slots[]{ id, careTeam{name,role}|null, slotDatetime, taken } }
   POST /api/patients/{id}/appointments  body { slotId }
     -> { confirmed: true, slot: {...} }
   GET /api/patients/{id}/consent -> { ..., revoked }
--------------------------------------------------------------------------- */

type Sender = 'patient' | 'provider';

interface ThreadMessage {
  sender: Sender;
  body: string;
  attachmentKind?: string;
  sentLabel: string;
}

interface CareTeamRef {
  name: string;
  role: string;
  avatar: string;
  avatarStyle: string;
}

interface Thread {
  id: number;
  subject: string;
  careTeam: CareTeamRef;
  messages: ThreadMessage[];
}

interface ThreadsResponse {
  threads: Thread[];
}

interface AppointmentSlot {
  id: number;
  careTeam: { name: string; role: string } | null;
  slotDatetime: string;
  taken: boolean;
}

interface AppointmentsResponse {
  slots: AppointmentSlot[];
}

interface ConsentResponse {
  revoked: boolean;
}

interface MessageResponse {
  messages: ThreadMessage[];
}

interface ConfirmResponse {
  confirmed: boolean;
  slot: AppointmentSlot;
}

/** Guidance request templates — each maps a plain-language patient message to
 *  one of the seeded reply topics, so the simulated care-team answer is keyed
 *  off real data, never hardcoded inline. Original copy; sentence case. */
const GUIDANCE_TEMPLATES: { topic: string; label: string; icon: string; body: string }[] = [
  {
    topic: 'a1c',
    label: 'About my A1c',
    icon: 'science',
    body: 'I saw my latest A1c result and wanted to check whether I should change anything before my visit.',
  },
  {
    topic: 'medication',
    label: 'About my medication',
    icon: 'medication',
    body: 'I have a question about one of my medications and whether my dose is still right for me.',
  },
  {
    topic: 'bp',
    label: 'About my blood pressure',
    icon: 'monitor_heart',
    body: 'My blood pressure readings have been a little higher than usual. Could you take a look?',
  },
  {
    topic: 'plan',
    label: 'About my care plan',
    icon: 'checklist',
    body: 'I would like to set a couple of realistic goals for the next few weeks. Can we go over my plan?',
  },
  {
    topic: 'general',
    label: 'Something else',
    icon: 'forum',
    body: 'I have a general question and would like someone on the care team to follow up when they can.',
  },
];

const SNAPSHOT_KIND = 'data_snapshot:labs';

/** Turn an attachmentKind token ("data_snapshot:labs") into a readable tile. */
function attachmentMeta(kind: string): { title: string; sub: string; icon: string } {
  const scope = kind.includes(':') ? kind.slice(kind.indexOf(':') + 1) : kind;
  const pretty = scope.charAt(0).toUpperCase() + scope.slice(1);
  return {
    title: `${pretty} snapshot`,
    sub: 'Shared from your record',
    icon: 'description',
  };
}

const AVATAR_TONES = ['navy', 'gold', 'sky', 'slate'] as const;
type AvatarTone = (typeof AVATAR_TONES)[number];
function toAvatarTone(style: string): AvatarTone {
  return (AVATAR_TONES as readonly string[]).includes(style) ? (style as AvatarTone) : 'navy';
}

/** Deterministic "Wed, Jun 18 · 10:30 AM" from an ISO local datetime. Parses
 *  the time-of-day straight off the string (no wall-clock Date) so the label
 *  is identical on every run. */
function formatSlot(iso: string): { day: string; time: string } {
  const [datePart, timePart = '00:00'] = iso.split('T');
  const [h24, m = 0] = timePart.split(':').map(Number);
  const meridiem = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const time = `${h12}:${String(m).padStart(2, '0')} ${meridiem}`;
  return {
    day: `${fictionWeekday(datePart, true)}, ${formatMediumDate(datePart)}`,
    time,
  };
}

export default function ConnectPage() {
  const { personaId, refreshData } = usePersona();
  const { pushToast } = useToast();
  const viewport = useViewport();

  const threadsApi = useApi<ThreadsResponse>(`/api/patients/${personaId}/threads`);
  const apptApi = useApi<AppointmentsResponse>(`/api/patients/${personaId}/appointments`);
  const consentApi = useApi<ConsentResponse>(`/api/patients/${personaId}/consent`);

  const threads = useMemo(() => threadsApi.data?.threads ?? [], [threadsApi.data]);

  // Selected thread (controls the conversation pane / mobile drill-in).
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Optimistic local view of the selected thread's messages so a send shows
  // immediately and the provider reply slots in when the POST resolves.
  const [localMessages, setLocalMessages] = useState<ThreadMessage[] | null>(null);

  const [draft, setDraft] = useState('');
  const [attachSnapshot, setAttachSnapshot] = useState(false);
  const [sending, setSending] = useState(false);
  const [providerReplying, setProviderReplying] = useState(false);

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState<AppointmentSlot | null>(null);

  // Default selection: first thread on desktop; none on mobile (show the list).
  useEffect(() => {
    if (viewport === undefined) return;
    if (viewport === 'desktop' && selectedId === null && threads.length > 0) {
      setSelectedId(threads[0].id);
    }
  }, [viewport, threads, selectedId]);

  // When the active thread changes, reset the composer's local view.
  useEffect(() => {
    setLocalMessages(null);
    setDraft('');
    setAttachSnapshot(false);
    setProviderReplying(false);
  }, [selectedId, personaId]);

  // Reset persona-scoped flows on persona swap.
  useEffect(() => {
    setSelectedId(null);
    setSelectedSlotId(null);
    setConfirmedSlot(null);
  }, [personaId]);

  const loading = threadsApi.loading && threads.length === 0;
  const revoked = consentApi.data?.revoked === true;

  const selectedThread = threads.find((t) => t.id === selectedId) ?? null;
  const messages = localMessages ?? selectedThread?.messages ?? [];

  async function send(payload: { body?: string; topic?: string; attachmentKind?: string }) {
    if (!selectedThread || sending) return;
    setSending(true);
    if (payload.topic) setProviderReplying(true);
    try {
      const res = await postApi<MessageResponse>(
        `/api/threads/${selectedThread.id}/message`,
        payload
      );
      setLocalMessages(res.messages);
      setDraft('');
      setAttachSnapshot(false);
      // Persist into shared state so the thread list preview stays current.
      refreshData();
      if (payload.attachmentKind) {
        pushToast({
          tone: 'success',
          icon: 'verified_user',
          message: 'Snapshot shared. The share is recorded in your access log.',
        });
      }
    } catch (err) {
      pushToast({
        tone: 'attention',
        icon: 'error',
        message: err instanceof Error ? err.message : 'Message could not be sent.',
      });
    } finally {
      setSending(false);
      setProviderReplying(false);
    }
  }

  function sendDraft() {
    const body = draft.trim();
    if (!body && !attachSnapshot) return;
    void send({
      ...(body ? { body } : {}),
      ...(attachSnapshot ? { attachmentKind: SNAPSHOT_KIND } : {}),
    });
  }

  function sendGuidance(t: (typeof GUIDANCE_TEMPLATES)[number]) {
    void send({ body: t.body, topic: t.topic });
  }

  async function bookSlot() {
    if (selectedSlotId == null || booking) return;
    setBooking(true);
    try {
      const res = await postApi<ConfirmResponse>(`/api/patients/${personaId}/appointments`, {
        slotId: selectedSlotId,
      });
      setConfirmedSlot(res.slot);
      setSelectedSlotId(null);
      refreshData();
      const { day, time } = formatSlot(res.slot.slotDatetime);
      pushToast({
        tone: 'success',
        icon: 'event_available',
        message: `Appointment requested for ${day} at ${time}.`,
      });
    } catch (err) {
      pushToast({
        tone: 'attention',
        icon: 'error',
        message: err instanceof Error ? err.message : 'Appointment could not be requested.',
      });
    } finally {
      setBooking(false);
    }
  }

  // ---- Render branches -----------------------------------------------------

  if (viewport === undefined || loading) {
    return (
      <>
        <PageHeader
          eyebrow="My account"
          title="Connect with your provider"
          lede="Message your care team securely and request an appointment, without leaving the app."
        />
        <div className={styles.loading} aria-hidden="true">
          <div className={styles.loadingBlock} />
          <div className={styles.loadingBlock} />
        </div>
      </>
    );
  }

  if (revoked) {
    return (
      <>
        <PageHeader
          eyebrow="My account"
          title="Connect with your provider"
          lede="Message your care team securely and request an appointment, without leaving the app."
        />
        <EmptyState
          icon="link_off"
          message="Your records are disconnected, so messaging is turned off. Reconnect to message your care team."
          actionLabel="Reconnect"
          onAction={async () => {
            try {
              await postApi('/api/consent/grant', { patientId: personaId });
              refreshData();
              pushToast({
                tone: 'success',
                icon: 'link',
                message: 'Reconnected. Your care team messages are available again.',
              });
            } catch (err) {
              pushToast({
                tone: 'attention',
                icon: 'error',
                message: err instanceof Error ? err.message : 'Reconnect failed.',
              });
            }
          }}
        />
      </>
    );
  }

  const threadCount = threads.length;
  const ledePlain =
    threadCount === 0
      ? 'No care-team conversations are set up yet.'
      : `You have ${threadCount} ${threadCount === 1 ? 'conversation' : 'conversations'} with your care team.`;

  // Mobile: when no thread is selected, show only the list; otherwise the convo.
  const showList = viewport === 'desktop' || selectedId === null;
  const showConversation = viewport === 'desktop' || selectedId !== null;

  return (
    <>
      <PageHeader
        eyebrow="My account"
        title="Connect with your provider"
        lede="Message your care team securely and request an appointment, without leaving the app."
      />

      <div className={styles.content}>
        <div className={styles.demoBar}>
          <DemoNote icon="forum">Demo — simulated provider responses</DemoNote>
        </div>

        <section aria-labelledby="connect-messages-title">
          <h2 className={styles.sectionTitle} id="connect-messages-title">
            Message your care team
          </h2>

          <PlainWords>
            {threadCount === 0 ? (
              ledePlain
            ) : (
              <>
                You have{' '}
                <strong>
                  {threadCount} {threadCount === 1 ? 'conversation' : 'conversations'}
                </strong>{' '}
                with your care team. Messages stay inside the app.
              </>
            )}
          </PlainWords>

          {threadCount === 0 ? (
            <EmptyState
              icon="forum"
              message="When a care-team member is connected to your record, your conversations will appear here."
            />
          ) : (
            <div className={styles.panes}>
              {showList && (
                <nav aria-label="Care-team conversations">
                  <ul className={styles.threadList}>
                    {threads.map((t) => {
                      const last = t.messages[t.messages.length - 1];
                      const active = viewport === 'desktop' && t.id === selectedId;
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            className={`${styles.threadButton} ${active ? styles.threadButtonActive : ''}`}
                            onClick={() => setSelectedId(t.id)}
                            aria-current={active ? 'true' : undefined}
                          >
                            <Avatar
                              name={t.careTeam.name}
                              tone={toAvatarTone(t.careTeam.avatarStyle)}
                              size={40}
                            />
                            <span className={styles.threadMeta}>
                              <span className={styles.threadName}>{t.careTeam.name}</span>
                              <span className={styles.threadRole}>{t.careTeam.role}</span>
                              {last && <span className={styles.threadPreview}>{last.body}</span>}
                            </span>
                            {viewport === 'mobile' && (
                              <span className={styles.threadChevron}>
                                <span className="material-symbols-outlined" aria-hidden="true">
                                  chevron_right
                                </span>
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}

              {showConversation && selectedThread && (
                <section
                  className={styles.conversation}
                  aria-label={`Conversation with ${selectedThread.careTeam.name}`}
                >
                  {viewport === 'mobile' && (
                    <div className={styles.backRow}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon="arrow_back"
                        onClick={() => setSelectedId(null)}
                      >
                        All conversations
                      </Button>
                    </div>
                  )}

                  <Card>
                    <div className={styles.convHeader}>
                      <Avatar
                        name={selectedThread.careTeam.name}
                        tone={toAvatarTone(selectedThread.careTeam.avatarStyle)}
                        size={44}
                      />
                      <div className={styles.convHeaderText}>
                        <h3 className={styles.convName}>{selectedThread.careTeam.name}</h3>
                        <span className={styles.convRole}>{selectedThread.careTeam.role}</span>
                      </div>
                    </div>

                    <div className={styles.stream} aria-live="polite">
                      {messages.map((m, i) => {
                        const isPatient = m.sender === 'patient';
                        const att = m.attachmentKind ? attachmentMeta(m.attachmentKind) : null;
                        return (
                          <div
                            key={`${m.sentLabel}-${i}`}
                            className={`${styles.bubbleRow} ${isPatient ? styles.bubbleRowPatient : styles.bubbleRowProvider}`}
                          >
                            {!isPatient && (
                              <span className={styles.bubbleSender}>
                                <Avatar
                                  name={selectedThread.careTeam.name}
                                  tone={toAvatarTone(selectedThread.careTeam.avatarStyle)}
                                  size={20}
                                />
                                {selectedThread.careTeam.name}
                              </span>
                            )}
                            <div
                              className={`${styles.bubble} ${isPatient ? styles.bubblePatient : styles.bubbleProvider}`}
                            >
                              {m.body && <span>{m.body}</span>}
                              {att && (
                                <div
                                  className={`${styles.attachment} ${isPatient ? styles.attachmentPatient : ''}`}
                                >
                                  <span
                                    className={`${styles.attachmentIcon} ${isPatient ? styles.attachmentIconPatient : ''}`}
                                  >
                                    <span className="material-symbols-outlined" aria-hidden="true">
                                      {att.icon}
                                    </span>
                                  </span>
                                  <span className={styles.attachmentText}>
                                    <span
                                      className={`${styles.attachmentTitle} ${isPatient ? styles.attachmentTitlePatient : ''}`}
                                    >
                                      {att.title}
                                    </span>
                                    <span
                                      className={`${styles.attachmentSub} ${isPatient ? styles.attachmentSubPatient : ''}`}
                                    >
                                      {att.sub}
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className={styles.bubbleTime}>{m.sentLabel}</span>
                          </div>
                        );
                      })}
                      {providerReplying && (
                        <div className={`${styles.bubbleRow} ${styles.bubbleRowProvider}`}>
                          <span className={styles.replying}>
                            <StatusIcon status="syncing" size={16} />
                            {selectedThread.careTeam.name} is replying
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card>
                    <div className={styles.composer}>
                      <label className={styles.composerLabel} htmlFor="connect-draft">
                        Write a message
                      </label>
                      <textarea
                        id="connect-draft"
                        className={styles.textarea}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Type your message to your care team"
                        disabled={sending}
                      />
                      <div className={styles.composerActions}>
                        <label className={styles.attachToggle}>
                          <input
                            type="checkbox"
                            checked={attachSnapshot}
                            onChange={(e) => setAttachSnapshot(e.target.checked)}
                            disabled={sending}
                          />
                          Attach a snapshot of my recent labs
                        </label>
                        <span className={styles.sendSpacer} />
                        <Button
                          variant="primary"
                          icon="send"
                          onClick={sendDraft}
                          disabled={sending || (draft.trim() === '' && !attachSnapshot)}
                        >
                          Send message
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card header={<h3 className={styles.cardHeading}>Ask for guidance</h3>}>
                    <div className={styles.templates}>
                      <p className={styles.composerLabel}>
                        Pick a topic to send a ready-written question. Your care team replies in the
                        conversation above.
                      </p>
                      <div
                        className={styles.templateChips}
                        role="group"
                        aria-label="Guidance topics"
                      >
                        {GUIDANCE_TEMPLATES.map((t) => (
                          <button
                            key={t.topic}
                            type="button"
                            className={styles.templateChip}
                            onClick={() => sendGuidance(t)}
                            disabled={sending}
                          >
                            <span className="material-symbols-outlined" aria-hidden="true">
                              {t.icon}
                            </span>
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                </section>
              )}
            </div>
          )}
        </section>

        {/* ---- Appointment requests ---- */}
        {showConversation && (
          <section aria-labelledby="connect-appt-title">
            <h2 className={styles.sectionTitle} id="connect-appt-title">
              Request an appointment
            </h2>
            <AppointmentBlock
              slots={apptApi.data?.slots ?? []}
              loading={apptApi.loading && !apptApi.data}
              selectedSlotId={selectedSlotId}
              confirmedSlot={confirmedSlot}
              booking={booking}
              onSelect={setSelectedSlotId}
              onBook={bookSlot}
            />
          </section>
        )}
      </div>
    </>
  );
}

function AppointmentBlock({
  slots,
  loading,
  selectedSlotId,
  confirmedSlot,
  booking,
  onSelect,
  onBook,
}: {
  slots: AppointmentSlot[];
  loading: boolean;
  selectedSlotId: number | null;
  confirmedSlot: AppointmentSlot | null;
  booking: boolean;
  onSelect: (id: number) => void;
  onBook: () => void;
}) {
  if (loading) {
    return (
      <div className={styles.loading} aria-hidden="true">
        <div className={styles.loadingBlock} />
      </div>
    );
  }

  if (confirmedSlot) {
    const { day, time } = formatSlot(confirmedSlot.slotDatetime);
    const withWhom = confirmedSlot.careTeam?.name;
    return (
      <Card>
        <div className={styles.confirm}>
          <div className={styles.confirmHead}>
            <StatusIcon status="success" size={20} />
            <span className={styles.confirmTitle}>Appointment requested</span>
          </div>
          <p className={styles.confirmDetail}>
            You requested{' '}
            <strong>
              {day} at {time}
            </strong>
            {withWhom ? (
              <>
                {' '}
                with <strong>{withWhom}</strong>
              </>
            ) : null}
            . Your care team will confirm the time and send a reminder.
          </p>
          <DemoNote icon="event_available">
            Demo — no appointment is actually scheduled with a clinic.
          </DemoNote>
        </div>
      </Card>
    );
  }

  const openSlots = slots.filter((s) => !s.taken);

  if (slots.length === 0) {
    return (
      <EmptyState
        icon="event_busy"
        message="No open appointment times are offered right now. Send a message above to ask for a visit."
      />
    );
  }

  if (openSlots.length === 0) {
    return (
      <Card>
        <div className={styles.confirm}>
          <div className={styles.confirmHead}>
            <StatusIcon status="success" size={20} />
            <span className={styles.confirmTitle}>Appointment already requested</span>
          </div>
          <p className={styles.confirmDetail}>
            The offered time has been requested. Your care team will follow up to confirm it.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <PlainWords>
        Pick a time that works for you, then confirm to send the request to your care team.
      </PlainWords>
      <div style={{ height: 'var(--space-4)' }} />
      <div className={styles.apptGrid} role="group" aria-label="Available appointment times">
        {openSlots.map((s) => {
          const { day, time } = formatSlot(s.slotDatetime);
          const selected = s.id === selectedSlotId;
          return (
            <button
              key={s.id}
              type="button"
              className={`${styles.slotChip} ${selected ? styles.slotChipSelected : ''}`}
              onClick={() => onSelect(s.id)}
              aria-pressed={selected}
            >
              <span className={styles.slotDay}>{day}</span>
              <span className={styles.slotTime}>{time}</span>
              {s.careTeam && <span className={styles.slotWith}>with {s.careTeam.name}</span>}
            </button>
          );
        })}
      </div>
      <div className={styles.apptActions}>
        <Button
          variant="accent"
          icon="event_available"
          onClick={onBook}
          disabled={selectedSlotId == null || booking}
        >
          Confirm appointment request
        </Button>
      </div>
    </Card>
  );
}
