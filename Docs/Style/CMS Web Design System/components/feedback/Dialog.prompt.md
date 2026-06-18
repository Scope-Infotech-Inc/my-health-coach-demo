Modal dialog over a navy scrim — titled header, body, footer actions. Esc/scrim closes.

```jsx
<Dialog open={open} onClose={close} icon="warning" title="Archive program?"
  footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="danger">Archive</Button></>}>
  This moves the program to the historical archive. You can restore it later.
</Dialog>
```

Props: `open`, `onClose`, `title`, `icon`, `footer`, `width`.
