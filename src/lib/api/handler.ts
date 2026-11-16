import { NextResponse } from "next/server";
import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import { z } from "zod";

export function handleApiError(err: unknown) {
  if (err instanceof ApiError) {
    const statusMap: Record<string, number> = {
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      BAD_REQUEST: 400,
    };
    const status = statusMap[err.code] || 400;
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
          message: "Validation error",
          details: err.flatten().fieldErrors,
        },
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
  console.error("API error:", err);
  return new NextResponse(
    JSON.stringify({
      error: {
        code: "INTERNAL_ERROR",
        message: err instanceof Error ? err.message : "Internal server error",
      },
    }),
    { status: 500, headers: { "content-type": "application/json" } }
  );
}

export function sendOk<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json(
    {
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}
