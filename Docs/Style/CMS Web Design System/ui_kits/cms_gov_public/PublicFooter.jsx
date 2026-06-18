/* CMS.gov public site — footer */
const COLS = [
  { h: 'Medicare', links: ['Enrollment & renewal', 'Coverage', 'Coding & billing', 'Payment', 'Quality'] },
  { h: 'Medicaid/CHIP', links: ['What is Medicaid?', 'Medicaid.gov', 'CHIP.gov', 'Community engagement'] },
  { h: 'Marketplace', links: ['About the Marketplace', 'Agents & Brokers', 'Health Plans & Issuers', 'Resources'] },
  { h: 'About CMS', links: ['Newsroom', 'Data & Research', 'Careers', 'Contact us'] },
];

function PublicFooter() {
  return (
    <footer>
      <div style={{ background: 'var(--navy-deep)', color: '#fff' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '48px var(--margin-desktop)', display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: 'var(--caution-gold)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined is-filled" style={{ color: 'var(--navy-deep)' }}>health_and_safety</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>CMS.gov</div>
                <div style={{ fontFamily: 'var(--font-label)', fontSize: 11, opacity: 0.7 }}>Centers for Medicare &amp; Medicaid Services</div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: '20px', opacity: 0.75, maxWidth: 260, margin: '0 0 16px' }}>7500 Security Boulevard, Baltimore, MD 21244</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['public', 'mail', 'rss_feed'].map((ic) => (
                <span key={ic} style={{ width: 38, height: 38, border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><span className="material-symbols-outlined" style={{ fontSize: 20 }}>{ic}</span></span>
              ))}
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <div style={{ fontFamily: 'var(--font-label)', fontWeight: 700, fontSize: 14, marginBottom: 12, color: 'var(--gold-dim)' }}>{c.h}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {c.links.map((l) => (<li key={l}><a href="#" style={{ color: '#fff', opacity: 0.8, textDecoration: 'none', fontSize: 14 }}>{l}</a></li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--surface-container-highest)', borderTop: '1px solid var(--border-hairline)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: 'var(--gutter) var(--margin-desktop)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--on-surface)' }}>A federal government website managed by CMS. © 2026 Centers for Medicare &amp; Medicaid Services</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Accessibility', 'FOIA', 'No Fear Act', 'Plain Writing'].map((l) => (
              <a key={l} href="#" style={{ fontFamily: 'var(--font-label)', fontSize: 12, color: 'var(--slate-gray)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
window.PublicFooter = PublicFooter;
