# Public Contact Page Plan

## Overview
Implement the public-facing Contact page (`app/contact/page.tsx`) and backend API endpoint (`app/api/contact/route.ts`) for the Laboratory of Algorithmic Life Sciences in Dhaka, Bangladesh, in accordance with `docs/CLIENT_REQUIREMENTS.md` and project coding, security, and design standards.

---

## 1. Architecture & Data Flow
- **Route**: `app/contact/page.tsx` (Next.js App Router Server Component shell wrapping a Client Component contact form).
- **Backend API**: `app/api/contact/route.ts` (POST handler for inquiry submission).
- **Database Model**: `Inquiry` Mongoose model (`models/Inquiry.ts`) storing inquiry submissions (`name`, `email`, `institution`, `subject`, `message`, `status`, `timestamps`).
- **State Management**: RTK Query `contactApi` slice (`src/lib/services/rtk/contactApi.ts`) registered in Redux Toolkit store (`src/lib/redux/store.ts`).
- **Data Fetching**: Retrieve site settings (e.g. contact email) server-side via `getHomepageData()` or setting service to display approved contact info.

---

## 2. Backend API & Validation (`app/api/contact/route.ts`)
- **Zod Schema**:
  - `name`: string (required, min 1, max 100)
  - `email`: string (required, valid email format)
  - `institution`: string (optional, max 200)
  - `subject`: string (required, min 1, max 200)
  - `message`: string (required, min 1, max 5000)
- **Security & Rate Limiting**: Validate server-side inputs, handle rate limiting per IP (or standard error response), and return structured success (`{ data: { message: "..." } }`) or validation error responses (`{ error: { code: "VALIDATION_ERROR", message: "...", details: {...} } }`).

---

## 3. Frontend Components (`app/contact/page.tsx` & Client Form)
- **Server Component (`app/contact/page.tsx`)**:
  - SEO metadata (`generateMetadata`).
  - Skip link (`#main-content`), `SiteHeader`, and `SiteFooter` with site settings.
  - Page header: "Contact the Laboratory".
  - Contact Information section: Laboratory name, Dhaka, Bangladesh location, official contact email (from settings or fallback), and privacy notice explaining data handling.
- **Client Component (Contact Form)**:
  - Form fields: Name, Email, Institution/Organization, Inquiry Subject, Message.
  - RTK Query mutation hook (`useSubmitContactMutation`).
  - Loading, success, and error states.
  - Form validation feedback and accessible form labels (`htmlFor` / `aria-describedby`).

---

## 4. Accessibility & SEO
- **SEO Metadata**: Unique descriptive title and meta description.
- **Accessibility (WCAG 2.2 AA)**: Semantic heading hierarchy, visible focus rings, sufficient color contrast, keyboard navigation, and explicit form labels.

---

## 5. Verification & Testing
1. **TypeScript Check**: Run `npx tsc --noEmit`.
2. **Linting Check**: Run `npm run lint`.
3. **Build Check**: Run `npm run build`.
