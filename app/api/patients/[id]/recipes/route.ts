import { NextResponse } from 'next/server';
import { findPatient, unknownPatient } from '@/lib/api-helpers';
import { filterRecipesForPatient } from '@/lib/recipe-filter';

export const runtime = 'nodejs';

/**
 * GET /api/patients/{id}/recipes?tag=&q=&diet=&allergens= — per #spec-api:
 * recipes[] + activeFilter{conditionTags[],excludedAllergens[],diet[],
 * explanation}. Filter semantics live in lib/recipe-filter.ts (shared with
 * the assistant's recipe intent); ?tag/?q/?diet/?allergens override the
 * persona auto-filter per dimension so the UI's removable chips can broaden.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const patient = findPatient(id);
  if (!patient) return unknownPatient(id);

  const url = new URL(req.url);
  const result = filterRecipesForPatient(patient, {
    tag: url.searchParams.get('tag'),
    q: url.searchParams.get('q'),
    dietCsv: url.searchParams.get('diet'),
    allergensCsv: url.searchParams.get('allergens'),
  });

  return NextResponse.json(result);
}
