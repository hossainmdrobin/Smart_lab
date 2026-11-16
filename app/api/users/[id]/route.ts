import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { User } from "@/src/models/User";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";
import { hashPassword } from "@/src/lib/auth/password";

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  name: z.string().min(2).max(100).optional(),
  role: z.enum(["admin", "editor"]).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireUser({ allowedRoles: ["admin"] });
    await dbConnect();
    const { id } = await params;
    const user = await User.findById(id).select("-passwordHash").lean().exec();

    if (!user) {
      throw new ApiError({ code: "NOT_FOUND", message: "User not found" });
    }
    return sendOk(user);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireUser({ allowedRoles: ["admin"] });
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const data = updateUserSchema.parse(body);

    const updatePayload: Record<string, unknown> = { ...data };
    if (data.password) {
      updatePayload.passwordHash = await hashPassword(data.password);
      delete updatePayload.password;
    }

    const user = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    })
      .select("-passwordHash")
      .lean()
      .exec();

    if (!user) {
      throw new ApiError({ code: "NOT_FOUND", message: "User not found" });
    }
    return sendOk(user);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireUser({ allowedRoles: ["admin"] });
    await dbConnect();
    const { id } = await params;

    if (admin.id === id) {
      throw new ApiError({ code: "BAD_REQUEST", message: "Cannot delete your own admin account" });
    }

    const user = await User.findByIdAndDelete(id).lean().exec();
    if (!user) {
      throw new ApiError({ code: "NOT_FOUND", message: "User not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
