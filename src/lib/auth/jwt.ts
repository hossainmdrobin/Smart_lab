import jwt from "jsonwebtoken";

import { authConfig } from "@/src/lib/auth/config";
import type { UserRole } from "@/src/models/User";

export interface SessionJwtPayload {
  sub: string;
  role: UserRole;
  email: string;
  exp?: number;
  iat?: number;
}

function assertSecrets() {
  if (!authConfig.accessSecret) {
    throw new Error("Missing AUTH_ACCESS_TOKEN_SECRET (or AUTH_JWT_SECRET)");
  }
  if (!authConfig.refreshSecret) {
    throw new Error("Missing AUTH_REFRESH_TOKEN_SECRET (or AUTH_JWT_SECRET)");
  }
}

export function signAccessToken(payload: {
  userId: string;
  role: UserRole;
  email: string;
}): string {
  assertSecrets();
  return jwt.sign(
    { sub: payload.userId, role: payload.role, email: payload.email },
    authConfig.accessSecret!,
    { expiresIn: authConfig.accessTtlSeconds },
  );
}

export function verifyAccessToken(token: string): SessionJwtPayload {
  assertSecrets();
  const decoded = jwt.verify(token, authConfig.accessSecret!);
  if (typeof decoded !== "object" || !decoded) {
    throw new Error("Invalid session token");
  }

  const { sub, role, email } = decoded as Partial<SessionJwtPayload>;
  if (!sub || !role || !email) {
    throw new Error("Invalid session token payload");
  }

  return decoded as SessionJwtPayload;
}
