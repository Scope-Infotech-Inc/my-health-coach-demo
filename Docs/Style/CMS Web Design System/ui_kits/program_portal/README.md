# UI Kit — CMS Program Portal (Admin Console)

Interactive recreation of the internal CMS Program Portal: the app CMS administrators use to oversee Medicare / Medicaid / Marketplace programs.

## Run it
Open `index.html`. Flow: **Login → Overview dashboard → navigate the sidebar** (Overview · Program Registry · Data Reporting · Policy Library · User Management are all built). The gold **New Report** CTA jumps to the registry and inserts a row.

## Screens
- `App.jsx` — shell: login screen, `TopNav` + `SideNav` chrome, view routing, footer, and the "new program" state.
- `Dashboard.jsx` — bento "System Overview & Metrics": KPI `StatCard`s, performance line chart, quick actions, system-health panel, activity feed.
- `Registry.jsx` — "Program Registry" data table with status badges, contact avatars, toolbar, and live row insertion.
- `Library.jsx` — "Policy & Resource Library": search hero, most-accessed panel, category rail, resource cards.
- `DataReporting.jsx` — "Data Reporting & Insights": animated `Gauge` data-health score, `LineChart` spending trends, `BarChart` regional enrollment, `DonutChart` demographics, compliance log table.
- `UserManagement.jsx` — role/access table with `Tabs`, search + role filter, status badges, `Pagination`, and a working **Invite User** `Dialog` → success `Toast`.

## Composition
Screens are plain `text/babel` scripts that read the design-system primitives off `window` (Button, Badge, Card, StatCard, Avatar, Input, Tag, TopNav, SideNav). Those primitives come from `../_primitives.jsx`, an auto-built concatenation of the real component sources in `components/` — so this kit stays a faithful consumer of the system. In a production project, import the same components from the compiled bundle instead.

## Source
Recreated from `stitch_cms_web_design_system/{cms_admin_dashboard,program_registry,data_reporting_analytics,policy_resource_library}/code.html`.
