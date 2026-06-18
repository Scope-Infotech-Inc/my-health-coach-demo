'use client';

import { GreetingHero } from './GreetingHero';
import { OverviewSection } from './OverviewSection';
import { TrendsSection } from './TrendsSection';
import { CareSection } from './CareSection';
import { ActivitySection } from './ActivitySection';
import { CoachingSection } from './CoachingSection';
import { ConsentSection } from './ConsentSection';

/**
 * The "/" patient dashboard (DESIGN-BRIEF §4, §7). Six scroll-spy sections in
 * page order — overview, trends, care, activity, coaching, consent. The same
 * section components render on desktop and mobile; layout adapts via CSS and
 * the shell switches chrome live at 880px. Every value comes from /api/*.
 */
export function Dashboard() {
  return (
    <>
      <GreetingHero />
      <OverviewSection />
      <TrendsSection />
      <CareSection />
      <ActivitySection />
      <CoachingSection />
      <ConsentSection />
    </>
  );
}
