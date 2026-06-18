import { getDb } from './db';
import { parseJsonArray, readAppMetaJson, type PatientRow } from './api-helpers';

/**
 * Recipe auto-filter core (FR-29) shared by /api/patients/{id}/recipes and
 * the assistant's recipe intent. Semantics derived from the seed's own
 * recipe_filter_examples (emily's expectedMatches reproduce only this way):
 * allergens HARD-exclude; taxonomy diets (vegetarian/vegan) HARD-require;
 * conditionTags RANK (never exclude). Manual params override per dimension.
 */

export interface ShapedRecipe {
  id: string;
  title: string;
  prepMinutes: number;
  calories: number;
  carbsG: number | null;
  proteinG: number | null;
  fiberG: number | null;
  sodiumMg: number | null;
  conditionTags: string[];
  allergens: string[];
  diet: string[];
}

export interface ActiveFilter {
  conditionTags: string[];
  excludedAllergens: string[];
  diet: string[];
  explanation: string;
}

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
}

interface FilterExamples {
  [personaId: string]:
    | { requires?: { diet?: string[]; excludeAllergens?: string[]; conditionTags?: string[] } }
    | undefined;
}

const TAXONOMY_DIETS = ['vegetarian', 'vegan'];

export function listToSentence(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export interface RecipeQueryOverrides {
  tag?: string | null;
  q?: string | null;
  dietCsv?: string | null;
  allergensCsv?: string | null;
}

export function filterRecipesForPatient(
  patient: PatientRow,
  overrides: RecipeQueryOverrides = {}
): { recipes: ShapedRecipe[]; activeFilter: ActiveFilter } {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM recipes ORDER BY id').all() as RecipeRow[];
  const { tag: tagParam, q, dietCsv, allergensCsv } = overrides;

  const examples = readAppMetaJson<FilterExamples>('recipe_filter_examples') ?? {};
  const example = examples[patient.id]?.requires;

  let conditionTags: string[];
  if (example?.conditionTags) {
    conditionTags = example.conditionTags;
  } else if (patient.category === 'comorbid') {
    conditionTags = ['diabetes_friendly', 'weight_management'];
  } else if (patient.category === 'obesity') {
    conditionTags = ['weight_management'];
  } else if (patient.condition_detail?.toLowerCase().includes('hypertension')) {
    conditionTags = ['low_sodium', 'diabetes_friendly'];
  } else {
    conditionTags = ['diabetes_friendly'];
  }

  const personaAllergies =
    example?.excludeAllergens ??
    // medication allergies (e.g. sarah's sulfa) are not food allergens
    parseJsonArray<string>(patient.allergies).filter((a) => a !== 'sulfa');
  const personaDiet = example?.diet ?? parseJsonArray<string>(patient.dietary_prefs);

  const excludedAllergens =
    allergensCsv != null
      ? allergensCsv
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : personaAllergies;
  const dietAll =
    dietCsv != null
      ? dietCsv
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : personaDiet;
  const diet = dietAll.filter((d) => TAXONOMY_DIETS.includes(d));
  const nonTaxonomyDiet = dietAll.filter((d) => !TAXONOMY_DIETS.includes(d));

  let recipes: ShapedRecipe[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    prepMinutes: r.prep_minutes,
    calories: r.calories,
    carbsG: r.carbs_g,
    proteinG: r.protein_g,
    fiberG: r.fiber_g,
    sodiumMg: r.sodium_mg,
    conditionTags: parseJsonArray<string>(r.condition_tags),
    allergens: parseJsonArray<string>(r.allergens),
    diet: parseJsonArray<string>(r.diet),
  }));

  if (q) {
    const needle = q.toLowerCase();
    recipes = recipes.filter((r) => r.title.toLowerCase().includes(needle));
  }
  if (tagParam) {
    recipes = recipes.filter((r) => r.conditionTags.includes(tagParam));
  }
  recipes = recipes.filter((r) => !r.allergens.some((a) => excludedAllergens.includes(a)));
  recipes = recipes.filter((r) => diet.every((d) => r.diet.includes(d)));

  if (!tagParam) {
    const score = (tags: string[]) => tags.filter((t) => conditionTags.includes(t)).length;
    recipes = recipes
      .map((r, i) => ({ r, i, s: score(r.conditionTags) }))
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map((x) => x.r);
  }

  let explanation: string;
  if (tagParam) {
    explanation = `Showing recipes tagged ${tagParam.replaceAll('_', ' ')}.`;
  } else {
    const adjectives = [...diet, ...excludedAllergens.map((a) => `${a}-free`)];
    const lead =
      adjectives.length > 0 ? `Showing ${listToSentence(adjectives)} recipes` : 'Showing recipes';
    explanation =
      conditionTags.length > 0
        ? `${lead} for your plan — ${listToSentence(
            conditionTags.map((t) => t.replaceAll('_', ' '))
          )} first.`
        : `${lead}.`;
  }
  if (q) explanation = `Showing recipes matching "${q}". ${explanation}`;
  if (nonTaxonomyDiet.length > 0) {
    explanation += ` Your ${listToSentence(nonTaxonomyDiet)} preference is noted on your profile.`;
  }

  return {
    recipes,
    activeFilter: {
      conditionTags: tagParam ? [tagParam] : conditionTags,
      excludedAllergens,
      diet,
      explanation,
    },
  };
}
