/* @ds-bundle: {"format":3,"namespace":"CMSWebDesignSystem_cd3e62","components":[{"name":"Alert","sourcePath":"components/core/Alert.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"StatCard","sourcePath":"components/core/StatCard.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"BarChart","sourcePath":"components/dataviz/BarChart.jsx"},{"name":"DonutChart","sourcePath":"components/dataviz/DonutChart.jsx"},{"name":"Globe3D","sourcePath":"components/dataviz/Globe3D.jsx"},{"name":"LineChart","sourcePath":"components/dataviz/LineChart.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Pagination","sourcePath":"components/feedback/Pagination.jsx"},{"name":"Tabs","sourcePath":"components/feedback/Tabs.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"ToastViewport","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Gauge","sourcePath":"components/indicators/Gauge.jsx"},{"name":"ProgressBar","sourcePath":"components/indicators/ProgressBar.jsx"},{"name":"Skeleton","sourcePath":"components/indicators/Skeleton.jsx"},{"name":"Spinner","sourcePath":"components/indicators/Spinner.jsx"},{"name":"SideNav","sourcePath":"components/navigation/SideNav.jsx"},{"name":"TopNav","sourcePath":"components/navigation/TopNav.jsx"}],"sourceHashes":{"components/core/Alert.jsx":"543dbd9ef4c3","components/core/Avatar.jsx":"fd41cdbf930e","components/core/Badge.jsx":"c92fa84affb7","components/core/Button.jsx":"d02e9a525184","components/core/Card.jsx":"9982ceb94c5c","components/core/Input.jsx":"bba531303c05","components/core/Select.jsx":"606ea7f74d3f","components/core/StatCard.jsx":"8fe1539800de","components/core/Tag.jsx":"3d7ff8549c0f","components/dataviz/BarChart.jsx":"77586843eb47","components/dataviz/DonutChart.jsx":"f82ae302d664","components/dataviz/Globe3D.jsx":"bceb28a48009","components/dataviz/LineChart.jsx":"40e8150f51b9","components/feedback/Dialog.jsx":"b6125b2187fb","components/feedback/Pagination.jsx":"1c718293177e","components/feedback/Tabs.jsx":"c5a154ec4654","components/feedback/Toast.jsx":"c24ffea27bce","components/feedback/Tooltip.jsx":"0166c55a653f","components/indicators/Gauge.jsx":"d6cd6aebf381","components/indicators/ProgressBar.jsx":"e393becf12e3","components/indicators/Skeleton.jsx":"6bc4c535c63b","components/indicators/Spinner.jsx":"8adad6808770","components/navigation/SideNav.jsx":"68c22c1f241f","components/navigation/TopNav.jsx":"4cef7f40429a","design-sheet.app.jsx":"ebe80b9c45ab","ui_kits/cms_gov_public/Home.jsx":"1389290fc8ba","ui_kits/cms_gov_public/PublicApp.jsx":"3432c385cbfe","ui_kits/cms_gov_public/PublicFooter.jsx":"d646374b1162","ui_kits/cms_gov_public/PublicHeader.jsx":"31795db17fe1","ui_kits/program_portal/App.jsx":"cb532389b887","ui_kits/program_portal/Dashboard.jsx":"460a7bb534be","ui_kits/program_portal/DataReporting.jsx":"1a80c488f108","ui_kits/program_portal/Library.jsx":"24e3ec303eaa","ui_kits/program_portal/Registry.jsx":"a23520a6de71","ui_kits/program_portal/UserManagement.jsx":"346540ad1bf3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CMSWebDesignSystem_cd3e62 = window.CMSWebDesignSystem_cd3e62 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS Alert / callout — color + icon banner for system messages.
 * Left accent rule + tinted background; navy text for AA contrast.
 */
function Alert({
  kind = 'info',
  title,
  icon,
  onClose,
  children,
  style = {},
  ...rest
}) {
  const kinds = {
    info: {
      bg: 'var(--sky-tint)',
      rule: 'var(--navy-deep)',
      fg: 'var(--navy-deep)',
      icon: icon || 'info'
    },
    success: {
      bg: 'var(--success-container)',
      rule: 'var(--success)',
      fg: 'var(--on-success-container)',
      icon: icon || 'check_circle'
    },
    warning: {
      bg: 'rgba(253,184,30,0.18)',
      rule: 'var(--caution-gold)',
      fg: 'var(--warning)',
      icon: icon || 'warning'
    },
    error: {
      bg: 'var(--error-container)',
      rule: 'var(--error-red)',
      fg: 'var(--on-error-container)',
      icon: icon || 'report'
    }
  };
  const k = kinds[kind] || kinds.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      gap: 12,
      background: k.bg,
      borderLeft: `4px solid ${k.rule}`,
      borderRadius: 'var(--radius)',
      padding: '14px 16px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      fontSize: 22,
      color: k.rule,
      flexShrink: 0
    }
  }, k.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      fontWeight: 700,
      color: k.fg,
      marginBottom: children ? 4 : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: '20px',
      color: 'var(--on-surface-variant)'
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: k.fg,
      padding: 0,
      height: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 20
    }
  }, "close")));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Alert.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS Avatar — initials on a brand-tinted disc, or an image. Optional ring.
 */
function Avatar({
  name = '',
  src,
  size = 32,
  tone = 'navy',
  ring = false,
  style = {},
  ...rest
}) {
  const tones = {
    navy: {
      bg: 'var(--navy-deep)',
      fg: '#fff'
    },
    gold: {
      bg: 'var(--caution-gold)',
      fg: 'var(--navy-deep)'
    },
    sky: {
      bg: 'var(--sky-tint-strong)',
      fg: 'var(--navy-deep)'
    },
    slate: {
      bg: 'var(--slate-gray)',
      fg: '#fff'
    }
  };
  const t = tones[tone] || tones.navy;
  const initials = name.split(' ').map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const common = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    border: ring ? '2px solid var(--caution-gold)' : 'none',
    ...style
  };
  if (src) {
    return /*#__PURE__*/React.createElement("img", _extends({
      src: src,
      alt: name,
      style: {
        ...common,
        objectFit: 'cover'
      }
    }, rest));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...common,
      background: t.bg,
      color: t.fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: Math.round(size * 0.4)
    }
  }, rest), initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS status Badge — pill with optional dot/icon. Color encodes status,
 * always paired with text (and optionally an icon) for accessibility.
 */
function Badge({
  status = 'info',
  icon,
  dot = false,
  children,
  style = {},
  ...rest
}) {
  const palettes = {
    info: {
      bg: 'var(--sky-tint)',
      fg: 'var(--navy-deep)',
      dot: 'var(--navy-deep)'
    },
    success: {
      bg: 'var(--success-container)',
      fg: 'var(--on-success-container)',
      dot: 'var(--success)'
    },
    active: {
      bg: 'var(--sky-tint)',
      fg: 'var(--navy-deep)',
      dot: 'var(--navy-deep)'
    },
    warning: {
      bg: 'rgba(253,184,30,0.2)',
      fg: 'var(--warning)',
      dot: 'var(--caution-gold)'
    },
    error: {
      bg: 'var(--error-container)',
      fg: 'var(--on-error-container)',
      dot: 'var(--error)'
    },
    neutral: {
      bg: 'var(--surface-container)',
      fg: 'var(--on-surface-variant)',
      dot: 'var(--slate-gray)'
    }
  };
  const p = palettes[status] || palettes.info;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      background: p.bg,
      color: p.fg,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: '16px',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: p.dot
    }
  }), icon && /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      fontSize: 14
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS Button — navy primary, outline secondary, gold "actionable", ghost.
 * No shadow; soft 4px radius; press shrink; gold focus ring via DS base.
 */
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '6px 12px',
      fontSize: 13,
      height: 32,
      gap: 6,
      icon: 16
    },
    md: {
      padding: '10px 18px',
      fontSize: 14,
      height: 42,
      gap: 8,
      icon: 18
    },
    lg: {
      padding: '14px 24px',
      fontSize: 16,
      height: 52,
      gap: 8,
      icon: 20
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-label)',
    fontSize: s.fontSize,
    fontWeight: 700,
    letterSpacing: '0.01em',
    borderRadius: 'var(--radius)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard), filter var(--duration-fast) var(--ease-standard)',
    whiteSpace: 'nowrap'
  };
  const variants = {
    primary: {
      background: 'var(--action-primary)',
      color: 'var(--on-primary)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--navy-deep)',
      border: '2px solid var(--navy-deep)'
    },
    accent: {
      background: 'var(--caution-gold)',
      color: 'var(--navy-deep)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--navy-deep)'
    },
    danger: {
      background: 'var(--error-red)',
      color: '#fff'
    }
  };
  const v = variants[variant] || variants.primary;
  const onDown = e => {
    if (!disabled) e.currentTarget.style.transform = 'scale(0.96)';
  };
  const onUp = e => {
    e.currentTarget.style.transform = 'scale(1)';
  };
  const onEnter = e => {
    if (disabled) return;
    if (variant === 'primary') e.currentTarget.style.background = 'var(--action-primary-hover)';else if (variant === 'accent') e.currentTarget.style.filter = 'brightness(0.95)';else if (variant === 'secondary' || variant === 'ghost') e.currentTarget.style.background = 'var(--sky-tint)';else if (variant === 'danger') e.currentTarget.style.filter = 'brightness(0.92)';
  };
  const onLeave = e => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.filter = 'none';
    e.currentTarget.style.background = v.background;
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: {
      ...base,
      ...v,
      ...style
    },
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onMouseDown: onDown,
    onMouseUp: onUp
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: s.icon
    }
  }, icon), children, iconRight && /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: s.icon
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS Card — flat surface, 1px hairline border, soft 8px radius.
 * Optional Sky-Tint header strip. Lifts subtly on hover when interactive.
 */
function Card({
  interactive = false,
  header,
  footer,
  padded = true,
  children,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'box-shadow var(--duration) var(--ease-standard), transform var(--duration) var(--ease-standard), border-color var(--duration) var(--ease-standard)',
      boxShadow: hover ? 'var(--shadow-raised)' : 'none',
      transform: hover ? 'translateY(-2px)' : 'none',
      borderColor: hover ? 'var(--navy-deep)' : 'var(--border-hairline)',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    }
  }, rest), header && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-info)',
      borderBottom: '1px solid var(--border-hairline)',
      padding: '14px 24px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--headline-md-size)',
      fontWeight: 600,
      color: 'var(--text-heading)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: padded ? 'var(--card-padding)' : 0
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-hairline)',
      padding: '14px 24px'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS text Input — always-visible Lexend label (no floating labels), 1px
 * slate border thickening to 2px navy on focus, error state in CMS red.
 */
