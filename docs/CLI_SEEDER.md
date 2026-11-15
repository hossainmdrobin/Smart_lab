# CLI Seeder (Users + Draft-safe CMS Placeholders)

## What this does

Seeds initial CMS content for **Laboratory of Algorithmic Life Sciences** while keeping the public website safe during development.

- Creates initial **Admin** user (required)
- Optionally creates an **Editor** user
- Creates **ResearchTheme** placeholders (7 confirmed themes)
- Optionally seeds placeholder **People / Publications / Projects** depending on `--seed-scope`

Idempotent: re-running the script updates the same records rather than duplicating them.

## Requirements

- Node tooling available via `npx`
- MongoDB connection string in `MONGODB_URI`
- Seed credentials for the initial accounts

## Configure environment

1. Copy the provided template:
   - `C:\projects\my-app\.env.example` → `C:\projects\my-app\.env.local`
2. Set:
   - `MONGODB_URI`
   - `SEED_ADMIN_EMAIL`
   - `SEED_ADMIN_PASSWORD`
   - (optional) `SEED_EDITOR_EMAIL` and `SEED_EDITOR_PASSWORD`

## Run

Use:

```bash
npx tsx src/cli/seed.ts [options]
```

### Options

- `--admin-email <email>`
- `--admin-password <password>`
- `--editor-email <email>`
- `--editor-password <password>`
- `--seed-scope <draft-safe|user-only|public-samples>` (default: `draft-safe`)
- `--year <number>` (default: `2000`) used for placeholder publication year
- `--wipe` (optional)
  - Removes only records matching the seeder identity conventions (users by email; themes by slug; placeholder records by `Seed Placeholder -` naming)

## Seed scopes (important)

### `draft-safe` (default)

Designed to avoid accidental public homepage population:

- People are seeded as `status=alumni` (so they do not appear in the homepage “current members” section)
- Publications are `status=draft`
- Projects are `status=draft`
- `featured=false` for Publications and Projects

### `user-only`

- Seeds only Admin/Editor users
- Does not seed themes/content relationships

### `public-samples`

- Seeds “public-facing” sample content for CMS UI testing:
  - People: `status=current`
  - Publications: `status=published` and `featured=true`
  - Projects: `status=ongoing` and `featured=true`

Use this scope only when you intentionally want homepage and public sections to reflect the seeded data.

## Examples

### Draft-safe (recommended)

```bash
npx tsx src/cli/seed.ts --seed-scope draft-safe --year 2000
```

### User-only

```bash
npx tsx src/cli/seed.ts --seed-scope user-only
```

### Public samples (CMS UI testing)

```bash
npx tsx src/cli/seed.ts --seed-scope public-samples --year 2000
```

### With explicit admin credentials (overrides env)

```bash
npx tsx src/cli/seed.ts \
  --seed-scope draft-safe \
  --admin-email admin@example.com \
  --admin-password "replace-me"
```

### Wipe only the seeder identity records, then reseed

```bash
npx tsx src/cli/seed.ts --seed-scope draft-safe --wipe
```

## Notes

- The seeder **does not** create OTP/refresh/session records.
- Passwords are hashed using the app’s configured bcrypt rounds (`AUTH_BCRYPT_ROUNDS`).
- If `MONGODB_URI` is missing, the script fails fast.
