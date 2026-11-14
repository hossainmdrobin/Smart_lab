# 05 - API Rules

## RTK Query conventions

- API slices organized by feature under `services/rtk/`
- One API slice per feature: `peopleApi`, `publicationsApi`, `projectsApi`, `researchThemesApi`, `opportunitiesApi`, `contactApi`, `authApi`, `settingsApi`
- Each slice defines endpoints for list, detail, create, update, delete as applicable
- Use `query` for reads and `mutation` for writes
- Tag types for invalidation and cache updates (`People`, `Publications`, `Projects`, `ResearchThemes`, `Opportunities`, `Settings`)
- Loading, success, and error states handled via RTK Query hooks (`isLoading`, `isError`, `data`, `error`)

## Endpoint organization

```
app/api/
  auth/           # login, logout, session, register (if needed)
  people/         # list, detail, create, update, delete
  publications/   # list, detail, create, update, delete
  projects/       # list, detail, create, update, delete
  research-themes/# list, detail, create, update, delete
  opportunities/  # list, detail, create, update, delete
  contact/        # inquiry form submission
  settings/       # site settings, contact details, social links
  uploads/        # image upload (restricted types/sizes)
```

## Request/response format

- All API responses return JSON
- Success responses: `{ data: T, meta?: {...} }`
- Error responses: `{ error: { code: string, message: string, details?: Record<string, string> } }`
- HTTP status codes: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 429 (Too Many Requests), 500 (Server Error)

## Authentication

- Session-based authentication via HTTP-only cookies
- JWT access tokens with short expiry; refresh tokens rotated
- Admin and Editor roles enforced on protected routes
- Never store tokens in localStorage or expose in client code
- Session validated on every protected API request

## Authorization

- Admin: full access to all CMS content, user accounts, settings
- Editor: create, edit, publish content (people, publications, projects, news, opportunities); cannot manage users or site settings
- Route protection middleware checks role before processing request
- Never trust client-side authorization; all checks performed server-side

## Input validation

- Zod schemas defined for every request body and query parameter
- Validation occurs before any database operation
- Error responses include field-specific validation messages
- Sanitize inputs to prevent injection attacks

## Error handling

- All errors caught centrally; structured error responses returned
- Database errors do not leak internal details to the client
- Logging of errors server-side only (never in client code)
- Consistent error shape across all endpoints

## Rate limiting

- Contact form submissions rate-limited per IP
- Authentication endpoints rate-limited to prevent brute force
- CMS write endpoints rate-limited per authenticated user
- Limits configured via environment variables

## Caching

- RTK Query manages client-side cache with automatic refetch on focus/reconnect
- Server-side: Next.js route handlers are not cached unless explicitly opted in
- Public content may use Next.js cache tags for ISR where appropriate
- Never cache authenticated user data
