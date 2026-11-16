import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { ContactInquiry } from "@/src/models/ContactInquiry";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

const updateContactSchema = z.object({
  isRead: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const data = updateContactSchema.parse(body);

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      id,
      { ...data },
      { new: true, runValidators: true }
    )
      .lean()
      .exec();

    if (!inquiry) {
      throw new ApiError({ code: "NOT_FOUND", message: "Contact inquiry not found" });
    }
    return sendOk(inquiry);
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
    const inquiry = await ContactInquiry.findByIdAndDelete(id).lean().exec();

    if (!inquiry) {
      throw new ApiError({ code: "NOT_FOUND", message: "Contact inquiry not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
