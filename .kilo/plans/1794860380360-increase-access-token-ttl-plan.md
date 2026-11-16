# Plan: Increase Access Token TTL to 1 Hour

## Problem Statement
The current access token (`session` cookie) expires after 15 minutes (`60 * 15` seconds), causing users working in the CMS dashboard to be redirected to login after 15 minutes of inactivity or session duration. The user wants to increase this duration to 1 hour (`3600` seconds / `60 * 60`).

---

## Proposed Changes

### 1. Update `src/lib/auth/config.ts`
- Change `accessTtlSeconds` default value from `60 * 15` (15 minutes) to `60 * 60` (1 hour).
- Alternatively or additionally, support `AUTH_ACCESS_TOKEN_TTL_SECONDS` environment variable (which already defaults to `60 * 15`, can be updated or overridden).

---

## Verification Plan
1. Run TypeScript check: `npx tsc --noEmit`
2. Run linter: `npm run lint`
3. Verify that new login sessions issue a `session` cookie with `maxAge` set to 1 hour (3600 seconds).
