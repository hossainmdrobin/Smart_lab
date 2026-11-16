import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyAccessToken } from "@/src/lib/auth/jwt";

export const runtime = "nodejs";

export const config = {
  matcher: ["/cms/:path*"],
};

export default function middleware(req: NextRequest) {
  const sessionJwt = req.cookies.get("session")?.value;
  const url = req.nextUrl;
  const pathname = url.pathname;

  const redirectToLogin = () => {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/cms/login";
    return NextResponse.redirect(loginUrl);
  };

  const isLoginPage = pathname === "/cms/login";

  if (!sessionJwt) {
    if (isLoginPage) return NextResponse.next();
    return redirectToLogin();
  }

  try {
    verifyAccessToken(sessionJwt);
  } catch {
    if (isLoginPage) return NextResponse.next();
    return redirectToLogin();
  }

  if (isLoginPage) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/cms/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}
