# Public About Page Plan

## Overview
Implement the public-facing About page (`app/about/page.tsx`) for the Laboratory of Algorithmic Life Sciences in Dhaka, Bangladesh, in accordance with `docs/CLIENT_REQUIREMENTS.md` (Section 6) and project coding and design standards.

---

## 1. Architecture & Data Flow
- **Route**: `app/about/page.tsx` (Next.js App Router Server Component).
- **Data Fetching**: Reuse `getHomepageData()` from `src/lib/services/homepage.ts` (or similar shared helper) to retrieve site settings for `SiteFooter`.
- **Layout & Shell**: Wrapped with `SiteHeader`, `SiteFooter`, and accessible `#main-content` skip link.

---

## 2. Content & Sections
- **Header / Introduction**:
  - Title: "About the Laboratory"
  - Subtitle / Overview: Who we are, location (Dhaka, Bangladesh), and core computational research focus.
- **Mission & Vision**:
  - **Mission**: "To investigate molecular and biological systems through computational methods and develop research that supports drug discovery and advances understanding in the life sciences."
  - **Vision**: "To build a collaborative research environment connecting molecular modeling, computational chemistry, biological networks, and data-driven approaches."
- **Research Approach & Methodology**:
  - Narrative and structured overview explaining how our core areas (Computational Drug Design, Density Functional Theory, Molecular Docking, Molecular Dynamics Simulation, Network Pharmacology, Machine Learning and AI) connect without implying every method is required in every project.
- **Infrastructure & Environment**:
  - Overview of computational resources and collaborative environment, with clearly identified placeholders for pending/unconfirmed infrastructure details per laboratory policy.
- **Compliance & Guidelines**:
  - Strict adherence to project rules: no fabricated founding year, history, or unapproved affiliations.

---

## 3. Accessibility & SEO
- **SEO Metadata**: Unique descriptive title and meta description (`generateMetadata`).
- **Accessibility (WCAG 2.2 AA)**: Semantic heading hierarchy (`h1` > `h2` > `h3`), visible focus rings, sufficient color contrast, and proper ARIA labels.

---

## 4. Verification & Testing
1. **TypeScript Check**: Run `npx tsc --noEmit`.
2. **Linting Check**: Run `npm run lint`.
3. **Build Check**: Run `npm run build`.
