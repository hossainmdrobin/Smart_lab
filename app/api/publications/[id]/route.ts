import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Publication } from "@/src/models/Publication";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

const updatePublicationSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  authors: z.array(z.string()).min(1).optional(),
  journal: z.string().min(1).max(200).optional(),
  year: z.number().int().min(1900).optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  doi: z.string().optional().or(z.literal("")),
  publisherUrl: z.string().url().optional().or(z.literal("")),
  type: z.enum(["journal-article", "review", "preprint", "other"]).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  researchTags: z.array(z.string()).optional(),
  relatedPeople: z.array(z.string()).optional(),
  relatedProject: z.string().optional().or(z.literal("")),
  abstract: z.string().optional(),
  figure: z.string().optional().or(z.literal("")),
  repositoryUrl: z.string().url().optional().or(z.literal("")),
  datasetUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const pub = await Publication.findById(id)
      .populate("researchTags relatedPeople relatedProject figure")
      .lean()
      .exec();

    if (!pub || pub.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "Publication not found" });
    }
    return sendOk(pub);
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
    const data = updatePublicationSchema.parse(body);

    const updatePayload: Record<string, unknown> = { ...data };
    if (data.featured === true) {
      updatePayload.featuredAt = new Date();
    } else if (data.featured === false) {
      updatePayload.featuredAt = null;
    }

    const pub = await Publication.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!pub || pub.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "Publication not found" });
    }
    return sendOk(pub);
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
    const pub = await Publication.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    )
      .lean()
      .exec();

    if (!pub) {
      throw new ApiError({ code: "NOT_FOUND", message: "Publication not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
