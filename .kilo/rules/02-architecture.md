# 02 - Architecture

## Framework conventions

- Next.js App Router (App Router only; no Pages Router)
- TypeScript strict mode for all application code
- React Server Components by default; Client Components (`'use client'`) only where interactivity is required
- `app/` directory for all routes, layouts, and page components
- Server-side code for all database operations via Mongoose (no client-side Mongoose)
- Tailwind CSS 4 for styling

## Server vs Client component boundaries

### Server Components (default)

- All database reads and writes
- Page layouts and shell components
- Static content pages (Home, About, Research, Publications, People, Contact)
- CMS list views and content rendering
- Metadata generation (generateMetadata)
- Image rendering via `next/image` with `sizes` prop
- API route handlers under `app/api/`

### Client Components (`'use client'`)

- Only interactive UI: contact form, filters, modals, toggles, mobile navigation, rich-text editor in the CMS
- Form state managed via Redux Toolkit where shared across routes
- RTK Query hooks (`useGetPublicationsQuery`, etc.) invoked from Client Components
- Animations and dynamic visuals (kept minimal per design direction)
- Never fetch directly from MongoDB; always call `app/api/` endpoints

## Directory structure

```
app/
  (public)/
    page.tsx          # Home
    about/page.tsx    # About
    research/page.tsx # Research
    people/page.tsx   # People directory
    people/[id]/page.tsx   # Person profile
    publications/page.tsx # Publications list
    publications/[id]/page.tsx  # Publication detail
    contact/page.tsx  # Contact + inquiry form
    (projects/page.tsx)       # Optional: Projects
    (opportunities/page.tsx)  # Optional: Opportunities
    (news/page.tsx)           # Optional: News & Updates
  (cms)/
    login/page.tsx
    dashboard/page.tsx
    people/page.tsx
    publications/page.tsx
    projects/page.tsx
    settings/page.tsx
  api/
    auth/
    people/
    publications/
    projects/
    research-themes/
    opportunities/
    contact/
    settings/
    uploads/
lib/
  db.ts              # Reused Mongoose connection
  mongoose.ts        # Mongoose instance and model registration
  redux/store.ts     # Redux Toolkit store
  redux/slices/      # Feature slices
  services/rtk/      # RTK Query API slices
  utils/             # Shared utilities
components/
  ui/                # Reusable primitive components
  public/            # Public-facing section components
  cms/               # CMS-specific components
  layout/            # Header, Footer, Layout wrappers
models/              # Mongoose model definitions (server only)
types/               # TypeScript type definitions
```

## Business logic separation

- Database operations live in `lib/services/` or route handlers, never inside UI components
- Validation schemas live near their API feature (e.g., `app/api/people/route.ts`)
- Business rules are pure functions in `lib/utils/`
- UI components receive data as props; they do not call Mongoose directly

## Mongoose architecture

- Single reused database connection (`lib/db.ts`)
- Mongoose models defined in `models/` (server-only)
- All models include `timestamps: true` (createdAt, updatedAt)
- Indexes added on frequently queried fields
- Validation occurs on the server before any write
- No client-side access to MongoDB credentials or connection strings

## API organization

- Route handlers under `app/api/<feature>/` organized by feature
- Each feature exports GET, POST, PUT, DELETE handlers as needed
- Validation, authentication, and authorization applied in each handler
- Consistent error responses with status codes and structured messages
