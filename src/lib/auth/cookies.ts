import { authConfig } from "@/src/lib/auth/config";

export const SESSION_COOKIE_NAME = "session";
export const REFRESH_COOKIE_NAME = "refresh_token";

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: authConfig.cookieSecure,
    sameSite: authConfig.cookieSameSite,
    path: "/",
  };
}

export function sessionCookieMaxAgeSeconds(): number {
  return authConfig.accessTtlSeconds;
}

export function refreshCookieMaxAgeSeconds(): number {
  return authConfig.refreshTtlSeconds;
}

export function clearCookieOptions() {
  return {
    ...cookieOptions(),
  };
}
