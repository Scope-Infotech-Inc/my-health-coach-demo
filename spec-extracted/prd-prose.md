PRD — HTEAP Diabetes & Obesity Demo Application (Next.js + SQLite)

-

-

-

    Product Requirements Document

## HTEAP Diabetes & Obesity Demo Application

    A fully demonstrable, interactive mock application replicating the HTEAP "Patient-Facing Apps — Diabetes and Obesity" prototypes as a responsive Next.js + SQLite web application. All interfaces are simulated; all data is fictional.

      Version: 1.3
      Date: June 11, 2026
      Status: Ready for implementation
      Audience: Engineering team
      Owner: Scope Infotech, Inc.

  0. How to consume this document (AI agents)
  1. Summary & purpose
  2. Background & context
  3. Goals and non-goals
  4. Personas & demo scenarios
  5. Information architecture & responsive behavior
  6. Functional requirements
  6.1 Gamification & rewards
  6.2 Smart device connections
  6.3 Connect with your provider
  6.4 AI assistant (chat & voice)
  6.5 Local services finder
  6.6 Healthy recipes
  6.7 Point-of-care sharing (Kill the Clipboard)
  6.8 Clinical records & document interpretation
  7. Design system specification
  8. Chart & animation specification
  9. Technical architecture (Next.js)
  10. Data: SQLite schema & seed data
  11. Simulated interfaces & API contracts
  11.1 Standards, identity & compliance mapping
  12. Accessibility requirements
  13. Acceptance criteria
  14. Out of scope
  15. Reference prototypes (embedded, normative)
  16. Machine-readable appendix (JSON)

## 0. How to consume this document (AI agents)

This file is both human-viewable and machine-readable. Parse it as follows:

- Normative prose: Sections 1–14 contain requirements. The words MUST, SHOULD, MAY are used per RFC 2119.

- Machine-readable spec blocks: Section 16 contains <script type="application/json"> elements with stable IDs: #spec-meta, #spec-requirements, #spec-design-tokens, #spec-api, #spec-seed-data. These duplicate the key facts in structured form. Where prose and JSON disagree, the JSON wins for data values and the prose wins for behavior.

- Embedded prototypes (normative visual reference): Section 15 embeds the complete HTML source of both prototypes inside <pre><code> blocks with IDs #src-prototype-mobile and #src-prototype-desktop. The source is HTML-entity-escaped; decode &lt; &gt; &amp; to reconstruct the original files. Read the textContent of these elements (entity decoding is automatic in a DOM parser). Write them to disk and open them while developing — they are the authoritative reference for layout, copy, markup patterns, CSS tokens, and chart geometry.

- SQL DDL: The reference schema is in the <pre> block with ID #sql-ddl.

- UI copy: All user-facing text MUST be taken verbatim from the embedded prototype sources where those prototypes show the screen; for screens added in v1.1/v1.2 (Sections 6.1–6.8), use the copy and values in this document and the seed appendix.

- Demo represents production: This is a simulated demo, but it is engineered to faithfully represent a production-conformant product (Section 11.1). Build behind the simulation seams defined in Section 9 so the mock layers (Aligned Network/FHIR client, identity provider, document store, terminology service, AI interpretation) can be replaced with real implementations without restructuring callers, schema, or UI. This is the core of "build it right from the beginning."

Change log — v1.3 (this revision): Made the demo roster realistic and fully representative of real CMS beneficiaries, and ensured every screen renders complete data for every persona. Personas (Section 4): each of the 13 patients now carries explicit representativeness fields — sex, preferredLanguage, raceEthnicity (OMB SPD-15 categories), medicareContext/CMS coverage pathway, dualEligible, rurality, and socialDrivers (health-related social needs, Z-coded). The Medicare framing is broadened to the full CMS coverage ecosystem (Traditional Medicare, Medicare Advantage, disability/ESRD, dual Medicare-Medicaid, Medicaid, and the CMS-administered Marketplace), with the Medicare beneficiary kept as the North Star and a defensible pathway assigned to every persona. Data completeness: all 13 personas (not just the two reference + featured) now have full authored data — structured labs, careTeam, coaching messages, programs, nutrition, activity/steps series, and at least one clinicalDocument, aiInsight, recordLocator result and accessLog — so Trends/Labs, Activity & Nutrition, Coaching & Programs, Connect, Records, and Insights render fully for each. Schema (Section 10): added representativeness columns to patients, expanded the CMS-pathway enum, and added a Z-coded social_drivers table. Fixes: reconciled the prose/seed mismatch (every persona now has a medicareContext); corrected badges that contradicted a persona's data (e.g., Aisha no longer holds diabetes/medication/prevention badges she could not have earned); added insulin to Priya's (Type 1, pump) medication list. The two reference personas (Maria, Robert) keep their prototype-verbatim on-screen copy and values; the new fields are backstage metadata. SDOH and terminology codes remain illustrative — validate against current ICD-10-CM (Z55–Z65), LOINC, RxNorm and SNOMED CT releases before any real use.

Change log — v1.2: Aligned the PRD to the "AI-Driven Chronic Care & Conversational Interoperability" directive. Edited at the source (not appended): FR-10 now includes a granular purpose-of-use audit trail; FR-13 adds Record Locator discovery; FR-14 is now IAL2/AAL2 identity via passkey/mDL; FR-25 now synthesizes structured + unstructured records. Added FR-30–FR-35 and feature Sections 6.7–6.8: point-of-care sharing ("Kill the Clipboard / Ax the Fax" — QR + FHIR bundle + returned visit summary via Smart Health Link), full-chart clinical records with unstructured documents (FHIR attachments), AI interpretive insight cards + medication-titration explainer, semantic terminology (LOINC/RxNorm/SNOMED, USCDI v3 / US Core IG), conversational symptom check-in, and a featured comorbid (Type 2 diabetes + obesity) journey persona, Sarah. Added Section 11.1 (standards/identity/compliance mapping, incl. HITRUST target) and Section 9 simulation seams. Roster is now 13 patients (2 reference + 10 varied [5 diabetes / 5 obesity] + 1 featured journey persona). Everything remains fully simulated against SQLite with zero runtime external calls; the embedded prototypes (Section 15) are unchanged and remain the design reference.

## 1. Summary & purpose

Build a demonstration web application for federal healthcare acquisition specialists that brings the two static HTEAP prototypes in this project to life as one working, interactive system. The app illustrates the CMS Health Tech Ecosystem "Patient-Facing Apps — Diabetes and Obesity" use case: a patient-facing app that connects (here: simulates connecting) to CMS Aligned Networks and, with patient consent, uses the patient's clinical and claims record to deliver personalized coaching, reminders, and risk alerts — adapting to both prevention (pre-diabetes) and active disease management.

The audience must take away an impression of the solution within minutes. The app therefore prioritizes visual fidelity to the prototypes, smooth animated data visualization, and an instant persona toggle over engineering completeness.

The app also demonstrates the full "AI-Driven Chronic Care & Conversational Interoperability" vision: a verified digital identity that unlocks the network in one tap, point-of-care record sharing that "kills the clipboard," AI interpretation of a complete chart (structured data and unstructured documents), and a continuous coaching relationship that replaces episodic, 15-minute encounters. These are simulated, but built to production-conformant shapes (Section 11.1).

Hard constraint: No real external interfaces. Every integration (Aligned Network, EHR, labs, claims, devices, identity, consent, documents, AI interpretation) is simulated inside the application against mock data in SQLite. The running app makes zero network calls to third-party services (fonts are self-hosted via next/font). This is by design, not a limitation: each integration sits behind a clean interface seam (Section 9) so a production build can substitute a real implementation without reworking the schema, API contracts, or UI.

## 2. Background & context

The CMS Health Tech Ecosystem (launched July 2025) invites health IT companies to pledge to interoperability goals. CMS Aligned Networks are health information networks that self-attest to the CMS Interoperability Framework criteria, organized in five categories: patient access and empowerment; provider access and delegation; data availability and standards compliance; network connectivity and transparency; and identity, security, and trust.

The Diabetes and Obesity category company pledge reads: "We pledge to connect to CMS Aligned Networks or personal health apps and, with patient consent, securely access relevant health data to deliver personalized support. Our diabetes and obesity tools will use this history to provide tailored guidance—offering direct assistance when appropriate and directing patients to care from a health professional when needed."

Two prototypes already exist in this project and are embedded in Section 15:

- Prototype 1 ("mobile + briefing"): a briefing page containing (a) a phone-frame mockup of the patient app with two persona states and (b) an ecosystem/data-flow explainer with Interoperability Framework alignment cards.

- Prototype 2 ("desktop"): a full desktop web-app dashboard for the same product: sidebar navigation, stat tiles, large animated-ready charts, medications and adherence, activity/nutrition, coaching, and a Data & Consent center.

Both use the "Institutional Integrity" design system (Section 7).

## 3. Goals and non-goals

## Goals

