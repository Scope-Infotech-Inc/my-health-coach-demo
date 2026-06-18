'use client';

import React, { useMemo, useState } from 'react';
import { usePersona } from '@/lib/persona-context';
import { useApi } from '@/lib/use-api';
import { PageHeader, PlainWords, StatusBanner, EmptyState } from '@/components/ui';
import { Card, Button, Tag, StatusIcon } from '@/components/ds';
import { ServiceMap, type MapPin } from './_components/ServiceMap';
import styles from './page.module.css';

/**
 * /nearby — Community services (FR-25..27). Reads GET /api/services?patientId=
 * which returns services[]{id,category,name,distanceMi,address,hours,openNow,
 * tags[],map{x,y}} already ordered for the active persona's condition and
 * social drivers. This page renders that order as a NUMBERED list paired with
 * a decorative schematic map (route-local). Category chips filter the list;
 * the simulated-location line and persona-aware ordering note are original
 * copy derived from the persona's category (from /api/patients).
 */

const CATEGORY_ORDER = [
  'urgent_care',
  'pharmacy',
  'healthy_shopping',
  'fitness',
  'trail_park',
] as const;
type Category = (typeof CATEGORY_ORDER)[number];

const CATEGORY_LABEL: Record<Category, string> = {
  urgent_care: 'Urgent care',
  pharmacy: 'Pharmacy',
  healthy_shopping: 'Healthy food',
  fitness: 'Fitness',
  trail_park: 'Parks & trails',
};

const CATEGORY_ICON: Record<Category, string> = {
  urgent_care: 'emergency',
  pharmacy: 'local_pharmacy',
  healthy_shopping: 'storefront',
  fitness: 'fitness_center',
  trail_park: 'park',
};

interface Service {
  id: number;
  category: Category;
  name: string;
  distanceMi: number;
  address: string;
  hours: string;
  openNow: boolean;
  tags: string[];
  map: { x: number; y: number };
}

interface ServicesResponse {
  services: Service[];
}

interface RosterPatient {
  id: string;
  firstName: string;
  category: string;
}
interface PatientsResponse {
  patients: RosterPatient[];
}

/** Human label for a tag slug ("low-impact" → "low-impact"); slugs are already
 *  plain words in the seed, so we only swap underscores for spaces. */
function tagLabel(tag: string): string {
  return tag.replace(/_/g, ' ');
}

/** Plain-language ordering note keyed off the persona's condition category.
 *  Original copy — explains why the list is ordered the way the API returned
 *  it. Not hardcoded data: the category comes from /api/patients. */
function orderingNote(category: string | undefined): { title: string; body: string } | null {
  switch (category) {
    case 'diabetes':
      return {
        title: 'Ordered for diabetes care',
        body: 'Pharmacies and healthy-food sources are listed first, since steady medication refills and meals shape your blood sugar most.',
      };
    case 'obesity':
      return {
        title: 'Ordered for weight management',
        body: 'Places to move and shop for fresh food are listed first, in line with the goals in your care plan.',
      };
    case 'comorbid':
      return {
        title: 'Ordered for your combined care needs',
        body: 'Pharmacies and healthy-food sources lead the list, followed by places to stay active, to cover both your conditions.',
      };
    default:
      return null;
  }
}

