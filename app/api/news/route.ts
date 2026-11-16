import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { News } from "@/src/models/News";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";

const newsSchema = z.object({
  title: z.string().min(1).max(300),
  summary: z.string().min(1),
  content: z.string().optional(),
  publishedAt: z.string(),
  featured: z.boolean().optional(),
  image: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
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

    const newsList = await News.find(query)
      .populate("image")
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean()
      .exec();

    return sendOk(newsList);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const body = await req.json();
    const data = newsSchema.parse(body);

    const news = await News.create({
      ...data,
      publishedAt: new Date(data.publishedAt),
    });
    return sendOk(news, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
