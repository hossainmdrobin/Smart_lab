import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Setting } from "@/src/models/Setting";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
  type: z.enum(["string", "boolean", "number"]),
});

export async function GET() {
  try {
    await dbConnect();
    const settings = await Setting.find().lean().exec();
    const settingsMap: Record<string, unknown> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return sendOk({ settings: settingsMap, raw: settings });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser({ allowedRoles: ["admin"] });
    await dbConnect();
    const body = await req.json();
    const data = settingSchema.parse(body);

    const setting = await Setting.findOneAndUpdate(
      { key: data.key },
      { value: data.value, type: data.type, updatedBy: user.id },
      { new: true, upsert: true, runValidators: true }
    )
      .lean()
      .exec();

    return sendOk(setting);
  } catch (err) {
    return handleApiError(err);
  }
}
