Vertical bar chart — bars grow from baseline. Single or grouped series.

```jsx
<BarChart unit="%" data={[
  {label:'NE', value:85},{label:'Mid-Atl', value:62},{label:'SE', value:94},
]} />
<BarChart series={['Budget','Actual']} data={[{label:'Q1',values:[80,72]},{label:'Q2',values:[90,84]}]} />
```

Props: `data` (`{label,value}` or `{label,values}`), `series`, `height`, `max`, `unit`, `tone`.
