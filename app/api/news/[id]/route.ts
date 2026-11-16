import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { News } from "@/src/models/News";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

const updateNewsSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  summary: z.string().min(1).optional(),
  content: z.string().optional(),
  publishedAt: z.string().optional(),
  featured: z.boolean().optional(),
  image: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const news = await News.findById(id).populate("image").lean().exec();

    if (!news || news.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "News article not found" });
    }
    return sendOk(news);
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
    const data = updateNewsSchema.parse(body);

    const updatePayload: Record<string, unknown> = { ...data };
    if (data.publishedAt) {
      updatePayload.publishedAt = new Date(data.publishedAt);
    }

    const news = await News.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!news || news.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "News article not found" });
    }
    return sendOk(news);
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
    const news = await News.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    )
      .lean()
      .exec();

    if (!news) {
      throw new ApiError({ code: "NOT_FOUND", message: "News article not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
