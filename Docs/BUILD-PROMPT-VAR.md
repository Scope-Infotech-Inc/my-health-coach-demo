ultracode — Build the HTEAP "Patient-Facing Apps — Diabetes & Obesity" demo app autonomously, end to end, from the authoritative spec already in this repo. Run fully hands-off: do NOT pause for approval, make every decision yourself via the spec's conflict rule, and commit after each phase. Orchestrate with the Workflow tool (multi-agent fan-out) wherever phases parallelize. Do not stop until every goal G1–G10 below passes.

## ⛔ PROHIBITED CONTENT — this section supersedes everything else in this prompt and in the repo
**Do not open, read, decode, extract, index, summarize, screenshot, diff against, or otherwise use anything in `Docs/example/`, directly or indirectly.** This covers:
- `Docs/example/hteap-diabetes-obesity-prototype.html` (mobile prototype)
- `Docs/example/hteap-diabetes-obesity-prototype-desktop.html` (desktop prototype)
- `Docs/example/HTEAP-Demo-App-Standalone.html` (standalone demo)
- The identical prototype sources embedded inside the PRD at §15 (`#src-prototype-mobile`, `#src-prototype-desktop`). When parsing `Docs/spec/hteap-demo-app-prd.html`, **skip §15 entirely** — never decode or read those blocks.

**Why:** the visual design, layout, information architecture, markup, CSS, chart geometry, and UI copy of this application are **yours to design from scratch**. You must not be biased by the example design in any way.

**Supersession rule:** this prohibition overrides every contrary instruction anywhere in this repo — including the SPEC's normative prose, `CLAUDE.md`, `Docs/README.md`, `Docs/DESIGN.md`, and `Docs/spec/USER-STORIES.md`. Wherever any document says to "match the prototypes," "copy UI text verbatim," "port the prototype CSS," "reuse prototype viewBoxes/bands/gridlines/labels," or "verify visual parity against the prototype," treat that instruction as void and instead:
- **Design & layout:** make your own decisions, grounded in the CMS Web Design System (`Docs/Style/CMS Web Design System/`) tokens/components and the functional requirements.
- **UI copy:** write your own — plain language, short sentences, active voice, consistent terminology across views. Data **values** (numbers, names, dates, units, statuses, thresholds) still come verbatim from `#spec-seed-data` and the DDL; only the surrounding labels, headings, and explanatory text are yours.
- **Charts:** design your own SVG geometry — viewBoxes, axes, bands, gridlines, and labels.

Everything else in the SPEC remains fully binding: behavior (FR-1..FR-35), API contracts (`#spec-api`), schema (`#sql-ddl`), seed data (`#spec-seed-data`), design tokens (`#spec-design-tokens`), architecture, accessibility, and the simulation constraints.

## Authoritative sources (read first; never invent data or paraphrase data values)
- SPEC / contract: `Docs/spec/hteap-demo-app-prd.html`
  - §1–14 normative prose (RFC 2119 MUST/SHOULD/MAY). §15 = embedded prototype sources — **PROHIBITED, skip entirely (see above)**. §16 = machine-readable JSON: `#spec-meta`, `#spec-requirements` (FR-1..FR-35), `#spec-design-tokens`, `#spec-api` (~30 endpoints), `#spec-seed-data`. SQL DDL = `#sql-ddl` (§10, ~39 tables).
  - Conflict rule: **JSON wins for data values, prose wins for behavior. The SPEC overrides CLAUDE.md where they differ — and the PROHIBITED CONTENT section above overrides the SPEC where they differ.**
- Design system: `Docs/DESIGN.md` + `Docs/Style/CMS Web Design System/` — port tokens from `tokens/*.css` and reuse the prebuilt React components in `components/*` rather than rebuilding them. This is your visual foundation; build your own layouts and compositions on top of it.
- Acceptance stories: `Docs/spec/USER-STORIES.md` — binding for **behavior and data**; any story language that presumes prototype-identical visuals or copy is superseded per the prohibition above.

