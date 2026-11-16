import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Person } from "@/src/models/Person";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { ApiError } from "@/src/lib/auth/api-errors";

const updatePersonSchema = z.object({
  fullName: z.string().min(1).max(120).optional(),
  role: z.enum([
    "principal-investigator",
    "senior-research-associate",
    "research-associate",
    "research-assistant",
    "student-trainee",
    "collaborator",
    "alumni",
  ]).optional(),
  status: z.enum(["current", "alumni"]).optional(),
  bio: z.string().max(2000).optional(),
  researchInterests: z.array(z.string()).optional(),
  education: z.string().max(300).optional(),
  email: z.string().email().optional().or(z.literal("")),
  orcid: z.string().max(100).optional().or(z.literal("")),
  googleScholar: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  personalWebsite: z.string().url().optional().or(z.literal("")),
  photo: z.string().optional().or(z.literal("")),
  cv: z.string().optional().or(z.literal("")),
  selectedPublications: z.array(z.string()).optional(),
  order: z.number().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const person = await Person.findById(id)
      .populate("researchInterests photo cv selectedPublications")
      .lean()
      .exec();

    if (!person || person.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "Person not found" });
    }
    return sendOk(person);
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
    const data = updatePersonSchema.parse(body);

    const cleanData = {
      ...data,
      ...(data.photo !== undefined ? { photo: data.photo === "" ? undefined : data.photo } : {}),
      ...(data.cv !== undefined ? { cv: data.cv === "" ? undefined : data.cv } : {}),
    };

    const person = await Person.findByIdAndUpdate(id, cleanData, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!person || person.isDeleted) {
      throw new ApiError({ code: "NOT_FOUND", message: "Person not found" });
    }
    return sendOk(person);
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
    const person = await Person.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    )
      .lean()
      .exec();

    if (!person) {
      throw new ApiError({ code: "NOT_FOUND", message: "Person not found" });
    }
    return sendOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