- One responsive application that renders the mobile patient-app experience (from Prototype 1's phone screen) below the breakpoint and the desktop dashboard experience (Prototype 2) at or above it, switching dynamically on resize.

- Full feature replication of both prototypes, including the briefing/ecosystem content as an in-app page.

- Animated chart rendering triggered when charts scroll into view.

- All data served from SQLite through internal API routes; deterministic seed so every demo run looks identical.

- Simulated Aligned Network sync, consent gate, and care-team alerting that make the interoperability story tangible.

- Section 508 / WCAG 2.1 AA conformance.

## Non-goals

- No real FHIR endpoints, no TEFCA/network connectivity, no real OAuth/identity providers, no real patient data, no PHI.

- Not a medical device; no real clinical logic or medical advice generation.

- No user registration, multi-tenancy, or production hardening beyond what a demo needs.

- No native mobile builds — responsive web only.

## 4. Personas & demo scenarios

The app ships with 13 fictional demo patients selectable from the demo control (a dropdown grouped "Featured," "Diabetes," and "Obesity"; the featured journey persona and the two prototype personas are pinned to the top). The roster is deliberately spread across conditions, ages, sexes, races and ethnicities, preferred languages, coverage pathways, control levels, engagement, devices, dietary needs, and social drivers of health so a presenter can show how the same screens render very different — but always complete — values and states. Switching a patient MUST swap all data instantly (client refetch, no page reload) and persist for the session.

Every persona is fully populated (v1.3). All 13 patients carry the same complete data shape, not just the two reference personas and Sarah. Each has structured labs with range flags, a careTeam, coaching messages, programs, a 7-day nutrition rollup, an activity or steps series, gamification, devices, and at least one clinicalDocument (with an AI plain-language read), one aiInsight, one recordLocator result, and an accessLog. The intent is that no screen renders empty for any persona — Trends & Labs, Activity & Nutrition, Coaching & Programs, Connect, Records, and Insights all demonstrate fully whoever is selected.

Representation & realism (v1.3). Each persona carries explicit fields so the roster mirrors the real CMS population rather than a default: sex; preferredLanguage (BCP-47, e.g. en, es, vi) to exercise multilingual support; raceEthnicity using OMB SPD-15 categories; rurality (urban / suburban / rural); dualEligible; and socialDrivers — health-related social needs (HRSN) such as food insecurity, transportation, social isolation, and language access, each tagged with an illustrative ICD-10-CM Z-code (Z55–Z65). Outcomes are deliberately not clustered by group: the best-controlled and highest-engagement personas (Jim, Aisha, Priya) are from minority groups, and the personas facing the steepest clinical or social barriers include non-minority patients (Carol, Robert), so the demo avoids reinforcing stereotypes. Where a persona's engagement is low (Hector, Miguel, Carol), the seed attributes it to a structural barrier (rural access, night-shift work, mobility limitation) rather than to the patient.

CMS coverage framing. The North Star remains the flourishing of the Medicare beneficiary, but HTEAP connects the whole CMS ecosystem (Aligned Networks span Medicare, Medicaid, CHIP, and the CMS-administered Marketplace), so every persona is assigned a concrete, defensible coverage pathway in medicareContext rather than an assumed one. The pathways used are: traditional_65plus (Robert, Sarah), advantage_65plus — Medicare Advantage (Jim), disability_under65 — Medicare via 24-month SSDI / qualifying disability (Maria, Carol), dual_eligible — Medicare + Medicaid (Linda, and Maria who is also dual), medicaid — Medicaid expansion adult (Hector, Miguel, Emily), and marketplace — CMS Marketplace QHP (Priya, DeShawn, Samuel, Aisha). This keeps Medicare central (six personas sit on a Medicare pathway, including the two reference personas and the featured journey persona) while showing the platform serving the broader CMS population. The Medicare Diabetes Prevention Program (MDPP) is a Medicare benefit, so Maria — enrolled in MDPP per the prototype — is modeled as Medicare-eligible through disability, which keeps her prototype-verbatim "MDPP" copy accurate.

## 4.1 The two reference personas (verbatim from the embedded prototypes)

   | Attribute | Maria R. — Prevention | Robert T. — Management

   | Age / plan | 58 · Prevention plan (pre-diabetes) | 67 · Type 2 diabetes management

   | Headline state | A1c 6.1% (pre-diabetes range), losing weight, enrolled in MDPP | A1c rose 7.4% → 7.9%; morning glucose drifting above target; care team alerted

   | Key features exercised | Risk scale, MDPP progress, weight trend, activity/nutrition goals, prevention resources | A1c trend with target band, 14-day glucose chart, medication list + adherence grid, refill-from-claims, care-team escalation

   | Care team | Dr. James Patel (primary care), Lisa M. (MDPP coach) | Dr. Alice Nguyen (endocrinology), Sam Ortiz RN (care manager), Coach Dana W.

These two MUST match the prototypes exactly (copy and values). The other ten reuse the identical component set and chart geometry, populated from the values in #spec-seed-data → additionalPersonas.

## 4.2 Ten additional demo patients (five diabetes, five obesity)

Compact profiles below; full structured values (labels, deltas, devices, badges, allergies, diet, plus the v1.3 labs, care team, coaching messages, programs, nutrition, activity/steps series, documents, insights, record-locator and access-log entries, and the representativeness fields in Section 4.5) are in #spec-seed-data → additionalPersonas. Each is tuned to exercise a different display state — well-controlled vs. high-risk, device-rich vs. none, high vs. low engagement, plus dietary edge cases for the recipe feature — and, as of v1.3, each is fully populated so no screen renders empty for any persona.

## Diabetes group

   | ID / name | Age | Profile & what it demonstrates

   | jim · James "Jim" Okafor | 71 | Type 2, well-controlled (A1c 6.6%, in-target band), metformin only, 180-day med streak — shows positive/“in range” states and a full badge shelf.

   | priya · Priya Nair | 34 | Type 1, CGM + insulin pump (Dexcom G7), A1c 7.1%, Time-in-Range 68% — shows device-rich profile and a time-in-range gauge visualization.

   | hector · Hector Morales | 59 | Type 2, newly diagnosed (A1c 9.2%, high/red states), just starting metformin, onboarding nudges, few badges, no devices yet.

   | linda · Linda Tran | 66 | Type 2 + hypertension (A1c 7.8%, BP 146/90 elevated), 4 medications, Omron BP cuff — shows multi-condition, BP trend, polypharmacy adherence.

   | deshawn · DeShawn Wright | 52 | Type 2, at the borderline (A1c 7.0%, weight plateau), moderate engagement — shows neutral/“holding steady” states.

## Obesity group

   | ID / name | Age | Profile & what it demonstrates

   | samuel · Samuel Greene | 45 | Obesity BMI 38 (class II), on GLP-1 (semaglutide), steady weight loss, no diabetes — shows weight-loss trajectory + injectable med schedule.

   | aisha · Aisha Khan | 29 | Obesity BMI 32, high engagement (12k steps, long streaks, leaderboard-topping), Apple Watch — shows the gamification system at full tilt.

   | carol · Carol Jenkins | 61 | Obesity BMI 41 (class III) + osteoarthritis, low activity, low-impact adapted goals — shows accessible/adaptive goal states.

   | miguel · Miguel Santos | 38 | Obesity BMI 34 + sleep apnea, weight plateau, gaps in logging — shows “needs encouragement,” missed-streak, re-engagement states.

   | emily · Emily Carter | 23 | Obesity BMI 31, vegetarian with peanut + shellfish allergies — primarily showcases recipe personalization (condition + allergy + diet filtering).

## 4.3 Featured journey persona — Sarah (Type 2 diabetes and obesity)

sarah · Sarah Whitfield, 68 is the flagship persona and the demo's recommended starting point. She is a Medicare beneficiary managing both Type 2 diabetes and obesity (A1c 7.6%, BMI 36) — the comorbid case the directive's narrative centers on. Sarah is not part of the 5/5 diabetes/obesity split; she is a thirteenth, "Featured," persona whose data is seeded to exercise every capability end-to-end: verified identity, point-of-care sharing, full-chart documents, AI interpretation, continuous coaching, devices, rewards, and provider connection. Full values in #spec-seed-data → additionalPersonas.sarah.

## 4.4 The guided "Day in the Life" journey (FR-35)

A presenter (or the patient) can run a scripted, skippable walkthrough that strings the capabilities into one story, mapping directly to the directive's narrative. Each step deep-links to the relevant screen; the journey is defined in #spec-seed-data → journey and is launchable from the Overview and from the presenter overlay (FR-20).

   | # | Step | Screen / feature

   | 1 | One-tap sign-in with a passkey / mobile driver's license — no password, no proprietary login | Identity gate (FR-14)

   | 2 | "Kill the Clipboard" at the specialist — scan a QR code to share a verified FHIR history bundle at check-in | Point-of-care sharing (6.7)

   | 3 | The visit summary returns via a Smart Health Link and lands in her records | Clinical records (6.8)

   | 4 | The AI reads the new record — plain-language summary of her medication titration plan, plus an interpretive insight flagging a subtle lab trend worth a specialist question | AI assistant + insights (6.4)

   | 5 | Continuous coaching — proactive glucose/weight nudges replace the 15-minute episodic visit | Coaching, Trends, Devices

   | 6 | She owns her data — reviews exactly who accessed her record, when, and why | Data & Consent audit trail (FR-10)

The simulated "today" is fixed at Friday, June 6, 2026 (config DEMO_TODAY=2026-06-06) so all relative dates, charts, and copy render identically in every demo. All clinical values are defined in #spec-seed-data; the two reference personas mirror the prototypes exactly.

## 4.5 Representativeness matrix (all 13 personas)

The summary below is for presenters and reviewers; the authoritative values are in #spec-seed-data (where prose and JSON disagree, the JSON wins). Every persona carries these fields: sex; preferredLanguage (BCP-47); raceEthnicity (OMB SPD-15 minimum categories — Hispanic or Latino is captured as ethnicity; race uses White, Black or African American, Asian, American Indian or Alaska Native, Native Hawaiian or Other Pacific Islander); medicareContext (CMS coverage pathway); dualEligible; rurality; and socialDrivers (HRSN). Race/ethnicity, language, and social-need values are fictional and assigned to exercise the platform's equity and multilingual features; the roster intentionally over-represents diversity relative to the Medicare population so those features can be demonstrated.

   | Persona | Age / Sex | Race / Ethnicity | Language | CMS pathway | Rurality | Primary social driver (illustrative Z-code)

   | maria · Maria R. | 58 · F | Hispanic/Latina (White) | English (bilingual Spanish) | Medicare via disability + dual Medicaid; MDPP | Urban | Food insecurity (Z59.41)

   | robert · Robert T. | 67 · M | White, non-Hispanic | English | Traditional Medicare 65+ | Suburban | Transportation insecurity (Z59.82)

   | sarah · Sarah W. (featured) | 68 · F | White, non-Hispanic | English | Traditional Medicare 65+ | Suburban | Caregiver responsibilities (Z63.6)

   | jim · James "Jim" O. | 71 · M | Black or African American (Nigerian-born) | English | Medicare Advantage | Suburban | None identified

   | priya · Priya N. | 34 · F | Asian (South Asian) | English | CMS Marketplace QHP | Urban | Medication affordability / low income (Z59.6)

   | hector · Hector M. | 59 · M | Hispanic/Latino (White) | Spanish | Medicaid (expansion adult) | Rural | Food insecurity + rural transport (Z59.41, Z59.82); limited English proficiency

   | linda · Linda T. | 66 · F | Asian (Vietnamese) | Vietnamese | Dual Medicare + Medicaid | Urban | Social isolation / lives alone (Z60.2); limited English proficiency

   | deshawn · DeShawn W. | 52 · M | Black or African American | English | CMS Marketplace QHP | Urban | Work-schedule strain (Z56.6)

   | samuel · Samuel G. | 45 · M | White, non-Hispanic | English | CMS Marketplace QHP | Suburban | None identified

   | aisha · Aisha K. | 29 · F | Asian (Pakistani) | English (Urdu secondary) | CMS Marketplace QHP | Urban | None identified (halal dietary preference)

   | carol · Carol J. | 61 · F | White, non-Hispanic | English | Medicare via disability | Rural | Transportation insecurity + mobility limitation (Z59.82)

   | miguel · Miguel S. | 38 · M | Hispanic/Latino (White) | English | Medicaid (expansion adult) | Suburban | Night-shift / work-schedule strain (Z56.6)

   | emily · Emily C. | 23 · F | White, non-Hispanic | English | Medicaid (young adult) | Urban | Food insecurity / financial strain (Z59.41)

Sex balance: 7 female, 6 male. Coverage spread: 6 on a Medicare pathway (2 traditional, 1 Advantage, 2 disability, plus dual-eligible), 2 dual-eligible, 3 Medicaid, 4 Marketplace. Language: 11 English-preferring, 1 Spanish (Hector), 1 Vietnamese (Linda), with bilingual/secondary languages noted on Maria and Aisha. The Z-codes are illustrative only — validate against the current ICD-10-CM SDOH set (Z55–Z65) before any real use, consistent with the terminology disclaimer in #spec-seed-data.

How the new fields drive the demo (not just metadata): preferredLanguage surfaces a localized greeting/coaching tip and an "Español"/"Tiếng Việt" toggle affordance for Hector and Linda; socialDrivers reorders Nearby Services and Programs (e.g., Maria and Emily surface food-resource and produce-prescription programs first; Carol and Hector surface transportation/telehealth options; Linda surfaces a senior social program); dualEligible and medicareContext set the coverage line shown on Data & Consent and the "accepts your plan" tagging in Nearby. The two reference personas (Maria, Robert) keep their prototype-verbatim on-screen copy; for them these fields drive only backstage tagging and the Data & Consent coverage line, never the normative prototype screens. Full localization of all copy is out of scope for v1.3; the fields document the capability and seam (Section 9).

## 5. Information architecture & responsive behavior

## Routes

   | Route | Content

   | / | The patient application (responsive: mobile experience <880px, desktop dashboard ≥880px).

   | /how-it-works | The briefing content from Prototype 1: takeaway strip, ecosystem data-flow diagram, Interoperability Framework alignment cards, security note. Responsive single page (tabs not required; stack the two prototype panels as sections).

   | /rewards | Gamification hub (Section 6.1): points, level, streaks, badge shelf, challenges.

   | /devices | Smart-device connections (Section 6.2): connected + available devices, simulated pairing.

   | /connect | Connect with your provider (Section 6.3): secure message threads, share-data snapshot, request guidance, appointment request.

   | /assistant | AI assistant (Section 6.4): chat + optional voice; answers grounded in the patient's mocked record; "questions for your provider" builder.

   | /nearby | Local services finder (Section 6.5): urgent care, pharmacies, healthy shopping, fitness centers, walking trails & parks.

   | /recipes | Healthy recipes (Section 6.6): condition-, allergy-, and diet-aware recipe browser with detail view.

   | /share | Point-of-care sharing — "Kill the Clipboard" (Section 6.7): the patient's shareable QR / FHIR bundle, a check-in simulation, and a log of what was shared and returned.

   | /records | Clinical records / full chart (Section 6.8): structured results plus unstructured documents (radiology reports, scanned labs, specialist notes, returned visit summaries) as viewable FHIR attachments, each with an AI plain-language read.

   | /api/* | Internal mock API (Section 11).

On desktop these appear in the sticky sidebar (Section 6 of Prototype 2 shows the pattern) grouped as My Health (Overview, Trends & Labs, My Records, Care & Medications, Activity & Nutrition, Coaching & Programs, Rewards), Explore (AI Assistant, Recipes, Nearby Services), and My Account (Devices, Connect with Provider, Share at Check-in, Data & Consent). On mobile they live behind the bottom-tab More screen (a simple list), keeping the primary tab bar to five items; an "AI insight" entry and the "Share at check-in" action are also surfaced directly on the Home screen for the guided journey.

## Responsive switching (FR-3, P0)

- Breakpoint: 880px (matches both prototypes' internal collapse point).

- <880px — Mobile experience: replicate the phone screen from Prototype 1 full-bleed (navy app header with greeting + connection status, stacked cards). The phone bezel/frame itself is NOT rendered — the device is the frame. A bottom tab bar (Home · Trends · Care · Coach · More) extends navigation to the desktop-only sections; those screens reuse the same mobile card language. The "Home" tab content is normative per Prototype 1; the other tabs are derived from Prototype 2 content restyled as mobile cards.

- ≥880px — Desktop experience: replicate Prototype 2 exactly: utility banner, app header, demo scenario bar, sticky sidebar with gold active indicator and scroll-spy, sectioned dashboard grid, footer.

- Switching MUST happen live on viewport resize (e.g., matchMedia('(min-width: 880px)') + useSyncExternalStore), preserving persona selection and scroll position. No full page reload.

- Inner desktop grid collapse points 1100px and 700px follow Prototype 2's CSS.

## 6. Functional requirements

Priorities: P0 demo-blocking &nbsp;P1 expected &nbsp;P2 nice-to-have. The same list is machine-readable in #spec-requirements.

   | ID | P | Requirement

   | FR-1 | P0 | Visual parity. Replicate the embedded prototypes' design: same tokens, layout, components, chart geometry, and verbatim UI copy. The prototypes are the acceptance reference.

   | FR-2 | P0 | Patient/persona toggle. Demo control switches the active patient across the full grouped roster (Section 4 — Featured / Diabetes / Obesity) everywhere in the app; data swaps without reload; selection persists per session (cookie or localStorage). (Maria and Robert are the verbatim reference personas; see FR-21 for the full roster.)

   | FR-3 | P0 | Responsive view switching per Section 5 — mobile experience <880px, desktop ≥880px, live on resize.

   | FR-4 | P0 | Overview. Greeting with simulated date; persona-appropriate banner (Robert: gold A1c alert with "Schedule Jun 18, 10:30 AM" CTA; Maria: red-container pre-diabetes banner); five stat tiles with deltas, per seed data.

   | FR-5 | P0 | Trends & Labs. Robert: quarterly A1c line chart with shaded <7.5% target zone and red latest point; 14-day fasting-glucose line with 80–130 shaded band. Maria: A1c risk-scale graphic (normal/pre-diabetes/diabetes zones, marker at 6.1%); six-month weight line with dashed gold goal line; lab history list with in-range/elevated status icons.

   | FR-6 | P0 | Care & Medications (Robert). Today's medication list with taken/due states; refill-ready row sourced from simulated claims; 4-week adherence grid (26/28, one partial, one missed, today pending); care-team cards.

   | FR-7 | P0 | Care & Prevention (Maria). MDPP program card with sessions progress (9/16) and 5% weight-milestone progress bars; care-team cards; escalation rule copy ("If your next A1c reaches 6.5%...").

   | FR-8 | P0 | Activity & Nutrition. Weekly bar charts (Maria: activity minutes vs 150/week; Robert: steps vs 7,000/day goal line) with "today" bar in gold; nutrition 7-day progress bars per seed data.

   | FR-9 | P0 | Coaching & Programs. Message feed mixing human coach and "Concept App" auto-coaching entries with timestamps and action buttons; benefit-matched program list with status chips (Active/Eligible/Suggested/Available/Near you).

   | FR-10 | P0 | Data & Consent center. Connected sources with last-sync timestamps and standards chips; consent summary (granted Mar 3, 2026, IAL2/AAL2 identity per FR-14); sharing toggles; "Revoke all access" action. Now includes a viewable, granular audit trail (replacing the bare access count): each entry shows actor, timestamp, data scope, and purpose of use (treatment vs. individual access vs. patient-directed share), per the directive's auditability requirement (Section 11.1).

   | FR-11 | P0 | Animated charts. Per Section 8: animate on first scroll-into-view; respect prefers-reduced-motion.

   | FR-12 | P0 | SQLite + internal API. All displayed data is read from SQLite via the API contracts in Section 11. No hardcoded data in components (chart geometry constants excepted).

   | FR-13 | P1 | Simulated sync with Record Locator. "Sync now" in Data & Consent shows a syncing state (simulated 400–1200ms), then updates "last sync" timestamps and shows a success toast. The sync first runs a simulated Record Locator step that discovers which organizations hold records for the patient ("found records at 3 organizations") before fetching — representing the directive's Record Locator requirement to reduce query load and ensure completeness. Deterministic.

   | FR-14 | P1 | Simulated identity & consent gate (IAL2/AAL2). On first visit (or after revoke), a gate simulates verified digital identity at IAL2/AAL2 using a passkey or mobile driver's license (mDL) — a one-tap, passwordless sign-in — followed by scoped (SMART on FHIR / OAuth 2.0) authorization before the dashboard loads. "Revoke all access" returns the app to disconnected empty states with a reconnect path. (Theatrical: no real identity provider; see Section 11.1 swap seam.)

   | FR-15 | P1 | Simulated care-team alert. Robert's A1c alert exists in seed. A demo control "Replay alert" re-fires it: toast + banner highlight + new coaching feed entry, demonstrating record-driven escalation.

   | FR-16 | P1 | Demo reset. One control (and POST /api/demo/reset) restores the database to the seed state.

   | FR-17 | P1 | How-it-works page replicating Prototype 1's briefing panels (takeaway strip, data-flow columns, framework cards, security note), responsive.

   | FR-18 | P1 | Accessibility per Section 12.

   | FR-19 | P2 | Count-up tiles. Stat tile numbers count up on first view (700ms), consistent with chart animation rules.

   | FR-20 | P2 | Presenter notes. Pressing ? opens an overlay summarizing the demo script (persona stories, what to click). Hidden from normal flow.

   | FR-21 | P0 | Expanded roster. All 13 demo patients (Section 4 — 2 reference + 10 varied [5 diabetes / 5 obesity] + featured comorbid persona Sarah) selectable from a grouped demo control; every screen renders correctly for each from SQLite. Data in #spec-seed-data.

   | FR-22 | P0 | Gamification & rewards (Section 6.1): points, level, streaks, earned/locked badge shelf, and active challenges; earning animations on achievement.

   | FR-23 | P0 | Smart-device connections (Section 6.2): catalog of major-brand devices with connected/available states and a simulated pairing flow that begins feeding the relevant data series.

   | FR-24 | P1 | Connect with provider (Section 6.3): secure message threads with simulated replies, a "share a data snapshot" action, "request guidance," and an appointment-request flow.

   | FR-25 | P0 | AI assistant — chat & record interpretation (Section 6.4): deterministic, intent-based assistant answering questions about the patient's own mocked data, synthesizing across structured results and unstructured documents (FR-31); cites the in-app source; clearly labels AI output vs. clinical judgment; appends a not-medical-advice disclaimer; provides plain-language explanations (incl. medication titration). No external LLM at runtime; the engine sits behind a swap seam (Section 9) so production can substitute a governed model behind the same contract.

   | FR-26 | P1 | AI assistant — voice (Section 6.4): optional speech input/output via the browser-native Web Speech API; graceful text-only fallback when unavailable. No external speech service.

   | FR-27 | P1 | Questions-for-your-provider builder (Section 6.4): assistant proposes tailored questions from the patient's data; patient can save them and push to a provider thread (FR-24).

   | FR-28 | P0 | Local services finder (Section 6.5): category-filterable list (urgent care, pharmacies, healthy shopping, fitness centers, walking trails & parks) over a seeded fictional local dataset with a schematic (non-tile) map; no external map service.

   | FR-29 | P0 | Healthy recipes (Section 6.6): recipe browser auto-filtered to the active patient's condition, allergies, and dietary preferences, with macro/nutrition tags and a detail view; manual filters override.

   | FR-30 | P0 | Point-of-care sharing — "Kill the Clipboard / Ax the Fax" (Section 6.7): the patient shares a verified FHIR history bundle via a QR code at check-in (simulated), and a structured visit summary returns via a (mock) Smart Health Link into their records — replacing paper intake forms and faxes. Each share/return is recorded in the audit trail (FR-10).

   | FR-31 | P0 | Clinical records / full chart with unstructured documents (Section 6.8): a records view shows structured results plus unstructured documents (radiology reports, scanned/faxed labs, specialist notes, returned visit summaries) as FHIR attachments (PDF/TIFF/JPG), each with a viewer and an AI plain-language read. Delivers the directive's "full-chart context."

   | FR-32 | P0 | AI interpretive insight cards (Section 6.4): the assistant proactively surfaces synthesized insights — e.g., a subtle multi-result trend suggesting a question about a specialist referral, or a plain-language medication-titration explanation — rendered as cards on Overview/Trends and clearly badged AI-generated, not clinical judgment with an escalation path.

   | FR-33 | P1 | Semantic interoperability. Labs, medications, and conditions carry LOINC, RxNorm, and SNOMED CT codes in the data model and are exposed in document/detail views; standards are stated as USCDI v3 / US Core IG throughout (replacing generic "USCDI" wording). Codes are illustrative and MUST be validated against current official value sets (Section 11.1).

   | FR-34 | P2 | Conversational symptom & care-plan check-in (Section 6.4): the assistant can log a symptom or daily check-in and track adherence to specialist instructions, with red-flag symptom input triggering a direct-to-care safety response (no diagnosis).

   | FR-35 | P1 | Featured persona & guided journey (Sections 4.3–4.4): comorbid Type 2 diabetes + obesity persona Sarah, plus a skippable, step-through "Day in the Life" journey (identity → QR share → returned visit summary → AI interpretation → continuous coaching → audit) launchable from Overview and the presenter overlay (FR-20).

Mobile primary bottom-tab bar = Home · Trends · Care · Coach · More. The More screen lists Rewards, AI Assistant, Recipes, Nearby Services, Devices, Connect with Provider, How it works, and Data & Consent. Each opens the same data restyled as mobile cards.

## 6.1 Gamification & rewards

Goal: reward patients for healthy actions to encourage app use and adherence, without trivializing health. Tone stays clinical and encouraging — points and badges, not slot-machine mechanics. Reuse design tokens: gold is the achievement accent (earned badges, level ring), navy for structure, sky for card headers.

## Model

- Points awarded for actions: logging a meal, hitting a daily step/activity goal, taking all meds for a day, syncing a device, completing an MDPP/DSMES session, reading a coaching tip, viewing a recipe. Point values in #spec-seed-data → gamification.pointRules.

- Level derived from cumulative points (e.g., Bronze/Silver/Gold/Platinum tiers); show a circular progress ring to the next level.

- Streaks for consecutive days of a habit (logging, meds, activity). Show current and best streak; a broken streak is shown gently (no red shaming — use slate), with a one-tap "restart streak" encouragement.

- Badges — earned or locked (locked shown dimmed with the unlock criterion). Catalog of ~12 in #spec-seed-data → gamification.badgeCatalog, e.g. First Connection, 7-Day Logging Streak, Step Champion (7k × 7 days), Move Maker (150 active min/week), A1c Improver, Milestone — 5% Weight, 30-Day Med Adherence, Hydration Hero, Recipe Explorer, Device Connector, Coach Conversation, Prevention Graduate.

- Challenges — time-boxed goals (e.g., "Walk 30 minutes, 4 days this week") with a progress bar and reward on completion.

## Screens & behavior

- /rewards hub: level ring + total points tile, current/best streak tiles, badge shelf grid (earned bright, locked dim), and a challenges list with progress bars. On Overview, a compact "Rewards" stat tile shows level + points and links here.

- Earning moment: when an action crosses a threshold (or via the demo "award badge" control), show a celebratory toast + a badge "pop-in" animation (scale 0.6→1 + gold glow, 500ms; respects prefers-reduced-motion) and an aria-live="polite" announcement.

- Per-persona earned sets differ to show range: aisha (11/12) and jim (9/12) have nearly full shelves and long streaks; hector and miguel have few badges and a broken streak (re-engagement state). Earned badges must be consistent with a persona's actual data — e.g., aisha takes no medication, so "30-Day Med Adherence" stays locked (shown dimmed with its criterion), and condition-specific badges ("A1c Improver," "Prevention Graduate") appear only where the seed supports them. Values in seed (earnedBadges + lockedBadgeNote).

Simulation: points/streaks/badges are precomputed in the seed per patient. A demo control "Earn a badge" (and POST /api/gamification/award) fires the earning animation deterministically. No real event pipeline.

## 6.2 Smart device connections

Goal: show how patient-generated data flows in from popular consumer health devices — all simulated. The device catalog references real major brands for realism; no real Bluetooth, no vendor SDK, no cloud API is called. "Pairing" is a scripted modal.

## Device catalog (seeded)

   | Category | Example devices (brands shown for realism only) | Feeds data series

   | Smartwatch / band | Apple Watch, Fitbit Charge, Garmin, Samsung Galaxy Watch, Oura Ring | steps, active minutes, heart rate, sleep

   | Smart scale | Withings Body, Fitbit Aria, Eufy Smart Scale, iHealth | weight, BMI, body-fat %

   | Blood-pressure cuff | Omron Evolv, Withings BPM, iHealth Track | systolic/diastolic BP

   | Continuous glucose monitor | Dexcom G7, Abbott FreeStyle Libre 3 | continuous glucose / time-in-range

   | Blood-glucose meter | Contour Next, Accu-Chek Guide | fingerstick glucose readings

Full list with logos-as-initials, supported metrics, and per-persona connected state in #spec-seed-data → deviceCatalog and each persona's connectedDevices. (priya has a Dexcom G7; aisha an Apple Watch; linda an Omron cuff; hector none.)

## Screens & behavior

- /devices: "Connected" section (device name, last-sync time, metrics it provides, "Sync" + "Disconnect") and "Available to connect" grid grouped by category.

- Simulated pairing: "Connect" opens a modal with scripted steps ("Searching… / Found device / Confirm pairing") over a simulated 1–2s delay, then marks it connected, sets last_sync_at = demo-now, awards the Device Connector badge (first time), and begins surfacing that device as a source in Data & Consent. Deterministic.

- Connecting a CGM (Dexcom/Libre) for a diabetes persona reveals a time-in-range visualization on Trends; connecting a BP cuff reveals a BP trend card; connecting a scale enriches the weight series. These cards render only when the relevant device/series exists.

- "Disconnect" returns the device to Available and hides device-only cards (graceful empty state).

## 6.3 Connect with your provider

Goal: let the patient share information with, and request guidance from, their care team — reinforcing the use-case pledge ("offering direct assistance when appropriate and directing patients to care from a health professional when needed"). Fully simulated secure messaging.

## Features

- /connect: a list of provider threads (one per care-team member from the persona's seed) with a conversation view styled like the Coaching feed (navy/gold avatars, timestamps).

- Share a data snapshot: a "Share my latest data" action lets the patient pick what to attach (latest labs, glucose trend, weight, med adherence, activity) and posts a snapshot card into the thread. The shared scope is logged in Data & Consent's access log.

- Request guidance: a templated message ("I have a question about my recent A1c / my medication / my plan…") that posts to the thread and produces a simulated provider reply after a short delay, drawn from a small seeded response bank keyed to topic. Replies always include a safety line directing to in-person/urgent care for red-flag symptoms.

- Request an appointment: shows simulated open slots (seeded) and confirms a selection with a confirmation card and a calendar-style summary. For robert, the Overview banner CTA ("Schedule Jun 18, 10:30 AM") deep-links here.

Simulation & safety: provider replies come from #spec-seed-data → providerReplies (topic-keyed, deterministic delay). The app MUST NOT present simulated replies as real medical advice; every thread shows a persistent "Demo — simulated provider responses" label, consistent with the global fictional-data banner.

## 6.4 AI assistant — conversational interpretation (chat & voice)

Goal: the assistant is the directive's "real-time AI interpreter." The patient can type or speak questions about the information in the app, get plain-language answers grounded in their own (mocked) record — synthesizing across structured results and unstructured documents (FR-31) — receive proactive interpretive insights, and get help preparing questions for their provider. No external LLM or speech cloud service is called at runtime (see the swap seam below).

## Engine (deterministic, local)

- Implement an intent classifier over a fixed intent set (keyword/regex + simple synonyms) that maps a question to a handler which reads the active patient's SQLite data — including coded labs (LOINC), meds (RxNorm), conditions (SNOMED), and the text of unstructured documents — and fills a response template. Example intents: latest A1c, glucose trend / time-in-range, weight progress, next medication / did I take it, refill status, next appointment, what is pre-diabetes / A1c / BMI, activity vs goal, today's recipe suggestion, explain my new medication plan (titration), summarize my latest visit, what should I ask my doctor, log a symptom / daily check-in.

- Unmatched questions return a safe fallback ("I can answer questions about your labs, medications, activity, weight, appointments, and recipes…") plus suggested chips. The engine never fabricates clinical values — it only reflects seeded data.

- Every substantive answer cites the in-app source ("from your Jun 5 lab result") and ends with a not-medical-advice disclaimer directing to the care team for decisions; symptom-like inputs return a direct-to-care safety response.

- Suggested-question chips are tailored to the active persona (e.g., robert: "Why did my A1c go up?"; emily: "Show me peanut-free dinner ideas").

## Voice (optional, browser-native)

- Mic button uses the Web Speech API (SpeechRecognition for input, speechSynthesis for spoken replies) — entirely in-browser. If the API is unavailable, hide the mic and show "Voice not supported in this browser" — text chat still works. No audio leaves the browser.

- Show a listening indicator while recording; transcribe into the input; respect a visible "stop" control.

## Interpretive insight cards (FR-32) — the "Diagnostic/Interpretive Assistant"

- Beyond answering questions, the assistant proactively surfaces synthesized insights as cards on Overview and Trends — the directive's "connect the dots a human might miss." Each insight is precomputed in the seed (ai_insights) from a rule across multiple data points, so it is deterministic and reviewable. Examples: for sarah, "Your last three labs show a slow rise in urine albumin alongside your A1c — worth asking about a kidney/specialist referral"; a plain-language read of a returned visit summary's medication titration plan ("your metformin increases to 1000 mg twice daily over 2 weeks — here's what that means").

- Every insight card is clearly badged "AI-generated — informational, not a diagnosis or clinical judgment," names the data it drew on, and carries an escalation action ("Ask my care team" → opens a provider thread, Section 6.3). This satisfies the directive's "clearly distinguish AI results from clinical judgment" requirement.

## Symptom & care-plan check-in (FR-34)

- The assistant can record a quick symptom or daily check-in (e.g., "feeling dizzy this morning") and track adherence to specialist instructions from the care plan. Entries are stored (symptom_checkins) and reflected back ("logged — I'll note this for your next visit").

- Safety gate: red-flag inputs (e.g., chest pain, severe hypoglycemia symptoms, vision loss) return an immediate direct-to-care response ("This may need urgent attention — please contact your care team or 911/urgent care now"), never a diagnosis. Keyword list in seed.

## Questions-for-your-provider builder

- The what should I ask my doctor intent (and a button on /assistant) generates 3–5 tailored questions from the patient's data (e.g., for robert: "My A1c rose to 7.9% — should we adjust my medication?"). The patient can save the list and "Send to my provider," which posts it into a thread (Section 6.3) and can award the Coach Conversation badge.

Hard constraint & production swap seam: at runtime the assistant is a deterministic, on-device template engine over mocked SQLite data — not a language model — which keeps the demo repeatable, safe, and free of external calls. It MUST be unmistakable in the UI (persistent "Demo assistant — not medical advice" note). Critically, it sits behind a single interface (lib/assistant/interpret.ts, Section 9): a production build can replace the deterministic engine with a governed clinical model behind the identical request/response contract and the same guardrails, so no caller, schema, or UI change is needed. This is how the demo represents "real-time AI interpretation" without taking on model risk today.

## 6.5 Local services finder

Goal: help patients find nearby resources that support their plan. Uses a seeded fictional local dataset; no real geolocation, no external map/place API, no map tiles.

## Features

- /nearby: category filter chips — Urgent care, Pharmacies, Healthy shopping, Fitness centers, Walking trails & parks — plus an "All" view. A simulated location is shown ("Near Riverview, demo location").

- Result cards: name, category, distance (seeded miles), hours/open-now (derived from DEMO_TODAY time), address, tags (e.g., "accepts your plan," "diabetic-friendly produce," "indoor track," "flat / paved" for trails), and contextual actions ("Get directions" → opens a non-functional confirmation; "Call" / "Save").

- Schematic map: a stylized SVG map panel (navy/sky, abstract streets) with numbered pins matching the list — no real tiles or coordinates. Hovering/selecting a card highlights its pin.

- Personalization: ordering/tagging nudges by persona — e.g., diabetes personas surface pharmacies + diabetic-friendly grocers; obesity personas surface fitness centers, trails, and healthy shopping first; carol (osteoarthritis) gets "low-impact" / "accessible" fitness and "flat, paved" trail tags emphasized.

Dataset (≈4–6 places per category) in #spec-seed-data → localServices.

## 6.6 Healthy recipes

Goal: surface recipes tailored to the patient's condition, allergies, and dietary preferences. Seeded recipe catalog; no external recipe API.

## Features

- /recipes: a card grid auto-filtered to the active patient. Filtering combines (a) condition tags — diabetes personas favor low-glycemic / carb-controlled; obesity personas favor lower-calorie / high-satiety; hypertension comorbidity (linda) adds low-sodium; (b) allergen exclusion from the persona's allergies (e.g., emily: peanut, shellfish excluded); (c) diet from dietaryPrefs (e.g., emily: vegetarian).

- Each recipe card: title, image-as-illustration (inline SVG/initials block — no external images), prep time, calories, key macros (carbs/protein/fiber/sodium), and tags ("Diabetes-friendly," "Low-sodium," "Vegetarian," "Heart-healthy," "High-fiber").

- Active filter banner: a sky-tinted bar states why results are filtered ("Showing vegetarian, peanut- and shellfish-free recipes for your plan"), with removable filter chips so the patient can broaden manually.

- Recipe detail view: ingredients, steps, full nutrition panel, an allergen callout ("Contains: none of your flagged allergens"), and a "Save" / "Add to this week" action that can award the Recipe Explorer badge.

- The AI assistant's recipe intent (Section 6.4) deep-links here with filters pre-applied.

Catalog (≈10–14 recipes spanning tag combinations) in #spec-seed-data → recipes; each carries conditionTags, allergens, diet, and macros so the filter logic is testable.

## 6.7 Point-of-care sharing — "Kill the Clipboard / Ax the Fax"

Goal: demonstrate the directive's flagship interoperability moment — the patient shares a verified history at check-in instead of filling paper forms, and the visit summary flows back automatically. Fully simulated: no real QR scanning, no real FHIR endpoint, no real Smart Health Link service.

## Outbound — share at check-in

- /share shows the patient's shareable QR code (a rendered placeholder QR — encodes a mock share token, not real PHI) and a plain-language list of what it would share: a FHIR history bundle (conditions, meds, allergies, recent labs, vitals) scoped by consent.

- A "Simulate check-in at a specialist" control plays the scripted flow: front desk "scans" the code → a confirmation card shows the bundle was shared with, e.g., "Lakeside Cardiology" → the share is written to the audit trail with purpose-of-use = treatment (FR-10).

- Ties to the use-case story: this is "Ax the Fax / Kill the Clipboard" — the patient never re-enters history or faxes records.

## Inbound — the visit summary returns

- After the simulated visit, a structured visit summary returns via a (mock) Smart Health Link and is stored as a document (clinical_documents, kind visit_summary) visible in My Records (6.8).

- Its arrival fires a notification and an AI interpretive read (6.4 / FR-32): a plain-language summary including any medication-titration change, plus an "ask your care team" escalation. For sarah this is journey step 3→4.

Simulation: the QR encodes a mock token; "scanning" is a button. The bundle contents and the returned visit summary are seeded (share_sessions, clinical_documents). Behind the swap seam (Section 9) the same flow maps to a real FHIR $everything export, a real SMART Health Link, and a real Aligned Network endpoint without UI change.

## 6.8 Clinical records & document interpretation (full chart)

Goal: deliver the directive's "full-chart context" — not just structured numbers, but the unstructured documents that carry much of the clinical story, each made understandable by the AI. Simulated: mock documents, no real document store or OCR.

## Records view

- /records lists the patient's chart as a timeline: structured results (labs/vitals with LOINC codes, meds with RxNorm, conditions with SNOMED — FR-33) and unstructured documents rendered as FHIR DocumentReference attachments: a radiology report (PDF), a scanned/faxed outside lab (TIFF/JPG), a specialist consult note (PDF), and returned visit summaries (from 6.7).

- Documents open in a simple in-app viewer. Because the demo cannot render real TIFF/PDF binaries meaningfully, each document is a styled mock: a representative header/body rendered from seeded text plus a "scanned document" visual treatment; the point is to show the type and the AI's handling, not real file decoding.

- Each document carries a one-tap "Explain this" AI read (6.4): a plain-language summary, key extracted values (shown with their codes), and a not-clinical-judgment badge.

## Semantic interoperability surfaced (FR-33)

- Coded values are visible on hover/expand (e.g., "Hemoglobin A1c — LOINC 4548-4"; "metformin — RxNorm 6809"; "Type 2 diabetes mellitus — SNOMED 44054006"), demonstrating LOINC/RxNorm/SNOMED conformance. Codes are illustrative and flagged for validation (Section 11.1).

- This view is the natural home for the directive's "USCDI v3 / US Core" framing — a small standards chip on the records header states the profile each item conforms to.

Accessibility note: document mocks MUST expose their text content to assistive tech (the "scanned" look is a visual layer only; the underlying text is real DOM, not an image of text), and the AI read provides an accessible plain-text equivalent for any image-style document.

## 7. Design system specification — "Institutional Integrity"

Tokens are duplicated as JSON in #spec-design-tokens. The embedded prototype CSS is the working reference implementation of these tokens.

## Color roles

   | Token | Hex | Usage

   | navy (primary) | #112E51 | Headers, sidebar, primary buttons, chart strokes, brand elements

   | navy-mid | #2E486C | Hover states, secondary chart strokes, secondary avatars

   | sky (secondary) | #E1F3F8 | Card headers, info callouts, success states, chart target zones

   | gold (tertiary) | #FDB81E | Reserved for attention: demo banner, active-nav indicator, alert banners/cards, "today" chart bars, goal lines, status dot

   | gold-ink | #5E4200 | Text on gold; "due"/elevated states

   | slate | #5B616B | Secondary text, labels, axis text

   | red / red-container / red-ink | #D22630 / #FFDAD6 / #93000A | Risk-only: pre-diabetes banner, above-target data points, missed doses

   | surface / surface-low / border | #F9F9F9 / #F3F3F3 / #E2E2E2 | Backgrounds, gridlines, structural borders (1px, flat)

## Typography, shape, elevation, spacing

- Fonts: Public Sans (400/600/700) for headlines and body; Lexend (500/600) for labels, badges, chips, metadata, axis text. Self-host via next/font/google (bundled at build; zero runtime requests).

- Radii: 4px buttons/inputs/alerts; 8px cards; pill (9999px) badges and chips.

- Elevation: flat tonal layering with 1px borders; the single permitted shadow is 0 4px 12px rgba(17,46,81,.08) for floating elements (toasts, modals).

- Spacing: 8px base unit; breathable 16/24px component padding; container max-width 1280px with 40/24/16px responsive outer margins.

- Status indicators: always color + icon (check / warning triangle), never color alone.

## Verified contrast pairs (WCAG AA)

   | Pair | Ratio | Pair | Ratio

   | navy on white | 13.69:1 | white on navy | 13.69:1

   | navy on sky | 11.98:1 | navy on gold | 7.86:1

   | slate on white | 6.24:1 | gold-ink on gold | 5.34:1

   | red-ink on red-container | 7.24:1 | #D4E3FF on navy | 10.58:1

## 8. Chart & animation specification

Charts are hand-rolled SVG React components (no chart library) so geometry matches the prototypes. Reuse the prototypes' viewBoxes, shaded bands, gridlines, axis labels, and legends.

## Trigger

- IntersectionObserver, threshold 0.35, fire once per chart per session; charts already in the viewport on load animate after a 150ms delay.

- If prefers-reduced-motion: reduce: skip all animation; render final state immediately. This is mandatory.

## Effects

   | Element | Effect | Parameters

   | Line series (A1c, glucose, weight) | Stroke draw left→right via stroke-dasharray/-dashoffset = pathLength; data points fade/scale in after the stroke passes | 800ms, cubic-bezier(0.22,1,0.36,1); points stagger 60ms

   | Bars (steps, activity minutes) | Grow from baseline via transform: scaleY (origin bottom) | 600ms ease-out, 60ms stagger per bar; goal line fades in after bars

   | Shaded target zones | Fade in before series draws | 300ms

   | Risk-scale marker (Maria) | Marker slides from scale start to 6.1% position; zone rects fade in first | 700ms ease-out

   | Adherence grid | Cells pop in row by row (opacity + scale 0.8→1) | 20ms stagger per cell

   | Stat tiles (P2) | Number count-up from 0 (or trend start) to value | 700ms; respects reduced motion

   | Progress bars | Fill width animates 0→value | 600ms ease-out

   | Level ring (rewards) | Arc sweeps from 0 to the points-to-next-level fraction | 800ms ease-out

   | Time-in-range gauge (CGM personas) | Donut segments grow in sequence (in-range, then low, then high) | 600ms, 80ms stagger

   | Badge earned (achievement) | Pop-in: opacity 0→1 + scale 0.6→1 with a gold glow; toast slides in | 500ms; aria-live="polite"

Animations MUST NOT shift layout (animate transform/opacity/stroke only) and MUST NOT block interaction.

## 9. Technical architecture (Next.js)

   | Concern | Decision

   | Framework | Next.js 15+ (App Router), React 18+, TypeScript strict

   | Runtime | Node runtime for all API routes (export const runtime = 'nodejs') — required by SQLite driver. No edge runtime.

   | Database | SQLite single file ./Output/db/hteap-demo.db via better-sqlite3 (synchronous, zero-config, portable). Singleton in lib/db.ts. Prisma MAY be substituted if seed parity and API contracts hold.

   | File storage | All files the app consumes or produces live under a single base directory Output/, resolved at runtime relative to the process working directory (the path the app runs from). Resolve once in lib/paths.ts as path.resolve(process.cwd(), 'Output'); an optional HTEAP_OUTPUT_DIR env var MAY override the location. Code MUST NOT write outside this directory. The app creates Output/ and its subfolders on demand (e.g., on first run of npm run seed). See the file-storage layout below. Writes are local only — the runtime still makes zero external calls.

   | Styling | CSS custom properties (tokens) + CSS Modules. No Tailwind/UI kit required; port prototype CSS directly.

   | Fonts | next/font/google: Public Sans, Lexend (self-hosted at build).

   | State | Persona + consent state in a lightweight client store (React context); server data via fetch to internal API with SWR-style revalidation on persona switch. No external state libraries required.

   | Charts | Custom SVG components + useInView animation hook (Section 8).

   | External calls | None at runtime. CI/build may fetch fonts/deps.

   | Scripts | npm run dev · npm run build · npm run start · npm run seed (creates Output/ if absent, then creates/overwrites Output/db/hteap-demo.db from the seed module, idempotent)

## Suggested project structure

app/
  layout.tsx              # fonts, tokens, demo banner, providers
  page.tsx                # "/" responsive patient app (renders MobileApp | DesktopApp)
  how-it-works/page.tsx
  rewards/page.tsx        # 6.1   devices/page.tsx       # 6.2
  connect/page.tsx        # 6.3   assistant/page.tsx     # 6.4
  nearby/page.tsx         # 6.5   recipes/page.tsx       # 6.6  (+ recipes/[id])
  share/page.tsx          # 6.7   records/page.tsx       # 6.8  (+ records/[docId])
  api/
    patients/[id]/{overview,labs,observations,medications,nutrition,
                   messages,programs,sources,consent}/route.ts
    patients/[id]/{gamification,devices,threads,appointments,recipes}/route.ts
    patients/[id]/{documents,insights,audit,share,journey}/route.ts
    patients/[id]/assistant/route.ts  ·  assistant/provider-questions/route.ts
    identity/authenticate/route.ts            # IAL2/AAL2 passkey/mDL (simulated)
    share/checkin/route.ts  ·  share/return-summary/route.ts   # Kill-the-Clipboard loop
    gamification/award/route.ts
    devices/connect/route.ts  ·  devices/disconnect/route.ts
    threads/[tid]/message/route.ts
    services/route.ts  ·  recipes/[id]/route.ts
    sync/route.ts  ·  consent/{revoke,grant}/route.ts  ·  demo/reset/route.ts
components/
  shell/   (DesktopShell, MobileShell, Sidenav, BottomTabs, MoreMenu, ScenarioBar, DemoBanner)
  cards/   (StatTile, Banner, Card, Badge, Chip, ProgressBar, MedRow, MessageFeed, SourceRow)
  charts/  (LineChart, BarChart, RiskScale, AdherenceGrid, TimeInRangeGauge, BpTrend, useInView.ts)
  rewards/ (LevelRing, BadgeShelf, StreakCard, ChallengeRow, BadgeEarnedToast)
  devices/ (DeviceCard, PairingModal)
  connect/ (ThreadList, ThreadView, ShareSnapshotPicker, AppointmentPicker)
  assistant/ (ChatPanel, VoiceButton, SuggestedChips, ProviderQuestionBuilder, InsightCard)
  nearby/  (ServiceCard, CategoryChips, SchematicMap)
  recipes/ (RecipeCard, RecipeDetail, ActiveFilterBar)
  identity/(IdentityGate, PasskeyMdlPrompt)        # 6.x / FR-14
  share/   (ShareQrCard, CheckinSimulator, VisitSummaryToast)  # 6.7
  records/ (RecordTimeline, DocumentViewer, CodeChip, ExplainThisButton)  # 6.8
  journey/ (JourneyLauncher, JourneyStepper)       # 4.4 / FR-35
lib/
  db.ts · queries.ts · types.ts · demo-clock.ts · paths.ts · seed/seed-data.ts
  seams/                 # SWAP SEAMS — swap mock→real without touching callers (see below)
    network.ts           #   AlignedNetworkClient: sync, recordLocator, fhirBundle, smartHealthLink
    identity.ts          #   IdentityProvider: authenticate() IAL2/AAL2 (mock passkey/mDL)
    documents.ts         #   DocumentStore: list/get unstructured attachments
    terminology.ts       #   TerminologyService: code↔display (LOINC/RxNorm/SNOMED)
    audit.ts             #   AuditLog: record(actor, scope, purposeOfUse)
  assistant/interpret.ts # single AI interpretation contract (deterministic engine today)
  assistant/intents.ts   # deterministic intent classifier + handlers (no LLM)
scripts/seed.ts
Output/                   # all files the app consumes/produces; gitignored; created on demand
  db/hteap-demo.db        #   SQLite database (generated by `npm run seed`)
  documents/              #   file-backed unstructured attachments (DocumentStore); demo seeds text
  exports/                #   files produced by the app (e.g., generated FHIR bundles, visit summaries)
  uploads/                #   files ingested by the app
  logs/                   #   optional log / audit exports
View switching: useViewport() wraps matchMedia('(min-width:880px)') with useSyncExternalStore. page.tsx renders <DesktopApp/> or <MobileApp/> from the same data hooks. Render a neutral skeleton until mounted to avoid hydration mismatch; this is acceptable for a demo.

## File storage layout (Output/)

Every file the application reads or writes at runtime — the database, generated artifacts, ingested files, and logs — lives under a single base directory named Output/. The directory is resolved relative to the path the app runs from (its process working directory), so the app is portable: copy or move the project and the storage moves with it.

- Resolution: resolve the base path once in lib/paths.ts as path.resolve(process.cwd(), 'Output'), and derive every subfolder from it (e.g., dbPath = path.join(outputDir, 'db', 'hteap-demo.db')). All file access goes through these helpers — no module hardcodes its own path. An optional HTEAP_OUTPUT_DIR environment variable MAY override the base location; when unset, the default above applies.

- Subfolders: Output/db/ (SQLite database), Output/documents/ (file-backed unstructured attachments served by the DocumentStore seam; the demo seeds styled text, so this MAY be empty), Output/exports/ (files the app produces — e.g., generated FHIR history bundles or returned visit summaries written to disk), Output/uploads/ (files ingested by the app), and Output/logs/ (optional log or audit exports).

- Creation & lifecycle: the app and the seed script create Output/ and any needed subfolder on demand (idempotent). The directory is .gitignored and is safe to delete; npm run seed rebuilds it to identical state.

- Boundaries: code MUST NOT read or write outside Output/ at runtime (build-time font/dependency fetching is unchanged). Confining all I/O to one tree keeps the demo's zero external calls at runtime and deterministic-seed guarantees intact and makes the writable surface easy to review.

## Simulation seams — build it right, swap later (minimize rework)

Every external dependency the directive calls for is hidden behind a narrow TypeScript interface in lib/seams/ (plus lib/assistant/interpret.ts). API route handlers and UI call only these interfaces, never a mock directly. The demo ships the Mock* implementation; a production build provides a Real* implementation of the same interface. Because the seam — not the mock — is what callers, the schema, and the UI depend on, swapping to production requires no rework above the seam.

   | Seam (interface) | Demo implementation | Production implementation (no caller change)

   | AlignedNetworkClient | reads SQLite; seeded Record Locator + latency | real CMS Aligned Network query/respond, FHIR $everything, SMART Health Links

   | IdentityProvider | scripted IAL2/AAL2 passkey/mDL modal | real CMS digital identity (passkey/mDL), OAuth 2.0 scopes

   | DocumentStore | seeded mock documents (styled text) | real FHIR DocumentReference/Binary attachments

   | TerminologyService | seeded code↔display map | real LOINC/RxNorm/SNOMED value-set service

   | interpret() (assistant) | deterministic intent/template engine | governed clinical model behind the same I/O + guardrails

   | AuditLog | writes to SQLite access_log | tamper-evident audit store

The runtime constraint is unchanged: the demo makes zero external calls. The seams are an architectural boundary, not a runtime integration.

## 10. Data: SQLite schema & seed data

Reference DDL below (block ID #sql-ddl). The schema MAY be refined provided the API contracts (Section 11) and seed values (#spec-seed-data) are preserved. Dates are ISO-8601 TEXT. The seed MUST be deterministic — no random(), no now(); derive everything from DEMO_TODAY.

[SQL DDL extracted separately to schema.sql]

Complete seed values — every number, label, date, message body, and status shown in the prototypes — are enumerated in #spec-seed-data (Section 16) and MUST be loaded by npm run seed.

## 11. Simulated interfaces & API contracts

All endpoints are internal Next.js route handlers reading SQLite. They simulate what would, in production, be Aligned Network / FHIR / claims interfaces. Full endpoint list with shapes in #spec-api. Conventions: JSON; 200 success; 404 unknown patient; errors as { "error": string }.

   | Endpoint | Method | Simulates | Behavior

   | /api/patients/{id}/overview | GET | App home aggregation | Greeting, banner/alert, five stat tiles with deltas

   | /api/patients/{id}/labs | GET | Aligned Network FHIR query (labs) | Lab history + A1c series (Robert: 5 quarterly points; Maria: 3 results)

   | /api/patients/{id}/observations?type=&days= | GET | Device + vitals data | Glucose 14-day, weight monthly, steps/minutes weekly series

   | /api/patients/{id}/medications | GET | EHR meds + pharmacy claims | Med list, today's statuses, refill events, 28-day adherence

   | /api/patients/{id}/nutrition | GET | Food-log service | 7-day rollup

   | /api/patients/{id}/messages | GET | Coaching service | Feed, newest first

   | /api/patients/{id}/programs | GET | Benefits matching | Programs with status chips + MDPP progress

   | /api/patients/{id}/sources · /consent | GET | Consent registry | Sources w/ last-sync; consent record incl. identity (IAL2/AAL2, passkey/mDL); access-log summary

   | /api/sync | POST | Aligned Network sync + Record Locator | Body {patientId}; runs simulated Record Locator (returns discovered orgs + counts), then sleeps 400–1200ms (seeded jitter); bumps last_sync_at to demo-now; returns updated sources + locator results

   | /api/consent/revoke · /grant | POST | Patient-directed consent | Toggles consents.revoked; UI shows disconnected empty states when revoked

   | v1.1 feature endpoints

   | /api/patients/{id}/gamification | GET | Rewards engine | points, level + ring bounds, current/best streak, badges (earned/locked), challenges

   | /api/gamification/award | POST | Achievement event | Body {patientId, badgeId?}; marks a badge earned (or next locked one); returns the earned badge for the celebration animation. Deterministic.

   | /api/patients/{id}/devices | GET | Device manager | Connected + available devices from device_catalog + patient_devices

   | /api/devices/connect · /disconnect | POST | Simulated pairing | Body {patientId, deviceId}; simulated 1–2s delay; flips connected, sets last_sync_at, adds/removes the matching data source & series

   | /api/patients/{id}/threads | GET | Provider messaging | Threads with messages; one per care-team member

   | /api/threads/{tid}/message | POST | Send / share / request | Body {body?, attachmentKind?, topic?}; appends patient message; if a guidance topic, schedules a seeded provider_replies response after a delay

   | /api/patients/{id}/appointments | GET | Scheduling | Open appointment_slots; POST same path {slotId} books it (confirmation card)

   | /api/patients/{id}/assistant | POST | AI assistant (local, deterministic) | Body {question}; classifies intent, runs handler over the patient's SQLite data, returns {answer, sourceCitation, disclaimer, suggestedChips[]}. No external LLM.

   | /api/patients/{id}/assistant/provider-questions | GET | Question builder | 3–5 tailored questions derived from the patient's data

   | /api/services?category= | GET | Local services | Filtered local_services with persona-aware ordering/tags; open-now derived from demo clock

   | /api/patients/{id}/recipes?tag=&q= | GET | Recipe matching | Recipes auto-filtered by the patient's condition, allergies, and dietaryPrefs; query params override. /api/recipes/{rid} returns detail.

   | v1.2 directive-alignment endpoints

   | /api/identity/authenticate | POST | IAL2/AAL2 identity (passkey/mDL) | Body {patientId, credential:'passkey'|'mdl'}; scripted verification; returns a session + scopes; writes an access_log entry (purpose individual_access). No real IdP.

   | /api/patients/{id}/documents · /documents/{docId} | GET | Full-chart document store | List/get unstructured docs (radiology, outside lab, specialist note, visit summary) as DocumentReference mocks with body_text + ai_read

   | /api/patients/{id}/insights | GET | AI interpretive insights | Proactive insight cards (trend / titration / referral_suggestion) with basis + severity, badged not-clinical-judgment

   | /api/share/checkin | POST | "Kill the Clipboard" outbound | Body {patientId, org}; records a share_sessions row + access_log (purpose treatment); returns the shared FHIR bundle manifest

   | /api/share/return-summary | POST | Smart Health Link inbound | Body {patientId, shareId}; creates a visit_summary document + fires its AI read/insight; returns the new document

   | /api/patients/{id}/audit | GET | Auditability (§11.1) | Granular access_log: actor, role, timestamp, scope, purpose-of-use; newest first

   | /api/patients/{id}/checkin | POST | Symptom / care-plan check-in | Body {text}; stores entry; red-flag keywords return a direct-to-care safety response (no diagnosis)

   | /api/patients/{id}/journey | GET | Guided journey (FR-35) | Ordered steps {title, route, narration} for the "Day in the Life" walkthrough (Sarah)

   | /api/demo/reset | POST | — | Re-runs seed; returns {ok:true}

## Example — GET /api/patients/robert/overview

{
  "patient": { "id":"robert", "firstName":"Robert", "age":67,
               "planType":"t2d_management", "providerOrg":"Riverview Health" },
  "demoToday": "2026-06-06",
  "banner": { "severity":"gold",
    "title":"Your A1c is trending up — your care team has been notified",
    "body":"Yesterday's lab result came back at 7.9%, up from 7.4% in March. ...",
    "ctaLabel":"Schedule Jun 18, 10:30 AM", "careTeamNotified": true },
  "tiles": [
    { "label":"A1c (latest)", "value":"7.9%", "delta":{"text":"▲ 0.5","tone":"up-bad"},
      "detail":"Jun 5, 2026 · target

## Example — POST /api/patients/robert/assistant (deterministic, no LLM)

// request
{ "question": "why did my a1c go up?" }

// response  (intent: a1c_trend → handler reads robert's lab + observation rows)
{
  "answer": "Your most recent A1c was 7.9% on Jun 5, 2026, up from 7.4% in March. Over the same period your morning glucose averaged 140 mg/dL (target 80–130) and your activity dropped about 22% this week. A1c reflects roughly the last 3 months, so recent higher readings raise it.",
  "sourceCitation": "From your Jun 5, 2026 lab result and your last 14 days of glucose readings.",
  "disclaimer": "This is a demo assistant, not medical advice. Your care team can help you decide what to do next.",
  "suggestedChips": ["What should I ask my doctor?", "Show diabetes-friendly dinners", "When is my next appointment?"]
}
No external calls at runtime, restated: every endpoint above reads only SQLite. The assistant is a local intent engine; provider replies, device pairing, services, recipes, documents, insights, identity, and the share loop are all seeded. Simulated latency uses a deterministic, seeded delay (no wall-clock randomness) so demos are repeatable.

## 11.1 Standards, identity & compliance mapping (CMS Interoperability Framework)

This consolidates how the demo represents the directive's mandatory conformance items and how each maps to a production target across the swap seam (Section 9). It is the single reference for reviewers checking Framework alignment. Items marked illustrative use plausible values the implementer MUST validate against the current official release before any real use.

   | Directive requirement | Demo representation | Production target (across the seam)

   | Identity — IAL2/AAL2 via passkey or mDL | Scripted one-tap passkey/mDL gate (FR-14); consents.identity_credential/ial/aal | CMS digital identity service on Medicare.gov (passkey/mDL), OAuth 2.0 scopes

   | USCDI v3 / US Core IG conformance | Standards chips state "USCDI v3 / US Core"; data shaped to US Core resource types | Certified FHIR R4 APIs conformant to US Core IG; USCDI v3 data classes

   | Semantic terminology LOINC / RxNorm / SNOMED CT | lab_results.loinc, medications.rxnorm, conditions.snomed surfaced in record/detail views (FR-33) — illustrative codes | Bound to current LOINC, RxNorm, and SNOMED CT US Edition value sets via a TerminologyService

   | Unstructured documents as FHIR attachments (PDF/TIFF/JPG) | clinical_documents mocks with accessible body_text + AI read (FR-31, 6.8) | FHIR DocumentReference/Binary; OCR/extraction pipeline upstream

   | "Kill the Clipboard / Ax the Fax" — QR + FHIR bundle + Smart Health Link | Mock QR token, scripted check-in, seeded returned visit summary (FR-30, 6.7) | FHIR $everything export, SMART Health Links, real point-of-care exchange

   | Network integration + Record Locator (by Jul 4, 2026) | Simulated locator step in sync returns discovered orgs + counts (FR-13) | CMS Aligned Network query/respond + Record Locator service

   | Auditability — who/when/why, treatment vs individual access | Granular access_log with purpose-of-use, viewable in Data & Consent (FR-10) | Tamper-evident audit store; access-report generation

   | AI safety — label AI content, educational vs clinical, escalation | Persistent "demo assistant — not medical advice"; insight cards badged not-clinical-judgment; red-flag → direct-to-care (6.4) | Governed model with the same guardrails behind interpret()

   | Security validation — HITRUST or equivalent | Out of demo scope; noted as the production target so it is not overlooked | HITRUST certification (or equivalent) of the hosted system; HIPAA, NIST SP 800-53 Rev. 5 at FIPS 199 Moderate

Illustrative code examples (validate before use): HbA1c → LOINC 4548-4; fasting glucose → LOINC 1558-6; metformin (ingredient) → RxNorm 6809; Type 2 diabetes mellitus → SNOMED CT 44054006; obesity → SNOMED CT 414916001. These are provided as realistic placeholders only; the implementer MUST confirm each against the current LOINC, RxNorm, and SNOMED CT US Edition releases. Do not treat them as authoritative.

## 12. Accessibility requirements (Section 508 / WCAG 2.1 AA)

- Semantic landmarks (header/nav/main/footer), correct heading hierarchy, skip link.

- Keyboard: every interactive element reachable and operable; visible focus (3px navy outline; gold on navy surfaces); sidebar/tab patterns follow the prototypes' ARIA usage (aria-pressed persona buttons, aria-current nav, role="tablist" where tabs are used).

- Charts: each SVG has role="img" + descriptive aria-label stating the data story (copy from prototypes); adherence grid and complex charts additionally offer a visually-hidden data table or list.

- Color never sole indicator (icons accompany status); contrast per Section 7 table; prefers-reduced-motion honored everywhere.

- Toasts/alerts announced via aria-live="polite"; modal flows (identity gate, device pairing, check-in simulator) use focus trap + aria-modal.

- v1.2 screens: document mocks expose real DOM text (the "scanned" look is a CSS layer only — never an image of text), so every document is screen-reader legible; the AI "Explain this" read is the accessible plain-text equivalent. The shareable QR has a text alternative and the shared contents are listed in text. The AI chat is a labeled log with aria-live for new messages; voice is an enhancement only (text input is always available). The schematic map is decorative — the authoritative content is the text service list.

- Target: Lighthouse accessibility score ≥ 95 on every route; axe-core clean on critical issues.

## 13. Acceptance criteria (definition of done)

- npm install && npm run seed && npm run dev works on a clean machine (Node 20+); no runtime network access required. The seed step creates the Output/ directory (and Output/db/) relative to the run path; no files are written outside Output/ at runtime.

- At 1280px wide, / is visually equivalent to Prototype 2 (structure, tokens, copy, chart shapes) for both personas. At 390px wide, / Home matches Prototype 1's phone screen for both personas.

- Resizing across 880px swaps views live without reload; persona selection survives the swap.

- Persona toggle updates every section and the header identity block with data fetched from SQLite (verify via network tab: API responses change).

- All charts animate on first scroll-into-view per Section 8; with reduced motion enabled, no animation occurs and final states render.

- Sync, revoke/re-grant consent, replay alert, and demo reset all function as specified (FR-13..FR-16).

- All UI copy matches the embedded prototypes verbatim; all numeric values match #spec-seed-data.

- Lighthouse a11y ≥ 95 (mobile and desktop); keyboard-only walkthrough of the full demo script succeeds.

- The fictional-data disclaimer banner is permanently visible on every route.

- Output/db/hteap-demo.db is a plain SQLite file; deleting it (or the whole Output/ directory) and re-running seed restores identical state (deterministic).

- v1.1 — Roster: all 13 patients (Section 4) are selectable and render every screen without error or empty crashes; varied states are visible (e.g., jim shows in-target/positive states and a full badge shelf, hector shows high-risk/onboarding states and a broken streak).

- v1.1 — Gamification: /rewards shows level ring, points, streaks, earned + locked badges, and challenges; the "Earn a badge" control fires the toast + badge pop-in animation with an aria-live announcement; reduced-motion shows the final state.

- v1.1 — Devices: connecting a device runs the simulated pairing modal, marks it connected, and surfaces its data (e.g., connecting a Dexcom CGM for priya reveals a time-in-range card; connecting an Omron cuff for linda reveals a BP trend); disconnect hides device-only cards gracefully.

- v1.1 — Provider connect: sending a guidance request posts the patient message and produces a seeded simulated reply after a delay; share-snapshot posts a snapshot card and logs access; appointment booking confirms a seeded slot; every thread shows the "simulated responses" label.

- v1.1 — AI assistant: at least the documented intents return data-grounded answers with a source citation and not-medical-advice disclaimer for every persona; unmatched input returns the safe fallback; no network request leaves the browser/server for inference. Voice works where the Web Speech API exists and is hidden with a clear message where it doesn't.

- v1.1 — Nearby: all five categories filter correctly over the seeded dataset; the schematic map pins align with the list; open-now reflects the demo clock; no external map/tile request is made.

- v1.1 — Recipes: results are auto-filtered to the active patient's condition + allergies + diet (verify emily sees only vegetarian, peanut- and shellfish-free recipes), the active-filter banner explains why, and filters are removable; detail view shows ingredients, steps, nutrition, and an allergen callout.

- v1.2 — Identity: the gate completes a passkey/mDL IAL2/AAL2 sign-in (FR-14) and the Data & Consent record reflects the credential type, IAL, and AAL.

- v1.2 — Kill the Clipboard: from /share, "Simulate check-in" records a share, writes a treatment audit entry, and "return summary" creates a visit-summary document that triggers an AI read/insight (FR-30); demonstrable end-to-end for sarah.

- v1.2 — Records & documents: /records shows structured items with LOINC/RxNorm/SNOMED codes and ≥3 unstructured document types (radiology, outside lab, specialist note) plus returned visit summaries; each opens a viewer with screen-reader-legible text and an "Explain this" AI read (FR-31, FR-33).

- v1.2 — AI insights: proactive insight cards appear on Overview/Trends for relevant personas (e.g., sarah referral suggestion; a titration explainer after a returned visit summary), each badged "not clinical judgment" with an escalation action (FR-32).

- v1.2 — Record Locator & audit: "Sync now" shows discovered organizations + counts before fetch (FR-13); the Data & Consent audit trail lists entries with actor, timestamp, scope, and purpose-of-use (treatment vs individual access vs patient share) (FR-10).

- v1.2 — Symptom check-in: a normal check-in logs an entry; a red-flag input returns a direct-to-care safety response and never a diagnosis (FR-34).

- v1.2 — Guided journey: Sarah's "Day in the Life" walkthrough runs end-to-end (identity → share → returned summary → AI read → coaching → audit) and is skippable (FR-35).

- Network inspection during a full demo (all routes, all v1.2 flows) shows zero requests to third-party domains (fonts bundled at build).

The directive describes a production platform; this PRD scopes a faithful demo of it. The items below are out of scope for the demo build and are deliberately isolated behind the Section 9 swap seams so a later production effort can add them without reworking what the demo establishes. They are not gaps in the concept — they are the demo/production boundary.

- Real identity proofing / OAuth (the IAL2/AAL2 passkey/mDL gate is theatrical) — behind IdentityProvider.

- Real FHIR conformance, CMS Aligned Network / TEFCA connectivity, real Record Locator, real Smart Health Links, real document store/OCR — behind AlignedNetworkClient / DocumentStore. The patient-facing "Kill the Clipboard" share/return loop is in demo scope (simulated, 6.7).

- A real large language model behind the assistant — it is a deterministic, on-device intent/template engine behind interpret(). No model inference, local or remote, in the demo.

- Real device connectivity (Bluetooth/vendor SDKs/clouds), real geolocation/map tiles/place APIs, real provider messaging — all simulated. Brand names appear for realism only and imply no integration or endorsement.

- Real terminology services — codes are illustrative (Section 11.1) behind TerminologyService; the implementer validates against official value sets.

- HITRUST certification and full production security hardening — named as the production target (Section 11.1) but not performed on the demo.

- Adjacent strategic capabilities not part of a patient-facing app: CMS/payer-side fraud & anomaly detection (e.g., duplicate "once-in-a-lifetime" test prevention), Alternative Payment Model / value-based-care settlement, and provider-facing "look-the-patient-in-the-eye" EHR workflows. These appear in the directive's value narrative but live in other systems; the demo references them only as context, and they are explicitly excluded here so they are not mistaken for oversights.

- Internationalization, offline/PWA, printing.
