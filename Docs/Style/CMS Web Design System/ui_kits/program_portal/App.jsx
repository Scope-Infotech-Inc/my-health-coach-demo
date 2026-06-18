/* CMS Program Portal — interactive shell (login → app, nav, new program) */
const { TopNav, SideNav, Button, Avatar, Input } = window;

const NAV = [
  { label: 'Overview', icon: 'dashboard' },
  { label: 'Program Registry', icon: 'folder_managed' },
  { label: 'Data Reporting', icon: 'analytics' },
  { label: 'Policy Library', icon: 'policy' },
  { label: 'User Management', icon: 'group' },
];
const TOP = { Overview: 'Dashboard', 'Program Registry': 'Programs', 'Data Reporting': 'Analytics', 'Policy Library': 'Resources' };

function Login({ onSignIn }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, background: 'var(--navy-deep)', color: '#fff', padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 44, height: 44, background: 'var(--caution-gold)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined is-filled" style={{ color: 'var(--navy-deep)' }}>account_balance</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 20 }}>CMS Program Portal</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ font: '700 40px/48px var(--font-sans)', letterSpacing: '-0.02em', margin: '0 0 16px', maxWidth: 460 }}>Administering the nation's healthcare programs.</h1>
          <p style={{ fontSize: 18, lineHeight: '28px', opacity: 0.8, maxWidth: 440, margin: 0 }}>Secure access for CMS administrators managing Medicare, Medicaid, and Marketplace programs.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-label)', fontSize: 12, fontWeight: 700, color: 'var(--caution-gold)', position: 'relative', zIndex: 1 }}>
          <span className="material-symbols-outlined is-filled" style={{ fontSize: 16 }}>verified_user</span> FISMA-COMPLIANT · AUTHORIZED USE ONLY
        </div>
        <div className="cms-dotgrid-gold" style={{ position: 'absolute', right: 40, top: 120, width: 120, height: 160, opacity: 0.5 }} />
      </div>
      <div style={{ width: 460, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 56 }}>
        <div className="cms-eyebrow">Sign in</div>
        <h2 style={{ font: '700 28px/36px var(--font-sans)', color: 'var(--navy-deep)', margin: '4px 0 28px' }}>Welcome back</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSignIn(); }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input label="Email address" type="email" defaultValue="j.doe@cms.hhs.gov" icon="mail" />
          <Input label="Password" type="password" defaultValue="password" icon="lock" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-label)', fontSize: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}><input type="checkbox" defaultChecked /> Remember this device</label>
            <a href="#" style={{ color: 'var(--navy-deep)', fontWeight: 600 }}>Forgot password?</a>
          </div>
          <Button variant="primary" type="submit" fullWidth size="lg" iconRight="arrow_forward">Sign in securely</Button>
        </form>
        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--text-subtle)', lineHeight: '18px' }}>This is a U.S. Government system for authorized use only. Activity may be monitored and recorded.</p>
      </div>
    </div>
  );
}

function ComingSoon({ title }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--text-subtle)' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 56, color: 'var(--outline-variant)' }}>construction</span>
      <h2 style={{ font: '600 24px/32px var(--font-sans)', color: 'var(--navy-deep)', margin: '16px 0 4px' }}>{title}</h2>
      <p style={{ margin: 0 }}>This module is part of the full portal build.</p>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--surface-container-highest)', borderTop: '1px solid var(--border-hairline)', marginTop: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--gutter) var(--margin-desktop)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-label)', fontWeight: 700, color: 'var(--navy-deep)', fontSize: 14 }}>CMS Program Portal</div>
          <div style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--on-surface)', opacity: 0.8 }}>© 2024 Centers for Medicare &amp; Medicaid Services</div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {['Privacy Policy', 'Accessibility Statement', 'FOIA', 'Contact Us'].map((l) => (
            <a key={l} href="#" style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--slate-gray)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [authed, setAuthed] = React.useState(false);
  const [view, setView] = React.useState('Overview');
  const [rows, setRows] = React.useState(window.RegistrySeed);

  if (!authed) return <Login onSignIn={() => setAuthed(true)} />;

  const newProgram = () => {
    const n = rows.length + 1;
    setRows([{ name: 'New Initiative ' + n, id: 'CMS-NEW-' + String(100 + n), status: 'warning', date: 'Today', contact: 'You', tone: 'navy' }, ...rows]);
  };

  let content;
  if (view === 'Overview') content = <window.Dashboard />;
  else if (view === 'Program Registry') content = <window.Registry rows={rows} onNewProgram={newProgram} />;
  else if (view === 'Policy Library') content = <window.Library />;
  else if (view === 'Data Reporting') content = <window.DataReporting />;
  else if (view === 'User Management') content = <window.UserManagement />;
  else content = <ComingSoon title={view} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--surface)' }}>
      <TopNav active={TOP[view] || 'Dashboard'} onNavigate={() => {}} user={<Avatar name="Jane Doe" ring />} />
      <div style={{ display: 'flex', flex: 1, maxWidth: 'var(--container-max)', width: '100%', margin: '0 auto' }}>
        <SideNav
          items={NAV}
          active={view}
          onNavigate={setView}
          cta={<Button variant="accent" icon="add_circle" fullWidth onClick={() => { setView('Program Registry'); newProgram(); }}>New Report</Button>}
          footerItems={[{ label: 'Settings', icon: 'settings' }, { label: 'Sign Out', icon: 'logout' }]}
        />
        <main style={{ flex: 1, minWidth: 0, padding: 'var(--margin-desktop)' }}>{content}</main>
      </div>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
