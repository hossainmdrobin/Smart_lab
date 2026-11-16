import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Opportunity } from "@/src/models/Opportunity";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

const updateOpportunitySchema = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().min(1).optional(),
  eligibility: z.string().min(1).optional(),
  expectedSkills: z.string().optional(),
  location: z.string().min(1).optional(),
  applicationInstructions: z.string().min(1).optional(),
  deadline: z.string().optional().or(z.literal("")),
  status: z.enum(["open", "closed"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const opp = await Opportunity.findById(id).lean().exec();

    if (!opp || opp.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "Opportunity not found" });
    }
    return sendOk(opp);
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
    const data = updateOpportunitySchema.parse(body);

    const updatePayload: Record<string, unknown> = { ...data };
    if (data.deadline !== undefined) {
      updatePayload.deadline = data.deadline ? new Date(data.deadline) : null;
    }

    const opp = await Opportunity.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!opp || opp.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "Opportunity not found" });
    }
    return sendOk(opp);
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
    const opp = await Opportunity.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    )
      .lean()
      .exec();

    if (!opp) {
      throw new ApiError({ code: "NOT_FOUND", message: "Opportunity not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
