'use client';

import React from 'react';
import Link from 'next/link';
import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { PageHeader, PlainWords, EmptyState, DemoNote } from '@/components/ui';
import { Card, FilterChip } from '@/components/ds';
import { RecipeGlyph } from './_components/RecipeGlyph';
import styles from './recipes.module.css';

interface ShapedRecipe {
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

interface ActiveFilter {
  conditionTags: string[];
  excludedAllergens: string[];
  diet: string[];
  explanation: string;
}

interface RecipesResponse {
  recipes: ShapedRecipe[];
  activeFilter: ActiveFilter;
}

interface ConsentResponse {
  revoked: boolean;
}

function titleCaseTag(tag: string): string {
  return tag.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RecipesPage() {
  const { personaId } = usePersona();

  // Per-dimension overrides let the removable chips broaden the auto-filter.
  // null = use the persona default for that dimension; an array = explicit set
  // (possibly empty, which clears the dimension).
  const [allergenOverride, setAllergenOverride] = React.useState<string[] | null>(null);
  const [dietOverride, setDietOverride] = React.useState<string[] | null>(null);
  // A removed condition tag drops out of the ranking explanation banner only;
  // the route ranks (never excludes) on tags, so we just narrow what we show.
  const [removedTags, setRemovedTags] = React.useState<string[]>([]);

  // Reset overrides whenever the persona changes.
  React.useEffect(() => {
    setAllergenOverride(null);
    setDietOverride(null);
    setRemovedTags([]);
  }, [personaId]);

  const params = new URLSearchParams();
  if (allergenOverride !== null) params.set('allergens', allergenOverride.join(','));
  if (dietOverride !== null) params.set('diet', dietOverride.join(','));
  const qs = params.toString();

  const { data, loading, error } = useApi<RecipesResponse>(
    `/api/patients/${personaId}/recipes${qs ? `?${qs}` : ''}`
  );
  const { data: consent } = useApi<ConsentResponse>(`/api/patients/${personaId}/consent`);

  const header = (
    <PageHeader
      eyebrow="Explore"
      title="Recipes for your plan"
      lede="Meals filtered to your conditions and flagged allergens, with the reason for every choice shown up front."
    />
  );

  if (consent?.revoked) {
    return (
      <>
        {header}
        <EmptyState
          icon="link_off"
          message="Your records are disconnected, so we cannot tailor recipes to your conditions or allergens. Reconnect to see your personalized list."
          actionLabel="Reconnect"
          onAction={() => {
            window.location.href = '/data-and-consent';
          }}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        {header}
        <EmptyState
          icon="error"
          message="We could not load your recipes just now. Try again in a moment."
        />
      </>
    );
  }

  if (loading && !data) {
    return (
      <>
        {header}
        <div className={styles.column} aria-busy="true">
          <div className={styles.skelBanner} />
          <div className={styles.skelGrid}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.skelCard} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!data) return header;

  const { recipes, activeFilter } = data;
  const shownTags = activeFilter.conditionTags.filter((t) => !removedTags.includes(t));

  return (
    <>
      {header}

      <div className={styles.column}>
        <section className={styles.filterBanner} aria-label="Why you are seeing these recipes">
          <span className={`material-symbols-outlined ${styles.filterIcon}`} aria-hidden="true">
            filter_alt
          </span>
          <div className={styles.filterBody}>
            <p className={styles.filterExplanation}>{activeFilter.explanation}</p>

            {activeFilter.diet.length > 0 && (
              <div className={styles.chipRow}>
                <span className={styles.chipGroupLabel}>Diet</span>
                {activeFilter.diet.map((d) => (
                  <FilterChip
                    key={`diet-${d}`}
                    label={titleCaseTag(d)}
                    onRemove={() =>
                      setDietOverride((prev) => (prev ?? activeFilter.diet).filter((x) => x !== d))
                    }
                  />
                ))}
              </div>
            )}

            {activeFilter.excludedAllergens.length > 0 && (
              <div className={styles.chipRow}>
                <span className={styles.chipGroupLabel}>Avoiding</span>
                {activeFilter.excludedAllergens.map((a) => (
                  <FilterChip
                    key={`allergen-${a}`}
                    label={`${titleCaseTag(a)}-free`}
                    onRemove={() =>
                      setAllergenOverride((prev) =>
                        (prev ?? activeFilter.excludedAllergens).filter((x) => x !== a)
                      )
                    }
                  />
                ))}
              </div>
            )}

            {shownTags.length > 0 && (
              <div className={styles.chipRow}>
                <span className={styles.chipGroupLabel}>Ranked for</span>
                {shownTags.map((t) => (
                  <FilterChip
                    key={`tag-${t}`}
                    label={titleCaseTag(t)}
                    onRemove={() => setRemovedTags((prev) => [...prev, t])}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <DemoNote icon="science">
          Demo — recipes and nutrition values are simulated, not a meal plan from your care team.
        </DemoNote>

        <p className={styles.resultCount}>
          {recipes.length === 1
            ? '1 recipe matches your plan'
            : `${recipes.length} recipes match your plan`}
        </p>

        {recipes.length === 0 ? (
          <EmptyState
            icon="restaurant"
            message="No recipes match this combination. Reset your filters to see the full set for your plan."
            actionLabel="Reset filters"
            onAction={() => {
              setAllergenOverride(null);
              setDietOverride(null);
              setRemovedTags([]);
            }}
          />
        ) : (
          <PlainWords tone="muted">
            Each card shows prep time, calories, and macros. Open one for ingredients, steps, and an
            allergen check against your profile.
          </PlainWords>
        )}

        <div className={styles.grid}>
          {recipes.map((recipe, index) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className={styles.cardLink}>
              <Card interactive>
                <div className={styles.cardInner}>
                  <div className={styles.glyphFrame}>
                    <RecipeGlyph title={recipe.title} index={index} />
                  </div>
                  <h2 className={styles.cardTitle}>{recipe.title}</h2>

                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <span
                        className={`material-symbols-outlined ${styles.metaIcon}`}
                        aria-hidden="true"
                      >
                        schedule
                      </span>
                      {recipe.prepMinutes} min
                    </span>
                    <span className={styles.metaItem}>
                      <span
                        className={`material-symbols-outlined ${styles.metaIcon}`}
                        aria-hidden="true"
                      >
                        local_fire_department
                      </span>
                      {recipe.calories} cal
                    </span>
                  </div>

                  <div className={styles.macroRow}>
                    {recipe.carbsG != null && (
                      <span className={styles.macroChip}>{recipe.carbsG} g carbs</span>
                    )}
                    {recipe.proteinG != null && (
                      <span className={styles.macroChip}>{recipe.proteinG} g protein</span>
                    )}
                    {recipe.fiberG != null && (
                      <span className={styles.macroChip}>{recipe.fiberG} g fiber</span>
                    )}
                    {recipe.sodiumMg != null && (
                      <span className={styles.macroChip}>{recipe.sodiumMg} mg sodium</span>
                    )}
                  </div>

                  {recipe.conditionTags.length > 0 && (
                    <div className={styles.tagRow}>
                      {recipe.conditionTags.map((tag) => (
                        <span key={tag} className={styles.tagChip}>
                          {titleCaseTag(tag)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
