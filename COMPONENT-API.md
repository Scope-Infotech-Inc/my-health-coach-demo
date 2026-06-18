# COMPONENT-API.md — build contract for route pages

You are building one route of the My Health Coach demo (Next.js 15 App Router, React 19, TS strict).
The app shell, design system, chart kit, and shared primitives **already exist and are committed**.
Your job: build your assigned route's page(s) by **composing** these existing pieces. Do not rebuild
chrome, charts, or primitives. Read this whole file, then `DESIGN-BRIEF.md` (your route's bullet in §7),
then the specific `app/api/...` route files your page reads (their header comments document the exact
JSON shape).

## ⛔ PROHIBITED SOURCES — non-negotiable, supersedes everything

Do **NOT** open, read, decode, extract, screenshot, or in any way use anything under `Docs/example/`
(mobile prototype, desktop prototype, standalone demo) **OR** PRD §15 (`#src-prototype-mobile`,
`#src-prototype-desktop`). The visual design, layout, markup, CSS, chart geometry, and **all UI copy**
are original — designed from `DESIGN-BRIEF.md` on the CMS Web Design System tokens. Anywhere any doc
says "match the prototype / copy verbatim / port prototype CSS / reuse viewBoxes," treat it as VOID.
Data **values** (numbers, names, dates, units, statuses, thresholds) come only from the live `/api/*`
responses (never hardcoded). Surrounding labels, headings, and sentences you **write yourself**, plain
and original. If you ever feel you need the prototype to proceed, you do not — design it fresh.

## Hard constraints

- **Pages are client components** (`'use client'`) that fetch from internal `/api/*` via the `useApi`
  hook. **No hardcoded display data** (chart geometry constants inside the chart components are the
  only exception, and those already exist). If a value appears on screen, it came from an API response.
- **The shell is provided by `app/layout.tsx`** (proscenium + header/sidebar/tabs + footer, all
  responsive). Your page renders **only the inner content** — do NOT render `<main>`, a header, or any
  nav. The layout already wraps `children` in `<main id="main">`.
- **Sub-route pages** (everything except `/`) start their content with `<PageHeader eyebrow title lede />`
  then a single-column content column (the layout caps width). `/assistant` is the exception (two-pane).
- **Styling:** CSS Modules + the existing CSS custom-property tokens only. **No new colors**, no Tailwind,
  no UI kit, no chart library, no external fonts/images/tiles. No shadows at rest, no emoji, no
  exclamation marks, no marketing language. Status is **always icon + color**, never color alone.
- **Accessibility (Section 508 / WCAG 2.1 AA, Lighthouse ≥95):** one `<h1>` per page (PageHeader emits
  it), ordered headings, keyboard-operable controls, charts already carry `role="img"` + table
  alternative, modals are focus-trapped (use the `Modal` primitive), toasts via `useToast`
  (aria-live), decorative icons get `aria-hidden`, `prefers-reduced-motion` already handled globally.
- **Determinism:** never `Math.random()` / `Date.now()` / `new Date()`. Use the `demo-clock` helpers.
- **Persona === patient id.** `const { personaId } = usePersona()` gives `'sarah' | 'maria' | …`; use it
  directly in API paths. Every route must look complete for **all 13 personas** (empty only after the
  user revokes consent — then render `<EmptyState>`).

## Standard data-fetch pattern

```tsx
'use client';
import { usePersona } from '@/lib/persona-context';
import { useApi, postApi } from '@/lib/use-api';

export default function NearbyPage() {
  const { personaId } = usePersona();
  const { data, loading, error } = useApi<ServicesResponse>(`/api/services?patientId=${personaId}`);
  // render loading skeleton / error / content; keep last data during refetch (the hook does this)
}
```

`postApi(path, body)` for mutations; call `usePersona().refreshData()` after a mutation so every view
revalidates. `useToast().pushToast({ tone, icon, message })` for confirmations.

## Component inventory — import and compose these (do not reinvent)

### Shared primitives — `@/components/ui`

- `PageHeader({ eyebrow?, title, lede?, actions? })` — emits the page `<h1>`. Use on every sub-route.
- `Section({ id, eyebrow, title, action?, children })` — dashboard-only (scroll-spy anchor).
- `SectionHeader({ eyebrow?, title })` — lightweight `<h3>` sub-heading.
- `PlainWords({ children, tone? })` — the body-lg "words first" status sentence; wrap the key fact in `<strong>`.
- `StatusBanner({ severity, title, body, ctaLabel?, onCta?, careTeamNotified? })` — severity ∈
  `red|gold|attention|sky|info`; it is an aria-live region.
- `AICard({ title?, children?, basis?, severity?, escalationLabel?, onEscalate?, footer? })` and
  `AIBadge()` — every AI-generated surface MUST carry one of these.
- `EmptyState({ icon?, message, actionLabel?, onAction?, children? })` — disconnected / empty.
- `Modal({ open, onClose, title?, children, actions?, width? })` — focus-trapped, aria-modal.
- `DemoNote({ children, icon? })` — the "Demo — simulated …" honesty label.

### Design system — `@/components/ds`

- `Button({ variant: 'primary'|'secondary'|'accent'|'ghost'|'danger', size?, icon?, iconRight?, fullWidth? })`
- `Card({ interactive?, header?, footer?, padded?, children })`, `Avatar({ name, tone?, size?, ring? })`
- `Badge`, `Tag`, `ProgramChip({ status })`, `StandardsChip({ label })`, `FilterChip({ label, onRemove })`,
  `MetaChip({ children })`, `StatusIcon({ status, showLabel?, size? })`, `StatTile({ id, label, value, detail?, delta?, icon?, iconTone? })`.

### Charts (hand-rolled SVG; animate on scroll-into-view + reduced-motion already handled) — `@/components/charts`

- `LineChart({ id, ariaLabel, points:{label,value,flag?}[], yMin, yMax, yTicks?, unit?, band?:{from,to,label}, goal?:{value,label}, todayMeridian?, xLabelEvery?, tableColumns? })`
- `BarChart({ id, ariaLabel, points:{label,value}[], yMax, unit?, todayIndex?, goal?:{value,label}, tableColumns? })`
- `RiskScale({ id, ariaLabel, min, max, zones:{label,to,tone}[], marker, markerLabel })`
- `AdherenceGrid({ id, ariaLabel, days:{date,status:'taken'|'partial'|'missed'|'pending'}[], summary? })`
- `TimeInRangeGauge({ id, ariaLabel, inRangePct, lowPct, highPct, target? })`
- `LevelRing({ id, ariaLabel, levelName, points, levelMin, levelMax })`
- `ProgressBar({ id, label, valueText, pct, tone?, milestonePct? })`
- `CountUp({ id, value })`, `ChartCard({ title, aside?, children })`, `DataTable({ caption, columns, rows })`
- Always pass a **sentence** `ariaLabel` that states the data story; give every chart a unique `id`.

### Hooks / utilities

- `@/lib/persona-context`: `usePersona()` → `{ personaId, setPersonaId, dataVersion, refreshData }`
- `@/lib/use-api`: `useApi<T>(path|null)` → `{ data, error, loading, refetch }`; `postApi<T>(path, body?)`
- `@/lib/use-viewport`: `useViewport()` → `'desktop'|'mobile'|undefined` (rarely needed in pages)
- `@/components/toast/Toaster`: `useToast()` → `{ pushToast }`
- `@/lib/demo-clock`: `DEMO_TODAY`, `formatLongDate`, `formatMediumDate`, `formatShortDate`,
  `formatFullDate`, `relativeDayLabel`, `syncRelativeLabel`, `fictionWeekday`, `parseISODateTime`.
- `@/components/shell/JourneyStepper`: `JOURNEY_START_EVENT` (dispatch to launch sarah's walkthrough).

## Endpoint inventory (read the route file for exact field names)

| Endpoint                                                                                                                                                                                                                                                                         | Returns (summary)                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/patients`                                                                                                                                                                                                                                                              | `{patients[]{id,firstName,lastNameInitial,featured,category,avatarInitials,headerRole?}}`                                                               |
| `GET /api/patients/{id}/overview`                                                                                                                                                                                                                                                | `{patient{…}, demoToday, banner?{severity,title,body,ctaLabel?,careTeamNotified}, tiles[]{label,value,delta?{text,tone},detail}}`                       |
| `GET /api/patients/{id}/insights`                                                                                                                                                                                                                                                | `{insights[]{id,kind,title,body,basis[],surfacedOn,severity}}` (AI cards; badge each)                                                                   |
| `GET /api/patients/{id}/labs`                                                                                                                                                                                                                                                    | `{labs[]{code,display,value,value2?,unit,rangeFlag,collectedOn,source,loinc?}, a1cSeries[]{collectedOn,value}}`                                         |
| `GET /api/patients/{id}/observations?type=&days=`                                                                                                                                                                                                                                | `{series[]{observedOn,value,unit}, target?{min?,max?,label}}` — type ∈ glucose_fasting, steps, active_minutes, weight, bp, glucose_tir                  |
| `GET /api/patients/{id}/medications`                                                                                                                                                                                                                                             | `{medications[]{name,dose,timing,todayStatus,takenAt?}, refills[]{description,location}, adherence{days[]{date,status}, summary{taken,total}\|string}}` |
| `GET /api/patients/{id}/nutrition`                                                                                                                                                                                                                                               | `{rows[]{label,valueText,pct,fillTone}}` (preserve order + duplicates)                                                                                  |
| `GET /api/patients/{id}/programs`                                                                                                                                                                                                                                                | `{programs[]{name,detail,statusChip,progressCurrent?,progressTotal?,milestonePct?,milestoneGoalPct?,nextSession?}}`                                     |
| `GET /api/patients/{id}/messages`                                                                                                                                                                                                                                                | `{messages[]{senderName,senderRole,senderType,avatar,avatarStyle,body,sentLabel,actionLabel?}}`                                                         |
| `GET /api/patients/{id}/sources`                                                                                                                                                                                                                                                 | `{sources[]{name,description,standards[],lastSyncAt?,continuous}}`                                                                                      |
| `GET /api/patients/{id}/consent`                                                                                                                                                                                                                                                 | `{grantedOn,method,identityCredential,ial,aal,accessReadsThisMonth,shareWithCareTeam,adsBlocked,revoked}`                                               |
| `GET /api/patients/{id}/audit`                                                                                                                                                                                                                                                   | `{entries[]{occurredAt,actor,actorRole,scope,purposeOfUse}}`                                                                                            |
| `GET /api/patients/{id}/devices`                                                                                                                                                                                                                                                 | `{connected[]{id,brand,model,category,metrics[],lastSyncAt}, available[]{id,brand,model,category,metrics[]}}`                                           |
| `GET /api/patients/{id}/gamification`                                                                                                                                                                                                                                            | level/points/streaks/badges/challenges (read the file; returns `enrolled:false` for maria/robert)                                                       |
| `GET /api/patients/{id}/threads` / `GET /api/threads/{tid}`                                                                                                                                                                                                                      | provider message threads / one thread                                                                                                                   |
| `GET /api/patients/{id}/appointments`                                                                                                                                                                                                                                            | `{slots[]{id,careTeam{name,role}\|null,slotDatetime,taken}}`; `POST` body `{slotId}`                                                                    |
| `GET /api/patients/{id}/recipes` / `GET /api/recipes/{rid}`                                                                                                                                                                                                                      | filtered recipe list / one recipe (ingredients, steps, nutrition, allergens)                                                                            |
| `GET /api/patients/{id}/recipes`                                                                                                                                                                                                                                                 | also returns the active-filter explanation                                                                                                              |
| `GET /api/services?patientId=`                                                                                                                                                                                                                                                   | nearby services (category, distance, openNow, tags, ordering note)                                                                                      |
| `GET /api/patients/{id}/share` / `GET /api/patients/{id}/documents` / `…/documents/{docId}`                                                                                                                                                                                      | share token + bundle / records timeline / one document                                                                                                  |
| `POST /api/sync` `{patientId}` · `POST /api/consent/grant`·`/revoke` `{patientId}` · `POST /api/devices/connect`·`/disconnect` · `POST /api/share/checkin`·`/return-summary` · `POST /api/threads/{tid}/message` · `POST /api/patients/{id}/assistant` (+ `/provider-questions`) | mutation/flow endpoints — read each file's header                                                                                                       |

## Design rules recap (DESIGN-BRIEF is binding)

- **Words first, chart as proof.** Lead each block with one plain-language `PlainWords` sentence
  derived from the data, then the chart/table beneath.
- **Gold thread of "now."** Charts already render the gold today-meridian / today-bar. Spend gold only
  on that, the active-nav rule, and the single primary CTA per view. Nowhere else.
- **AI honesty.** Every AI surface → `AICard`/`AIBadge` + basis line + escalation. Every simulated party
  (provider replies, assistant) → a visible `DemoNote`.
- **Voice.** Second person, sentence case, verbs-first buttons ("Sync now", "Send to my provider"),
  numbers stated with meaning. No cheerleading; a broken streak is gentle slate, never red.
- **Empty states** are never blank — use `EmptyState` with a recovery action.
