import React from 'react';

/**
 * CMS Program Portal top navigation bar — navy band with a gold bottom rule,
 * brand title, horizontal nav (gold underline on active), search, action
 * icons, and an account avatar.
 */
export function TopNav({
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
