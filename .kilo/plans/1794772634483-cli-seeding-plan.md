# CLI seeding application plan (users + draft-safe CMS placeholders)

## Goal
Create a CLI script that seeds:
1. Initial CMS users (Admin and Editor) with hashed passwords.
2. Initial CMS content needed to start editing in the dashboard, while avoiding accidental public-site changes.

The default seeding scope is **"Draft-safe CMS data"**:
- Create Research Themes and placeholder CMS records.
- Ensure public-facing homepage cards do not become populated with placeholder data.

## Non-goals / Constraints
- No OTP refresh/session token records created by the CLI (seed only users).
- Do not fabricate people/publication/project details as real verified content. Seed only **clearly marked placeholders**.
- CLI must be idempotent (safe to run multiple times).
- No destructive behavior by default.

## Key decisions (locked)
1. Signup policy is admin-only/invite (public signup disabled). Seed therefore focuses on provisioning initial Admin/Editor accounts.
2. Seed scope: **Draft-safe CMS data** (themes + draft records; avoid public visibility).
3. Idempotency: **dedupe by email/slug/title(+year/type when applicable)**.
4. Initial roles: **Admin + Editor**.
5. Placeholder publication year: **fixed year** (use `2000` by default).

## CLI interface
### Command
- Run: `npx tsx <path-to-cli>/seed.ts [options]`

### Options
- `--admin-email <email>` (required)
- `--admin-password <password>` (required)
- `--editor-email <email>` (optional; default to `admin-email` with different password or create only admin depending on implementation choice)
- `--editor-password <password>` (optional)
- `--seed-scope <draft-safe|user-only|public-samples>` (default: `draft-safe`)
- `--year <number>` (default: `2000`) used for placeholder publications
- `--wipe` (optional, default: false)
  - When true, only remove records that match the CLI seed identity keys.

### Environment variables (recommended)
Use env vars for secrets/connection only; accept credentials via env vars to keep logs safe:
- `MONGODB_URI`
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
- `SEED_EDITOR_EMAIL`, `SEED_EDITOR_PASSWORD` (optional)
- (Optional) `AUTH_BCRYPT_ROUNDS` if you want to match server hashing configuration.

## Seed data design
### 1) Users (required for auth)
- Collection: `User`
- Fields:
  - `email` (lowercase, unique)
  - `passwordHash` (bcrypt hash)
  - `role`: `admin` and `editor`
  - `name`: placeholder like "CMS Seed Admin" / "CMS Seed Editor" (placeholder label must be obvious)
  - `isActive`: `true`

Idempotency rules:
- Dedup by `User.email`.
- If user exists, update only `role` and `isActive=true` (do not reset password by default unless `--wipe` or `--reset-password` is introduced).

### 2) ResearchTheme placeholders
- Collection: `ResearchTheme`
- Seed the themes derived from the confirmed research areas in `docs/CLIENT_REQUIREMENTS.md`.
- Since the homepage/menus may bundle ML+AI, ensure both themes exist for CMS editing.

Proposed theme list (7 themes from CLIENT_REQUIREMENTS):
- Computational Drug Design
- Density Functional Theory (DFT)
- Molecular Docking
- Molecular Dynamics Simulation
- Network Pharmacology
- Machine Learning
- Artificial Intelligence in Drug Discovery

For each theme:
- `slug`: slugify name (kebab-case)
- `featured`: false
- `description`: placeholder text (e.g., "Content pending. Replace with laboratory-approved description before launch.")
- `order`: incremental starting at 0

Idempotency rules:
- Dedup by `slug` (unique constraint exists).
- Upsert: update `name/description/order` on subsequent runs.

### 3) People placeholders (draft-safe)
Goal: avoid changing what the public homepage shows.
- Collection: `Person`
- Strategy: set `status` to `alumni` so homepage filters (`status=current`) remain unchanged.
- Provide 1–2 placeholder alumni entries per role category if needed for CMS UI testing.

Idempotency rules:
- Dedup by unique-ish combination; ideally by `email` if provided.
- If `email` is omitted (optional in schema), dedupe by `fullName + role + status`.

Placeholder labeling:
- `fullName`: include "Placeholder" suffix.
- `bio`: "Content pending".

