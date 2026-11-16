# Plan: Connect Home Page Navigation to Dedicated Pages

## Problem Statement
The site header navigation (`SiteHeader.tsx`) currently links to hash anchors on the home page (`/#home`, `/#about`, `/#research`, `/#people`, `/#publications`, `/#contact`) instead of dedicated application pages. Furthermore, public pages for Research (`/research`) and Publications (`/publications`) do not yet exist.

---

## Proposed Changes

### 1. Update `components/public/layout/SiteHeader.tsx`
- Update `NAV_ITEMS` href values to point to dedicated routes:
  - Home: `/`
  - About: `/about`
  - Research: `/research`
  - People: `/people`
  - Publications: `/publications`
  - Contact: `/contact`
- Update active page detection using Next.js `usePathname()` instead of `IntersectionObserver` hash tracking.

### 2. Create `app/research/page.tsx`
- Implement a Server Component for the Research page (`/research`).
- Display the 7 confirmed research themes:
  1. Computational Drug Design
  2. Quantum Chemical Modeling & DFT
  3. Molecular Docking
  4. Molecular Dynamics Simulation
  5. Network Pharmacology
  6. Machine Learning & AI in Drug Discovery
- Include scientific questions addressed, methods used, and required editorial disclaimers regarding computational predictions vs. clinical effectiveness.

### 3. Create `app/publications/page.tsx`
- Implement a Server Component for the Publications page (`/publications`).
- Fetch verified published publications from Mongoose (`Publication` model) sorted by year/publication date descending.
- Display publication cards with title, authors, journal, year, type badge, and DOI/publisher external links.

---

## Validation Plan
1. Run TypeScript check: `npx tsc --noEmit`
2. Run linter: `npm run lint`
3. Verify navigation links load `/`, `/about`, `/research`, `/people`, `/publications`, and `/contact` correctly across desktop and mobile menus.
