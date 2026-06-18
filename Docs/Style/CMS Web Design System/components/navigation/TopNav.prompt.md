CMS Program Portal top nav — navy band, gold bottom rule, horizontal nav with gold-underline active item, search, account slot.

```jsx
<TopNav brand="CMS Program Portal" active="Analytics"
  items={['Dashboard','Programs','Analytics','Resources']}
  onNavigate={setView}
  user={<Avatar name="Jane Doe" ring />} />
```

Props: `brand`, `items`, `active`, `onNavigate`, `searchPlaceholder`, `user`.
