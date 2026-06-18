'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { useApi, postApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { PageHeader, AIBadge, DemoNote, EmptyState } from '@/components/ui';
import { Button } from '@/components/ds';
import { demoGreetingWord } from '@/lib/demo-clock';
import { useSpeechInput } from './_components/useSpeechInput';
import styles from './page.module.css';

interface RosterPatient {
  id: string;
  firstName: string;
}
interface RosterResponse {
  patients: RosterPatient[];
}
interface ProviderQuestionsResponse {
  questions: string[];
}
interface AssistantResponse {
  answer: string;
  sourceCitation: string;
  disclaimer: string;
  suggestedChips: string[];
}

interface Turn {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  basis?: string;
}

// Neutral warm-up prompt: its answer is discarded; only the live
// suggestedChips it returns seed the rail before the first real turn.
const WARMUP_QUESTION = 'what can you help me with';

export default function AssistantPage() {
  const { personaId } = usePersona();
  const { pushToast } = useToast();

  const roster = useApi<RosterResponse>('/api/patients');
  const provQ = useApi<ProviderQuestionsResponse>(
    `/api/patients/${personaId}/assistant/provider-questions`
  );

  const firstName = roster.data?.patients.find((p) => p.id === personaId)?.firstName ?? null;

  const [turns, setTurns] = useState<Turn[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const turnId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const nextTurnId = () => (turnId.current += 1);

  // Reset the conversation and re-seed chips when the persona changes.
  useEffect(() => {
    setTurns([]);
    setChips([]);
    setChecked({});
    let live = true;
    postApi<AssistantResponse>(`/api/patients/${personaId}/assistant`, {
      question: WARMUP_QUESTION,
    })
      .then((res) => {
        if (live) setChips(res.suggestedChips);
      })
      .catch(() => {
        /* leave chips empty; the provider-questions panel still serves */
      });
    return () => {
      live = false;
    };
  }, [personaId]);

  // Keep the newest turn in view as the log grows.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, thinking]);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (q === '' || thinking) return;
      setTurns((t) => [...t, { id: nextTurnId(), role: 'user', text: q }]);
      setDraft('');
      setThinking(true);
      try {
        const res = await postApi<AssistantResponse>(`/api/patients/${personaId}/assistant`, {
          question: q,
        });
        setTurns((t) => [
          ...t,
          {
            id: nextTurnId(),
            role: 'assistant',
            text: res.answer,
            basis: res.sourceCitation,
          },
        ]);
        if (res.suggestedChips.length > 0) setChips(res.suggestedChips);
      } catch {
        setTurns((t) => [
          ...t,
          {
            id: nextTurnId(),
            role: 'assistant',
            text: 'Something went wrong reaching the demo assistant. Try asking again, or open a message to your care team.',
            basis: 'No record lookup was completed for this answer.',
          },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [personaId, thinking]
  );

  const speech = useSpeechInput(setDraft);

  const escalate = () =>
    pushToast({
      tone: 'success',
      icon: 'forum',
      message: 'Your care team has been notified. Simulated for the demo.',
    });

  const sendQuestions = () => {
    const picked = (provQ.data?.questions ?? []).filter((_, i) => checked[i]);
    pushToast({
      tone: 'success',
      icon: 'send',
      message:
        picked.length > 0
          ? `${picked.length} question${picked.length === 1 ? '' : 's'} sent to your provider. Simulated for the demo.`
          : 'Select at least one question to send.',
    });
  };

  // Disconnected state: assistant has no record to draw on after revoke.
  const consent = useApi<{ revoked: boolean }>(`/api/patients/${personaId}/consent`);
  if (consent.data?.revoked) {
    return (
      <>
        <PageHeader
          eyebrow="Explore"
          title="Health assistant"
          lede="Ask plain-language questions about your own record and build questions for your care team."
        />
        <EmptyState
          icon="link_off"
          message="Your records are disconnected, so the assistant has nothing to read. Reconnect to ask about your data again."
        />
      </>
    );
  }

  const greeting =
    firstName != null
      ? `${demoGreetingWord()}, ${firstName}. I can look things up in your record and put them in plain words. What would you like to know?`
      : `${demoGreetingWord()}. I can look things up in your record and put them in plain words. What would you like to know?`;

  const anyChecked = Object.values(checked).some(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Health assistant"
        lede="Ask plain-language questions about your own record. Answers come from your data on this device, never from a chat model."
      />

      <div className={styles.layout}>
        {/* ---- Chat pane ---- */}
        <section className={styles.chat} aria-label="Assistant conversation">
          <div
            ref={logRef}
            className={styles.log}
            role="log"
            aria-live="polite"
            aria-label="Conversation with the health assistant"
          >
            {/* Seeded greeting — an assistant turn, badged like every AI surface. */}
            <div className={`${styles.turn} ${styles.turnAssistant}`}>
              <span className={styles.role}>Assistant</span>
              <div className={styles.answer}>
                <AIBadge />
                <p className={styles.answerText}>{greeting}</p>
              </div>
            </div>

            {turns.map((turn) =>
              turn.role === 'user' ? (
                <div key={turn.id} className={`${styles.turn} ${styles.turnUser}`}>
                  <span className={styles.role}>You</span>
                  <div className={styles.bubbleUser}>{turn.text}</div>
                </div>
              ) : (
                <div key={turn.id} className={`${styles.turn} ${styles.turnAssistant}`}>
                  <span className={styles.role}>Assistant</span>
                  <div className={styles.answer}>
                    <AIBadge />
                    <p className={styles.answerText}>{turn.text}</p>
                    {turn.basis && (
                      <p className={styles.basis}>
                        <span className="material-symbols-outlined" aria-hidden="true">
                          database
                        </span>
                        <span>Based on: {turn.basis}</span>
                      </p>
                    )}
                    <div className={styles.escalateRow}>
                      <button type="button" className={styles.escalate} onClick={escalate}>
                        <span className="material-symbols-outlined" aria-hidden="true">
                          forum
                        </span>
                        Ask my care team
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            {thinking && (
              <div className={`${styles.turn} ${styles.turnAssistant}`}>
                <span className={styles.pending}>
                  <span className={styles.pendingDot} aria-hidden="true" />
                  Looking in your record
                </span>
              </div>
            )}
          </div>

          {/* ---- Composer ---- */}
          <form
            className={styles.composer}
            onSubmit={(e) => {
              e.preventDefault();
              void ask(draft);
            }}
          >
            {speech.listening && (
              <p className={styles.listeningBar}>
                <span className={styles.listeningDot} aria-hidden="true" />
                Listening — speak your question, then stop when you are done.
              </p>
            )}
            <div className={styles.inputRow}>
              <label htmlFor="assistant-input" className="visually-hidden">
                Ask the health assistant a question
              </label>
              <textarea
                id="assistant-input"
                className={styles.field}
                rows={2}
                placeholder="Ask about your labs, medications, activity, weight, or recipes"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void ask(draft);
                  }
                }}
              />
              {speech.supported ? (
                <button
                  type="button"
                  className={`${styles.mic} ${speech.listening ? styles.micListening : ''}`}
                  aria-pressed={speech.listening}
                  aria-label={speech.listening ? 'Stop voice input' : 'Start voice input'}
                  onClick={() => (speech.listening ? speech.stop() : speech.start())}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {speech.listening ? 'stop' : 'mic'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.mic}
                  disabled
                  aria-label="Voice input is not supported in this browser"
                  title="Voice input isn't supported in this browser"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    mic_off
                  </span>
                </button>
              )}
              <Button type="submit" variant="primary" icon="send" disabled={thinking}>
                Ask
              </Button>
            </div>
            {!speech.supported && (
              <p className={styles.micNote}>Voice input isn&apos;t supported in this browser.</p>
            )}
            <DemoNote icon="smart_toy">
              Demo assistant — not medical advice. Answers are generated on this device from your
              record.
            </DemoNote>
          </form>
        </section>

        {/* ---- Context rail ---- */}
        <aside className={styles.rail} aria-label="Assistant tools">
          <section className={styles.railPanel} aria-labelledby="rail-suggested">
            <h2 id="rail-suggested" className={styles.railHeading}>
              Try asking
            </h2>
            {chips.length > 0 ? (
              <div className={styles.chips}>
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={styles.chip}
                    onClick={() => void ask(chip)}
                    disabled={thinking}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">
                      chat_bubble
                    </span>
                    {chip}
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.railNote}>Loading suggestions from your record.</p>
            )}
          </section>

          <section className={styles.railPanel} aria-labelledby="rail-provider">
            <h2 id="rail-provider" className={styles.railHeading}>
              Questions for your provider
            </h2>
            <p className={styles.railNote}>
              Built from your own record. Check the ones you want to take to your next visit.
            </p>
            {provQ.loading && !provQ.data ? (
              <ul className={styles.questions} aria-hidden="true">
                <li className={styles.railSkeleton} />
                <li className={styles.railSkeleton} />
                <li className={styles.railSkeleton} />
              </ul>
            ) : provQ.error ? (
              <p className={styles.railNote}>
                Those questions could not load right now. You can still type your own above.
              </p>
            ) : (
              <ul className={styles.questions}>
                {(provQ.data?.questions ?? []).map((q, i) => (
                  <li key={q}>
                    <label className={styles.questionItem}>
                      <input
                        type="checkbox"
                        checked={Boolean(checked[i])}
                        onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))}
                      />
                      <span>{q}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <Button
              type="button"
              variant="secondary"
              icon="send"
              fullWidth
              disabled={!anyChecked}
              onClick={sendQuestions}
            >
              Send to my provider
            </Button>
            <DemoNote icon="science">Demo — your provider is simulated.</DemoNote>
          </section>
        </aside>
      </div>
    </>
  );
}
