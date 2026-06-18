# CMS Web Design System

A design system for building web applications and properties for the **Centers for Medicare & Medicaid Services (CMS)** — the U.S. federal agency that administers Medicare, Medicaid, CHIP, and the Health Insurance Marketplace.

This system codifies the CMS digital brand into reusable tokens, components, and full-screen UI kits so that any CMS web application — public-facing or internal — feels like an authoritative, accessible, government-standard product.

> **For AI agents:** the machine-readable token spec lives in **[`DESIGN.md`](./DESIGN.md)** at the project root, authored to the [DESIGN.md format](https://github.com/google-labs-code/design.md). Read it first for exact color, typography, radius, spacing, and component token values; this readme provides the surrounding rationale.

---

## What CMS is

CMS serves two broad audiences through its web properties:

1. **The public & partners** — beneficiaries, providers, agents/brokers, states, and researchers who visit **cms.gov** to find coverage rules, fee schedules, manuals, transmittals, newsroom articles, and program information.
2. **Internal program operators** — administrators who run the **CMS Program Portal** to register programs, report data, manage policy resources, and oversee compliance.

The brand personality is **reliable, transparent, and civic-minded**. The design language prioritizes clarity, accessibility (WCAG 2.1 AA), and information architecture over decoration — a modern take on a government-standard finish that signals institutional trust.

## Products represented in this system

| Surface | What it is | UI kit |
| --- | --- | --- |
| **CMS.gov public website** | Public-facing federal site: hero, mega-menu nav, priority cards, top resources, newsroom. Gold-arch + dot-grid motifs over warm candid photography. | `ui_kits/cms_gov_public/` |
| **CMS Program Portal (Admin Console)** | Internal app: sidebar + navy top bar, bento dashboards, data tables, analytics, policy/resource library. | `ui_kits/program_portal/` |

## Sources

This system was reverse-engineered from materials supplied in the `stitch_cms_web_design_system/` codebase (read-only), plus the public cms.gov site:

- `institutional_integrity/DESIGN.md` — the authoritative token spec (colors, type, radii, spacing). **Primary source of truth.**
- `cms_admin_dashboard/code.html` — Admin Console "Overview" screen (bento dashboard).
- `data_reporting_analytics/code.html` — Data Reporting & Analytics screen (charts, tables).
- `policy_resource_library/code.html` — Policy & Resource Library screen (search, resource cards).
- `program_registry/code.html` — Program Registry screen (data table, status badges).
- `extracted_text_from_https_www.cms.gov.md` — full nav IA + homepage copy of cms.gov.
- `image_from_…/screen.png` ×2 — real CMS.gov hero photography (cut-out subjects) → copied to `assets/images/`.
- Live reference: <https://www.cms.gov/>

> The Stitch codebase used Tailwind with a Material-derived token set. We re-grounded the radius scale to the sensible values documented in `DESIGN.md` (sm `2px` → xl `12px`) rather than the Tailwind remap in the HTML, which had mislabeled keys.

---

## CONTENT FUNDAMENTALS

How CMS writes. The voice is **plain-language, civic, and direct** — federal plain-writing guidelines, not marketing copy.

- **Person:** Addresses the reader as **"you"**; refers to the agency as **"we"** ("We're empowering states…", "We support the development and testing of…"). Warm but institutional.
- **Tone:** Confident, factual, service-oriented. States what the agency does and what the reader can do. No hype, no exclamation marks.
- **Casing:** **Sentence case** for headings and buttons ("Top resources", "Visit the newsroom", "Learn more"). Title Case only for proper program names (Medicare Part B, Rural Health Transformation Program, Health Insurance Marketplace).
- **Calls to action:** Short, verb-led, predictable — "Learn more", "Search", "Visit the newsroom", "See what's new", "Show links", "Export PDF", "New Report".
- **Naming:** Programs and documents carry exact official names and IDs (Publication 100-02, CMS-2454-IFC, ID: CMS-MPB-001). Precision signals authority.
- **Acronyms:** Spelled out on first use with the acronym in parens — "Health Insurance Marketplace quality initiatives", "National Provider Identifier (NPI)", "Medicare Learning Network® (MLN)".
- **Microcopy:** Functional and reassuring in the portal — "Updated 12 mins ago", "All protocols are functioning normally within secure parameters", "Action Required", "Review Required".
- **Dates:** `Mon DD, YYYY` ("Oct 24, 2024") in body; stacked `DD / Mon` in newsroom article chips.
- **Emoji:** **Never.** This is a federal agency. Iconography carries all visual-symbol duty.
- **Vibe:** Trustworthy public servant. Reads like a well-run government office — organized, plain-spoken, accessible to everyone from a beneficiary to a policy analyst.

Example homepage strings:
> "What are you looking for today?"
> "We're modernizing the nation's digital health ecosystem to empower patients & deliver better outcomes."
> "Check the fee schedules to find billing codes."

---

## VISUAL FOUNDATIONS

**Color.** Anchored by **Navy Deep `#112E51`** (authority, permanence) used for headers, primary actions, and brand marks. **White / `#F9F9F9`** dominates as background for a clean, clinical, legible feel. **Sky Tint `#E1F3F8`** softens the navy in callouts, card headers, and hover states. **Caution Gold `#FDB81E`** is the *singular* accent — used sparingly for CTAs, active-nav rules, status indicators, and the public site's signature arch. **Slate Gray `#5B616B`** provides structural scaffolding (secondary text, borders). Status colors: error red `#D22630`, success green, caution amber. Two background colors max per layout (white + one tint).

**Type.** **Public Sans** (USWDS standard) is the workhorse for editorial + UI — neutral, open, performs at all scales. **Lexend** is the functional companion for labels, data points, and small controls (improves reading speed in dense admin views). Headlines: bold weight, tight tracking (`-0.02em` on display). Body: generous line-height (16/24, 18/28) for long-form readability. Maintain a strict vertical rhythm.

**Spacing.** Strictly linear **8px base**. Component internal padding favors the breathable side — 16px or 24px over tighter increments. Layout is a fixed-fluid hybrid: 1280px max-width 12-col grid on desktop (24px gutters, 40px outer margins), collapsing to 8-col tablet / 4-col mobile.

**Backgrounds.** Mostly flat white/`#F9F9F9`. **No gradient washes.** The public site uses two signature decorations: the **gold arch** (large rounded-top gold shape behind cut-out photography) and the **dot grid** (navy radial-dot field as accent texture). Admin chart panels use a faint dotted `grid-pattern` texture. No full-bleed photo backgrounds behind text.

**Imagery.** Warm, candid, **diverse real photography** of everyday Americans and healthcare workers — bright natural light, optimistic, human. Subjects are often **cut out** and placed on the gold arch. Never cold or corporate-stocky; never illustration for people.

**Elevation & depth.** Deliberately flat. Hierarchy comes from **tonal layering** (white → `#F3F3F3` → `#EEEEEE`) and **1px hairline outlines** (`#C4C6CF`), *not* shadows. Only genuinely floating elements (dropdowns, modals) get a single **atmospheric navy-tinted shadow** `0 4px 12px rgba(17,46,81,0.08)`. Interactive cards may lift subtly on hover (`translateY(-2px)` + soft shadow).

**Corner radii.** Soft and disciplined — `0.25rem` (4px) buttons/inputs/tags, `0.5rem` (8px) cards/modals, `0.75rem` (12px) feature panels. Status badges are fully pill-shaped. Never sharp/brutalist, never heavily rounded.

**Cards.** Flat: white surface, 1px `#C4C6CF` border, no shadow unless interactive. Card headers often use a **Sky Tint** background to separate metadata from body. KPI/bento cards pair a tinted icon chip (sky/gold/error container) with a large display number.

**Borders.** 1px solid hairline for cards/dividers; inputs use a 1px slate-gray border thickening to 2px navy on focus. Active navigation uses a **4px gold rule** (left border in sidebar, bottom border in top nav).

**Hover / press / focus.** Hover: subtle background fill (`surface-container-highest` / `sky-tint`), `brightness(0.95)` on gold, or a card lift. Press: `active:scale-95` micro-shrink on buttons. Focus: gold focus ring (USWDS convention) — `3px` solid `#FDB81E` with 2px offset; search fields ring gold.

**Transparency & blur.** Used rarely. A `glass-card` treatment (`rgba(255,255,255,0.8)` + `blur(8px)`) appears for select overlay surfaces; otherwise surfaces are opaque.

**Animation.** Restrained and functional. Standard ease `cubic-bezier(0.2,0,0.2,1)`, 150–300ms. Color/background transitions on hover, gentle transforms (icon `scale(1.1)`, card lift), button press shrink. **No bounce, no infinite decorative loops, no parallax.** Respect `prefers-reduced-motion`.

**Layout rules.** Sticky navy top bar (64px). Fixed 256px sidebar in the portal. Content centered to 1280px max. Footer is `surface-container-highest` with legally-required links (Privacy, Accessibility Statement, FOIA, Contact). Mobile gets a bottom nav bar in the portal.

---

## ICONOGRAPHY

- **System:** **Material Symbols Outlined** (Google), loaded as a variable icon font across all CMS web apps in this codebase. Default axis settings: `FILL 0, wght 400, GRAD 0, opsz 24`. Apply `.is-filled` (or `font-variation-settings: 'FILL' 1`) for active/emphasis states.
- **Usage:** Inline `<span class="material-symbols-outlined">dashboard</span>`. Common glyphs: `dashboard`, `folder_managed`, `analytics`, `policy`, `group`, `account_balance` (brand mark), `health_and_safety`, `verified_user`, `notifications`, `search`, `file_download`, `picture_as_pdf`, `add_circle`, `check_circle`, `pending`, `warning`, `trending_up`, `arrow_forward`, `chevron_left/right`, `language`, `settings`, `logout`.
- **Brand mark:** A navy rounded square containing a filled `account_balance` (or `health_and_safety`) glyph in white — the Admin Console lockup. This stands in for an official seal in app chrome.
- **Stroke / fill:** Outlined (stroke) by default; filled for selected nav, status chips, and KPI icon tiles. Single weight (400). Icons inherit text color (navy, slate, white-on-navy, or status color).
- **SVG vs font:** The system is **icon-font based** (Material Symbols) — no bespoke SVG icon set in the codebase. Decorative chart paths are inline SVG `<polyline>`/`<path>`. The public hero **photography** ships as PNG cut-outs in `assets/images/`.
- **Emoji / unicode:** Never used as icons.
- **Substitution note:** Material Symbols Outlined is served from the Google Fonts CDN (the genuine icon set used in source). No substitution. Public Sans + Lexend are likewise the real CMS faces, CDN-hosted.

---

## Index / Manifest

**Root**
- `DESIGN.md` — machine-readable design spec ([DESIGN.md format](https://github.com/google-labs-code/design.md)): YAML token front matter (colors, typography, rounded, spacing, components) + design-rationale prose. **The canonical, agent-readable source of truth for tokens.**
- `styles.css` — entry point (consumers link this). `@import` manifest only.
- `readme.md` — this file.
- `SKILL.md` — Agent Skill wrapper.

**Tokens** (`tokens/`)
- `colors.css` — brand primitives, neutrals, status + semantic aliases.
- `typography.css` — families, weights, type scale + helper classes.
- `spacing.css` — 8px spacing scale, radii, shadows, layout, motion.
- `fonts.css` — Public Sans, Lexend, Material Symbols (@import) + icon base class.
- `base.css` — reset, gold-arch + dot-grid motifs, focus, scrollbar.

**Components** (`components/`) — see each directory's card.
- `core/` — Button, Badge, Tag, Card, Avatar, Input, Select, StatCard, Alert.
- `navigation/` — TopNav, SideNav.
- `feedback/` — Dialog, Tabs, Pagination, Toast (+ ToastViewport), Tooltip.
- `indicators/` — Spinner, ProgressBar, Gauge (animated), Skeleton.
- `dataviz/` — LineChart, BarChart, DonutChart (animated SVG), Globe3D (three.js/WebGL).

**UI kits** (`ui_kits/`)
- `cms_gov_public/` — public CMS.gov homepage recreation.
- `program_portal/` — internal Admin Console: Overview dashboard, Program Registry, Policy Library, **Data Reporting** (charts + gauge), **User Management** (roles, invite dialog → toast).

**Design sheet** (`design-sheet.html`) — single-page specimen of every token, type role, color, and component. Also registered as an "Overview" starting point.

**Foundations** — specimen cards live alongside tokens (`guidelines/`), rendered in the Design System tab.

**Assets** (`assets/`)
- `images/` — CMS.gov hero photography (cut-out PNGs).

---

## Animation & motion

Motion is restrained and functional (see Visual Foundations). Animated components — `Gauge` (count-up + arc fill), `LineChart`/`BarChart`/`DonutChart` (entrance reveal), `ProgressBar`, `Spinner`, `Skeleton` (shimmer), and `Globe3D` (a three.js/WebGL rotating data globe) — all render their **visible end-state by default** and treat animation as enhancement, so they stay correct under reduced-motion, print, and static capture. `Globe3D` loads three.js from CDN on demand and falls back to a text notice if WebGL is unavailable.

> Charts are pure SVG/CSS (no chart lib). Note: SVG stroke-based visuals (line paths, donut arcs) render correctly in real browsers but may not appear in DOM-rasterized screenshot tools — verify them live.

---

## Caveats & flags

- **Fonts are CDN-hosted** (Google Fonts) rather than self-hosted binaries — these are the genuine CMS faces, so rendering is accurate, but offline/airgapped deployments should self-host `Public Sans` + `Lexend` + `Material Symbols` and swap the `@import` lines in `tokens/fonts.css` for local `@font-face` rules.
- **No official CMS seal/logo file** was provided; the brand mark uses the codebase's navy-square + `account_balance` lockup. Provide the official CMS logo to replace it.
- Only **two hero photos** were available. More candid, diverse photography is needed for a full public-site build.
