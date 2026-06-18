/* CMS Program Portal — User Management screen */
const { Card, Button, Badge, Avatar, Input, Select, StatCard, Tabs, Pagination, Dialog, Tooltip, Toast, ToastViewport } = window;

const USERS = [
  { name: 'Jane Doe', email: 'j.doe@cms.hhs.gov', role: 'Administrator', status: 'active', last: '2 mins ago', tone: 'navy' },
  { name: 'Dr. Alan Miller', email: 'a.miller@cms.hhs.gov', role: 'Policy Editor', status: 'active', last: '45 mins ago', tone: 'gold' },
  { name: 'Mark Smith', email: 'm.smith@cms.hhs.gov', role: 'Analyst', status: 'active', last: '1 hr ago', tone: 'slate' },
  { name: 'Lena Ortiz', email: 'l.ortiz@cms.hhs.gov', role: 'Reviewer', status: 'invited', last: '—', tone: 'sky' },
  { name: 'Paul Reed', email: 'p.reed@cms.hhs.gov', role: 'Analyst', status: 'suspended', last: '3 days ago', tone: 'navy' },
];

function RoleBadge({ role }) {
  const map = { Administrator: 'info', 'Policy Editor': 'success', Analyst: 'neutral', Reviewer: 'neutral' };
  return <Badge status={map[role] || 'neutral'}>{role}</Badge>;
}
function StatusBadge({ s }) {
  if (s === 'active') return <Badge status="active" dot>Active</Badge>;
  if (s === 'invited') return <Badge status="warning" dot>Invited</Badge>;
  return <Badge status="error" dot>Suspended</Badge>;
}

function UserManagement() {
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [tab, setTab] = React.useState('all');

  const invite = () => { setOpen(false); setToast(true); setTimeout(() => setToast(false), 3200); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gutter)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, font: '700 32px/40px var(--font-sans)', color: 'var(--navy-deep)' }}>User Management</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-subtle)', fontSize: 16 }}>Manage portal access, roles, and permissions for CMS staff.</p>
        </div>
        <Button variant="primary" icon="person_add" onClick={() => setOpen(true)}>Invite User</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--gutter)' }}>
        <StatCard icon="group" tone="info" label="Total Users" value="248" />
        <StatCard icon="verified_user" tone="gold" label="Administrators" value="12" />
        <StatCard icon="schedule" tone="neutral" label="Pending Invites" value="5" />
      </div>

      <Card padded={false}>
        <div style={{ padding: '16px 24px 0' }}>
          <Tabs value={tab} onChange={setTab} tabs={[
            { id: 'all', label: 'All Users', count: 248 },
            { id: 'admins', label: 'Administrators', count: 12 },
            { id: 'invited', label: 'Invited', count: 5 },
            { id: 'suspended', label: 'Suspended', count: 3 },
          ]} />
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '16px 24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}><Input icon="search" placeholder="Search by name or email…" /></div>
          <div style={{ width: 200 }}><Select><option>All roles</option><option>Administrator</option><option>Analyst</option></Select></div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface-container)', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
              {['User', 'Role', 'Status', 'Last Active', ''].map((h, i) => (
                <th key={i} style={{ padding: '12px 24px', fontFamily: 'var(--font-label)', fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS.map((u, i) => (
              <tr key={u.email} style={{ borderBottom: i < USERS.length - 1 ? '1px solid var(--border-hairline)' : 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-container-low)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={u.name} tone={u.tone} size={36} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--navy-deep)', fontSize: 15 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontFamily: 'var(--font-label)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 24px' }}><RoleBadge role={u.role} /></td>
                <td style={{ padding: '14px 24px' }}><StatusBadge s={u.status} /></td>
                <td style={{ padding: '14px 24px', color: 'var(--text-subtle)', fontFamily: 'var(--font-label)', fontSize: 14 }}>{u.last}</td>
                <td style={{ padding: '14px 24px' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Tooltip label="Edit roles"><button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--slate-gray)', padding: 4, display: 'flex' }}><span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span></button></Tooltip>
                    <Tooltip label="More"><button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--slate-gray)', padding: 4, display: 'flex' }}><span className="material-symbols-outlined" style={{ fontSize: 20 }}>more_vert</span></button></Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 13, color: 'var(--text-muted)' }}>Showing <b>1–5</b> of 248 users</span>
          <Pagination page={page} pageCount={50} onChange={setPage} />
        </div>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} icon="person_add" title="Invite a user"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" icon="send" onClick={invite}>Send invite</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Email address" type="email" placeholder="name@cms.hhs.gov" required />
          <Select label="Role" required><option>Analyst</option><option>Reviewer</option><option>Policy Editor</option><option>Administrator</option></Select>
        </div>
      </Dialog>

      {toast && (
        <ToastViewport position="bottom-right">
          <Toast kind="success" title="Invitation sent" onClose={() => setToast(false)}>The user will receive an email to activate their account.</Toast>
        </ToastViewport>
      )}
    </div>
  );
}
window.UserManagement = UserManagement;
