'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { useToast } from '@/components/toast/Toaster';
import { PageHeader, EmptyState, DemoNote } from '@/components/ui';
import { Card, Button } from '@/components/ds';
import styles from './recipe-detail.module.css';

interface RecipeDetail {
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
  ingredients: string[];
  steps: string[];
  allergenCallout: string;
}

function titleCaseTag(tag: string): string {
  return tag.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** The detail route flags a clash with the persona's allergy list using this
 *  exact phrase; its absence means the recipe is clear for this persona. */
const FLAGGED_MARKER = 'flagged in your allergy list';

export default function RecipeDetailPage({ params }: { params: Promise<{ rid: string }> }) {
  const { rid } = use(params);
  const { personaId } = usePersona();
  const { pushToast } = useToast();

  const { data, loading, error } = useApi<RecipeDetail>(
    `/api/recipes/${rid}?patientId=${personaId}`
  );

  const backLink = (
    <Link href="/recipes" className={styles.backLink}>
      <span className="material-symbols-outlined" aria-hidden="true">
        arrow_back
      </span>
      All recipes
    </Link>
  );

  if (error) {
    return (
      <>
        <PageHeader eyebrow="Explore · Recipes" title="Recipe" />
        <EmptyState
          icon="error"
          message="We could not find that recipe. It may have been removed."
          actionLabel="Back to recipes"
          onAction={() => {
            window.location.href = '/recipes';
          }}
        />
      </>
    );
  }

  if (loading && !data) {
    return (
      <>
        <PageHeader eyebrow="Explore · Recipes" title="Recipe" />
        <div className={styles.column} aria-busy="true">
          <div className={styles.skelBlock} />
          <div className={styles.skelBlock} />
        </div>
      </>
    );
  }

  if (!data) return <PageHeader eyebrow="Explore · Recipes" title="Recipe" />;

  const recipe = data;
  const allergenClear = !recipe.allergenCallout.includes(FLAGGED_MARKER);

  const nutrition: { label: string; value: number | null; unit: string }[] = [
    { label: 'Calories', value: recipe.calories, unit: 'cal' },
    { label: 'Carbohydrates', value: recipe.carbsG, unit: 'g' },
    { label: 'Protein', value: recipe.proteinG, unit: 'g' },
    { label: 'Fiber', value: recipe.fiberG, unit: 'g' },
    { label: 'Sodium', value: recipe.sodiumMg, unit: 'mg' },
  ].filter((n) => n.value != null);

  const onSave = () => {
    pushToast({
      tone: 'success',
      icon: 'bookmark_added',
      message: `Saved ${recipe.title} to your recipes.`,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Explore · Recipes"
        title={recipe.title}
        lede="Ingredients, steps, and nutrition for this meal, with an allergen check against your profile."
        actions={
          <Button variant="primary" icon="bookmark_add" onClick={onSave}>
            Save recipe
          </Button>
        }
      />

      <div className={styles.column}>
        {backLink}

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <span className="material-symbols-outlined" aria-hidden="true">
              schedule
            </span>
            {recipe.prepMinutes} min prep
          </span>
          <span className={styles.metaItem}>
            <span className="material-symbols-outlined" aria-hidden="true">
              local_fire_department
            </span>
            {recipe.calories} cal
          </span>
          {recipe.diet.length > 0 && (
            <span className={styles.metaItem}>
              <span className="material-symbols-outlined" aria-hidden="true">
                eco
              </span>
              {recipe.diet.map(titleCaseTag).join(', ')}
            </span>
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

        {/* Allergen callout — icon + color always, derived from the API's
            persona-aware sentence (clear vs. clash with the flagged list). */}
        <section
          className={`${styles.allergenCallout} ${allergenClear ? styles.allergenClear : styles.allergenWarn}`}
          aria-label="Allergen check"
        >
          <span
            className={`material-symbols-outlined ${styles.allergenIcon} ${allergenClear ? styles.allergenIconClear : styles.allergenIconWarn}`}
            aria-hidden="true"
          >
            {allergenClear ? 'check_circle' : 'error'}
          </span>
          <div>
            <p
              className={`${styles.allergenText} ${allergenClear ? styles.allergenTextClear : styles.allergenTextWarn}`}
            >
              {recipe.allergenCallout}
            </p>
            {recipe.allergens.length > 0 && (
              <div className={styles.allergenChips}>
                {recipe.allergens.map((a) => (
                  <span key={a} className={styles.allergenChip}>
                    {titleCaseTag(a)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <DemoNote icon="science">
          Demo — this recipe and its allergen check are simulated. Confirm ingredients with your
          care team before changing your diet.
        </DemoNote>

        <div className={styles.bodyGrid}>
          <div className={styles.mainCol}>
            <section aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className={styles.blockTitle}>
                Ingredients
              </h2>
              <ul className={styles.ingredientList}>
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className={styles.ingredientItem}>
                    <span
                      className={`material-symbols-outlined ${styles.ingredientBullet}`}
                      aria-hidden="true"
                    >
                      circle
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="steps-heading">
              <h2 id="steps-heading" className={styles.blockTitle}>
                Steps
              </h2>
              <ol className={styles.stepList}>
                {recipe.steps.map((step, i) => (
                  <li key={i} className={styles.stepItem}>
                    <span className={styles.stepNumber} aria-hidden="true" />
                    <span>
                      <span className="visually-hidden">{`Step ${i + 1}: `}</span>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className={styles.sideCol}>
            <section aria-labelledby="nutrition-heading">
              <h2 id="nutrition-heading" className={styles.blockTitle}>
                Nutrition
              </h2>
              <Card>
                <div className={styles.nutritionPanel}>
                  {nutrition.map((n) => (
                    <div key={n.label} className={styles.nutritionRow}>
                      <span className={styles.nutritionLabel}>{n.label}</span>
                      <span className={styles.nutritionValue}>
                        {n.value}
                        <span className={styles.nutritionUnit}>{n.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <div className={styles.actions}>
              <Button variant="secondary" icon="bookmark_add" onClick={onSave} fullWidth>
                Save recipe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
