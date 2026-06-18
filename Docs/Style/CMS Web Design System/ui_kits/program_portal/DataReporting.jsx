/* CMS Program Portal — Data Reporting & Analytics screen */
const { Card, Button, Badge, Gauge, LineChart, BarChart, DonutChart, ProgressBar, Tabs } = window;

function DataReporting() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="cms-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>analytics</span> National Metrics
          </div>
          <h1 style={{ margin: '4px 0 0', font: '700 32px/40px var(--font-sans)', color: 'var(--navy-deep)' }}>Data Reporting &amp; Insights</h1>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--surface-container)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)' }}>
            {['Q1 2024', 'YTD', 'Custom'].map((t, i) => (
              <button key={t} style={{ border: 'none', cursor: 'pointer', padding: '6px 16px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-label)', fontSize: 14, fontWeight: 600, background: i === 0 ? 'var(--white)' : 'transparent', color: i === 0 ? 'var(--navy-deep)' : 'var(--text-muted)', boxShadow: i === 0 ? 'var(--shadow-sm)' : 'none' }}>{t}</button>
            ))}
          </div>
          <Button variant="primary" icon="file_download">Export Data</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--gutter)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
          <div style={{ background: 'var(--sky-tint)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-xl)', padding: 'var(--card-padding)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <h3 style={{ margin: 0, font: '600 18px/24px var(--font-sans)', color: 'var(--navy-deep)' }}>Data Health</h3>
              <Badge status="success">EXCELLENT</Badge>
            </div>
            <Gauge value={98.4} label="Integrity score" tone="navy" size={150} />
          </div>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'rgba(253,184,30,0.2)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h4 style={{ margin: 0, font: '600 18px/24px var(--font-sans)', color: 'var(--navy-deep)' }}>Pending Reviews</h4>
            </div>
            <div style={{ font: '700 48px/1 var(--font-sans)', color: 'var(--navy-deep)', letterSpacing: '-0.02em' }}>12</div>
            <div style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--text-subtle)', marginTop: 4 }}>Regions requiring validation</div>
          </Card>
        </div>
        <Card header={<><span>Spending Trends</span><span style={{ fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>Fiscal Year 2023–2024</span></>}>
          <div className="cms-grid-pattern" style={{ padding: 4 }}>
            <LineChart area height={260} labels={['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']}
              series={[
                { name: 'Budgeted', color: 'var(--navy-deep)', points: [62, 70, 66, 80, 78, 90, 96, 104] },
                { name: 'Actual', color: 'var(--caution-gold)', points: [50, 60, 58, 70, 72, 80, 88, 95] },
              ]} />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 'var(--gutter)' }}>
        <Card header="Regional Enrollment">
          <BarChart unit="% capacity" height={220} data={[
            { label: 'Northeast', value: 85 }, { label: 'Mid-Atlantic', value: 62 },
            { label: 'Southeast', value: 94 }, { label: 'Midwest', value: 73 }, { label: 'West', value: 68 },
          ]} />
        </Card>
        <Card header="Demographic Distribution">
          <DonutChart centerLabel="Total" centerValue="4.2M" size={170} data={[
            { label: 'Medicare A/B', value: 54 },
            { label: 'Medicare Advantage', value: 28 },
            { label: 'Dual Eligible', value: 18 },
          ]} />
        </Card>
      </div>

      <Card padded={false} header="Regional Compliance Logs">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface-container-low)', borderBottom: '1px solid var(--border-hairline)' }}>
              {['REGION', 'REPORTING STATUS', 'ACCURACY', 'LAST UPDATED', 'ACTION'].map((h) => (
                <th key={h} style={{ padding: '14px 24px', fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 700, color: 'var(--text-subtle)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['District 01 — Boston', 'complete', '99.8%', '2 hrs ago', 'View File'],
              ['District 04 — Atlanta', 'review', '94.2%', '14 mins ago', 'Review Now'],
              ['District 09 — San Francisco', 'complete', '99.1%', '6 hrs ago', 'View File'],
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: i < 2 ? '1px solid var(--border-hairline)' : 'none' }}>
                <td style={{ padding: '14px 24px', fontWeight: 700, color: 'var(--navy-deep)', fontSize: 16 }}>{r[0]}</td>
                <td style={{ padding: '14px 24px' }}>{r[1] === 'complete' ? <Badge status="success" icon="check_circle">Complete</Badge> : <Badge status="warning" icon="pending">Review Required</Badge>}</td>
                <td style={{ padding: '14px 24px', color: 'var(--navy-deep)', fontFamily: 'var(--font-label)' }}>{r[2]}</td>
                <td style={{ padding: '14px 24px', color: 'var(--text-subtle)', fontFamily: 'var(--font-label)', fontSize: 14 }}>{r[3]}</td>
                <td style={{ padding: '14px 24px' }}><button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--navy-deep)', fontWeight: 700, fontFamily: 'var(--font-label)', fontSize: 13 }}>{r[4]}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
window.DataReporting = DataReporting;
