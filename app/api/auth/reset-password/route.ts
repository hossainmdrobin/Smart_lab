import { z } from "zod";

import { dbConnect } from "@/src/lib/db/connect";
import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import { authConfig } from "@/src/lib/auth/config";
import { NextResponse } from "next/server";

import { User } from "@/src/models/User";
import { AuthOtpToken } from "@/src/models/AuthOtpToken";
import { RefreshSession } from "@/src/models/RefreshSession";
import { resetPasswordSchema } from "@/src/lib/auth/schemas";

import { hashPassword } from "@/src/lib/auth/password";
import { verifyOtp } from "@/src/lib/auth/otp";
import { checkRateLimit, getClientIpFromHeaders } from "@/src/lib/auth/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIpFromHeaders(req.headers);
    const limiter = checkRateLimit({
      key: `reset_password:${ip}`,
      max: authConfig.rate.otpMax,
      windowMs: authConfig.rate.otpWindowMs,
    });
    if (!limiter.allowed) {
      throw new ApiError({ code: "RATE_LIMITED", message: "Too many requests" });
    }

    const body = await req.json().catch(() => undefined);
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError({ code: "BAD_REQUEST", message: "Invalid request payload" });
    }

    const { email, otp, newPassword } = parsed.data;
    await dbConnect();

    const tokenRecord = await AuthOtpToken.findOne({
      email,
      purpose: "password_reset",
      usedAt: { $exists: false },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!tokenRecord) {
      throw new ApiError({ code: "OTP_INVALID", message: "Invalid code" });
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      throw new ApiError({ code: "OTP_EXPIRED", message: "Code expired" });
    }

    const ok = await verifyOtp(otp, tokenRecord.tokenHash);
    if (!ok) {
      throw new ApiError({ code: "OTP_INVALID", message: "Invalid code" });
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new ApiError({ code: "OTP_INVALID", message: "Invalid code" });
    }

    const newHash = await hashPassword(newPassword);
    user.passwordHash = newHash;
    await user.save();

    await AuthOtpToken.updateOne(
      { _id: tokenRecord._id },
      { $set: { usedAt: new Date() } },
    ).exec();

    await RefreshSession.updateMany(
      { userId: user._id, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } },
    ).exec();

    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    if (err instanceof ApiError) {
      const status =
        err.code === "RATE_LIMITED" ? 429 : err.code === "BAD_REQUEST" ? 400 : 400;
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
