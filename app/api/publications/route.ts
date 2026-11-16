import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Publication } from "@/src/models/Publication";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";

const publicationSchema = z.object({
  title: z.string().min(1).max(500),
  authors: z.array(z.string()).min(1),
  journal: z.string().min(1).max(200),
  year: z.number().int().min(1900),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  doi: z.string().optional().or(z.literal("")),
  publisherUrl: z.string().url().optional().or(z.literal("")),
  type: z.enum(["journal-article", "review", "preprint", "other"]),
  status: z.enum(["draft", "published", "archived"]),
  researchTags: z.array(z.string()).optional(),
  relatedPeople: z.array(z.string()).optional(),
  relatedProject: z.string().optional().or(z.literal("")),
  abstract: z.string().optional(),
  figure: z.string().optional().or(z.literal("")),
  repositoryUrl: z.string().url().optional().or(z.literal("")),
  datasetUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");

    const query: Record<string, unknown> = { isDeleted: { $ne: true } };
    if (status) query.status = status;
    if (type) query.type = type;
    if (featured === "true") query.featured = true;

    const pubs = await Publication.find(query)
      .populate("researchTags relatedPeople relatedProject figure")
      .sort({ year: -1, createdAt: -1 })
      .lean()
      .exec();

    return sendOk(pubs);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const body = await req.json();
    const data = publicationSchema.parse(body);
    const payload: Record<string, unknown> = {
      ...data,
      figure: data.figure === "" ? undefined : data.figure,
      relatedProject: data.relatedProject === "" ? undefined : data.relatedProject,
    };
    if (data.featured) {
      payload.featuredAt = new Date();
    }

    const pub = await Publication.create(payload);
    return sendOk(pub, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
