import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Opportunity } from "@/src/models/Opportunity";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";

const opportunitySchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().min(1),
  eligibility: z.string().min(1),
  expectedSkills: z.string().optional(),
  location: z.string().min(1),
  applicationInstructions: z.string().min(1),
  deadline: z.string().optional().or(z.literal("")),
  status: z.enum(["open", "closed"]),
});

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: Record<string, unknown> = { isDeleted: { $ne: true } };
    if (status) query.status = status;

    const opps = await Opportunity.find(query).sort({ deadline: 1, createdAt: -1 }).lean().exec();
    return sendOk(opps);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const body = await req.json();
    const data = opportunitySchema.parse(body);

    const formattedData = {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };

    const opp = await Opportunity.create(formattedData);
    return sendOk(opp, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
