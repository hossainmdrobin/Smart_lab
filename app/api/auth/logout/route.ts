import { authConfig } from "@/src/lib/auth/config";
import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import {
  REFRESH_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "@/src/lib/auth/cookies";
import { hashRefreshToken } from "@/src/lib/auth/refresh-tokens";
import { requireUser } from "@/src/lib/auth/server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST() {
  try {
    const user = await requireUser({ allowedRoles: ["admin", "editor"] });
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    if (refreshToken) {
      const { RefreshSession } = await import("@/src/models/RefreshSession");
      const tokenHash = hashRefreshToken(refreshToken);

      await RefreshSession.updateMany(
        { userId: user.id, tokenHash, revokedAt: { $exists: false } },
        { $set: { revokedAt: new Date() } },
      ).exec();
    }

    const res = NextResponse.json({ data: { ok: true } });

    res.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: authConfig.cookieSecure,
      sameSite: authConfig.cookieSameSite,
      path: "/",
      maxAge: 0,
    });
    res.cookies.set(REFRESH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: authConfig.cookieSecure,
      sameSite: authConfig.cookieSameSite,
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (err) {
    if (err instanceof ApiError) {
      const status =
        err.code === "UNAUTHORIZED" ? 401 : err.code === "FORBIDDEN" ? 403 : 400;
      return new NextResponse(JSON.stringify(toErrorPayload(err)), {
        status,
        headers: { "content-type": "application/json" },
      });
    }

    if (err instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({
          error: {
            code: "BAD_REQUEST",
            message: "Invalid request payload",
          },
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    return new NextResponse(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "Something went wrong",
        },
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
