# 07 - Security Rules

## Authentication

- HTTPS enforced in production; administrator accounts protected
- Session-based authentication with HTTP-only cookies
- JWT access tokens (short-lived) and refresh tokens
- Role-based access control: Admin and Editor roles only
- Least-privilege access; users receive minimum permissions needed
- Session validated on every protected request

## Authorization

- Admin: manage accounts, settings, all content
- Editor: create, edit, publish content (people, publications, projects, news, opportunities); cannot manage users or settings
- Protected administrative routes and API endpoints require authentication + role check
- Never trust client-side authorization; all authorization enforced server-side
- Middleware protects `/cms/*` routes and `app/api/*` protected endpoints

## Input validation

- Validate all server inputs (Zod + Mongoose schema validation)
- Validate expected formats and intended use of submitted values
- Sanitize inputs to prevent injection attacks
- Contact form: name, email, institution/organization, inquiry subject, message — all validated server-side
- Never rely on browser checks alone

## Secrets

- No passwords or API keys in public code or client-side bundles
- Database credentials, JWT secrets, and API keys stored in environment variables only
- `.env.local` excluded from version control (`.gitignore`)
- Never commit secrets to the repository

## Rate limiting

- Contact form submissions rate-limited per IP
- Authentication endpoints rate-limited to prevent brute force
- CMS write endpoints rate-limited per authenticated user

## File uploads (restricted)

- No public file uploads initially
- If introduced: restrict file types and sizes, validate content, implement safe storage and access controls
- Images only for CMS avatar/header uploads; validated MIME type and size limits
- No executable files, archives, or unsupported types

## Privacy

- Privacy notice explaining contact-form data handling
- Agreed process for deleting inquiry data
- No private phone numbers, CVs, photos, or personal details published without explicit consent/approval
- Administrators control profile visibility; former members moved to alumni status

## Ownership

- Laboratory owns or directly controls: domain, hosting, CMS administrator access, source-code repository, content, analytics/search accounts, paid themes/assets/subscriptions
- Developer must not be the sole account owner
- Documented maintenance responsibility after launch

## Error handling

- Database errors do not leak internal details to the client
- Errors logged server-side only
- Generic error messages shown to users; detailed errors in server logs
