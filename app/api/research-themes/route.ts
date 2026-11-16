import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { ResearchTheme } from "@/src/models/ResearchTheme";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";

const createThemeSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");

    const query: Record<string, unknown> = {};
    if (featured === "true") query.featured = true;

    const themes = await ResearchTheme.find(query).sort({ order: 1, name: 1 }).lean().exec();
    return sendOk(themes);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const body = await req.json();
    const data = createThemeSchema.parse(body);

    const theme = await ResearchTheme.create(data);
    return sendOk(theme, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
