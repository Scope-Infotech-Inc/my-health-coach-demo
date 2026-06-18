/* CMS Program Portal — Overview / Dashboard screen */
const { Card, StatCard, Badge, Button, Avatar } = window;

function MiniLineChart() {
  return (
    <div style={{ position: 'relative', height: 230 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ borderTop: '1px solid var(--outline-variant)', opacity: 0.5 }} />)}
      </div>
      <svg viewBox="0 0 800 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <path d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40" fill="none" stroke="var(--navy-deep)" strokeWidth="3" />
        <path d="M0,180 Q150,160 300,170 T500,150 T800,120" fill="none" stroke="var(--caution-gold)" strokeWidth="3" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-subtle)', marginTop: 6 }}>
        <span>January</span><span>February</span><span>March</span><span>April</span>
      </div>
    </div>
  );
}

const feed = [
  { tone: 'sky', icon: 'sync', html: <span><b>Sarah Jenkins</b> updated the compliance report for <b style={{ color: 'var(--navy-deep)' }}>North Region Healthcare</b>.</span>, time: '2 minutes ago', file: 'North_Region_Q1_24.pdf' },
  { tone: 'sky', icon: 'person_add', html: <span><b>New User Registration:</b> Dr. Alan Miller was granted Admin access to the Policy Library.</span>, time: '45 minutes ago' },
  { tone: 'error', icon: 'warning', html: <span><b>System Alert:</b> Multiple failed login attempts detected from IP 192.168.1.105.</span>, time: '2 hours ago', action: 'Review Security Log' },
];

function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="cms-eyebrow">Administration Dashboard</div>
          <h2 style={{ margin: '4px 0 0', font: '700 32px/40px var(--font-sans)', color: 'var(--on-surface)' }}>System Overview &amp; Metrics</h2>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" size="md" icon="calendar_today">Jan 01 – Mar 31, 2024</Button>
          <Button variant="primary" size="md" icon="file_download">Export PDF</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gutter)' }}>
        <StatCard icon="assignment" tone="info" label="Active Programs" value="1,284"
          trend={<Badge status="success" icon="trending_up">+4.2%</Badge>}
          footer={<><span className="material-symbols-outlined" style={{ fontSize: 14 }}>history</span> Updated 12 mins ago</>} />
        <StatCard icon="verified_user" tone="gold" label="Compliance Rate" value="98.2%"
          trend={<Badge status="neutral">Stable</Badge>}
          footer={<div style={{ width: '100%' }}><div style={{ background: 'var(--surface-container)', height: 6, borderRadius: 999, overflow: 'hidden' }}><div style={{ width: '98.2%', height: '100%', background: 'var(--navy-deep)' }} /></div></div>} />
        <StatCard icon="pending_actions" tone="error" label="Pending Reports" value="42"
          trend={<Badge status="error" icon="priority_high">Action Required</Badge>}
          footer={<div style={{ display: 'flex' }}>{['JD', 'MK', 'AL'].map((x, i) => (<div key={x} style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid var(--white)', marginLeft: i ? -8 : 0, background: ['var(--slate-gray)', 'var(--navy-deep)', 'var(--caution-gold)'][i], color: i === 2 ? 'var(--navy-deep)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-label)' }}>{x}</div>))}<div style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid var(--white)', marginLeft: -8, background: 'var(--surface-container-highest)', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-label)' }}>+39</div></div>} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--gutter)' }}>
        <Card header={<><span>Program Performance Trends</span><div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--navy-deep)' }} />Healthcare</span><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--caution-gold)' }} />Medicare</span></div></>}>
          <MiniLineChart />
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
          <Card>
            <h3 style={{ margin: '0 0 16px', font: '600 18px/24px var(--font-sans)', color: 'var(--navy-deep)' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['post_add', 'Register'], ['search_insights', 'Audit'], ['mail', 'Notify'], ['settings_applications', 'Config']].map(([ic, lb]) => (
                <button key={lb} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 8px', background: 'var(--surface-container-low)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 600, color: 'var(--on-surface)' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--navy-deep)' }}>{ic}</span>{lb}
                </button>
              ))}
            </div>
          </Card>
          <div style={{ background: 'var(--navy-deep)', color: '#fff', padding: 'var(--card-padding)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
            <h4 style={{ margin: '0 0 8px', font: '600 18px/24px var(--font-sans)' }}>System Health</h4>
            <p style={{ margin: '0 0 16px', fontSize: 14, opacity: 0.8, lineHeight: '20px' }}>All protocols are functioning normally within secure parameters.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--caution-gold)', fontFamily: 'var(--font-label)' }}>
              <span className="material-symbols-outlined is-filled" style={{ fontSize: 16 }}>verified</span> SECURE CONNECTED
            </div>
            <span className="material-symbols-outlined" style={{ position: 'absolute', right: -20, bottom: -20, fontSize: 120, opacity: 0.1 }}>security</span>
          </div>
        </div>
      </div>

      <Card padded={false} header="Recent Activity Feed">
        <div>
          {feed.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 24px', borderTop: i ? '1px solid var(--border-hairline)' : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: f.tone === 'error' ? 'var(--error-container)' : 'var(--sky-tint)', color: f.tone === 'error' ? 'var(--error)' : 'var(--navy-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined is-filled">{f.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <p style={{ margin: 0, fontSize: 16, color: 'var(--on-surface)' }}>{f.html}</p>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{f.time}</span>
                </div>
                {f.file && <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', background: 'var(--surface-container)', padding: '4px 8px', borderRadius: 'var(--radius)' }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>attach_file</span>{f.file}</div>}
                {f.action && <button style={{ marginTop: 8, border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 700, color: 'var(--error)', textTransform: 'uppercase' }}>{f.action}</button>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

window.Dashboard = Dashboard;
