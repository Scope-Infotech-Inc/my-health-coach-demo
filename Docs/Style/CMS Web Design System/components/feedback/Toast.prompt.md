Transient notification card — status rule + icon, title, body. Stack with `<ToastViewport>`.

```jsx
<ToastViewport position="bottom-right">
  <Toast kind="success" title="Report exported" onClose={dismiss}>North_Region_Q1_24.pdf is ready.</Toast>
</ToastViewport>
```

Kinds: `info`/`success`/`warning`/`error`. Props: `title`, `icon`, `onClose`.
