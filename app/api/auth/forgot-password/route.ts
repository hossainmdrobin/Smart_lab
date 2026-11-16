import { z } from "zod";

import { dbConnect } from "@/src/lib/db/connect";
import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import { authConfig } from "@/src/lib/auth/config";
import { generateOtp, hashOtp } from "@/src/lib/auth/otp";
import { sendOtpEmail } from "@/src/lib/auth/email";
import { NextResponse } from "next/server";

import { User } from "@/src/models/User";
import { AuthOtpToken } from "@/src/models/AuthOtpToken";
import { forgotPasswordSchema } from "@/src/lib/auth/schemas";
import { checkRateLimit, getClientIpFromHeaders } from "@/src/lib/auth/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIpFromHeaders(req.headers);
    const limiter = checkRateLimit({
      key: `forgot_password:${ip}`,
      max: authConfig.rate.forgotMax,
      windowMs: authConfig.rate.forgotWindowMs,
    });
    if (!limiter.allowed) {
      throw new ApiError({ code: "RATE_LIMITED", message: "Too many requests" });
    }

    const body = await req.json().catch(() => undefined);
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError({ code: "BAD_REQUEST", message: "Invalid request payload" });
    }

    const { email } = parsed.data;
    await dbConnect();

    const user = await User.findOne({ email }).exec();

    if (!user || !user.isActive) {
      return NextResponse.json({
        data: { message: "If an account exists, a code has been sent to your email." },
      });
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + authConfig.otpTtlSeconds * 1000);

    await AuthOtpToken.create({
      email,
      purpose: "password_reset",
      tokenHash: otpHash,
      expiresAt,
    });

    await sendOtpEmail({
      toEmail: email,
      otp,
      purpose: "password_reset",
      expiresAt,
    });

    return NextResponse.json({
      data: { message: "If an account exists, a code has been sent to your email." },
    });
  } catch (err) {
    if (err instanceof ApiError) {
      const status = err.code === "RATE_LIMITED" ? 429 : err.code === "BAD_REQUEST" ? 400 : 400;
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