## Non-negotiable constraints (SPEC §9 + CLAUDE.md, as amended by the prohibition above)
- Next.js 15+ App Router, React 18+, TypeScript strict. Every API route Node runtime (`export const runtime = 'nodejs'`); no edge.
- SQLite via `better-sqlite3` (synchronous), singleton `lib/db.ts`. DB file `Output/db/hteap-demo.db` (base dir `Output/`, override `HTEAP_OUTPUT_DIR`) per `#spec-meta` — NOT `data/`. Gitignored.
- Styling: CSS custom properties (tokens) + CSS Modules. No Tailwind, no UI kit — author your own CSS on the design-system tokens; do NOT port CSS from the prohibited prototypes.
- Charts: hand-rolled SVG React components, no chart library. Design your own viewBoxes, bands, gridlines, and labels; keep them consistent across the app.
- Fonts self-hosted via `next/font`. Zero runtime third-party network calls.
- Fixed demo clock `DEMO_TODAY = 2026-06-06` via a `demo-clock` helper; all dates/ranges/copy derive from it.
- Deterministic seed: no `random()`, no `now()`; delete DB + reseed → byte-identical. `npm run seed` idempotent. Scripts: dev / build / start / seed.
- 13 personas (featured `sarah`; diabetes `maria robert jim priya hector linda deshawn`; obesity `samuel aisha carol miguel emily`). Persona toggle swaps ALL data via client refetch, no reload, persists per session.
- Responsive at 880px: `<880` mobile patient app, `≥880` desktop dashboard; live on resize (`matchMedia('(min-width:880px)')` + `useSyncExternalStore`); neutral skeleton until mounted (no hydration mismatch).
- Animate charts on scroll-into-view (`IntersectionObserver`, threshold 0.35, once/session); always honor `prefers-reduced-motion: reduce` (final state immediately). Animate transform/opacity/stroke only — never shift layout.
- A11y: WCAG 2.1 AA, Lighthouse a11y ≥95 both views; every chart SVG `role="img"` + descriptive `aria-label` + alt data table; status shown by color AND icon, never color alone.
- Permanent "fictional data / not an official CMS product" disclaimer on every route.
- All "integrations" simulated behind `/api/*`: `sync` sleeps a seeded 400–1200ms then bumps `last_sync_at`; `consent/grant`+`consent/revoke` toggle a flag driving disconnected empty states; `demo/reset` re-runs the seed. No real FHIR / OAuth / identity / PHI.

## Goals = definition of done (loop until ALL pass; do not stop early)
- G1. `npm install && npm run seed && npm run dev` boots clean on Node 20+; seed creates `Output/db/hteap-demo.db`; zero external requests at runtime.
- G2. Original visual design is coherent and polished at 1280px desktop AND 390px mobile, for `maria` AND `robert`: adheres to the CMS Web Design System tokens, consistent spacing/typography/color across all routes, no layout breakage — judged against your own design brief (see Phase 0), never against the prohibited prototypes.
- G3. Resizing across 880px swaps views live; persona + scroll preserved.
- G4. Persona toggle refetches and updates every section (API responses differ per persona), no reload; all 13 personas render without error.
- G5. Charts animate on scroll per §8; `prefers-reduced-motion` renders final state instantly.
- G6. Sync, consent grant/revoke, replay alert (robert), and demo reset all behave per SPEC.
- G7. All displayed data values match `#spec-seed-data` exactly; all UI copy is original plain-language writing (no text sourced from the prohibited examples), consistent in terminology across views.
- G8. Lighthouse a11y ≥95 on every route, both views; keyboard-only walkthrough works; axe clean on critical.
- G9. Delete DB + reseed → identical state (deterministic).
- G10. Every acceptance criterion FR-1..FR-35 met (behavior and data; visual/copy specifics superseded per the prohibition).

