# Docs — Specifications, Prototypes, and Brand System

This folder holds everything that defines *what* the HTEAP Diabetes & Obesity demo app should do and *how* it should look. It is the design and requirements source of truth. Code does not live here; this is the material you read before and during a build to know what to build and how to style it.

For the broader project context (stack, the "everything is simulated" constraint, accessibility targets), see the [project README](../README.md) one level up.

## What is in this folder

The folder has three working areas, a top-level token file, the build prompts, and supporting assets:

| Area | Path | What it holds |
| --- | --- | --- |
| Requirements | [`spec/`](spec/) | The product requirements document (PRD) — the authoritative specification — and the User Stories, the functional success criteria the build is evaluated against. |
| Visual reference | [`example/`](example/) | The concept prototypes and a built standalone demo that show the intended look and behavior. |
| Brand system | [`Style/`](Style/) | The CMS Web Design System: tokens, components, UI kits, and brand rules. |
| Token notes | [`DESIGN.md`](DESIGN.md) | Top-level "Institutional Integrity" palette and type scale. |
| Build prompts | [`BUILD-PROMPT.md`](BUILD-PROMPT.md), [`BUILD-PROMPT-VAR.md`](BUILD-PROMPT-VAR.md), [`BUILD-PROMPT.html`](BUILD-PROMPT.html) | The autonomous build prompts used to generate the app — process history, not part of the spec contract. |
| Branding | [`Assets/`](Assets/) | Scope Infotech logo and icon used by the app footer and the repo's governance docs. |

## How to use each area

Work through them in this order: requirements first, then the visual reference, then the brand system.

### 1. `spec/` — what to build

[`spec/hteap-demo-app-prd.html`](spec/hteap-demo-app-prd.html) is the authoritative specification. It defines goals, personas, information architecture, functional requirements, the data schema, simulated API contracts, accessibility requirements, and acceptance criteria.

Read it first whenever you start a feature. It is both human-readable and machine-readable:

- Requirement strength follows RFC 2119 (MUST / SHOULD / MAY), in Sections 1–14.
- Section 16 carries machine-readable JSON blocks with stable IDs (`#spec-meta`, `#spec-requirements`, `#spec-design-tokens`, `#spec-api`, `#spec-seed-data`). Where prose and JSON disagree, JSON wins for data values and prose wins for behavior.
- The reference database schema is in the `<pre>` block with ID `#sql-ddl`.

[`spec/USER-STORIES.md`](spec/USER-STORIES.md) is the PRD's normative companion: five target-user types and 24 user stories with testable acceptance criteria, mapped to FR-1–FR-35. **These stories are the functional success criteria** — the build is evaluated against them (see the document's Section 6 evaluation procedure). Read them alongside the PRD before building, and validate against them before declaring any feature done.

### 2. `example/` — what it should look like

These files are the normative visual reference. When the PRD and a prototype describe the same screen, match the prototype for layout, markup, and copy.

| File | Use it for |
| --- | --- |
| [`example/HTEAP-Demo-App-Standalone.html`](example/HTEAP-Demo-App-Standalone.html) | The closest existing realization of the target experience — a complete single-file demo (~2 MB). Open it to see intended end-to-end behavior, animation, and the persona toggle. |
| [`example/hteap-diabetes-obesity-prototype-desktop.html`](example/hteap-diabetes-obesity-prototype-desktop.html) | The static desktop web-app concept (dashboard, Trends & Labs, Care & Prevention Plan). Reference for desktop layout and copy. |
| [`example/hteap-diabetes-obesity-prototype.html`](example/hteap-diabetes-obesity-prototype.html) | The static mobile patient-app concept and the problem / approach / payoff narrative. Reference for mobile layout and copy. |

To view any of these, open the file in a browser.

### 3. `Style/CMS Web Design System/` — how to style it

Apply this system to every styling decision so the app reads as an authoritative, accessible, government-standard product. The brand ("Institutional Integrity") is navy-anchored with a sparing gold accent, flat hairline cards, Public Sans + Lexend type, and an 8px spacing base.

Entry points inside [`Style/CMS Web Design System/`](Style/CMS%20Web%20Design%20System/):

| Item | Path | Use it for |
| --- | --- | --- |
| Readme | [`readme.md`](Style/CMS%20Web%20Design%20System/readme.md) | Rationale, brand voice, visual foundations, and a full index. Start here for the "why." |
| Token spec (canonical) | [`DESIGN.md`](Style/CMS%20Web%20Design%20System/DESIGN.md) | Exact colors, typography, radii, spacing, and component tokens. Read before implementing styles. |
| Skill wrapper | [`SKILL.md`](Style/CMS%20Web%20Design%20System/SKILL.md) | How to invoke the system as a skill when generating CMS-branded screens. |
| Stylesheet | [`styles.css`](Style/CMS%20Web%20Design%20System/styles.css) | The CSS to link; it imports the token layer in `tokens/`. |
| Tokens | `Style/CMS Web Design System/tokens/` | `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`. |
| Components | `Style/CMS Web Design System/components/` | React components (`.jsx`) with `.d.ts` types and `.prompt.md` usage notes, grouped as `core/`, `navigation/`, `feedback/`, `indicators/`, `dataviz/`. |
| UI kits | `Style/CMS Web Design System/ui_kits/` | Full-screen references: `cms_gov_public/` and `program_portal/`. |
| Guidelines & assets | `Style/CMS Web Design System/guidelines/`, `.../assets/` | Specimen cards (color, type, spacing, brand) and brand imagery. |

### Two token files — which wins

[`DESIGN.md`](DESIGN.md) at this folder's root holds the Institutional Integrity palette and type scale. The design system's own [`Style/CMS Web Design System/DESIGN.md`](Style/CMS%20Web%20Design%20System/DESIGN.md) is the more complete, canonical token spec. When the two differ, prefer the design system's version.

## Build prompts — how the app was generated (reference)

These three files are process artifacts: the autonomous prompts that drove the build. They are kept for history and are **not** authoritative like the PRD — when building a feature, work from `spec/`, not from these.

| File | What it is |
| --- | --- |
| [`BUILD-PROMPT.md`](BUILD-PROMPT.md) | The original end-to-end autonomous build prompt (goals G1–G10). |
| [`BUILD-PROMPT-VAR.md`](BUILD-PROMPT-VAR.md) | A variant whose prohibition forbids using the `example/` prototypes and requires an original design judged against [`DESIGN-BRIEF.md`](../DESIGN-BRIEF.md); this is the variant that drove the as-built app. |
| [`BUILD-PROMPT.html`](BUILD-PROMPT.html) | A browser-readable rendering of the prompt in the CMS design language (loads web fonts; it is a document, not the app). |

## Quick map

```
Docs/
├── README.md      ← this file
├── DESIGN.md      ← top-level Institutional Integrity token notes
├── BUILD-PROMPT.md / -VAR.md / .html   ← autonomous build prompts (process history)
├── spec/          ← the PRD (what to build) + USER-STORIES.md (how success is judged)
├── example/       ← prototypes + built standalone demo (what it looks like)
├── Assets/        ← Scope Infotech logo and icon
└── Style/
    └── CMS Web Design System/   ← tokens, components, UI kits, brand rules (how to style it)
```
