# Authentication system plan (CMS dashboard)

**Repo context (observed)**
- Next.js App Router project exists, but there are currently no `app/api/auth/*` routes, no `app/cms/*` pages, and no `middleware.ts`.
- Mongoose user model already exists at `src/models/User.ts` with:
  - `email` (unique, lowercase)
  - `passwordHash`
  - `role` = `admin | editor`
  - `name`
  - `isActive`
- Mongo connection helper exists at `src/lib/db/connect.ts` (uses `MONGODB_URI`).

## Goal
Implement an authentication system that allows authorized users (Admin/Editor) to access and maintain the CMS dashboard with these features:
1. Login/signup
2. OTP verification via email
3. Forget password
4. Change password

## One critical design decision (unresolved yet)
**How should public signup behave?**
- Option A (recommended for security): Only Admin creates accounts; “signup” is either disabled or implemented as invite-based and still requires Admin approval. OTP is then used for: (a) verifying email for password reset, and (b) finalizing password-reset flows.
- Option B: Public signup creates accounts after email OTP verification (no Admin approval).

The plan below includes both paths, but the final implementation must lock one option.

## Architecture approach (to align with existing requirements docs)
- Use **session-based authentication** with HTTP-only cookies.
- Store:
  - `session` cookie: short-lived JWT access token
  - `refresh_token` cookie: longer-lived refresh token
- Protected CMS routes are guarded by middleware and server-side role checks.

## Dependencies to add (if not already present)
Implementation agent should add the minimal required packages:
- `bcryptjs` (password hashing)
- `jsonwebtoken` (JWT access/refresh tokens)
- `zod` (request validation)
- `nodemailer` (email sending via SMTP)

Also confirm existing tooling for lint/ts.

## Database design (new models)
Create new Mongoose models (server-only under `src/models/`) with `timestamps: true`.

### 1) `AuthOtpToken`
Purpose: store hashed OTP tokens for both email verification and password reset.
- `email: string` (lowercased)
- `purpose: 'email_verification' | 'password_reset'`
- `tokenHash: string` (hash of the OTP)
- `expiresAt: Date`
- `usedAt?: Date`
- Indexes:
  - compound index on (`email`, `purpose`, `expiresAt`)

**Security rule**: Never store OTP plaintext; store hash.

### 2) `RefreshSession`
Purpose: refresh token rotation + server-side invalidation.
- `userId: ObjectId` (ref `User`)
- `tokenHash: string`
- `expiresAt: Date`
- `revokedAt?: Date`
- Indexes:
  - index on `userId`
  - index on `expiresAt`

### Refresh token flow behavior
- On login, create a refresh session record with hashed refresh token.
- On refresh:
  - validate refresh token cookie by comparing hash
  - revoke the old refresh session
  - issue and store a new refresh token + session

## API endpoints (under `app/api/auth/*`)
All endpoints must return JSON using the project’s documented error shape:
`{ error: { code, message, details? } }`.

### Public (no auth required)
1. `POST /api/auth/signup`
   - Request: `{ email, password, name }`
   - Behavior depends on the signup policy decision:
     - If Option A (admin-only): reject with 403/409 unless an Admin-created invite/session exists.
     - If Option B (public): create user with `isActive=false`, create `AuthOtpToken` (`purpose=email_verification`), email OTP.
   - Never reveal whether the email already exists.

2. `POST /api/auth/verify-email-otp`
   - Request: `{ email, otp }`
   - Verify `AuthOtpToken` (hash compare + expiry + usedAt)
   - If valid, set `User.isActive=true`
   - Mark OTP used.

3. `POST /api/auth/login`
   - Request: `{ email, password }`
   - Validate:
     - user exists
     - `isActive=true`
     - bcrypt password match
   - Issue:
     - `session` cookie (JWT access token)
     - `refresh_token` cookie (JWT or random value)
   - Update `User.lastLoginAt`.

4. `POST /api/auth/forgot-password`
   - Request: `{ email }`
   - Always respond with a generic success message (do not leak whether user exists).
   - If user exists and isActive:
     - create `AuthOtpToken` (`purpose=password_reset`)
     - email OTP

5. `POST /api/auth/reset-password`
   - Request: `{ email, otp, newPassword }`
   - Verify OTP (`AuthOtpToken` + expiry + usedAt)
   - Enforce password rules on server (min length, complexity if required).
   - Update `passwordHash`.
   - Mark OTP used.
   - Optional hardening: revoke all existing refresh sessions for that user.

