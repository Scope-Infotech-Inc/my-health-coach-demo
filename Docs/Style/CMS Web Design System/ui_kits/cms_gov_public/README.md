# UI Kit — CMS.gov Public Website

High-fidelity recreation of the public **cms.gov** homepage — the front door for beneficiaries, providers, agents/brokers, states, and researchers.

## Run it
Open `index.html`. The primary nav (Medicare, Medicaid/CHIP, Marketplace, Initiatives, Training) opens mega-menus; the hero priority tabs swap the featured initiative; the "Top resources" cards expand/collapse their link lists.

## Sections
- `PublicHeader.jsx` — "official government website" banner, navy utility bar, masthead (logo + search), and the primary nav with expandable mega-menus (`MEGA_MENU` data).
- `Home.jsx` — the homepage: gold-arch hero with "What are you looking for today?" search + popular terms + photography; navy priority-initiative switcher; "Top resources" accordion; policy callout banners; "Recent articles" newsroom grid.
- `PublicFooter.jsx` — navy link-column footer + agency address + legal/utility strip.
- `PublicApp.jsx` — composes header + home + footer.

## Brand motifs used
The **gold arch** + **dot grid** behind the cut-out hero photo (`assets/images/hero-family.png`), sentence-case headings, sky-tint popular-term pills, and the gold accent reserved for the active priority tab and primary CTA.

## Source
Recreated from `extracted_text_from_https_www.cms.gov.md` (nav IA + homepage copy) and the CMS.gov hero photography, cross-referenced with <https://www.cms.gov/>.
