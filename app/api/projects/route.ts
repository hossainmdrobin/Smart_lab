import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Project } from "@/src/models/Project";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";

const projectSchema = z.object({
  title: z.string().min(1).max(300),
  summary: z.string().min(1),
  researchTheme: z.array(z.string()).min(1),
  status: z.enum(["ongoing", "completed", "draft"]),
  team: z.array(z.string()).optional(),
  methods: z.string().optional(),
  relatedPublications: z.array(z.string()).optional(),
  codeUrl: z.string().url().optional().or(z.literal("")),
  datasetUrl: z.string().url().optional().or(z.literal("")),
  fundingAcknowledgment: z.string().optional(),
  image: z.string().optional().or(z.literal("")),
  featured: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const query: Record<string, unknown> = { isDeleted: { $ne: true } };
    if (status) query.status = status;
    if (featured === "true") query.featured = true;

    const projects = await Project.find(query)
      .populate("researchTheme team relatedPublications image")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return sendOk(projects);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const body = await req.json();
    const data = projectSchema.parse(body);

    const cleanData = {
      ...data,
      image: data.image === "" ? undefined : data.image,
    };

    const project = await Project.create(cleanData);
    return sendOk(project, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
