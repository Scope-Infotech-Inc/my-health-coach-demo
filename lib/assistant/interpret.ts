import { runIntentEngine } from './intents';

/**
 * SEAM — the single AI-interpretation contract (PRD §6.4 / §9).
 *
 * Demo implementation: a deterministic, on-device intent/template engine
 * over the patient's SQLite data. NO language model, local or remote; no
 * inference request ever leaves the app. A production build replaces the
 * engine behind this exact request/response contract (and the same
 * guardrails: red-flag direct-to-care, source citation, disclaimer,
 * AI-vs-clinical-judgment labeling) with a governed clinical model —
 * no caller, schema, or UI change.
 */
export interface InterpretRequest {
  patientId: string;
  question: string;
}

export interface InterpretResponse {
  answer: string;
  sourceCitation: string;
  disclaimer: string;
  suggestedChips: string[];
}

export function interpret(req: InterpretRequest): InterpretResponse {
  return runIntentEngine(req.patientId, req.question);
}
