# 04 - Database Rules

## Connection management

- Reuse a single Mongoose connection across the application (`lib/db.ts`)
- Connection established once per serverless function invocation; cached globally
- Never open a new connection per request
- Connection errors handled centrally with retry logic where appropriate

## Mongoose models

- Models defined in `models/` directory; server-only (never imported into Client Components)
- Each model file exports the Mongoose model and its TypeScript interface
- Model names: PascalCase singular (`Person`, `Publication`, `Project`, `ResearchTheme`, `User`, `News`, `Opportunity`, `Media`, `Setting`)
- All models include `timestamps: true` (createdAt, updatedAt)

## Schema validation

- Validate all server inputs using Mongoose schema validation (required, minlength, maxlength, enum, pattern)
- Additional validation with Zod at the API layer before persistence
- Required fields enforced at the database level
- Optional fields clearly marked
- Never trust client-side validation alone

## Indexes

- Add indexes on frequently queried fields:
  - `Person`: role, status (current/alumni), slug
  - `Publication`: year, researchTheme, featured, type, status
  - `Project`: researchTheme, status (ongoing/completed), featured
  - `ResearchTheme`: slug, featured
  - `News`: publishedAt, featured
  - `Opportunity`: status, deadline
  - `User`: email, role
- Compound indexes where queries filter on multiple fields

## Relationships

### People <-> Publications
- A Person can be related to multiple Publications (many-to-many via `relatedPeople` array of ObjectIds on Publication, and `selectedPublications` on Person)
- Publications store `relatedPeople: [mongoose.Schema.Types.ObjectId]` referencing `Person`

### People <-> Projects
- A Person can be on multiple Projects; a Project has a team of People (many-to-many)
- Projects store `team: [mongoose.Schema.Types.ObjectId]` referencing `Person`

### People <-> Research Themes
- A Person can have research interests in multiple themes; themes relate to people indirectly through publications and projects
- Person stores `researchInterests: [mongoose.Schema.Types.ObjectId]` referencing `ResearchTheme`

### Publications <-> Projects
- A Publication can be related to one or more Projects (many-to-many)
- Publications store `relatedProject: mongoose.Schema.Types.ObjectId` referencing `Project` (optional single), or `relatedProjects: [ObjectId]` for multiple

### Publications <-> Research Themes
- A Publication is tagged with one or more Research Themes (many-to-many)
- Publications store `researchTags: [mongoose.Schema.Types.ObjectId]` referencing `ResearchTheme`

### Projects <-> Research Themes
- A Project belongs to one or more Research Themes (many-to-many)
- Projects store `researchTheme: [mongoose.Schema.Types.ObjectId]` referencing `ResearchTheme`

## Draft / published states

- Content models (Person, Publication, Project, News, Opportunity) include a `status` field: `draft` | `published` | `archived`
- Draft content is never rendered on the public site
- CMS controls publishing; editors can save drafts and preview
- Default status for new records: `draft`

## Soft deletion

- Use `isDeleted` boolean or `deletedAt` timestamp instead of hard deletes where content may need restoration
- Archived content remains in the database but is not publicly visible

## Timestamps

- `createdAt` and `updatedAt` on every model via `timestamps: true`
- `publishedAt` for content with a publication date (Publication, News, Project)
- Never expose raw timestamps to the public unless semantically meaningful (e.g., publication year)

## Data integrity

- Never fabricate laboratory information (publications, team members, affiliations, DOIs)
- Use clearly identified placeholders for missing content
- Placeholder content must be marked and never published
- Handle database errors consistently with try/catch and standardized error responses

## Server-side validation

- All write operations validate input on the server
- No client-side bypass of validation
- Required fields checked before save
- Enum values constrained to allowed options

## Error handling

- Database errors caught and converted to structured API error responses
- Connection failures return 503 with retry guidance
- Validation failures return 400 with field-specific messages
- Not found returns 404; unauthorized returns 401/403
