# HTEAP Demo App — User Stories & Functional Success Criteria

**Version 1.0 · 2026-06-11 · Companion to PRD v1.3** ([`hteap-demo-app-prd.html`](hteap-demo-app-prd.html))

## 0. How to use this document (read this first)

This document is **normative**. It defines the target user types for the CMS HTEAP "Patient-Facing Apps — Diabetes and Obesity" demo application and the user stories the application MUST satisfy. It is the **functional success criteria** for the build:

- A build is **functionally complete** only when every user story below passes its acceptance criteria for the named persona(s), under the global conventions in Section 4.
- Use this document together with the PRD. The PRD defines *what to build* (FR-1–FR-35, schema, API contracts, copy, design); this document defines *whose needs the build must demonstrably meet* and how that is validated. Where the two appear to conflict, the PRD governs data values and screen copy; this document governs user-need coverage.
- Every story ends with a `Validates:` line naming the PRD requirements it exercises. Section 5 is the full FR ↔ story coverage matrix, including the demo-mechanics FRs validated by PRD Section 13 rather than by a user story.
- **AI agents:** treat each acceptance criterion as a test case. Drive it with the persona toggle (FR-2), the fixed demo clock (`DEMO_TODAY=2026-06-06`), and the seed data in PRD `#spec-seed-data`. Do not invent data — every value referenced here exists in the seed.

## 1. The target user

All primary users are **CMS benefit recipients living with diabetes, obesity, or elevated risk of either**, reached through every CMS coverage pathway: Traditional Medicare, Medicare Advantage, Medicare via disability, dual Medicare-Medicaid, Medicaid, and the CMS-administered Marketplace. Common characteristics that shape every story:

- They manage (or are at risk of) a chronic metabolic condition that demands daily decisions between episodic clinical visits.
- Their records are fragmented across providers, labs, and networks; they are often the only courier of their own history.
- They vary widely in age (23–71 in the roster), health literacy, digital comfort, and language (English, Spanish, Vietnamese).
- Many carry health-related social needs — food insecurity, transportation, work-schedule strain, mobility limits, isolation, caregiving, medication cost — that determine whether a care plan is followable at all.

The five user types below are **need-based archetypes** spanning the PRD's 13-persona roster (PRD Section 4). A persona can represent more than one type; together the types cover all 13 personas and every beneficiary-facing capability.

## 2. User types overview

| # | User type | Core need | Representative personas |
| --- | --- | --- | --- |
| UT-1 | Prevention-stage beneficiary | Stop progression before diagnosis | Maria R. (58, pre-diabetes, MDPP), Emily C. (23, obesity, Medicaid) |
| UT-2 | Newly diagnosed & barrier-facing beneficiary | Understand the condition; a plan that fits real-life constraints | Hector M. (59, new T2D, Spanish, rural), Carol J. (61, class III obesity + osteoarthritis, rural), Miguel S. (38, night shift), Linda T. (66, Vietnamese) |
| UT-3 | Actively managing / complex-care beneficiary | Control an established condition across medications, providers, and settings | Robert T. (67, T2D, rising A1c), Linda T. (T2D + hypertension, 4 meds), Samuel G. (45, GLP-1), DeShawn W. (52, plateau), Sarah W. (68, featured comorbid) |
| UT-4 | Engaged, device-connected self-tracker | An app that keeps up with their data and recognizes success | Priya N. (34, T1D, CGM + pump), Aisha K. (29, high engagement), Jim O. (71, well-controlled) |
| UT-5 | Data-owner | Trust: know, control, and audit who touches the record | Every beneficiary; exemplified by Sarah's journey step 6 and DeShawn |

## 3. User stories

### UT-1 — The prevention-stage beneficiary

At risk (pre-diabetes or early obesity) and enrolled in or eligible for prevention programming such as the MDPP. Motivated but resource-constrained: Maria is food-insecure and dual-eligible; Emily is a student on a tight budget with food allergies. Success for this type means the app makes risk legible and prevention affordable.

#### US-1.1 — See my risk in plain terms

**As** a beneficiary with pre-diabetes, **I want** my latest A1c shown on a labeled risk scale with a plain-language alert, **so that** I know how close I am to diabetes without having to interpret raw lab values.

