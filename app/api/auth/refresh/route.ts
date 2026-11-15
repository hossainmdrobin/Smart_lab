import { z } from "zod";

import { dbConnect } from "@/src/lib/db/connect";
import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import { authConfig } from "@/src/lib/auth/config";
import { REFRESH_COOKIE_NAME, SESSION_COOKIE_NAME } from "@/src/lib/auth/cookies";
import { generateRefreshToken, hashRefreshToken } from "@/src/lib/auth/refresh-tokens";
import { signAccessToken } from "@/src/lib/auth/jwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const allowedRoleSet = new Set(["admin", "editor"] as const);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    if (!refreshToken) {
      throw new ApiError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    await dbConnect();
    const tokenHash = hashRefreshToken(refreshToken);

    const { RefreshSession } = await import("@/src/models/RefreshSession");
    const record = await RefreshSession.findOne({
      tokenHash,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    })
      .lean()
      .exec();

    if (!record) {
      throw new ApiError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    await RefreshSession.updateOne(
      { _id: record._id },
      { $set: { revokedAt: new Date() } },
    ).exec();

    const { User } = await import("@/src/models/User");
    const user = await User.findById(record.userId)
      .select("email name role isActive")
      .lean()
      .exec();

    if (!user || !user.isActive || !allowedRoleSet.has(user.role)) {
      throw new ApiError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    const newSessionJwt = signAccessToken({
      userId: String(user._id),
      role: user.role,
      email: user.email,
    });

    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashRefreshToken(newRefreshToken);
    const refreshExpiresAt = new Date(
      Date.now() + authConfig.refreshTtlSeconds * 1000,
    );

    await RefreshSession.create({
      userId: user._id,
      tokenHash: newTokenHash,
      expiresAt: refreshExpiresAt,
    });

    const res = NextResponse.json({ data: { ok: true } });
    res.cookies.set(SESSION_COOKIE_NAME, newSessionJwt, {
      httpOnly: true,
      secure: authConfig.cookieSecure,
      sameSite: authConfig.cookieSameSite,
      path: "/",
      maxAge: authConfig.accessTtlSeconds,
    });
    res.cookies.set(REFRESH_COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: authConfig.cookieSecure,
      sameSite: authConfig.cookieSameSite,
      path: "/",
      maxAge: authConfig.refreshTtlSeconds,
    });

    return res;
  } catch (err) {
    if (err instanceof ApiError) {
      const status = err.code === "UNAUTHORIZED" ? 401 : 400;
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
