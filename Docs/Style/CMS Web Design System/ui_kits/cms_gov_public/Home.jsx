/* CMS.gov public site — homepage sections */
const POPULAR = ['Physician Fee Schedule', 'Local Coverage Determination', 'Medically Unlikely Edits', 'Telehealth', 'Covid-19', 'Agents and Brokers'];

const PRIORITIES = [
  { t: 'Rural Health Transformation Program', d: "We're empowering states to improve healthcare and strengthen rural communities.", cta: 'Learn more' },
  { t: 'Health Technology Ecosystem', d: "We're modernizing the nation's digital health ecosystem to empower patients & deliver better outcomes.", cta: 'Learn more' },
  { t: 'Crushing Fraud, Waste, & Abuse', d: "We're combating healthcare fraud, waste, and abuse and protecting Americans in our programs.", cta: 'Learn more' },
  { t: 'Medicare Drug Price Negotiation', d: 'Medicare is negotiating prices directly with participating drug companies to improve access to costly, common drugs.', cta: 'Learn more' },
];

const RESOURCES = [
  { icon: 'receipt_long', t: 'Medicare fee schedules', d: 'Check the fee schedules to find billing codes.', links: ['Physician fee schedule lookup tool', 'Physician fee schedule', 'Clinical Laboratory Fee Schedule', 'DME Fee Schedule'] },
  { icon: 'qr_code_2', t: 'Codes for claim reimbursement', d: 'Find codes to be reimbursed for clinical services.', links: ['Medicare Coverage Database', 'List of CPT/HCPCS codes', 'ICD-10 codes', 'Place of service code set'] },
  { icon: 'handshake', t: 'Marketplace partner resources', d: 'Get helpful materials for agents, brokers, and partners.', links: ['Marketplace registration and training', 'Resources for Agents and Brokers', 'Agent and Broker FAQs', 'Exchange Coverage Maps'] },
  { icon: 'description', t: 'Manuals, forms, & transmittals', d: 'Find current resources to complete your tasks.', links: ['CMS Forms list', 'Internet Only Manuals', 'Transmittals', 'Become a provider or supplier'] },
];

const ARTICLES = [
  { d: '01', m: 'Jun', kind: 'Press Releases', date: '06/01/2026', t: 'CMS Launches Nationwide Framework to Implement Medicaid Work Requirements' },
  { d: '01', m: 'Jun', kind: 'Fact Sheets', date: '06/01/2026', t: 'Medicaid Community Engagement Requirement Interim Final Rule with Comment Period (CMS-2454-IFC)' },
  { d: '28', m: 'May', kind: 'Fact Sheets', date: '05/28/2026', t: 'Federal Independent Dispute Resolution Operations Final Rule' },
  { d: '28', m: 'May', kind: 'Press Releases', date: '05/28/2026', t: 'Federal Rule Takes Aim at Health Care Bureaucracy, Reducing Dispute Fees, and Boosting Transparency' },
];

function Hero({ onPick, picked }) {
  return (
    <section style={{ background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px var(--margin-desktop) 0', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }}>
        <div>
          <h1 style={{ font: '800 48px/56px var(--font-sans)', letterSpacing: '-0.02em', color: 'var(--navy-deep)', margin: '0 0 24px' }}>What are you looking for today?</h1>
          <div style={{ display: 'flex', border: '2px solid var(--navy-deep)', borderRadius: 'var(--radius)', overflow: 'hidden', maxWidth: 520 }}>
            <input placeholder="Search CMS.gov" style={{ flex: 1, border: 'none', outline: 'none', padding: '14px 16px', fontFamily: 'var(--font-sans)', fontSize: 17 }} />
            <button style={{ border: 'none', background: 'var(--navy-deep)', color: '#fff', padding: '0 22px', cursor: 'pointer', fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}><span className="material-symbols-outlined">search</span>Search</button>
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="cms-eyebrow" style={{ marginBottom: 10 }}>Popular terms</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 560 }}>
              {POPULAR.map((p) => (
                <a key={p} href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--sky-tint)', color: 'var(--navy-deep)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontSize: 13, fontWeight: 600 }}>{p}<span className="material-symbols-outlined" style={{ fontSize: 16 }}>north_east</span></a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', height: 360, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div className="cms-dotgrid" style={{ position: 'absolute', left: 0, top: 30, width: 90, height: 130, zIndex: 1 }} />
          <div className="cms-arch" style={{ position: 'absolute', bottom: 0, width: 300, height: 320 }} />
          <img src="../../assets/images/hero-family.png" alt="A mother and daughter embracing and smiling" style={{ position: 'relative', zIndex: 2, height: 350, objectFit: 'contain' }} />
        </div>
      </div>
      <div style={{ background: 'var(--navy-deep)', marginTop: 24 }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--margin-desktop)', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {PRIORITIES.map((p, i) => (
            <button key={i} onClick={() => onPick(i)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '16px 20px', whiteSpace: 'nowrap', color: picked === i ? 'var(--navy-deep)' : 'var(--on-primary)', background: picked === i ? 'var(--caution-gold)' : 'transparent', fontFamily: 'var(--font-label)', fontSize: 14, fontWeight: 700 }}>{p.t}</button>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--navy-deep)', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px var(--margin-desktop) 48px' }}>
          <h2 style={{ font: '700 32px/40px var(--font-sans)', margin: '0 0 12px' }}>{PRIORITIES[picked].t}</h2>
          <p style={{ fontSize: 18, lineHeight: '28px', opacity: 0.85, maxWidth: 640, margin: '0 0 20px' }}>{PRIORITIES[picked].d}</p>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--caution-gold)', color: 'var(--navy-deep)', padding: '12px 22px', borderRadius: 'var(--radius)', textDecoration: 'none', fontFamily: 'var(--font-label)', fontWeight: 700 }}>{PRIORITIES[picked].cta}<span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></a>
        </div>
      </div>
    </section>
  );
}

