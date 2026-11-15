import { authConfig } from "@/src/lib/auth/config";
import {
  REFRESH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  refreshCookieMaxAgeSeconds,
  sessionCookieMaxAgeSeconds,
} from "@/src/lib/auth/cookies";

export function setSessionCookie(res: Response, sessionJwt: string) {
  // nextResponse-like cookies API is available in Route Handlers.
  const r = res as unknown as { cookies: { set: (...args: unknown[]) => void } };
  r.cookies.set(SESSION_COOKIE_NAME, sessionJwt, {
    httpOnly: true,
    secure: authConfig.cookieSecure,
    sameSite: authConfig.cookieSameSite,
    path: "/",
    maxAge: sessionCookieMaxAgeSeconds(),
  });
}

export function setRefreshCookie(res: Response, refreshToken: string) {
  const r = res as unknown as { cookies: { set: (...args: unknown[]) => void } };
  r.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: authConfig.cookieSecure,
    sameSite: authConfig.cookieSameSite,
    path: "/",
    maxAge: refreshCookieMaxAgeSeconds(),
  });
}

export function clearCookie(res: Response, name: string) {
  const r = res as unknown as { cookies: { set: (...args: unknown[]) => void } };
  r.cookies.set(name, "", {
    httpOnly: true,
    secure: authConfig.cookieSecure,
    sameSite: authConfig.cookieSameSite,
    path: "/",
    maxAge: 0,
  });
}
