/* Design sheet — component specimens (reads primitives off window) */
const {
  Button, Badge, Tag, Input, Select, Alert, Avatar, StatCard,
  Tabs, Pagination, Toast, Tooltip, Dialog,
  Spinner, ProgressBar, Gauge, Skeleton,
  LineChart, BarChart, DonutChart, Globe3D,
} = window;

function Panel({ label, children, style }) {
  return (
    <div className="panel" style={{ marginBottom: 16, ...style }}>
      <p className="ph">{label}</p>
      {children}
    </div>
  );
}

function Sheet() {
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(2);
  return (
    <div>
      <Panel label="Buttons">
        <div className="row">
          <Button variant="primary" icon="add">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent" icon="add_circle">Accent</Button>
          <Button variant="ghost" iconRight="arrow_forward">Ghost</Button>
          <Button variant="danger" icon="delete">Danger</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </Panel>

      <Panel label="Badges, Tags & Avatars">
        <div className="row" style={{ marginBottom: 14 }}>
          <Badge status="active" dot>Active</Badge>
          <Badge status="success" icon="verified">Complete</Badge>
          <Badge status="warning" icon="pending">Review Required</Badge>
          <Badge status="error" icon="warning">Action Required</Badge>
          <Badge status="neutral">Archived</Badge>
        </div>
        <div className="row">
          <Tag selected>Transmittals</Tag>
          <Tag icon="tag">ICD-10 Updates</Tag>
          <Tag onRemove={() => {}}>Provider Manuals</Tag>
          <span style={{ width: 16 }} />
          <Avatar name="Jane Doe" />
          <Avatar name="Alan Miller" tone="gold" />
          <Avatar name="Mark Smith" tone="slate" size={40} ring />
        </div>
      </Panel>

      <Panel label="Form controls">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Input label="Program name" placeholder="Enter a name" required />
          <Input label="Search" icon="search" placeholder="Keywords…" />
          <Select label="Sort by"><option>Newest First</option><option>Alphabetical</option></Select>
          <Input label="NPI" error="Must be 10 digits" defaultValue="123" />
        </div>
      </Panel>

      <Panel label="Alerts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Alert kind="info" title="Nondiscrimination in health">Recent court decisions affect provisions of the 2024 Final Rule implementing Section 1557.</Alert>
          <Alert kind="success" title="Report submitted">District 01 — Boston compliance report accepted.</Alert>
        </div>
      </Panel>

      <Panel label="Tabs, Pagination, Tooltip & Dialog">
        <Tabs defaultValue="all" tabs={[
          { id: 'all', label: 'All Resources', count: 124 },
          { id: 'manuals', label: 'Manuals', icon: 'description', count: 42 },
          { id: 'transmittals', label: 'Transmittals', count: 31 },
        ]} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
          <Pagination page={page} pageCount={12} onChange={setPage} />
          <div className="row">
            <Tooltip label="Export as PDF"><Button variant="secondary" icon="file_download">Hover</Button></Tooltip>
            <Button variant="primary" icon="open_in_full" onClick={() => setOpen(true)}>Open dialog</Button>
          </div>
        </div>
      </Panel>

      <Panel label="StatCards">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <StatCard icon="assignment" tone="info" label="Active Programs" value="1,284" trend={<Badge status="success" icon="trending_up">+4.2%</Badge>} footer={<><span className="material-symbols-outlined" style={{ fontSize: 14 }}>history</span> Updated 12 mins ago</>} />
          <StatCard icon="verified_user" tone="gold" label="Compliance Rate" value="98.2%" trend={<Badge status="neutral">Stable</Badge>} />
          <StatCard icon="pending_actions" tone="error" label="Pending Reports" value="42" trend={<Badge status="error" icon="priority_high">Action</Badge>} />
        </div>
      </Panel>

      <Panel label="Indicators — Spinner, Progress, Gauge, Skeleton">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'center' }}>
          <div>
            <div className="row" style={{ marginBottom: 20 }}>
              <Spinner size={24} />
              <Spinner size={30} color="var(--caution-gold)" />
              <Spinner size={26} label="Loading…" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ProgressBar label="Compliance rate" value={98.2} showValue />
              <ProgressBar label="Data ingest" value={64} tone="gold" showValue />
              <ProgressBar indeterminate />
            </div>
          </div>
          <div>
            <div className="row" style={{ marginBottom: 16 }}>
              <Gauge value={98.2} label="Compliance" size={130} />
              <Gauge value={42} max={60} unit="" label="Pending" tone="gold" size={130} />
            </div>
            <div className="row">
              <Skeleton variant="circle" width={44} />
              <div style={{ flex: 1, minWidth: 180 }}><Skeleton variant="text" lines={3} /></div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel label="Data visualization — Line, Bar, Donut">
        <div style={{ marginBottom: 24 }}>
          <LineChart area labels={['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']} series={[
            { name: 'Budgeted', color: 'var(--navy-deep)', points: [40, 52, 48, 61, 72, 80, 86] },
            { name: 'Actual', color: 'var(--caution-gold)', points: [30, 44, 40, 55, 60, 72, 78] },
          ]} />
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <BarChart unit="%" data={[{ label: 'NE', value: 85 }, { label: 'Mid-Atl', value: 62 }, { label: 'SE', value: 94 }, { label: 'West', value: 71 }, { label: 'SW', value: 58 }]} />
          <DonutChart centerLabel="Total" centerValue="4.2M" size={160} data={[
            { label: 'Medicare A/B', value: 54 }, { label: 'Medicare Advantage', value: 28 }, { label: 'Dual Eligible', value: 18 },
          ]} />
        </div>
      </Panel>

      <Panel label="WebGL — Globe3D (three.js)" style={{ background: 'var(--navy-deep)' }}>
        <Globe3D height={260} points={34} />
      </Panel>

      <Dialog open={open} onClose={() => setOpen(false)} icon="archive" title="Archive program?"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button variant="danger" onClick={() => setOpen(false)}>Archive</Button></>}>
        This moves <b>Medicaid Expansion 2.0</b> to the historical archive. You can restore it at any time.
      </Dialog>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Sheet />);
