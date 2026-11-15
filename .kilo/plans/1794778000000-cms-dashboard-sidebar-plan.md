# CMS Dashboard Sidebar Plan

## Goal
Add a navigation sidebar to the CMS area so authenticated users can move between CMS pages (starting with the currently-existing routes).

## Current state (constraints from repo)
- CMS pages live under `app/cms/*` and share `app/cms/layout.tsx`.
- `app/cms/layout.tsx` currently renders only a header and a centered `main` container.
- Only these CMS routes exist right now:
  - `/cms/login`
  - `/cms/dashboard`
  - `/cms/change-password`
  - `/cms/forgot-password`
  - `/cms/reset-password`
- `middleware.ts` protects all `/cms/:path*` routes by requiring a valid `session` cookie, but allows `/cms/login` through when unauthenticated.
- `app/cms/dashboard/page.tsx` already uses `<Suspense>` to avoid prerender issues with auth/DB.

## Sidebar requirements
1. **Do not break unauthenticated CMS routes** (especially `/cms/login`).
2. **Accessible navigation**:
   - Proper landmarks (`<nav aria-label="CMS">`)
   - Keyboard navigable links
   - Visible focus rings via existing Tailwind patterns
3. **Responsive design**:
   - Desktop: sidebar visible alongside content
   - Mobile: sidebar collapses into a drawer or a toggle button
4. **Active route highlighting** so users can see where they are.
5. **No links to non-existent CMS pages yet**.
   - Start with links to the routes that exist today.

## Design decisions (to lock)
1. Sidebar link set (initial):
   - Dashboard -> `/cms/dashboard`
   - Change password -> `/cms/change-password`
2. Mobile behavior (recommended):
   - Add a hamburger button that opens a slide-in drawer containing the same nav items.
3. Role-based hiding:
   - Not required for the initial implementation because there are no admin-only CMS routes implemented yet besides auth enforcement.
4. Where it lives:
   - Add a reusable sidebar component under `components/cms/`.
   - Update `app/cms/layout.tsx` to include the sidebar shell.

## Proposed implementation

### File changes
1. **Add** `components/cms/CmsSidebar.tsx`
   - Client Component (`'use client'`) because it needs `usePathname()` for active link styling and because mobile drawer toggling is interactive.
   - Props:
     - `items: Array<{ href: string; label: string }>`
     - Optional: `defaultOpen?: boolean` (for future)
   - Includes:
     - `<nav aria-label="CMS">` with list of links
     - Active highlighting via `usePathname()` comparison
     - A mobile-only trigger button and drawer/dismissible panel

2. **Add** `components/cms/CmsSidebarShell.tsx` (optional)
   - Server Component wrapper around layout to keep `app/cms/layout.tsx` clean.
   - Could just be a server-side wrapper that composes header + sidebar + main content.
   - If you want minimal changes, skip this file and do it directly in `app/cms/layout.tsx`.

3. **Update** `app/cms/layout.tsx`
   - Convert from single-column to a responsive shell:
     - Header stays at top
     - Body becomes `flex`:
       - `aside` sidebar visible at `lg` (or `md`) and hidden on mobile
       - `main` holds `{children}`
   - Ensure the sidebar is hidden for `/cms/login` only.
     - Use `usePathname()` in a tiny client wrapper, or pass `pathname` from a client component.
     - Alternative (server-only): keep sidebar always rendered, but have it render as empty on login route.

### Route-specific logic (important)
- Only hide sidebar items on `/cms/login`.
- Do not hide sidebar on password reset/forgot pages unless you want it.

## Styling guidance (Tailwind)
- Colors should match the existing palette in CMS layout:
  - Background: `bg-[#F5F8FA]`
  - Text: `text-[#1E293B]`
  - Borders: `border-[#E2E8F0]`
  - Accent ring: `focus-visible:ring-[#55C6D8]`
- Sidebar layout:
  - Width around `w-64` on desktop
  - Card-like background and border separation from content
  - Active link style: use darker text and a left border or background highlight

## Accessibility checks
- Drawer must have focus handling (at minimum):
  - Close button reachable by keyboard
  - ESC support (if implementing full focus trap)
- Links must have discernible text and visible focus.
- `aria-current="page"` on active nav item.

## Verification plan
1. Desktop:
   - Visit `/cms/dashboard` and confirm sidebar shows 2 links with active highlight.
2. Navigation:
   - Click Dashboard and Change password; confirm the main content changes and active highlight updates.
3. Mobile:
   - Ensure sidebar is hidden behind toggle and drawer opens/closes.
4. Unauthenticated route safety:
   - Visit `/cms/login` in a fresh session and ensure the page renders correctly (no auth requirements inside sidebar).

## Acceptance criteria
- Sidebar appears on `/cms/dashboard` and `/cms/change-password`.
- Sidebar is not shown (or not interactive) on `/cms/login`.
- Mobile layout works without overlapping content.
- All nav elements are keyboard accessible and have focus indicators.

## Open question (single decision to confirm)
- Should the mobile sidebar be implemented as:
  - A slide-in drawer (recommended), or
  - A simple static stacked layout under the header (no toggle)
