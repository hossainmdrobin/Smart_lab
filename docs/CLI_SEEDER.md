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
- Seed credentials and all seed content in `seed-data.json`

## Configure environment

1. Copy the provided template:
   - `C:\projects\my-app\.env.example` → `C:\projects\my-app\.env.local`
2. Set:
   - `MONGODB_URI`
   - (optional) `AUTH_BCRYPT_ROUNDS` to control password hashing rounds

## Run

Use:

```bash
npx tsx src/cli/seed.ts
```

### Data source

This seeder reads `seed-data.json` from the project root.

If the file does not exist, create it from `seed-data.example.json`.

## Seed data format

Edit `seed-data.json` to match what you want inserted.

Key fields supported:

- `wipe` (optional boolean): when `true`, deletes users by `email` and research themes by `slug`. It also supports wiping placeholder People/Publications/Projects when `fullName/title` are prefixed with `Seed Placeholder -`.
- `users`: array of `{ email, role: "admin"|"editor", name, isActive, password }`
- `researchThemes`: array of `{ name, slug?, description?, featured?, order? }`
- `people`: array of `{ fullName, role, status: "current"|"alumni", bio?, email?, researchInterests?: string[] (theme slugs), order? }`
- `publications`: array of `{ title, authors[], journal, year, type, status, researchTags?: string[] (theme slugs), abstract?, featured? }`
- `projects`: array of `{ title, summary, researchTheme?: string[] (theme slugs), status, methods?, team?, featured? }`

## Notes

- The seeder **does not** create OTP/refresh/session records.
- Passwords are hashed using the app’s configured bcrypt rounds (`AUTH_BCRYPT_ROUNDS`).
- If `MONGODB_URI` is missing, the script fails fast.
