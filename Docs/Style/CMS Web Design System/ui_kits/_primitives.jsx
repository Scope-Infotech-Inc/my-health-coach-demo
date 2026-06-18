/* AUTO-BUILT from components/* — do not edit by hand. */

/* ===== core/Alert.jsx ===== */
/**
 * CMS Alert / callout — color + icon banner for system messages.
 * Left accent rule + tinted background; navy text for AA contrast.
 */
function Alert({ kind = 'info', title, icon, onClose, children, style = {}, ...rest }) {
  const kinds = {
    info: { bg: 'var(--sky-tint)', rule: 'var(--navy-deep)', fg: 'var(--navy-deep)', icon: icon || 'info' },
    success: { bg: 'var(--success-container)', rule: 'var(--success)', fg: 'var(--on-success-container)', icon: icon || 'check_circle' },
    warning: { bg: 'rgba(253,184,30,0.18)', rule: 'var(--caution-gold)', fg: 'var(--warning)', icon: icon || 'warning' },
    error: { bg: 'var(--error-container)', rule: 'var(--error-red)', fg: 'var(--on-error-container)', icon: icon || 'report' },
  };
  const k = kinds[kind] || kinds.info;

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        gap: 12,
        background: k.bg,
        borderLeft: `4px solid ${k.rule}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        ...style,
      }}
      {...rest}
    >
      <span className="material-symbols-outlined is-filled" style={{ fontSize: 22, color: k.rule, flexShrink: 0 }}>{k.icon}</span>
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: k.fg, marginBottom: children ? 4 : 0 }}>
            {title}
          </div>
        )}
        {children && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: '20px', color: 'var(--on-surface-variant)' }}>
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: k.fg, padding: 0, height: 22 }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        </button>
      )}
    </div>
  );
}

/* ===== core/Avatar.jsx ===== */
/**
 * CMS Avatar — initials on a brand-tinted disc, or an image. Optional ring.
 */
function Avatar({ name = '', src, size = 32, tone = 'navy', ring = false, style = {}, ...rest }) {
  const tones = {
    navy: { bg: 'var(--navy-deep)', fg: '#fff' },
    gold: { bg: 'var(--caution-gold)', fg: 'var(--navy-deep)' },
    sky: { bg: 'var(--sky-tint-strong)', fg: 'var(--navy-deep)' },
    slate: { bg: 'var(--slate-gray)', fg: '#fff' },
  };
  const t = tones[tone] || tones.navy;
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const common = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    border: ring ? '2px solid var(--caution-gold)' : 'none',
    ...style,
  };

  if (src) {
    return <img src={src} alt={name} style={{ ...common, objectFit: 'cover' }} {...rest} />;
  }
  return (
    <div
      style={{
        ...common,
        background: t.bg,
        color: t.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-label)',
        fontWeight: 700,
        fontSize: Math.round(size * 0.4),
      }}
      {...rest}
    >
      {initials}
    </div>
  );
}

/* ===== core/Badge.jsx ===== */
/**
 * CMS status Badge — pill with optional dot/icon. Color encodes status,
 * always paired with text (and optionally an icon) for accessibility.
 */
function Badge({ status = 'info', icon, dot = false, children, style = {}, ...rest }) {
  const palettes = {
    info: { bg: 'var(--sky-tint)', fg: 'var(--navy-deep)', dot: 'var(--navy-deep)' },
    success: { bg: 'var(--success-container)', fg: 'var(--on-success-container)', dot: 'var(--success)' },
    active: { bg: 'var(--sky-tint)', fg: 'var(--navy-deep)', dot: 'var(--navy-deep)' },
    warning: { bg: 'rgba(253,184,30,0.2)', fg: 'var(--warning)', dot: 'var(--caution-gold)' },
    error: { bg: 'var(--error-container)', fg: 'var(--on-error-container)', dot: 'var(--error)' },
    neutral: { bg: 'var(--surface-container)', fg: 'var(--on-surface-variant)', dot: 'var(--slate-gray)' },
  };
  const p = palettes[status] || palettes.info;

  return (
    <span
      style={{
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
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.dot }} />}
      {icon && <span className="material-symbols-outlined is-filled" style={{ fontSize: 14 }}>{icon}</span>}
      {children}
    </span>
  );
}

/* ===== core/Button.jsx ===== */
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
    sm: { padding: '6px 12px', fontSize: 13, height: 32, gap: 6, icon: 16 },
    md: { padding: '10px 18px', fontSize: 14, height: 42, gap: 8, icon: 18 },
    lg: { padding: '14px 24px', fontSize: 16, height: 52, gap: 8, icon: 20 },
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
    whiteSpace: 'nowrap',
  };

  const variants = {
    primary: { background: 'var(--action-primary)', color: 'var(--on-primary)' },
    secondary: {
      background: 'transparent',
      color: 'var(--navy-deep)',
      border: '2px solid var(--navy-deep)',
    },
    accent: { background: 'var(--caution-gold)', color: 'var(--navy-deep)' },
    ghost: { background: 'transparent', color: 'var(--navy-deep)' },
    danger: { background: 'var(--error-red)', color: '#fff' },
  };

  const v = variants[variant] || variants.primary;

  const onDown = (e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; };
  const onUp = (e) => { e.currentTarget.style.transform = 'scale(1)'; };
  const onEnter = (e) => {
    if (disabled) return;
    if (variant === 'primary') e.currentTarget.style.background = 'var(--action-primary-hover)';
    else if (variant === 'accent') e.currentTarget.style.filter = 'brightness(0.95)';
    else if (variant === 'secondary' || variant === 'ghost') e.currentTarget.style.background = 'var(--sky-tint)';
    else if (variant === 'danger') e.currentTarget.style.filter = 'brightness(0.92)';
  };
  const onLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.filter = 'none';
    e.currentTarget.style.background = v.background;
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={{ ...base, ...v, ...style }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      {...rest}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: s.icon }}>{icon}</span>}
      {children}
      {iconRight && <span className="material-symbols-outlined" style={{ fontSize: s.icon }}>{iconRight}</span>}
    </button>
  );
}

/* ===== core/Card.jsx ===== */
/**
 * CMS Card — flat surface, 1px hairline border, soft 8px radius.
 * Optional Sky-Tint header strip. Lifts subtly on hover when interactive.
 */
function Card({ interactive = false, header, footer, padded = true, children, style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'box-shadow var(--duration) var(--ease-standard), transform var(--duration) var(--ease-standard), border-color var(--duration) var(--ease-standard)',
        boxShadow: hover ? 'var(--shadow-raised)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        borderColor: hover ? 'var(--navy-deep)' : 'var(--border-hairline)',
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      {...rest}
    >
      {header && (
        <div
          style={{
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
            gap: 12,
          }}
        >
          {header}
        </div>
      )}
      <div style={{ padding: padded ? 'var(--card-padding)' : 0 }}>{children}</div>
      {footer && (
        <div style={{ borderTop: '1px solid var(--border-hairline)', padding: '14px 24px' }}>{footer}</div>
      )}
    </div>
  );
}

/* ===== core/Input.jsx ===== */
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--on-surface)',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--error-red)', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--white)',
          border: `${focus || error ? 2 : 1}px solid ${borderColor}`,
          borderRadius: 'var(--radius)',
          padding: focus || error ? '9px 11px' : '10px 12px',
          transition: 'border-color var(--duration-fast) var(--ease-standard)',
        }}
      >
        {icon && <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--text-subtle)' }}>{icon}</span>}
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--on-surface)',
            minWidth: 0,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: 12,
            fontWeight: 500,
            color: error ? 'var(--error-red)' : 'var(--text-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {error && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span>}
          {error || hint}
        </span>
      )}
    </div>
  );
}

/* ===== core/Select.jsx ===== */
/**
 * CMS Select — labeled native select styled to match Input.
 */
function Select({ label, hint, required = false, id, children, style = {}, ...rest }) {
  const selId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label
          htmlFor={selId}
          style={{ fontFamily: 'var(--font-label)', fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--error-red)', marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={selId}
          style={{
            appearance: 'none',
            width: '100%',
            background: 'var(--white)',
            border: '1px solid var(--border-input)',
            borderRadius: 'var(--radius)',
            padding: '10px 40px 10px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            color: 'var(--on-surface)',
            cursor: 'pointer',
          }}
          {...rest}
        >
          {children}
        </select>
        <span
          className="material-symbols-outlined"
          style={{ position: 'absolute', right: 10, pointerEvents: 'none', color: 'var(--text-subtle)', fontSize: 22 }}
        >
          expand_more
        </span>
      </div>
      {hint && (
        <span style={{ fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 500, color: 'var(--text-subtle)' }}>{hint}</span>
      )}
    </div>
  );
}

/* ===== core/StatCard.jsx ===== */
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
    info: { chipBg: 'var(--sky-tint)', chipFg: 'var(--navy-deep)' },
    gold: { chipBg: 'rgba(253,184,30,0.15)', chipFg: 'var(--caution-gold)' },
    error: { chipBg: 'var(--error-container)', chipFg: 'var(--error)' },
    neutral: { chipBg: 'var(--surface-container)', chipFg: 'var(--slate-gray)' },
  };
  const t = tones[tone] || tones.info;

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--card-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius)',
            background: t.chipBg,
            color: t.chipFg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="material-symbols-outlined is-filled" style={{ fontSize: 24 }}>{icon}</span>
        </div>
        {trend}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-label)',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--text-muted)',
          marginTop: 16,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--display-lg-size)',
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text-heading)',
          marginTop: 4,
        }}
      >
        {value}
      </div>
      {footer && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid var(--border-hairline)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-label)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-subtle)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

/* ===== core/Tag.jsx ===== */
/**
 * CMS Tag — neutral category/filter chip. Outlined by default; selectable.
 */
function Tag({ selected = false, icon, onRemove, children, style = {}, ...rest }) {
  return (
    <span
      style={{
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
        ...style,
      }}
      {...rest}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{icon}</span>}
      {children}
      {onRemove && (
        <span
          className="material-symbols-outlined"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{ fontSize: 14, cursor: 'pointer', marginLeft: 2 }}
        >
          close
        </span>
      )}
    </span>
  );
}

/* ===== navigation/SideNav.jsx ===== */
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
  style = {},
}) {
  const Item = ({ it }) => {
    const on = it.label === active;
    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(it.label); }}
        style={{
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
          transition: 'background var(--duration-fast) var(--ease-standard)',
        }}
        onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-container-highest)'; }}
        onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
      >
        <span className={'material-symbols-outlined' + (on ? ' is-filled' : '')}>{it.icon}</span>
        {it.label}
      </a>
    );
  };

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        flexShrink: 0,
        background: 'var(--surface-container-low)',
        borderRight: '1px solid var(--border-hairline)',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      <div style={{ padding: 'var(--gutter)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, background: 'var(--navy-deep)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined is-filled" style={{ color: '#fff' }}>account_balance</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--navy-deep)', lineHeight: 1.1 }}>{brand}</div>
            <div style={{ fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)' }}>{brandSub}</div>
          </div>
        </div>
        {cta && <div style={{ marginBottom: 24 }}>{cta}</div>}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((it) => <Item key={it.label} it={it} />)}
        </nav>
      </div>
      {footerItems.length > 0 && (
        <div style={{ marginTop: 'auto', padding: 'var(--gutter)', borderTop: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {footerItems.map((it) => <Item key={it.label} it={it} />)}
        </div>
      )}
    </aside>
  );
}

/* ===== navigation/TopNav.jsx ===== */
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
  style = {},
}) {
  return (
    <header
      style={{
        background: 'var(--navy-deep)',
        borderBottom: '2px solid var(--caution-gold)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          height: 'var(--topbar-height)',
          padding: '0 var(--margin-desktop)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: 'var(--on-primary)' }}>
            {brand}
          </span>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4, height: 'var(--topbar-height)' }}>
            {items.map((it) => {
              const on = it === active;
              return (
                <a
                  key={it}
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(it); }}
                  style={{
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
                    transition: 'color var(--duration-fast) var(--ease-standard)',
                  }}
                >
                  {it}
                </a>
              );
            })}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--navy-deep)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 'var(--radius)',
              padding: '7px 12px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--on-primary-container)' }}>search</span>
            <input
              placeholder={searchPlaceholder}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--on-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                width: 180,
              }}
            />
          </div>
          {['notifications', 'help'].map((ic) => (
            <button
              key={ic}
              style={{ border: 'none', background: 'transparent', color: 'var(--on-primary)', cursor: 'pointer', padding: 6, display: 'flex', borderRadius: '50%' }}
            >
              <span className="material-symbols-outlined">{ic}</span>
            </button>
          ))}
          {user}
        </div>
      </div>
    </header>
  );
}

/* ===== feedback/Dialog.jsx ===== */
/**
 * CMS Dialog / Modal — centered panel over a navy-tinted scrim. Soft 8px
 * radius, overlay shadow, optional title + footer actions. Esc / scrim closes.
 */
function Dialog({ open, onClose, title, icon, footer, width = 520, children }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(17,46,81,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, animation: 'cmsFade var(--duration) var(--ease-out)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: width,
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-overlay)',
          overflow: 'hidden',
          animation: 'cmsPop var(--duration) var(--ease-out)',
        }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid var(--border-hairline)' }}>
            {icon && (
              <span style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--sky-tint)', color: 'var(--navy-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined is-filled" style={{ fontSize: 20 }}>{icon}</span>
              </span>
            )}
            <h2 style={{ flex: 1, margin: 0, font: '600 20px/26px var(--font-sans)', color: 'var(--navy-deep)' }}>{title}</h2>
            <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div style={{ padding: 24, fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: '24px', color: 'var(--text-body)' }}>{children}</div>
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-container-low)' }}>{footer}</div>
        )}
      </div>
      <style>{'@keyframes cmsFade{from{opacity:0}to{opacity:1}}@keyframes cmsPop{from{opacity:0;transform:translateY(8px) scale(0.98)}to{opacity:1;transform:none}}'}</style>
    </div>
  );
}

/* ===== feedback/Pagination.jsx ===== */
/**
 * CMS Pagination — prev/next chevrons + numbered pages with navy active page,
 * truncated with ellipses. Matches the resource-library pager.
 */
function Pagination({ page = 1, pageCount = 1, onChange, siblings = 1 }) {
  const go = (p) => { if (p >= 1 && p <= pageCount && p !== page) onChange && onChange(p); };

  const pages = [];
  const push = (p) => pages.push(p);
  const range = (a, b) => { for (let i = a; i <= b; i++) push(i); };
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
    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-label)',
    fontSize: 14, fontWeight: 600, border: '1px solid var(--border-hairline)',
    background: 'var(--white)', color: 'var(--on-surface)',
  };

  const arrow = (dir, disabled) => (
    <button onClick={() => go(dir === 'prev' ? page - 1 : page + 1)} disabled={disabled}
      style={{ ...cell, opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer', color: 'var(--navy-deep)' }}>
      <span className="material-symbols-outlined">{dir === 'prev' ? 'chevron_left' : 'chevron_right'}</span>
    </button>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {arrow('prev', page === 1)}
      {pages.map((p, i) =>
        typeof p === 'string'
          ? <span key={p + i} style={{ padding: '0 4px', color: 'var(--text-subtle)' }}>…</span>
          : (
            <button key={p} onClick={() => go(p)}
              style={{ ...cell, ...(p === page ? { background: 'var(--navy-deep)', color: '#fff', borderColor: 'var(--navy-deep)', fontWeight: 700 } : {}) }}>
              {p}
            </button>
          )
      )}
      {arrow('next', page === pageCount)}
    </div>
  );
}

/* ===== feedback/Tabs.jsx ===== */
/**
 * CMS Tabs — underlined tab strip with a gold active rule, matching the
 * portal/public nav vocabulary. Controlled or uncontrolled.
 */
function Tabs({ tabs = [], value, defaultValue, onChange, children }) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].id));
  const active = value !== undefined ? value : internal;
  const set = (id) => { if (value === undefined) setInternal(id); onChange && onChange(id); };

  return (
    <div>
      <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-hairline)' }}>
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => set(t.id)}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                padding: '12px 16px', marginBottom: -1,
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-label)', fontSize: 14,
                fontWeight: on ? 700 : 500,
                color: on ? 'var(--navy-deep)' : 'var(--text-muted)',
                borderBottom: on ? '3px solid var(--caution-gold)' : '3px solid transparent',
                transition: 'color var(--duration-fast) var(--ease-standard)',
              }}
            >
              {t.icon && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{t.icon}</span>}
              {t.label}
              {t.count != null && (
                <span style={{ background: on ? 'var(--sky-tint-strong)' : 'var(--surface-container)', borderRadius: 'var(--radius)', padding: '0 7px', fontSize: 12 }}>{t.count}</span>
              )}
            </button>
          );
        })}
      </div>
      {children && <div style={{ paddingTop: 20 }}>{typeof children === 'function' ? children(active) : children}</div>}
    </div>
  );
}

/* ===== feedback/Toast.jsx ===== */
/**
 * CMS Toast — transient notification card. Status accent rule + icon, title,
 * optional body, auto-dismiss. Pair with <ToastViewport> for stacking.
 */
function Toast({ kind = 'info', title, icon, onClose, children }) {
  const k = {
    info: { rule: 'var(--navy-deep)', icon: icon || 'info' },
    success: { rule: 'var(--success)', icon: icon || 'check_circle' },
    warning: { rule: 'var(--caution-gold)', icon: icon || 'warning' },
    error: { rule: 'var(--error-red)', icon: icon || 'report' },
  }[kind];

  return (
    <div
      role="status"
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start',
        width: 360, maxWidth: '90vw',
        background: 'var(--surface-card)',
        borderLeft: `4px solid ${k.rule}`,
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-overlay)',
        padding: '14px 16px',
        animation: 'cmsToastIn var(--duration) var(--ease-out)',
      }}
    >
      <span className="material-symbols-outlined is-filled" style={{ color: k.rule, fontSize: 22, flexShrink: 0 }}>{k.icon}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ font: '700 15px/20px var(--font-sans)', color: 'var(--navy-deep)', marginBottom: children ? 2 : 0 }}>{title}</div>}
        {children && <div style={{ fontSize: 14, lineHeight: '20px', color: 'var(--text-muted)' }}>{children}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', padding: 2 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>
      )}
      <style>{'@keyframes cmsToastIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}'}</style>
    </div>
  );
}

/** Fixed bottom-right stack container for Toasts. */
function ToastViewport({ position = 'bottom-right', children }) {
  const pos = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
    'top-right': { top: 24, right: 24 },
  }[position];
  return (
    <div style={{ position: 'fixed', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: 12, ...pos }}>
      {children}
    </div>
  );
}

/* ===== feedback/Tooltip.jsx ===== */
/**
 * CMS Tooltip — navy bubble on hover/focus. Wraps any trigger element.
 */
function Tooltip({ label, side = 'top', children }) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  }[side];

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', ...pos, zIndex: 1200, whiteSpace: 'nowrap',
            background: 'var(--navy-900)', color: '#fff',
            fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 600,
            padding: '6px 10px', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-atmospheric)', pointerEvents: 'none',
            animation: 'cmsTip 120ms var(--ease-out)',
          }}
        >
          {label}
        </span>
      )}
      <style>{'@keyframes cmsTip{from{opacity:0}to{opacity:1}}'}</style>
    </span>
  );
}

/* ===== indicators/Gauge.jsx ===== */
/**
 * CMS Gauge — radial arc meter (270° sweep). Animated arc fill + value
 * count-up on mount. Navy track, configurable accent. Reduced-motion safe.
 */
function Gauge({ value = 0, max = 100, size = 160, label, unit = '%', tone = 'navy', thickness = 12 }) {
  const accent = { navy: 'var(--navy-deep)', gold: 'var(--caution-gold)', success: 'var(--success)' }[tone] || 'var(--navy-deep)';
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const sweep = 270;             // degrees of visible arc
  const circ = 2 * Math.PI * r;
  const arcLen = (sweep / 360) * circ;
  const pct = Math.max(0, Math.min(1, value / max));

  const [disp, setDisp] = React.useState(value);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setDisp(value); return; }
    let raf, start;
    const dur = 900;
    const step = (t) => {
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

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: `rotate(${rot}deg)` }}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--surface-container-highest)" strokeWidth={thickness}
            strokeDasharray={`${arcLen} ${circ}`} strokeLinecap="round" />
          <circle cx={cx} cy={cx} r={r} fill="none" stroke={accent} strokeWidth={thickness}
            strokeDasharray={`${arcLen * dispPct} ${circ}`} strokeLinecap="round"
            style={{ transition: 'none' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ font: '700 ' + Math.round(size * 0.2) + 'px/1 var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--navy-deep)' }}>
            {Number.isInteger(value) ? Math.round(disp) : disp.toFixed(1)}<span style={{ fontSize: '0.5em', color: 'var(--text-muted)' }}>{unit}</span>
          </span>
        </div>
      </div>
      {label && <span style={{ fontFamily: 'var(--font-label)', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>}
    </div>
  );
}

/* ===== indicators/ProgressBar.jsx ===== */
/**
 * CMS ProgressBar — determinate (animated fill to value) or indeterminate
 * (sliding sweep). Optional label + value readout. Reduced-motion safe.
 */
function ProgressBar({ value = 0, max = 100, label, showValue = false, indeterminate = false, tone = 'navy', height = 8 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = { navy: 'var(--navy-deep)', gold: 'var(--caution-gold)', success: 'var(--success)' }[tone] || 'var(--navy-deep)';
  const [w, setW] = React.useState(0);
  React.useEffect(() => { const t = setTimeout(() => setW(pct), 60); return () => clearTimeout(t); }, [pct]);

  return (
    <div>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: 'var(--font-label)', fontSize: 13 }}>
          {label && <span style={{ color: 'var(--text-body)', fontWeight: 600 }}>{label}</span>}
          {showValue && !indeterminate && <span style={{ color: 'var(--text-subtle)', fontWeight: 700 }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ width: '100%', height, background: 'var(--surface-container)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', position: 'relative' }}>
        {indeterminate ? (
          <div style={{ position: 'absolute', height: '100%', width: '40%', background: fill, borderRadius: 'var(--radius-pill)', animation: 'cmsIndet 1.3s var(--ease-standard) infinite' }} />
        ) : (
          <div style={{ height: '100%', width: w + '%', background: fill, borderRadius: 'var(--radius-pill)', transition: 'width 0.7s var(--ease-out)' }} />
        )}
      </div>
      <style>{`
        @keyframes cmsIndet{0%{left:-40%}100%{left:100%}}
        @media (prefers-reduced-motion: reduce){div[style*="cmsIndet"]{animation:none;left:0;width:100%}}
      `}</style>
    </div>
  );
}

/* ===== indicators/Skeleton.jsx ===== */
/**
 * CMS Skeleton — shimmer loading placeholder. Use `text`, `block`, or `circle`
 * variants while content loads. Reduced-motion safe (static fill).
 */
function Skeleton({ variant = 'text', width, height, lines = 1, radius }) {
  const base = {
    background: 'linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 37%, var(--surface-container) 63%)',
    backgroundSize: '400% 100%',
    animation: 'cmsShimmer 1.4s ease infinite',
    borderRadius: radius != null ? radius : 'var(--radius)',
  };
  const css = (
    <style>{`
      @keyframes cmsShimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
      @media (prefers-reduced-motion: reduce){.cms-skel{animation:none !important}}
    `}</style>
  );

  if (variant === 'circle') {
    const d = width || height || 40;
    return <span className="cms-skel" style={{ ...base, display: 'inline-block', width: d, height: d, borderRadius: '50%' }}>{css}</span>;
  }
  if (variant === 'block') {
    return <span className="cms-skel" style={{ ...base, display: 'block', width: width || '100%', height: height || 120, borderRadius: radius != null ? radius : 'var(--radius-lg)' }}>{css}</span>;
  }
  // text — N lines
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} className="cms-skel" style={{ ...base, display: 'block', height: height || 12, width: i === lines - 1 && lines > 1 ? '70%' : (width || '100%') }} />
      ))}
      {css}
    </span>
  );
}

/* ===== indicators/Spinner.jsx ===== */
/**
 * CMS Spinner — ring loader. Navy track with a gold sweep, CSS-animated.
 * Respects prefers-reduced-motion (falls back to a static dashed ring).
 */
function Spinner({ size = 28, thickness = 3, label, color = 'var(--navy-deep)', track = 'var(--surface-container-highest)' }) {
  const id = React.useId ? React.useId() : 'sp';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span
        role="status"
        aria-label={label || 'Loading'}
        style={{
          width: size, height: size, display: 'inline-block', borderRadius: '50%',
          border: `${thickness}px solid ${track}`,
          borderTopColor: color, borderRightColor: color,
          animation: 'cmsSpin 0.8s linear infinite',
        }}
      />
      {label && <span style={{ fontFamily: 'var(--font-label)', fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>}
      <style>{`
        @keyframes cmsSpin{to{transform:rotate(360deg)}}
        @media (prefers-reduced-motion: reduce){[role=status]{animation:none !important;border-style:dashed}}
      `}</style>
    </span>
  );
}

/* ===== dataviz/BarChart.jsx ===== */
/**
 * CMS BarChart — vertical bars that grow from the baseline on mount. Single or
 * grouped series, value labels, gridlines. Pure CSS animation, reduced-motion safe.
 */
function BarChart({ data = [], series, height = 240, max, unit = '', tone }) {
  // data: [{ label, value }] OR [{ label, values:[..] }] with `series` meta
  const grouped = !!series;
  const palette = ['var(--navy-deep)', 'var(--caution-gold)', 'var(--sky-tint-strong)'];
  const allVals = grouped ? data.flatMap((d) => d.values) : data.map((d) => d.value);
  const hi = max != null ? max : Math.max(1, ...allVals) * 1.1;
  const single = tone === 'gold' ? 'var(--caution-gold)' : 'var(--navy-deep)';

  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setShown(true); return; }
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div style={{ position: 'relative', height, display: 'flex', alignItems: 'flex-end', gap: 0, justifyContent: 'space-around', borderBottom: '1px solid var(--outline)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ borderTop: '1px solid var(--outline-variant)', opacity: 0.5 }} />)}
        </div>
        {data.map((d, di) => (
          <div key={di} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: '100%', width: '100%', justifyContent: 'center' }}>
              {(grouped ? d.values : [d.value]).map((v, vi) => (
                <div key={vi} title={`${v}${unit}`}
                  style={{
                    width: grouped ? `${50 / d.values.length}%` : '46%',
                    maxWidth: 44,
                    height: `${(v / hi) * 100}%`,
                    background: grouped ? palette[vi % palette.length] : single,
                    borderRadius: 'var(--radius) var(--radius) 0 0',
                    transformOrigin: 'bottom',
                    transform: shown ? 'scaleY(1)' : 'scaleY(0)',
                    transition: `transform 0.7s var(--ease-out) ${di * 0.06 + vi * 0.05}s`,
                  }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
        {data.map((d, i) => (
          <span key={i} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-label)', fontSize: 11, color: 'var(--text-subtle)' }}>{d.label}</span>
        ))}
      </div>
      {grouped && (
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
          {series.map((s, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: palette[i % palette.length] }} />{s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== dataviz/DonutChart.jsx ===== */
/**
 * CMS DonutChart — segmented ring with animated sweep on mount, center total,
 * and a legend with values. Pure SVG/CSS, reduced-motion safe.
 */
function DonutChart({ data = [], size = 200, thickness = 22, centerLabel, centerValue, legend = true }) {
  const palette = ['var(--navy-deep)', 'var(--caution-gold)', 'var(--sky-tint-strong)', 'var(--slate-gray)'];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const segs = data.map((d, i) => {
    const frac = d.value / total;
    const seg = { color: d.color || palette[i % palette.length], len: frac * circ, dash: offset, pct: Math.round(frac * 100), label: d.label, value: d.value };
    offset += frac * circ;
    return seg;
  });

  const shown = true;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={c} cy={c} r={r} fill="none" stroke="var(--surface-container)" strokeWidth={thickness} />
          {segs.map((s, i) => (
            <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
              strokeDasharray={`${shown ? s.len : 0} ${circ}`} strokeDashoffset={-s.dash}
              style={{ transition: `stroke-dasharray 0.9s var(--ease-out) ${i * 0.12}s` }} />
          ))}
        </svg>
        {(centerLabel || centerValue) && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {centerLabel && <span style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-subtle)' }}>{centerLabel}</span>}
            {centerValue && <span style={{ font: '700 28px/1 var(--font-sans)', color: 'var(--navy-deep)', letterSpacing: '-0.02em' }}>{centerValue}</span>}
          </div>
        )}
      </div>
      {legend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
          {segs.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 12px', background: 'var(--surface-container-low)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-label)', fontSize: 13 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />{s.label}
              </span>
              <span style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: 13, color: 'var(--navy-deep)' }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== dataviz/Globe3D.jsx ===== */
/**
 * CMS Globe3D — a WebGL (three.js) rotating wireframe globe with glowing data
 * points, for "national reach" hero/dashboard moments. Loads three.js from CDN
 * on demand. Navy globe, gold data points. Reduced-motion → slow/no spin.
 */
function Globe3D({ height = 320, points = 28, spin = true, accent = '#FDB81E', globeColor = '#2e486c' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let renderer, frame, disposed = false;
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

    loadThree().then((THREE) => {
      if (disposed) return;
      const W = mount.clientWidth, H = height;
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      cam.position.z = 3.2;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      // wireframe globe
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 28, 20),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(globeColor), wireframe: true, transparent: true, opacity: 0.55 })
      );
      group.add(sphere);
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.985, 36, 28),
        new THREE.MeshBasicMaterial({ color: new THREE.Color('#0a2342'), transparent: true, opacity: 0.85 })
      );
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
      const ptsMat = new THREE.PointsMaterial({ color: new THREE.Color(accent), size: 0.08, sizeAttenuation: true });
      group.add(new THREE.Points(ptsGeo, ptsMat));

      group.rotation.x = 0.35;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const speed = reduce ? 0 : (spin ? 0.0035 : 0);

      const animate = () => {
        group.rotation.y += speed;
        renderer.render(scene, cam);
        frame = requestAnimationFrame(animate);
      };
      animate();

      const onResize = () => {
        if (!mount) return;
        const nw = mount.clientWidth;
        cam.aspect = nw / height; cam.updateProjectionMatrix();
        renderer.setSize(nw, height);
      };
      window.addEventListener('resize', onResize);
      mount._cleanup = () => { window.removeEventListener('resize', onResize); };
    }).catch(() => {
      if (mount) mount.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--text-subtle);font-family:var(--font-label);font-size:13px">WebGL globe unavailable</div>';
    });

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      if (mount && mount._cleanup) mount._cleanup();
      if (renderer) { renderer.dispose && renderer.dispose(); if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
    };
  }, [height, points, spin, accent, globeColor]);

  return <div ref={ref} style={{ width: '100%', height }} aria-label="Rotating globe of national data points" />;
}

/* ===== dataviz/LineChart.jsx ===== */
/**
 * CMS LineChart — multi-series SVG line chart with an animated draw-in
 * (stroke-dashoffset), horizontal gridlines, x-axis labels, and a legend.
 * Pure SVG/CSS, no deps. Reduced-motion safe.
 */
function LineChart({
  series = [],            // [{ name, color, points:[n,…] }]
  labels = [],            // x-axis labels
  height = 240,
  width = 640,
  max,
  area = false,
  legend = true,
}) {
  const pad = { l: 8, r: 8, t: 12, b: 24 };
  const w = width, h = height;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const allVals = series.flatMap((s) => s.points);
  const hi = max != null ? max : Math.max(1, ...allVals) * 1.1;
  const xAt = (i, n) => pad.l + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (v) => pad.t + innerH - (v / hi) * innerH;

  const pathFor = (pts) => pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i, pts.length).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');
  const areaFor = (pts) => `${pathFor(pts)} L${xAt(pts.length - 1, pts.length).toFixed(1)},${pad.t + innerH} L${xAt(0, pts.length).toFixed(1)},${pad.t + innerH} Z`;

  // Entrance: reveal to the visible end-state via CSS transition (state-driven,
  // so the resolved DOM always lands on "shown"). Reduced-motion shows instantly.
  // Render the drawn end-state directly — reliable across SSR/throttle/snapshot.
  const shown = true;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={pad.l} x2={w - pad.r} y1={pad.t + innerH * t} y2={pad.t + innerH * t}
            stroke="var(--outline-variant)" strokeWidth="1" opacity="0.5" />
        ))}
        {series.map((s, si) => (
          <g key={si}>
            {area && (
              <path d={areaFor(s.points)} fill={s.color} opacity={shown ? 0.10 : 0}
                style={{ transition: 'opacity 0.8s var(--ease-out)' }} />
            )}
            <path d={pathFor(s.points)} fill="none" stroke={s.color} strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              opacity={shown ? 1 : 0}
              style={{ transition: `opacity 0.7s var(--ease-out) ${si * 0.12}s` }} />
            {s.points.map((v, i) => (
              <circle key={i} cx={xAt(i, s.points.length)} cy={yAt(v)} r="3.5" fill="var(--white)" stroke={s.color} strokeWidth="2"
                opacity={shown ? 1 : 0} style={{ transition: `opacity 0.3s var(--ease-out) ${0.5 + si * 0.15 + i * 0.04}s` }} />
            ))}
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={i} x={xAt(i, labels.length)} y={h - 6} textAnchor="middle"
            style={{ fontFamily: 'var(--font-label)', fontSize: 11, fill: 'var(--text-subtle)' }}>{l}</text>
        ))}
      </svg>
      {legend && (
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
          {series.map((s, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ width: 12, height: 3, borderRadius: 2, background: s.color }} />{s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Alert, Avatar, Badge, Button, Card, Input, Select, StatCard, Tag, SideNav, TopNav, Dialog, Pagination, Tabs, Toast, ToastViewport, Tooltip, Gauge, ProgressBar, Skeleton, Spinner, BarChart, DonutChart, Globe3D, LineChart });
