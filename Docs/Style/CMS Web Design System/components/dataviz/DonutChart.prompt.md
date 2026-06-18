Segmented donut with animated sweep, center total, legend with percentages.

```jsx
<DonutChart centerLabel="Total" centerValue="4.2M" data={[
  {label:'Medicare A/B', value:54},
  {label:'Medicare Advantage', value:28},
  {label:'Dual Eligible', value:18},
]} />
```

Props: `data` (`{label,value,color?}[]`), `size`, `thickness`, `centerLabel`, `centerValue`, `legend`.