function Input({
  label,
  hint,
  error,
  icon,
  required = false,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? `inp-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const borderColor = error ? 'var(--error-red)' : focus ? 'var(--navy-deep)' : 'var(--border-input)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--on-surface)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-red)',
      marginLeft: 4
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--white)',
      border: `${focus || error ? 2 : 1}px solid ${borderColor}`,
      borderRadius: 'var(--radius)',
      padding: focus || error ? '9px 11px' : '10px 12px',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 20,
      color: 'var(--text-subtle)'
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      color: 'var(--on-surface)',
      minWidth: 0
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 500,
      color: error ? 'var(--error-red)' : 'var(--text-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, error && /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 14
    }
  }, "error"), error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS Select — labeled native select styled to match Input.
 */
function Select({
  label,
  hint,
  required = false,
  id,
  children,
  style = {},
  ...rest
}) {
  const selId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--on-surface)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-red)',
      marginLeft: 4
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    style: {
      appearance: 'none',
      width: '100%',
      background: 'var(--white)',
      border: '1px solid var(--border-input)',
      borderRadius: 'var(--radius)',
      padding: '10px 40px 10px 12px',
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      color: 'var(--on-surface)',
      cursor: 'pointer'
    }
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      position: 'absolute',
      right: 10,
      pointerEvents: 'none',
      color: 'var(--text-subtle)',
      fontSize: 22
    }
  }, "expand_more")), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text-subtle)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/core/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS StatCard / KPI tile — tinted icon chip + big display number, used in
 * bento dashboard grids. Optional trend badge and footer meta.
 */
function StatCard({
  icon,
  tone = 'info',
  label,
  value,
  trend,
  footer,
  style = {},
  ...rest
}) {
  const tones = {
    info: {
      chipBg: 'var(--sky-tint)',
      chipFg: 'var(--navy-deep)'
    },
    gold: {
      chipBg: 'rgba(253,184,30,0.15)',
      chipFg: 'var(--caution-gold)'
    },
    error: {
      chipBg: 'var(--error-container)',
      chipFg: 'var(--error)'
    },
    neutral: {
      chipBg: 'var(--surface-container)',
      chipFg: 'var(--slate-gray)'
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--card-padding)',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius)',
      background: t.chipBg,
      color: t.chipFg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      fontSize: 24
    }
  }, icon)), trend), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-muted)',
      marginTop: 16
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--display-lg-size)',
      lineHeight: 1.05,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: 'var(--text-heading)',
      marginTop: 4
    }
  }, value), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 16,
      borderTop: '1px solid var(--border-hairline)',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-subtle)'
    }
  }, footer));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * CMS Tag — neutral category/filter chip. Outlined by default; selectable.
 */
function Tag({
  selected = false,
  icon,
  onRemove,
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border-hairline)',
      background: selected ? 'var(--sky-tint)' : 'var(--surface-container)',
      color: selected ? 'var(--navy-deep)' : 'var(--on-surface-variant)',
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 600,
      cursor: rest.onClick ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 14
    }
  }, icon), children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      fontSize: 14,
      cursor: 'pointer',
      marginLeft: 2
    }
  }, "close"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/dataviz/BarChart.jsx
try { (() => {
/**
 * CMS BarChart — vertical bars that grow from the baseline on mount. Single or
 * grouped series, value labels, gridlines. Pure CSS animation, reduced-motion safe.
 */
function BarChart({
  data = [],
  series,
  height = 240,
  max,
  unit = '',
  tone
}) {
  // data: [{ label, value }] OR [{ label, values:[..] }] with `series` meta
  const grouped = !!series;
  const palette = ['var(--navy-deep)', 'var(--caution-gold)', 'var(--sky-tint-strong)'];
  const allVals = grouped ? data.flatMap(d => d.values) : data.map(d => d.value);
  const hi = max != null ? max : Math.max(1, ...allVals) * 1.1;
  const single = tone === 'gold' ? 'var(--caution-gold)' : 'var(--navy-deep)';
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      display: 'flex',
      alignItems: 'flex-end',
      gap: 0,
      justifyContent: 'space-around',
      borderBottom: '1px solid var(--outline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      pointerEvents: 'none'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: '1px solid var(--outline-variant)',
      opacity: 0.5
    }
  }))), data.map((d, di) => /*#__PURE__*/React.createElement("div", {
    key: di,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      height: '100%',
      justifyContent: 'flex-end',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 4,
      height: '100%',
      width: '100%',
      justifyContent: 'center'
    }
  }, (grouped ? d.values : [d.value]).map((v, vi) => /*#__PURE__*/React.createElement("div", {
    key: vi,
    title: `${v}${unit}`,
    style: {
      width: grouped ? `${50 / d.values.length}%` : '46%',
      maxWidth: 44,
      height: `${v / hi * 100}%`,
      background: grouped ? palette[vi % palette.length] : single,
      borderRadius: 'var(--radius) var(--radius) 0 0',
      transformOrigin: 'bottom',
      transform: shown ? 'scaleY(1)' : 'scaleY(0)',
      transition: `transform 0.7s var(--ease-out) ${di * 0.06 + vi * 0.05}s`
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: 8
    }
  }, data.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      color: 'var(--text-subtle)'
    }
  }, d.label))), grouped && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      justifyContent: 'center',
      marginTop: 8
    }
  }, series.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: palette[i % palette.length]
    }
  }), s))));
}
Object.assign(__ds_scope, { BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/dataviz/DonutChart.jsx
try { (() => {
/**
 * CMS DonutChart — segmented ring with animated sweep on mount, center total,
 * and a legend with values. Pure SVG/CSS, reduced-motion safe.
 */
function DonutChart({
  data = [],
  size = 200,
  thickness = 22,
  centerLabel,
  centerValue,
  legend = true
}) {
  const palette = ['var(--navy-deep)', 'var(--caution-gold)', 'var(--sky-tint-strong)', 'var(--slate-gray)'];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const segs = data.map((d, i) => {
    const frac = d.value / total;
    const seg = {
      color: d.color || palette[i % palette.length],
      len: frac * circ,
      dash: offset,
      pct: Math.round(frac * 100),
      label: d.label,
      value: d.value
    };
    offset += frac * circ;
    return seg;
  });
  const shown = true;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: c,
    cy: c,
    r: r,
    fill: "none",
    stroke: "var(--surface-container)",
    strokeWidth: thickness
  }), segs.map((s, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: c,
    cy: c,
    r: r,
    fill: "none",
    stroke: s.color,
    strokeWidth: thickness,
    strokeDasharray: `${shown ? s.len : 0} ${circ}`,
    strokeDashoffset: -s.dash,
    style: {
      transition: `stroke-dasharray 0.9s var(--ease-out) ${i * 0.12}s`
    }
  }))), (centerLabel || centerValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, centerLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--text-subtle)'
    }
  }, centerLabel), centerValue && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 28px/1 var(--font-sans)',
      color: 'var(--navy-deep)',
      letterSpacing: '-0.02em'
    }
  }, centerValue))), legend && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      minWidth: 160
    }
  }, segs.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '8px 12px',
      background: 'var(--surface-container-low)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-label)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 3,
      background: s.color
    }
  }), s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--navy-deep)'
    }
  }, s.pct, "%")))));
}
Object.assign(__ds_scope, { DonutChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/DonutChart.jsx", error: String((e && e.message) || e) }); }

// components/dataviz/Globe3D.jsx
try { (() => {
/**
 * CMS Globe3D — a WebGL (three.js) rotating wireframe globe with glowing data
 * points, for "national reach" hero/dashboard moments. Loads three.js from CDN
 * on demand. Navy globe, gold data points. Reduced-motion → slow/no spin.
 */
function Globe3D({
  height = 320,
  points = 28,
  spin = true,
  accent = '#FDB81E',
  globeColor = '#2e486c'
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let renderer,
      frame,
      disposed = false;
    const mount = ref.current;
    if (!mount) return;
    const loadThree = () => new Promise((resolve, reject) => {
      if (window.THREE) return resolve(window.THREE);
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
      s.onload = () => resolve(window.THREE);
      s.onerror = reject;
      document.head.appendChild(s);
    });
    loadThree().then(THREE => {
      if (disposed) return;
      const W = mount.clientWidth,
        H = height;
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      cam.position.z = 3.2;
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      mount.appendChild(renderer.domElement);
      const group = new THREE.Group();
      scene.add(group);

      // wireframe globe
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), new THREE.MeshBasicMaterial({
        color: new THREE.Color(globeColor),
        wireframe: true,
        transparent: true,
        opacity: 0.55
      }));
      group.add(sphere);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.985, 36, 28), new THREE.MeshBasicMaterial({
        color: new THREE.Color('#0a2342'),
        transparent: true,
        opacity: 0.85
      }));
      group.add(glow);

      // glowing data points on the surface
      const ptsGeo = new THREE.BufferGeometry();
      const arr = [];
      for (let i = 0; i < points; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const rr = 1.02;
        arr.push(rr * Math.sin(phi) * Math.cos(theta), rr * Math.cos(phi), rr * Math.sin(phi) * Math.sin(theta));
      }
      ptsGeo.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      const ptsMat = new THREE.PointsMaterial({
        color: new THREE.Color(accent),
        size: 0.08,
        sizeAttenuation: true
      });
      group.add(new THREE.Points(ptsGeo, ptsMat));
      group.rotation.x = 0.35;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const speed = reduce ? 0 : spin ? 0.0035 : 0;
      const animate = () => {
        group.rotation.y += speed;
        renderer.render(scene, cam);
        frame = requestAnimationFrame(animate);
      };
      animate();
      const onResize = () => {
        if (!mount) return;
        const nw = mount.clientWidth;
        cam.aspect = nw / height;
        cam.updateProjectionMatrix();
        renderer.setSize(nw, height);
      };
      window.addEventListener('resize', onResize);
      mount._cleanup = () => {
        window.removeEventListener('resize', onResize);
      };
    }).catch(() => {
      if (mount) mount.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-subtle);font-family:var(--font-label);font-size:13px">WebGL globe unavailable</div>';
    });
    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      if (mount && mount._cleanup) mount._cleanup();
      if (renderer) {
        renderer.dispose && renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [height, points, spin, accent, globeColor]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      width: '100%',
      height
    },
    "aria-label": "Rotating globe of national data points"
  });
}
Object.assign(__ds_scope, { Globe3D });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/Globe3D.jsx", error: String((e && e.message) || e) }); }

// components/dataviz/LineChart.jsx
try { (() => {
/**
 * CMS LineChart — multi-series SVG line chart with an animated draw-in
 * (stroke-dashoffset), horizontal gridlines, x-axis labels, and a legend.
 * Pure SVG/CSS, no deps. Reduced-motion safe.
 */
function LineChart({
  series = [],
  // [{ name, color, points:[n,…] }]
  labels = [],
  // x-axis labels
  height = 240,
  width = 640,
  max,
  area = false,
  legend = true
}) {
  const pad = {
    l: 8,
    r: 8,
    t: 12,
    b: 24
  };
  const w = width,
    h = height;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const allVals = series.flatMap(s => s.points);
  const hi = max != null ? max : Math.max(1, ...allVals) * 1.1;
  const xAt = (i, n) => pad.l + (n <= 1 ? innerW / 2 : i / (n - 1) * innerW);
  const yAt = v => pad.t + innerH - v / hi * innerH;
  const pathFor = pts => pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i, pts.length).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  const areaFor = pts => `${pathFor(pts)} L${xAt(pts.length - 1, pts.length).toFixed(1)},${pad.t + innerH} L${xAt(0, pts.length).toFixed(1)},${pad.t + innerH} Z`;

  // Entrance: reveal to the visible end-state via CSS transition (state-driven,
  // so the resolved DOM always lands on "shown"). Reduced-motion shows instantly.
  // Render the drawn end-state directly — reliable across SSR/throttle/snapshot.
  const shown = true;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    width: "100%",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, [0, 0.25, 0.5, 0.75, 1].map(t => /*#__PURE__*/React.createElement("line", {
    key: t,
    x1: pad.l,
    x2: w - pad.r,
    y1: pad.t + innerH * t,
    y2: pad.t + innerH * t,
    stroke: "var(--outline-variant)",
    strokeWidth: "1",
    opacity: "0.5"
  })), series.map((s, si) => /*#__PURE__*/React.createElement("g", {
    key: si
  }, area && /*#__PURE__*/React.createElement("path", {
    d: areaFor(s.points),
    fill: s.color,
    opacity: shown ? 0.10 : 0,
    style: {
      transition: 'opacity 0.8s var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("path", {
    d: pathFor(s.points),
    fill: "none",
    stroke: s.color,
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    opacity: shown ? 1 : 0,
    style: {
      transition: `opacity 0.7s var(--ease-out) ${si * 0.12}s`
    }
  }), s.points.map((v, i) => /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: xAt(i, s.points.length),
    cy: yAt(v),
    r: "3.5",
    fill: "var(--white)",
    stroke: s.color,
    strokeWidth: "2",
    opacity: shown ? 1 : 0,
    style: {
      transition: `opacity 0.3s var(--ease-out) ${0.5 + si * 0.15 + i * 0.04}s`
    }
  })))), labels.map((l, i) => /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xAt(i, labels.length),
    y: h - 6,
    textAnchor: "middle",
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fill: 'var(--text-subtle)'
    }
  }, l))), legend && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      justifyContent: 'center',
      marginTop: 8
    }
  }, series.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 12,
      height: 3,
      borderRadius: 2,
      background: s.color
    }
  }), s.name))));
}
Object.assign(__ds_scope, { LineChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/dataviz/LineChart.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/**
 * CMS Dialog / Modal — centered panel over a navy-tinted scrim. Soft 8px
 * radius, overlay shadow, optional title + footer actions. Esc / scrim closes.
 */
function Dialog({
  open,
  onClose,
  title,
  icon,
  footer,
  width = 520,
  children
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(17,46,81,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      animation: 'cmsFade var(--duration) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-overlay)',
      overflow: 'hidden',
      animation: 'cmsPop var(--duration) var(--ease-out)'
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '18px 24px',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius)',
      background: 'var(--sky-tint)',
      color: 'var(--navy-deep)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      fontSize: 20
    }
  }, icon)), /*#__PURE__*/React.createElement("h2", {
    style: {
      flex: 1,
      margin: 0,
      font: '600 20px/26px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined"
  }, "close"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: '24px',
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 12,
      padding: '16px 24px',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-container-low)'
    }
  }, footer)), /*#__PURE__*/React.createElement("style", null, '@keyframes cmsFade{from{opacity:0}to{opacity:1}}@keyframes cmsPop{from{opacity:0;transform:translateY(8px) scale(0.98)}to{opacity:1;transform:none}}'));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Pagination.jsx
try { (() => {
/**
 * CMS Pagination — prev/next chevrons + numbered pages with navy active page,
 * truncated with ellipses. Matches the resource-library pager.
 */
function Pagination({
  page = 1,
  pageCount = 1,
  onChange,
  siblings = 1
}) {
  const go = p => {
    if (p >= 1 && p <= pageCount && p !== page) onChange && onChange(p);
  };
  const pages = [];
  const push = p => pages.push(p);
  const range = (a, b) => {
    for (let i = a; i <= b; i++) push(i);
  };
  if (pageCount <= 7) {
    range(1, pageCount);
  } else {
    const left = Math.max(2, page - siblings);
    const right = Math.min(pageCount - 1, page + siblings);
    push(1);
    if (left > 2) push('…l');
    range(left, right);
    if (right < pageCount - 1) push('…r');
    push(pageCount);
  }
  const cell = {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontFamily: 'var(--font-label)',
    fontSize: 14,
    fontWeight: 600,
    border: '1px solid var(--border-hairline)',
    background: 'var(--white)',
    color: 'var(--on-surface)'
  };
  const arrow = (dir, disabled) => /*#__PURE__*/React.createElement("button", {
    onClick: () => go(dir === 'prev' ? page - 1 : page + 1),
    disabled: disabled,
    style: {
      ...cell,
      opacity: disabled ? 0.4 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: 'var(--navy-deep)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined"
  }, dir === 'prev' ? 'chevron_left' : 'chevron_right'));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, arrow('prev', page === 1), pages.map((p, i) => typeof p === 'string' ? /*#__PURE__*/React.createElement("span", {
    key: p + i,
    style: {
      padding: '0 4px',
      color: 'var(--text-subtle)'
    }
  }, "\u2026") : /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => go(p),
    style: {
      ...cell,
      ...(p === page ? {
        background: 'var(--navy-deep)',
        color: '#fff',
        borderColor: 'var(--navy-deep)',
        fontWeight: 700
      } : {})
    }
  }, p)), arrow('next', page === pageCount));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tabs.jsx
try { (() => {
/**
 * CMS Tabs — underlined tab strip with a gold active rule, matching the
 * portal/public nav vocabulary. Controlled or uncontrolled.
 */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  children
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].id));
  const active = value !== undefined ? value : internal;
  const set = id => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, tabs.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      role: "tab",
      "aria-selected": on,
      onClick: () => set(t.id),
      style: {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '12px 16px',
        marginBottom: -1,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-label)',
        fontSize: 14,
        fontWeight: on ? 700 : 500,
        color: on ? 'var(--navy-deep)' : 'var(--text-muted)',
        borderBottom: on ? '3px solid var(--caution-gold)' : '3px solid transparent',
        transition: 'color var(--duration-fast) var(--ease-standard)'
      }
    }, t.icon && /*#__PURE__*/React.createElement("span", {
      className: "material-symbols-outlined",
      style: {
        fontSize: 18
      }
    }, t.icon), t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        background: on ? 'var(--sky-tint-strong)' : 'var(--surface-container)',
        borderRadius: 'var(--radius)',
        padding: '0 7px',
        fontSize: 12
      }
    }, t.count));
  })), children && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 20
    }
  }, typeof children === 'function' ? children(active) : children));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/**
 * CMS Toast — transient notification card. Status accent rule + icon, title,
 * optional body, auto-dismiss. Pair with <ToastViewport> for stacking.
 */
function Toast({
  kind = 'info',
  title,
  icon,
  onClose,
  children
}) {
  const k = {
    info: {
      rule: 'var(--navy-deep)',
      icon: icon || 'info'
    },
    success: {
      rule: 'var(--success)',
      icon: icon || 'check_circle'
    },
    warning: {
      rule: 'var(--caution-gold)',
      icon: icon || 'warning'
    },
    error: {
      rule: 'var(--error-red)',
      icon: icon || 'report'
    }
  }[kind];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      width: 360,
      maxWidth: '90vw',
      background: 'var(--surface-card)',
      borderLeft: `4px solid ${k.rule}`,
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-overlay)',
      padding: '14px 16px',
      animation: 'cmsToastIn var(--duration) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      color: k.rule,
      fontSize: 22,
      flexShrink: 0
    }
  }, k.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 15px/20px var(--font-sans)',
      color: 'var(--navy-deep)',
      marginBottom: children ? 2 : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: '20px',
      color: 'var(--text-muted)'
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-subtle)',
      display: 'flex',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 18
    }
  }, "close")), /*#__PURE__*/React.createElement("style", null, '@keyframes cmsToastIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}'));
}

/** Fixed bottom-right stack container for Toasts. */
function ToastViewport({
  position = 'bottom-right',
  children
}) {
  const pos = {
    'bottom-right': {
      bottom: 24,
      right: 24
    },
    'bottom-left': {
      bottom: 24,
      left: 24
    },
    'top-right': {
      top: 24,
      right: 24
    }
  }[position];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      zIndex: 1100,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...pos
    }
  }, children);
}
Object.assign(__ds_scope, { Toast, ToastViewport });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/**
 * CMS Tooltip — navy bubble on hover/focus. Wraps any trigger element.
 */
function Tooltip({
  label,
  side = 'top',
  children
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-8px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-8px)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(8px)'
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      zIndex: 1200,
      whiteSpace: 'nowrap',
      background: 'var(--navy-900)',
      color: '#fff',
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 600,
      padding: '6px 10px',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-atmospheric)',
      pointerEvents: 'none',
      animation: 'cmsTip 120ms var(--ease-out)'
    }
  }, label), /*#__PURE__*/React.createElement("style", null, '@keyframes cmsTip{from{opacity:0}to{opacity:1}}'));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/indicators/Gauge.jsx
try { (() => {
/**
 * CMS Gauge — radial arc meter (270° sweep). Animated arc fill + value
 * count-up on mount. Navy track, configurable accent. Reduced-motion safe.
 */
function Gauge({
  value = 0,
  max = 100,
  size = 160,
  label,
  unit = '%',
  tone = 'navy',
  thickness = 12
}) {
  const accent = {
    navy: 'var(--navy-deep)',
    gold: 'var(--caution-gold)',
    success: 'var(--success)'
  }[tone] || 'var(--navy-deep)';
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const sweep = 270; // degrees of visible arc
  const circ = 2 * Math.PI * r;
  const arcLen = sweep / 360 * circ;
  const pct = Math.max(0, Math.min(1, value / max));
  const [disp, setDisp] = React.useState(value);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisp(value);
      return;
    }
    let raf, start;
    const dur = 900;
    const step = t => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisp(value * eased);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const dispPct = Math.max(0, Math.min(1, disp / max));
  // rotate so the 270° arc is centered at the bottom gap
  const rot = 135;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: `rotate(${rot}deg)`
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cx,
    r: r,
    fill: "none",
    stroke: "var(--surface-container-highest)",
    strokeWidth: thickness,
    strokeDasharray: `${arcLen} ${circ}`,
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cx,
    r: r,
    fill: "none",
    stroke: accent,
    strokeWidth: thickness,
    strokeDasharray: `${arcLen * dispPct} ${circ}`,
    strokeLinecap: "round",
    style: {
      transition: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 ' + Math.round(size * 0.2) + 'px/1 var(--font-sans)',
      letterSpacing: '-0.02em',
      color: 'var(--navy-deep)'
    }
  }, Number.isInteger(value) ? Math.round(disp) : disp.toFixed(1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.5em',
      color: 'var(--text-muted)'
    }
  }, unit)))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { Gauge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/indicators/Gauge.jsx", error: String((e && e.message) || e) }); }

// components/indicators/ProgressBar.jsx
try { (() => {
/**
 * CMS ProgressBar — determinate (animated fill to value) or indeterminate
 * (sliding sweep). Optional label + value readout. Reduced-motion safe.
 */
function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  indeterminate = false,
  tone = 'navy',
  height = 8
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const fill = {
    navy: 'var(--navy-deep)',
    gold: 'var(--caution-gold)',
    success: 'var(--success)'
  }[tone] || 'var(--navy-deep)';
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setW(pct), 60);
    return () => clearTimeout(t);
  }, [pct]);
  return /*#__PURE__*/React.createElement("div", null, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6,
      fontFamily: 'var(--font-label)',
      fontSize: 13
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)',
      fontWeight: 600
    }
  }, label), showValue && !indeterminate && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-subtle)',
      fontWeight: 700
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height,
      background: 'var(--surface-container)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden',
      position: 'relative'
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      height: '100%',
      width: '40%',
      background: fill,
      borderRadius: 'var(--radius-pill)',
      animation: 'cmsIndet 1.3s var(--ease-standard) infinite'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: w + '%',
      background: fill,
      borderRadius: 'var(--radius-pill)',
      transition: 'width 0.7s var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("style", null, `
        @keyframes cmsIndet{0%{left:-40%}100%{left:100%}}
        @media (prefers-reduced-motion: reduce){div[style*="cmsIndet"]{animation:none;left:0;width:100%}}
      `));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/indicators/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/indicators/Skeleton.jsx
try { (() => {
/**
 * CMS Skeleton — shimmer loading placeholder. Use `text`, `block`, or `circle`
 * variants while content loads. Reduced-motion safe (static fill).
 */
function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  radius
}) {
  const base = {
    background: 'linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 37%, var(--surface-container) 63%)',
    backgroundSize: '400% 100%',
    animation: 'cmsShimmer 1.4s ease infinite',
    borderRadius: radius != null ? radius : 'var(--radius)'
  };
  const css = /*#__PURE__*/React.createElement("style", null, `
      @keyframes cmsShimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
      @media (prefers-reduced-motion: reduce){.cms-skel{animation:none !important}}
    `);
  if (variant === 'circle') {
    const d = width || height || 40;
    return /*#__PURE__*/React.createElement("span", {
      className: "cms-skel",
      style: {
        ...base,
        display: 'inline-block',
        width: d,
        height: d,
        borderRadius: '50%'
      }
    }, css);
  }
  if (variant === 'block') {
    return /*#__PURE__*/React.createElement("span", {
      className: "cms-skel",
      style: {
        ...base,
        display: 'block',
        width: width || '100%',
        height: height || 120,
        borderRadius: radius != null ? radius : 'var(--radius-lg)'
      }
    }, css);
  }
  // text — N lines
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, Array.from({
    length: lines
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "cms-skel",
    style: {
      ...base,
      display: 'block',
      height: height || 12,
      width: i === lines - 1 && lines > 1 ? '70%' : width || '100%'
    }
  })), css);
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/indicators/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/indicators/Spinner.jsx
try { (() => {
/**
 * CMS Spinner — ring loader. Navy track with a gold sweep, CSS-animated.
 * Respects prefers-reduced-motion (falls back to a static dashed ring).
 */
function Spinner({
  size = 28,
  thickness = 3,
  label,
  color = 'var(--navy-deep)',
  track = 'var(--surface-container-highest)'
}) {
  const id = React.useId ? React.useId() : 'sp';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "status",
    "aria-label": label || 'Loading',
    style: {
      width: size,
      height: size,
      display: 'inline-block',
      borderRadius: '50%',
      border: `${thickness}px solid ${track}`,
      borderTopColor: color,
      borderRightColor: color,
      animation: 'cmsSpin 0.8s linear infinite'
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("style", null, `
        @keyframes cmsSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion: reduce){[role=status]{animation:none !important;border-style:dashed}}
      `));
}
Object.assign(__ds_scope, { Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/indicators/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SideNav.jsx
try { (() => {
/**
 * CMS Program Portal sidebar — fixed 256px rail. Brand lockup, primary CTA,
 * nav items (gold left-rule + sky fill on active), and a footer utility group.
 */
function SideNav({
  items = [],
  active,
  onNavigate,
  cta,
  footerItems = [],
  brand = 'Admin Console',
  brandSub = 'Healthcare Management',
  style = {}
}) {
  const Item = ({
    it
  }) => {
    const on = it.label === active;
    return /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(it.label);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 16px',
        borderRadius: on ? 0 : 'var(--radius-lg)',
        textDecoration: 'none',
        color: on ? 'var(--navy-deep)' : 'var(--on-surface-variant)',
        background: on ? 'var(--sky-tint-strong)' : 'transparent',
        borderRight: on ? '4px solid var(--caution-gold)' : '4px solid transparent',
        fontWeight: on ? 700 : 500,
        fontFamily: 'var(--font-label)',
        fontSize: 14,
        transition: 'background var(--duration-fast) var(--ease-standard)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--surface-container-highest)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: 'material-symbols-outlined' + (on ? ' is-filled' : '')
    }, it.icon), it.label);
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      background: 'var(--surface-container-low)',
      borderRight: '1px solid var(--border-hairline)',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      background: 'var(--navy-deep)',
      borderRadius: 'var(--radius)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      color: '#fff'
    }
  }, "account_balance")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 18,
      color: 'var(--navy-deep)',
      lineHeight: 1.1
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--text-subtle)'
    }
  }, brandSub))), cta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, cta), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, items.map(it => /*#__PURE__*/React.createElement(Item, {
    key: it.label,
    it: it
  })))), footerItems.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: 'var(--gutter)',
      borderTop: '1px solid var(--border-hairline)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, footerItems.map(it => /*#__PURE__*/React.createElement(Item, {
    key: it.label,
    it: it
  }))));
}
Object.assign(__ds_scope, { SideNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SideNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopNav.jsx
try { (() => {
/**
 * CMS Program Portal top navigation bar — navy band with a gold bottom rule,
 * brand title, horizontal nav (gold underline on active), search, action
 * icons, and an account avatar.
 */
function TopNav({
  brand = 'CMS Program Portal',
  items = ['Dashboard', 'Programs', 'Analytics', 'Resources'],
  active = 'Dashboard',
  onNavigate,
  searchPlaceholder = 'Search data…',
  user,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: 'var(--navy-deep)',
      borderBottom: '2px solid var(--caution-gold)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      height: 'var(--topbar-height)',
      padding: '0 var(--margin-desktop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--on-primary)'
    }
  }, brand), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      height: 'var(--topbar-height)'
    }
  }, items.map(it => {
    const on = it === active;
    return /*#__PURE__*/React.createElement("a", {
      key: it,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate && onNavigate(it);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        padding: '0 10px',
        fontFamily: 'var(--font-sans)',
        fontSize: 16,
        textDecoration: 'none',
        color: on ? 'var(--on-primary)' : 'var(--on-primary-container)',
        borderBottom: on ? '4px solid var(--gold-dim)' : '4px solid transparent',
        fontWeight: on ? 700 : 400,
        transition: 'color var(--duration-fast) var(--ease-standard)'
      }
    }, it);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--navy-deep)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 'var(--radius)',
      padding: '7px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 18,
      color: 'var(--on-primary-container)'
    }
  }, "search"), /*#__PURE__*/React.createElement("input", {
    placeholder: searchPlaceholder,
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: 'var(--on-primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      width: 180
    }
  })), ['notifications', 'help'].map(ic => /*#__PURE__*/React.createElement("button", {
    key: ic,
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--on-primary)',
      cursor: 'pointer',
      padding: 6,
      display: 'flex',
      borderRadius: '50%'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined"
  }, ic))), user)));
}
Object.assign(__ds_scope, { TopNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopNav.jsx", error: String((e && e.message) || e) }); }

// design-sheet.app.jsx
try { (() => {
/* Design sheet — component specimens (reads primitives off window) */
const {
  Button,
  Badge,
  Tag,
  Input,
  Select,
  Alert,
  Avatar,
  StatCard,
  Tabs,
  Pagination,
  Toast,
  Tooltip,
  Dialog,
  Spinner,
  ProgressBar,
  Gauge,
  Skeleton,
  LineChart,
  BarChart,
  DonutChart,
  Globe3D
} = window;
function Panel({
  label,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      marginBottom: 16,
      ...style
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "ph"
  }, label), children);
}
function Sheet() {
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(2);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Panel, {
    label: "Buttons"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "add"
  }, "Primary"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Secondary"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    icon: "add_circle"
  }, "Accent"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    iconRight: "arrow_forward"
  }, "Ghost"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    icon: "delete"
  }, "Danger"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    disabled: true
  }, "Disabled"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm"
  }, "Small"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Large"))), /*#__PURE__*/React.createElement(Panel, {
    label: "Badges, Tags & Avatars"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    status: "active",
    dot: true
  }, "Active"), /*#__PURE__*/React.createElement(Badge, {
    status: "success",
    icon: "verified"
  }, "Complete"), /*#__PURE__*/React.createElement(Badge, {
    status: "warning",
    icon: "pending"
  }, "Review Required"), /*#__PURE__*/React.createElement(Badge, {
    status: "error",
    icon: "warning"
  }, "Action Required"), /*#__PURE__*/React.createElement(Badge, {
    status: "neutral"
  }, "Archived")), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Tag, {
    selected: true
  }, "Transmittals"), /*#__PURE__*/React.createElement(Tag, {
    icon: "tag"
  }, "ICD-10 Updates"), /*#__PURE__*/React.createElement(Tag, {
    onRemove: () => {}
  }, "Provider Manuals"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16
    }
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Jane Doe"
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Alan Miller",
    tone: "gold"
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mark Smith",
    tone: "slate",
    size: 40,
    ring: true
  }))), /*#__PURE__*/React.createElement(Panel, {
    label: "Form controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Program name",
    placeholder: "Enter a name",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Search",
    icon: "search",
    placeholder: "Keywords\u2026"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Sort by"
  }, /*#__PURE__*/React.createElement("option", null, "Newest First"), /*#__PURE__*/React.createElement("option", null, "Alphabetical")), /*#__PURE__*/React.createElement(Input, {
    label: "NPI",
    error: "Must be 10 digits",
    defaultValue: "123"
  }))), /*#__PURE__*/React.createElement(Panel, {
    label: "Alerts"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    kind: "info",
    title: "Nondiscrimination in health"
  }, "Recent court decisions affect provisions of the 2024 Final Rule implementing Section 1557."), /*#__PURE__*/React.createElement(Alert, {
    kind: "success",
    title: "Report submitted"
  }, "District 01 \u2014 Boston compliance report accepted."))), /*#__PURE__*/React.createElement(Panel, {
    label: "Tabs, Pagination, Tooltip & Dialog"
  }, /*#__PURE__*/React.createElement(Tabs, {
    defaultValue: "all",
    tabs: [{
      id: 'all',
      label: 'All Resources',
      count: 124
    }, {
      id: 'manuals',
      label: 'Manuals',
      icon: 'description',
      count: 42
    }, {
      id: 'transmittals',
      label: 'Transmittals',
      count: 31
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      marginTop: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    pageCount: 12,
    onChange: setPage
  }), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Export as PDF"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "file_download"
  }, "Hover")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "open_in_full",
    onClick: () => setOpen(true)
  }, "Open dialog")))), /*#__PURE__*/React.createElement(Panel, {
    label: "StatCards"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "assignment",
    tone: "info",
    label: "Active Programs",
    value: "1,284",
    trend: /*#__PURE__*/React.createElement(Badge, {
      status: "success",
      icon: "trending_up"
    }, "+4.2%"),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "material-symbols-outlined",
      style: {
        fontSize: 14
      }
    }, "history"), " Updated 12 mins ago")
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "verified_user",
    tone: "gold",
    label: "Compliance Rate",
    value: "98.2%",
    trend: /*#__PURE__*/React.createElement(Badge, {
      status: "neutral"
    }, "Stable")
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "pending_actions",
    tone: "error",
    label: "Pending Reports",
    value: "42",
    trend: /*#__PURE__*/React.createElement(Badge, {
      status: "error",
      icon: "priority_high"
    }, "Action")
  }))), /*#__PURE__*/React.createElement(Panel, {
    label: "Indicators \u2014 Spinner, Progress, Gauge, Skeleton"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: '1fr 1fr',
      gap: 28,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Spinner, {
    size: 24
  }), /*#__PURE__*/React.createElement(Spinner, {
    size: 30,
    color: "var(--caution-gold)"
  }), /*#__PURE__*/React.createElement(Spinner, {
    size: 26,
    label: "Loading\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    label: "Compliance rate",
    value: 98.2,
    showValue: true
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    label: "Data ingest",
    value: 64,
    tone: "gold",
    showValue: true
  }), /*#__PURE__*/React.createElement(ProgressBar, {
    indeterminate: true
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Gauge, {
    value: 98.2,
    label: "Compliance",
    size: 130
  }), /*#__PURE__*/React.createElement(Gauge, {
    value: 42,
    max: 60,
    unit: "",
    label: "Pending",
    tone: "gold",
    size: 130
  })), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(Skeleton, {
    variant: "circle",
    width: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 180
    }
  }, /*#__PURE__*/React.createElement(Skeleton, {
    variant: "text",
    lines: 3
  })))))), /*#__PURE__*/React.createElement(Panel, {
    label: "Data visualization \u2014 Line, Bar, Donut"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(LineChart, {
    area: true,
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    series: [{
      name: 'Budgeted',
      color: 'var(--navy-deep)',
      points: [40, 52, 48, 61, 72, 80, 86]
    }, {
      name: 'Actual',
      color: 'var(--caution-gold)',
      points: [30, 44, 40, 55, 60, 72, 78]
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid",
    style: {
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(BarChart, {
    unit: "%",
    data: [{
      label: 'NE',
      value: 85
    }, {
      label: 'Mid-Atl',
      value: 62
    }, {
      label: 'SE',
      value: 94
    }, {
      label: 'West',
      value: 71
    }, {
      label: 'SW',
      value: 58
    }]
  }), /*#__PURE__*/React.createElement(DonutChart, {
    centerLabel: "Total",
    centerValue: "4.2M",
    size: 160,
    data: [{
      label: 'Medicare A/B',
      value: 54
    }, {
      label: 'Medicare Advantage',
      value: 28
    }, {
      label: 'Dual Eligible',
      value: 18
    }]
  }))), /*#__PURE__*/React.createElement(Panel, {
    label: "WebGL \u2014 Globe3D (three.js)",
    style: {
      background: 'var(--navy-deep)'
    }
  }, /*#__PURE__*/React.createElement(Globe3D, {
    height: 260,
    points: 34
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: () => setOpen(false),
    icon: "archive",
    title: "Archive program?",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: () => setOpen(false)
    }, "Archive"))
  }, "This moves ", /*#__PURE__*/React.createElement("b", null, "Medicaid Expansion 2.0"), " to the historical archive. You can restore it at any time."));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(Sheet, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "design-sheet.app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms_gov_public/Home.jsx
try { (() => {
/* CMS.gov public site — homepage sections */
const POPULAR = ['Physician Fee Schedule', 'Local Coverage Determination', 'Medically Unlikely Edits', 'Telehealth', 'Covid-19', 'Agents and Brokers'];
const PRIORITIES = [{
  t: 'Rural Health Transformation Program',
  d: "We're empowering states to improve healthcare and strengthen rural communities.",
  cta: 'Learn more'
}, {
  t: 'Health Technology Ecosystem',
  d: "We're modernizing the nation's digital health ecosystem to empower patients & deliver better outcomes.",
  cta: 'Learn more'
}, {
  t: 'Crushing Fraud, Waste, & Abuse',
  d: "We're combating healthcare fraud, waste, and abuse and protecting Americans in our programs.",
  cta: 'Learn more'
}, {
  t: 'Medicare Drug Price Negotiation',
  d: 'Medicare is negotiating prices directly with participating drug companies to improve access to costly, common drugs.',
  cta: 'Learn more'
}];
const RESOURCES = [{
  icon: 'receipt_long',
  t: 'Medicare fee schedules',
  d: 'Check the fee schedules to find billing codes.',
  links: ['Physician fee schedule lookup tool', 'Physician fee schedule', 'Clinical Laboratory Fee Schedule', 'DME Fee Schedule']
}, {
  icon: 'qr_code_2',
  t: 'Codes for claim reimbursement',
  d: 'Find codes to be reimbursed for clinical services.',
  links: ['Medicare Coverage Database', 'List of CPT/HCPCS codes', 'ICD-10 codes', 'Place of service code set']
}, {
  icon: 'handshake',
  t: 'Marketplace partner resources',
  d: 'Get helpful materials for agents, brokers, and partners.',
  links: ['Marketplace registration and training', 'Resources for Agents and Brokers', 'Agent and Broker FAQs', 'Exchange Coverage Maps']
}, {
  icon: 'description',
  t: 'Manuals, forms, & transmittals',
  d: 'Find current resources to complete your tasks.',
  links: ['CMS Forms list', 'Internet Only Manuals', 'Transmittals', 'Become a provider or supplier']
}];
const ARTICLES = [{
  d: '01',
  m: 'Jun',
  kind: 'Press Releases',
  date: '06/01/2026',
  t: 'CMS Launches Nationwide Framework to Implement Medicaid Work Requirements'
}, {
  d: '01',
  m: 'Jun',
  kind: 'Fact Sheets',
  date: '06/01/2026',
  t: 'Medicaid Community Engagement Requirement Interim Final Rule with Comment Period (CMS-2454-IFC)'
}, {
  d: '28',
  m: 'May',
  kind: 'Fact Sheets',
  date: '05/28/2026',
  t: 'Federal Independent Dispute Resolution Operations Final Rule'
}, {
  d: '28',
  m: 'May',
  kind: 'Press Releases',
  date: '05/28/2026',
  t: 'Federal Rule Takes Aim at Health Care Bureaucracy, Reducing Dispute Fees, and Boosting Transparency'
}];
function Hero({
  onPick,
  picked
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--white)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '56px var(--margin-desktop) 0',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 40,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '800 48px/56px var(--font-sans)',
      letterSpacing: '-0.02em',
      color: 'var(--navy-deep)',
      margin: '0 0 24px'
    }
  }, "What are you looking for today?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      border: '2px solid var(--navy-deep)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Search CMS.gov",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      padding: '14px 16px',
      fontFamily: 'var(--font-sans)',
      fontSize: 17
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      border: 'none',
      background: 'var(--navy-deep)',
      color: '#fff',
      padding: '0 22px',
      cursor: 'pointer',
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: 15,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined"
  }, "search"), "Search")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Popular terms"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      maxWidth: 560
    }
  }, POPULAR.map(p => /*#__PURE__*/React.createElement("a", {
    key: p,
    href: "#",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--sky-tint)',
      color: 'var(--navy-deep)',
      textDecoration: 'none',
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 600
    }
  }, p, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 16
    }
  }, "north_east")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 360,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-dotgrid",
    style: {
      position: 'absolute',
      left: 0,
      top: 30,
      width: 90,
      height: 130,
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "cms-arch",
    style: {
      position: 'absolute',
      bottom: 0,
      width: 300,
      height: 320
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/images/hero-family.png",
    alt: "A mother and daughter embracing and smiling",
    style: {
      position: 'relative',
      zIndex: 2,
      height: 350,
      objectFit: 'contain'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--navy-deep)',
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--margin-desktop)',
      display: 'flex',
      gap: 0,
      overflowX: 'auto'
    }
  }, PRIORITIES.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => onPick(i),
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: '16px 20px',
      whiteSpace: 'nowrap',
      color: picked === i ? 'var(--navy-deep)' : 'var(--on-primary)',
      background: picked === i ? 'var(--caution-gold)' : 'transparent',
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: 700
    }
  }, p.t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--navy-deep)',
      color: '#fff',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '32px var(--margin-desktop) 48px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '700 32px/40px var(--font-sans)',
      margin: '0 0 12px'
    }
  }, PRIORITIES[picked].t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: '28px',
      opacity: 0.85,
      maxWidth: 640,
      margin: '0 0 20px'
    }
  }, PRIORITIES[picked].d), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--caution-gold)',
      color: 'var(--navy-deep)',
      padding: '12px 22px',
      borderRadius: 'var(--radius)',
      textDecoration: 'none',
      fontFamily: 'var(--font-label)',
      fontWeight: 700
    }
  }, PRIORITIES[picked].cta, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 18
    }
  }, "arrow_forward")))));
}
function TopResources() {
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '56px var(--margin-desktop)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '700 32px/40px var(--font-sans)',
      color: 'var(--navy-deep)',
      margin: '0 0 28px'
    }
  }, "Top resources"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--gutter)'
    }
  }, RESOURCES.map((r, i) => {
    const on = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: r.t,
      style: {
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--white)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(on ? -1 : i),
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 'var(--card-padding)',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 48,
        borderRadius: 'var(--radius)',
        background: 'var(--sky-tint)',
        color: 'var(--navy-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-symbols-outlined"
    }, r.icon)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 18px/24px var(--font-sans)',
        color: 'var(--navy-deep)'
      }
    }, r.t), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, r.d)), /*#__PURE__*/React.createElement("span", {
      className: "material-symbols-outlined",
      style: {
        color: 'var(--navy-deep)'
      }
    }, on ? 'remove' : 'add')), on && /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: 'none',
        margin: 0,
        padding: '0 24px 20px 88px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, r.links.map(l => /*#__PURE__*/React.createElement("li", {
      key: l
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      style: {
        color: 'var(--text-link)',
        textDecoration: 'none',
        fontSize: 15,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "material-symbols-outlined",
      style: {
        fontSize: 16,
        color: 'var(--caution-gold)'
      }
    }, "arrow_forward"), l)))));
  })));
}
function Callouts() {
  const items = [{
    icon: 'how_to_reg',
    t: 'Medicaid Eligibility Made Easy',
    d: 'CMS can help your state prepare for the new Community Engagement requirements.',
    tone: 'sky'
  }, {
    icon: 'gavel',
    t: 'Nondiscrimination in health',
    d: 'Recent court decisions stay or enjoin provisions of the 2024 Final Rule implementing Section 1557 of the ACA.',
    tone: 'gold'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-container-low)',
      borderTop: '1px solid var(--border-hairline)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '40px var(--margin-desktop)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--gutter)'
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.t,
    style: {
      display: 'flex',
      gap: 16,
      background: 'var(--white)',
      border: '1px solid var(--border-hairline)',
      borderLeft: `4px solid ${it.tone === 'gold' ? 'var(--caution-gold)' : 'var(--navy-deep)'}`,
      borderRadius: 'var(--radius)',
      padding: 'var(--card-padding)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      color: it.tone === 'gold' ? 'var(--caution-gold)' : 'var(--navy-deep)',
      fontSize: 28
    }
  }, it.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: '700 18px/24px var(--font-sans)',
      color: 'var(--navy-deep)',
      margin: '0 0 4px'
    }
  }, it.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      margin: '0 0 8px',
      lineHeight: '20px'
    }
  }, it.d), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--text-link)',
      fontWeight: 600,
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      textDecoration: 'none'
    }
  }, "Learn more \u2192"))))));
}
function Newsroom() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '56px var(--margin-desktop)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '700 32px/40px var(--font-sans)',
      color: 'var(--navy-deep)',
      margin: 0
    }
  }, "Recent articles"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--text-link)',
      fontWeight: 700,
      fontFamily: 'var(--font-label)',
      textDecoration: 'none'
    }
  }, "Visit the newsroom", /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 18
    }
  }, "arrow_forward"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--gutter)'
    }
  }, ARTICLES.map((a, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      display: 'flex',
      gap: 16,
      padding: 'var(--card-padding)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)',
      textDecoration: 'none',
      background: 'var(--white)',
      transition: 'box-shadow var(--duration) var(--ease-standard)'
    },
    onMouseEnter: e => e.currentTarget.style.boxShadow = 'var(--shadow-raised)',
    onMouseLeave: e => e.currentTarget.style.boxShadow = 'none'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      flexShrink: 0,
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      width: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--navy-deep)',
      color: '#fff',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 700,
      padding: '3px 0'
    }
  }, a.m.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 22px/1 var(--font-sans)',
      color: 'var(--navy-deep)',
      padding: '8px 0'
    }
  }, a.d)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      background: 'var(--sky-tint)',
      color: 'var(--navy-deep)',
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: 'var(--radius)',
      marginBottom: 6
    }
  }, a.kind, " \xB7 ", a.date), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 17px/24px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, a.t))))));
}
function Home() {
  const [picked, setPicked] = React.useState(0);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    picked: picked,
    onPick: setPicked
  }), /*#__PURE__*/React.createElement(TopResources, null), /*#__PURE__*/React.createElement(Callouts, null), /*#__PURE__*/React.createElement(Newsroom, null));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms_gov_public/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms_gov_public/PublicApp.jsx
try { (() => {
/* CMS.gov public site — shell */
function PublicApp() {
  const [active, setActive] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement(window.PublicHeader, {
    active: active,
    setActive: setActive
  }), /*#__PURE__*/React.createElement(window.Home, null), /*#__PURE__*/React.createElement(window.PublicFooter, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(PublicApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms_gov_public/PublicApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms_gov_public/PublicFooter.jsx
try { (() => {
/* CMS.gov public site — footer */
const COLS = [{
  h: 'Medicare',
  links: ['Enrollment & renewal', 'Coverage', 'Coding & billing', 'Payment', 'Quality']
}, {
  h: 'Medicaid/CHIP',
  links: ['What is Medicaid?', 'Medicaid.gov', 'CHIP.gov', 'Community engagement']
}, {
  h: 'Marketplace',
  links: ['About the Marketplace', 'Agents & Brokers', 'Health Plans & Issuers', 'Resources']
}, {
  h: 'About CMS',
  links: ['Newsroom', 'Data & Research', 'Careers', 'Contact us']
}];
function PublicFooter() {
  return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--navy-deep)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '48px var(--margin-desktop)',
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(4, 1fr)',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      background: 'var(--caution-gold)',
      borderRadius: 'var(--radius)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      color: 'var(--navy-deep)'
    }
  }, "health_and_safety")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 20
    }
  }, "CMS.gov"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      opacity: 0.7
    }
  }, "Centers for Medicare & Medicaid Services"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: '20px',
      opacity: 0.75,
      maxWidth: 260,
      margin: '0 0 16px'
    }
  }, "7500 Security Boulevard, Baltimore, MD 21244"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, ['public', 'mail', 'rss_feed'].map(ic => /*#__PURE__*/React.createElement("span", {
    key: ic,
    style: {
      width: 38,
      height: 38,
      border: '1px solid rgba(255,255,255,0.25)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 20
    }
  }, ic))))), COLS.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 12,
      color: 'var(--gold-dim)'
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: '#fff',
      opacity: 0.8,
      textDecoration: 'none',
      fontSize: 14
    }
  }, l)))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-container-highest)',
      borderTop: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--gutter) var(--margin-desktop)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--on-surface)'
    }
  }, "A federal government website managed by CMS. \xA9 2026 Centers for Medicare & Medicaid Services"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, ['Privacy Policy', 'Accessibility', 'FOIA', 'No Fear Act', 'Plain Writing'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--slate-gray)',
      textDecoration: 'none'
    }
  }, l))))));
}
window.PublicFooter = PublicFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms_gov_public/PublicFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/cms_gov_public/PublicHeader.jsx
try { (() => {
/* CMS.gov public site — masthead + utility bar + primary nav */
const MENUS = ['Medicare', 'Medicaid/CHIP', 'Marketplace & Private Insurance', 'Initiatives', 'Training & Education'];
function GovBanner() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-container)',
      borderBottom: '1px solid var(--border-hairline)',
      fontFamily: 'var(--font-label)',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '6px var(--margin-desktop)',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--on-surface-variant)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 11,
      background: 'linear-gradient(var(--navy-deep) 50%, var(--error-red) 50%)',
      display: 'inline-block',
      borderRadius: 1
    }
  }), "An official website of the United States government"));
}
function PublicHeader({
  onSearch,
  active,
  setActive
}) {
  return /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement(GovBanner, null), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--navy-deep)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '6px var(--margin-desktop)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 20,
      fontFamily: 'var(--font-label)',
      fontSize: 13
    }
  }, ['About CMS', 'Newsroom', 'Data & Research'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: 'var(--on-primary)',
      textDecoration: 'none',
      opacity: 0.9
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--white)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '16px var(--margin-desktop)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      background: 'var(--navy-deep)',
      borderRadius: 'var(--radius)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      color: '#fff'
    }
  }, "health_and_safety")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 800,
      fontSize: 22,
      color: 'var(--navy-deep)',
      lineHeight: 1
    }
  }, "CMS.gov"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 11,
      color: 'var(--text-subtle)',
      marginTop: 2
    }
  }, "Centers for Medicare & Medicaid Services"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flex: 1,
      maxWidth: 420,
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      border: '2px solid var(--navy-deep)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Search CMS.gov",
    onKeyDown: e => e.key === 'Enter' && onSearch && onSearch(e.target.value),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      padding: '9px 12px',
      fontFamily: 'var(--font-sans)',
      fontSize: 15
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      border: 'none',
      background: 'var(--navy-deep)',
      color: '#fff',
      padding: '0 16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined"
  }, "search")))))), /*#__PURE__*/React.createElement("nav", {
    style: {
      background: 'var(--white)',
      borderBottom: '1px solid var(--border-hairline)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--margin-desktop)',
      display: 'flex',
      gap: 4
    }
  }, MENUS.map(m => {
    const on = m === active;
    return /*#__PURE__*/React.createElement("button", {
      key: m,
      onClick: () => setActive(on ? null : m),
      style: {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '16px 16px',
        fontFamily: 'var(--font-sans)',
        fontSize: 16,
        fontWeight: 600,
        color: on ? 'var(--navy-deep)' : 'var(--on-surface)',
        borderBottom: on ? '4px solid var(--caution-gold)' : '4px solid transparent',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, m, /*#__PURE__*/React.createElement("span", {
      className: "material-symbols-outlined",
      style: {
        fontSize: 18
      }
    }, on ? 'expand_less' : 'expand_more'));
  })), active && /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-container-low)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--gutter) var(--margin-desktop)',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px 40px'
    }
  }, (window.MEGA_MENU[active] || ['Overview']).map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      color: 'var(--text-link)',
      textDecoration: 'none',
      fontSize: 15,
      padding: '6px 0',
      borderBottom: '1px solid transparent'
    },
    onMouseEnter: e => e.currentTarget.style.textDecoration = 'underline',
    onMouseLeave: e => e.currentTarget.style.textDecoration = 'none'
  }, l))))));
}
window.MEGA_MENU = {
  'Medicare': ['Enrollment & renewal', 'Coverage', 'Regulations & guidance', 'Coding & billing', 'Payment', 'Appeals & grievances', 'Quality', 'Health & safety standards', 'Forms & notices', 'Health & drug plans'],
  'Medicaid/CHIP': ['What is Medicaid?', 'Visit Medicaid.gov', 'Visit CHIP.gov', 'Medicare-Medicaid Coordination', 'Integrated care resources', 'Community engagement support', 'Eligibility made easy (Emmy)', 'Financial alignment initiative'],
  'Marketplace & Private Insurance': ['About the Marketplace', 'Private Health Insurance', 'In-person assisters', 'Agents & Brokers', 'Health Plans & Issuers', 'Employers & sponsors', 'States', 'Resources'],
  'Initiatives': ['Rural Health Transformation Program', 'Health Technology Ecosystem', 'Crushing Fraud, Waste, & Abuse', 'Medicare Drug Price Negotiation', 'Innovation Center', 'Hospital price transparency', 'Maternal Health', 'No Surprise Billing'],
  'Training & Education': ['Medicare Training', 'Partner outreach resources', 'Medicare Learning Network® (MLN)', 'CMS Open Door Forums', 'Look up topics', 'Find your provider type', 'Get training', 'Attend events']
};
window.PublicHeader = PublicHeader;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/cms_gov_public/PublicHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program_portal/App.jsx
try { (() => {
/* CMS Program Portal — interactive shell (login → app, nav, new program) */
const {
  TopNav,
  SideNav,
  Button,
  Avatar,
  Input
} = window;
const NAV = [{
  label: 'Overview',
  icon: 'dashboard'
}, {
  label: 'Program Registry',
  icon: 'folder_managed'
}, {
  label: 'Data Reporting',
  icon: 'analytics'
}, {
  label: 'Policy Library',
  icon: 'policy'
}, {
  label: 'User Management',
  icon: 'group'
}];
const TOP = {
  Overview: 'Dashboard',
  'Program Registry': 'Programs',
  'Data Reporting': 'Analytics',
  'Policy Library': 'Resources'
};
function Login({
  onSignIn
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--navy-deep)',
      color: '#fff',
      padding: 56,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      background: 'var(--caution-gold)',
      borderRadius: 'var(--radius)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      color: 'var(--navy-deep)'
    }
  }, "account_balance")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 20
    }
  }, "CMS Program Portal")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: '700 40px/48px var(--font-sans)',
      letterSpacing: '-0.02em',
      margin: '0 0 16px',
      maxWidth: 460
    }
  }, "Administering the nation's healthcare programs."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: '28px',
      opacity: 0.8,
      maxWidth: 440,
      margin: 0
    }
  }, "Secure access for CMS administrators managing Medicare, Medicaid, and Marketplace programs.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--caution-gold)',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      fontSize: 16
    }
  }, "verified_user"), " FISMA-COMPLIANT \xB7 AUTHORIZED USE ONLY"), /*#__PURE__*/React.createElement("div", {
    className: "cms-dotgrid-gold",
    style: {
      position: 'absolute',
      right: 40,
      top: 120,
      width: 120,
      height: 160,
      opacity: 0.5
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 460,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-eyebrow"
  }, "Sign in"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '700 28px/36px var(--font-sans)',
      color: 'var(--navy-deep)',
      margin: '4px 0 28px'
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSignIn();
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email address",
    type: "email",
    defaultValue: "j.doe@cms.hhs.gov",
    icon: "mail"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    defaultValue: "password",
    icon: "lock"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'var(--font-label)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    defaultChecked: true
  }), " Remember this device"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--navy-deep)',
      fontWeight: 600
    }
  }, "Forgot password?")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    type: "submit",
    fullWidth: true,
    size: "lg",
    iconRight: "arrow_forward"
  }, "Sign in securely")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 24,
      fontSize: 12,
      color: 'var(--text-subtle)',
      lineHeight: '18px'
    }
  }, "This is a U.S. Government system for authorized use only. Activity may be monitored and recorded.")));
}
function ComingSoon({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 0',
      color: 'var(--text-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 56,
      color: 'var(--outline-variant)'
    }
  }, "construction"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: '600 24px/32px var(--font-sans)',
      color: 'var(--navy-deep)',
      margin: '16px 0 4px'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "This module is part of the full portal build."));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-container-highest)',
      borderTop: '1px solid var(--border-hairline)',
      marginTop: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: 'var(--gutter) var(--margin-desktop)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontWeight: 700,
      color: 'var(--navy-deep)',
      fontSize: 14
    }
  }, "CMS Program Portal"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--on-surface)',
      opacity: 0.8
    }
  }, "\xA9 2024 Centers for Medicare & Medicaid Services")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, ['Privacy Policy', 'Accessibility Statement', 'FOIA', 'Contact Us'].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--slate-gray)',
      textDecoration: 'none'
    }
  }, l)))));
}
function App() {
  const [authed, setAuthed] = React.useState(false);
  const [view, setView] = React.useState('Overview');
  const [rows, setRows] = React.useState(window.RegistrySeed);
  if (!authed) return /*#__PURE__*/React.createElement(Login, {
    onSignIn: () => setAuthed(true)
  });
  const newProgram = () => {
    const n = rows.length + 1;
    setRows([{
      name: 'New Initiative ' + n,
      id: 'CMS-NEW-' + String(100 + n),
      status: 'warning',
      date: 'Today',
      contact: 'You',
      tone: 'navy'
    }, ...rows]);
  };
  let content;
  if (view === 'Overview') content = /*#__PURE__*/React.createElement(window.Dashboard, null);else if (view === 'Program Registry') content = /*#__PURE__*/React.createElement(window.Registry, {
    rows: rows,
    onNewProgram: newProgram
  });else if (view === 'Policy Library') content = /*#__PURE__*/React.createElement(window.Library, null);else if (view === 'Data Reporting') content = /*#__PURE__*/React.createElement(window.DataReporting, null);else if (view === 'User Management') content = /*#__PURE__*/React.createElement(window.UserManagement, null);else content = /*#__PURE__*/React.createElement(ComingSoon, {
    title: view
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--surface)'
    }
  }, /*#__PURE__*/React.createElement(TopNav, {
    active: TOP[view] || 'Dashboard',
    onNavigate: () => {},
    user: /*#__PURE__*/React.createElement(Avatar, {
      name: "Jane Doe",
      ring: true
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      maxWidth: 'var(--container-max)',
      width: '100%',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SideNav, {
    items: NAV,
    active: view,
    onNavigate: setView,
    cta: /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      icon: "add_circle",
      fullWidth: true,
      onClick: () => {
        setView('Program Registry');
        newProgram();
      }
    }, "New Report"),
    footerItems: [{
      label: 'Settings',
      icon: 'settings'
    }, {
      label: 'Sign Out',
      icon: 'logout'
    }]
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: 'var(--margin-desktop)'
    }
  }, content)), /*#__PURE__*/React.createElement(Footer, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program_portal/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program_portal/Dashboard.jsx
try { (() => {
/* CMS Program Portal — Overview / Dashboard screen */
const {
  Card,
  StatCard,
  Badge,
  Button,
  Avatar
} = window;
function MiniLineChart() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 230
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: '1px solid var(--outline-variant)',
      opacity: 0.5
    }
  }))), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 800 200",
    preserveAspectRatio: "none",
    style: {
      width: '100%',
      height: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,150 Q100,120 200,140 T400,80 T600,100 T800,40",
    fill: "none",
    stroke: "var(--navy-deep)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,180 Q150,160 300,170 T500,150 T800,120",
    fill: "none",
    stroke: "var(--caution-gold)",
    strokeWidth: "3"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--text-subtle)',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, "January"), /*#__PURE__*/React.createElement("span", null, "February"), /*#__PURE__*/React.createElement("span", null, "March"), /*#__PURE__*/React.createElement("span", null, "April")));
}
const feed = [{
  tone: 'sky',
  icon: 'sync',
  html: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Sarah Jenkins"), " updated the compliance report for ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--navy-deep)'
    }
  }, "North Region Healthcare"), "."),
  time: '2 minutes ago',
  file: 'North_Region_Q1_24.pdf'
}, {
  tone: 'sky',
  icon: 'person_add',
  html: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "New User Registration:"), " Dr. Alan Miller was granted Admin access to the Policy Library."),
  time: '45 minutes ago'
}, {
  tone: 'error',
  icon: 'warning',
  html: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "System Alert:"), " Multiple failed login attempts detected from IP 192.168.1.105."),
  time: '2 hours ago',
  action: 'Review Security Log'
}];
function Dashboard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cms-eyebrow"
  }, "Administration Dashboard"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '4px 0 0',
      font: '700 32px/40px var(--font-sans)',
      color: 'var(--on-surface)'
    }
  }, "System Overview & Metrics")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    icon: "calendar_today"
  }, "Jan 01 \u2013 Mar 31, 2024"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md",
    icon: "file_download"
  }, "Export PDF"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "assignment",
    tone: "info",
    label: "Active Programs",
    value: "1,284",
    trend: /*#__PURE__*/React.createElement(Badge, {
      status: "success",
      icon: "trending_up"
    }, "+4.2%"),
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "material-symbols-outlined",
      style: {
        fontSize: 14
      }
    }, "history"), " Updated 12 mins ago")
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "verified_user",
    tone: "gold",
    label: "Compliance Rate",
    value: "98.2%",
    trend: /*#__PURE__*/React.createElement(Badge, {
      status: "neutral"
    }, "Stable"),
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface-container)',
        height: 6,
        borderRadius: 999,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '98.2%',
        height: '100%',
        background: 'var(--navy-deep)'
      }
    })))
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "pending_actions",
    tone: "error",
    label: "Pending Reports",
    value: "42",
    trend: /*#__PURE__*/React.createElement(Badge, {
      status: "error",
      icon: "priority_high"
    }, "Action Required"),
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, ['JD', 'MK', 'AL'].map((x, i) => /*#__PURE__*/React.createElement("div", {
      key: x,
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '2px solid var(--white)',
        marginLeft: i ? -8 : 0,
        background: ['var(--slate-gray)', 'var(--navy-deep)', 'var(--caution-gold)'][i],
        color: i === 2 ? 'var(--navy-deep)' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 700,
        fontFamily: 'var(--font-label)'
      }
    }, x)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '2px solid var(--white)',
        marginLeft: -8,
        background: 'var(--surface-container-highest)',
        color: 'var(--on-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 700,
        fontFamily: 'var(--font-label)'
      }
    }, "+39"))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "Program Performance Trends"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        fontFamily: 'var(--font-label)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--navy-deep)'
      }
    }), "Healthcare"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--caution-gold)'
      }
    }), "Medicare")))
  }, /*#__PURE__*/React.createElement(MiniLineChart, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      font: '600 18px/24px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, "Quick Actions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, [['post_add', 'Register'], ['search_insights', 'Audit'], ['mail', 'Notify'], ['settings_applications', 'Config']].map(([ic, lb]) => /*#__PURE__*/React.createElement("button", {
    key: lb,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      padding: '16px 8px',
      background: 'var(--surface-container-low)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius)',
      cursor: 'pointer',
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--on-surface)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      color: 'var(--navy-deep)'
    }
  }, ic), lb)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--navy-deep)',
      color: '#fff',
      padding: 'var(--card-padding)',
      borderRadius: 'var(--radius-lg)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: '0 0 8px',
      font: '600 18px/24px var(--font-sans)'
    }
  }, "System Health"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 14,
      opacity: 0.8,
      lineHeight: '20px'
    }
  }, "All protocols are functioning normally within secure parameters."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--caution-gold)',
      fontFamily: 'var(--font-label)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled",
    style: {
      fontSize: 16
    }
  }, "verified"), " SECURE CONNECTED"), /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      position: 'absolute',
      right: -20,
      bottom: -20,
      fontSize: 120,
      opacity: 0.1
    }
  }, "security")))), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    header: "Recent Activity Feed"
  }, /*#__PURE__*/React.createElement("div", null, feed.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 16,
      padding: '16px 24px',
      borderTop: i ? '1px solid var(--border-hairline)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      flexShrink: 0,
      background: f.tone === 'error' ? 'var(--error-container)' : 'var(--sky-tint)',
      color: f.tone === 'error' ? 'var(--error)' : 'var(--navy-deep)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined is-filled"
  }, f.icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 16,
      color: 'var(--on-surface)'
    }
  }, f.html), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--text-subtle)',
      whiteSpace: 'nowrap'
    }
  }, f.time)), f.file && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      color: 'var(--text-muted)',
      background: 'var(--surface-container)',
      padding: '4px 8px',
      borderRadius: 'var(--radius)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 14
    }
  }, "attach_file"), f.file), f.action && /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 8,
      border: 'none',
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--error)',
      textTransform: 'uppercase'
    }
  }, f.action)))))));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program_portal/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program_portal/DataReporting.jsx
try { (() => {
/* CMS Program Portal — Data Reporting & Analytics screen */
const {
  Card,
  Button,
  Badge,
  Gauge,
  LineChart,
  BarChart,
  DonutChart,
  ProgressBar,
  Tabs
} = window;
function DataReporting() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cms-eyebrow",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 14
    }
  }, "analytics"), " National Metrics"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '4px 0 0',
      font: '700 32px/40px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, "Data Reporting & Insights")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: 4,
      background: 'var(--surface-container)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)'
    }
  }, ['Q1 2024', 'YTD', 'Custom'].map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t,
    style: {
      border: 'none',
      cursor: 'pointer',
      padding: '6px 16px',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: 600,
      background: i === 0 ? 'var(--white)' : 'transparent',
      color: i === 0 ? 'var(--navy-deep)' : 'var(--text-muted)',
      boxShadow: i === 0 ? 'var(--shadow-sm)' : 'none'
    }
  }, t))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "file_download"
  }, "Export Data"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--sky-tint)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--card-padding)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: '600 18px/24px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, "Data Health"), /*#__PURE__*/React.createElement(Badge, {
    status: "success"
  }, "EXCELLENT")), /*#__PURE__*/React.createElement(Gauge, {
    value: 98.4,
    label: "Integrity score",
    tone: "navy",
    size: 150
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius)',
      background: 'rgba(253,184,30,0.2)',
      color: 'var(--warning)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined"
  }, "warning")), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      font: '600 18px/24px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, "Pending Reviews")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 48px/1 var(--font-sans)',
      color: 'var(--navy-deep)',
      letterSpacing: '-0.02em'
    }
  }, "12"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--text-subtle)',
      marginTop: 4
    }
  }, "Regions requiring validation"))), /*#__PURE__*/React.createElement(Card, {
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "Spending Trends"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-label)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--text-muted)'
      }
    }, "Fiscal Year 2023\u20132024"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "cms-grid-pattern",
    style: {
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(LineChart, {
    area: true,
    height: 260,
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    series: [{
      name: 'Budgeted',
      color: 'var(--navy-deep)',
      points: [62, 70, 66, 80, 78, 90, 96, 104]
    }, {
      name: 'Actual',
      color: 'var(--caution-gold)',
      points: [50, 60, 58, 70, 72, 80, 88, 95]
    }]
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '7fr 5fr',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    header: "Regional Enrollment"
  }, /*#__PURE__*/React.createElement(BarChart, {
    unit: "% capacity",
    height: 220,
    data: [{
      label: 'Northeast',
      value: 85
    }, {
      label: 'Mid-Atlantic',
      value: 62
    }, {
      label: 'Southeast',
      value: 94
    }, {
      label: 'Midwest',
      value: 73
    }, {
      label: 'West',
      value: 68
    }]
  })), /*#__PURE__*/React.createElement(Card, {
    header: "Demographic Distribution"
  }, /*#__PURE__*/React.createElement(DonutChart, {
    centerLabel: "Total",
    centerValue: "4.2M",
    size: 170,
    data: [{
      label: 'Medicare A/B',
      value: 54
    }, {
      label: 'Medicare Advantage',
      value: 28
    }, {
      label: 'Dual Eligible',
      value: 18
    }]
  }))), /*#__PURE__*/React.createElement(Card, {
    padded: false,
    header: "Regional Compliance Logs"
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-container-low)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, ['REGION', 'REPORTING STATUS', 'ACCURACY', 'LAST UPDATED', 'ACTION'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '14px 24px',
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--text-subtle)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, [['District 01 — Boston', 'complete', '99.8%', '2 hrs ago', 'View File'], ['District 04 — Atlanta', 'review', '94.2%', '14 mins ago', 'Review Now'], ['District 09 — San Francisco', 'complete', '99.1%', '6 hrs ago', 'View File']].map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: i < 2 ? '1px solid var(--border-hairline)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px',
      fontWeight: 700,
      color: 'var(--navy-deep)',
      fontSize: 16
    }
  }, r[0]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px'
    }
  }, r[1] === 'complete' ? /*#__PURE__*/React.createElement(Badge, {
    status: "success",
    icon: "check_circle"
  }, "Complete") : /*#__PURE__*/React.createElement(Badge, {
    status: "warning",
    icon: "pending"
  }, "Review Required")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px',
      color: 'var(--navy-deep)',
      fontFamily: 'var(--font-label)'
    }
  }, r[2]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px',
      color: 'var(--text-subtle)',
      fontFamily: 'var(--font-label)',
      fontSize: 14
    }
  }, r[3]), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--navy-deep)',
      fontWeight: 700,
      fontFamily: 'var(--font-label)',
      fontSize: 13
    }
  }, r[4]))))))));
}
window.DataReporting = DataReporting;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program_portal/DataReporting.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program_portal/Library.jsx
try { (() => {
/* CMS Program Portal — Policy & Resource Library screen */
const {
  Card,
  Button,
  Tag,
  Badge
} = window;
const RESOURCES = [{
  kind: 'pdf',
  icon: 'picture_as_pdf',
  iconBg: 'var(--error-container)',
  iconFg: 'var(--error)',
  title: 'Publication 100-02: Medicare Benefit Policy Manual',
  desc: 'Comprehensive guidance on provider billing, benefit descriptions, and coverage requirements.',
  meta: 'Oct 12, 2024',
  tag: 'Manuals',
  right: ['File Size', '2.4 MB']
}, {
  kind: 'link',
  icon: 'open_in_new',
  iconBg: 'var(--sky-tint-strong)',
  iconFg: 'var(--navy-deep)',
  title: 'HCPCS Quarterly Update Dashboard',
  desc: 'Real-time interactive dashboard for Healthcare Common Procedure Coding System modifications.',
  meta: 'Sep 30, 2024',
  tag: 'Analytics',
  right: ['Status', 'Active']
}, {
  kind: 'tool',
  icon: 'construction',
  iconBg: 'var(--gold-soft)',
  iconFg: 'var(--warning)',
  title: 'Policy Compliance Self-Assessment Tool',
  desc: 'Interactive tool for providers to verify adherence to Section 1862(a)(1)(A).',
  meta: 'Aug 15, 2024',
  tag: 'Compliance',
  right: ['Type', 'Utility']
}];
const CATEGORIES = [['All Resources', 124, true], ['Internet-Only Manuals', 42], ['Transmittals', 31], ['Quality Reporting', 18], ['Archive / Historical', 33]];
function Library() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: '700 32px/40px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, "Policy & Resource Library"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      maxWidth: 560,
      color: 'var(--text-muted)',
      fontSize: 16
    }
  }, "Access current manuals, regulatory transmittals, and operational guidance for all healthcare programs.")), /*#__PURE__*/React.createElement(Badge, {
    status: "info",
    icon: "update"
  }, "Last Updated: Oct 24, 2024")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -64,
      right: -64,
      width: 128,
      height: 128,
      borderRadius: '50%',
      background: 'var(--sky-tint)',
      opacity: 0.5
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 16px',
      font: '600 24px/32px var(--font-sans)',
      color: 'var(--navy-deep)',
      position: 'relative'
    }
  }, "Search Manuals & Guidance"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: 4,
      background: 'var(--surface-container-low)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-lg)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      alignSelf: 'center',
      marginLeft: 12,
      color: 'var(--text-muted)'
    }
  }, "search"), /*#__PURE__*/React.createElement("input", {
    placeholder: "Enter keywords, transmittal numbers, or manual sections\u2026",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      padding: '12px 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 16
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Search")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Popular:"), /*#__PURE__*/React.createElement(Tag, null, "Transmittals"), /*#__PURE__*/React.createElement(Tag, null, "ICD-10 Updates"), /*#__PURE__*/React.createElement(Tag, null, "Provider Manuals"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--navy-deep)',
      color: '#fff',
      padding: 'var(--card-padding)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      color: 'var(--caution-gold)',
      fontSize: 36,
      marginBottom: 12
    }
  }, "bolt"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px',
      font: '600 20px/26px var(--font-sans)'
    }
  }, "Most Accessed"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 16px',
      fontSize: 14,
      opacity: 0.8,
      lineHeight: '20px'
    }
  }, "Frequently viewed regulatory documents this week."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 'auto'
    }
  }, ['Provider Reimbursement Manual', 'State Operations Manual'].map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 'var(--radius)',
      background: 'rgba(255,255,255,0.12)',
      color: 'var(--caution-gold)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontFamily: 'var(--font-label)'
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 14
    }
  }, t)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cms-eyebrow",
    style: {
      padding: '0 8px 10px'
    }
  }, "Categories"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, CATEGORIES.map(([label, count, active]) => /*#__PURE__*/React.createElement("button", {
    key: label,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      cursor: 'pointer',
      textAlign: 'left',
      borderRadius: active ? '0 var(--radius) var(--radius) 0' : 'var(--radius)',
      border: 'none',
      borderLeft: active ? '4px solid var(--navy-deep)' : '4px solid transparent',
      background: active ? 'var(--white)' : 'transparent',
      boxShadow: active ? 'var(--shadow-card)' : 'none',
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: active ? 700 : 500,
      color: active ? 'var(--navy-deep)' : 'var(--text-muted)'
    }
  }, label, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      background: active ? 'var(--sky-tint-strong)' : 'var(--surface-container)',
      borderRadius: 'var(--radius)',
      padding: '1px 7px',
      fontSize: 12
    }
  }, count))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, RESOURCES.map(r => /*#__PURE__*/React.createElement(Card, {
    key: r.title,
    interactive: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: 'var(--radius)',
      background: r.iconBg,
      color: r.iconFg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 30
    }
  }, r.icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h5", {
    style: {
      margin: 0,
      font: '700 18px/24px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, r.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-label)'
    }
  }, r.desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      color: 'var(--text-subtle)',
      textTransform: 'uppercase'
    }
  }, r.right[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      fontFamily: 'var(--font-label)',
      color: r.right[1] === 'Active' ? 'var(--success)' : 'var(--on-surface)'
    }
  }, r.right[1]))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 14,
      paddingTop: 12,
      borderTop: '1px solid var(--surface-container)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      fontFamily: 'var(--font-label)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 14
    }
  }, "calendar_month"), r.meta), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 14
    }
  }, "tag"), r.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, ['download', 'share', 'bookmark'].map(ic => /*#__PURE__*/React.createElement("button", {
    key: ic,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--navy-deep)',
      padding: 4,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 20
    }
  }, ic))))))))))));
}
window.Library = Library;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program_portal/Library.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program_portal/Registry.jsx
try { (() => {
/* CMS Program Portal — Program Registry screen (data table) */
const {
  Card,
  Badge,
  Button,
  Avatar,
  StatCard,
  Tag
} = window;
const SEED = [{
  name: 'Medicare Part B',
  id: 'CMS-MPB-001',
  status: 'active',
  date: 'Oct 24, 2023',
  contact: 'Jane Doe',
  tone: 'navy'
}, {
  name: 'Medicaid Expansion 2.0',
  id: 'CMS-MEX-042',
  status: 'warning',
  date: 'Nov 02, 2023',
  contact: 'Mark Smith',
  tone: 'sky'
}, {
  name: 'Rural Health Clinic Initiative',
  id: 'CMS-RHC-019',
  status: 'active',
  date: 'Sep 30, 2023',
  contact: 'Lena Ortiz',
  tone: 'gold'
}, {
  name: 'Health Technology Ecosystem',
  id: 'CMS-HTE-007',
  status: 'active',
  date: 'Nov 12, 2023',
  contact: 'Paul Reed',
  tone: 'slate'
}, {
  name: 'Drug Price Negotiation',
  id: 'CMS-DPN-031',
  status: 'warning',
  date: 'Nov 18, 2023',
  contact: 'Amy Chen',
  tone: 'navy'
}];
function StatusBadge({
  status
}) {
  if (status === 'active') return /*#__PURE__*/React.createElement(Badge, {
    status: "active",
    dot: true
  }, "Active");
  return /*#__PURE__*/React.createElement(Badge, {
    status: "warning",
    dot: true
  }, "Review Required");
}
function Registry({
  rows,
  onNewProgram
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: '700 32px/40px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, "Program Registry"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      color: 'var(--text-subtle)',
      fontSize: 16
    }
  }, "Manage and track federal healthcare initiatives and Medicare programs.")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "add",
    onClick: onNewProgram
  }, "New Program")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "apps",
    tone: "info",
    label: "Active Programs",
    value: String(rows.filter(r => r.status === 'active').length)
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "update",
    tone: "info",
    label: "Pending Updates",
    value: "18"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "verified_user",
    tone: "gold",
    label: "Review Required",
    value: String(rows.filter(r => r.status === 'warning').length)
  })), /*#__PURE__*/React.createElement(Card, {
    padded: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      padding: 'var(--gutter)',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'var(--surface-bright)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    icon: "filter_list"
  }, "Filters: All Programs"), /*#__PURE__*/React.createElement("button", {
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--navy-deep)'
    }
  }, "Clear All")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "file_download"
  }, "Export CSV"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "archive"
  }, "Bulk Archive"))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-container)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, ['', 'Program Name', 'Status', 'Last Updated', 'Primary Contact', 'Actions'].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      padding: '14px 16px',
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--on-surface)'
    }
  }, i === 0 ? /*#__PURE__*/React.createElement("input", {
    type: "checkbox"
  }) : h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    style: {
      borderBottom: i < rows.length - 1 ? '1px solid var(--border-hairline)' : 'none'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-container-low)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox"
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: 'var(--navy-deep)',
      fontSize: 16
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-subtle)',
      fontFamily: 'var(--font-label)'
    }
  }, "ID: ", r.id)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: r.status
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 16px',
      color: 'var(--text-subtle)',
      fontFamily: 'var(--font-label)',
      fontSize: 14
    }
  }, r.date), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.contact,
    tone: r.tone,
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 14,
      color: 'var(--on-surface)'
    }
  }, r.contact))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, ['edit', 'more_vert'].map(ic => /*#__PURE__*/React.createElement("button", {
    key: ic,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--slate-gray)',
      padding: 4,
      borderRadius: '50%',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 20
    }
  }, ic)))))))))));
}
window.RegistrySeed = SEED;
window.Registry = Registry;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program_portal/Registry.jsx", error: String((e && e.message) || e) }); }

// ui_kits/program_portal/UserManagement.jsx
try { (() => {
/* CMS Program Portal — User Management screen */
const {
  Card,
  Button,
  Badge,
  Avatar,
  Input,
  Select,
  StatCard,
  Tabs,
  Pagination,
  Dialog,
  Tooltip,
  Toast,
  ToastViewport
} = window;
const USERS = [{
  name: 'Jane Doe',
  email: 'j.doe@cms.hhs.gov',
  role: 'Administrator',
  status: 'active',
  last: '2 mins ago',
  tone: 'navy'
}, {
  name: 'Dr. Alan Miller',
  email: 'a.miller@cms.hhs.gov',
  role: 'Policy Editor',
  status: 'active',
  last: '45 mins ago',
  tone: 'gold'
}, {
  name: 'Mark Smith',
  email: 'm.smith@cms.hhs.gov',
  role: 'Analyst',
  status: 'active',
  last: '1 hr ago',
  tone: 'slate'
}, {
  name: 'Lena Ortiz',
  email: 'l.ortiz@cms.hhs.gov',
  role: 'Reviewer',
  status: 'invited',
  last: '—',
  tone: 'sky'
}, {
  name: 'Paul Reed',
  email: 'p.reed@cms.hhs.gov',
  role: 'Analyst',
  status: 'suspended',
  last: '3 days ago',
  tone: 'navy'
}];
function RoleBadge({
  role
}) {
  const map = {
    Administrator: 'info',
    'Policy Editor': 'success',
    Analyst: 'neutral',
    Reviewer: 'neutral'
  };
  return /*#__PURE__*/React.createElement(Badge, {
    status: map[role] || 'neutral'
  }, role);
}
function StatusBadge({
  s
}) {
  if (s === 'active') return /*#__PURE__*/React.createElement(Badge, {
    status: "active",
    dot: true
  }, "Active");
  if (s === 'invited') return /*#__PURE__*/React.createElement(Badge, {
    status: "warning",
    dot: true
  }, "Invited");
  return /*#__PURE__*/React.createElement(Badge, {
    status: "error",
    dot: true
  }, "Suspended");
}
function UserManagement() {
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [tab, setTab] = React.useState('all');
  const invite = () => {
    setOpen(false);
    setToast(true);
    setTimeout(() => setToast(false), 3200);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: '700 32px/40px var(--font-sans)',
      color: 'var(--navy-deep)'
    }
  }, "User Management"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      color: 'var(--text-subtle)',
      fontSize: 16
    }
  }, "Manage portal access, roles, and permissions for CMS staff.")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "person_add",
    onClick: () => setOpen(true)
  }, "Invite User")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "group",
    tone: "info",
    label: "Total Users",
    value: "248"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "verified_user",
    tone: "gold",
    label: "Administrators",
    value: "12"
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "schedule",
    tone: "neutral",
    label: "Pending Invites",
    value: "5"
  })), /*#__PURE__*/React.createElement(Card, {
    padded: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px 0'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      id: 'all',
      label: 'All Users',
      count: 248
    }, {
      id: 'admins',
      label: 'Administrators',
      count: 12
    }, {
      id: 'invited',
      label: 'Invited',
      count: 5
    }, {
      id: 'suspended',
      label: 'Suspended',
      count: 3
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '16px 24px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "Search by name or email\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 200
    }
  }, /*#__PURE__*/React.createElement(Select, null, /*#__PURE__*/React.createElement("option", null, "All roles"), /*#__PURE__*/React.createElement("option", null, "Administrator"), /*#__PURE__*/React.createElement("option", null, "Analyst")))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--surface-container)',
      borderTop: '1px solid var(--border-hairline)',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, ['User', 'Role', 'Status', 'Last Active', ''].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      padding: '12px 24px',
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--on-surface)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, USERS.map((u, i) => /*#__PURE__*/React.createElement("tr", {
    key: u.email,
    style: {
      borderBottom: i < USERS.length - 1 ? '1px solid var(--border-hairline)' : 'none'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-container-low)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: u.name,
    tone: u.tone,
    size: 36
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      color: 'var(--navy-deep)',
      fontSize: 15
    }
  }, u.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-subtle)',
      fontFamily: 'var(--font-label)'
    }
  }, u.email)))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px'
    }
  }, /*#__PURE__*/React.createElement(RoleBadge, {
    role: u.role
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    s: u.status
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px',
      color: 'var(--text-subtle)',
      fontFamily: 'var(--font-label)',
      fontSize: 14
    }
  }, u.last), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Edit roles"
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--slate-gray)',
      padding: 4,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 20
    }
  }, "edit"))), /*#__PURE__*/React.createElement(Tooltip, {
    label: "More"
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--slate-gray)',
      padding: 4,
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "material-symbols-outlined",
    style: {
      fontSize: 20
    }
  }, "more_vert"))))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      borderTop: '1px solid var(--border-hairline)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-label)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, "Showing ", /*#__PURE__*/React.createElement("b", null, "1\u20135"), " of 248 users"), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    pageCount: 50,
    onChange: setPage
  }))), /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: () => setOpen(false),
    icon: "person_add",
    title: "Invite a user",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      icon: "send",
      onClick: invite
    }, "Send invite"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email address",
    type: "email",
    placeholder: "name@cms.hhs.gov",
    required: true
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Role",
    required: true
  }, /*#__PURE__*/React.createElement("option", null, "Analyst"), /*#__PURE__*/React.createElement("option", null, "Reviewer"), /*#__PURE__*/React.createElement("option", null, "Policy Editor"), /*#__PURE__*/React.createElement("option", null, "Administrator")))), toast && /*#__PURE__*/React.createElement(ToastViewport, {
    position: "bottom-right"
  }, /*#__PURE__*/React.createElement(Toast, {
    kind: "success",
    title: "Invitation sent",
    onClose: () => setToast(false)
  }, "The user will receive an email to activate their account.")));
}
window.UserManagement = UserManagement;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/program_portal/UserManagement.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.DonutChart = __ds_scope.DonutChart;

__ds_ns.Globe3D = __ds_scope.Globe3D;

__ds_ns.LineChart = __ds_scope.LineChart;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToastViewport = __ds_scope.ToastViewport;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Gauge = __ds_scope.Gauge;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.SideNav = __ds_scope.SideNav;

__ds_ns.TopNav = __ds_scope.TopNav;

})();
