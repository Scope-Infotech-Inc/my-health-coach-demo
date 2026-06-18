/* CMS Program Portal — Program Registry screen (data table) */
const { Card, Badge, Button, Avatar, StatCard, Tag } = window;

const SEED = [
  { name: 'Medicare Part B', id: 'CMS-MPB-001', status: 'active', date: 'Oct 24, 2023', contact: 'Jane Doe', tone: 'navy' },
  { name: 'Medicaid Expansion 2.0', id: 'CMS-MEX-042', status: 'warning', date: 'Nov 02, 2023', contact: 'Mark Smith', tone: 'sky' },
  { name: 'Rural Health Clinic Initiative', id: 'CMS-RHC-019', status: 'active', date: 'Sep 30, 2023', contact: 'Lena Ortiz', tone: 'gold' },
  { name: 'Health Technology Ecosystem', id: 'CMS-HTE-007', status: 'active', date: 'Nov 12, 2023', contact: 'Paul Reed', tone: 'slate' },
  { name: 'Drug Price Negotiation', id: 'CMS-DPN-031', status: 'warning', date: 'Nov 18, 2023', contact: 'Amy Chen', tone: 'navy' },
];

function StatusBadge({ status }) {
  if (status === 'active') return <Badge status="active" dot>Active</Badge>;
  return <Badge status="warning" dot>Review Required</Badge>;
}

function Registry({ rows, onNewProgram }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, font: '700 32px/40px var(--font-sans)', color: 'var(--navy-deep)' }}>Program Registry</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-subtle)', fontSize: 16 }}>Manage and track federal healthcare initiatives and Medicare programs.</p>
        </div>
        <Button variant="primary" icon="add" onClick={onNewProgram}>New Program</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gutter)' }}>
        <StatCard icon="apps" tone="info" label="Active Programs" value={String(rows.filter((r) => r.status === 'active').length)} />
        <StatCard icon="update" tone="info" label="Pending Updates" value="18" />
        <StatCard icon="verified_user" tone="gold" label="Review Required" value={String(rows.filter((r) => r.status === 'warning').length)} />
      </div>

      <Card padded={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: 'var(--gutter)', borderBottom: '1px solid var(--border-hairline)', background: 'var(--surface-bright)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Tag icon="filter_list">Filters: All Programs</Tag>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-label)', fontSize: 14, fontWeight: 700, color: 'var(--navy-deep)' }}>Clear All</button>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" size="sm" icon="file_download">Export CSV</Button>
            <Button variant="secondary" size="sm" icon="archive">Bulk Archive</Button>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface-container)', borderBottom: '1px solid var(--border-hairline)' }}>
              {['', 'Program Name', 'Status', 'Last Updated', 'Primary Contact', 'Actions'].map((h, i) => (
                <th key={i} style={{ padding: '14px 16px', fontFamily: 'var(--font-label)', fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                  {i === 0 ? <input type="checkbox" /> : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border-hairline)' : 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-container-low)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '14px 16px' }}><input type="checkbox" /></td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--navy-deep)', fontSize: 16 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-label)' }}>ID: {r.id}</div>
                </td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={r.status} /></td>
                <td style={{ padding: '14px 16px', color: 'var(--text-subtle)', fontFamily: 'var(--font-label)', fontSize: 14 }}>{r.date}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={r.contact} tone={r.tone} size={26} />
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: 14, color: 'var(--on-surface)' }}>{r.contact}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['edit', 'more_vert'].map((ic) => (
                      <button key={ic} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--slate-gray)', padding: 4, borderRadius: '50%', display: 'flex' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{ic}</span>
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

window.RegistrySeed = SEED;
window.Registry = Registry;
