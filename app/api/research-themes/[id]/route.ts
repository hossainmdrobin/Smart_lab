import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { ResearchTheme } from "@/src/models/ResearchTheme";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

const updateThemeSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(500).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const theme = await ResearchTheme.findById(id).lean().exec();
    if (!theme) {
      throw new ApiError({ code: "NOT_FOUND", message: "Research theme not found" });
    }
    return sendOk(theme);
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
    const data = updateThemeSchema.parse(body);

    const theme = await ResearchTheme.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!theme) {
      throw new ApiError({ code: "NOT_FOUND", message: "Research theme not found" });
    }
    return sendOk(theme);
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
    const theme = await ResearchTheme.findByIdAndDelete(id).lean().exec();
    if (!theme) {
      throw new ApiError({ code: "NOT_FOUND", message: "Research theme not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
