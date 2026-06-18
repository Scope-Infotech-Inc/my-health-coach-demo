import { Dashboard } from '@/components/dashboard/Dashboard';

/**
 * "/" — the patient application. The shell (app/layout.tsx → AppShell) renders
 * the responsive chrome and the live 880px desktop/mobile switch; this page is
 * the dashboard content that fills the main slot for both views.
 */
export default function Home() {
  return <Dashboard />;
}
