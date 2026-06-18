# DESIGN-BRIEF.md — My Health Coach — Diabetes & Obesity Demo App

**Status: binding for all UI work in this build.** This brief is the original visual design for the
app, authored from the CMS Web Design System (`Docs/Style/CMS Web Design System/`) and the PRD's
functional requirements. The embedded prototypes (`Docs/example/`, PRD §15) are **prohibited
sources** — no agent reads them, and nothing here derives from them. Where this brief and the
design system's `DESIGN.md` differ on a token value, the design system wins. Where this brief and
PRD behavior (FR-1..35) differ, the PRD wins.

---

## 1. Design thesis

**Words first, chart as proof.** This is a health app for people aged 23–71 with widely varying
health literacy, built by a federal agency bound by the Plain Writing Act. So the design leads
every section with a short plain-language status sentence — _"Your A1c is rising. Your care team
has been notified."_ — and renders the chart beneath it as evidence. The chart never asks the
reader to interpret; the words already did. Charts are calm, systematic, and share one geometry
grammar across the whole app (§6).

**Signature element — the gold thread of "now."** The entire demo runs on a fixed clock
(`DEMO_TODAY = 2026-06-06`, rendered as _Friday, June 6, 2026_). Chronic care is the discipline of
knowing where you stand **today** against your plan, so "today" is a first-class visual object:
one **gold meridian** (2px solid `--caution-gold`, small downward triangle cap) marks _now_
identically in every temporal visualization — the A1c line, the 14-day glucose chart, the activity
bars (today's bar is gold), the adherence grid (today's cell ringed gold), and the header date chip
(gold tick before the date). Gold already means "attention / today / goal" in the design system;
this concentrates that meaning into a single recognizable thread a presenter can point to on every
screen. **Gold is spent here and on the active-nav rule / primary CTA — nowhere else per view.**

**The demo proscenium.** Everything theatrical — the fictional-data disclaimer, the persona
switcher, replay/reset/award controls — lives in a visually distinct **navy-ink frame**
(`--navy-900`) above the app. The demo chrome frames the fiction honestly; the app inside stays
clean and production-plausible. The disclaimer is permanently visible on every route (FR
requirement) as the proscenium's left-aligned text.

**Tone.** Institutional Integrity: reliable, transparent, civic-minded. Flat surfaces, hairline
borders, tonal layering, two background colors max per layout. No gradients, no emoji, no
exclamation marks, no marketing language.

---

## 2. Product identity

- **Name:** **My Health Coach** — eyebrow above the wordmark reads `CONCEPT DEMO`.
  Plain, descriptive (it bridges the patient's scattered records to them), no trademark pretension.
- **Brand mark:** per the design system — navy rounded square (8px radius) containing a white
  filled `account_balance` Material Symbol. On navy surfaces, invert: white square, navy glyph.
- **Voice:** second person ("you"), agency as "we", sentence case everywhere including buttons and
  nav. Verbs first on actions: "Sync now", "Revoke all access", "Send to my provider". Numbers are
  always stated with their meaning: "7.9% — above your 7.5% target", never a bare figure.
  Encouragement without cheerleading: "26 of 28 doses taken this month" not "Great job!".
  A broken streak is stated gently in slate, with a restart action — never red, never blame.

---

## 3. Tokens

Use the design system's CSS custom properties verbatim (`tokens/colors.css`, `typography.css`,
`spacing.css`, `base.css`) imported once into `app/globals.css`. **Do not invent new colors.**
The PRD's `#spec-design-tokens` values are the same palette; the DS file is the canonical source.
Key bindings for this app:

| Role                                                                                    | Token                                                          | Notes                                               |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| App header / sidebar active text / primary buttons / chart series stroke                | `--navy-deep`                                                  |                                                     |
| Demo proscenium background                                                              | `--navy-900`                                                   | darkest navy; white + `--on-primary-container` text |
| Target zones in charts, info callouts, card header strips                               | `--sky-tint`                                                   | 60% opacity as chart zone fill                      |
| Today meridian, today bar, goal lines (dashed), active-nav rule, focus ring, badge gold | `--caution-gold`                                               | the _only_ accent                                   |
| Text on gold, "due" states                                                              | `#5E4200` (`--gold-ink`, add as app token)                     | from `#spec-design-tokens`                          |
| Risk-only: above-target points, missed doses, red banner                                | `--error-red` / `--error-container` / `--on-error-container`   |                                                     |
| Positive/in-range states                                                                | `--success` / `--success-container` / `--on-success-container` | always with a check icon                            |
| Secondary text, axis labels, broken-streak copy                                         | `--slate-gray`                                                 |                                                     |
| Page canvas / cards / hairlines                                                         | `--surface` / `--surface-card` / `--border-hairline`           | flat; 1px                                           |