Acceptance criteria:

- With Maria active, Overview shows the red-container pre-diabetes banner, the greeting, the demo date, and five stat tiles with deltas matching seed values (FR-4).
- Trends & Labs renders the A1c risk-scale graphic (normal / pre-diabetes / diabetes zones) with the marker at 6.1% and the prototype's screen-reader description intact (FR-5).
- The six-month weight trend renders with the dashed gold goal line, and the lab history list shows status icons (FR-5).

**Validates:** FR-4, FR-5

#### US-1.2 — Track my prevention program

**As** an MDPP participant, **I want** to see my session progress, weight milestone, and next session, **so that** I stay on schedule and know what triggers escalation.

Acceptance criteria:

- Care & Prevention shows the MDPP 9/16 sessions bar and the 5% weight-milestone bar at 3.6% (FR-7).
- The next session ("Tue Jun 9, 6:00 PM") and care-team cards (Dr. James Patel, Lisa M.) render per seed (FR-7).
- The escalation rule copy ("If your next A1c reaches 6.5%…") appears verbatim (FR-7).

**Validates:** FR-7

#### US-1.3 — Keep me on track week to week

**As** a beneficiary building new habits, **I want** weekly activity and nutrition goals plus coaching messages grounded in my record, **so that** progress doesn't depend on the next clinic visit.

Acceptance criteria:

