import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Media } from "@/src/models/Media";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";

const mediaSchema = z.object({
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().nonnegative(),
  url: z.string().url(),
  altText: z.string().max(250).optional(),
});

export async function GET() {
  try {
    await dbConnect();
    const mediaList = await Media.find().sort({ createdAt: -1 }).lean().exec();
    return sendOk(mediaList);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const body = await req.json();
    const data = mediaSchema.parse(body);

    const media = await Media.create({
      ...data,
      uploadedBy: user.id,
    });
    return sendOk(media, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
