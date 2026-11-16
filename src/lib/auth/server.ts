import { cookies } from "next/headers";

import { dbConnect } from "@/src/lib/db/connect";
import { verifyAccessToken } from "@/src/lib/auth/jwt";
import { ApiError } from "@/src/lib/auth/api-errors";
import { SESSION_COOKIE_NAME } from "@/src/lib/auth/cookies";
import { User } from "@/src/models/User";
import type { UserRole } from "@/src/models/User";

export async function getUserFromSessionJwt(): Promise<{
  id: string;
  email: string;
  name: string;
  role: UserRole;
} | null> {
  const cookieStore = await cookies();
  const sessionJwt = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionJwt) return null;

  let payload: { sub: string; role: UserRole; email: string };
  try {
    payload = verifyAccessToken(sessionJwt);
  } catch {
    return null;
  }

  await dbConnect();
  const user = await User.findById(payload.sub)
    .select("email name role isActive")
    .lean()
    .exec();

  if (!user || !user.isActive) return null;

  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function requireUser(params?: {
  allowedRoles?: UserRole[];
}): Promise<{
  id: string;
  email: string;
  name: string;
  role: UserRole;
}> {
  const user = await getUserFromSessionJwt();
  if (!user) {
    throw new ApiError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  if (params?.allowedRoles && !params.allowedRoles.includes(user.role)) {
    throw new ApiError({ code: "FORBIDDEN", message: "Forbidden" });
  }

  return user;
}
