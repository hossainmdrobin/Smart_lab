import { z } from "zod";

import { dbConnect } from "@/src/lib/db/connect";
import { authConfig } from "@/src/lib/auth/config";
import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import { checkRateLimit, getClientIpFromHeaders } from "@/src/lib/auth/rate-limit";
import { verifyPassword } from "@/src/lib/auth/password";
import { hashRefreshToken, generateRefreshToken } from "@/src/lib/auth/refresh-tokens";
import { loginSchema } from "@/src/lib/auth/schemas";
import { signAccessToken, type SessionJwtPayload } from "@/src/lib/auth/jwt";
import { REFRESH_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/src/lib/auth/cookies";
import { User } from "@/src/models/User";
import { RefreshSession } from "@/src/models/RefreshSession";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const ip = getClientIpFromHeaders(req.headers);
    const limiter = checkRateLimit({
      key: `login:${ip}`,
      max: authConfig.rate.loginMax,
      windowMs: authConfig.rate.loginWindowMs,
    });
    if (!limiter.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: {
            code: "RATE_LIMITED",
            message: "Too many requests",
          },
        }),
        {
          status: 429,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const body = await req.json().catch(() => undefined);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
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

    const { email, password } = parsed.data;
    await dbConnect();

    const user = await User.findOne({ email })
      .select("_id email passwordHash role name isActive")
      .lean()
      .exec();

    if (!user || !user.isActive) {
      throw new ApiError({
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      throw new ApiError({
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    }

    const payload: { userId: string; role: SessionJwtPayload["role"]; email: string } =
      {
        userId: String(user._id),
        role: user.role,
        email: user.email,
      };

    const sessionJwt = signAccessToken(payload);

    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const refreshExpiresAt = new Date(Date.now() + authConfig.refreshTtlSeconds * 1000);

    await RefreshSession.create({
      userId: user._id,
      tokenHash,
      expiresAt: refreshExpiresAt,
    });

    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } }).exec();

    const res = NextResponse.json({
      data: {
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });

    res.cookies.set(SESSION_COOKIE_NAME, sessionJwt, {
      httpOnly: true,
      secure: authConfig.cookieSecure,
      sameSite: authConfig.cookieSameSite,
      path: "/",
      maxAge: authConfig.accessTtlSeconds,
    });
    res.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: authConfig.cookieSecure,
      sameSite: authConfig.cookieSameSite,
      path: "/",
      maxAge: authConfig.refreshTtlSeconds,
    });

    return res;
  } catch (err) {
    if (err instanceof ApiError) {
      const status =
        err.code === "INVALID_CREDENTIALS" ? 401 : err.code === "RATE_LIMITED" ? 429 : 400;
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