**Fonts (self-hosted, zero runtime calls):** `next/font/google` — Public Sans (400/600/700),
Lexend (400/500/600/700), **Material Symbols Outlined** (variable; axes opsz 20..48, wght 400,
FILL 0..1). Do **not** use the DS `tokens/fonts.css` `@import` lines (they hit Google at runtime);
replicate its `.material-symbols-outlined` base class locally. If `next/font/google` cannot
deliver Material Symbols with the needed axes, fall back to `next/font/local` with a vendored
woff2 (build-time acquisition only).

**Type roles** (DS scale, used strictly):

- Greeting hero: `display-lg` 48/56 700, tracking -0.02em (mobile: `headline-lg-mobile` 28/36).
- Section titles: `headline-md` 24/32 600 navy.
- Plain-words status line: `body-lg` 18/28, `--text-body`; bolded clause for the key fact.
- Card titles: 16/24 600 Public Sans navy.
- Eyebrows: Lexend 12/16 700 uppercase 0.08em `--text-subtle`.
- Stat values: Public Sans 700 36/40, `font-variant-numeric: tabular-nums`; unit in 16/24 600.
- Labels/chips/axis/metadata: Lexend per `label-md`/`label-sm`.

**Spacing:** strict 8px scale. Cards pad 24 (16 on mobile). Section rhythm 64 desktop / 40 mobile.
Grid gutters 24. Radii: 4 buttons/inputs/chips, 8 cards, 12 stat tiles & feature panels, pill
badges. Shadows: none at rest; `--shadow-atmospheric` only on genuinely floating elements
(toasts, modals, popovers).

