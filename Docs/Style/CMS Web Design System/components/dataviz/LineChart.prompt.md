Animated multi-series SVG line chart with draw-in, gridlines, legend.

```jsx
<LineChart area labels={['Oct','Nov','Dec','Jan','Feb','Mar']}
  series={[
    {name:'Budgeted', color:'var(--navy-deep)', points:[40,52,48,61,72,80]},
    {name:'Actual', color:'var(--caution-gold)', points:[30,44,40,55,60,72]},
  ]} />
```

Props: `series` (`{name,color,points}[]`), `labels`, `height`, `width`, `max`, `area`, `legend`.
