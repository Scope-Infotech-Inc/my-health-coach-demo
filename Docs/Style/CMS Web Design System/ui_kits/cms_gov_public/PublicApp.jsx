/* CMS.gov public site — shell */
function PublicApp() {
  const [active, setActive] = React.useState(null);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <window.PublicHeader active={active} setActive={setActive} />
      <window.Home />
      <window.PublicFooter />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<PublicApp />);
