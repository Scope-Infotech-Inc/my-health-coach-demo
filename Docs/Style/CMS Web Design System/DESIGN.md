---
version: alpha
name: CMS Web Design System
description: >-
  A government-standard design system for Centers for Medicare & Medicaid
  Services (CMS) web properties — public-facing cms.gov and the internal
  Program Portal. Reliable, transparent, civic-minded. Codifies the
  "Institutional Integrity" brand into tokens, components, and UI kits.
colors:
  # ---- Brand primitives ----
  primary: '#112e51'                 # Navy Deep — primary brand, headers, primary actions
  navy-deep: '#112e51'
  navy-900: '#001936'                # darkest navy — strongest text / primary hover
  navy-700: '#2e486c'
  navy-400: '#465f85'                # muted navy / surface tint
  sky-tint: '#e1f3f8'                # pale informational blue — callouts, card headers, hover
  sky-tint-strong: '#d4e6eb'
  caution-gold: '#fdb81e'            # singular accent — CTAs, active-nav rule, focus ring
  gold-dim: '#ffba25'                # gold variant for indicators on navy
  gold-soft: '#ffdea9'
  # ---- Neutrals (tonal layering, not elevation) ----
  white: '#ffffff'
  surface: '#f9f9f9'                 # base page canvas
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'  # cards
  surface-container-low: '#f3f3f3'   # raised surfaces
  surface-container: '#eeeeee'       # sunken surfaces
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2' # footer
  surface-dim: '#dadada'
  slate-gray: '#5b616b'              # USWDS base gray — secondary text, structure
  # ---- Outlines (low-contrast structure) ----
  outline: '#74777f'                 # input borders, stronger dividers
  outline-variant: '#c4c6cf'         # card / hairline borders (default)
  # ---- Foregrounds ----
  on-surface: '#1a1c1c'              # primary body text
  on-surface-variant: '#43474e'      # secondary text
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  on-primary: '#ffffff'              # text on navy
  on-primary-container: '#7d96bf'    # muted text on navy
  # ---- Semantic status ----
  error: '#ba1a1a'
  error-red: '#d22630'               # CMS error red — borders, helper text
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  success: '#2e8540'                 # USWDS green
  success-container: '#ecf3ec'
  on-success-container: '#1a4220'
  warning: '#c38b00'                 # amber text for caution callouts
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  eyebrow:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 2px       # 0.125rem
  DEFAULT: 4px  # 0.25rem — buttons, inputs, tags
  md: 6px       # 0.375rem
  lg: 8px       # 0.5rem — cards, modals
  xl: 12px      # 0.75rem — feature / bento panels
  full: 9999px  # status badges (pill)
spacing:
  '0': 0
  '1': 4px      # half-unit
  '2': 8px      # 1 unit (base)
  '3': 12px
  '4': 16px     # tight component padding
  '5': 20px
  '6': 24px     # gutter / default component padding
  '8': 32px
  '10': 40px    # desktop outer margin
  '12': 48px
  '16': 64px
  '20': 80px
  '24': 96px    # section rhythm on public pages
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.DEFAULT}'
    padding: 12px
  button-primary-hover:
    backgroundColor: '{colors.navy-900}'
    textColor: '{colors.on-primary}'
  button-secondary:
    backgroundColor: '{colors.white}'
    textColor: '{colors.primary}'
    rounded: '{rounded.DEFAULT}'
    padding: 12px
  button-accent:
    backgroundColor: '{colors.caution-gold}'
    textColor: '{colors.primary}'
    rounded: '{rounded.DEFAULT}'
    padding: 12px
  input:
    backgroundColor: '{colors.white}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.DEFAULT}'
    padding: 12px
  card:
    backgroundColor: '{colors.surface-container-lowest}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.lg}'
    padding: 24px
  card-header:
    backgroundColor: '{colors.sky-tint}'
    textColor: '{colors.navy-deep}'
  stat-card:
    backgroundColor: '{colors.surface-container-lowest}'
    textColor: '{colors.navy-deep}'
    rounded: '{rounded.xl}'
    padding: 24px
  badge-success:
    backgroundColor: '{colors.success-container}'
    textColor: '{colors.on-success-container}'
    rounded: '{rounded.full}'
  badge-alert:
    backgroundColor: '{colors.caution-gold}'
    textColor: '{colors.primary}'
    rounded: '{rounded.full}'
  alert-error:
    backgroundColor: '{colors.error-container}'
    textColor: '{colors.on-error-container}'
    rounded: '{rounded.DEFAULT}'
    padding: 16px
  top-nav:
    backgroundColor: '{colors.navy-deep}'
    textColor: '{colors.on-primary}'
    height: 64px
  side-nav:
    backgroundColor: '{colors.surface-container-lowest}'
    textColor: '{colors.on-surface}'
    width: 256px
  footer:
    backgroundColor: '{colors.surface-container-highest}'
    textColor: '{colors.on-surface-variant}'
