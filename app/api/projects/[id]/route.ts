import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Project } from "@/src/models/Project";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

const updateProjectSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  summary: z.string().min(1).optional(),
  researchTheme: z.array(z.string()).min(1).optional(),
  status: z.enum(["ongoing", "completed", "draft"]).optional(),
  team: z.array(z.string()).optional(),
  methods: z.string().optional(),
  relatedPublications: z.array(z.string()).optional(),
  codeUrl: z.string().url().optional().or(z.literal("")),
  datasetUrl: z.string().url().optional().or(z.literal("")),
  fundingAcknowledgment: z.string().optional(),
  image: z.string().optional().or(z.literal("")),
  featured: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const project = await Project.findById(id)
      .populate("researchTheme team relatedPublications image")
      .lean()
      .exec();

    if (!project || project.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "Project not found" });
    }
    return sendOk(project);
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
    const data = updateProjectSchema.parse(body);

    const cleanData = {
      ...data,
      ...(data.image !== undefined ? { image: data.image === "" ? undefined : data.image } : {}),
    };

    const project = await Project.findByIdAndUpdate(id, cleanData, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!project || project.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "Project not found" });
    }
    return sendOk(project);
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
    const project = await Project.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    )
      .lean()
      .exec();

    if (!project) {
      throw new ApiError({ code: "NOT_FOUND", message: "Project not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
