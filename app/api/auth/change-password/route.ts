import { z } from "zod";

import { dbConnect } from "@/src/lib/db/connect";
import { ApiError, toErrorPayload } from "@/src/lib/auth/api-errors";
import { NextResponse } from "next/server";
import { requireUser } from "@/src/lib/auth/server";
import { changePasswordSchema } from "@/src/lib/auth/schemas";
import { verifyPassword, hashPassword } from "@/src/lib/auth/password";

import { User } from "@/src/models/User";
import { RefreshSession } from "@/src/models/RefreshSession";

export async function POST(req: Request) {
  try {
    const user = await requireUser({ allowedRoles: ["admin", "editor"] });
    const body = await req.json().catch(() => undefined);
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      throw new ApiError({ code: "BAD_REQUEST", message: "Invalid request payload" });
    }

    const { currentPassword, newPassword } = parsed.data;
    await dbConnect();

    const userDoc = await User.findById(user.id).select("passwordHash").exec();
    if (!userDoc) {
      throw new ApiError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    const ok = await verifyPassword(currentPassword, userDoc.passwordHash);
    if (!ok) {
      throw new ApiError({ code: "INVALID_CREDENTIALS", message: "Invalid current password" });
    }

    const newHash = await hashPassword(newPassword);
    await User.updateOne({ _id: user.id }, { $set: { passwordHash: newHash } }).exec();

    await RefreshSession.updateMany(
      { userId: user.id, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } },
    ).exec();

    return NextResponse.json({ data: { ok: true } });
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
