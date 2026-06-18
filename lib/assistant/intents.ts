import { getDb } from '@/lib/db';
import {
  findPatient,
  parseJsonArray,
  readAppMetaJson,
  readAppMetaText,
  readPersonaRaw,
} from '@/lib/api-helpers';
import { formatMediumDate, formatShortDate } from '@/lib/demo-clock';
import { filterRecipesForPatient } from '@/lib/recipe-filter';
import { buildProviderQuestions } from './provider-questions';
import type { InterpretResponse } from './interpret';

/**
 * Deterministic intent engine (NO LLM). Intents, keywords, and response
 * templates are seeded (assistant_intents); handlers fill template
 * placeholders with REAL values queried from the patient's record — the
 * engine never fabricates a clinical value. Safety gates run before
 * classification: red-flag input → direct-to-care (seeded response);
 * milder symptom phrasing → care-first guidance + check-in offer.
 */

interface IntentRow {
  id: string;
  keywords: string;
  handler: string;
  response_template: string;
}

type Values = Record<string, string | null>;

/** Fill {placeholders}; drop any sentence left with an unfilled one. */
function fillTemplate(template: string, values: Values): string {
  let out = template;
  for (const [k, v] of Object.entries(values)) {
    if (v != null) out = out.replaceAll(`{${k}}`, v);
  }
  // disclaimer / sourceCitation / suggestedChips are returned as separate
  // response fields — never duplicated inside the answer text.
  out = out
    .replaceAll('{disclaimer}', '')
    .replaceAll('{sourceCitation}', '')
    .replaceAll('{suggestedChips}', '');
  const sentences = out.split(/(?<=[.!?])\s+/);
  return sentences
    .filter((s) => !/\{[a-zA-Z]+\}/.test(s))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function suggestedChipsFor(patientId: string, exclude?: string): string[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT text FROM assistant_suggested WHERE patient_id = ? ORDER BY sort')
    .all(patientId) as Array<{ text: string }>;
  const chips = rows.map((r) => r.text).filter((t) => t.toLowerCase() !== exclude?.toLowerCase());
  if (chips.length > 0) return chips.slice(0, 4);
  return [
    "what's my a1c?",
    'did i take my meds?',
    'show me dinner ideas',
    'what should i ask my doctor?',
  ];
}

function disclaimerText(): string {
  return (
    readAppMetaText('assistant_disclaimer') ??
    'This is a demo assistant, not medical advice. Your care team can help you decide what to do next.'
  );
}

/** Word-boundary match for single words; substring for phrases. */
function keywordHit(question: string, keyword: string): boolean {
  const q = question.toLowerCase();
  const k = keyword.toLowerCase();
  if (k.includes(' ')) return q.includes(k);
  return new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(q);
}

const MILD_SYMPTOM_WORDS = [
  'dizzy',
  'nausea',
  'nauseous',
  'headache',
  'tired all',
  'fatigue',
  'pain',
  'ache',
  'swelling',
  'swollen',
  'rash',
  'feel sick',
  'feeling sick',
  'unwell',
];

// ---------------------------------------------------------------------------

export function runIntentEngine(patientId: string, question: string): InterpretResponse {
  const db = getDb();
  const disclaimer = disclaimerText();
  const chips = () => suggestedChipsFor(patientId, question);

  // --- safety gates first --------------------------------------------------
  const redFlags = readAppMetaJson<string[]>('red_flag_keywords') ?? [];
  if (redFlags.some((k) => question.toLowerCase().includes(k.toLowerCase()))) {
    const redResponse =
      readAppMetaText('red_flag_response') ??
      'This may need urgent attention — please contact your care team or 911/urgent care now.';
    return {
      answer: redResponse,
      sourceCitation: 'Safety guidance — not based on your records.',
      disclaimer,
      suggestedChips: chips(),
    };
  }
  if (MILD_SYMPTOM_WORDS.some((w) => question.toLowerCase().includes(w))) {
    return {
      answer:
        "I can't assess symptoms, and it's safest to talk with your care team about how you're feeling. I can log this as a check-in for your next visit, or open a message to your care team now.",
      sourceCitation: 'Safety guidance — not based on your records.',
      disclaimer,
      suggestedChips: chips(),
    };
  }

  // --- classify -------------------------------------------------------------
  const intents = db
    .prepare('SELECT id, keywords, handler, response_template FROM assistant_intents ORDER BY id')
    .all() as IntentRow[];

  let best: { intent: IntentRow; hits: number; matchedLen: number; specificity: number } | null =
    null;
  for (const intent of intents) {
    const keywords = parseJsonArray<string>(intent.keywords);
    if (keywords.length === 0) continue; // fallback handled below
    const matched = keywords.filter((k) => keywordHit(question, k));
    if (matched.length === 0) continue;
    const cand = {
      intent,
      hits: matched.length,
      matchedLen: matched.join('').length,
      specificity: -keywords.length, // fewer keywords = more specific intent
    };
    if (
      !best ||
      cand.hits > best.hits ||
      (cand.hits === best.hits && cand.specificity > best.specificity) ||
      (cand.hits === best.hits &&
        cand.specificity === best.specificity &&
        cand.matchedLen > best.matchedLen)
    ) {
      best = cand;
    }
  }

  const fallbackRow = intents.find((i) => i.id === 'fallback');
  if (!best) {
    const fallbackTemplate =
      fallbackRow?.response_template ??
      'I can answer questions about your labs, medications, activity, weight, appointments, and recipes.';
    return {
      answer: fillTemplate(fallbackTemplate, {}),
      sourceCitation: 'No record lookup was needed for this answer.',
      disclaimer,
      suggestedChips: chips(),
    };
  }

  const handled = runHandler(best.intent, patientId, question);
  return {
    answer: handled.answer,
    sourceCitation: handled.sourceCitation,
    disclaimer,
    suggestedChips: chips(),
  };
}

// ---------------------------------------------------------------------------

interface Handled {
  answer: string;
  sourceCitation: string;
}

function runHandler(intent: IntentRow, patientId: string, question: string): Handled {
  const db = getDb();
  const template = intent.response_template;

  const latestLab = (code: string) =>
    db
      .prepare(
        `SELECT value, value2, unit, collected_on, source FROM lab_results
         WHERE patient_id = ? AND code = ? ORDER BY collected_on DESC, id DESC LIMIT 1`
      )
      .get(patientId, code) as
      | { value: number; value2: number | null; unit: string; collected_on: string; source: string }
      | undefined;

  const a1cGoal = db
    .prepare(`SELECT target, label FROM goals WHERE patient_id = ? AND metric = 'a1c'`)
    .get(patientId) as { target: number; label: string } | undefined;

  switch (intent.handler) {
    case "labs.latest('a1c')": {
      const lab = latestLab('a1c');
      if (!lab) {
        return {
          answer: "I don't see an A1c result in your record yet. Your care team can order one.",
          sourceCitation: 'Checked your lab results — no A1c on file.',
        };
      }
      const target = a1cGoal ? `below ${a1cGoal.target}%` : 'set with your care team';
      return {
        answer: fillTemplate(template, {
          value: String(lab.value),
          date: formatMediumDate(lab.collected_on),
          target,
        }),
        sourceCitation: `From your ${formatMediumDate(lab.collected_on)} lab result (${lab.source}).`,
      };
    }

    case "labs.trend('a1c')+observations.glucose": {
      const series = db
        .prepare(
          `SELECT value, collected_on FROM lab_results
           WHERE patient_id = ? AND code = 'a1c' ORDER BY collected_on DESC, id DESC LIMIT 2`
        )
        .all(patientId) as Array<{ value: number; collected_on: string }>;
      if (series.length < 2) {
        const only = series[0];
        return {
          answer: only
            ? `You have one A1c on file: ${only.value}% on ${formatMediumDate(only.collected_on)}. A trend needs at least two results.`
            : "I don't see A1c results in your record yet.",
          sourceCitation: 'Checked your A1c history.',
        };
      }
      const raw = readPersonaRaw<{ glucose14d?: { avg?: number } }>(patientId);
      const glucoseAvg =
        raw?.glucose14d?.avg ??
        (
          db
            .prepare(
              `SELECT ROUND(AVG(value)) AS avg FROM observations
             WHERE patient_id = ? AND type = 'glucose_fasting'`
            )
            .get(patientId) as { avg: number | null }
        ).avg;
      return {
        answer: fillTemplate(template, {
          prev: String(series[1].value),
          value: String(series[0].value),
          glucoseAvg: glucoseAvg != null ? String(glucoseAvg) : null,
        }),
        sourceCitation: `From your ${formatMediumDate(series[0].collected_on)} lab result and your recent glucose readings.`,
      };
    }

    case 'observations.glucoseSummary': {
      const raw = readPersonaRaw<{
        timeInRange?: { inRangePct: number; target: number; source?: string };
        glucose14d?: { avg?: number };
      }>(patientId);
      const tir = raw?.timeInRange;
      const avg =
        raw?.glucose14d?.avg ??
        (
          db
            .prepare(
              `SELECT ROUND(AVG(value)) AS avg FROM observations
             WHERE patient_id = ? AND type = 'glucose_fasting'`
            )
            .get(patientId) as { avg: number | null }
        ).avg;
      if (!tir && avg == null) {
        return {
          answer:
            "I don't see glucose readings in your record. Connecting a meter or CGM on the Devices page will bring them in.",
          sourceCitation: 'Checked your glucose observations — none on file.',
        };
      }
      if (tir) {
        return {
          answer: fillTemplate(template, {
            inRangePct: String(tir.inRangePct),
            target: String(tir.target),
            avg: avg != null ? String(avg) : null,
          }),
          sourceCitation: `From your ${tir.source ?? 'CGM'} data over the last 14 days.`,
        };
      }
      return {
        answer: `Your fasting glucose averaged ${avg} mg/dL over your recent readings.`,
        sourceCitation: 'From your last 14 days of glucose readings.',
      };
    }

    case 'medications.today': {
      const events = db
        .prepare(
          `SELECT m.name, m.dose, e.status, e.at_time FROM med_events_today e
           JOIN medications m ON m.id = e.medication_id
           WHERE m.patient_id = ? ORDER BY m.sort`
        )
        .all(patientId) as Array<{
        name: string;
        dose: string;
        status: string;
        at_time: string | null;
      }>;
      if (events.length === 0) {
        return {
          answer: "You don't have medications tracked in this app.",
          sourceCitation: 'Checked your medication list — none on file.',
        };
      }
      const medSummary = events
        .map((e) =>
          e.status === 'taken'
            ? `${e.name} ${e.dose} — taken${e.at_time ? ` at ${e.at_time}` : ''}`
            : `${e.name} ${e.dose} — due${e.at_time ? ` at ${e.at_time}` : ''}`
        )
        .join('; ');
      const refill = db
        .prepare(
          `SELECT description, location FROM claims_events
           WHERE patient_id = ? AND kind = 'refill_ready' ORDER BY event_date DESC LIMIT 1`
        )
        .get(patientId) as { description: string; location: string | null } | undefined;
      return {
        answer: fillTemplate(template, {
          medSummary,
          refillNote: refill
            ? `${refill.description}${refill.location ? ` at ${refill.location}` : ''}.`
            : null,
        }),
        sourceCitation: "From today's medication schedule and your pharmacy claims.",
      };
    }

    case 'appointments.next': {
      const slot = db
        .prepare(
          `SELECT s.slot_datetime, c.name FROM appointment_slots s
           LEFT JOIN care_team c ON c.id = s.care_team_id
           WHERE s.patient_id = ? AND s.taken = 0 ORDER BY s.slot_datetime LIMIT 1`
        )
        .get(patientId) as { slot_datetime: string; name: string | null } | undefined;
      if (!slot) {
        return {
          answer:
            'You have no open appointment offers right now. You can request one on the Connect page.',
          sourceCitation: 'Checked your appointment slots.',
        };
      }
      const [date, time] = slot.slot_datetime.split('T');
      const hhmm = time?.slice(0, 5) ?? '';
      const [h, m] = hhmm.split(':').map(Number);
      const label = `${formatMediumDate(date)}, ${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
      return {
        answer: fillTemplate(template, { slot: label, provider: slot.name ?? 'your care team' }),
        sourceCitation: 'From your open appointment offers.',
      };
    }

    case 'observations.weightProgress': {
      const series = db
        .prepare(
          `SELECT value, observed_on FROM observations
           WHERE patient_id = ? AND type = 'weight' ORDER BY observed_on`
        )
        .all(patientId) as Array<{ value: number; observed_on: string }>;
      if (series.length === 0) {
        return {
          answer:
            "I don't see weight entries in your record. Connecting a smart scale on the Devices page will bring them in.",
          sourceCitation: 'Checked your weight observations — none on file.',
        };
      }
      const current = series[series.length - 1];
      const first = series[0];
      const delta = Math.round(Math.abs(current.value - first.value) * 10) / 10;
      const direction = current.value <= first.value ? 'down' : 'up';
      const goal = db
        .prepare(`SELECT target FROM goals WHERE patient_id = ? AND metric = 'weight'`)
        .get(patientId) as { target: number } | undefined;
      return {
        answer: fillTemplate(template, {
          current: String(current.value),
          direction,
          delta: String(delta),
          since: formatShortDate(first.observed_on),
          goal: goal ? String(goal.target) : null,
        }),
        sourceCitation: `From your weight entries, ${formatShortDate(first.observed_on)} to ${formatShortDate(current.observed_on)}.`,
      };
    }

    case 'recipes.forPatient': {
      const patient = findPatient(patientId);
      if (!patient) return { answer: 'Unknown patient.', sourceCitation: '' };
      const { activeFilter } = filterRecipesForPatient(patient);
      return {
        answer: fillTemplate(template, {
          filterExplanation: activeFilter.explanation.replace(/^Showing /, '').replace(/\.$/, ''),
        }),
        sourceCitation: 'From your condition, allergy, and diet profile.',
      };
    }

    case 'assistant.providerQuestions': {
      const questions = buildProviderQuestions(patientId);
      return {
        answer: fillTemplate(template, {
          questions: questions.map((q, i) => `${i + 1}) ${q}`).join(' '),
        }),
        sourceCitation: 'Built from your labs, medications, activity, and care plan.',
      };
    }

    case 'glossary.lookup': {
      const definition = glossaryLookup(question);
      if (!definition) {
        return {
          answer:
            "I don't have a plain-language definition for that yet. Your care team can explain it, or try asking about A1c, pre-diabetes, BMI, time in range, titration, or GLP-1 medicines.",
          sourceCitation: 'Glossary lookup — no patient data used.',
        };
      }
      return {
        answer: fillTemplate(template, { plainDefinition: definition }),
        sourceCitation: 'Plain-language glossary — educational, no patient data used.',
      };
    }

    default:
      return {
        answer: fillTemplate(
          (
            getDb()
              .prepare(`SELECT response_template FROM assistant_intents WHERE id = 'fallback'`)
              .get() as { response_template: string } | undefined
          )?.response_template ??
            'I can answer questions about your labs, medications, activity, weight, appointments, and recipes.',
          {}
        ),
        sourceCitation: 'No record lookup was needed for this answer.',
      };
  }
}

/** Educational plain-language definitions (UI copy, not patient data). */
const GLOSSARY: Array<{ match: RegExp; definition: string }> = [
  {
    match: /pre.?diabetes/i,
    definition:
      'Pre-diabetes means your blood sugar is higher than normal but not yet in the diabetes range (A1c 5.7–6.4%). It often improves with changes to eating and activity — that is what prevention programs like MDPP work on.',
  },
  {
    match: /\ba1c\b|hba1c/i,
    definition:
      'A1c is a blood test that shows your average blood sugar over about the last 3 months, as a percentage. Below 5.7% is typical; 5.7–6.4% is pre-diabetes; 6.5% or higher is in the diabetes range.',
  },
  {
    match: /\bbmi\b|body mass index/i,
    definition:
      'BMI (body mass index) is a number from your height and weight used to screen weight categories. 25–29.9 is considered overweight and 30 or higher is considered obesity. It is a screening number, not a full picture of health.',
  },
  {
    match: /time in range|\btir\b/i,
    definition:
      'Time in range is the share of the day your glucose stays inside your target band (often 70–180 mg/dL), measured by a CGM. Most care teams aim for above 70%.',
  },
  {
    match: /titrat/i,
    definition:
      'Titration means adjusting a medication dose step by step — usually increasing it slowly — so your body adjusts with fewer side effects while your care team watches how it works.',
  },
  {
    match: /glp.?1|semaglutide/i,
    definition:
      'GLP-1 medicines (like semaglutide) help manage blood sugar and weight by acting like a hormone your gut makes after eating. They are usually a weekly injection.',
  },
  {
    match: /mdpp|diabetes prevention/i,
    definition:
      'MDPP is the Medicare Diabetes Prevention Program — a structured, coach-led program (16 core sessions) aimed at preventing type 2 diabetes through eating, activity, and weight goals.',
  },
  {
    match: /metformin/i,
    definition:
      'Metformin is a common first medicine for type 2 diabetes. It lowers the amount of sugar your liver releases and helps your body use insulin better.',
  },
];

function glossaryLookup(question: string): string | null {
  for (const g of GLOSSARY) {
    if (g.match.test(question)) return g.definition;
  }
  return null;
}