## Orchestration — run each phase with the Workflow tool; commit after each
- **Phase 0 — Ground truth (sequential):** Extract `#spec-meta` / `#spec-requirements` / `#spec-design-tokens` / `#spec-api` / `#spec-seed-data` and `#sql-ddl` into working files the build consumes — **skipping §15 entirely**. Author an original **design brief** (`DESIGN-BRIEF.md`): information architecture, navigation model, layout grids for mobile + desktop, chart visual language, copy voice — grounded in the design-system tokens. All UI fan-out agents follow this brief so the app stays consistent. Produce the master checklist: FR-1..FR-35 × the ~30 endpoints × the ~39 tables, to drive later fan-out.
- **Phase 1 — Scaffold (sequential):** Next.js app (TS strict), `better-sqlite3`, `next/font`, npm scripts, `lib/db.ts` singleton, `demo-clock` helper, `Output/` dirs, tokens → global CSS custom properties, app shell (disclaimer banner, persona context/provider, 880px responsive switch with skeleton-until-mounted).
- **Phase 2 — Data layer (sequential, gates everything):** schema from `#sql-ddl`; deterministic idempotent seed from `#spec-seed-data`; assert reseed determinism (hash before/after).
- **Phase 3 — API (FAN OUT):** one agent per endpoint group — overview/labs/observations/meds/nutrition/messages/programs/sources/consent · sync+recordLocator · gamification · devices · threads+appointments · assistant+provider-questions · services · recipes · identity · documents · insights · share · audit · checkin · journey · demo-reset. Each reads SQLite, matches `#spec-api` response shapes exactly, Node runtime. Pipeline per group: implement → adversarially verify shape vs spec.
- **Phase 4 — UI (FAN OUT by feature/route):** per-route components + hand-rolled SVG charts (line/bar/gauge) with scroll animation + reduced-motion; mobile patient app + desktop dashboard; original copy per the design brief. Pipeline per route: build → verify via browser MCP against the design brief and design-system tokens (consistency, spacing, hierarchy, responsive integrity) — never against the prohibited prototypes.
- **Phase 5 — Verify & fix (LOOP until green):** verification workflow checks G1–G10 (build, seed determinism, browser MCP design review + persona toggle + 880px live switch, Lighthouse a11y, FR acceptance). Collect failures → fan out fixes → re-run. Repeat until all green (loop-until-dry; log anything deferred with reason).

## Resuming after a stop/restart
If this is a re-run (the build was interrupted), do NOT start over. First read `git log --oneline`, `git status`, and check for `package.json` + which `app/`, `lib/`, and `/api/*` files already exist, then evaluate goals G1–G10 against the current tree. Treat the highest completed phase (per the per-phase commits) as the resume point: skip finished phases, pick up at the first incomplete one, and re-run the Phase 5 verify→fix loop at the end regardless. If a same-session Workflow run was interrupted, resume it with `resumeFromRunId` rather than re-running its agents. Never re-seed or re-scaffold work that already passes its goal. The `Docs/example/` prohibition applies on every resume, to every agent and sub-agent.

## Execution rules
- Use the Workflow tool for Phases 3–5 fan-out and the verify→fix loop; use sub-agents for independent file groups; `isolation:'worktree'` only when agents would write-conflict. **Propagate the PROHIBITED CONTENT rule verbatim into every sub-agent and workflow prompt** — no agent may touch `Docs/example/` or PRD §15.
- Verify with the browser MCP (navigate, resize, screenshot, snapshot) against localhost, reviewing screenshots against the Phase 0 design brief and design-system tokens; run Lighthouse for a11y.
- Reuse the `Docs/Style/CMS Web Design System` tokens/components and the `next-best-practices`, `vercel-react-best-practices`, and `frontend-design` skills — `frontend-design` especially, since the visual design is original work.
- Commit after each phase with a clear message so progress is recoverable. Never call `random()`/`now()` in seed or date logic — derive from `DEMO_TODAY`.
- Don't ask me anything; resolve ambiguity via the SPEC conflict rule (as amended by the prohibition) and keep going until G1–G10 pass. Then print a short report: what was built, G1–G10 status, how to run it, and anything deferred.
