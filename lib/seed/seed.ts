/**
 * Phase 2 — deterministic seed.
 *
 * runSeed(db) drops + recreates the FULL 39-table schema from
 * spec-extracted/schema.sql (read at seed time; build-time input) and inserts
 * every value from spec-extracted/spec-seed-data.json inside one transaction.
 *
 * Determinism rules (PRD §10): no Math.random(), no Date.now(), no new Date()
 * without args. Every date derives from DEMO_TODAY (lib/demo-clock) or is a
 * literal ISO string from the seed JSON. Iteration order is the JSON's natural
 * order, so re-seeding a fresh file is byte-identical.
 *
 * Schema refinement (allowed by PRD §10 "schema MAY be refined provided …
 * seed values … are preserved"): the alerts.severity CHECK is widened to
 * include 'sky' because six persona banners in the seed JSON carry
 * severity "sky".
 *
 * Display-shaped persona data with no relational home (tiles, riskScale,
 * glucose14d metadata, bpTrend, timeInRange, adherence labels, mdpp, refill
 * chip, nutrition display rows incl. miguel's intentional duplicate, …) is
 * preserved VERBATIM as JSON in app_meta under `persona_raw:{id}` so API
 * routes can serve those strings without hardcoding.
 */
import fs from 'node:fs';
import path from 'node:path';
import type Database from 'better-sqlite3';
import { DEMO_TODAY, isoFromToday, daysFromToday } from '../demo-clock';
import { RECIPE_DETAILS } from './recipe-details';

// ---------------------------------------------------------------------------
// Seed-JSON shapes (only the fields this module consumes)
// ---------------------------------------------------------------------------

interface SeriesPoint {
  collectedOn: string;
  value: number;
  aboveTarget?: boolean;
}
interface DayBar {
  d: string;
  v: number;
  today?: boolean;
}
interface LabRow {
  display: string;
  loinc?: string;
  detail: string;
  valueText: string;
  rangeFlag: string;
}
interface MedRow {
  name: string;
  rxnorm?: string;
  dose: string;
  timing: string;
  todayStatus: string;
  takenAt?: string;
  dueAt?: string;
}
interface MsgRow {
  senderName: string;
  senderRole: string;
  sentLabel: string;
  senderType: 'human' | 'auto';
  avatar: string;
  avatarStyle: 'navy' | 'gold';
  actionLabel?: string;
}
interface ProgramRow {
  name: string;
  detail: string;
  statusChip: string;
}
interface CareRow {
  name: string;
  role: string;
  note: string;
  avatar: string;
  avatarStyle: string;
}
interface SocialRow {
  domain: string;
  status: string;
  note: string;
  surfaces: string[];
  zCode?: string;
}
interface NutritionRow {
  label: string;
  valueText: string;
  pct: number;
  tone: string;
}
interface ConditionRow {
  display: string;
  snomed?: string;
  onsetDate?: string;
}
interface GamificationBlock {
  points: number;
  level: string;
  streak: { current: number; best: number; habit: string; broken?: boolean };
  earnedBadges: string[];
}

interface Persona {
  firstName: string;
  lastNameInitial: string;
  age: number;
  category?: string;
  featured?: boolean;
  planType: string;
  conditionDetail?: string;
  providerOrg: string;
  avatarInitials: string;
  headerRole?: string;
  medicareContext: string;
  dualEligible: boolean;
  sex: string;
  preferredLanguage: string;
  raceEthnicity: string;
  rurality: string;
  allergies?: string[];
  dietaryPrefs?: string[];
  banner: { severity: string; title: string; ctaLabel?: string; careTeamNotified?: boolean };
  tiles: unknown[];
  labs: LabRow[];
  a1cHistory?: SeriesPoint[];
  a1cQuarterly?: SeriesPoint[];
  a1cTarget?: { max: number; label: string; setWith?: string };
  riskScale?: unknown;
  weightMonthly?: { month: string; lb: number }[];
  weightGoal?: { lb: number; label: string };
  glucose14d?: {
    unit: string;
    targetMin: number;
    targetMax: number;
    from: string;
    to: string;
    values: number[];
  };
  stepsWeek?: { goalDaily: number; days: DayBar[]; weekOverWeek?: string };
  activityWeek?: { unit: string; goalWeekly: number; days: DayBar[]; total: number };
  timeInRange?: unknown;
  bpTrend?: unknown;
  medications?: MedRow[];
  adherence?: { weeksStarting: string[]; summary: string; grid: string[][] };
  refill?: { description: string; detail: string; statusChip: string };
  appointmentOffer?: { with: string; at: string; label: string };
  nutrition: NutritionRow[];
  mdpp?: {
    sessionsComplete: number;
    sessionsTotal: number;
    milestonePct: number;
    milestoneGoalPct: number;
    nextSession: string;
    nextTopic: string;
    location: string;
  };
  messages: MsgRow[];
  programs: ProgramRow[];
  careTeam: CareRow[];
  socialDrivers: SocialRow[];
  conditions?: ConditionRow[];
  connectedDevices?: string[];
  gamification?: GamificationBlock;
  escalationRule?: string;
}