**Motion:** 150–300ms, `--ease-standard`; chart animation per PRD §8 (longer durations are the
spec's). Everything respects `prefers-reduced-motion: reduce` → final state instantly.

---

## 4. Layout system

### Desktop (≥880px) — "/" dashboard

```
┌────────────────────────────────────────────────────────────────────────┐
│ PROSCENIUM  --navy-900 · 40px                                          │
│ ⚠ Demonstration — fictional data. Not an official CMS product.         │
│                  Persona ▾ (grouped) · Demo controls ▾ · Reset    [?]  │
├────────────────────────────────────────────────────────────────────────┤
│ APP HEADER  --navy-deep · 64px · container 1280                        │
│ ◙ My Health Coach   CONCEPT DEMO           ◆ Fri, Jun 6 2026 · ⟳ Synced│
│                                            ID chip: IAL2/AAL2 ✓ Sarah W│
├──────────────┬─────────────────────────────────────────────────────────┤
│ SIDEBAR 256  │ MAIN  (max 1280 incl. sidebar; 40px outer margins)      │
│ sticky,white │                                                         │
│ MY HEALTH    │ MY HEALTH ─ eyebrow                                     │
│ ▌Overview    │ Good morning, Robert.        ← display-lg               │
│  Trends&Labs │ Your A1c is trending up — your care team has been       │
│  My Records  │ notified.                    ← status sentence (banner) │
│  Care & Meds │ [gold banner card: words + CTA "Schedule Jun 18"]       │
│  Activity    │ [5 stat tiles, 12-col grid: spans 3/3/2/2/2]            │
│  Coaching    │                                                         │
│  Rewards     │ TRENDS & LABS ─ section eyebrow + headline-md           │
│ EXPLORE      │ [plain-words line] [chart card] [chart card]            │
│  Assistant   │ ...sections continue, 64px rhythm, scroll-spy           │
│  Recipes     │ gold left rule on the active sidebar item               │
│  Nearby      │                                                         │
│ MY ACCOUNT   │                                                         │
│  Devices     │                                                         │
│  Connect     │                                                         │
│  Share       │                                                         │
│  Data&Consent│                                                         │
├──────────────┴─────────────────────────────────────────────────────────┤
│ FOOTER --surface-container-highest: disclaimer restated, seam list     │
└────────────────────────────────────────────────────────────────────────┘
```

- 12-column grid, 24px gutters inside main. Two-up chart cards collapse to one-up below 1100px;
  stat tiles 5→2 columns below 1100px, sidebar collapses to icon rail at 700px-wide main (inner
  collapse points 1100/700 per `#spec-meta`).
- Sidebar groups (normative §5): **My Health** Overview · Trends & Labs · My Records · Care &
  Medications · Activity & Nutrition · Coaching & Programs · Rewards; **Explore** AI Assistant ·
  Recipes · Nearby Services; **My Account** Devices · Connect with Provider · Share at Check-in ·
  Data & Consent. Overview…Coaching are scroll-spy anchors on "/"; the rest are routes.
  Active item: 4px gold left rule + `FILL 1` icon. `aria-current` on the active item.
- Sub-routes (/rewards, /devices, …) keep the same shell (proscenium, header, sidebar, footer)
  with the sidebar item active and a single-column content area (max 960px) — except /assistant
  which uses a two-pane chat layout (chat log + context rail).

### Mobile (<880px) — patient app

```
┌──────────────────────────────┐
│ PROSCENIUM (wraps to 2 lines)│
│ ⚠ fictional data · Persona ▾ │
├──────────────────────────────┤
│ APP BAR --navy-deep          │
│ Good morning, Sarah.         │
│ ◆ Friday, June 6 · ⟳ Synced  │  ← greeting INSIDE the navy bar,
│ [IAL2 ✓]  [3 orgs connected] │     headline-lg-mobile, white
├──────────────────────────────┤
│ 16px margins, cards stack    │
│ [status banner card]         │
│ [stat tile 2-col grid]       │
│ [AI insight card — gold edge]│
│ [Share at check-in entry]    │
│ [section: Trends… as cards]  │
│   …                          │
├──────────────────────────────┤
│ TAB BAR: Home Trends Care    │
│          Coach More          │  ← gold rule on TOP edge of active
└──────────────────────────────┘
```

- No phone bezel — the viewport is the device. Navy app bar carries greeting + date chip +
  connection status (sky dot ⟳ "Synced 2 min ago") and identity chip.
- Bottom tabs (normative): **Home · Trends · Care · Coach · More** — Material Symbols `home`,
  `monitoring`, `medication`, `forum`, `menu`. Active tab: gold 3px top rule + filled icon +
  Lexend 600 label. 64px tall + safe-area inset.
- **More** screen: simple list (FR prose): Rewards, AI Assistant, Recipes, Nearby Services,
  Devices, Connect with Provider, How it works, Data & Consent — each row: icon chip (sky tint),
  label, chevron; plus a "Demo controls" group at the bottom (replay alert, earn badge, reset).
- Tab content reuses desktop section components restyled as stacked cards; same data hooks.

### Responsive switch

`useViewport()` = `matchMedia('(min-width:880px)')` + `useSyncExternalStore`. `page.tsx` renders
`<DesktopApp/>` or `<MobileApp/>`; neutral skeleton until mounted (navy header bar + three gray
card blocks, no text) to avoid hydration mismatch. Persona and scroll position survive the swap.

---

## 5. Component language

All components flat: white surface, 1px `--border-hairline`, 8px radius. Reuse/port the DS core
components (`components/core/*.jsx` → typed TSX in `components/ds/`) for Button, Card, Badge, Tag,
Alert, Avatar, Input, Select, StatCard; keep their token-driven styling. App-specific components
use CSS Modules. Material Symbols for every icon; status is **always icon + color**:
`check_circle` in-range/success · `warning` elevated/attention (gold-ink) · `error` above-target/
missed (red-ink) · `schedule` pending/due · `sync` syncing.

Recurring patterns:

- **Status banner** (Overview): full-width card, 4px left rule in severity color, icon chip,
  title 600, body, optional CTA button (accent gold for robert's schedule CTA; quiet navy
  otherwise). Red banner = `--error-container` bg + `--on-error-container` text (maria);
  gold banner = gold bg at 12% + `--gold-ink` title (robert). aria-live target for replay-alert.
- **Stat tile**: 12px radius, icon chip top-left (sky tint; gold tint for the Rewards tile), label
  Lexend 12 slate, value 36 tabular, delta chip below (pill, icon + text: `arrow_upward` red
  "0.5 since Mar" for bad-up, green `arrow_downward` for good-down, slate `remove` for steady).
  Tone mapping: `up-bad`→red, `down-good`→green, `steady`→slate, `up-good`→green.
- **Plain-words line**: every dashboard section opens with one `body-lg` sentence summarizing the
  section's data state for this persona, derived from the API payload (not hardcoded).
- **Chips**: pill, Lexend 12/16 600. Program status chips: Active=navy bg/white, Eligible=sky/navy,
  Suggested=white/navy hairline, Available=surface-low/slate, "Near you"=gold-soft/gold-ink.
  Standards chips (FHIR R4, US Core, USCDI v3): surface-low bg, slate text, `verified` icon.
- **Empty/disconnected states** (post-revoke): icon `link_off` in a sky circle, one sentence
  ("Your records are disconnected. Reconnect to see your data."), primary "Reconnect" button.
  Never a bare blank.
- **Toasts**: bottom-right (mobile: above tab bar), floating shadow, navy surface white text,
  icon + sentence, aria-live="polite", auto-dismiss 5s + close button.
- **Modals** (identity gate, pairing, check-in simulator): centered 480px card, overlay
  `rgba(17,46,81,.4)`, focus trap, `aria-modal`, h2 title, step content, actions right-aligned.
- **AI surfaces**: every AI-generated element (insight cards, assistant answers, document reads)
  carries the **AI badge**: pill, surface-low bg, `smart_toy` icon, Lexend "AI-generated — not
  clinical judgment", plus a source line ("Based on: Jun 5 lab result · 14-day glucose") and an
  escalation action ("Ask my care team"). Insight cards have a 4px gold left rule when
  severity=attention, hairline otherwise.

---

## 6. Chart grammar (original geometry — applies to every chart)

Hand-rolled SVG React components. One shared visual grammar; constants live in the component
files (the sole permitted non-API data). All charts: `role="img"` + `aria-label` that states the
data story in a full sentence; a visually-quiet "View as table" disclosure beneath renders the
series as a real `<table>`; axis text Lexend 11px `--slate-gray`; gridlines 1px
`--surface-container-highest`, horizontal only, 4 divisions; no chart borders, no drop shadows.

| Chart                                               | viewBox           | Specifics                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Line (A1c quarterly, weight 6-mo, glucose 14-d, BP) | `0 0 640 240`     | pad l44 r16 t16 b28. Series: navy 2.5px round caps. Points r4 white fill/navy stroke; latest point r5.5 filled (red if out-of-range, with adjacent `warning` glyph). Target zone: sky rect 60% + Lexend zone label right-aligned inside ("Target: below 7.5%"). Goal line: gold dashed 6 4 + right label. Today meridian at the last x position. |
| Bars (steps, activity min)                          | `0 0 640 220`     | 7 bars, 24px wide, navy; **today's bar gold** with gold-ink value label above; goal line gold dashed with label; baseline hairline.                                                                                                                                                                                                              |
| Risk scale (maria A1c 6.1)                          | `0 0 640 120`     | One horizontal track 16px tall, three zone rects: Normal `--success-container`, Pre-diabetes `--gold-soft`, Diabetes `--error-container`, zone labels beneath in Lexend 11 with their numeric bounds (<5.7, 5.7–6.4, ≥6.5). Marker: navy diamond + value flag "6.1%" above, slides in on animate.                                                |
| Adherence grid (28 days)                            | CSS grid, not SVG | 7×4 cells 20px, 4px radius: taken=navy + white `check` 12px; partial=gold-soft + gold-ink `remove`; missed=`--error-container` + red-ink `close`; pending(today)=white + gold 2px ring. Legend beneath with icons; full data table alternative.                                                                                                  |
| Time-in-range gauge (CGM)                           | `0 0 200 200`     | Donut r70 stroke 20: in-range navy arc, low gold, high red; center: 68% Public Sans 700 32 + "in range" Lexend 12. Segments grow in sequence.                                                                                                                                                                                                    |
| Level ring (rewards)                                | `0 0 200 200`     | Track surface-low, arc gold, round caps; center: level name + points.                                                                                                                                                                                                                                                                            |
| Schematic map (nearby)                              | `0 0 640 480`     | Abstract street grid: surface-low bg, white street strokes 8px/4px on a loose grid, one sky "river" band, navy numbered pin circles (20px, white Lexend numerals) at seeded x,y (0–100 scaled); selected pin scales 1.2 + gold ring. Decorative (`aria-hidden`); the list is the accessible content.                                             |
| Sparklines (stat tiles, optional)                   | `0 0 120 32`      | navy 1.5px, no axes.                                                                                                                                                                                                                                                                                                                             |

**Animation (PRD §8, binding):** IntersectionObserver threshold 0.35, once per session
(`sessionStorage` keyed by chart id); in-view-on-load fires after 150ms. Line: stroke-dash draw
800ms `cubic-bezier(0.22,1,0.36,1)`, points fade/scale after the stroke passes (60ms stagger);
zones fade 300ms before series; bars scaleY origin-bottom 600ms ease-out 60ms stagger, goal line
fades after; risk marker slides 700ms; grid cells pop 20ms stagger; gauge/ring arcs sweep
600–800ms; badge pop scale .6→1 + gold glow 500ms. Animate transform/opacity/stroke only.
`prefers-reduced-motion: reduce` → render final state, no animation, including count-ups.

---

## 7. Route briefs (consistent application)

Every route: proscenium + header + (desktop sidebar | mobile tabs) + footer; data only from
`/api/*`; every screen complete for all 13 personas (empty only post-revoke).

- **/" Overview** (within dashboard): greeting hero (localized greeting line for hector "Buenos
  días" / linda "Chào buổi sáng" + "Español"/"Tiếng Việt" toggle affordance as a quiet chip),
  status banner, 5 stat tiles, AI insight cards (FR-32), journey launcher card for sarah
  ("Run Sarah's day-in-the-life"), Share-at-check-in entry card (mobile home too).
- **Trends & Labs**: persona-conditional chart set (robert: A1c quarterly + glucose 14-day;
  maria: risk scale + weight; priya: TIR gauge when CGM connected; linda: BP trend when cuff
  connected) + lab history list rows (name, value, date, source org, range icon, LOINC code chip
  on expand) + titration/trend insights.
- **Care & Medications / Care & Prevention**: med list rows (name, dose, timing, taken/due chip,
  RxNorm chip on expand), refill-ready callout from claims, adherence grid, care-team cards
  (avatar initials navy/gold per seed, name, role, note); maria instead gets MDPP card (9/16
  sessions bar, 3.6%-of-5% milestone bar, next session line, escalation rule callout in sky).
- **Activity & Nutrition**: bars chart + nutrition progress rows (label, value text, fill bar
  with tone color, pct) keyed by index (seed has intentional duplicates).
- **Coaching & Programs**: feed (avatar chip navy=human/gold=auto, name, role, time label, body,
  action button), "Demo — simulated responses" label; programs list with status chips.
- **Data & Consent**: sources list (name, description, standards chips, last-sync, continuous
  pulse dot), record-locator results ("Records found at 3 organizations"), consent summary card
  (granted date, method, credential, IAL/AAL chips), sharing toggles, audit trail table
  (occurred-at, actor+role, scope chip, purpose-of-use chip with distinct icons: `medical_services`
  treatment · `person` individual_access · `share` patient_share · `settings` operations),
  Sync now (progress states) + Revoke all access (danger-quiet button + confirm modal).
- **/rewards**: level ring + points tile + streak tiles (current/best, habit label; broken streak
  in slate with "Restart streak" ghost button), badge shelf grid (earned: gold-soft chip bg +
  colored icon; locked: dimmed 40% + criterion line + `lock` icon), challenges with progress
  bars, demo "Earn a badge" button.
- **/devices**: connected section (card per device: brand initials block, model, metrics chips,
  last-sync, Sync/Disconnect) + available grid by category; pairing modal (Searching → Found →
  Confirm, 1–2s scripted) with reduced-motion-safe spinner.
- **/connect**: thread list ⇄ conversation pane (desktop two-pane, mobile drill-in), bubbles:
  patient right navy, provider left white hairline; snapshot cards as attachment tiles;
  guidance request templates; appointment slots as selectable time chips + confirmation card;
  persistent "Demo — simulated provider responses" bar.
- **/assistant**: chat log (labeled "AI", aria-live polite), suggested chips per persona, mic
  button (hidden + "Voice isn't supported in this browser" note when API absent; gold pulsing
  listening indicator + stop control when active), persistent "Demo assistant — not medical
  advice" note under the composer, provider-questions builder panel (3–5 generated questions,
  checkboxes, "Send to my provider").
