CMS Program Portal sidebar (256px) — brand lockup, CTA, nav with gold left-rule active state, footer utilities.

```jsx
<SideNav active="Overview" onNavigate={setView}
  items={[{label:'Overview',icon:'dashboard'},{label:'Program Registry',icon:'folder_managed'},{label:'Data Reporting',icon:'analytics'}]}
  cta={<Button variant="accent" icon="add_circle" fullWidth>New Report</Button>}
  footerItems={[{label:'Settings',icon:'settings'},{label:'Sign Out',icon:'logout'}]} />
```

Props: `items` (`{label, icon}[]`), `active`, `onNavigate`, `cta`, `footerItems`, `brand`, `brandSub`.
