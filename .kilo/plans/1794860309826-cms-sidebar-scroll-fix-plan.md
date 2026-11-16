# Plan: Fix CMS Dashboard Sidebar Scroll Behavior

## Problem Statement
In the CMS layout (`app/cms/layout.tsx`), the entire page body scrolls when content overflows. This causes the left sidebar (`CmsSidebar`) to scroll out of view along with the page content. The desired behavior is for the left sidebar to remain fixed (or scroll independently if its contents exceed the viewport height) while only the right-hand main content area scrolls vertically.

---

## Proposed Changes

### 1. Update `app/cms/layout.tsx`
- Change the root CMS container from `flex min-h-screen flex-col` to `h-screen flex flex-col overflow-hidden`.
- Ensure the `<header>` element has `shrink-0` so it does not compress.
- Update the inner content wrapper from `flex flex-1 w-screen` to `flex flex-1 overflow-hidden`.
- Update the `<main>` element:
  - Add `overflow-y-auto` so it scrolls independently.
  - Add `min-w-0` to prevent flex items from overflowing horizontally.
  - Remove rigid `md:w-[calc(100vw-16rem)]` and `w-screen` which can cause horizontal overflow/sizing issues in flex containers.

### 2. Update `components/cms/CmsSidebar.tsx`
- Update the desktop `<aside>` element to include `h-full overflow-y-auto` so that if sidebar items exceed the sidebar height, the sidebar itself is scrollable independently.

---

## Verification Plan
1. Run TypeScript check: `npx tsc --noEmit`
2. Run linter: `npm run lint`
3. Verify responsive layout (desktop fixed sidebar with scrollable main area, mobile drawer functionality remains intact).