---

## Brand & Style

The CMS Web Design System builds web properties for the **Centers for Medicare & Medicaid Services** — the U.S. federal agency administering Medicare, Medicaid, CHIP, and the Health Insurance Marketplace. It serves two surfaces: the public-facing **cms.gov** site (beneficiaries, providers, agents, states, researchers) and the internal **CMS Program Portal** admin console (program operators and analysts).

The brand personality is **reliable, transparent, and civic-minded** — an "Institutional Integrity" ethos engineered for high-stakes government and healthcare contexts where clarity, accessibility, and authority are paramount. The style is **Corporate / Modern** with a strong emphasis on **information architecture**: high-contrast pairings, generous white space, and a refined government-standard finish that feels modern yet institutionally trustworthy. Decoration never competes with content. All combinations target **WCAG 2.1 AA**.

## Colors

The palette is anchored by **Navy Deep `#112E51`** for authority and permanence, with **White / `#F9F9F9`** dominant as the background for a clean, clinical, legible feel.

- **Primary — Navy Deep (`#112E51`):** Headers, primary actions, brand marks. Hovers to Navy 900 (`#001936`).
- **Secondary — Sky Tint (`#E1F3F8`):** Subtle section highlighting, card headers, hover states, informational callouts that soften the high-contrast navy.
- **Accent — Caution Gold (`#FDB81E`):** The *singular* accent, used sparingly for high-priority CTAs, active-nav indicator rules, status highlights, the focus ring, and the public site's signature arch.
- **Structure — Slate Gray (`#5B616B`):** Secondary text and structural scaffolding.
- **Status:** Error Red `#D22630`, success green `#2E8540`, caution amber `#C38B00`, each paired with a tinted container.

Use **two background colors max** per layout (white plus one tint). Foreground/background pairings must meet WCAG 2.1 AA, especially text over navy or gold.

## Typography

**Public Sans** (the USWDS standard) is the workhorse for editorial content and most UI — neutral, open, and reliable at every scale. **Lexend** is the functional companion for labels, data points, and small-scale controls; its reduced-stress letterforms improve scan speed in dense admin views.

Headlines use **bold weight and tight tracking** (`-0.02em` on display). Body copy uses **generous line-height** (16/24, 18/28) for long-form readability. Maintain a strict vertical rhythm. Roles: `display-lg`, `headline-lg` (+ mobile), `headline-md`, `body-lg`, `body-md`, `label-md`, `label-sm`, and an uppercase `eyebrow` (Lexend, `0.08em` tracking).

## Layout & Spacing

A **fixed-fluid hybrid grid**: desktop content sits in a **1280px max-width, 12-column grid**; below that it transitions to a fluid model.

- **Desktop (1024px+):** 12 columns, 24px gutters, 40px outer margins.
- **Tablet (600–1023px):** 8 columns, 16px gutters, 24px outer margins.
- **Mobile (0–599px):** 4 columns, 16px gutters, 16px outer margins.

Spacing is **strictly linear on an 8px base**. Component internal padding favors the breathable side — prefer 16px or 24px over tighter increments. Chrome constants: sticky top bar **64px**, fixed portal sidebar **256px**, readable prose measure **720px**. Footer uses `surface-container-highest`; the portal gets a mobile bottom nav bar.

## Elevation & Depth

Deliberately **flat**. Hierarchy comes from **tonal layering** (white → `#F3F3F3` → `#EEEEEE`) and **1px hairline outlines** (`#C4C6CF`), *not* shadows.