function TopResources() {
  const [open, setOpen] = React.useState(0);
  return (
    <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px var(--margin-desktop)' }}>
      <h2 style={{ font: '700 32px/40px var(--font-sans)', color: 'var(--navy-deep)', margin: '0 0 28px' }}>Top resources</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--gutter)' }}>
        {RESOURCES.map((r, i) => {
          const on = open === i;
          return (
            <div key={r.t} style={{ border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', background: 'var(--white)', overflow: 'hidden' }}>
              <button onClick={() => setOpen(on ? -1 : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: 'var(--card-padding)', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius)', background: 'var(--sky-tint)', color: 'var(--navy-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-outlined">{r.icon}</span></div>
                <div style={{ flex: 1 }}>
                  <div style={{ font: '700 18px/24px var(--font-sans)', color: 'var(--navy-deep)' }}>{r.t}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>{r.d}</div>
                </div>
                <span className="material-symbols-outlined" style={{ color: 'var(--navy-deep)' }}>{on ? 'remove' : 'add'}</span>
              </button>
              {on && (
                <ul style={{ listStyle: 'none', margin: 0, padding: '0 24px 20px 88px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {r.links.map((l) => (
                    <li key={l}><a href="#" style={{ color: 'var(--text-link)', textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--caution-gold)' }}>arrow_forward</span>{l}</a></li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Callouts() {
  const items = [
    { icon: 'how_to_reg', t: 'Medicaid Eligibility Made Easy', d: 'CMS can help your state prepare for the new Community Engagement requirements.', tone: 'sky' },
    { icon: 'gavel', t: 'Nondiscrimination in health', d: 'Recent court decisions stay or enjoin provisions of the 2024 Final Rule implementing Section 1557 of the ACA.', tone: 'gold' },
  ];
  return (
    <section style={{ background: 'var(--surface-container-low)', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '40px var(--margin-desktop)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gutter)' }}>
        {items.map((it) => (
          <div key={it.t} style={{ display: 'flex', gap: 16, background: 'var(--white)', border: '1px solid var(--border-hairline)', borderLeft: `4px solid ${it.tone === 'gold' ? 'var(--caution-gold)' : 'var(--navy-deep)'}`, borderRadius: 'var(--radius)', padding: 'var(--card-padding)' }}>
            <span className="material-symbols-outlined is-filled" style={{ color: it.tone === 'gold' ? 'var(--caution-gold)' : 'var(--navy-deep)', fontSize: 28 }}>{it.icon}</span>
            <div>
              <h3 style={{ font: '700 18px/24px var(--font-sans)', color: 'var(--navy-deep)', margin: '0 0 4px' }}>{it.t}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: '20px' }}>{it.d}</p>
              <a href="#" style={{ color: 'var(--text-link)', fontWeight: 600, fontFamily: 'var(--font-label)', fontSize: 14, textDecoration: 'none' }}>Learn more →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsroom() {
  return (
    <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '56px var(--margin-desktop)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ font: '700 32px/40px var(--font-sans)', color: 'var(--navy-deep)', margin: 0 }}>Recent articles</h2>
        <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-link)', fontWeight: 700, fontFamily: 'var(--font-label)', textDecoration: 'none' }}>Visit the newsroom<span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span></a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--gutter)' }}>
        {ARTICLES.map((a, i) => (
          <a key={i} href="#" style={{ display: 'flex', gap: 16, padding: 'var(--card-padding)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-lg)', textDecoration: 'none', background: 'var(--white)', transition: 'box-shadow var(--duration) var(--ease-standard)' }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-raised)')} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}>
            <div style={{ textAlign: 'center', flexShrink: 0, border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius)', overflow: 'hidden', width: 56 }}>
              <div style={{ background: 'var(--navy-deep)', color: '#fff', fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, padding: '3px 0' }}>{a.m.toUpperCase()}</div>
              <div style={{ font: '700 22px/1 var(--font-sans)', color: 'var(--navy-deep)', padding: '8px 0' }}>{a.d}</div>
            </div>
            <div>
              <div style={{ display: 'inline-block', background: 'var(--sky-tint)', color: 'var(--navy-deep)', fontFamily: 'var(--font-label)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius)', marginBottom: 6 }}>{a.kind} · {a.date}</div>
              <div style={{ font: '600 17px/24px var(--font-sans)', color: 'var(--navy-deep)' }}>{a.t}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const [picked, setPicked] = React.useState(0);
  return (
    <main>
      <Hero picked={picked} onPick={setPicked} />
      <TopResources />
      <Callouts />
      <Newsroom />
    </main>
  );
}
window.Home = Home;