interface SeedJson {
  demoToday: string;
  patients: Record<string, Persona>;
  additionalPersonas: Record<string, Persona>;
  shared: {
    connectionStatus: string;
    dataSources: {
      name: string;
      description: string;
      standards: string[];
      lastSyncAt: string | null;
      continuous: boolean;
    }[];
    consent: {
      grantedOn: string;
      method: string;
      accessReadsThisMonth: number;
      shareWithCareTeam: boolean;
      adsBlocked: boolean;
    };
    disclaimer: string;
  };
  gamification: {
    levels: { name: string; min: number; max: number }[];
    pointRules: { action: string; points: number }[];
    badgeCatalog: {
      id: string;
      name: string;
      description: string;
      criterion: string;
      icon: string;
    }[];
    sampleChallenges: { title: string; rewardPoints: number }[];
    earningAnimation: unknown;
  };
  deviceCatalog: {
    id: string;
    brand: string;
    model: string;
    category: string;
    metrics: string[];
  }[];
  providerReplies: { topic: string; body: string }[];
  assistantIntents: {
    id: string;
    sampleQuestions: string[];
    keywords: string[];
    handler: string;
    responseTemplate: string;
    deepLink?: string;
  }[];
  assistantDisclaimer: string;
  localServices: {
    category: string;
    name: string;
    distanceMi: number;
    address: string;
    hours: string;
    tags: string[];
    map: { x: number; y: number };
  }[];
  recipes: {
    id: string;
    title: string;
    prepMinutes: number;
    calories: number;
    carbsG?: number;
    proteinG?: number;
    fiberG?: number;
    sodiumMg?: number;
    conditionTags: string[];
    allergens: string[];
    diet: string[];
    ingredients?: string[];
    steps?: string[];
  }[];
  recipeFilterExamples: unknown;
  identityDefaults: {
    ial: string;
    aal: string;
    credentialOptions: string[];
    method: string;
    note: string;
  };
  terminologyExamples: {
    disclaimer: string;
    loinc: Record<string, string>;
    rxnorm: Record<string, string>;
    snomed: Record<string, string>;
  };
  recordLocator: Record<string, { orgName: string; recordCount: number; lastUpdated: string }[]>;
  clinicalDocuments: Record<
    string,
    {
      id: string;
      kind: string;
      title: string;
      docDate: string;
      sourceOrg: string;
      mime: string;
      fhirType: string;
      returnedVia?: string;
      bodyText: string;
      aiRead?: string;
    }[]
  >;
  aiInsights: Record<
    string,
    {
      id: string;
      kind: string;
      title: string;
      body: string;
      basis: string[];
      surfacedOn: string;
      severity: string;
    }[]
  >;
  shareSessions: Record<
    string,
    {
      shareToken: string;
      bundleContents: string[];
      purposeOfUse: string;
      sharedWithOrg: string;
      returnSummaryDocId: string;
      note?: string;
    }
  >;
  accessLog: {
    [persona: string]: unknown;
    summaryCountThisMonth: Record<string, number>;
  } & {
    sarah: AccessEntry[];
    default: AccessEntry[];
  };
  symptomCheckins: { redFlagKeywords: string[]; redFlagResponse: string; exampleNormal: unknown };
  journey: {
    persona: string;
    steps: { stepNo: number; title: string; route: string; narration: string }[];
  };
  socialDriversReference: unknown;
}
interface AccessEntry {
  occurredAt: string;
  actor: string;
  actorRole: string;
  scope: string;
  purposeOfUse: string;
}

// ---------------------------------------------------------------------------
// Build-time inputs (repo files, resolved from the project root)
// ---------------------------------------------------------------------------

const SCHEMA_SQL_PATH = path.resolve(process.cwd(), 'spec-extracted', 'schema.sql');
const SEED_JSON_PATH = path.resolve(process.cwd(), 'spec-extracted', 'spec-seed-data.json');

/** spec-meta version of the spec this seed implements. */
const SEED_VERSION = '1.3';

function loadSchemaSql(): string {
  let ddl = fs.readFileSync(SCHEMA_SQL_PATH, 'utf8');
  // PRD §10 refinement: seed JSON carries banner severity 'sky' for six
  // personas; widen the CHECK so seed values are preserved.
  const original = "severity TEXT NOT NULL CHECK (severity IN ('gold','red')),";
  const widened = "severity TEXT NOT NULL CHECK (severity IN ('gold','red','sky')),";
  if (!ddl.includes(original)) {
    throw new Error('schema.sql drift: expected alerts.severity CHECK not found');
  }
  ddl = ddl.replace(original, widened);
  return ddl;
}

function tableNames(ddl: string): string[] {
  const names: string[] = [];
  const re = /CREATE TABLE (\w+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(ddl)) !== null) names.push(m[1]);
  return names;
}

