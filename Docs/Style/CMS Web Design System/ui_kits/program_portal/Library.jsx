/* CMS Program Portal — Policy & Resource Library screen */
const { Card, Button, Tag, Badge } = window;

const RESOURCES = [
  { kind: 'pdf', icon: 'picture_as_pdf', iconBg: 'var(--error-container)', iconFg: 'var(--error)', title: 'Publication 100-02: Medicare Benefit Policy Manual', desc: 'Comprehensive guidance on provider billing, benefit descriptions, and coverage requirements.', meta: 'Oct 12, 2024', tag: 'Manuals', right: ['File Size', '2.4 MB'] },
  { kind: 'link', icon: 'open_in_new', iconBg: 'var(--sky-tint-strong)', iconFg: 'var(--navy-deep)', title: 'HCPCS Quarterly Update Dashboard', desc: 'Real-time interactive dashboard for Healthcare Common Procedure Coding System modifications.', meta: 'Sep 30, 2024', tag: 'Analytics', right: ['Status', 'Active'] },
  { kind: 'tool', icon: 'construction', iconBg: 'var(--gold-soft)', iconFg: 'var(--warning)', title: 'Policy Compliance Self-Assessment Tool', desc: 'Interactive tool for providers to verify adherence to Section 1862(a)(1)(A).', meta: 'Aug 15, 2024', tag: 'Compliance', right: ['Type', 'Utility'] },
];

const CATEGORIES = [['All Resources', 124, true], ['Internet-Only Manuals', 42], ['Transmittals', 31], ['Quality Reporting', 18], ['Archive / Historical', 33]];

function Library() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, font: '700 32px/40px var(--font-sans)', color: 'var(--navy-deep)' }}>Policy &amp; Resource Library</h1>
          <p style={{ margin: '8px 0 0', maxWidth: 560, color: 'var(--text-muted)', fontSize: 16 }}>Access current manuals, regulatory transmittals, and operational guidance for all healthcare programs.</p>
        </div>
        <Badge status="info" icon="update">Last Updated: Oct 24, 2024</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--gutter)' }}>
        <Card style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -64, right: -64, width: 128, height: 128, borderRadius: '50%', background: 'var(--sky-tint)', opacity: 0.5 }} />
          <h3 style={{ margin: '0 0 16px', font: '600 24px/32px var(--font-sans)', color: 'var(--navy-deep)', position: 'relative' }}>Search Manuals &amp; Guidance</h3>
          <div style={{ display: 'flex', gap: 8, padding: 4, background: 'var(--surface-container-low)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ alignSelf: 'center', marginLeft: 12, color: 'var(--text-muted)' }}>search</span>
            <input placeholder="Enter keywords, transmittal numbers, or manual sections…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '12px 0', fontFamily: 'var(--font-sans)', fontSize: 16 }} />
            <Button variant="primary">Search</Button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-muted)' }}>Popular:</span>
            <Tag>Transmittals</Tag><Tag>ICD-10 Updates</Tag><Tag>Provider Manuals</Tag>
          </div>
        </Card>
        <div style={{ background: 'var(--navy-deep)', color: '#fff', padding: 'var(--card-padding)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--caution-gold)', fontSize: 36, marginBottom: 12 }}>bolt</span>
          <h3 style={{ margin: '0 0 6px', font: '600 20px/26px var(--font-sans)' }}>Most Accessed</h3>
          <p style={{ margin: '0 0 16px', fontSize: 14, opacity: 0.8, lineHeight: '20px' }}>Frequently viewed regulatory documents this week.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto' }}>
            {['Provider Reimbursement Manual', 'State Operations Manual'].map((t, i) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <span style={{ width: 30, height: 30, borderRadius: 'var(--radius)', background: 'rgba(255,255,255,0.12)', color: 'var(--caution-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'var(--font-label)' }}>{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: 14 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--gutter)' }}>
        <div>
          <div className="cms-eyebrow" style={{ padding: '0 8px 10px' }}>Categories</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {CATEGORIES.map(([label, count, active]) => (
              <button key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', textAlign: 'left', borderRadius: active ? '0 var(--radius) var(--radius) 0' : 'var(--radius)', border: 'none', borderLeft: active ? '4px solid var(--navy-deep)' : '4px solid transparent', background: active ? 'var(--white)' : 'transparent', boxShadow: active ? 'var(--shadow-card)' : 'none', fontFamily: 'var(--font-label)', fontSize: 14, fontWeight: active ? 700 : 500, color: active ? 'var(--navy-deep)' : 'var(--text-muted)' }}>
                {label} <span style={{ background: active ? 'var(--sky-tint-strong)' : 'var(--surface-container)', borderRadius: 'var(--radius)', padding: '1px 7px', fontSize: 12 }}>{count}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {RESOURCES.map((r) => (
            <Card key={r.title} interactive>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: 'var(--radius)', background: r.iconBg, color: r.iconFg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 30 }}>{r.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <h5 style={{ margin: 0, font: '700 18px/24px var(--font-sans)', color: 'var(--navy-deep)' }}>{r.title}</h5>
                      <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-label)' }}>{r.desc}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>{r.right[0]}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-label)', color: r.right[1] === 'Active' ? 'var(--success)' : 'var(--on-surface)' }}>{r.right[1]}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--surface-container)' }}>
                    <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_month</span>{r.meta}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>tag</span>{r.tag}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['download', 'share', 'bookmark'].map((ic) => (
                        <button key={ic} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--navy-deep)', padding: 4, display: 'flex' }}><span className="material-symbols-outlined" style={{ fontSize: 20 }}>{ic}</span></button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Library = Library;
