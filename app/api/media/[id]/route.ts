import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Media } from "@/src/models/Media";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

const updateMediaSchema = z.object({
  altText: z.string().max(250).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const media = await Media.findById(id).lean().exec();

    if (!media) {
      throw new ApiError({ code: "NOT_FOUND", message: "Media not found" });
    }
    return sendOk(media);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const data = updateMediaSchema.parse(body);

    const media = await Media.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!media) {
      throw new ApiError({ code: "NOT_FOUND", message: "Media not found" });
    }
    return sendOk(media);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const { id } = await params;
    const media = await Media.findByIdAndDelete(id).lean().exec();

    if (!media) {
      throw new ApiError({ code: "NOT_FOUND", message: "Media not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