### Protected (auth required)
6. `POST /api/auth/change-password`
   - Request: `{ currentPassword, newPassword }`
   - Requires authenticated user from `session` cookie.
   - Verify currentPassword, then update passwordHash.
   - Optional: revoke refresh sessions.

7. `POST /api/auth/logout`
   - Requires auth.
   - Revoke refresh session (hash compare) and clear cookies.

8. `POST /api/auth/refresh`
   - Uses refresh_token cookie, rotates refresh sessions, issues new `session`.

9. `GET /api/auth/session`
   - Returns current user metadata for UI.

## Session token contents and auth helpers
Implementation agent should define:
- JWT payload: `{ sub: userId, role, email }` (role used for quick checks, still re-validated server-side)
- Utility functions:
  - `getUserFromSession(sessionJwt)`
  - `requireAuth(request)` (throws 401)
  - `requireRole(request, allowedRoles)` (throws 403)

## Middleware: protect CMS routes
Add `middleware.ts` at repo root.
- Apply matcher to `'/cms/:path*'`.
- Steps:
  - If no `session` cookie -> redirect to `/cms/login`.
  - Verify JWT signature.
  - If invalid -> redirect to `/cms/login`.
  - Optionally attach role info via request headers for downstream use (implementation detail).

Server-side route handlers (API) and server components must still enforce RBAC.

## CMS routes (UI)
Create these App Router routes:
- `app/cms/login/page.tsx` (Client Component)
  - email + password
  - links to forgot password
  - on success, redirect to `/cms/dashboard`

- `app/cms/forgot-password/page.tsx` (Client Component)
  - email input
  - calls `POST /api/auth/forgot-password`

- `app/cms/reset-password/page.tsx` (Client Component)
  - email input + otp + newPassword
  - calls `POST /api/auth/reset-password`

- `app/cms/dashboard/page.tsx` (Server Component)
  - requires auth + role in `admin|editor`
  - show quick actions and recent activity (activity can be placeholder for now)

- `app/cms/change-password/page.tsx` OR integrate into settings
  - Server Component shell + Client form
  - calls `POST /api/auth/change-password`

**Admin-only routes** (RBAC within server components and API handlers):
- `/cms/settings` remains admin-only.

## Redux Toolkit / RTK Query integration (optional but aligns with requirements)
If the implementation already uses Redux/RTK Query patterns in later phases, add:
- `src/lib/redux/store.ts`
- `src/lib/redux/slices/authSlice.ts` (stores `user` + `status`)
- `src/lib/services/rtk/authApi.ts` (RTK Query endpoints for login/logout/refresh/session)

Client pages should:
- rely on cookies automatically
- dispatch auth actions or call RTK Query endpoints

## Rate limiting
Implementation agent should enforce rate limits on:
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- OTP verification endpoints

Use environment-configured limits.

## Email sending
Add SMTP-based email utility:
- env vars:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
  - `EMAIL_FROM`
  - `APP_BASE_URL` for links/branding (optional)
- Email body:
  - include OTP and expiry time
  - never include password reset links that could be abused unless OTP is also bound

## Error handling and security rules
- Generic responses for “email not found” in login/forgot-password.
- OTP verification errors should not reveal existence.
- All writes validated with Zod.
- Do not log plaintext passwords or OTPs.
- Always use constant-time hash comparisons where applicable.

## Rollout plan
1. Implement DB models + API endpoints first (no UI).
2. Add middleware + protect `/cms/dashboard`.
3. Implement login/forgot/reset/change-password pages.
4. Add `/api/auth/session` endpoint and wire dashboard auth gating.
5. Manual verification end-to-end.

## Validation / test cases
- Login:
  - valid credentials -> cookies set
  - invalid password -> generic error
  - inactive user -> denied
- OTP verification:
  - correct OTP -> activates user / allows reset
  - expired OTP -> denied
  - reused OTP -> denied
  - wrong OTP -> denied
- Forgot password:
  - existing email -> OTP emailed
  - non-existing email -> generic success
- Reset password:
  - uses OTP -> password changed
  - old refresh sessions revoked (if implemented)
- Change password:
  - currentPassword mismatch -> denied
  - success -> password updated

## Files to be created/updated (high level)
- New server routes: `app/api/auth/*/route.ts`
- New middleware: `middleware.ts`
- New UI pages: `app/cms/login`, `app/cms/forgot-password`, `app/cms/reset-password`, `app/cms/dashboard`, `app/cms/change-password` (or settings integration)
- New models: `AuthOtpToken`, `RefreshSession`
- New utilities: email sender, token helpers, cookie/JWT helpers, validation schemas

---
## Next step needed before finalizing
Lock the signup policy decision (public signup vs admin-only/invite).