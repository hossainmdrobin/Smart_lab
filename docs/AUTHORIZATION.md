# Authorization

## Source of truth

`docs/CLIENT_REQUIREMENTS.md` is the authoritative requirements document. This authorization document is an implementation recommendation derived from those requirements. All roles, permissions, and access rules are proposed and subject to client approval.

## Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Administrator** | Full system access | Manage user accounts, site settings, all content (people, publications, projects, news, opportunities), draft/publish control, media uploads |
| **Editor** | Content editing and publishing | Create, edit, publish content (people, publications, projects, news, opportunities); cannot manage users or site settings |

## Permissions matrix

| Resource | Administrator | Editor | Public |
|----------|--------------|--------|--------|
| Users (create, read, update, delete) | ✅ | ❌ | ❌ |
| Settings (read, update) | ✅ | ❌ | Read-only (public values) |
| People (create, read, update, delete, publish) | ✅ | ✅ | Read published only |
| Publications (create, read, update, delete, publish, feature) | ✅ | ✅ | Read published only |
| Projects (create, read, update, delete, publish, feature) | ✅ | ✅ | Read published only |
| News (create, read, update, delete, publish, feature) | ✅ | ✅ | Read published only |
| Opportunities (create, read, update, delete, publish) | ✅ | ✅ | Read open only |
| Media (upload, read, delete) | ✅ | ✅ | Read referenced images |
| Contact inquiries (read, mark read) | ✅ | ❌ | Submit only |
| CMS routes (`/cms/*`) | ✅ | ✅ | ❌ |

## Route protection

### Public routes (no authentication required)

- `/` — Home
- `/about` — About
- `/research` — Research
- `/people` — People directory
- `/people/[id]` — Person profile
- `/publications` — Publications list
- `/publications/[id]` — Publication detail
- `/contact` — Contact
- `/projects` — Projects (when content ready)
- `/opportunities` — Opportunities (when content ready)
- `/news` — News (when content ready)
- `/api/auth/login` — Login
- `/api/auth/refresh` — Token refresh
- `/api/contact` — Contact form submission
- Public read APIs under `/api/`

### Protected routes (authentication required)

- `/cms/login` — CMS login (redirects to dashboard if already authenticated)
- `/cms/dashboard` — CMS dashboard (admin, editor)
- `/cms/people` — CMS people management (admin, editor)
- `/cms/publications` — CMS publications management (admin, editor)
- `/cms/projects` — CMS projects management (admin, editor)
- `/cms/settings` — CMS settings (admin only)
- Protected APIs under `/api/` (write operations)

### Middleware

- Next.js middleware protects `/cms/*` routes
- Redirects unauthenticated users to `/cms/login`
- Redirects already-authenticated users away from `/cms/login` to `/cms/dashboard`
- Role-based checks within route handlers for admin-only endpoints

## Session management

### Authentication flow

1. User submits email/password to `POST /api/auth/login`
2. Server validates credentials against `User` model
3. Server issues:
   - Access token (JWT, short-lived, ~15 min) in HTTP-only cookie `session`
   - Refresh token (longer-lived, ~7 days) in HTTP-only cookie `refresh_token`
4. Client includes cookies automatically on subsequent requests
5. Server validates session cookie on protected requests
6. Access token refreshed via `POST /api/auth/refresh` using refresh token cookie
7. Logout via `POST /api/auth/logout` clears both cookies

### Cookie security

- `HttpOnly`: prevents client-side JavaScript access
- `Secure`: HTTPS only in production
- `SameSite=Strict` or `Lax`: CSRF protection
- `Path=/`: available site-wide
- Never stored in localStorage or sessionStorage

### Authorization enforcement

- All authorization checks performed server-side (route handlers, middleware)
- Client-side UI may hide/show elements based on role, but this is UX only — never a security boundary
- API route handlers verify user role before processing write operations
- Editors cannot access admin-only endpoints (settings, user management)
- Attempted unauthorized access returns 403 Forbidden

## CMS access control

### Administrator

- Full access to all CMS routes
- Can create, edit, delete users
- Can update site settings
- Can manage all content (draft/publish/feature/archive)
- Can upload/delete media

### Editor

- Access to CMS routes except `/cms/settings` and user management
- Can create, edit, publish people, publications, projects, news, opportunities
- Can upload media
- Cannot manage users or site settings

### Public

- No access to `/cms/*` routes
- Read-only access to published content via public APIs

## Contact form

- No authentication required to submit
- Server-side validation only
- Rate-limited per IP
- Submissions stored in `ContactInquiry` collection
- Delivered to designated inbox (configured in settings)
- Privacy notice explains data handling

## Security notes

- Never trust client-side authorization; all checks server-side
- Role stored in session token, verified on each request
- Passwords hashed with bcrypt; never stored plaintext
- No passwords or API keys in public code or client bundles
- Database credentials in environment variables only
- Laboratory owns CMS administrator access; developer is not sole account owner
