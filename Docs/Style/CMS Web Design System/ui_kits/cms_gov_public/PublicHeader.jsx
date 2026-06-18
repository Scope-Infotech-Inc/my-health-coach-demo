/* CMS.gov public site — masthead + utility bar + primary nav */
const MENUS = ['Medicare', 'Medicaid/CHIP', 'Marketplace & Private Insurance', 'Initiatives', 'Training & Education'];

function GovBanner() {
  return (
    <div style={{ background: 'var(--surface-container)', borderBottom: '1px solid var(--border-hairline)', fontFamily: 'var(--font-label)', fontSize: 12 }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '6px var(--margin-desktop)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-surface-variant)' }}>
        <span style={{ width: 16, height: 11, background: 'linear-gradient(var(--navy-deep) 50%, var(--error-red) 50%)', display: 'inline-block', borderRadius: 1 }} />
        An official website of the United States government
      </div>
    </div>
  );
}

function PublicHeader({ onSearch, active, setActive }) {
  return (
    <header>
      <GovBanner />
      <div style={{ background: 'var(--navy-deep)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '6px var(--margin-desktop)', display: 'flex', justifyContent: 'flex-end', gap: 20, fontFamily: 'var(--font-label)', fontSize: 13 }}>
          {['About CMS', 'Newsroom', 'Data & Research'].map((l) => (
            <a key={l} href="#" style={{ color: 'var(--on-primary)', textDecoration: 'none', opacity: 0.9 }}>{l}</a>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-hairline)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '16px var(--margin-desktop)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 46, height: 46, background: 'var(--navy-deep)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined is-filled" style={{ color: '#fff' }}>health_and_safety</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 22, color: 'var(--navy-deep)', lineHeight: 1 }}>CMS.gov</div>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>Centers for Medicare &amp; Medicaid Services</div>
            </div>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 420, marginLeft: 'auto' }}>
            <div style={{ display: 'flex', flex: 1, border: '2px solid var(--navy-deep)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <input placeholder="Search CMS.gov" onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', padding: '9px 12px', fontFamily: 'var(--font-sans)', fontSize: 15 }} />
              <button style={{ border: 'none', background: 'var(--navy-deep)', color: '#fff', padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><span className="material-symbols-outlined">search</span></button>
            </div>
          </div>
        </div>
      </div>
      <nav style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-hairline)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--margin-desktop)', display: 'flex', gap: 4 }}>
          {MENUS.map((m) => {
            const on = m === active;
            return (
              <button key={m} onClick={() => setActive(on ? null : m)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '16px 16px', fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600, color: on ? 'var(--navy-deep)' : 'var(--on-surface)', borderBottom: on ? '4px solid var(--caution-gold)' : '4px solid transparent', display: 'flex', alignItems: 'center', gap: 4 }}>
                {m}<span className="material-symbols-outlined" style={{ fontSize: 18 }}>{on ? 'expand_less' : 'expand_more'}</span>
              </button>
            );
          })}
        </div>
        {active && (
          <div style={{ borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-container-low)' }}>
            <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--gutter) var(--margin-desktop)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 40px' }}>
              {(window.MEGA_MENU[active] || ['Overview']).map((l) => (
                <a key={l} href="#" style={{ color: 'var(--text-link)', textDecoration: 'none', fontSize: 15, padding: '6px 0', borderBottom: '1px solid transparent' }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>{l}</a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

window.MEGA_MENU = {
  'Medicare': ['Enrollment & renewal', 'Coverage', 'Regulations & guidance', 'Coding & billing', 'Payment', 'Appeals & grievances', 'Quality', 'Health & safety standards', 'Forms & notices', 'Health & drug plans'],
  'Medicaid/CHIP': ['What is Medicaid?', 'Visit Medicaid.gov', 'Visit CHIP.gov', 'Medicare-Medicaid Coordination', 'Integrated care resources', 'Community engagement support', 'Eligibility made easy (Emmy)', 'Financial alignment initiative'],
  'Marketplace & Private Insurance': ['About the Marketplace', 'Private Health Insurance', 'In-person assisters', 'Agents & Brokers', 'Health Plans & Issuers', 'Employers & sponsors', 'States', 'Resources'],
  'Initiatives': ['Rural Health Transformation Program', 'Health Technology Ecosystem', 'Crushing Fraud, Waste, & Abuse', 'Medicare Drug Price Negotiation', 'Innovation Center', 'Hospital price transparency', 'Maternal Health', 'No Surprise Billing'],
  'Training & Education': ['Medicare Training', 'Partner outreach resources', 'Medicare Learning Network® (MLN)', 'CMS Open Door Forums', 'Look up topics', 'Find your provider type', 'Get training', 'Attend events'],
};
window.PublicHeader = PublicHeader;
