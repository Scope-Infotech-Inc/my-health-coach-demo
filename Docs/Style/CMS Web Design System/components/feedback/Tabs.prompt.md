Underlined tab strip, gold active rule. Controlled or uncontrolled; supports icons + count pills.

```jsx
<Tabs defaultValue="all" onChange={setTab} tabs={[
  {id:'all', label:'All Resources', count:124},
  {id:'manuals', label:'Manuals', icon:'description', count:42},
]}>
  {(active) => <ResultList filter={active} />}
</Tabs>
```

Props: `tabs` (`{id,label,icon?,count?}[]`), `value`/`defaultValue`, `onChange`, `children` (node or `(id)=>node`).
