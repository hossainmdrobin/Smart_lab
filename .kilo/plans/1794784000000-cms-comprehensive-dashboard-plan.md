# CMS Comprehensive Dashboard & CRUD Architecture Plan

## Overview
This plan defines the architecture, data models, API endpoints, Redux/RTK Query integration, and UI views required to build a complete, production-ready Content Management System (CMS) for the **Laboratory of Algorithmic Life Sciences**.

## 1. Number of Dashboards: Architectural Decision
- **Single Unified CMS Application**: Exactly **one** cohesive CMS dashboard application is required (living under `app/cms/`).
- **Why a Single Dashboard?**: Maintaining separate dashboard apps would fracture authentication, state management, and maintenance. Instead, a single unified CMS shell with a responsive navigation sidebar (`app/cms/layout.tsx` + `components/cms/CmsSidebar.tsx`) handles all administrative and editorial workflows through role-based access control (Admin and Editor roles).

---

## 2. Content Management Scope (CRUD Entities)
To fully satisfy client requirements and database models, the CMS must support CRUD operations for the following 8 entity domains:

1. **Users Management** (`/cms/users` - Admin Only)
   - List users, create editor/admin accounts, update roles, toggle active status, reset passwords.
2. **People / Team Directory** (`/cms/people` - Admin & Editor)
   - Manage laboratory members across categories (leadership, research associates, research assistants, students/trainees, collaborators, alumni), bio, research interests, social links, profile photos, CVs, and status.
3. **Publications** (`/cms/publications` - Admin & Editor)
   - Manage scientific publications, journal articles, reviews, preprints; set authors, year, DOI, publisher URL, research tags, related people, and **homepage featuring**.
4. **Projects** (`/cms/projects` - Admin & Editor)
   - Manage ongoing and completed research projects, public summaries, research themes, team members, status (ongoing/completed/draft), and featured status.
5. **Research Themes** (`/cms/research-themes` - Admin & Editor)
   - Manage core research areas (Computational Drug Design, DFT, Molecular Docking, MD Simulation, Network Pharmacology, Machine Learning, AI in Drug Discovery), descriptions, slugs, and display order.
6. **Opportunities** (`/cms/opportunities` - Admin & Editor)
   - Manage research positions, student opportunities, internships, eligibility, deadlines, and open/closed status.
7. **News & Updates** (`/cms/news` - Admin & Editor)
   - Manage announcements, publication highlights, and lab events with publication dates and featured states.
8. **Settings & Media Library** (`/cms/settings` & `/cms/media` - Admin for settings, Admin/Editor for media)
   - Manage site-wide contact details, social links, and uploaded images/files.

---

## 3. Technical Implementation Architecture

### A. API Layer (`app/api/`)
Build standardized RESTful API route handlers for each entity under `app/api/<feature>/`:
- `GET /api/<feature>` — List with pagination, search, status filters (`draft`, `published`, `archived`), and sorting.
- `POST /api/<feature>` — Create new record with Zod server-side validation and Mongoose persistence.
- `GET /api/<feature>/[id]` — Retrieve single record detail.
- `PUT /api/<feature>/[id]` — Update record with validation and `updatedAt` refresh.
- `DELETE /api/<feature>/[id]` — Soft delete (`isDeleted: true`) or hard delete where appropriate.

### B. State Management & API Communication (`lib/redux/` & `services/rtk/`)
- Establish Redux Toolkit store (`lib/redux/store.ts`) and RTK Query API slices (`lib/services/rtk/`) for each feature (`peopleApi`, `publicationsApi`, `projectsApi`, `researchThemesApi`, `opportunitiesApi`, `newsApi`, `usersApi`, `settingsApi`, `uploadsApi`).
- Configure tag-based cache invalidation (`Tags`: `People`, `Publications`, `Projects`, `ResearchThemes`, `Opportunities`, `News`, `Users`, `Settings`) to ensure instant UI updates upon mutation.

### C. UI Component Structure (`components/cms/`)
- **Layout Shell**: Responsive sidebar navigation (`CmsSidebar`) + header + main content area.
- **Data Tables**: Reusable table component with sorting, search input, status badges, pagination, and action buttons (Edit, Delete, Preview).
- **Forms / Modals**: Reusable form components with Zod/React Hook Form, error handling, image upload previews, and rich selection dropdowns for related entities (e.g., selecting research tags and team members).

---

## 4. Verification & Testing Plan
1. **Type Safety**: Run `npx tsc --noEmit` after implementing all models, API routes, and components.
2. **Linting**: Run `npm run lint` to enforce zero ESLint errors.
3. **Role Enforcement**: Verify that Admin-only routes (User management, Site Settings) correctly reject Editor role access with 403 Forbidden responses.
4. **CRUD Workflow Verification**: Test create, read, update, and delete flows for each CMS entity in the browser staging environment.
