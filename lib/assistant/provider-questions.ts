import { getDb } from '@/lib/db';
import { parseJsonArray, readPersonaRaw } from '@/lib/api-helpers';
import { formatShortDate } from '@/lib/demo-clock';

/**
 * Questions-for-your-provider builder (FR-27). Produces 3–5 questions
 * composed from the patient's REAL seeded values (labs, adherence, weight,
 * devices, insights, programs, diet) — rule-driven and deterministic, no
 * per-persona hardcoded strings.
 */
export function buildProviderQuestions(patientId: string): string[] {
  const db = getDb();
  const questions: string[] = [];

  // 1. A1c trend
  const a1c = db
    .prepare(
      `SELECT value, collected_on FROM lab_results
       WHERE patient_id = ? AND code = 'a1c' ORDER BY collected_on DESC, id DESC LIMIT 2`
    )
    .all(patientId) as Array<{ value: number; collected_on: string }>;
  const a1cGoal = db
    .prepare(`SELECT target FROM goals WHERE patient_id = ? AND metric = 'a1c'`)
    .get(patientId) as { target: number } | undefined;
  if (a1c.length >= 2 && a1c[0].value > a1c[1].value) {
    questions.push(
      `My A1c rose from ${a1c[1].value}% to ${a1c[0].value}% — should we adjust my medication or plan?`
    );
  } else if (a1c.length >= 1 && a1cGoal && a1c[0].value > a1cGoal.target) {
    questions.push(
      `My A1c is ${a1c[0].value}%, above my ${a1cGoal.target}% target — what should we change?`
    );
  } else if (a1c.length >= 1) {
    questions.push(`My A1c is ${a1c[0].value}% — what should I keep doing to stay on track?`);
  }

  // 2. AI insight follow-up (e.g. sarah's referral suggestion)
  const insight = db
    .prepare(
      `SELECT title, kind FROM ai_insights WHERE patient_id = ?
       ORDER BY CASE kind WHEN 'referral_suggestion' THEN 0 WHEN 'titration' THEN 1 ELSE 2 END, id
       LIMIT 1`
    )
    .get(patientId) as { title: string; kind: string } | undefined;
  if (insight?.kind === 'referral_suggestion') {
    questions.push(`The app flagged: "${insight.title}" — do you think a referral makes sense?`);
  } else if (insight?.kind === 'titration') {
    questions.push(`About my medication change — "${insight.title}" — what should I watch for?`);
  }

  // 3. Adherence
  const adherence = db
    .prepare(
      `SELECT SUM(CASE WHEN status IN ('missed','partial') THEN 1 ELSE 0 END) AS gaps
       FROM medication_days WHERE patient_id = ?`
    )
    .get(patientId) as { gaps: number | null };
  if ((adherence.gaps ?? 0) > 0) {
    questions.push(
      `I missed or partially took my medication ${adherence.gaps} time${adherence.gaps === 1 ? '' : 's'} this month — does that change anything?`
    );
  }

  // 4. Weight vs goal
  const weight = db
    .prepare(
      `SELECT value, observed_on FROM observations
       WHERE patient_id = ? AND type = 'weight' ORDER BY observed_on DESC LIMIT 1`
    )
    .get(patientId) as { value: number; observed_on: string } | undefined;
  const weightGoal = db
    .prepare(`SELECT target FROM goals WHERE patient_id = ? AND metric = 'weight'`)
    .get(patientId) as { target: number } | undefined;
  if (weight && weightGoal) {
    const gap = Math.round((weight.value - weightGoal.target) * 10) / 10;
    if (gap > 0) {
      questions.push(
        `I'm at ${weight.value} lb as of ${formatShortDate(weight.observed_on)}, ${gap} lb from my ${weightGoal.target} lb goal — is my pace healthy?`
      );
    }
  }

  // 5. Device data (CGM time in range)
  const tir = readPersonaRaw<{ timeInRange?: { inRangePct: number; target: number } }>(
    patientId
  )?.timeInRange;
  if (tir) {
    questions.push(
      `My time in range is ${tir.inRangePct}% against a ${tir.target}% target — what overnight changes would help?`
    );
  }

  // 6. Program progress (e.g. maria's MDPP)
  const program = db
    .prepare(
      `SELECT name, progress_current, progress_total FROM programs
       WHERE patient_id = ? AND progress_current IS NOT NULL ORDER BY sort LIMIT 1`
    )
    .get(patientId) as
    | { name: string; progress_current: number; progress_total: number | null }
    | undefined;
  if (program?.progress_total) {
    questions.push(
      `I'm ${program.progress_current} of ${program.progress_total} sessions into ${program.name} — what should I focus on next?`
    );
  }

  // 7. Diet/allergy fit
  const patient = db
    .prepare(`SELECT allergies, dietary_prefs FROM patients WHERE id = ?`)
    .get(patientId) as { allergies: string | null; dietary_prefs: string | null } | undefined;
  const foodAllergies = parseJsonArray<string>(patient?.allergies ?? null).filter(
    (a) => a !== 'sulfa'
  );
  const diet = parseJsonArray<string>(patient?.dietary_prefs ?? null);
  if (foodAllergies.length > 0 || diet.length > 0) {
    const constraints = [...diet, ...foodAllergies.map((a) => `${a}-free`)].join(', ');
    questions.push(`Which protein sources fit my ${constraints} plan best?`);
  }

  return questions.slice(0, 5).length >= 3
    ? questions.slice(0, 5)
    : [
        ...questions,
        'What should my next lab or check-in be, and when?',
        'Is my activity goal still right for me?',
        'Is there anything in my record I should be watching?',
      ].slice(0, 3 + Math.min(questions.length, 2));
}