### 4) Publications placeholders (draft-only)
- Collection: `Publication`
- Set:
  - `status`: `draft`
  - `featured`: false
  - `year`: default `2000` (configurable via `--year`)
  - `type`: choose from enum: `journal-article | review | preprint | other`
  - `researchTags`: link to seeded ResearchTheme ObjectIds
  - `authors`, `journal`, `title`, etc.: placeholder, clearly marked as pending.

Idempotency rules:
- Dedup by (`title`, `year`, `type`, `status=draft`).

### 5) Projects placeholders (draft-only)
- Collection: `Project`
- Set:
  - `status`: `draft`
  - `featured`: false
  - `researchTheme`: at least one seeded ResearchTheme
  - `title`, `summary`, `methods`: placeholder text

Idempotency rules:
- Dedup by (`title`, `status=draft`).

### 6) Settings / Media
- Not required for auth correctness.
- For this plan’s “draft-safe” scope, do not seed public-facing `Setting` keys unless needed for the CMS UI to function.
- Do not seed `Media` without real files/URLs.

## Execution flow (implementation outline)
1. **Load configuration**
   - Read `MONGODB_URI` from env.
   - Read seed user emails/passwords from env or CLI args.
   - Validate inputs (fail fast).
2. **Connect to MongoDB**
   - Reuse the existing connection helper `src/lib/db/connect.ts` (or its documented equivalent).
3. **Optional wipe**
   - If `--wipe` true, delete only records created by the CLI identity keys.
   - If identity keys cannot be stored (no schema field), use strict matching on:
     - Users by email
     - ResearchTheme by slug
     - Publications by (`status=draft` + `title` conventions)
     - Projects by (`status=draft` + `title` conventions)
     - People by (`status=alumni` + `fullName` prefix conventions)
4. **Seed users**
   - Hash passwords with bcryptjs.
   - Upsert users by email.
5. **Seed ResearchThemes**
   - Upsert by slug.
6. **Seed People / Publications / Projects** depending on `--seed-scope`.
7. **Output**
   - Print a summary table (counts created/updated, skipped).
   - Exit non-zero only on hard failures (missing env, DB connection failure, validation errors).

## Identity keys for idempotency (practical approach)
Because current schemas do not include a dedicated `seedSourceKey` field, use deterministic conventions:
- Users: exact `email`.
- Themes: exact `slug`.
- People: `fullName` starts with `Seed Placeholder -`.
- Publications: `status=draft` AND `title` starts with `Seed Placeholder -`.
- Projects: `status=draft` AND `title` starts with `Seed Placeholder -`.

## `.env.example` deliverable
Create `.env.example` (implementation agent) containing **non-secret placeholders** for:
- `MONGODB_URI`
- Auth secrets (even if CLI doesn’t need them):
  - `AUTH_JWT_SECRET` (or `AUTH_ACCESS_TOKEN_SECRET` / `AUTH_REFRESH_TOKEN_SECRET` if supported)
  - `AUTH_ACCESS_TOKEN_TTL_SECONDS`
  - `AUTH_REFRESH_TOKEN_TTL_SECONDS`
- Email/OTP-related (if OTP flows are used by the app):
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- Seeding credentials:
  - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
  - `SEED_EDITOR_EMAIL`, `SEED_EDITOR_PASSWORD`

## Failure modes and safety
- Missing/invalid env: exit with clear message.
- If SMTP config missing: do not fail CLI (since CLI doesn’t send OTP emails).
- Partial failure: CLI should stop and report what succeeded.
- Avoid public content drift: enforce draft-only statuses and `featured=false`.

## Validation plan
- After seeding, run read-only checks:
  - Users exist with `isActive=true` and correct roles.
  - ResearchThemes exist with correct slugs.
  - Publications with `status=draft` only.
  - Projects with `status=draft` only.
  - People are `status=alumni`.

## Open question (to confirm before coding)
Whether the CLI should accept `SEED_ADMIN_*`/`SEED_EDITOR_*` from env only, or also support `--admin-email/--admin-password` flags.

Recommended: support env vars only at first (more secure; less chance passwords end up in shell history).
