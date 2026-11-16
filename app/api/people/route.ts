import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { Person } from "@/src/models/Person";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";

const personSchema = z.object({
  fullName: z.string().min(1).max(120),
  role: z.enum([
    "leadership",
    "research-associate",
    "research-assistant",
    "student-trainee",
    "collaborator",
    "alumni",
  ]),
  status: z.enum(["current", "alumni"]),
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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const query: Record<string, unknown> = { isDeleted: { $ne: true } };
    if (role) query.role = role;
    if (status) query.status = status;

    const people = await Person.find(query)
      .populate("researchInterests photo cv selectedPublications")
      .sort({ order: 1, fullName: 1 })
      .lean()
      .exec();

    return sendOk(people);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser({ allowedRoles: ["admin", "editor"] });
    await dbConnect();
    const body = await req.json();
    const data = personSchema.parse(body);

    const person = await Person.create(data);
    return sendOk(person, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
