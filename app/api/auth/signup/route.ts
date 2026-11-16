import { z } from "zod";

import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import { signupSchema } from "@/src/lib/auth/schemas";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => undefined);
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError({ code: "BAD_REQUEST", message: "Invalid request payload" });
    }

    // Locked decision (per plan): Admin-only signup/invite.
    throw new ApiError({
      code: "FORBIDDEN",
      message: "Signup is not available. Please contact the laboratory admin.",
    });
  } catch (err) {
    if (err instanceof ApiError) {
      const status = err.code === "FORBIDDEN" ? 403 : 400;
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
        { status: 400, headers: { "content-type": "application/json" } },
      );
    }

    return new NextResponse(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "Something went wrong",
        },
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}