// ---------------------------------------------------------------------------
// Deterministic parsers for display-shaped JSON values
// ---------------------------------------------------------------------------

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** "Jan 12, 2026 · Riverview Lab" → '2026-01-12' (null if no date present). */
function dateFromDetail(detail: string): string | null {
  const m = /([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/.exec(detail);
  if (!m) return null;
  const month = MONTHS_SHORT.indexOf(m[1]) + 1;
  if (month === 0) return null;
  return `${m[3]}-${String(month).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}`;
}

/** Source org from a lab `detail` string; falls back to the panel's lab org. */
function sourceFromDetail(detail: string, fallback: string): string {
  if (detail.startsWith('from ')) return detail.slice(5);
  const idx = detail.indexOf('·');
  if (idx >= 0) {
    const suffix = detail.slice(idx + 1).trim();
    if (/lab\b|clinic|home/i.test(suffix)) return suffix;
  }
  return fallback;
}

const LAB_CODE_BY_DISPLAY: Record<string, string> = {
  'Hemoglobin A1c': 'a1c',
  'Fasting glucose': 'glucose_fasting',
  'Morning glucose (14-day avg)': 'glucose_fasting',
  'Average glucose (CGM, 14-day)': 'glucose_fasting',
  'Total cholesterol': 'cholesterol_total',
  'Blood pressure': 'bp',
  'Urine albumin/creatinine': 'urine_albumin_creatinine',
  eGFR: 'egfr',
};

interface ParsedValue {
  value: number;
  value2: number | null;
  unit: string;
}

/** "124/78 — in range" → {124, 78, mmHg}; "6.1% — …" → {6.1, null, '%'}. */
function parseValueText(valueText: string, code: string): ParsedValue {
  const text = valueText.replace(/,/g, '');
  const m = /^(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?\s*([^\s—]+)?/.exec(text);
  if (!m) throw new Error(`Unparseable lab valueText: ${valueText}`);
  const value = Number(m[1]);
  const value2 = m[2] !== undefined ? Number(m[2]) : null;
  let unit = m[3] ?? '';
  if (unit === '—') unit = '';
  if (!unit && code === 'bp') unit = 'mmHg'; // JSON bpTrend.unit is "mmHg"
  return { value, value2, unit };
}

/** Strip commas and parse a number token. */
function num(s: string): number {
  return Number(s.replace(/,/g, ''));
}

interface NutritionParsed {
  calories_avg: number | null;
  calories_plan: number | null;
  fiber_g: number | null;
  fiber_goal_g: number | null;
  added_sugar_g: number | null;
  added_sugar_limit_g: number | null;
  dinner_carbs_g: number | null;
  dinner_carbs_target_g: number | null;
  sodium_mg: number | null;
  sodium_limit_mg: number | null;
  days_logged: number | null;
  days_total: number | null;
}

/**
 * Map nutrition display rows onto nutrition_summary columns. Rows whose label
 * has no column (Protein, Hydration, Carb counting accuracy) are preserved in
 * persona_raw only. First match wins per column (miguel's duplicate
 * "Days logged" rows are preserved verbatim in persona_raw).
 */
function parseNutrition(rows: NutritionRow[]): NutritionParsed {
  const out: NutritionParsed = {
    calories_avg: null,
    calories_plan: null,
    fiber_g: null,
    fiber_goal_g: null,
    added_sugar_g: null,
    added_sugar_limit_g: null,
    dinner_carbs_g: null,
    dinner_carbs_target_g: null,
    sodium_mg: null,
    sodium_limit_mg: null,
    days_logged: null,
    days_total: null,
  };
  for (const row of rows) {
    let m: RegExpExecArray | null;
    switch (row.label) {
      case 'Average calories':
        if (out.calories_avg === null && (m = /^([\d,]+) \/ ([\d,]+) plan$/.exec(row.valueText))) {
          out.calories_avg = num(m[1]);
          out.calories_plan = num(m[2]);
        }
        break;
      case 'Fiber':
        if (out.fiber_g === null && (m = /^([\d,.]+) g \/ ([\d,.]+) g goal$/.exec(row.valueText))) {
          out.fiber_g = num(m[1]);
          out.fiber_goal_g = num(m[2]);
        }
        break;
      case 'Added sugar':
        if (
          out.added_sugar_g === null &&
          (m = /^([\d,.]+) g avg — target <([\d,.]+) g$/.exec(row.valueText))
        ) {
          out.added_sugar_g = num(m[1]);
          out.added_sugar_limit_g = num(m[2]);
        }
        break;
      case 'Carbohydrates per dinner':
        if (
          out.dinner_carbs_g === null &&
          (m = /^avg ([\d,.]+) g — target <([\d,.]+) g$/.exec(row.valueText))
        ) {
          out.dinner_carbs_g = num(m[1]);
          out.dinner_carbs_target_g = num(m[2]);
        }
        break;
      case 'Sodium':
        if (
          out.sodium_mg === null &&
          (m = /^([\d,]+) mg avg — target <([\d,]+)/.exec(row.valueText))
        ) {
          out.sodium_mg = num(m[1]);
          out.sodium_limit_mg = num(m[2]);
        }
        break;
      case 'Days logged':
        if (out.days_logged === null && (m = /^(\d+) of (\d+)/.exec(row.valueText))) {
          out.days_logged = num(m[1]);
          out.days_total = num(m[2]);
        }
        break;
      default:
        break; // Protein / Hydration / Carb counting accuracy → persona_raw only
    }
  }
  return out;
}

/** range_flag for an a1c series point that is not the panel's latest result. */
function a1cSeriesFlag(p: SeriesPoint, targetMax: number | null): string {
  if (p.aboveTarget) return 'above_target';
  if (targetMax !== null && p.value > targetMax) {
    return p.value < 6.5 ? 'prediabetes' : 'above_target';
  }
  if (p.value >= 5.7 && p.value < 6.5) return 'prediabetes';
  return 'in_range';
}

// ---------------------------------------------------------------------------
// Original UI copy (Phase-2 authored). Every NUMBER/date/name comes from the
// seed JSON; the connective prose is original per project rules (UI copy is
// original; data VALUES verbatim from JSON). The JSON's coach-message rows
// carry sender/label/action but no body, and coach_messages.body is NOT NULL.
// Keyed by persona id; index matches the JSON messages[] order.
// ---------------------------------------------------------------------------

const COACH_MESSAGE_BODIES: Record<string, string[]> = {
  maria: [
    "Great work at session 9 of 16! Your next MDPP session is Tue Jun 9, 6:00 PM at Riverview Community Center — we'll talk about eating out without going off-plan.",
    "You're at 95 of 150 active minutes this week. A Saturday morning walk would close most of the gap — want a reminder?",
  ],
  robert: [
    'Your morning glucose has averaged 140 mg/dL over the last 14 days and your steps are down 22% this week. A walk after dinner tonight can help bring both back in line.',
    'I saw your Jun 5 A1c came back at 7.9%. Dr. Nguyen has an opening on Jun 18 — in the meantime, small steps still count.',
  ],
  sarah: [
    'A new visit summary from Nephrology Associates just arrived in your records. A plain-language read is ready when you are.',
    "You're down 6 lb since March — steady, real progress. Let's keep dinner carbs near your 60 g target this week.",
  ],
  jim: [
    "180 days of metformin with no missed doses — and your A1c is down to 6.6%. Keep doing what you're doing.",
    'Cheering on your 180-day streak, Jim. Same routine, next A1c around November.',
  ],
  priya: [
    'Your glucose dipped low overnight on several days this week while your time in range held at 68%. Worth a look before your next pump adjustment.',
    "Your CGM share looks good — time in range is close to your 70% goal. Happy to fine-tune pump settings whenever you're ready.",
  ],
  hector: [
    'Es hora de su metformina con el desayuno. / Time for your metformin with breakfast — logging it keeps your plan on track.',
    'Le tengo información sobre el programa de productos frescos y los viajes a la clínica. / I have details on the produce-prescription program and rides to your clinic visits.',
  ],
  linda: [
    'Your home blood pressure has averaged 146/90 over the last 14 days — above your 130/80 target. Sharing your readings with your care team can help them adjust your plan.',
    "I've aligned your four refills to one monthly pickup at the pharmacy.",
  ],
  deshawn: [
    "You're at 6,000 steps today — a 10-minute walk after dinner would put your 7,000 goal within reach.",
    "Holding steady is a win. Let's pick one small habit this week that fits your work schedule.",
  ],
  samuel: [
    "You're down 18 lb since starting — 248 lb this morning and trending toward your 220 goal. Your next semaglutide dose is Sunday.",
    "Your logs look strong. Let's keep protein around 110 g and focus on satiety-first meals this week.",
  ],
  aisha: [
    "21 days straight — you're top of your challenge group. A new weekly challenge just opened if you want to keep the streak rolling.",
    "You're topping the leaderboard this month — amazing consistency!",
  ],
  carol: [
    "This week's goals are joint-friendly: 4,000 steps and 90 low-impact minutes. AquaFit water aerobics is 1.6 miles away if you'd like a class.",
    "Your water-aerobics and seated-strength plan is ready. Gentle and steady protects your joints — that's the goal.",
  ],
  miguel: [
    'Welcome back. Logging tonight restarts your streak — your best is 14 days, and day one starts whenever you do.',
    "Let's check your CPAP use at your next visit — better sleep makes weight loss easier.",
  ],
  emily: [
    'New dinner ideas picked for you — vegetarian, peanut- and shellfish-free, and budget-friendly.',
    "Nice week of logging. Your fiber is above goal — let's keep protein and iron up on your vegetarian plan.",
  ],
};

// ---------------------------------------------------------------------------
// runSeed
// ---------------------------------------------------------------------------

export function runSeed(db: Database.Database): void {
  const ddl = loadSchemaSql();
  const tables = tableNames(ddl);
  const seed = JSON.parse(fs.readFileSync(SEED_JSON_PATH, 'utf8')) as SeedJson;
  const term = seed.terminologyExamples;

  // SNOMED codes from the JSON terminology map (illustrative; see §11.1).
  const SNOMED = term.snomed;
  // Derived problem-list rows for personas without an explicit conditions[]
  // block. Display names come from conditionDetail / planType / document text
  // in the JSON; codes from terminologyExamples.snomed. Onset dates are NOT
  // invented (NULL); only sarah's JSON-provided onsets are stored.
  const T2D = { display: 'Type 2 diabetes mellitus', snomed: SNOMED.type_2_diabetes };
  const OBESITY = { display: 'Obesity', snomed: SNOMED.obesity };
  const DERIVED_CONDITIONS: Record<string, { display: string; snomed: string | null }[]> = {
    maria: [{ display: 'Pre-diabetes', snomed: SNOMED.prediabetes }],
    robert: [T2D],
    jim: [T2D],
    priya: [{ display: 'Type 1 diabetes mellitus', snomed: SNOMED.type_1_diabetes }],
    hector: [T2D],
    linda: [T2D, { display: 'Hypertension', snomed: SNOMED.hypertension }],
    deshawn: [T2D],
    samuel: [OBESITY],
    aisha: [OBESITY],
    carol: [OBESITY, { display: 'Osteoarthritis', snomed: null }],
    miguel: [OBESITY, { display: 'Obstructive sleep apnea', snomed: null }],
    emily: [OBESITY],
  };

  // Reference personas' demo grouping per spec-meta personaGroups.
  const REFERENCE_CATEGORY: Record<string, string> = { maria: 'diabetes', robert: 'diabetes' };

  // Persona order: reference personas (JSON order), then additionalPersonas
  // (JSON natural order: sarah, jim, priya, hector, linda, deshawn, samuel,
  // aisha, carol, miguel, emily).
  const personaIds = [...Object.keys(seed.patients), ...Object.keys(seed.additionalPersonas)];
  const personaOf = (id: string): Persona => seed.patients[id] ?? seed.additionalPersonas[id];

  db.pragma('foreign_keys = OFF');

  const tx = db.transaction(() => {
    // -- drop + recreate ----------------------------------------------------
    for (const t of [...tables].reverse()) db.exec(`DROP TABLE IF EXISTS ${t}`);
    db.exec(ddl);

    // -- prepared statements ------------------------------------------------
    const ins = {
      patient: db.prepare(`INSERT INTO patients
        (id, first_name, last_name_initial, age, category, featured, plan_type, condition_detail,
         medicare_context, dual_eligible, sex, preferred_language, race_ethnicity, rurality,
         allergies, dietary_prefs, provider_org, avatar_initials)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`),
      social:
        db.prepare(`INSERT INTO social_drivers (patient_id, domain, status, z_code, note, surfaces)
        VALUES (?,?,?,?,?,?)`),
      lab: db.prepare(`INSERT INTO lab_results
        (patient_id, code, loinc, display, value, value2, unit, range_flag, collected_on, source)
        VALUES (?,?,?,?,?,?,?,?,?,?)`),
      condition:
        db.prepare(`INSERT INTO conditions (patient_id, display, snomed, onset_date, status)
        VALUES (?,?,?,?,?)`),
      observation:
        db.prepare(`INSERT INTO observations (patient_id, type, value, unit, observed_on, source)
        VALUES (?,?,?,?,?,?)`),
      medication: db.prepare(`INSERT INTO medications (patient_id, name, rxnorm, dose, timing, sort)
        VALUES (?,?,?,?,?,?)`),
      medDay: db.prepare('INSERT INTO medication_days (patient_id, date, status) VALUES (?,?,?)'),
      medEvent: db.prepare(
        'INSERT INTO med_events_today (medication_id, status, at_time) VALUES (?,?,?)'
      ),
      claim:
        db.prepare(`INSERT INTO claims_events (patient_id, kind, description, location, event_date)
        VALUES (?,?,?,?,?)`),
      nutrition: db.prepare(`INSERT INTO nutrition_summary
        (patient_id, calories_avg, calories_plan, fiber_g, fiber_goal_g, added_sugar_g,
         added_sugar_limit_g, dinner_carbs_g, dinner_carbs_target_g, sodium_mg, sodium_limit_mg,
         days_logged, days_total)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`),
      goal: db.prepare(
        'INSERT INTO goals (patient_id, metric, target, unit, label) VALUES (?,?,?,?,?)'
      ),
      coachMsg: db.prepare(`INSERT INTO coach_messages
        (patient_id, sender_name, sender_role, sender_type, avatar, avatar_style, body, sent_label,
         action_label, sort)
        VALUES (?,?,?,?,?,?,?,?,?,?)`),
      program: db.prepare(`INSERT INTO programs
        (patient_id, name, detail, status_chip, progress_current, progress_total, milestone_pct,
         milestone_goal_pct, next_session, sort)
        VALUES (?,?,?,?,?,?,?,?,?,?)`),
      care: db.prepare(`INSERT INTO care_team (patient_id, name, role, note, avatar, avatar_style, sort)
        VALUES (?,?,?,?,?,?,?)`),
      alert: db.prepare(`INSERT INTO alerts
        (patient_id, severity, title, body, cta_label, created_on, care_team_notified)
        VALUES (?,?,?,?,?,?,?)`),
      source: db.prepare(`INSERT INTO data_sources
        (patient_id, name, description, standards, last_sync_at, continuous, sort)
        VALUES (?,?,?,?,?,?,?)`),
      consent: db.prepare(`INSERT INTO consents
        (patient_id, granted_on, method, identity_credential, ial, aal, access_reads_this_month,
         share_with_care_team, ads_blocked, revoked)
        VALUES (?,?,?,?,?,?,?,?,?,?)`),
      access: db.prepare(`INSERT INTO access_log
        (patient_id, occurred_at, actor, actor_role, scope, purpose_of_use)
        VALUES (?,?,?,?,?,?)`),
      locator: db.prepare(`INSERT INTO record_locator_results
        (patient_id, org_name, record_count, last_updated)
        VALUES (?,?,?,?)`),
      doc: db.prepare(`INSERT INTO clinical_documents
        (patient_id, kind, title, doc_date, source_org, mime, fhir_type, body_text, ai_read)
        VALUES (?,?,?,?,?,?,?,?,?)`),
      insight: db.prepare(`INSERT INTO ai_insights
        (patient_id, kind, title, body, basis, surfaced_on, severity, created_on)
        VALUES (?,?,?,?,?,?,?,?)`),
      share: db.prepare(`INSERT INTO share_sessions
        (patient_id, share_token, shared_with_org, bundle_contents, purpose_of_use, shared_on,
         return_summary_doc_id)
        VALUES (?,?,?,?,?,?,?)`),
      journey: db.prepare(`INSERT INTO journey_steps (patient_id, step_no, title, route, narration)
        VALUES (?,?,?,?,?)`),
      gamification: db.prepare(`INSERT INTO gamification
        (patient_id, points, level_name, level_min, level_max, current_streak_days,
         best_streak_days, streak_habit)
        VALUES (?,?,?,?,?,?,?,?)`),
      badge: db.prepare(
        'INSERT INTO badges (id, name, description, criterion, icon, sort) VALUES (?,?,?,?,?,?)'
      ),
      patientBadge: db.prepare(`INSERT INTO patient_badges (patient_id, badge_id, earned, earned_on)
        VALUES (?,?,?,?)`),
      challenge: db.prepare(`INSERT INTO challenges
        (patient_id, title, progress_current, progress_total, reward_points, ends_on, sort)
        VALUES (?,?,?,?,?,?,?)`),
      device: db.prepare(
        'INSERT INTO device_catalog (id, brand, model, category, metrics) VALUES (?,?,?,?,?)'
      ),
      patientDevice:
        db.prepare(`INSERT INTO patient_devices (patient_id, device_id, connected, last_sync_at)
        VALUES (?,?,?,?)`),
      thread: db.prepare(
        'INSERT INTO provider_threads (patient_id, care_team_id, subject) VALUES (?,?,?)'
      ),
      threadMsg: db.prepare(`INSERT INTO provider_messages
        (thread_id, sender, body, attachment_kind, sent_label, sort)
        VALUES (?,?,?,?,?,?)`),
      reply: db.prepare('INSERT INTO provider_replies (topic, body) VALUES (?,?)'),
      slot: db.prepare(`INSERT INTO appointment_slots (patient_id, care_team_id, slot_datetime, taken)
        VALUES (?,?,?,?)`),
      intent: db.prepare(`INSERT INTO assistant_intents
        (id, sample_questions, keywords, handler, response_template)
        VALUES (?,?,?,?,?)`),
      suggested: db.prepare(
        'INSERT INTO assistant_suggested (patient_id, text, intent_id, sort) VALUES (?,?,?,?)'
      ),
      service: db.prepare(`INSERT INTO local_services
        (category, name, distance_mi, address, hours, tags, map_x, map_y)
        VALUES (?,?,?,?,?,?,?,?)`),
      recipe: db.prepare(`INSERT INTO recipes
        (id, title, prep_minutes, calories, carbs_g, protein_g, fiber_g, sodium_mg,
         condition_tags, allergens, diet, ingredients, steps)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`),
      meta: db.prepare('INSERT INTO app_meta (key, value) VALUES (?,?)'),
    };

    // -- global catalogs ----------------------------------------------------
    for (const d of seed.deviceCatalog) {
      ins.device.run(d.id, d.brand, d.model, d.category, JSON.stringify(d.metrics));
    }
    seed.gamification.badgeCatalog.forEach((b, i) => {
      ins.badge.run(b.id, b.name, b.description, b.criterion, b.icon, i);
    });
    for (const r of seed.providerReplies) ins.reply.run(r.topic, r.body);
    for (const it of seed.assistantIntents) {
      ins.intent.run(
        it.id,
        JSON.stringify(it.sampleQuestions),
        JSON.stringify(it.keywords),
        it.handler,
        it.responseTemplate
      );
    }
    for (const s of seed.localServices) {
      ins.service.run(
        s.category,
        s.name,
        s.distanceMi,
        s.address,
        s.hours,
        JSON.stringify(s.tags),
        s.map.x,
        s.map.y
      );
    }
    for (const r of seed.recipes) {
      // ingredients/steps are absent from the seed JSON; FR-29 requires them,
      // so they are authored (allergen/diet-consistent) in recipe-details.ts.
      const detail = RECIPE_DETAILS[r.id];
      ins.recipe.run(
        r.id,
        r.title,
        r.prepMinutes,
        r.calories,
        r.carbsG ?? null,
        r.proteinG ?? null,
        r.fiberG ?? null,
        r.sodiumMg ?? null,
        JSON.stringify(r.conditionTags),
        JSON.stringify(r.allergens),
        JSON.stringify(r.diet),
        JSON.stringify(r.ingredients ?? detail?.ingredients ?? []),
        JSON.stringify(r.steps ?? detail?.steps ?? [])
      );
    }

    // -- per-persona data ---------------------------------------------------
    const careTeamIds: Record<string, { id: number; member: CareRow }[]> = {};
    const docIdMap: Record<string, number> = {}; // JSON doc id → integer PK
    const docMeta: Record<string, { id: number; returnedVia?: string }> = {};
    const levelsByName = new Map(seed.gamification.levels.map((l) => [l.name, l]));

    for (const pid of personaIds) {
      const p = personaOf(pid);

      // patients
      ins.patient.run(
        pid,
        p.firstName,
        p.lastNameInitial,
        p.age,
        p.category ?? REFERENCE_CATEGORY[pid],
        p.featured ? 1 : 0,
        p.planType,
        p.conditionDetail ?? null,
        p.medicareContext,
        p.dualEligible ? 1 : 0,
        p.sex,
        p.preferredLanguage,
        p.raceEthnicity,
        p.rurality,
        p.allergies ? JSON.stringify(p.allergies) : null,
        p.dietaryPrefs ? JSON.stringify(p.dietaryPrefs) : null,
        p.providerOrg,
        p.avatarInitials
      );

      // social_drivers
      for (const s of p.socialDrivers) {
        ins.social.run(
          pid,
          s.domain,
          s.status,
          s.zCode ?? null,
          s.note,
          JSON.stringify(s.surfaces)
        );
      }

      // lab_results — panel rows in JSON order; a1c history points appended.
      // The panel's a1c row IS the latest series point (same date/value), so
      // the series' matching point is merged into the panel row, not duplicated.
      const panelFallbackSource = (() => {
        const first = p.labs[0];
        const idx = first.detail.indexOf('·');
        return idx >= 0 ? first.detail.slice(idx + 1).trim() : p.providerOrg;
      })();
      const a1cSeries = p.a1cHistory ?? p.a1cQuarterly ?? [];
      let a1cPanelSource = panelFallbackSource;
      let a1cPanelDate: string | null = null;
      for (const lab of p.labs) {
        const code = LAB_CODE_BY_DISPLAY[lab.display];
        if (!code) throw new Error(`Unknown lab display: ${lab.display}`);
        const { value, value2, unit } = parseValueText(lab.valueText, code);
        const collectedOn = dateFromDetail(lab.detail) ?? DEMO_TODAY; // CGM 14-day avg ends today
        const source = sourceFromDetail(lab.detail, panelFallbackSource);
        const loinc =
          lab.loinc ??
          term.loinc[
            code === 'a1c'
              ? 'hba1c'
              : code === 'glucose_fasting'
                ? 'fasting_glucose'
                : code === 'cholesterol_total'
                  ? 'total_cholesterol'
                  : code === 'bp'
                    ? 'blood_pressure_panel'
                    : code
          ] ??
          null;
        if (code === 'a1c') {
          a1cPanelSource = source;
          a1cPanelDate = collectedOn;
        }
        ins.lab.run(
          pid,
          code,
          loinc,
          lab.display,
          value,
          value2,
          unit,
          lab.rangeFlag,
          collectedOn,
          source
        );
      }
      const a1cTargetMax = p.a1cTarget?.max ?? null;
      for (const point of a1cSeries) {
        if (point.collectedOn === a1cPanelDate) continue; // merged with panel row
        ins.lab.run(
          pid,
          'a1c',
          term.loinc.hba1c,
          'Hemoglobin A1c',
          point.value,
          null,
          '%',
          a1cSeriesFlag(point, a1cTargetMax),
          point.collectedOn,
          a1cPanelSource
        );
      }

      // conditions — explicit (sarah) or derived from conditionDetail/planType
      const conds =
        p.conditions ??
        DERIVED_CONDITIONS[pid].map((c) => ({ display: c.display, snomed: c.snomed ?? undefined }));
      for (const c of conds) {
        ins.condition.run(
          pid,
          c.display,
          c.snomed ?? null,
          (c as ConditionRow).onsetDate ?? null,
          'active'
        );
      }

      // observations — week bars run Sat..Fri with Fri = DEMO_TODAY (fiction
      // weekday of isoFromToday(-6) is Saturday), so day i ↦ isoFromToday(i-6).
      if (p.glucose14d) {
        const start = daysFromToday(p.glucose14d.from);
        p.glucose14d.values.forEach((v, i) => {
          ins.observation.run(
            pid,
            'glucose_fasting',
            v,
            p.glucose14d!.unit,
            isoFromToday(start + i),
            'glucose meter'
          );
        });
      }
      if (p.weightMonthly) {
        for (const w of p.weightMonthly) {
          ins.observation.run(pid, 'weight', w.lb, 'lb', `${w.month}-01`, 'smart scale');
        }
      }
      if (p.stepsWeek) {
        p.stepsWeek.days.forEach((d, i) => {
          ins.observation.run(pid, 'steps', d.v, 'steps', isoFromToday(i - 6), 'fitness band');
        });
      }
      if (p.activityWeek) {
        p.activityWeek.days.forEach((d, i) => {
          ins.observation.run(
            pid,
            'active_minutes',
            d.v,
            p.activityWeek!.unit,
            isoFromToday(i - 6),
            'fitness band'
          );
        });
      }

      // medications + med_events_today (todayStatus 'n/a' → no event row).
      // Missing rxnorm backfilled by name from terminologyExamples.rxnorm.
      const medIds: { id: number; med: MedRow }[] = [];
      (p.medications ?? []).forEach((m, i) => {
        const rxnorm = m.rxnorm ?? term.rxnorm[m.name.toLowerCase().split(' ')[0]] ?? null;
        const info = ins.medication.run(pid, m.name, rxnorm, m.dose, m.timing, i);
        medIds.push({ id: Number(info.lastInsertRowid), med: m });
      });
      for (const { id, med } of medIds) {
        if (med.todayStatus !== 'taken' && med.todayStatus !== 'due') continue;
        ins.medEvent.run(id, med.todayStatus, med.takenAt ?? med.dueAt ?? null);
      }

      // medication_days — 28-day grid flattened row-major, ending at
      // DEMO_TODAY (last cell 'pending' = today; columns land Sat..Fri in the
      // demo fiction, matching the week-bar convention).
      if (p.adherence) {
        const statuses = p.adherence.grid.flat();
        statuses.forEach((status, i) => {
          ins.medDay.run(pid, isoFromToday(i - (statuses.length - 1)), status);
        });
      }

      // claims_events — refill ("ready at Maple St. Pharmacy — from claims data")
      if (p.refill) {
        const locMatch = /ready at ([^—]+?)(?: —|$)/.exec(p.refill.detail);
        ins.claim.run(
          pid,
          'refill_ready',
          p.refill.description,
          locMatch ? locMatch[1].trim() : null,
          DEMO_TODAY
        );
      }

      // nutrition_summary (display rows preserved verbatim in persona_raw)
      const nut = parseNutrition(p.nutrition);
      ins.nutrition.run(
        pid,
        nut.calories_avg,
        nut.calories_plan,
        nut.fiber_g,
        nut.fiber_goal_g,
        nut.added_sugar_g,
        nut.added_sugar_limit_g,
        nut.dinner_carbs_g,
        nut.dinner_carbs_target_g,
        nut.sodium_mg,
        nut.sodium_limit_mg,
        nut.days_logged,
        nut.days_total
      );

      // goals — fixed metric order; labels reuse JSON labels where they exist
      if (p.stepsWeek) {
        ins.goal.run(
          pid,
          'steps_daily',
          p.stepsWeek.goalDaily,
          'steps',
          `Goal ${p.stepsWeek.goalDaily.toLocaleString('en-US')} steps/day`
        );
      }
      if (p.activityWeek) {
        ins.goal.run(
          pid,
          'active_minutes_weekly',
          p.activityWeek.goalWeekly,
          'min',
          `Goal ${p.activityWeek.goalWeekly} min/week`
        );
      }
      if (p.weightGoal) ins.goal.run(pid, 'weight', p.weightGoal.lb, 'lb', p.weightGoal.label);
      if (p.a1cTarget) ins.goal.run(pid, 'a1c', p.a1cTarget.max, '%', p.a1cTarget.label);

      // coach_messages — bodies are original copy (see COACH_MESSAGE_BODIES)
      p.messages.forEach((m, i) => {
        const body = COACH_MESSAGE_BODIES[pid]?.[i];
        if (body === undefined) throw new Error(`Missing coach message body: ${pid}[${i}]`);
        ins.coachMsg.run(
          pid,
          m.senderName,
          m.senderRole,
          m.senderType,
          m.avatar,
          m.avatarStyle,
          body,
          m.sentLabel,
          m.actionLabel ?? null,
          i
        );
      });

      // programs (maria's MDPP program carries her mdpp progress block)
      p.programs.forEach((pr, i) => {
        const mdpp = p.mdpp && pr.name.startsWith('MDPP') ? p.mdpp : null;
        ins.program.run(
          pid,
          pr.name,
          pr.detail,
          pr.statusChip,
          mdpp ? mdpp.sessionsComplete : null,
          mdpp ? mdpp.sessionsTotal : null,
          mdpp ? mdpp.milestonePct : null,
          mdpp ? mdpp.milestoneGoalPct : null,
          mdpp ? mdpp.nextSession : null,
          i
        );
      });

      // care_team (ids retained for threads / appointment slots)
      careTeamIds[pid] = [];
      p.careTeam.forEach((c, i) => {
        const info = ins.care.run(pid, c.name, c.role, c.note, c.avatar, c.avatarStyle, i);
        careTeamIds[pid].push({ id: Number(info.lastInsertRowid), member: c });
      });

      // alerts — banner; JSON has no banner body → empty string (NOT NULL)
      ins.alert.run(
        pid,
        p.banner.severity,
        p.banner.title,
        '',
        p.banner.ctaLabel ?? null,
        DEMO_TODAY,
        p.banner.careTeamNotified ? 1 : 0
      );

      // data_sources — the four shared sources for every persona, plus one
      // source per connected device (continuous, like the shared device source)
      let sourceSort = 0;
      for (const s of seed.shared.dataSources) {
        ins.source.run(
          pid,
          s.name,
          s.description,
          JSON.stringify(s.standards),
          s.lastSyncAt,
          s.continuous ? 1 : 0,
          sourceSort++
        );
      }
      for (const devId of p.connectedDevices ?? []) {
        const dev = seed.deviceCatalog.find((d) => d.id === devId);
        if (!dev) throw new Error(`Unknown device id: ${devId}`);
        ins.source.run(
          pid,
          `${dev.brand} ${dev.model}`,
          dev.metrics.map((m) => m.replace(/_/g, ' ')).join(', '),
          JSON.stringify(['Device data']),
          null,
          1,
          sourceSort++
        );
      }

      // consents — shared consent + identityDefaults + per-persona read count
      ins.consent.run(
        pid,
        seed.shared.consent.grantedOn,
        seed.shared.consent.method,
        'passkey',
        seed.identityDefaults.ial,
        seed.identityDefaults.aal,
        seed.accessLog.summaryCountThisMonth[pid] ?? seed.accessLog.summaryCountThisMonth.default,
        seed.shared.consent.shareWithCareTeam ? 1 : 0,
        seed.shared.consent.adsBlocked ? 1 : 0,
        0
      );

      // access_log — sarah's explicit entries; everyone else gets the default
      const entries = pid === 'sarah' ? seed.accessLog.sarah : seed.accessLog.default;
      for (const e of entries) {
        ins.access.run(pid, e.occurredAt, e.actor, e.actorRole, e.scope, e.purposeOfUse);
      }

      // record_locator_results
      for (const r of seed.recordLocator[pid] ?? seed.recordLocator.default) {
        ins.locator.run(pid, r.orgName, r.recordCount, r.lastUpdated ?? null);
      }

      // clinical_documents (JSON string ids → integer PKs, mapped for FKs)
      for (const d of seed.clinicalDocuments[pid] ?? []) {
        const info = ins.doc.run(
          pid,
          d.kind,
          d.title,
          d.docDate,
          d.sourceOrg,
          d.mime,
          d.fhirType,
          d.bodyText,
          d.aiRead ?? null
        );
        docIdMap[d.id] = Number(info.lastInsertRowid);
        docMeta[d.id] = {
          id: docIdMap[d.id],
          ...(d.returnedVia ? { returnedVia: d.returnedVia } : {}),
        };
      }

      // ai_insights (no createdOn in JSON → DEMO_TODAY)
      for (const i of seed.aiInsights[pid] ?? []) {
        ins.insight.run(
          pid,
          i.kind,
          i.title,
          i.body,
          JSON.stringify(i.basis),
          i.surfacedOn,
          i.severity,
          DEMO_TODAY
        );
      }

      // gamification + patient_badges + challenges (only personas with a
      // gamification block in the JSON — maria/robert have none)
      if (p.gamification) {
        const g = p.gamification;
        const level = levelsByName.get(g.level);
        if (!level) throw new Error(`Unknown level: ${g.level}`);
        ins.gamification.run(
          pid,
          g.points,
          level.name,
          level.min,
          level.max,
          g.streak.current,
          g.streak.best,
          g.streak.habit
        );
        const earned = new Set(g.earnedBadges);
        for (const b of seed.gamification.badgeCatalog) {
          // ALL catalog badges seeded; locked ones render dimmed. No earned
          // dates exist in the JSON → earned_on stays NULL.
          ins.patientBadge.run(pid, b.id, earned.has(b.id) ? 1 : 0, null);
        }

        // challenges — the three sampleChallenges, deterministically assigned:
        // totals parsed from the JSON titles (4 days / 5 days / 7 days);
        // progress derived only from each persona's own JSON series; the
        // medication challenge is skipped for personas with no medications.
        const hasMeds = (p.medications ?? []).length > 0;
        let challengeSort = 0;
        seed.gamification.sampleChallenges.forEach((c) => {
          const totalMatch = /(\d+) days/.exec(c.title);
          const total = totalMatch ? Number(totalMatch[1]) : 7;
          let current = 0;
          if (c.title.startsWith('Walk')) {
            const days = p.activityWeek
              ? p.activityWeek.days.filter((d) => d.v >= 30).length
              : p.stepsWeek
                ? p.stepsWeek.days.filter((d) => d.v >= p.stepsWeek!.goalDaily).length
                : 0;
            current = Math.min(days, total);
          } else if (c.title.startsWith('Log')) {
            current = Math.min(nut.days_logged ?? 0, total);
          } else {
            if (!hasMeds) return; // inapplicable (e.g. aisha takes no medications)
            current = g.streak.habit === 'meds' ? Math.min(g.streak.current, total) : 0;
          }
          ins.challenge.run(
            pid,
            c.title,
            current,
            total,
            c.rewardPoints,
            isoFromToday(7),
            challengeSort++
          );
        });
      }

      // patient_devices (continuous → last_sync_at NULL, like the shared device source)
      for (const devId of p.connectedDevices ?? []) {
        ins.patientDevice.run(pid, devId, 1, null);
      }

      // provider_threads — one per care-team member; the opening provider
      // message body is that member's JSON `note` verbatim (only message
      // bodies present in the JSON are used). sent_label 'Today' (demo clock).
      for (const { id, member } of careTeamIds[pid]) {
        const tInfo = ins.thread.run(pid, id, member.role);
        ins.threadMsg.run(Number(tInfo.lastInsertRowid), 'provider', member.note, null, 'Today', 0);
      }

      // appointment_slots — only robert's JSON appointmentOffer provides one
      if (p.appointmentOffer) {
        const lastName = p.appointmentOffer.with.split(' ').pop() ?? '';
        const withMember = careTeamIds[pid].find((c) => c.member.name.includes(lastName));
        ins.slot.run(pid, withMember ? withMember.id : null, p.appointmentOffer.at, 0);
      }

      // assistant_suggested — no per-persona chips exist in the JSON, so each
      // persona gets the first sample question of every intent whose data the
      // persona actually has (text verbatim from sampleQuestions[0]).
      const chipIntents: { id: string; include: boolean }[] = [
        { id: 'latest_a1c', include: p.labs.some((l) => l.display === 'Hemoglobin A1c') },
        { id: 'a1c_trend', include: a1cSeries.length >= 2 },
        { id: 'glucose_tir', include: p.timeInRange !== undefined },
        { id: 'weight_progress', include: p.weightGoal !== undefined },
        { id: 'meds_today', include: (p.medications ?? []).length > 0 },
        { id: 'next_appointment', include: p.appointmentOffer !== undefined },
        { id: 'explain_term', include: true },
        { id: 'recipe_suggestion', include: true },
        { id: 'provider_questions', include: true },
      ];
      let chipSort = 0;
      for (const chip of chipIntents) {
        if (!chip.include) continue;
        const intent = seed.assistantIntents.find((i) => i.id === chip.id);
        if (!intent || intent.sampleQuestions.length === 0) continue;
        ins.suggested.run(pid, intent.sampleQuestions[0], intent.id, chipSort++);
      }
    }

    // share_sessions — sarah; shared_on derived from her JSON access-log
    // 'patient_share' entry (2026-06-05T09:10)
    for (const [pid, s] of Object.entries(seed.shareSessions)) {
      const personaEntries = pid === 'sarah' ? seed.accessLog.sarah : seed.accessLog.default;
      const sharedOn =
        personaEntries.find((e) => e.purposeOfUse === 'patient_share')?.occurredAt ?? null;
      const returnDocId = docIdMap[s.returnSummaryDocId];
      if (returnDocId === undefined)
        throw new Error(`Unknown return doc id: ${s.returnSummaryDocId}`);
      ins.share.run(
        pid,
        s.shareToken,
        s.sharedWithOrg,
        JSON.stringify(s.bundleContents),
        s.purposeOfUse,
        sharedOn,
        returnDocId
      );
    }

    // journey_steps — sarah's guided Day-in-the-Life
    for (const step of seed.journey.steps) {
      ins.journey.run(seed.journey.persona, step.stepNo, step.title, step.route, step.narration);
    }

    // app_meta — shared values + verbatim persona blobs (fixed key order)
    const metaEntries: [string, string][] = [
      ['demo_today', seed.demoToday],
      ['seed_version', SEED_VERSION],
      ['disclaimer', seed.shared.disclaimer],
      ['connection_status', seed.shared.connectionStatus],
      ['assistant_disclaimer', seed.assistantDisclaimer],
      ['consent_shared', JSON.stringify(seed.shared.consent)],
      ['identity_defaults', JSON.stringify(seed.identityDefaults)],
      ['terminology_examples', JSON.stringify(seed.terminologyExamples)],
      ['recipe_filter_examples', JSON.stringify(seed.recipeFilterExamples)],
      ['social_drivers_reference', JSON.stringify(seed.socialDriversReference)],
      ['gamification_levels', JSON.stringify(seed.gamification.levels)],
      ['gamification_point_rules', JSON.stringify(seed.gamification.pointRules)],
      ['gamification_sample_challenges', JSON.stringify(seed.gamification.sampleChallenges)],
      ['gamification_earning_animation', JSON.stringify(seed.gamification.earningAnimation)],
      ['red_flag_keywords', JSON.stringify(seed.symptomCheckins.redFlagKeywords)],
      ['red_flag_response', seed.symptomCheckins.redFlagResponse],
      ['symptom_example_normal', JSON.stringify(seed.symptomCheckins.exampleNormal)],
      ['record_locator_default', JSON.stringify(seed.recordLocator.default)],
      ['access_reads_summary', JSON.stringify(seed.accessLog.summaryCountThisMonth)],
      ['access_log_default', JSON.stringify(seed.accessLog.default)],
      ['clinical_document_index', JSON.stringify(docMeta)],
      [
        'assistant_intent_deeplinks',
        JSON.stringify(
          Object.fromEntries(
            seed.assistantIntents.filter((i) => i.deepLink).map((i) => [i.id, i.deepLink])
          )
        ),
      ],
    ];
    for (const pid of personaIds) {
      metaEntries.push([`persona_raw:${pid}`, JSON.stringify(personaOf(pid))]);
    }
    for (const [key, value] of metaEntries) ins.meta.run(key, value);
  });

  tx();

  db.pragma('foreign_keys = ON');
  const violations = db.prepare('PRAGMA foreign_key_check').all();
  if (violations.length > 0) {
    throw new Error(`Seed produced foreign key violations: ${JSON.stringify(violations)}`);
  }
}