- **Surface tiers:** White base canvas; secondary containers use neutral or Sky Tint to separate without elevation.
- **Borders:** 1px solid hairline (`#C4C6CF`) for cards and dividers; inputs use a 1px slate-gray border that thickens to 2px navy on focus.
- **Atmospheric shadow:** Only genuinely floating elements (dropdowns, modals) get a single navy-tinted shadow `0 4px 12px rgba(17, 46, 81, 0.08)`. Interactive cards may lift `translateY(-2px)` with a soft shadow on hover.
- **No gradient washes, no parallax, no heavy depth.**

## Shapes

The shape language is **Soft and disciplined** — subtle rounding that removes legacy-government sharpness while retaining rectangular order.

- **Buttons, inputs, tags:** 4px (`0.25rem`).
- **Cards, modals:** 8px (`0.5rem`).
- **Feature / bento panels:** 12px (`0.75rem`).
- **Status badges:** fully pill-shaped (`9999px`).

## Components

### Buttons
- **Primary:** Navy Deep background, white text, 4px radius, no shadow. Hover → Navy 900.
- **Secondary:** White (or transparent) background, 2px Navy Deep border, Navy Deep text.
- **Accent (actionable):** Caution Gold background with Navy Deep text for critical CTAs that must stand out from the navy header.
- Press: subtle `active:scale-95` micro-shrink.

### Input Fields
- 1px Slate Gray border thickening to 2px Navy Deep on focus; 4px radius.
- Labels always visible (no floating labels), set in Lexend for clarity.
- Error states use Error Red (`#D22630`) for both border and helper text.

### Cards
- Flat: white surface, 1px `#C4C6CF` border, no shadow unless interactive (lift on hover).
- Card headers may use a Sky Tint background to separate metadata from body.
- KPI / bento StatCards pair a tinted icon chip (sky / gold / error container) with a large display number; 12px radius.

### Status Indicators
- Combine color **and** icon (Material Symbols) for color-blind accessibility.
- **Success:** Sky Tint or success-container background, navy/green text, check icon.
- **Alert:** Caution Gold background, navy text, warning icon.
- Badges are pill-shaped.

### Navigation
- A utility header above the main nav for search and language selection.
- **Top nav:** Navy Deep background (64px), white text, **4px gold bottom rule** on the active item.
- **Side nav:** 256px fixed, white surface, **4px gold left rule** on the active item.

### Focus & Motion
- **Focus ring:** USWDS convention — 3px solid Caution Gold with 2px offset; search fields ring gold.
- **Motion:** Restrained and functional — standard ease `cubic-bezier(0.2, 0, 0.2, 1)`, 150–300ms. Color/background hover transitions, gentle transforms (icon `scale(1.1)`, card lift), button press shrink. **No bounce, no infinite decorative loops, no parallax.** Respect `prefers-reduced-motion`.

### Iconography
- **Material Symbols Outlined** (variable icon font), default axes `FILL 0, wght 400, GRAD 0, opsz 24`; apply `FILL 1` for active/emphasis states.
- Outlined by default; filled for selected nav, status chips, and KPI tiles. Single weight (400). Icons inherit text color.
- **Brand mark:** a navy rounded square containing a white filled `account_balance` glyph (stands in for the official seal pending the real CMS logo).

## Do's and Don'ts

**Do**
- Reserve Caution Gold for a single, deliberate accent per view (CTA, active rule, or focus ring).
- Establish hierarchy with tonal surfaces and 1px hairlines before reaching for any shadow.
- Write in plain language, sentence case, addressing the reader as "you" and the agency as "we."
- Pair every status color with an icon and AA-compliant text.
- Use real, warm, diverse candid photography (cut-out subjects on the gold arch); placeholder where unavailable.

**Don't**
- Don't use gradient washes, full-bleed photo backgrounds behind text, or more than two background colors per layout.
- Don't use emoji — this is a federal agency; iconography carries all symbol duty.
- Don't apply heavy shadows, brutalist sharp corners, or heavily rounded "consumer app" radii.
- Don't hand-draw bespoke SVG icons — use Material Symbols.
- Don't add hype, exclamation marks, or marketing tone; stay confident, factual, and service-oriented.
