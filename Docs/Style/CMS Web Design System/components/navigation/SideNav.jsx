import React from 'react';

/**
 * CMS Program Portal sidebar — fixed 256px rail. Brand lockup, primary CTA,
 * nav items (gold left-rule + sky fill on active), and a footer utility group.
 */
export function SideNav({
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
