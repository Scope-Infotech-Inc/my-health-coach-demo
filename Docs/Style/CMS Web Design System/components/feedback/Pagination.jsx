import React from 'react';

/**
 * CMS Pagination — prev/next chevrons + numbered pages with navy active page,
 * truncated with ellipses. Matches the resource-library pager.
 */
export function Pagination({ page = 1, pageCount = 1, onChange, siblings = 1 }) {
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