- Activity & Nutrition shows weekly activity bars against the 150 min/week goal with today's bar in gold, and 7-day nutrition progress bars per seed (FR-8).
- The coaching feed shows human and automated messages with timestamps and working action buttons (for Maria, Lisa M.'s milestone message appears verbatim) (FR-9).
- Matched programs display status chips (Active / Eligible / Suggested / Available / Near you) (FR-9).

**Validates:** FR-8, FR-9

#### US-1.4 — Recipes that fit my diet and allergies

**As** a beneficiary with dietary restrictions (Emily: vegetarian, peanut and shellfish allergies), **I want** recipes automatically filtered to be safe and relevant for me, **so that** I can act on nutrition advice without vetting every ingredient.

Acceptance criteria:

- With Emily active, /recipes shows only vegetarian, peanut-free, shellfish-free recipes (FR-29).
- A banner explains the active filters with removable chips (FR-29).
- The detail view shows ingredients, steps, nutrition, and an allergen callout (FR-29).
- Switching personas re-filters by that persona's condition, allergies, and diet.

**Validates:** FR-29

#### US-1.5 — Find affordable food and support near me

**As** a food-insecure beneficiary (Maria, Emily), **I want** nearby services to surface food-resource and produce-prescription programs first, tagged with whether they accept my coverage, **so that** cost is not the reason I fall off the plan.

Acceptance criteria:

- /nearby filters across the five seeded categories; pins on the schematic SVG map align with the list; open-now state derives from the demo clock; no external map, tile, or geolocation request is made (FR-28).
- For Maria and Emily, ordering puts food-resource programs first per their `socialDrivers` (PRD §4.5).
- "Accepts your plan" tagging reflects the persona's `medicareContext` (PRD §4.5).

**Validates:** FR-28; PRD §4.5 socialDrivers behavior

### UT-2 — The newly diagnosed & barrier-facing beneficiary

Newly diagnosed (Hector, A1c 9.2%) or managing under structural barriers: limited English proficiency, rurality, transportation and mobility limits, night-shift work, social isolation. The PRD deliberately attributes low engagement to structural barriers, not the patient — this type verifies the application does the same.

#### US-2.1 — Sign in once, simply, and consent before anything moves

**As** a beneficiary who cannot manage another password, **I want** one-tap verified sign-in and a clear consent step before the app touches my record, **so that** access is both easy and mine to control.

Acceptance criteria:

- A one-tap passkey or mDL sign-in at IAL2/AAL2 precedes the dashboard (FR-14).
- A scoped OAuth 2.0-style authorization step follows sign-in, before any record data is shown (FR-14).
- The consent record stores credential type, IAL, and AAL (FR-14).
- The flow is fully simulated; no real identity-provider traffic occurs.

**Validates:** FR-14

#### US-2.2 — Explain my results in words I understand

**As** a newly diagnosed beneficiary (Hector), **I want** to ask the assistant what my results mean and get a plain-language answer drawn from my own record, **so that** the diagnosis is not a wall of jargon.

Acceptance criteria:

- Documented intents return `{answer, sourceCitation, disclaimer, suggestedChips}` for every persona, grounded in that persona's SQLite data (FR-25).
- Answers are labeled as AI output, distinct from clinical judgment (FR-25).
- Unmatched input returns a safe fallback; no inference request leaves the app (FR-25).

**Validates:** FR-25

#### US-2.3 — Serve me in my language, accessibly

**As** a beneficiary who prefers Spanish (Hector) or Vietnamese (Linda) — or who uses assistive technology — **I want** language affordances and fully operable screens, **so that** the app does not exclude me.

Acceptance criteria:

- Hector and Linda see a localized greeting/coaching tip and an "Español" / "Tiếng Việt" toggle affordance (PRD §4.5).
- Every screen exercised by these stories passes a keyboard-only walkthrough; axe is clean on critical screens; Lighthouse accessibility ≥ 95 in both views (FR-18; PRD §12).

**Validates:** FR-18; PRD §4.5 preferredLanguage behavior

#### US-2.4 — Care that reaches me where I am

**As** a beneficiary who is rural with limited transportation or mobility (Carol, Hector) or works nights (Miguel), **I want** services, goals, and nudges adapted to my circumstances, **so that** the plan fits my life instead of assuming someone else's.

Acceptance criteria:

- /nearby orders telehealth- and transportation-friendly options first for Carol and Hector per their `socialDrivers` (FR-28; PRD §4.5).
- Carol's activity goals render as low-impact adapted targets, not the default goal set (FR-8, FR-21).
- Miguel's coaching shows re-engagement nudges timed to his schedule; missed-streak states render as encouragement, without blaming copy (FR-9, FR-21).

**Validates:** FR-8, FR-9, FR-21, FR-28

#### US-2.5 — Walk into my appointment prepared

**As** a beneficiary with limited time with my provider, **I want** the app to draft tailored questions from my data that I can save and send ahead, **so that** the short visit covers what matters.

Acceptance criteria:

- The builder generates 3–5 questions tailored to the active patient's data (FR-27).
- Questions can be saved; "send to provider" posts them into the provider message thread (FR-27, FR-24).
- The Coach Conversation badge may be awarded on completion (FR-27).

**Validates:** FR-27 (with FR-24)

### UT-3 — The actively managing / complex-care beneficiary

Established diagnosis, daily medications (including polypharmacy and GLP-1 injectables), numbers that are rising (Robert: A1c 7.4% → 7.9%) or plateaued (DeShawn), and care spread across multiple providers and settings. Sarah W., the featured comorbid persona (T2D + obesity), anchors this type's end-to-end journey.

#### US-3.1 — Stay on top of my medications

**As** a beneficiary on daily medications (Robert; Linda with four), **I want** my medication list, adherence record, and refill status drawn from my claims, **so that** I never run out or lose track.

Acceptance criteria:

- Robert's Care & Medications shows the taken/due list, the refill-ready-from-claims indicator, the 4-week adherence grid at 26/28 (one partial, one missed, today pending), and care-team cards (FR-6).
- Linda's four-medication polypharmacy profile renders fully (FR-21).
- Medications carry RxNorm codes in detail views, flagged as illustrative (FR-33).

**Validates:** FR-6, FR-21, FR-33

#### US-3.2 — See my numbers against my targets

**As** a beneficiary managing T2D (Robert) or T2D plus hypertension (Linda), **I want** trend charts with my target zones, **so that** I can tell at a glance whether I am drifting.

Acceptance criteria:

- Robert: quarterly A1c line with shaded <7.5% target zone and red latest point; 14-day fasting glucose with the 80–130 shaded band (FR-5).
- Linda: a BP trend is visible with her Omron cuff connected (FR-23).
- Charts animate on scroll-into-view once per session; `prefers-reduced-motion` renders the final state with no animation (FR-11).

**Validates:** FR-5, FR-11, FR-23

#### US-3.3 — A care team that catches drift — and is reachable

**As** a beneficiary whose A1c is rising (Robert), **I want** the app to alert me with a concrete next step and let me message my care team or book the follow-up, **so that** deterioration triggers action, not just a number on a chart.

Acceptance criteria:

- Robert's Overview shows the gold A1c alert banner with the "Schedule Jun 18, 10:30 AM" CTA (FR-4).
- The demo replay control re-fires the alert: aria-live toast, banner highlight, feed entry (FR-15).
- /connect provides threads per care-team member; a guidance request receives a seeded simulated reply after a delay; appointment booking confirms the seeded slot; the "simulated responses" label persists (FR-24).

**Validates:** FR-4, FR-15, FR-24

#### US-3.4 — Kill the clipboard at check-in

**As** a beneficiary seeing a new specialist (Sarah), **I want** to share a verified record bundle by QR at check-in and have the visit summary flow back into my records, **so that** I never re-write my history on a paper form.

Acceptance criteria:

- /share renders the shareable QR (mock token); "simulate check-in" writes `share_sessions` and an `access_log` entry with purpose `treatment` (FR-30).
- The visit summary returns via mock Smart Health Link as a `clinical_documents(visit_summary)` row and fires the AI read (FR-30).
- The returned summary is visible in /records as a DocumentReference mock (FR-31).
- The sequence is demonstrable end-to-end with Sarah active (FR-30).

**Validates:** FR-30, FR-31 (returned-summary path)

#### US-3.5 — Explain what changed and why it matters

**As** a beneficiary whose medication was titrated after a visit (Sarah), **I want** a plain-language explainer of the change and proactive insights that flag trends worth asking about, **so that** I understand my plan instead of just following it.

Acceptance criteria:

- A titration explainer renders after a returned visit summary (FR-32).
- Seeded insight cards (trend / titration / referral_suggestion) appear on Overview and Trends; each is badged "AI-generated, not clinical judgment," names its data basis, and offers an escalation action (FR-32).
- Sarah shows a referral_suggestion insight (FR-32).
- The assistant gives a plain-language titration explanation on request (FR-25).

**Validates:** FR-25, FR-32

### UT-4 — The engaged, device-connected self-tracker

Data-rich and motivated: Priya runs a CGM and insulin pump, Aisha tops the leaderboard with an Apple Watch, Jim holds a 180-day medication streak at A1c 6.6%. Success for this type means the app keeps up with their data and recognizes success rather than only flagging risk.

#### US-4.1 — Connect my devices and see their data immediately

**As** a T1D beneficiary with a CGM and pump (Priya), **I want** to pair my devices and have their data flow into my dashboard, **so that** the app reflects my actual monitoring.

Acceptance criteria:

- /devices shows the catalog with connected/available states; the simulated pairing modal (1–2 s) flips the device to connected, sets `last_sync_at`, and adds the data source and series (FR-23).
- Connecting the CGM reveals Priya's time-in-range card (68%); connecting the BP cuff reveals Linda's BP trend (FR-23).
- Disconnecting hides device-only cards (FR-23).

**Validates:** FR-23

#### US-4.2 — Recognize when I'm doing well

**As** a well-controlled beneficiary (Jim), **I want** in-range, positive states — not only alarms — **so that** staying healthy is visible and rewarded.

Acceptance criteria:

- Jim renders in-target band states, a full badge shelf, and his 180-day medication streak (FR-21).
- Aisha's high-engagement profile shows 12k steps, leaderboard-topping streaks, and a locked badge on display; she holds no badge her data could not have earned (FR-21, FR-22).
- Stat tiles count up (700 ms) on first view, reduced-motion safe (FR-19).

**Validates:** FR-19, FR-21, FR-22

#### US-4.3 — Make the work feel like progress

**As** a motivation-driven beneficiary (Aisha), **I want** points, levels, streaks, badges, and challenges, **so that** daily self-management has momentum.

Acceptance criteria:

- /rewards shows points, level ring, current and best streaks, earned and locked badges, and challenges (FR-22).
- The demo award control fires a toast and badge pop-in (500 ms scale + gold glow) announced via aria-live; reduced-motion renders the final state (FR-22).

**Validates:** FR-22

#### US-4.4 — Talk to it hands-free, and log how I feel

**As** a beneficiary mid-activity, **I want** to use voice with the assistant and log a symptom check-in conversationally, **so that** quick interactions stay quick — and unsafe symptoms route to care.

Acceptance criteria:

- The mic uses browser SpeechRecognition/speechSynthesis with a listening indicator and stop control; where unsupported, the control is hidden with a clear message; no audio leaves the browser (FR-26).
- A check-in writes a `symptom_checkins` row (FR-34).
- Red-flag keywords return a direct-to-care safety response — never a diagnosis (FR-34).

**Validates:** FR-26, FR-34

#### US-4.5 — Help with the costs that threaten my adherence

**As** a Marketplace enrollee with high out-of-pocket insulin and CGM-supply costs (Priya), **I want** cost-saving programs surfaced where I will see them, **so that** affordability does not break my regimen.

Acceptance criteria:

- Priya's medication-affordability driver (illustrative Z59.6) surfaces cost-saving programs across the surfaces named in her `socialDrivers` (programs, nearby, assistant) (FR-9, FR-28; PRD §4.5).

**Validates:** FR-9, FR-28; PRD §4.5 socialDrivers behavior

### UT-5 — The data-owner

Every beneficiary is also the owner of a sensitive record; trust is the precondition for everything above. This type is cross-cutting — its stories must pass regardless of which persona is active. Sarah's journey step 6 ("she owns her data") and DeShawn exemplify it.

#### US-5.1 — Show me what's connected and current

**As** a beneficiary whose records live in many places, **I want** to see every connected source, when it last synced, and what was found across the network, **so that** I know the app is working from my complete, current record.

Acceptance criteria:

- Data & Consent lists sources with last-sync times and standards chips; the consent record (granted 2026-03-03) shows the identity details per FR-14; sharing rows are present (FR-10).
- "Sync now" runs the simulated Record Locator (returning discovered organizations and record counts), then 400–1200 ms latency, sets `last_sync_at` to demo-now, and shows a success toast; locator results are visible in Data & Consent (FR-13).

**Validates:** FR-10, FR-13

#### US-5.2 — Tell me who looked at my record, and why

**As** a beneficiary, **I want** a readable audit trail of every access with its purpose, **so that** sharing my record is something I can verify, not something I must take on faith.

Acceptance criteria:

- The audit trail is viewable (not a bare count) with actor, timestamp, scope, and purpose-of-use from {treatment, individual_access, patient_share, operations} (FR-10).
- A point-of-care share (US-3.4) appears in the trail with purpose `treatment` (FR-30).
- Sharing a snapshot with a provider (FR-24) logs an access entry (FR-10).

**Validates:** FR-10 (with FR-24 and FR-30 logging paths)

#### US-5.3 — Let me take it back

**As** a beneficiary who changes my mind, **I want** revoking consent to actually disconnect my data, **so that** consent is real and not decorative.

Acceptance criteria:

- The revoke action produces disconnected empty states across the app with a clear reconnect path (FR-14).
- Reconnecting restores the connected experience (FR-14).

**Validates:** FR-10, FR-14

#### US-5.4 — My whole chart, not just numbers

**As** a beneficiary with records scattered across systems, **I want** my structured results and my documents — radiology reports, outside labs, specialist notes, returned visit summaries — in one viewer with plain-language reads, **so that** my full history is usable, not just stored.

Acceptance criteria:

- /records lists structured (coded) items plus at least three unstructured document types (radiology, outside_lab, specialist_note) and returned visit_summaries, as DocumentReference mocks (FR-31).
- The document viewer exposes real DOM text; every document offers an "Explain this" AI read (FR-31).
- Labs, medications, and conditions display LOINC / RxNorm / SNOMED codes in record and detail views; standards are stated as USCDI v3 / US Core IG and flagged as illustrative pending validation (FR-33).

**Validates:** FR-31, FR-33

## 4. Global acceptance conventions (apply to every story)

1. **Persona sweep (FR-2, FR-21).** Criteria naming a persona are tested with that persona active via the grouped toggle. Criteria not persona-specific MUST pass for all 13 personas. No screen renders empty for any persona.
2. **Both views (FR-3).** Each story passes in the mobile experience (<880 px) and the desktop dashboard (≥880 px) wherever the feature exists in both.
3. **Fixed demo clock.** `DEMO_TODAY=2026-06-06`; all relative dates, charts, and copy derive from it.
4. **Data provenance (FR-12).** All displayed data comes from SQLite via the internal API — observable in the network tab; zero hardcoded display data; zero external network calls.
5. **Verbatim copy (FR-1).** Where a prototype shows a screen, copy and values match it exactly for Maria and Robert.
6. **Accessibility (FR-11, FR-18; PRD §12).** Section 508 / WCAG 2.1 AA applies to every screen a story touches; all animation respects `prefers-reduced-motion`.
7. **Simulation honesty.** Wherever a reply or interpretation is generated, it is labeled simulated and/or AI-generated (FR-24, FR-25, FR-32).
8. **Repeatability (FR-16).** `POST /api/demo/reset` restores exact seed state, so the full story suite can be re-run from scratch.

## 5. Coverage matrix (FR ↔ stories)

| FR | Validated by |
| --- | --- |
| FR-1 | Convention 5; PRD §13 |
| FR-2 | Convention 1; PRD §13 |
| FR-3 | Convention 2; PRD §13 |
| FR-4 | US-1.1, US-3.3 |
| FR-5 | US-1.1, US-3.2 |
| FR-6 | US-3.1 |
| FR-7 | US-1.2 |
| FR-8 | US-1.3, US-2.4 |
| FR-9 | US-1.3, US-2.4, US-4.5 |
| FR-10 | US-5.1, US-5.2, US-5.3 |
| FR-11 | US-3.2; Convention 6 |
| FR-12 | Convention 4 |
| FR-13 | US-5.1 |
| FR-14 | US-2.1, US-5.3 |
| FR-15 | US-3.3 |
| FR-16 | Convention 8 |
| FR-17 | PRD §13 (briefing page — audience-facing, not beneficiary-facing) |
| FR-18 | US-2.3; Convention 6 |
| FR-19 | US-4.2 |
| FR-20 | PRD §13 (presenter tooling) |
| FR-21 | Convention 1; US-2.4, US-3.1, US-4.2 |
| FR-22 | US-4.2, US-4.3 |
| FR-23 | US-3.2, US-4.1 |
| FR-24 | US-2.5, US-3.3, US-5.2 |
| FR-25 | US-2.2, US-3.5 |
| FR-26 | US-4.4 |
| FR-27 | US-2.5 |
| FR-28 | US-1.5, US-2.4, US-4.5 |
| FR-29 | US-1.4 |
| FR-30 | US-3.4, US-5.2 |
| FR-31 | US-3.4, US-5.4 |
| FR-32 | US-3.5 |
| FR-33 | US-3.1, US-5.4 |
| FR-34 | US-4.4 |
| FR-35 | US-3.4 → US-3.5 → US-5.2 exercise the journey's substance; presenter launch points per PRD §13 |

Demo-mechanics requirements (FR-1, FR-2, FR-3, FR-11, FR-12, FR-16, FR-17, FR-19, FR-20, and the presenter aspects of FR-35) serve the demo operator rather than the beneficiary; they are validated against the acceptance criteria in PRD Section 13 / `#spec-requirements`, with the conventions above enforcing them throughout story testing.

## 6. Evaluation procedure

1. Reset to seed state (`POST /api/demo/reset`).
2. For each story: activate the named persona(s) via the toggle, execute each acceptance criterion in both views (Convention 2), and record pass / fail with evidence (screenshot or DOM/API observation).
3. Run the persona sweep (Convention 1) for criteria not persona-specific.
4. A story **passes** only when all of its acceptance criteria pass and no global convention is violated on the screens it touches.
5. **Functional success:** every story whose `Validates:` list includes a P0 requirement MUST pass; stories mapping only to P1 requirements MUST pass for a release-quality demo; P2-mapped criteria (FR-19, FR-34 within US-4.2/US-4.4) SHOULD pass and their status MUST be reported.
6. Where a criterion fails, cite the story ID, criterion, persona, view, and the PRD requirement — then fix and re-run from step 1.
