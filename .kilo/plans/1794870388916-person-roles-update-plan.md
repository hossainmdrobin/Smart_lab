# Person Roles Update Plan

## Goal
Update person roles in the Laboratory of Algorithmic Life Sciences application to:
1. Add the `"senior-research-associate"` role (display name: "Senior Research Associate").
2. Rename/replace the `"leadership"` role enum and label with `"principal-investigator"` (display name: "Principal Investigator").

## Affected Components & Files

### 1. Database Model (`src/models/Person.ts`)
- Update `role` field enum in `PersonSchema`:
  - Replace `"leadership"` with `"principal-investigator"`
  - Add `"senior-research-associate"`

### 2. API Validation (`app/api/people/route.ts`)
- Update Zod validation schema `personSchema`:
  - Replace `"leadership"` with `"principal-investigator"`
  - Add `"senior-research-associate"`

### 3. CMS Management UI (`app/cms/people/page.tsx`)
- Update `<select>` dropdown options for team member roles:
  - `<option value="principal-investigator">Principal Investigator</option>`
  - `<option value="senior-research-associate">Senior Research Associate</option>`
  - Update other options accordingly (`research-associate`, `research-assistant`, `student-trainee`, `collaborator`, `alumni`).

### 4. Public Directory Page (`app/people/page.tsx`)
- Update `displayMap` in `RoleLabel`:
  - `"principal-investigator": "Principal Investigator"`
  - `"senior-research-associate": "Senior Research Associate"`
- Update filtering logic and section headers:
  - Filter for principal investigators (`p.role === "principal-investigator"`) with section header `"Principal Investigators"`.
  - Filter for senior research associates (`p.role === "senior-research-associate"`) with section header `"Senior Research Associates"`.

### 5. Person Detail Page (`app/people/[id]/page.tsx`)
- Update `displayMap` in `RoleLabel`:
  - `"principal-investigator": "Principal Investigator"`
  - `"senior-research-associate": "Senior Research Associate"`

### 6. Seed Data & Documentation (`seed-data.example.json`, `docs/DATABASE_SCHEMA.md`, `docs/API_DOCUMENTATION.md`)
- Update any sample data or schema documentation referencing `"leadership"` to `"principal-investigator"`, and include `"senior-research-associate"`.

## Verification Plan
1. Run TypeScript type checking (`npx tsc --noEmit`).
2. Run project linting (`npm run lint`).
3. Verify database operations and UI rendering across public directory and CMS.
