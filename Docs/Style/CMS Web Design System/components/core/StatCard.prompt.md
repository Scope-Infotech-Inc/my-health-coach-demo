KPI / statistic tile for bento dashboards — tinted icon chip + big display number.

```jsx
<StatCard icon="assignment" tone="info" label="Active Programs" value="1,284"
  trend={<Badge status="success" icon="trending_up">+4.2%</Badge>}
  footer={<><span className="material-symbols-outlined" style={{fontSize:14}}>history</span> Updated 12 mins ago</>} />
```

Tones: `info` (sky), `gold`, `error`, `neutral`. Slots: `trend` (top-right), `footer` (below divider).
