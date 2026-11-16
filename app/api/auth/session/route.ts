import { z } from "zod";

import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import { requireUser } from "@/src/lib/auth/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requireUser({ allowedRoles: ["admin", "editor"] });
    return NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (err) {
    if (err instanceof ApiError) {
      const status = err.code === "FORBIDDEN" ? 403 : 401;
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
