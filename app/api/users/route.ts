import { NextRequest } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/src/lib/db/connect";
import { User } from "@/src/models/User";
import { requireUser } from "@/src/lib/auth/server";
import { handleApiError, sendOk } from "@/src/lib/api/handler";
import { hashPassword } from "@/src/lib/auth/password";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  role: z.enum(["admin", "editor"]),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireUser({ allowedRoles: ["admin"] });
    await dbConnect();
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean().exec();
    return sendOk(users);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUser({ allowedRoles: ["admin"] });
    await dbConnect();
    const body = await req.json();
    const data = createUserSchema.parse(body);

    const passwordHash = await hashPassword(data.password);
    const user = await User.create({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      isActive: data.isActive ?? true,
    });

    const userObj = user.toObject();
    delete (userObj as { passwordHash?: string }).passwordHash;
    return sendOk(userObj, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
