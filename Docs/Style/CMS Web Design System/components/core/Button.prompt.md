Primary action control — navy primary, outlined secondary, gold accent CTA, ghost, danger. Use for all clickable actions; reserve `accent` (gold) for the single highest-priority CTA on a surface.

```jsx
<Button variant="primary" icon="add" onClick={...}>New Report</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="accent" icon="add_circle">New Report</Button>
<Button variant="ghost" iconRight="arrow_forward">View all</Button>
```

Variants: `primary` (navy, default), `secondary` (2px navy outline), `accent` (gold bg, navy text — use sparingly), `ghost` (text-only), `danger` (error red). Sizes: `sm` / `md` / `lg`. Props: `icon`, `iconRight` (Material Symbols names), `fullWidth`, `disabled`.
