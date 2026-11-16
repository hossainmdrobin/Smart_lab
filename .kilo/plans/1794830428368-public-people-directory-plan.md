# Public People Directory Page Plan

## Overview
Implement the public-facing `/people` page (`app/people/page.tsx`) to showcase all current and alumni members of the Laboratory of Algorithmic Life Sciences, providing filtering by status/role, profile cards with bios and academic links, and navigation to individual profile pages (`/people/[id]`).

---

## 1. Architecture & Data Flow
- **Route**: `app/people/page.tsx` (Next.js App Router Server Component).
- **Service**: `src/lib/services/people.ts` to fetch and format team member data from MongoDB (`Person` model with populated `photo` and `researchInterests`).
- **Layout & Shell**: Wrapped with `SiteHeader`, `SiteFooter`, and responsive main container matching project design tokens.

---

## 2. Implementation Steps

### A. Data Service (`src/lib/services/people.ts`)
- Implement `getPublicPeople()`:
  - Query `Person` where `isDeleted: { $ne: true }`.
  - Sort by `order: 1, fullName: 1`.
  - Populate `photo` (url, altText) and `researchInterests` (name, slug).
  - Return formatted public person objects.

### B. Public People Page (`app/people/page.tsx`)
- Server Component with SEO metadata (`generateMetadata`).
- Section categories:
  - **Current Research Team** (Leadership, Research Associates, Research Assistants, Students/Trainees, Collaborators).
  - **Alumni**.
- Responsive card grid displaying:
  - Profile photo or fallback avatar.
  - Full name & role badge.
  - Education & short bio.
  - Links (Email, ORCID, Google Scholar, GitHub, Personal Website).
  - "View profile" link to `/people/[id]`.

---

## 3. Verification & Testing
1. **TypeScript Check**: Run `npx tsc --noEmit`.
2. **Linting Check**: Run `npm run lint`.
3. **Build Check**: Run `npm run build`.
