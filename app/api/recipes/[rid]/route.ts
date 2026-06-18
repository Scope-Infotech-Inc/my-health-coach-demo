import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { jsonError, parseJsonArray } from '@/lib/api-helpers';

export const runtime = 'nodejs';

/**
 * GET /api/recipes/{rid} — per #spec-api: recipe detail
 * {...,ingredients[],steps[],allergenCallout}. The caller may pass
 * ?patientId= so the allergen callout can speak to the active patient's
 * flagged allergens; without it the callout names contained allergens.
 */

interface RecipeRow {
  id: string;
  title: string;
  prep_minutes: number;
  calories: number;
  carbs_g: number | null;
  protein_g: number | null;
  fiber_g: number | null;
  sodium_mg: number | null;
  condition_tags: string;
  allergens: string;
  diet: string;
  ingredients: string;
  steps: string;
}

function listToSentence(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ rid: string }> }
): Promise<NextResponse> {
  const { rid } = await params;
  const db = getDb();
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(rid) as RecipeRow | undefined;
  if (!row) return jsonError(`Unknown recipe: ${rid}`, 404);

  const allergens = parseJsonArray<string>(row.allergens);

  const url = new URL(req.url);
  const patientId = url.searchParams.get('patientId');
  let allergenCallout: string;
  if (patientId) {
    const patient = db.prepare('SELECT allergies FROM patients WHERE id = ?').get(patientId) as
      | { allergies: string | null }
      | undefined;
    const flagged = parseJsonArray<string>(patient?.allergies ?? null).filter((a) => a !== 'sulfa');
    const hits = allergens.filter((a) => flagged.includes(a));
    if (hits.length > 0) {
      allergenCallout = `Contains ${listToSentence(hits)} — flagged in your allergy list.`;
    } else if (allergens.length > 0) {
      allergenCallout = `Contains ${listToSentence(allergens)}. None of your flagged allergens.`;
    } else {
      allergenCallout = 'Contains none of your flagged allergens.';
    }
  } else {
    allergenCallout =
      allergens.length > 0
        ? `Contains ${listToSentence(allergens)}.`
        : 'No common allergens listed.';
  }

  return NextResponse.json({
    id: row.id,
    title: row.title,
    prepMinutes: row.prep_minutes,
    calories: row.calories,
    carbsG: row.carbs_g,
    proteinG: row.protein_g,
    fiberG: row.fiber_g,
    sodiumMg: row.sodium_mg,
    conditionTags: parseJsonArray<string>(row.condition_tags),
    allergens,
    diet: parseJsonArray<string>(row.diet),
    ingredients: parseJsonArray<string>(row.ingredients),
    steps: parseJsonArray<string>(row.steps),
    allergenCallout,
  });
}
