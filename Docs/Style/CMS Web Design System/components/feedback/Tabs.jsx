import React from 'react';

/**
 * CMS Tabs — underlined tab strip with a gold active rule, matching the
 * portal/public nav vocabulary. Controlled or uncontrolled.
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, children }) {
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