export default function NearbyPage() {
  const { personaId } = usePersona();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, loading, error } = useApi<ServicesResponse>(`/api/services?patientId=${personaId}`);
  const { data: roster } = useApi<PatientsResponse>('/api/patients');

  const services = useMemo(() => data?.services ?? [], [data]);

  const persona = roster?.patients.find((p) => p.id === personaId);
  const note = orderingNote(persona?.category);

  // Number every service by its position in the persona-ordered API response
  // so a pin number always matches the same card, regardless of the filter.
  const numbered = useMemo(() => services.map((s, i) => ({ ...s, index: i + 1 })), [services]);

  const visible = useMemo(
    () =>
      activeCategory === 'all' ? numbered : numbered.filter((s) => s.category === activeCategory),
    [numbered, activeCategory]
  );

  const pins: MapPin[] = useMemo(
    () =>
      visible.map((s) => ({
        index: s.index,
        x: s.map.x,
        y: s.map.y,
        name: s.name,
      })),
    [visible]
  );

  // Categories present in the data, in the canonical order.
  const presentCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => services.some((s) => s.category === c)),
    [services]
  );

  const openCount = visible.filter((s) => s.openNow).length;

  const selectedIndex =
    selectedId == null ? null : (visible.find((s) => s.id === selectedId)?.index ?? null);

  return (
    <>
      <PageHeader
        eyebrow="Explore"
        title="Nearby services"
        lede="Community places that support your care plan — pharmacies, healthy food, fitness, parks, and urgent care."
      />

      <p className={styles.locationLine}>
        <span className="material-symbols-outlined" aria-hidden="true">
          location_on
        </span>
        Near Riverview — simulated location for this demo
      </p>

      {note && <StatusBanner severity="sky" title={note.title} body={note.body} />}

      <fieldset className={styles.filterBar}>
        <legend className={styles.filterLegend}>Filter by category</legend>
        <Tag
          selected={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          aria-pressed={activeCategory === 'all'}
        >
          All
        </Tag>
        {presentCategories.map((c) => (
          <Tag
            key={c}
            icon={CATEGORY_ICON[c]}
            selected={activeCategory === c}
            onClick={() => setActiveCategory(c)}
            aria-pressed={activeCategory === c}
          >
            {CATEGORY_LABEL[c]}
          </Tag>
        ))}
      </fieldset>

      {error ? (
        <EmptyState
          icon="error"
          message="We couldn't load nearby services. Try again in a moment."
        />
      ) : loading && services.length === 0 ? (
        <div className={styles.skeletonStack} aria-hidden="true">
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.listColumn}>
            {visible.length > 0 ? (
              <PlainWords>
                Showing <strong>{visible.length}</strong>{' '}
                {visible.length === 1 ? 'place' : 'places'} near you
                {openCount > 0 ? (
                  <>
                    {' '}
                    — <strong>{openCount}</strong> open right now
                  </>
                ) : null}
                .
              </PlainWords>
            ) : null}

            {visible.length === 0 ? (
              <EmptyState
                icon="travel_explore"
                message="No places in this category near you. Choose another category to keep looking."
                actionLabel="Show all services"
                onAction={() => setActiveCategory('all')}
              />
            ) : (
              <ul className={styles.results}>
                {visible.map((s) => (
                  <li
                    key={s.id}
                    className={styles.resultRow}
                    data-selected={selectedId === s.id}
                    onMouseEnter={() => setSelectedId(s.id)}
                    onFocus={() => setSelectedId(s.id)}
                  >
                    <span className={styles.pinBadge} aria-hidden="true">
                      {s.index}
                    </span>
                    <Card padded style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.cardBody}>
                        <div className={styles.cardTopline}>
                          <h2 className={styles.serviceName}>
                            <span className="visually-hidden">{`Result ${s.index}: `}</span>
                            {s.name}
                          </h2>
                          <span className={styles.distance}>{s.distanceMi.toFixed(1)} mi</span>
                        </div>

                        <div className={styles.metaRow}>
                          <span aria-hidden="true" style={{ display: 'inline-flex' }}>
                            <StatusIcon
                              status={s.openNow ? 'in_range' : 'pending'}
                              showLabel={false}
                            />
                          </span>
                          <span className={styles.hours}>
                            {s.openNow ? 'Open now' : 'Closed now'} · {s.hours}
                          </span>
                          <span className={styles.address}>{s.address}</span>
                        </div>

                        {s.tags.length > 0 && (
                          <div className={styles.tagRow}>
                            {s.tags.map((t) => (
                              <span key={t} className={styles.tagChip}>
                                {tagLabel(t)}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className={styles.actions}>
                          <Button variant="ghost" size="sm" icon="directions">
                            Directions
                          </Button>
                          <Button variant="ghost" size="sm" icon="call">
                            Call
                          </Button>
                          <Button variant="ghost" size="sm" icon="bookmark">
                            Save
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.mapColumn}>
            <ServiceMap pins={pins} selectedIndex={selectedIndex} />
          </div>
        </div>
      )}
    </>
  );
}
