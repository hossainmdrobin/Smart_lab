# Cloudinary Photo Upload Integration Plan

## Overview
This plan defines the architecture, environment configuration, server-side upload API route, database integration, and UI component updates required to support uploading profile photos and media assets to **Cloudinary** for users and team members (Person entities) within the CMS.

---

## 1. Architecture & Data Flow
1. **Secure Server-Side Upload**:
   - Client selects an image file in the CMS form (`/cms/people` or `/cms/users`).
   - Client sends file via `FormData` to `/api/uploads`.
   - Server verifies authentication (`requireUser`), validates file type and size, and streams/uploads the buffer to **Cloudinary** using the `cloudinary` SDK (`cloudinary.v2.uploader.upload_stream`).
   - Server creates a `Media` document in MongoDB linked to the authenticated user and returns the saved media record (`{ _id, url, filename, altText }`).
2. **Entity Association**:
   - Person and User CMS forms receive the uploaded media `_id` and associate it with `photo` (or `cv`) when submitting create/update mutations.

---

## 2. Implementation Steps

### A. Dependencies & Environment Variables
- Install `cloudinary` npm package.
- Configure environment variables in `.env.local`:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `CLOUDINARY_UPLOAD_PRESET` (optional if using signed server upload)

### B. Upload API Route (`app/api/uploads/route.ts`)
- Implement `POST /api/uploads`:
  - Enforce authentication (`requireUser({ allowedRoles: ["admin", "editor"] })`).
  - Parse multipart form data (`formData()`).
  - Validate file presence, MIME type (`image/jpeg`, `image/png`, `image/webp`), and size limit (max 5MB).
  - Upload to Cloudinary.
  - Persist metadata in the `Media` model (`src/models/Media.ts`).
  - Return `{ data: mediaRecord }`.

### C. CMS UI Components & Forms
- Create a reusable `<ImageUploadField>` component (`components/cms/ImageUploadField.tsx`) allowing drag-and-drop or file selection with instant preview and upload status.
- Integrate `<ImageUploadField>` into:
  - `/cms/people/page.tsx` (for profile photo and CV).
  - `/cms/users/page.tsx` (for avatar/photo if applicable, or media selection).

---

## 3. Verification & Testing
1. **TypeScript Check**: Run `npx tsc --noEmit` to ensure type safety.
2. **Linting Check**: Run `npm run lint` for zero ESLint errors.
3. **Upload Testing**: Test uploading a sample image file through the CMS form and verify successful Cloudinary storage and MongoDB `Media` document creation.
