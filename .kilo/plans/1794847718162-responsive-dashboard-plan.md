# Responsive CMS Dashboard Plan

## Overview
Improve the responsiveness of `app/cms/dashboard/page.tsx` across mobile, tablet, and desktop viewports, ensuring readable typography, adaptive grid layouts, and mobile-friendly presentation of summary metrics and the recent inquiries table.

---

## 1. Scope & Affected Boundaries
- **Target File**: `app/cms/dashboard/page.tsx`
- **Related Components**: `Card`, `Button`, responsive Tailwind grid and table utilities.

---

## 2. Proposed Design & Changes
1. **Grid Layouts & Breakpoints**:
   - Update metric cards grid from `md:grid-cols-3` to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` to provide a balanced 2-column layout on tablets and 3 columns on large screens.
2. **Typography & Spacing**:
   - Use responsive text sizes (`text-xl sm:text-2xl` for headings, `text-2xl sm:text-3xl` for metric numbers).
   - Adjust container padding and gaps (`gap-4 sm:gap-6`) for smaller viewports.
3. **Recent Inquiries Table / Mobile View**:
   - Ensure the recent inquiries table has proper horizontal scrolling (`overflow-x-auto`) with responsive cell padding (`p-2 sm:p-3`), text truncation, and compact font sizing on mobile (`text-xs sm:text-sm`).

---

## 3. Validation Plan
- Run `npx tsc --noEmit` to verify type safety.
- Run `npm run lint` to verify zero lint errors.
- Run `npm run build` to verify production compilation.