- **/nearby**: category chips (All + 5), simulated-location line ("Near Riverview — demo
  location"), result cards (numbered to match map pins, name, distance, open-now icon+text from
  demo clock, tags, quiet actions), schematic map panel; persona-aware ordering note as a sky
  callout ("Food resources first, based on your needs assessment").
- **/recipes**: active-filter banner (sky, explains why + removable chips), card grid (SVG
  initials illustration block in navy/sky/gold rotation, title, prep, calories, macro chips,
  condition tags), detail view (ingredients, steps, nutrition panel, allergen callout —
  `check_circle` "Contains none of your flagged allergens" or red list), Save action.
- **/share**: QR card (deterministic mock QR pattern from share token, caption "Demo QR — encodes
  a mock token, no real health data"), "What you'd share" list, Simulate check-in button →
  scripted steps → confirmation card (org, bundle manifest chips) → audit note; returned-summary
  flow → document toast → titration insight.
- **/records**: timeline (newest first): structured rows (code chips on expand) + document cards
  (kind icon + kind label, title, date, source org, mime tag, "AI read available" dot); viewer:
  "scanned" treatment = surface-low card, slight rotate(-0.3deg), Public Sans body as real DOM
  text, document-paper white inner sheet; "Explain this" button → AI read panel with badge/basis/
  escalation. Standards chip row in header ("USCDI v3 · US Core IG — illustrative codes").
- **/how-it-works**: briefing page, content from PRD §2/§11.1 written fresh: takeaway strip
  (3 plain sentences), data-flow diagram (3 columns: Your providers & networks → CMS Aligned
  Network → This app, SVG arrows, seam labels), 5 framework-category cards, security note
  (IAL2/AAL2, consent, audit), demo/production seam table.
- **Identity gate** (first visit / post-revoke): full-screen navy-ink panel, brand mark,
  "Sign in to your health record", passkey + mDL buttons (`fingerprint` / `badge` icons),
  scripted verify steps, then scope-consent card (checklist of scopes) → "Allow access".
  Skippable via proscenium control ("Skip gate" — demo affordance).
- **Presenter overlay** (`?`): floating panel listing the demo script (per-persona stories,
  what to click), journey launcher, keyboard hint chips; `Esc` closes; hidden from tab order
  until opened.
- **Journey stepper** (sarah): bottom-docked card: step n/6, title, narration sentence, route
  deep-link, Next/Skip; gold progress dots.

---

## 8. Accessibility commitments (every agent)

Landmarks + skip link; one h1 per page, ordered headings; 3px gold focus ring (2px offset) on
navy, 3px navy on white per DS; all interactive elements keyboard-operable; charts `role="img"` +
sentence `aria-label` + table alternative; icons decorative (`aria-hidden`) when text accompanies;
status = icon + color always; toasts aria-live polite; modals focus-trapped `aria-modal`;
`prefers-reduced-motion` honored globally (CSS media query + JS hook); contrast only from the
verified pairs table; Lighthouse a11y ≥95 every route both views.

## 9. What agents must NOT do

No Tailwind or component libraries. No chart libraries. No external fonts/images/tiles at
runtime. No `Docs/example/` or PRD §15 — ever, for any reason. No copy pasted from any prototype.
No hardcoded display data (chart geometry constants excepted). No new colors, no shadows at rest,
no emoji, no exclamation marks. No `Math.random()`/`Date.now()` in seed or render paths — the
demo clock and seeded jitter only.
