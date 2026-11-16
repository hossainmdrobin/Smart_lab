# Contact Inquiries Dashboard Integration Plan

## Overview
Enable administrators and editors to view and manage contact form submissions directly within the CMS dashboard and a dedicated Contact Inquiries management page.

---

## 1. Architecture & Data Flow
- **Backend API**:
  - `GET /api/contact`: Returns list of stored `ContactInquiry` records, sorted by `receivedAt` descending. Requires authentication (`requireUser` with roles `["admin", "editor"]`).
  - `PATCH /api/contact/[id]`: Updates inquiry status (e.g. `isRead`) or soft-deletes/deletes inquiry. Requires authentication.
- **RTK Query**:
  - Update `src/lib/services/rtk/contactApi.ts` with `getContactInquiries` query and `updateContactInquiry` / `deleteContactInquiry` mutations.
- **CMS Management Page**:
  - `app/cms/inquiries/page.tsx`: Displays a table/list of contact inquiries with sender name, email, institution, subject, message preview, timestamp, read status badge, and actions (Mark Read/Unread, Delete).
- **Navigation & Dashboard**:
  - Update `CmsSidebarWrapper.tsx` to include "Contact Inquiries" (`/cms/inquiries`).
  - Update `app/cms/dashboard/page.tsx` to display recent inquiries or summary metrics.

---

## 2. Implementation Steps
1. **Backend API Endpoints**:
   - Implement `GET` in `app/api/contact/route.ts`.
   - Implement `PATCH` and `DELETE` in `app/api/contact/[id]/route.ts`.
2. **RTK Query Service**:
   - Update `src/lib/services/rtk/contactApi.ts`.
3. **CMS UI Components**:
   - Create `app/cms/inquiries/page.tsx`.
   - Update `CmsSidebarWrapper.tsx`.
   - Update `app/cms/dashboard/page.tsx`.
4. **Verification**:
   - Run `npx tsc --noEmit`.
   - Run `npm run lint`.
   - Run `npm run build`.

---

## 3. Security & Validation
- Enforce role-based access control (`admin`, `editor`) on all CMS API endpoints.
- Validate input payloads with Zod.
- Handle errors gracefully with standardized error responses.
